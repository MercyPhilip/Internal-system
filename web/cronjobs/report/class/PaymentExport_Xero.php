<?php
class PaymentExport_Xero extends ExportAbstract
{
	protected static function _getData()
	{
		if(count(self::$_dateRange) === 0) {
			$yesterdayLocal = new UDate('now', 'Australia/Melbourne');
			$yesterdayLocal->modify('-1 day');
			$fromDate = new UDate($yesterdayLocal->format('Y-m-d') . ' 00:00:00', 'Australia/Melbourne');
			$fromDate->setTimeZone('UTC');
			$toDate = new UDate($yesterdayLocal->format('Y-m-d') . ' 23:59:59', 'Australia/Melbourne');
			$toDate->setTimeZone('UTC');
	    } else {
			$fromDate = self::$_dateRange['start'];
			$toDate = self::$_dateRange['end'];
		}
		$dataType = 'created';
		$items = Payment::getAllByCriteria($dataType . ' >= :fromDate and ' . $dataType . ' < :toDate and storeId = :storeId', array('fromDate' => trim($fromDate), 'toDate' => trim($toDate), 'storeId' => Core::getUser()->getStore()->getId()));
		$now = new UDate();
		$now->setTimeZone('Australia/Melbourne');
		$return = array();
		foreach($items as $item)
		{
			$return[] = array(
					'Type' => $item->getOrder() instanceof Order ? 'Payment' : 'Credit'
					,'InvNo' => $item->getOrder() instanceof Order ? (trim($item->getOrder()->getInvNo()) === '' ? '' : $item->getOrder()->getInvNo()) : ''
					,'Payment Date' => $item->getPaymentDate()->setTimeZone('Australia/Melbourne')->format('Y-m-d')
					,'Customer Name' => $item->getOrder() instanceof Order ? ($item->getOrder()->getCustomer() instanceof Customer ? $item->getOrder()->getCustomer()->getName() : '') : ''
					,'Order No.' => $item->getOrder() instanceof Order  ? $item->getOrder()->getOrderNo() : ''
					,'CreditNote No' => $item->getCreditNote() instanceof CreditNote ? $item->getCreditNote()->getCreditNoteNo() : ''
					,'Processed Date'=> trim($item->getCreated()->setTimeZone('Australia/Melbourne'))
					,'Processed By' => $item->getCreatedBy() instanceof UserAccount ? $item->getCreatedBy()->getPerson()->getFullName() : ''
					,'Method'=> ($item->getMethod() instanceof PaymentMethod ? trim($item->getMethod()->getName()) : '')
					,'Amount'=> StringUtilsAbstract::getCurrency($item->getCreditNote() instanceof CreditNote ? (0 - $item->getValue()) : $item->getValue())
					, 'Comments' => trim(implode(',', array_map(create_function('$a', 'return $a->getComments();'), Comments::getAllByCriteria('entityName = ? and entityId = ? and storeId = ?', array(get_class($item), $item->getId(), Core::getUser()->getStore()->getId())))) )
			);
		}
		return $return;
	}
	protected static function _getMailTitle()
	{
		return Core::getUser()->getStore()->getName() . ' : Payments Export for Xero from last day';
	}
	protected static function _getMailBody()
	{
		return 'Please find the attached export from BudgetPC internal system for all the Payments from last day to import to xero.';
	}
	protected static function _getAttachedFileName()
	{
		$now = new UDate();
		$now->setTimeZone('Australia/Melbourne');
		return 'Payments_' . $now->format('Y_m_d_H_i_s') . '.csv';
	}
}