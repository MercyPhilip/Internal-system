<?php
/**
 * This is the listing page for Pickups
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class PickupController extends CRUDPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'pickups';
	protected $_focusEntity = 'PurchaseOrder';
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
	}
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .= 'pageJs.getResults(true, ' . $this->pageSize . ');';
		$js .= ".setCallbackId('pickupItem', '" . $this->pickupItemBtn->getUniqueID() . "')";
		
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
			
			$where = array(1);
			$params = array();
			$where[] = 'storeId = :storeId';
			$params['storeId'] = Core::getUser()->getStore()->getId();
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