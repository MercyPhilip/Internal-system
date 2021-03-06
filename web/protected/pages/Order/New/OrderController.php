<?php
/**
 * This is the OrderController
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class OrderController extends BPCPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'order.new';
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::onLoad()
	 */
	public function onLoad($param)
	{
		parent::onLoad($param);
	}
	/**
	 * Getting The end javascript
	 *
	 * @return string
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		if(!isset($this->Request['id']))
			die('System ERR: no param passed in!');
		if(trim($this->Request['id']) === 'new')
			$order = new Order();
		else if(!($order = Order::get($this->Request['id'])) instanceof Order)
			die('Invalid Order!');

		if($order instanceof Order && trim($order->getType()) === Order::TYPE_INVOICE) {
			header('Location: /orderdetails/'. $order->getId() . '.html?' . $_SERVER['QUERY_STRING']);
			die();
		}

		$cloneOrder = null;
		if(isset($_REQUEST['cloneorderid']) && !($cloneOrder = Order::get(trim($_REQUEST['cloneorderid']))) instanceof Order)
			die('Invalid Order to clone from');

		$paymentMethods =  array_map(create_function('$a', 'return $a->getJson();'), PaymentMethod::getAll(true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array('name' => 'asc')));
		$shippingMethods =  array_map(create_function('$a', 'return $a->getJson();'), Courier::getAll(true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array('name' => 'asc')));
		$customer = (isset($_REQUEST['customerid']) && ($customer = Customer::get(trim($_REQUEST['customerid']))) instanceof Customer) ? $customer->getJson() : null;
		$js .= "pageJs";
			$js .= ".setHTMLID('itemDiv', 'detailswrapper')";
			$js .= ".setHTMLID('searchPanel', 'search_panel')";
			$js .= ".setCallbackId('searchCustomer', '" . $this->searchCustomerBtn->getUniqueID() . "')";
			$js .= ".setCallbackId('searchProduct', '" . $this->searchProductBtn->getUniqueID() . "')";
			$js .= ".setCallbackId('saveOrder', '" . $this->saveOrderBtn->getUniqueID() . "')";
			$js .= ".setCallbackId('cancelOrder', '" . $this->cancelOrderBtn->getUniqueID() . "')";
			$js .= ".setCallbackId('checkPoNo', '" . $this->checkPoNoTxt->getUniqueID() . "')";
			$js .= ".setPaymentMethods(" . json_encode($paymentMethods) . ")";
			$js .= ".setShippingMethods(" . json_encode($shippingMethods) . ")";
			$js .= ".setOrderTypes(" . json_encode(Order::getAllTypes()) . ")";
			$js .= ".setConfigGst(" . json_encode(Config::get('Accounting', 'GST')) . ")";
		if($cloneOrder instanceof Order) {
			$clonOrderArray = $cloneOrder->getJson();
			//$clonOrderArray['items'] = array_map(create_function('$a', 'return $a->getJson();'), OrderItem::getAllByCriteria('orderId = ?', array($cloneOrder->getId())));
			$items = OrderItem::getAllByCriteria('orderId = ?', array($cloneOrder->getId()));
			$clonOrderArray['items'] = array();
			foreach($items as $item)
			{
				$itemArray = $item->getJson();
				$productArray = $itemArray['product'];
				$productArray['tierPrice'] = Core::getUser()->getStore()->getId() == 1 ? ProductTierPrice::getTierPrice($item->getProduct(), $cloneOrder->getCustomer()->getTier()) : array();
				$productArray['buyinprice'] = ProductBuyinPrice::getBuyinPrice($item->getId());
				$itemArray['product'] = $productArray;
				$clonOrderArray['items'][] = $itemArray;
			}
				
			$js .= ".setOriginalOrder(" . json_encode($clonOrderArray) . ")";
		}
		if($order instanceof Order && trim($order->getId()) !== '') {
			$orderArray = $order->getJson();
			//$orderArray['items'] = array_map(create_function('$a', 'return $a->getJson();'), OrderItem::getAllByCriteria('orderId = ?', array($order->getId())));
			$items = OrderItem::getAllByCriteria('orderId = ?', array($order->getId()));
			$orderArray['items'] = array();
			foreach($items as $item)
			{
				$itemArray = $item->getJson();
				$productArray = $itemArray['product'];
				$productArray['tierPrice'] = Core::getUser()->getStore()->getId() == 1 ? ProductTierPrice::getTierPrice($item->getProduct(), $order->getCustomer()->getTier()) : array();
				$productArray['buyinprice'] = ProductBuyinPrice::getBuyinPrice($item->getId());
				$itemArray['product'] = $productArray;
				$orderArray['items'][] = $itemArray;
			}
				
			$js .= ".setOrder(" . json_encode($orderArray) . ")";
		}
		$js .= ".init(" . json_encode($customer) . ")";
		if(!AccessControl::canAccessCreateOrderPage(Core::getRole())) {
			$js .= ".disableEverything(" . (in_array(Core::getRole()->getId(), array(Role::ID_ACCOUNTING, Role::ID_SALES, Role::ID_PURCHASING)) ? 'true' : '') . ")";
		} else if($order instanceof Order && trim($order->getId()) !== '' && intval($order->getStatus()->getId()) === OrderStatus::ID_CANCELLED ) {
			$js .= ".disableEverything()";
			$js .= ".showModalBox('<h4>Error</h4>', '<h4>This " . $order->getType()  . " has been " . $order->getStatus()->getName() . "!</h4><h4>No one can edit it anymore</h4>')";
		}
		$js .= ";";
		return $js;
	}
	/**
	 * Searching Customer
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 *
	 * @throws Exception
	 *
	 */
	public function searchCustomer($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$items = array();
			$pageNo = isset($param->CallbackParameter->pageNo) ? trim($param->CallbackParameter->pageNo) : 1;
			$searchTxt = isset($param->CallbackParameter->searchTxt) ? trim($param->CallbackParameter->searchTxt) : '';
			$stats = array();
			foreach(Customer::getAllByCriteria('(name like :searchTxt or email like :searchTxt) and storeId = :storeId', array('searchTxt' => $searchTxt . '%', 'storeId' => Core::getUser()->getStore()->getId()), true, $pageNo, DaoQuery::DEFAUTL_PAGE_SIZE, array('cust.name' => 'asc'), $stats) as $customer)
			{
				$items[] = $customer->getJson();
			}
			$results['items'] = $items;
			$results['pagination'] = $stats;
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * Searching searchProduct
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 *
	 * @throws Exception
	 *
	 */
	public function searchProduct($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$items = array();
			$searchTxt = isset($param->CallbackParameter->searchTxt) ? trim($param->CallbackParameter->searchTxt) : '';
			$customer = isset($param->CallbackParameter->customerId) ? Customer::get(trim($param->CallbackParameter->customerId)) : null;
			$where = 'pro_pro_code.code = :searchExact or pro.name like :searchTxt OR sku like :searchTxt';
			$params = array('searchExact' => $searchTxt, 'searchTxt' => '%' . $searchTxt . '%');
			$pageNo = isset($param->CallbackParameter->pageNo) ? trim($param->CallbackParameter->pageNo) : '1';
			$searchTxtArray = StringUtilsAbstract::getAllPossibleCombo(StringUtilsAbstract::tokenize($searchTxt));
			if(count($searchTxtArray) > 1)
			{
				foreach($searchTxtArray as $index => $comboArray)
				{
					$key = 'combo' . $index;
					$where .= ' OR pro.name like :' . $key;
					$params[$key] = '%' . implode('%', $comboArray) . '%';
				}
			}

			$supplierID = isset($param->CallbackParameter->supplierID) ? trim($param->CallbackParameter->supplierID) : '';
			Product::getQuery()->eagerLoad('Product.codes', 'left join');
			$stats = array();
			$products = Product::getAllByCriteria($where, $params, true, $pageNo, DaoQuery::DEFAUTL_PAGE_SIZE, array('pro.sku' => 'asc'), $stats);
			foreach($products as $product)
			{
				$jsonArray = $product->getJson();
				$jsonArray['lastOrderItemFromCustomer'] = array();
				if($customer instanceof Customer) {
					$jsonArray['customer'] = $customer->getJson();
					$jsonArray['tierPrice'] = Core::getUser()->getStore()->getId() == 1 ? ProductTierPrice::getTierPrice($product, $customer->getTier()) : array();
					$jsonArray['buyinprice'] = ProductBuyinPrice::getBuyinPrice($product->getId());
					$query = OrderItem::getQuery()->eagerLoad('OrderItem.order', 'inner join', 'ord', 'ord_item.orderId = ord.id and ord_item.active = 1 and ord.customerId = :custId and ord.type = :ordType and ord.storeId = ord_item.storeId and ord.storeId = :storeId');
					$orderItems = OrderItem::getAllByCriteria('productId = :prodId', array('custId' => $customer->getId(), 'prodId' => $product->getId(), 'ordType' => Order::TYPE_INVOICE, 'storeId' => Core::getUser()->getStore()->getId()), true, 1, 1, array('ord_item.id' => 'desc'));
					$jsonArray['lastOrderItemFromCustomer'] = count($orderItems) > 0 ? $orderItems[0]->getJson() : array();
				}
				$items[] = $jsonArray;
			}
			$results['items'] = $items;
			$results['pagination'] = $stats;
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * saveOrder
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 *
	 * @throws Exception
	 *
	 */
	public function saveOrder($sender, $param)
	{
		$results = $errors = array();
		try
		{
			Dao::beginTransaction();
			$customer = Customer::get(trim($param->CallbackParameter->customer->id));
			if(!$customer instanceof Customer)
				throw new Exception('Invalid Customer passed in!');
			if(!isset($param->CallbackParameter->type) || ($type = trim($param->CallbackParameter->type)) === '' || !in_array($type, Order::getAllTypes()))
				throw new Exception('Invalid type passed in!');
			$order = null;
			if(isset($param->CallbackParameter->orderId) && ($orderId = trim($param->CallbackParameter->orderId)) !== '') {
				if(!($order = Order::get($orderId)) instanceof Order)
					throw new Exception('Invalid Order to edit!');
				$currentUpdated = $order->getUpdated();
				$originalUpdated = trim($param->CallbackParameter->updated);
				$originalUpdated = new UDate($originalUpdated);
				if (!$currentUpdated->equal($originalUpdated))
				{
					throw new Exception('This ORDER has been changed by someone else, please reload this page again!');
				}
			}
			$orderCloneFrom = null;
			if(isset($param->CallbackParameter->orderCloneFromId) && ($orderCloneFromId = trim($param->CallbackParameter->orderCloneFromId)) !== '') {
				if(!($orderCloneFrom = Order::get($orderCloneFromId)) instanceof Order)
					throw new Exception('Invalid Order to clone from!');
			}
			$shipped = ((isset($param->CallbackParameter->shipped) && (intval($param->CallbackParameter->shipped)) === 1));
			$poNo = (isset($param->CallbackParameter->poNo) && (trim($param->CallbackParameter->poNo) !== '') ? trim($param->CallbackParameter->poNo) : '');
			if(isset($param->CallbackParameter->shippingAddr)) {
				$shippAddress = ($order instanceof Order ? $order->getShippingAddr() : null);
				$shippAddress = Address::create(
					$param->CallbackParameter->shippingAddr->street,
					$param->CallbackParameter->shippingAddr->city,
					$param->CallbackParameter->shippingAddr->region,
					$param->CallbackParameter->shippingAddr->country,
					$param->CallbackParameter->shippingAddr->postCode,
					$param->CallbackParameter->shippingAddr->contactName,
					$param->CallbackParameter->shippingAddr->contactNo,
					$param->CallbackParameter->shippingAddr->companyName,
					$shippAddress
				);
			}
			else
				$shippAddress = $customer->getShippingAddress();
			$printItAfterSave = false;
			if(isset($param->CallbackParameter->printIt))
				$printItAfterSave = (intval($param->CallbackParameter->printIt) === 1 ? true : false);
			if(!$order instanceof Order)
				$order = Order::create($customer, $type, null, '', OrderStatus::get(OrderStatus::ID_NEW), new UDate(), false, $shippAddress, $customer->getBillingAddress(), false, $poNo, $orderCloneFrom);
			else {
				$order->setType($type)
					->setPONo($poNo)
					->setShippingAddr($shippAddress)
					->save();
			}
			$totalPaymentDue = 0;
			foreach ($param->CallbackParameter->items as $item)
			{
				$product = Product::get(trim($item->product->id));
				if(!$product instanceof Product)
					throw new Exception('Invalid Product passed in!');
				if(isset($item->active) && intval($item->active) === 1 && intval($product->getActive()) !== 1 && $type === Order::TYPE_INVOICE)
					throw new Exception('Product(SKU:' . $product->getSku() . ') is DEACTIVATED, please change it to be proper product before converting it to a ' . $type . '!');

				$unitPrice = trim($item->unitPrice);
				$qtyOrdered = trim($item->qtyOrdered);
				$totalPrice = trim($item->totalPrice);
				$itemDescription = trim($item->itemDescription);

				if(intval($item->active) === 1)
				{
					if ($param->CallbackParameter->gstFree == false){
						$totalPaymentDue += $totalPrice * 1.1;
					}else{
						$totalPaymentDue += $totalPrice;
					}
					if($orderCloneFrom instanceof Order || !($orderItem = OrderItem::get($item->id)) instanceof OrderItem)
					{
						$orderItem = OrderItem::create($order, $product, $unitPrice, $qtyOrdered, $totalPrice, 0, null, $itemDescription);
					}
					else {
						$orderItem->setActive(intval($item->active))
							->setProduct($product)
							->setUnitPrice($unitPrice)
							->setQtyOrdered($qtyOrdered)
							->setTotalPrice($totalPrice)
							->setItemDescription($itemDescription)
							->setStore(Core::getUser()->getStore())
							->save();
						$existingSellingItems = SellingItem::getAllByCriteria('orderItemId = ? and storeId = ?', array($orderItem->getId(), Core::getUser()->getStore()->getId()));
						foreach($existingSellingItems as $sellingItem) { //DELETING ALL SERIAL NUMBER BEFORE ADDING
							$sellingItem->setActive(false)
								->save();
						}
					}
					$orderItem = OrderItem::get($orderItem->getId())->reCalMarginFromProduct()->resetCostNMarginFromKits()->save();
				} else {
					if($orderCloneFrom instanceof Order) {
						continue;
					}
					elseif(($orderItem = OrderItem::get($item->id)) instanceof OrderItem) {
						$orderItem->setActive(false)->save();
					}
				}
				
				if(isset($item->serials) && count($item->serials) > 0){
					foreach($item->serials as $serialNo)
						$orderItem->addSellingItem($serialNo)
							->save();
				}
				if($shipped === true) {
					$orderItem->setIsPicked(true)
						->save();
				}
			}

			if(isset($param->CallbackParameter->courierId))
			{
				$totalShippingCost = 0;
				$courier = null;
				if(is_numeric($courierId = trim($param->CallbackParameter->courierId))) {
					$courier = Courier::get($courierId);
					if(!$courier instanceof Courier)
						throw new Exception('Invalid Courier passed in!');
					$order->addInfo(OrderInfoType::ID_MAGE_ORDER_SHIPPING_METHOD, $courier->getName(), true);
				} else {
					$order->addInfo(OrderInfoType::ID_MAGE_ORDER_SHIPPING_METHOD, $courierId, true);
				}
				if(isset($param->CallbackParameter->totalShippingCost)) {
					$totalShippingCost = StringUtilsAbstract::getValueFromCurrency(trim($param->CallbackParameter->totalShippingCost));
					$order->addInfo(OrderInfoType::ID_MAGE_ORDER_SHIPPING_COST, StringUtilsAbstract::getCurrency($totalShippingCost), true);
				}
				if($shipped === true) {
					if(!$courier instanceof Courier)
						$courier = Courier::get(Courier::ID_LOCAL_PICKUP);
					if ($shippAddress instanceof Address)
						Shippment::create($shippAddress, $courier, '', new UDate(), $order, '');
				}
			}
			else
			{
				$courier = '';
				$totalShippingCost = 0;
			}
			
			$totalPaymentDue += $totalShippingCost;
			$order->setTotalAmount($totalPaymentDue)->setGstFree($param->CallbackParameter->gstFree)->save();
			if (trim($param->CallbackParameter->paymentMethodId))
			{
				$paymentMethod = PaymentMethod::get(trim($param->CallbackParameter->paymentMethodId));
				if(!$paymentMethod instanceof PaymentMethod)
					throw new Exception('Invalid PaymentMethod passed in!');
				$totalPaidAmount = trim($param->CallbackParameter->totalPaidAmount);
				//check if the payment is offset credit
				$paymentMethodId = $paymentMethod->getId();
				if ($paymentMethodId == PaymentMethod::ID_STORE_CREDIT)
				{
					$creditAvailable = $customer->getCreditPool() instanceof CreditPool ? doubleval($customer->getCreditPool()->getTotalCreditLeft()) : 0;
					if ($creditAvailable == 0 || $creditAvailable < $totalPaidAmount)
					{
						throw new Exception('The customer has not enough credit for this payment. The amount of credit left is : ' .  StringUtilsAbstract::getCurrency($creditAvailable));
					}
				}
				$order->addPayment($paymentMethod, $totalPaidAmount);
				$order = Order::get($order->getId());
				$order->addInfo(OrderInfoType::ID_MAGE_ORDER_PAYMENT_METHOD, $paymentMethod->getName(), true);
				$order->setPassPaymentCheck(1)->save();
				if($shipped === true)
					$order->setType(Order::TYPE_INVOICE);
			}
			else
			{
				$paymentMethod = '';
				$totalPaidAmount = 0;
			}
			$comments = (isset($param->CallbackParameter->comments) ? trim($param->CallbackParameter->comments) : '');
			$order = $order->addComment($comments, Comments::TYPE_SALES)
				->setTotalPaid($totalPaidAmount);
			if($shipped === true) {
				$order->setStatus(OrderStatus::get(OrderStatus::ID_SHIPPED));
			}

			if(isset($param->CallbackParameter->newMemo) && ($newMemo = trim($param->CallbackParameter->newMemo)) !== '')
				$order->addComment($newMemo, Comments::TYPE_MEMO);
			$order->save();
			$results['item'] = $order->getJson();
			if($printItAfterSave === true)
				$results['printURL'] = '/print/order/' . $order->getId() . '.html?pdf=1';
			$results['redirectURL'] = '/order/'. $order->getId() . '.html' . (trim($_SERVER['QUERY_STRING']) === '' ? '' : '?' . $_SERVER['QUERY_STRING']);
			
			// check whether the order can be changed into invoice
			if ($customer->getIsBlocked() && ($order->getType() === Order::TYPE_INVOICE) && (($order->getPassPaymentCheck() == false) || ($order->getTotalPaid() != $order->getTotalAmount())) )
				throw new Exception("Cannot change to INVOICE because the customer is BLOCKED and not fully paid to this order!<br>Please contact Admin or Accountant for assistance!");
			Dao::commitTransaction();
		}
		catch(Exception $ex)
		{
			Dao::rollbackTransaction();
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * cancelOrder
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 *
	 * @throws Exception
	 *
	 */
	public function cancelOrder($sender, $param)
	{
		$results = $errors = array();
		try
		{
			Dao::beginTransaction();
			if(!isset($param->CallbackParameter->orderId) || !($order = Order::get($param->CallbackParameter->orderId)) instanceof Order)
				throw new Exception('Invalid Order to CANCEL!');
			if(!isset($param->CallbackParameter->reason) || !($reason = trim($param->CallbackParameter->reason)) === '')
				throw new Exception('An reason for CANCELLING this ' . $order->getType() . ' is needed!');
			$order->setStatus(OrderStatus::get(OrderStatus::ID_CANCELLED))
				->save()
				->addComment(($msg = $order->getType() . ' is cancelled: ' . $reason), Comments::TYPE_SALES)
				->addLog($msg, Log::TYPE_SYSTEM, 'AUTO_GEN', __CLASS__ . '::' . __FUNCTION__);
			$results['item'] = $order->getJson();
			Dao::commitTransaction();
		}
		catch(Exception $ex)
		{
			Dao::rollbackTransaction();
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * Check whether the PONo has already been applied
	 * to any order no
	 *
	 * @param unknown $params
	 */
	public function checkPoNo($sender, $param)
	{
		$results = $errors = $params = array();
		try
		{
			Dao::beginTransaction();
			$searchTxt = isset($param->CallbackParameter->searchTxt) ? trim($param->CallbackParameter->searchTxt) : '';
			if($searchTxt === '')
				throw new Exception('SearchTxt is needed');
			$orderId = isset($param->CallbackParameter->orderId) ? trim($param->CallbackParameter->orderId) : '';
			$pageNo = isset($param->CallbackParameter->pageNo) ? trim($param->CallbackParameter->pageNo) : null;
			$pageSize = isset($param->CallbackParameter->pageSize) ? trim($param->CallbackParameter->pageSize) : DaoQuery::DEFAUTL_PAGE_SIZE;
			$stats = $items= array();
			$where = 'pONo = ?';
			$params[] = $searchTxt;
			if ($orderId != '') 
			{
				$where = $where . ' and orderId <> ?';
				$params[] = $orderId;
			}
			$items = Order::getAllByCriteria($where, $params, true, $pageNo, $pageSize, array(), $stats);
			$results = array();
			$results['items'] = array_map(create_function('$a', 'return $a->getJson();'), $items);
			$results['pagination'] = $stats;
			$results['pageStats'] = $stats;
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
