<?php
require_once dirname(__FILE__) . '/../../bootstrap.php';

Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));
echo "Begin at MELB TIME: " . UDate::now(UDate::TIME_ZONE_MELB) . "\n";

if(isset($argv) && isset($argv[1]) && Product::get($argv[1]) instanceof Product)
	$productIds = Dao::getResultsNative('select distinct p.id from product p where p.id = ?', array($argv[1]), PDO::FETCH_ASSOC);
else $productIds = Dao::getResultsNative('select distinct p.id from product p inner join productpricematchrule r on (r.productId = p.id and r.active = 1) where p.active = 1 order by p.id', array(), PDO::FETCH_ASSOC);
	
$rows = count($productIds);
echo "--- Got ($rows) products having price matching rules ! \n";
$count = 0;
$changedProducts = array();
foreach ($productIds as $row)
{
	try {
		$count++;
		$left = $rows - $count;
		echo "+++ Getting price No.$count,  $left products left to be done.  \n";
		$output = '';
		$timeout = 60; // in seconds
		$cmd = 'php ' . dirname(__FILE__). '/pricematch.php ' . $row['id'];
		$output = ExecWaitTimeout($cmd, $timeout);
		// 	exec($cmd, $output);
		echo print_r($output, true) . "\n";
		
		$pos = stripos($output, 'update price from old price');
		
		if ($pos !== false){
			$newPos = stripos($output, 'new price=');
			$myPos = stripos($output, ', my price=');
			$newPrice = substr($output, $newPos + 11, $myPos - ($newPos + 11));
			
			$pos1 = strpos($output, 'to new price');
			$oldPrice = substr($output, $pos + 30, $pos1 - ($pos + 31));
			
			$product = Product::get($row['id']);
			$sku = $product->getSku();
			$name = $product->getName();
			$rule = ProductPriceMatchRule::getByProduct($product);
			$company = $rule->getCompany()->getCompanyName();
			
			// email price changed products
			if ($oldPrice != $newPrice){
				$changedProducts[] = array(
						'SKU' 			 => $sku,
						'Product Name'	 => $name,
						'New Price' 	 => $newPrice,
						'Match Company'  => $company,
						'Old Price'		 => $oldPrice,
				);
				
			}
			
		}
		// randomly wait for between 1 and 5 seconds
		sleep(rand(1, 5));
	} catch (Exception $e)
	{
		echo $e->getMessage() . "\n";
	}
}
try{
	$phpexcel = new PHPExcel();
	$activeSheet = $phpexcel->setActiveSheetIndex(0);
	if(count($changedProducts) === 0)
	{
		$activeSheet->setCellValue('A1', 'Nothing to export!');
		return $phpexcel;
	}
	$letter = 'A';
	$number = 1; // excel start at 1 NOT 0
	// header row
	foreach($changedProducts as $row)
	{
		foreach($row as $key => $value)
		{
			$activeSheet->setCellValue($letter++ . $number, $key);
		}
		$number++;
		$letter = 'A';
		break; // only need the header
	}
	foreach($changedProducts as $row)
	{
		foreach($row as $col)
		{
			$activeSheet->setCellValue($letter++ . $number, $col);
		}
		$number++;
		$letter = 'A';
	}
	
	if(!$phpexcel instanceof PHPExcel)
		throw new Exception('System Error: can NOT generate CSV without PHPExcel object!');
	// Set document properties
	$objWriter = PHPExcel_IOFactory::createWriter($phpexcel, 'CSV')->setDelimiter(',')
	->setEnclosure('"')
	->setLineEnding("\r\n")
	->setSheetIndex(0);
	ob_start();
	$objWriter->save('php://output');
	$excelOutput = ob_get_clean();
	
	$asset = Asset::registerAsset(_getAttachedFileName(), $excelOutput, Asset::TYPE_TMP);
	
	mailOut($asset);
		
}catch (Exception $ex) {
	echo $ex->getMessage();
	die('ERROR!');
}

echo "End at MELB TIME: " . UDate::now(UDate::TIME_ZONE_MELB) . "\n";

/**
 * Execute a command and kill it if the timeout limit fired to prevent long php execution
 *
 * @see http://stackoverflow.com/questions/2603912/php-set-timeout-for-script-with-system-call-set-time-limit-not-working
 *
 * @param string $cmd Command to exec (you should use 2>&1 at the end to pipe all output)
 * @param integer $timeout
 * @return string Returns command output
 */
function ExecWaitTimeout($cmd, $timeout=5) {
	
	echo $cmd . "\n";
	
	$descriptorspec = array(
			0 => array("pipe", "r"),
			1 => array("pipe", "w"),
			2 => array("pipe", "w")
	);
	$pipes = array();
	
	$timeout += time();
	$process = proc_open($cmd, $descriptorspec, $pipes);
	if (!is_resource($process)) {
		throw new Exception("proc_open failed on: " . $cmd);
	}
	
	$output = '';
	
	do {
		$timeleft = $timeout - time();
		$read = array($pipes[1]);
		//     if($timeleft > 0)
		$write = NULL;
		$exeptions = NULL;
		stream_select($read, $write, $exeptions, $timeleft, NULL);
		
		if (!empty($read)) {
			$output .= fread($pipes[1], 8192);
		}
	} while (!feof($pipes[1]) && $timeleft > 0);
	
	if ($timeleft <= 0) {
		proc_terminate($process);
		throw new Exception("command timeout on: " . $cmd);
	} else {
		return $output;
	}
}

/**
 * Mailing the file out to someone
 *
 * @param unknown $filePath
 */
function mailOut(Asset $asset = null)
{
	$assets = array();
	if($asset instanceof Asset)
		$assets[] = $asset;
		// 			$helinEmail = 'helin16@gmail.com';
		$purchasingEmail = 'purchasing@budgetpc.com.au';
		// 					$heathertonEmail = 'philip.x@budgetpc.com.au';
		// 			EmailSender::addEmail('', $helinEmail, $class::_getMailTitle(), $class::_getMailBody(), $assets);
		EmailSender::addEmail('', $purchasingEmail, _getMailTitle(), _getMailBody(), $assets);
		// 		EmailSender::addEmail('', $heathertonEmail, _getMailTitle(), _getMailBody(), $assets);
		
}
function _getMailTitle()
{
	return Core::getUser()->getStore()->getName() . ' : Daily Price Match Report';
}
function _getMailBody()
{
	return 'Please find the attached export from BudgetPC internal system for price changed products.';
}
function _getAttachedFileName()
{
	$now = new UDate();
	$now->setTimeZone('Australia/Melbourne');
	return 'Price Match Report' . $now->format('Y_m_d') . '.csv';
}