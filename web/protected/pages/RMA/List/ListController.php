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
	public $menuItem = 'accounting.rma';
	protected $_focusEntity = 'RMA';
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
		$statusOptions = RMA::getAllStatuses();
		
		$js = parent::_getEndJs();
		$js .= "pageJs._statusOptions=" . json_encode($statusOptions) . ";";
		$js .= "pageJs._bindSearchKey()";
		$js .= ".setCallbackId('deactivateItems', '" . $this->deactivateItemBtn->getUniqueID() . "')";
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
                $pageSize = $param->CallbackParameter->pagination->pageSize * 3;
            }
            
            $serachCriteria = isset($param->CallbackParameter->searchCriteria) ? json_decode(json_encode($param->CallbackParameter->searchCriteria), true) : array();
            $where = array(1);
            $params = array();
            foreach($serachCriteria as $field => $value)
            {
            	if((is_array($value) && count($value) === 0) || (is_string($value) && ($value = trim($value)) === ''))
            		continue;
            	
            	$query = $class::getQuery();
            	$query->eagerLoad("RMA.items", 'inner join', 'ra_item', 'ra_item.RMAId = ra.id and ra_item.active = 1 and ra.storeid = ra_item.storeId');
            	switch ($field)
            	{
            		case 'ra.raNo': 
					{
						$where[] = 'ra.raNo like ?';
            			$params[] = "%" . $value . "%";
						break;
					}
					case 'ra.supplierRaNo':
					{
						$where[] = 'ra_item.supplierRMANo like ?';
						$params[] = "%" . $value . "%";
						break;
					}
					case 'ra.status': 
					{
						$where[] = 'ra.status IN ('.implode(", ", array_fill(0, count($value), "?")).')';
						$params = array_merge($params, $value);
						break;
					}
					case 'ra.description':
					{
						$where[] =  'ra.description like ?';
						$params[] = "%" . $value . "%";
						break;
					}
					case 'ord.orderNo':
					{
						$query->eagerLoad("RMA.order", 'inner join', 'ord', 'ra.orderId = ord.id and ra.storeId = ord.storeId');
						$where[] = 'ord.orderNo like ?';
						$params[] = "%" . trim($value) . "%";
						break;
					}
					case 'cust.id':
					{
						$value = explode(',', $value);
						$where[] = 'ra.customerId IN ('.implode(", ", array_fill(0, count($value), "?")).')';
						$params = array_merge($params, $value);
						break;
					}
            		case 'pro.ids':
					{
						$value = explode(',', $value);
						//$query->eagerLoad("RMA.items", 'inner join', 'ra_item', 'ra_item.RMAId = ra.id and ra_item.active = 1 and ra.storeid = ra_item.storeId');
						$where[] = 'ra_item.productId in ('.implode(", ", array_fill(0, count($value), "?")).')';
						$params = array_merge($params, $value);
						break;
					}
            		case 'recv.serialNo':
            		{
            			//$query->eagerLoad("RMA.items", 'inner join', 'ra_items', 'ra_items.RMAId = ra.id and ra_items.active = 1 and ra.storeid = ra_items.storeId');
            			//$query->eagerLoad("RMAItem.receivingItem", 'inner join', 'rmai_recv', 'ra_item.receivingItemId = rmai_recv.id and rmai_recv.active = 1 and ra_item.storeid = rmai_recv.storeId');
            			$where[] = 'ra_item.serialNo like ? or ra_item.newSerialNo like ?';
            			$params[] = "%" . trim($value) . "%";
            			$params[] = "%" . trim($value) . "%";
            			break;
            		}
            		case 'po.purchaseorderNo':
            		{
            			//$query->eagerLoad("RMA.items", 'inner join', 'ra_items', 'ra_items.RMAId = ra.id and ra_items.active = 1 and ra.storeid = ra_items.storeId');
            			//$query->eagerLoad("RMAItem.receivingItem", 'inner join', 'rmai_recvpo', 'ra_item.receivingItemId = rmai_recvpo.id and rmai_recvpo.active = 1 and ra_item.storeid = rmai_recvpo.storeId');
            			//$query->eagerLoad("ReceivingItem.purchaseOrder", 'inner join', 'rmai_recvpo_po', 'rmai_recvpo.purchaseOrderId = rmai_recvpo_po.id and rmai_recvpo_po.active = 1 and rmai_recvpo_po.storeid = rmai_recvpo.storeId');
            			$where[] = 'ra_item.purchaseOrderNo like ?';
            			$params[] = "%" . trim($value) . "%";
            			break;
            		}
            		case 'po.supplierId':
            		{
            			$values = explode(',', $value);
            			$supplierNames =  array();
            			foreach($values as $value)
            			{
            				$supplierNames[] = Supplier::get($value)->getName();
            			}
            			//$query->eagerLoad("RMA.items", 'inner join', 'ra_items', 'ra_items.RMAId = ra.id and ra_items.active = 1 and ra.storeid = ra_items.storeId');
            			//$query->eagerLoad("RMAItem.receivingItem", 'inner join', 'rmai_recvs', 'ra_item.receivingItemId = rmai_recvs.id and rmai_recvs.active = 1 and ra_item.storeid = rmai_recvs.storeId');
            			//$query->eagerLoad("ReceivingItem.purchaseOrder", 'inner join', 'rmai_recvpo_sp', 'rmai_recvs.purchaseOrderId = rmai_recvpo_sp.id and rmai_recvpo_sp.active = 1 and rmai_recvpo_sp.storeid = rmai_recvs.storeId');
            			$where[] = 'ra_item.supplier in ('.implode(", ", array_fill(0, count($supplierNames), "?")).')';
            			$params = array_merge($params, $supplierNames);
            			break;
            		}
            	}
            }

            $where[] = 'ra.storeId = ?';
            $params[] = Core::getUser()->getStore()->getId();
            $stats = array();

            $objects = $class::getAllByCriteria(implode(' AND ', $where), $params, true, $pageNo, $pageSize, array('ra.raNo' => 'desc'), $stats);
			
            $results['pageStats'] = $stats;
            $results['items'] = array();
            foreach($objects as $obj)
            {
            	$order = $obj->getOrder();
            	$customer = $obj->getCustomer();
            	$raItems = $obj->getRMAItems();
                $results['items'][] = $obj->getJson(array('order'=> empty($order) ? '' : $order->getJson(), 'customer'=> $customer->getJson(), 'raItems'=> $raItems ? array_map(create_function('$a', 'return $a->getJson();'), $raItems) : ''));
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
			
			$obj = $class::get($id);
			
			if(!$obj instanceof $class)
				throw new Exception('Invalid ' . $class . ' passed in');
			$obj->setActive(false)->save();
			
			$order = $obj->getOrder();
			$customer = $obj->getCustomer();
			$raItems = $obj->getRMAItems();
			$results['item'] = $obj->getJson(array('order'=> $order instanceof Order ? $order->getJson() : '', 'customer'=> $customer->getJson(), 'raItems'=> $raItems ? array_map(create_function('$a', 'return $a->getJson();'), $raItems) : ''));
		}
        catch(Exception $ex)
        {
            $errors[] = $ex->getMessage() . $ex->getTraceAsString();
        }
        $param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
}
?>
