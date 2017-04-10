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
	protected $_focusEntity = 'PickupDelivery';
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
		$js .= "pageJs.setCallbackId('pickupItem', '" . $this->pickupItemBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('saveComment', '" . $this->saveCommentBtn->getUniqueID() . "')";
		$js .= "._bindSearchKey()";
		$js .= '.setRoleId('. Core::getRole()->getId() .')';
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
			
			$where = array(1);
			$params = array();
			$where[] = 'storeId = :storeId';
			$params['storeId'] = Core::getUser()->getStore()->getId();
			if(isset($param->CallbackParameter->searchCriteria)){
				$serachCriteria = json_decode(json_encode($param->CallbackParameter->searchCriteria), true);
				$supplierName = trim($serachCriteria['po.supplier']);
				$suppliers = Supplier::getAllByCriteria('name like ?', array('%'.$supplierName.'%'));
				if(count($suppliers) > 0){
					foreach ($suppliers as $index => $value){
						$key = 'su_' . $index;
						$keys[] = ':' . $key;
						$ids[$key] = trim($value->getId());
					}
				
					$where[] = 'supplierId in (' . implode(',', $keys) . ')';
					$params = array_merge($params, $ids);
				}else {
					$results['message'][] = 'Invalid supplier!';
					$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
					return ;
				}
				
				$poNum = trim($serachCriteria['po.no']);
				$pos = PurchaseOrder::getAllByCriteria('purchaseOrderNo like ?', array('%'.$poNum.'%'));
				if (count($pos) > 0){
					foreach ($pos as $index => $value){
						$key = 'po_' . $index;
						$keysPo[] = ':' . $key;
						$idsPo[$key] = trim($value->getId());
					}
					$where[] = 'orderId in (' . implode(',', $keysPo) . ')';
					$params = array_merge($params, $idsPo);
				}else {
					$results['message'][] = 'Invalid PO Number!';
					$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
					return ;
				}
			}
			$where[] = 'done = 0';
			$stats = array();
			$objects = $class::getAllByCriteria(implode(' AND ', $where), $params, true, $pageNo, $pageSize, array('arrangedDate' => 'asc'), $stats);
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
	 * confirm item pickuped
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function pickupItem($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$id = isset($param->CallbackParameter->item_id) ? $param->CallbackParameter->item_id : array();
			$poId = isset($param->CallbackParameter->po_id) ? $param->CallbackParameter->po_id : array();
			
			$po = PurchaseOrder::get($poId);
			if(!$po instanceof PurchaseOrder)
				throw new Exception();
			
			$pickup = PickupDelivery::get($id);
			
			$pickup->setDoneDate(UDate::now())
			->setDoneBy(Core::getUser())
			->setActive(false)
			->save();

			$results['item'] = $pickup->getJson();
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage() . $ex->getTraceAsString();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * save comment
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function saveComment($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$id = isset($param->CallbackParameter->item_id) ? $param->CallbackParameter->item_id : array();
			$comment = isset($param->CallbackParameter->comment) ? $param->CallbackParameter->comment : array();
			
			$pickupDeli = PickupDelivery::get($id);
			if(!$pickupDeli instanceof PickupDelivery)
				throw new Exception();
			
			$pickupDeli->addComment($comment, 'PICKUPDELIVERY')
			->save();

			$results['item'] = $pickupDeli->getJson();
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage() . $ex->getTraceAsString();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
}
?>