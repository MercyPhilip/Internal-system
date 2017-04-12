<?php
/**
 * This is the listing page for Deliveries
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class DeliveryController extends CRUDPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'deliveries';
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
		$js .= "pageJs.setCallbackId('deliveryItem', '" . $this->deliveryItemBtn->getUniqueID() . "')";
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
			$where[] = 'type = :type';
			$params['type'] = PickupDelivery::TYPE_DELIVERY;
			if(isset($param->CallbackParameter->searchCriteria)){
				$serachCriteria = json_decode(json_encode($param->CallbackParameter->searchCriteria), true);
			
				if (trim($serachCriteria['ord.name']) !== ''){
					$customerName = trim($serachCriteria['ord.name']);
					$customers = Customer::getAllByCriteria('name like ?', array('%'.$customerName.'%'));
					if(count($customers) > 0){
						foreach ($customers as $index => $value){
							$key = 'cus_' . $index;
							$keys[] = ':' . $key;
							$ids[$key] = trim($value->getId());
						}
					
						$where[] = 'orderId in (select id from `order` where active =1 and customerId in (' . implode(',', $keys) . '))';
						$params = array_merge($params, $ids);
					}else {
						$results['message'][] = 'Invalid customer!';
						$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
						return ;
					}
				}
				if (trim($serachCriteria['ord.no']) !== ''){
					$orderNum = trim($serachCriteria['ord.no']);
					$orders = Order::getAllByCriteria('orderNo like ?', array('%'.$orderNum.'%'));
					if (count($orders) > 0){
						foreach ($orders as $index => $value){
							$key = 'ord_' . $index;
							$keysOrder[] = ':' . $key;
							$idsOrder[$key] = trim($value->getId());
						}
						$where[] = 'orderId in (' . implode(',', $keysOrder) . ')';
						$params = array_merge($params, $idsOrder);
					}else {
						$results['message'][] = 'Invalid Order Number!';
						$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
						return ;
					}
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
	 * confirm item delivered
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function deliveryItem($sender, $param)
	{
		$results = $errors = array();
		try
		{	
			$id = isset($param->CallbackParameter->item_id) ? $param->CallbackParameter->item_id : array();
			$orderId = isset($param->CallbackParameter->order_id) ? $param->CallbackParameter->order_id : array();
			$signature = isset($param->CallbackParameter->signature) ? $param->CallbackParameter->signature: array();
			$recepiant = isset($param->CallbackParameter->recepiant) ? $param->CallbackParameter->recepiant: array();
			
			$order = Order::get($orderId);
			if(!$order instanceof Order)
				throw new Exception();
			
			$deliveries = PickupDelivery::getAllByCriteria('orderId =? and storeId =?', array($orderId, Core::getUser()->getStore()->getId()));
			
			foreach ($deliveries as $delivery){
				$delivery->setDoneDate(UDate::now())
				->setDoneBy(Core::getUser())
				->setActive(false)
				->save();
			}
			//save signature in svg format and set file name to InvNo_RecepiantName  
			$data = base64_decode($signature[1]);
			$fileName = 'InvNo_'.$order->getInvNo().'_Recepiant_'.$recepiant.'.svg';
			Asset::registerAsset($fileName, $data, 'DELIVERY_SIGNATURE');
			
			$results['item'] = $delivery->getJson();
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
			$comment = isset($param->CallbackParameter->comment) ? $param->CallbackParameter->comment : '';

			$pickupDeli = PickupDelivery::get($id);
			if(!$pickupDeli instanceof PickupDelivery)
				throw new Exception();
			
			if ($comment == ''){
				$preComments = $pickupDeli->getComment();
				if (count($preComments) > 0){
					foreach ($preComments as $preComment){
						$preComment->setActive(0)
						->save();
						
					}
					$results['item'] = $pickupDeli->getJson();
				}else{
					$results['item'] = 'no comment';
				}
			} else {
				$pickupDeli->addComment($comment, 'PICKUPDELIVERY')
				->save();
				$results['item'] = $pickupDeli->getJson();
			}

		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage() . $ex->getTraceAsString();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
}
?>