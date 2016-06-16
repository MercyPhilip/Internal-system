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
	public $menuItem = 'report.sellingreport';
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
            $dateRange = array();
            if(isset($searchParams['sellingDate_from']) && ($from = trim($searchParams['sellingDate_from'])) !== '') {
            	$dateRange = array('from' => $from);
            }
            if(isset($searchParams['sellingDate_to']) && ($to = trim($searchParams['sellingDate_to'])) !== '') {
            	$dateRange = $dateRange + array('to' => $to);
            }
            $from = isset($dateRange['from']) ? New UDate($dateRange['from']) : New UDate(UDate::zeroDate());
            $to = isset($dateRange['to']) ? New UDate($dateRange['to']) : UDate::now();
            $wheres[] = "oi.updated between '" . $from . "' and '" . $to . "'";
            
            $joins[] = 'inner join orderitem oi on (oi.productId = pro.id and oi.active =1 and oi.isShipped = 1)';
            $joins[] = 'inner join `order` ord on (ord.id = oi.orderId and ord.active = 1 and ord.statusId = 8)';
            $joins[] = 'LEFT OUTER JOIN  manufacturer m on (pro.manufacturerId = m.`id` and m.active =1)';
            $joins[] = 'LEFT OUTER JOIN  customer cst on (cst.`id` = ord.`customerId` and cst.active =1)';
            $joins[] = 'LEFT OUTER JOIN  sellingitem si on (si.productId = oi.productId and si.orderId = oi.orderId and si.orderItemId = oi.id and si.active =1)';
            $sql = "select pro.id `productId`, pro.sku `sku`, pro.name `name`, 
            		ifnull(oi.unitPrice, '') sellingprice, ifnull(DATE_FORMAT(oi.updated, '%Y-%m-%d'), '') sellingdate, 
            		m.`name` brand, ord.invNo invNo, cst.`name` customer, if(si.kitId is null, 'no', 'yes') isKit,
            		sum(ifnull(oi.qtyOrdered, 0)) qty
            		from product pro " . implode(' ', $joins) . (count($wheres) > 0 ? (" where " . implode(' AND ', $wheres)) : '');
            $sql = $sql . " group by pro.id, pro.sku, pro.name, oi.unitPrice, DATE_FORMAT(oi.updated, '%Y-%m-%d'), m.`name`,ord.invNo, if(si.kitId is null, 'no', 'yes'), cst.`name` order by pro.sku, oi.updated desc";
            
            $result = Dao::getResultsNative($sql, $params, PDO::FETCH_ASSOC);
            if(count($result) === 0)
                throw new Exception('No result found!');
//             if(count($result) > 3000)
//             	throw new Exception('Too many rows are found, please narrow down your search criteria!');
            if (!($asset = $this->_getExcel($result)) instanceof Asset)
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
	 * @return PHPExcel
	 */
	private function _getExcel($data)
	{
	    $phpexcel= new PHPExcel();
	    $activeSheet = $phpexcel->setActiveSheetIndex(0);

	    $columnNo = 0;
	    $rowNo = 1; // excel start at 1 NOT 0
	    // header row
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'SKU');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Product Name');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Selling Date');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Selling Price');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Quantity');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'isKit');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Brand');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Invoice No');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Customer');
	    $rowNo++;
	    // data row
	    foreach($data as $rowNoData)
	    {
	    	$columnNo = 0; // excel start at 1 NOT 0
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['sku']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['name']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['sellingdate']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, StringUtilsAbstract::getCurrency(doubleval($rowNoData['sellingprice'])));
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['qty']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['isKit']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['brand']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['invNo']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['customer']);
	    	$rowNo++;
	    }
	    // Set document properties
	    $now = UDate::now();
	    $objWriter = new PHPExcel_Writer_Excel2007($phpexcel);
	    $filePath = '/tmp/' . md5($now);
	    $objWriter->save($filePath);
	    $fileName = 'SellingReport_' . str_replace(':', '_', str_replace('-', '_', str_replace(' ', '_', $now->setTimeZone(SystemSettings::getSettings(SystemSettings::TYPE_SYSTEM_TIMEZONE))))) . '.xlsx';
	    $asset = Asset::registerAsset($fileName, file_get_contents($filePath), Asset::TYPE_TMP);
	    return $asset;
	}
}
?>
