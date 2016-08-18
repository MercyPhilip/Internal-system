<?php
/**
 * This is the PurchaseOrder List
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class Controller extends CRUDPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'purchaseorders';
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::$_focusEntity
	 */
	protected $_focusEntity = 'PurchaseOrder';
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
// 		if(!AccessControl::canAccessPurcahseOrdersPage(Core::getRole()))
// 			die('You do NOT have access to this page');
	}
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$statusOptions = PurchaseOrder::getStatusOptions();
		$js = parent::_getEndJs();
		$js .= "pageJs._status=" . json_encode($statusOptions) . ";";
		$js .= 'pageJs';
		$js .= ".setCallbackId('deactivateItems', '" . $this->deactivateItemBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('genReportmBtn', '" . $this->genReportmBtn->getUniqueID() . "')";
		$js .= "._bindSearchKey()";
		$js .= "._loadChosen()";
		$js .= "._loadDataPicker();";
		$js .= "$('searchBtn').click();";
		return $js;
	}
	/**
	 * Getting the items
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function getItems($sender, $param)
    {
        $results = $errors = array();
        try
        {
            $pageNo = 1;
            $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
	        $class = trim($this->_focusEntity);
            if(isset($param->CallbackParameter->pagination))
            {
                $pageNo = $param->CallbackParameter->pagination->pageNo;
                $pageSize = $param->CallbackParameter->pagination->pageSize;
            }

            $serachCriteria = isset($param->CallbackParameter->searchCriteria) ? json_decode(json_encode($param->CallbackParameter->searchCriteria), true) : array();
            $stats = array();
            $where = array(1);
            $params = array();
            $noSearch = true;

            foreach($serachCriteria as $field => $value)
            {
            	if((is_array($value) && count($value) === 0) || (is_string($value) && ($value = trim($value)) === ''))
            		continue;
            	$query = $class::getQuery();
            	switch ($field)
            	{
            		case 'po.purchaseOrderNo':
            			{
            				$where[] =  $field . " like ? ";
            				$params[] = '%' . $value . '%';
            				break;
            			}
            		case 'po.supplierRefNo':
            			{
            				$where[] =  $field . " like ? ";
            				$params[] = '%' . $value . '%';
            				break;
            			}
            		case 'po.orderDate_from':
            			{
            				$where[] =  'po.orderDate >= ?';
            				$params[] = $value;
            				break;
            			}
            		case 'po.orderDate_to':
            			{
            				$where[] =  'po.orderDate <= ?';
            				$params[] = str_replace(' 00:00:00', ' 23:59:59', $value);
            				break;
            			}
            		case 'po.supplierIds':
            			{
            				if(count($value) > 0)
            				{
            					$value = explode(',', $value);
            					$where[] = 'po.supplierId IN ('.implode(", ", array_fill(0, count($value), "?")).')';
            					$params = array_merge($params, $value);
            				}
            				break;
            			}
            		case 'po.status':
            			{
            				if(count($value) > 0) {
	            				$where[] = 'po.status IN ('.implode(", ", array_fill(0, count($value), "?")).')';
	            				$params = array_merge($params, $value);
            				}
            				break;
            			}
            		case 'po.active':
            			{
            				if(trim($value) !== '')
            				{
            					$where[] = 'po.active = ?';
	            				$params[] = trim($value);
            				}
            				break;
            			}
					case 'rec_item.invoiceNo':
            			{
            				if(trim($value) !== '')
            				{
            					$where[] = 'id in (select purchaseOrderId from receivingitem rec_item where po.id = rec_item.purchaseOrderId and rec_item.active =1 and rec_item.invoiceNo like ?)';
            					$params[] = '%' . trim($value) . '%';
            				}
            				break;
            			}
            		case 'pro.ids':
            			{
							$value = explode(',', $value);
							$query->eagerLoad("PurchaseOrder.items", 'inner join', 'po_item', 'po_item.purchaseOrderId = po.id and po_item.active = 1');
							$where[] = 'po_item.productId in ('.implode(", ", array_fill(0, count($value), "?")).')';
							$params = array_merge($params, $value);
							break;
            			}
            	}
            	$noSearch = false;
            }
            $objects = PurchaseOrder::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, array('po.id' => 'desc'), $stats);
            $results['pageStats'] = $stats;
            $results['items'] = array();
            foreach($objects as $obj){
            	$PoId = $obj->getId();
            	$results['items'][] = array('totalProdcutCount' => $obj->getTotalProductCount(), 'item' => $obj->getJson());
            }
        }
        catch(Exception $ex)
        {
            $errors[] = $ex->getMessage() . $ex->getTraceAsString();
        }
        $param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
    /**
     * save the items
     *
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     *
     */
    public function deactivateItems($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		$class = trim($this->_focusEntity);
    		$id = isset($param->CallbackParameter->item_id) ? $param->CallbackParameter->item_id : array();

    		$item = PurchaseOrder::get($id);

    		if(!$item instanceof PurchaseOrder)
    			throw new Exception();
    		$item->setActive(false)
    			->save();
    		$results['item'] = $item->getJson();
    	}
    	catch(Exception $ex)
    	{
    		$errors[] = $ex->getMessage() . $ex->getTraceAsString();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
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
    		$pageNo = 1;
    		$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
    		$class = trim($this->_focusEntity);
    		$serachCriteria = isset($param->CallbackParameter) ? json_decode(json_encode($param->CallbackParameter), true) : array();
    		$stats = array();
    		$where = array(1);
    		$params = array();
    		$noSearch = true;
    		
    		foreach($serachCriteria as $field => $value)
    		{
    			if((is_array($value) && count($value) === 0) || (is_string($value) && ($value = trim($value)) === ''))
    				continue;
    				$query = $class::getQuery();
    				switch ($field)
    				{
    					case 'po.purchaseOrderNo':
    						{
    							$where[] =  $field . " like ? ";
    							$params[] = '%' . $value . '%';
    							break;
    						}
    					case 'po.supplierRefNo':
    						{
    							$where[] =  $field . " like ? ";
    							$params[] = '%' . $value . '%';
    							break;
    						}
    					case 'po.orderDate_from':
    						{
    							$where[] =  'po.orderDate >= ?';
    							$params[] = $value;
    							break;
    						}
    					case 'po.orderDate_to':
    						{
    							$where[] =  'po.orderDate <= ?';
    							$params[] = str_replace(' 00:00:00', ' 23:59:59', $value);
    							break;
    						}
    					case 'po.supplierIds':
    						{
    							if(count($value) > 0)
    							{
    								$value = explode(',', $value);
    								$where[] = 'po.supplierId IN ('.implode(", ", array_fill(0, count($value), "?")).')';
    								$params = array_merge($params, $value);
    							}
    							break;
    						}
    					case 'po.status':
    						{
    							if(count($value) > 0) {
    								$where[] = 'po.status IN ('.implode(", ", array_fill(0, count($value), "?")).')';
    								$params = array_merge($params, $value);
    							}
    							break;
    						}
    					case 'po.active':
    						{
    							if(trim($value) !== '')
    							{
    								$where[] = 'po.active = ?';
    								$params[] = trim($value);
    							}
    							break;
    						}
    					case 'rec_item.invoiceNo':
    						{
    							if(trim($value) !== '')
    							{
    								$where[] = 'id in (select purchaseOrderId from receivingitem rec_item where po.id = rec_item.purchaseOrderId and rec_item.active =1 and rec_item.invoiceNo like ?)';
    								$params[] = '%' . trim($value) . '%';
    							}
    							break;
    						}
    					case 'pro.ids':
    						{
    							$value = explode(',', $value);
    							$query->eagerLoad("PurchaseOrder.items", 'inner join', 'po_item', 'po_item.purchaseOrderId = po.id and po_item.active = 1');
    							$where[] = 'po_item.productId in ('.implode(", ", array_fill(0, count($value), "?")).')';
    							$params = array_merge($params, $value);
    							break;
    						}
    				}
    				$noSearch = false;
    		}
    		$objects = PurchaseOrder::getAllByCriteria(implode(' AND ', $where), $params, false, null, DaoQuery::DEFAUTL_PAGE_SIZE, array('po.id' => 'desc'), $stats);
    		if(count($objects) === 0)
    			throw new Exception('No result found!');
    		if(count($objects) > 5000)
    			throw new Exception('Too many rows are found, please narrow down your search criteria! rows:' . count($objects));
    		if (!($asset = $this->_getExcel($objects)) instanceof Asset)
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
    private function _getExcel($objects)
    {
    	$phpexcel= new PHPExcel();
    	$activeSheet = $phpexcel->setActiveSheetIndex(0);
    	$columnNo = 0;
    	$rowNo = 1; // excel start at 1 NOT 0
    	// header row
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Date');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'PO Number');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'SKU');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Description');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Ordered QTY');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Received QTY');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Price');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'ETA Date');
    	// data row
    	foreach($objects as $object)
    	{
    		$purchaseItems = $object->getItems();
    		foreach($purchaseItems as $purchaseItem)
    		{
    			$rowNo++;
    			$columnNo = 0; // excel start at 1 NOT 0
    			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $object->getCreated()->format('d/M/Y')); //date
    			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $object->getPurchaseOrderNo()); //PO No
    			$product = $purchaseItem->getProduct();
    			if (!$product instanceof Product) continue;
    			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getSku()); //SKU
    			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getShortDescription()); //Short descprition
    			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $purchaseItem->getQty()); //ordered qty
    			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $purchaseItem->getReceivedQty()); //received qty
    			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, StringUtilsAbstract::getCurrency(doubleval($purchaseItem->getUnitPrice()))); //price
    			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $object->getEta()->format('d/M/Y')); //ETA date
    		}
    		
    	}
    	// Set document properties
    	$now = UDate::now();
    	$objWriter = new PHPExcel_Writer_CSV($phpexcel);
    	$filePath = '/tmp/' . md5($now);
    	$objWriter->save($filePath);
    	$fileName = 'PurchaseOrder_' . str_replace(':', '_', str_replace('-', '_', str_replace(' ', '_', $now->setTimeZone(SystemSettings::getSettings(SystemSettings::TYPE_SYSTEM_TIMEZONE))))) . '.csv';
    	$asset = Asset::registerAsset($fileName, file_get_contents($filePath), Asset::TYPE_TMP);
    	return $asset;
    }
    
}
?>