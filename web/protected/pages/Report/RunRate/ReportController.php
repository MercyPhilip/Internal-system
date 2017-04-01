<?php
/**
 * This is the listing page for customer
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class ReportController extends BPCPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'report.runrate';
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
		if(!AccessControl::canAccessProductsPage(Core::getRole()))
			die('You do NOT have access to this page');
	}
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .= "pageJs.init()";
		$js .= ".setHTMLID('resultDiv', 'result-div')";
		$js .= ".setCallbackId('genReportmBtn', '" . $this->genReportmBtn->getUniqueID() . "')";
		return $js;
	}

	private function _getParams($param, $key) {
	    if(!isset($param[$key]))
	        return array();
	    if(($string = trim($param[$key])) === '')
	        return array();
	    return explode(',', $string);
	}
	/**
	 * Getting the items
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function genReport($sender, $param)
	{
        $results = $errors = array();
        try
        {
            $searchParams = json_decode(json_encode($param->CallbackParameter), true);
            $wheres = $joins = $params =array();
            if(isset($searchParams['pro.name']) && ($name = trim($searchParams['pro.name'])) !== '') {
                $wheres[] = 'pro.name like :name';
                $params['name'] = '%' . $name . '%';
            }
            if(isset($searchParams['pro.active']) && ($active = trim($searchParams['pro.active'])) !== '') {
                $wheres[] = 'pro.active = :active';
                $params['active'] = $active;
            }
            $productIds = $this->_getParams($searchParams, 'pro.id');
            if(count($productIds) > 0) {
                $array = array();
                foreach($productIds as $index => $productId) {
                    $key = 'product_' . $index;
                    $array[] = ':' . $key;
                    $params[$key] = $productId;
                }
                $wheres[] = 'pro.id in (' . implode(',', $array) . ')';
            }
            $manufacturerIds = $this->_getParams($searchParams, 'pro.manufacturerIds');
            if(count($manufacturerIds) > 0) {
                $array = array();
                foreach($manufacturerIds as $index => $manufacturerId) {
                    $key = 'brand_' . $index;
                    $array[] = ':' . $key;
                    $params[$key] = $manufacturerId;
                }
                $wheres[] = 'pro.manufacturerId in (' . implode(',', $array) . ')';
            }
            $supplierIds = $this->_getParams($searchParams, 'pro.supplierIds');
            if(count($supplierIds) > 0) {
                $array = array();
                foreach($supplierIds as $index => $supplierId) {
                    $key = 'supplier_' . $index;
                    $array[] = ':' . $key;
                    $params[$key] = $supplierId;
                }
                $joins[] = 'inner join suppliercode sup_code on (sup_code.productId = pro.id and sup_code.active = 1 and sup_code.supplierId in (' . implode(',', $array) . '))';
            }
            $productCategoryIds = $this->_getParams($searchParams, 'pro.productCategoryIds');
            if(count($productCategoryIds) > 0) {
                $array = array();
                foreach($productCategoryIds as $index => $productCategoryId) {
                    $key = 'productCategory_' . $index;
                    $array[] = ':' . $key;
                    $params[$key] = $productCategoryId;
                }
                $joins[] = 'inner join product_category x on (x.productId = pro.id and x.active = 1 and x.categoryId in (' . implode(',', $array) . '))';
            }
            $joins[] = 'inner join productprice pp on (pp.productId = pro.id and pp.active = 1 and pp.typeId = 1)';
            $joins[] = 'inner join productstockinfo prosinfo on (pro.id = prosinfo.productId and prosinfo.active = 1 and prosinfo.storeId = :storeId)';
            $params['storeId'] = Core::getUser()->getStore()->getId();
            $sql = 'select pro.id `proId`, pro.sku `proSku`, pro.name `proName`, pro.manufacturerId `proBrand`, prosinfo.stockOnHand, 
            		prosinfo.totalOnHandValue, pp.price from product pro ' . implode(' ', $joins) . (count($wheres) > 0 ? (' where ' . implode(' AND ', $wheres)) : '');
            $sql = $sql . ' order by pro.sku ';
            $result = Dao::getResultsNative($sql, $params, PDO::FETCH_ASSOC);
            
            if(count($result) === 0)
                throw new Exception('No result found!');
            if(count($result) > 3000)
            	throw new Exception('Too many rows are found, please narrow down your search criteria!');
            $dateRange = array();
            if(isset($searchParams['runRateDate_from']) && ($from = trim($searchParams['runRateDate_from'])) !== '') {
            	$dateRange = array('from' => $from);
            }
            if(isset($searchParams['runRateDate_to']) && ($to = trim($searchParams['runRateDate_to'])) !== '') {
            	$dateRange = $dateRange + array('to' => $to);
            }
            $from = isset($dateRange['from']) ? New UDate($dateRange['from']) : New UDate(UDate::zeroDate());
            $to = isset($dateRange['to']) ? New UDate($dateRange['to']) : UDate::now();
            $field = '[' . $from->getDateTimeString() . ' - ' . $to->getDateTimeString() . ']';
            $proIdMap = array();
            if (count($dateRange) == 0)
            	$extraInfo = array('lastbuyprice' => '', '7days' => 0, '14days' => 0, '1month' => 0, '3month' => 0, '6month' => 0, '12month' => 0);
            else
            	$extraInfo = array('lastbuyprice' => '', $field => 0);
            
            foreach($result as $row){
            	
            	if(($proBrands = Manufacturer::get($row['proBrand'])) instanceof Manufacturer){
            		$proBrand = $proBrands->getName();
            	}else {
            		Config::dd($row['proId']);
            		$proBrand = '';
            	}
            	$row['proBrand'] = $proBrand;
            	$proCats = Product_Category::getAllByCriteria('productId = ?', array($row['proId']));
            	if(count($proCats) > 0){
            		$proCat = $proCats[0]->getCategory()->getName();
            	}else{
            		$proCat = '';
            	}
            	
            		$proIdMaps[$row['proId']] = $row + array('proCat' => $proCat) + $extraInfo;
            }
            
            // get last buy price
            $lastbuys = $this->_getLastBuy(array_keys($proIdMaps));
            foreach($lastbuys as $row)
            {
            	$proIdMaps[$row['proId']] = isset($proIdMaps[$row['proId']])? array_merge($proIdMaps[$row['proId']], $row) : $proIdMaps[$row['proId']];
            }
            //get run rate
            $rates = $this->_getRunRateData(array_keys($proIdMaps), $dateRange);
            foreach($rates as $row)
            {
            	$proIdMaps[$row['proId']] = isset($proIdMaps[$row['proId']])? array_merge($proIdMaps[$row['proId']], $row): $proIdMaps[$row['proId']];
            }
            
            if (!($asset = $this->_getExcel($proIdMaps, $dateRange)) instanceof Asset)
                throw new Exception('Failed to create a excel file');
            $results['url'] = $asset->getUrl();
        }
        catch(Exception $ex)
        {
            $errors[] = $ex->getMessage();
        }
        $param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * get run rate report
	 * @param unknown $productIds
	 * @param unknown $dateRange
	 */
	private function _getRunRateData($productIds, $dateRange = array()) {
	    if(count($productIds) === 0)
	        return array();
	    if (count($dateRange) === 0) 
	    {
		    $_7DaysBefore = UDate::now()->modify('-7 day');
		    $_14DaysBefore = UDate::now()->modify('-14 day');
		    $_1mthBefore = UDate::now()->modify('-1 month');
		    $_3mthBefore = UDate::now()->modify('-3 month');
		    $_6mthBefore = UDate::now()->modify('-6 month');
		    $_12mthBefore = UDate::now()->modify('-12 month');
		    $sql = "select ord_item.productId `proId`,
		            sum(if(ord.orderDate >= '" . $_7DaysBefore . "', ord_item.qtyOrdered, 0)) `7days`,
		            sum(if(ord.orderDate >= '" . $_14DaysBefore . "', ord_item.qtyOrdered, 0)) `14days`,
		            sum(if(ord.orderDate >= '" . $_1mthBefore . "', ord_item.qtyOrdered, 0)) `1month`,
		            sum(if(ord.orderDate >= '" . $_3mthBefore . "', ord_item.qtyOrdered, 0)) `3month`,
		            sum(if(ord.orderDate >= '" . $_6mthBefore . "', ord_item.qtyOrdered, 0)) `6month`,
		            sum(if(ord.orderDate >= '" . $_12mthBefore . "', ord_item.qtyOrdered, 0)) `12month`
		            from `orderitem` ord_item
		            inner join `order` ord on (ord.type = :type and ord.active = 1 and ord.id = ord_item.orderId and ord.storeId = ord_item.storeId)
		            where ord_item.active = 1 and ord_item.productId in (" . implode(', ', $productIds) . ") and ord.storeId = " . Core::getUser()->getStore()->getId() . "
		            group by ord_item.productId";
	    }
	    else
	    {
	    	$from = isset($dateRange['from']) ? New UDate($dateRange['from']) : New UDate(UDate::zeroDate());
	    	$to = isset($dateRange['to']) ? New UDate($dateRange['to']) : UDate::now();
	    	$sql = "select ord_item.productId `proId`,
		            sum(ifnull(ord_item.qtyOrdered, 0)) `[" . $from->getDateTimeString() . " - " . $to->getDateTimeString() . "]`
		            from `orderitem` ord_item
		            inner join `order` ord on (ord.type = :type and ord.active = 1 and ord.id = ord_item.orderId and ord.storeId = ord_item.storeId)
		            where ord_item.active = 1 and ord_item.productId in (" . implode(', ', $productIds) . ") and ord.storeId = " . Core::getUser()->getStore()->getId() . "
		            and ord.orderDate between '" . $from . "' and '" . $to . "'
		            group by ord_item.productId";
	    }
	    return Dao::getResultsNative($sql, array('type' => Order::TYPE_INVOICE), PDO::FETCH_ASSOC);
	}
	/**
	 * get last buy price and received date
	 * @param unknown $productIds
	 */
	private function _getLastBuy($productIds)
	{
		if(count($productIds) === 0)
			return array();
		$sql = "
				SELECT
					LB.productId `proId`,
					ifnull(LB.unitPrice, '') lastbuyprice,
					ifnull(LB.updated, '') lastrecdate
				FROM
					(
						SELECT DISTINCT
							rec1.productId,
							DATE_FORMAT(rec1.updated, '%Y-%m-%d') updated,
							rec1.unitPrice
						FROM
							receivingitem rec1,
							(
								SELECT
									rec2.productId,
									max(rec2.updated) `updated`
								FROM
									receivingitem rec2
								WHERE rec2.active = 1 and rec2.storeId = ?
								GROUP BY
									rec2.productId
							) rec3
						WHERE
							rec1.productId = rec3.productId
						AND rec1.updated = rec3.updated
					) LB
		WHERE LB.productId in (" . implode(', ', $productIds) . ")";
		return Dao::getResultsNative($sql, array(Core::getUser()->getStore()->getId()), PDO::FETCH_ASSOC);
	}
	
	/**
	 * @return PHPExcel
	 */
	private function _getExcel($data, $dateRange = array())
	{
	    $phpexcel= new PHPExcel();
	    $activeSheet = $phpexcel->setActiveSheetIndex(0);

	    $columnNo = 0;
	    $rowNo = 1; // excel start at 1 NOT 0
	    // header row
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Brand');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Category');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'SKU');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Product Name');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last Buy Price');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Average Cost');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'SOH');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Selling Price');
	    if (count($dateRange) === 0)
	    {
	    	// header row
		    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last Week');
		    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last Fortnight');
		    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last 1 Month');
		    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last 3 Month');
		    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last 6 Month');
		    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last 12 Month');
		    $rowNo++;
		    // data row
		    foreach($data as $productId => $rowNoData)
		    {
		    	$columnNo = 0; // excel start at 1 NOT 0
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['proBrand']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['proCat']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['proSku']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['proName']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, StringUtilsAbstract::getCurrency(doubleval($rowNoData['lastbuyprice'])));
		    	if (isset($rowNoData['totalOnHandValue']) && $rowNoData['totalOnHandValue'] !=0 && isset($rowNoData['stockOnHand']) && $rowNoData['stockOnHand'] != 0)
		    	{
		    		$avgCost = ($rowNoData['totalOnHandValue'] / $rowNoData['stockOnHand']);
		    		$avgCost = StringUtilsAbstract::getCurrency($avgCost);
		    	}
		    	else
		    	{
		    		$avgCost = 'N/A';
		    	}
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $avgCost);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['stockOnHand']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, StringUtilsAbstract::getCurrency(doubleval($rowNoData['price'])));
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['7days']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['14days']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['1month']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['3month']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['6month']);
		    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['12month']);
		    	$rowNo++;
		    }
	    }
	    else 
	    {
	    	$from = isset($dateRange['from']) ? New UDate($dateRange['from']) : New UDate(UDate::zeroDate());
	    	$to = isset($dateRange['to']) ? New UDate($dateRange['to']) : UDate::now();
	    	$field = '[' . $from->getDateTimeString() . ' - ' . $to->getDateTimeString() . ']';
	    	// header row
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $field);
	    	$rowNo++;
	    	// data row
	    	foreach($data as $productId => $rowNoData)
	    	{
	    		$columnNo = 0; // excel start at 1 NOT 0
	    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['proBrand']);
	    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['proCat']);
	    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['proSku']);
	    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['proName']);
	    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, StringUtilsAbstract::getCurrency(doubleval($rowNoData['lastbuyprice'])));
	    		if (isset($rowNoData['totalOnHandValue']) && $rowNoData['totalOnHandValue'] !=0 && isset($rowNoData['stockOnHand']) && $rowNoData['stockOnHand'] != 0)
	    		{
	    			$avgCost = ($rowNoData['totalOnHandValue'] / $rowNoData['stockOnHand']);
	    			$avgCost = StringUtilsAbstract::getCurrency($avgCost);
	    		}
	    		else
	    		{
	    			$avgCost = 'N/A';
	    		}
	    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $avgCost);
	    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['stockOnHand']);
	    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, StringUtilsAbstract::getCurrency(doubleval($rowNoData['price'])));
	    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData[$field]);
	    		$rowNo++;
	    	}
	    }

	    // Set document properties
	    $now = UDate::now();
	    $objWriter = new PHPExcel_Writer_Excel2007($phpexcel);
	    $filePath = '/tmp/' . md5($now);
	    
	    $objWriter->save($filePath);
	    $fileName = 'RunRate_' . str_replace(':', '_', str_replace('-', '_', str_replace(' ', '_', $now->setTimeZone(SystemSettings::getSettings(SystemSettings::TYPE_SYSTEM_TIMEZONE))))) . '.xlsx';
	    $asset = Asset::registerAsset($fileName, file_get_contents($filePath), Asset::TYPE_TMP);
	    return $asset;
	}
}
?>
