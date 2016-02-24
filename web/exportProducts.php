<?php
require_once dirname(__FILE__) . '/bootstrap.php';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));
class ItemExport_Xero_Custom extends ItemExport_Xero
{
	protected static function _getData()
	{
		$toDate = "2015-12-06 04:00:00";
		$return = array();
		$myobCodeType = ProductCodeType::get(ProductCodeType::ID_MYOB);
		foreach(Product::getAllByCriteria('updated <= ?', array(trim($toDate)), false) as $product)
		{
			$logs = ProductQtyLog::getAllByCriteria('productId = ? and created <= ?', array($product->getId(), trim($toDate)), true, 1, 1, array('id' => 'desc'));
			$log = count($logs) > 0 ? $logs[0] : null;
			$myobCodes = ProductCode::getCodes($product, $myobCodeType, true, 1, 1);
			$return[] = array(
					'sku' => $product->getSku()
					,'name' => $product->getName()
					,'short description'=> $product->getShortDescription()
					,'category'=> join(', ', array_map(create_function('$a', 'return $a->getCategory()->getName();'), $product->getCategories()))
					,'assetAccNo'=> $product->getAssetAccNo()
					,'revenueAccNo'=> $product->getRevenueAccNo()
					,'costAccNo'=> $product->getCostAccNo()
					,'Stock On PO' => $log instanceof ProductQtyLog ? $log->getStockOnPO() : $product->getStockOnPO()
					,'Stock On Order' =>  $log instanceof ProductQtyLog ? $log->getStockOnOrder() : $product->getStockOnOrder()
					,'Stock On Hand' => $log instanceof ProductQtyLog ? $log->getStockOnHand() : $product->getStockOnHand()
					,'Total On Hand Value' => $log instanceof ProductQtyLog ? $log->getTotalOnHandValue() : $product->getTotalOnHandValue()
					,'Stock In Parts' =>  $log instanceof ProductQtyLog ? $log->getStockInParts() : $product->getStockInParts()
					,'Total In Parts Value' => $log instanceof ProductQtyLog ? $log->getTotalInPartsValue() : $product->getTotalInPartsValue()
					,'Stock In RMA' => $log instanceof ProductQtyLog ? $log->getStockInRMA() : $product->getStockInRMA()
					,'Total RMA Value' => $log instanceof ProductQtyLog ? $log->getTotalRMAValue() : $product->getTotalRMAValue()
					,'active' => intval($product->getActive()) === 1 ? 'Y' : 'N'
					,'MYOB' => count($myobCodes) > 0 ? $myobCodes[0]->getCode() : ''
					,'updated' => trim($product->getUpdated())
					,'created' => trim($product->getCreated())
					,'sellOnWeb' => trim($product->getSellOnWeb())
			);
		}
		return $return;
	}
	protected static function _getMailTitle()
	{
		return 'Item List Export on ' . trim(new UDate());
	}
	protected static function _getMailBody()
	{
		return 'Item List Export on ' . trim(new UDate());
	}
	protected static function _getAttachedFileName()
	{
		$now = new UDate();
		$now->setTimeZone('Australia/Melbourne');
		return 'item_list_' . $now->format('Y_m_d_H_i_s') . '.csv';
	}
}
ItemExport_Xero_Custom::run(false, true);