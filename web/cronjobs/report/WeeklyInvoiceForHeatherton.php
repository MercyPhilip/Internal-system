<?php
require_once dirname(__FILE__) . '/class/ExportAbstract.php';
class WeeklyInvoiceForHeatherton extends ExportAbstract
{
	private static $_rootDir = '/tmp/export';
	public static function run($debug = false, $mailOut = true)
	{
		try{
			self::$_debug = $debug;
			if($debug)
				echo '<pre>';
				$objPHPExcel = self::_getOutput();
				if(!$objPHPExcel instanceof PHPExcel)
					throw new Exception('System Error: can NOT generate CSV without PHPExcel object!');
					// Set document properties
					$filePath = self::$_rootDir . '/' . md5(new UDate()) . '.csv';
					$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'CSV')->setDelimiter(',')
					->setEnclosure('"')
					->setLineEnding("\r\n")
					->setSheetIndex(0);
					ob_start();
					$objWriter->save('php://output');
					$excelOutput = ob_get_clean();
					$class = get_called_class();

					$asset = Asset::registerAsset($class::_getAttachedFileName(), $excelOutput, Asset::TYPE_TMP);
					if($mailOut === true)
						$class::_mailOut($asset);
						return $asset;
		} catch (Exception $ex) {
			echo $ex->getMessage();
			die('ERROR!');
		}
	}

	protected static function _getData()
	{
		if(count(self::$_dateRange) === 0) {
			$weekAgoLocal = new UDate('now', 'Australia/Melbourne');
			$weekAgoLocal->modify('-7 day');
			$fromDate = new UDate($weekAgoLocal->format('Y-m-d') . ' 00:00:00', 'Australia/Melbourne');
			$fromDate->setTimeZone('UTC');
		} else {
			$fromDate = self::$_dateRange['start'];
		}

		$orders = Order::getAllByCriteria('storeId = 1 and type = "INVOICE" and customerId = ? and invDate >= ?', array(10366, $fromDate));

		$now = new UDate();
		$now->setTimeZone('Australia/Melbourne');
		$formatArray = array();
		foreach($orders as $order)
		{ 
			$creditNotes = CreditNote::getAllByCriteria('orderId = ?', array($order->getId()));
			if(count($creditNotes) == 0){
				$creditNoteNo = '';
				$creditNoteAmount = '0.0000';
			} else {
				$creditNoteNo = $creditNotes[0]->getCreditNoteNo();
				$creditNoteAmount = StringUtilsAbstract::getCurrency($creditNotes[0]->getTotalValue());
			}
			$shippments = $order->getShippments();
			if(count($shippments) == 0){
				$shippedDate = '';
			} else {
				if(is_string($shippments[0]->getShippingDate()))
					$shippedDate = new UDate($shippments[0]->getShippingDate());
					$shippedDate = $shippedDate->setTimeZone('Australia/Melbourne')->__toString();
			}
			$status = $order->getStatus();
			$return[] = array(
					'Invoice No.' 	 => $order->getInvNo(),
					'Invoice Date'	 => $order->getInvDate()->setTimeZone('Australia/Melbourne')->__toString(),
					'Order No.' 	 => $order->getOrderNo(),
					'Shipped Date'   => $shippedDate,
					'PO No.'		 => $order->getPONo(),
					'Customer Name'  => 'GU GROUP PTY LTD',
					'Status'		 => $status->getName(),
					'Total Amount'	 => StringUtilsAbstract::getCurrency($order->getTotalAmount()),
					'Total Paid'	 => StringUtilsAbstract::getCurrency($order->getTotalPaid()),
					'Total Credited' => StringUtilsAbstract::getCurrency($order->getTotalCreditNoteValue()),
					'Total Due'		 => StringUtilsAbstract::getCurrency($order->getTotalDue()),
					'Credit Note No.' => $creditNoteNo,
					'Credit Note Total Amount' => $creditNoteAmount
			);
		}
		return $return;
	}
	protected static function _getMailTitle()
	{
		return Core::getUser()->getStore()->getName() . ' : Weekly Invoices for Heatherton Store';
	}
	protected static function _getMailBody()
	{
		return 'Please find the attached export from BudgetPC internal system for all the invoices for last week.';
	}
	protected static function _getAttachedFileName()
	{
		$now = new UDate();
		$now->setTimeZone('Australia/Melbourne');
		return 'Heatherton_invoice' . $now->format('Y_m_d') . '.csv';
	}
	/**
	 * Mailing the file out to someone
	 *
	 * @param unknown $filePath
	 */
	protected static function _mailOut(Asset $asset = null)
	{
		$assets = array();
		if($asset instanceof Asset)
			$assets[] = $asset;
			$class = get_called_class();
			// 			$helinEmail = 'helin16@gmail.com';
			$accountEmail = 'aiden.l@budgetpc.com.au';
			$heathertonEmail = 'sales.heatherton@budgetpc.com.au';
// 			$heathertonEmail = 'philip.x@budgetpc.com.au';
			// 			EmailSender::addEmail('', $helinEmail, $class::_getMailTitle(), $class::_getMailBody(), $assets);
			EmailSender::addEmail('', $accountEmail, $class::_getMailTitle(), $class::_getMailBody(), $assets);
			EmailSender::addEmail('', $heathertonEmail, $class::_getMailTitle(), $class::_getMailBody(), $assets);

	}
}
// for store1
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT_STORE1));

WeeklyInvoiceForHeatherton::run(true);