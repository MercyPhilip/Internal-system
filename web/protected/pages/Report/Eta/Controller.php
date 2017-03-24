<?php
/**
 * This is the listing page for Tasks
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
	public $menuItem = 'etas';
	protected $_focusEntity = 'ProductEta';
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
		if(!AccessControl::canAccessReportsPage(Core::getRole()))
			die('You do NOT have access to this page');
	}
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$manufactureArray = $supplierArray = $statuses = $productCategoryArray = array();
		foreach (Manufacturer::getAll() as $os)
			$manufactureArray[] = $os->getJson();
		foreach (Supplier::getAll() as $os)
			$supplierArray[] = $os->getJson();
		foreach (ProductCategory::getAll() as $os)
			$productCategoryArray[] = $os->getJson();
					
		$js = parent::_getEndJs();
		$js .= 'pageJs._loadManufactures('.json_encode($manufactureArray).')';
		$js .= '._loadSuppliers('.json_encode($supplierArray).')';
		$js .= '._loadCategories('.json_encode($productCategoryArray).')';
		$js .= "._loadChosen()";
		$js .= "._bindSearchKey()";
		$js .= ".setCallbackId('saveEta', '" . $this->saveEtaBtn->getUniqueID() . "')";
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
				
// 			$serachCriteria = isset($param->CallbackParameter->searchCriteria) ? json_decode(json_encode($param->CallbackParameter->searchCriteria), true) : array();

			$where = array(1);
			$params = array();
			$where[] = 'storeId = :storeId';
			$params['storeId'] = Core::getUser()->getStore()->getId();
			if(isset($param->CallbackParameter->searchCriteria)){
				$serachCriteria = json_decode(json_encode($param->CallbackParameter->searchCriteria), true);
// 			}
// 			if((isset($serachCriteria['pro.sku']) && trim($sku = $serachCriteria['pro.sku']) !== '') || (isset($serachCriteria['pro.name']) && trim($name = $serachCriteria['pro.name']) !== '') ) {
				$sku = $serachCriteria['pro.sku'];
				$name = $serachCriteria['pro.name'];
				$manufacturerIds = $serachCriteria['pro.manufacturerIds'];
				$supplierIds = $serachCriteria['pro.supplierIds'];
				$categoryIds = $serachCriteria['pro.productCategoryIds'];
				$products = Product::getProducts($sku, $name, $supplierIds, $manufacturerIds, $categoryIds);
				if(count($products) > 0) {
					foreach ($products as $index => $value){
						$key = 'pro_' . $index;
						$keys[] = ':' . $key;
						$ids[$key] = trim($value->getId());
					}
					$where[] = 'productId in (' . implode(',', $keys) . ')';
					$params = array_merge($params, $ids);
				} else {
					$results['message'][] = 'Invalid product!';
					$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
					return ;
				}
			}
			$where[] = 'eta <= :now';
			$params['now'] = date('Y-m-d',strtotime('-2 day'));
			$where[] = 'received = 0';
			$stats = array();
			$objects = $class::getAllByCriteria(implode(' AND ', $where), $params, true, $pageNo, $pageSize, array('eta' => 'asc'), $stats);
			$results['pageStats'] = $stats;
			$results['items'] = array();
			foreach($objects as $obj)
				$results['items'][] = $obj->getJson();
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * save ETA
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 */
	public function saveEta($sender, $param)
	{
	
		$results = $errors = array();
		try
		{
			Dao::beginTransaction();
			
			foreach ($param->CallbackParameter->productEta as $object){
				$id = isset($object->id) ? $object->id : '';
				if(!($productEta = ProductEta::get($id)) instanceof ProductEta){
					throw new Exception('Invalid product ETA!');
				}
				
				$ymd = DateTime::createFromFormat('d/m/Y', $object->eta)->format('Y-m-d');				
				if($ymd !== $productEta->getEta()){
					$productEta->setEta($ymd)
					->save();
					
					$results['item'][] = $productEta->getJson();
				}
					
			}
			Dao::commitTransaction();
		}
		catch(Exception $ex)
		{
			Dao::rollbackTransaction();
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
}
?>