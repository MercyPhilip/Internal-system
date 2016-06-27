<?php
/**
 * SalesReverseExport_Xero
 * Export cancelled invoices
 * Export invoices with status of (New, OnHold, ETA, StockChecked and Insufficient Stock)
 * In order to reverse these invoices which are imported into Xero
 * @author 
 *
 */
class SalesReverseExport_Xero extends SalesExport_Xero
{
	/**get related data
	 * 
	 * @return array
	 */
	protected static function _getData()
	{
		if (count(self::$_statusIds) === 0)
		{
			if(parent::$_debug)
					echo "No valid statu Ids passed in!\n";
			return array();
		}
		else
		{
			// export until the last day of the last month
			$yesterdayLocal = new UDate('now', 'Australia/Melbourne');
			$yesterdayLocal->modify('-1 day');
			$toDate = new UDate($yesterdayLocal->format('Y-m-t') . ' 23:59:59', 'Australia/Melbourne');
			$toDate->setTimeZone('UTC');
			$wheres[] = 'invDate < :toDate';
			$params['toDate'] = trim($toDate);
			$ps = array();
			$keys = array();
			$statusIds = self::$_statusIds;
			foreach ($statusIds as $index => $value) {
				$key = 'stId_' . $index;
				$keys[] = ':' . $key;
				$ps[$key] = trim($value);
			}
			$wheres[] = 'statusId in (' . implode(',', $keys) . ')';
			$params = array_merge($params, $ps);
		}
		$wheres[] = 'type = :type';
		$params['type'] = Order::TYPE_INVOICE;
		$orders = Order::getAllByCriteria(implode(' and ', $wheres), $params);
		$return = array();
		foreach($orders as $order)
		{
			//common fields
			$customer = $order->getCustomer();
			$row = array(
				'ContactName' => $customer->getName()
				,'EmailAddress'=> $customer->getEmail()
				,'POAddressLine1'=> ''
				,'POAddressLine2'=> ''
				,'POAddressLine3'=> ''
				,'POAddressLine4'=> ''
				,'POCity'=> ''
				,'PORegion'=> ''
				,'POPostalCode'=> ''
				,'POCountry'=> ''
				,'InvoiceNumber' => $order->getInvNo()
				,'Reference'=> (intval($order->getIsFromB2B()) === 1 ? $order->getOrderNo() :  $order->getPONo()) //changed for XiXi, she need the customer PO for any instore orders
				,'InvoiceDate' => $order->getInvDate()->setTimeZone('Australia/Melbourne')->__toString()
				,'DueDate' => $order->getInvDate()->modify('+' . $customer->getTerms() . ' day')->setTimeZone('Australia/Melbourne')->__toString()
			);
			foreach($order->getOrderItems() as $orderItem)
			{
				$product = $orderItem->getProduct();
				if(!$product instanceof Product)
					continue;
				$shouldTotal = $orderItem->getUnitPrice() * $orderItem->getQtyOrdered();
				$return[] = array_merge($row, array(
					'InventoryItemCode' => $product->getSku()
					,'Description'=> $product->getShortDescription()
					,'Quantity'=> $orderItem->getQtyOrdered()
					,'UnitAmount'=> $orderItem->getUnitPrice()
					,'Discount'=> (floatval($shouldTotal) === 0.0000 ? 0 : round((($shouldTotal - $orderItem->getTotalPrice()) * 100 / $shouldTotal), 2) ) . '%'
					,'AccountCode'=> $product->getRevenueAccNo()
					,'TaxType'=> "GST on Income"
					,'TrackingName1'=> ''
					,'TrackingOption1'=> ''
					,'TrackingName2'=> ''
					,'TrackingOption2'=> ''
					,'Currency'=> ''
					,'BrandingTheme'=> ''
				));
			}

			if(($shippingMethod = trim(implode(',', $order->getInfo(OrderInfoType::ID_MAGE_ORDER_SHIPPING_METHOD)))) !== '') {
				$shippingCost = $order->getInfo(OrderInfoType::ID_MAGE_ORDER_SHIPPING_COST);
				$return[] = array_merge($row, array(
					'InventoryItemCode' => $shippingMethod
					,'Description'=> $shippingMethod
					,'Quantity'=> 1
					,'UnitAmount'=> StringUtilsAbstract::getCurrency( count($shippingCost) > 0 ? StringUtilsAbstract::getValueFromCurrency($shippingCost[0]) : 0)
					,'Discount'=> ''
					,'AccountCode'=> '43300'
					,'TaxType'=> "GST on Income"
					,'TrackingName1'=> ''
					,'TrackingOption1'=> ''
					,'TrackingName2'=> ''
					,'TrackingOption2'=> ''
					,'Currency'=> ''
					,'BrandingTheme'=> ''
				));
			}
		}
		return $return;
	}
	/**
	 * get Email Title
	 * 
	 * @return string
	 */
	protected static function _getMailTitle()
	{
		if (count(self::$_statusIds) == 1)
			return 'Reverse Sales Export for Xero (Cancelled)';
		else
			return 'Reverse Sales Export for Xero (Except Cancelled, Shipped and Picked) ';
	}
	/**
	 * get Mail Body
	 * 
	 * @return string
	 */
	protected static function _getMailBody()
	{
		return 'Please find the attached export from BudgetPC internal system for all the Reverse sales from last day of last month to import to xero.';
	}
	/**
	 * get Attached file name
	 * 
	 * @return string
	 */
	protected static function _getAttachedFileName()
	{
		$now = new UDate();
		$now->setTimeZone('Australia/Melbourne');
		if (count(self::$_statusIds) == 1)
			return 'reverse_sales_xero_cancelled' . $now->format('Y_m_d_H_i_s') . '.csv';
		else
			return 'reverse_sales_xero_' . $now->format('Y_m_d_H_i_s') . '.csv';
	}
}