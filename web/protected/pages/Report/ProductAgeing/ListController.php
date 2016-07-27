<?php
/**
 * This is the listing page for customer
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class ListController extends CRUDPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'report.productAgeing';
	protected $_focusEntity = 'ProductAgeingLog';
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
		$js .= "pageJs._bindSearchKey()";
		$js .= "._loadDataPicker()";
		$js .= ".setCallbackId('deactivateItems', '" . $this->deactivateItemBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('genReportmBtn', '" . $this->genReportmBtn->getUniqueID() . "')";
		$js .= ".getResults(true, " . $this->pageSize . ");";
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
            $class = trim($this->_focusEntity);
            $pageNo = 1;
            $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;

            if(isset($param->CallbackParameter->pagination))
            {
                $pageNo = $param->CallbackParameter->pagination->pageNo;
                $pageSize = $param->CallbackParameter->pagination->pageSize;
            }
            $serachCriteria = isset($param->CallbackParameter->searchCriteria) ? json_decode(json_encode($param->CallbackParameter->searchCriteria), true) : array();
            $where = array(1);
            $params = array();
            $joinParams = array();
            foreach($serachCriteria as $field => $value)
            {
            	if((is_array($value) && count($value) === 0) || (is_string($value) && ($value = trim($value)) === ''))
            		continue;

            	$query = $class::getQuery();
            	switch ($field)
            	{
            		case 'pro.ids':
					{
						$value = explode(',', $value);
						$where[] = 'pal.productId in ('.implode(", ", array_fill(0, count($value), "?")).')';
            			$params = array_merge($params, $value);
						break;
					}
					case 'pro.manufacturerIds':
					{
						$value = array_map(create_function('$a', 'return trim($a);'), explode(',', $value));
						$query->eagerLoad("ProductAgeingLog.product", 'inner join', 'pro1', 'pro1.id = pal.productId and pro1.active = 1 and pro1.manufacturerId in (' . implode(", ", array_fill(0, count($value), "?")) .')'); 						
						$joinParams = array_merge($joinParams, $value);
						break;
					}
					case 'pro.categories':
					{
						$value = array_map(create_function('$a', 'return trim($a);'), explode(',', $value));
						$query->eagerLoad("ProductAgeingLog.product", 'inner join', 'pro', 'pro.id = pal.productId and pro.active = 1')
							->eagerLoad('Product.categories', 'inner join', 'pro_cate', 'pro_cate.active = 1 and pro.id = pro_cate.productId and pro_cate.categoryId in (' . implode(", ", array_fill(0, count($value), "?")) .')'); 
						$joinParams = array_merge($joinParams, $value);
						break;
					}
					case 'po.id':
					{
						ProductAgeingLog::getQuery()->eagerLoad('ProductAgeingLog.purchaseOrderItem', 'inner join', 'pal_po', 'pal.storeId = pal_po.storeId');
						$where[] = '(pal_po.id = ? )';
						$params[] = $value;
						break;
					}
					case 'aged-days':
					{
						$where[] = 'date_add(pal.lastPurchaseTime, INTERVAL ' . intval($value) . ' DAY) < NOW()';
						break;
					}
					
				}
			}
			$params = array_merge($joinParams, $params);
			$where[] = 'pal.storeId = ?';
			$params[] = Core::getUser()->getStore()->getId();
			$stats = array();
			$objects = $class::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, array('pal.lastPurchaseTime' => 'asc'), $stats);

            $results['pageStats'] = $stats;
            $results['items'] = array();
            foreach($objects as $obj)
                $results['items'][] = $obj->getJson(array('NOW'=> UDate::now()->__toString()));
        }
        catch(Exception $ex)
        {
            $errors[] = $ex->getMessage() . $ex->getTraceAsString();
        }
        $param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * Generate report
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
			$class = trim($this->_focusEntity);
			$pageNo = null;
			$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
			$searchParams = json_decode(json_encode($param->CallbackParameter), true);
			$where = array(1);
			$params = array();
			$joinParams = array();
			$query = $class::getQuery();
			//id
			if (isset($searchParams['pro.ids']) && trim($searchParams['pro.ids']) != '' )
			{
				$value = $searchParams['pro.ids'];
				$value = explode(',', $value);
				$where[] = 'pal.productId in ('.implode(", ", array_fill(0, count($value), "?")).')';
				$params = array_merge($params, $value);
			}
			if (isset($searchParams['pro.manufacturerIds']) && trim($searchParams['pro.manufacturerIds']) != '' )
			{
				$value = $searchParams['pro.manufacturerIds'];
				$value = array_map(create_function('$a', 'return trim($a);'), explode(',', $value));
				$query->eagerLoad("ProductAgeingLog.product", 'inner join', 'pro1', 'pro1.id = pal.productId and pro1.active = 1 and pro1.manufacturerId in (' . implode(", ", array_fill(0, count($value), "?")) .')');
				$joinParams = array_merge($joinParams, $value);
			}
			if (isset($searchParams['pro.categories']) && trim($searchParams['pro.categories']) != '' )
			{
				$value = $searchParams['pro.categories'];
				$value = array_map(create_function('$a', 'return trim($a);'), explode(',', $value));
				$query->eagerLoad("ProductAgeingLog.product", 'inner join', 'pro', 'pro.id = pal.productId and pro.active = 1')
					->eagerLoad('Product.categories', 'inner join', 'pro_cate', 'pro_cate.active = 1 and pro.id = pro_cate.productId and pro_cate.categoryId in (' . implode(", ", array_fill(0, count($value), "?")) .')');
				$joinParams = array_merge($joinParams, $value);
			}
			if (isset($searchParams['po.id']) && trim($searchParams['po.id']) != '' )
			{
				$value = $searchParams['po.id'];
				ProductAgeingLog::getQuery()->eagerLoad('ProductAgeingLog.purchaseOrderItem', 'inner join', 'pal_po', 'pal.storeId = pal_po.storeId');
				$where[] = '(pal_po.id = ? )';
				$params[] = $value;
			}
			if (isset($searchParams['aged-days']) && trim($searchParams['aged-days']) != '' )
			{
				$value = $searchParams['aged-days'];
				$where[] = 'date_add(pal.lastPurchaseTime, INTERVAL ' . intval($value) . ' DAY) < NOW()';
			}
			$params = array_merge($joinParams, $params);
			$where[] = 'pal.storeId = ?';
			$params[] = Core::getUser()->getStore()->getId();
			$stats = array();
			$objects = $class::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, array('pal.lastPurchaseTime' => 'asc'), $stats);
			if(count($objects) === 0)
				throw new Exception('No result found!');
			if(count($objects) > 5000)
				throw new Exception('Too many rows are found, please narrow down your search criteria!');
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
	 * export to csv
	 * @return PHPExcel
	 */
	private function _getExcel($objects)
	{
		$phpexcel= new PHPExcel();
		$activeSheet = $phpexcel->setActiveSheetIndex(0);
		$columnNo = 0;
		$rowNo = 1; // excel start at 1 NOT 0
		// header row
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Sku');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Product Name');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'LastPurchaseTime');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'StockOnHand');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Aged Days');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Category');
		$rowNo++;
		// data row
		foreach($objects as $obj)
		{
			$categoryNames = array();
			$columnNo = 0; // excel start at 1 NOT 0
			$product = $obj->getProduct();
			if (!$product instanceof Product) continue;
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getSku()); //sku
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getName()); //name
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $obj->getLastPurchaseTime()); //Last Purchase time
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getStockOnHand()); //SOH
			$lastPurchaseTime = new UDate($obj->getLastPurchaseTime());
			$agedDays = UDate::now()->diff($lastPurchaseTime)->days;
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $agedDays); //Aged days
			$categories = $product->getCategories();
			foreach($categories as $category)
			{
				if (!$category->getCategory() instanceof ProductCategory) continue;
				$categoryNames[] = $category->getCategory()->getName();
			}
			if (count($categoryNames) > 0)
				$categoryName = implode(';', $categoryNames);
			else
				$categoryName = '';
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $categoryName); //categories
			$rowNo++;
		}
		// Set document properties
		$now = UDate::now();
		$objWriter = new PHPExcel_Writer_CSV($phpexcel);
		$filePath = '/tmp/' . md5($now);
		$objWriter->save($filePath);
		$fileName = 'ProductAgeingReportExport_' . str_replace(':', '_', str_replace('-', '_', str_replace(' ', '_', $now->setTimeZone(SystemSettings::getSettings(SystemSettings::TYPE_SYSTEM_TIMEZONE))))) . '.csv';
		$asset = Asset::registerAsset($fileName, file_get_contents($filePath), Asset::TYPE_TMP);
		return $asset;
	}
}
?>
