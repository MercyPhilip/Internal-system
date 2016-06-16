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
	public $menuItem = 'report.buyinreport';
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
            if(isset($searchParams['buyinDate_from']) && ($from = trim($searchParams['buyinDate_from'])) !== '') {
            	$dateRange = array('from' => $from);
            }
            if(isset($searchParams['buyinDate_to']) && ($to = trim($searchParams['buyinDate_to'])) !== '') {
            	$dateRange = $dateRange + array('to' => $to);
            }
            $from = isset($dateRange['from']) ? New UDate($dateRange['from']) : New UDate(UDate::zeroDate());
            $to = isset($dateRange['to']) ? New UDate($dateRange['to']) : UDate::now();
            $wheres[] = "rec.updated between '" . $from . "' and '" . $to . "'";
            
            $joins[] = 'inner join productprice pp on (pp.productId = pro.id and pp.active = 1 and pp.typeId = 1)';
            $joins[] = 'inner join receivingitem rec on (rec.productId = pro.id and rec.active =1)';
            $joins[] = 'inner join purchaseorder po on (po.id = rec.purchaseOrderId and po.active =1)';
            $joins[] = 'inner join supplier s on (po.supplierId = s.`id` and s.active =1)';
            $joins[] = 'inner join manufacturer m on (pro.manufacturerId = m.`id` and m.active =1)';
            $sql = "select pro.id `productId`, pro.sku `sku`, pro.name `name`, 
            		ifnull(rec.unitPrice, '') buyinprice, ifnull(DATE_FORMAT(rec.updated, '%Y-%m-%d'), '') buyindate, ifnull(rec.qty, 0) qty, 
            		s.`name` supplier, m.`name` brand
            		from product pro " . implode(' ', $joins) . (count($wheres) > 0 ? (" where " . implode(' AND ', $wheres)) : '');
            $sql = $sql . ' order by pro.sku, rec.updated desc';
            
            $result = Dao::getResultsNative($sql, $params, PDO::FETCH_ASSOC);
            if(count($result) === 0)
                throw new Exception('No result found!');
            if(count($result) > 3000)
            	throw new Exception('Too many rows are found, please narrow down your search criteria!');
            $proIdMap = array();
            foreach($result as $row)
                $proIdMaps[$row['productId']] = $row;

            if (!($asset = $this->_getExcel($proIdMaps)) instanceof Asset)
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
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Received Date');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Buy In Price');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Quantity');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Supplier');
	    $activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Brand');
	    $rowNo++;
	    // data row
	    foreach($data as $productId => $rowNoData)
	    {
	    	$columnNo = 0; // excel start at 1 NOT 0
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['sku']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['name']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['buyindate']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, StringUtilsAbstract::getCurrency(doubleval($rowNoData['buyinprice'])));
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['qty']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['supplier']);
	    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['brand']);
	    	$rowNo++;
	    }
	    // Set document properties
	    $now = UDate::now();
	    $objWriter = new PHPExcel_Writer_Excel2007($phpexcel);
	    $filePath = '/tmp/' . md5($now);
	    $objWriter->save($filePath);
	    $fileName = 'BuyInReport_' . str_replace(':', '_', str_replace('-', '_', str_replace(' ', '_', $now->setTimeZone(SystemSettings::getSettings(SystemSettings::TYPE_SYSTEM_TIMEZONE))))) . '.xlsx';
	    $asset = Asset::registerAsset($fileName, file_get_contents($filePath), Asset::TYPE_TMP);
	    return $asset;
	}
}
?>
