<?php
/**
 * This is the OrderController
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class ReceivingController extends BPCPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'purchaseorders.receiving';
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
		$js .= "pageJs";
			$js .= ".setHTMLID('itemDiv', 'detailswrapper')";
			$js .= ".setHTMLID('searchPanel', 'search_panel')";
			$js .= ".setHTMLID('paymentPanel', 'payment_panel')";
			$js .= ".setHTMLID('supplierInfoPanel', 'supplier_info_panel')";
			$js .= ".setHTMLID('partsTable', 'order_change_details_table')";
			$js .= ".setHTMLID('barcodeInput', 'barcode_input')";
			$js .= ".setCallbackId('searchPO', '" . $this->searchPOBtn->getUniqueID() . "')";
			$js .= ".setCallbackId('searchProduct', '" . $this->searchProductBtn->getUniqueID() . "')";
			$js .= ".setCallbackId('saveOrder', '" . $this->saveOrderBtn->getUniqueID() . "')";
			$js .= ".setCallbackId('checkProduct', '" . $this->checkProductBtn->getUniqueID() . "')";
			if(isset($this->Request['poid']) && ($po = PurchaseOrder::get($this->Request['poid'])) instanceof PurchaseOrder)
				$js .= ".init(" . json_encode($this->_getPOJson($po)) . ");";
			else
				$js .= ".init();";
		return $js;
	}
	/**
	 * Searching PO
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 *
	 * @throws Exception
	 *
	 */
	public function searchPO($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$items = array();
			$searchTxt = isset($param->CallbackParameter->searchTxt) ? trim($param->CallbackParameter->searchTxt) : '';
			if($searchTxt === '')
				$results['items'] = '';
			else {
				PurchaseOrder::getQuery()->eagerLoad('PurchaseOrder.supplier', 'inner join', 'po_sup', 'po.supplierId = po_sup.id');
				$pos = PurchaseOrder::getAllByCriteria('(po.purchaseOrderNo like :searchTxt OR po.supplierRefNo like :searchTxt OR po_sup.name like :suplierName) AND (status = :statusReceiving OR status = :statusOrdered) AND po.storeId = :storeId', array('searchTxt' => $searchTxt . '%', 'suplierName' => '%' . $searchTxt . '%', 'statusReceiving' => PurchaseOrder::STATUS_RECEIVING, 'statusOrdered' => PurchaseOrder::STATUS_ORDERED, 'storeId' => Core::getUser()->getStore()->getId()), true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array('id'=> 'desc'));
				foreach($pos as $po)
				{
					if(!$po instanceof PurchaseOrder)
						throw new Exception('Invalid PurchaseOrder passed in!');
					$items[] = $this->_getPOJson($po);
				}
				$results['items'] = $items;
			}
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * Getting the JSon for PurchaseOrder
	 *
	 * @param PurchaseOrder $po
	 *
	 * @return Ambigous <multitype:, multitype:multitype:string  NULL >
	 */
	private function _getPOJson(PurchaseOrder $po)
	{
		$array = $po->getJson();
		$array['totalProductCount'] = $po->getTotalProductCount();
		$array['totalReceivedValue'] = $po->getTotalRecievedValue();

		$array['purchaseOrderItem'] = array();
		foreach (PurchaseOrderItem::getAllByCriteria('po_item.purchaseOrderId = :purchaseOrderId and po_item.storeId = :storeId', array('purchaseOrderId'=> $po->getId(), 'storeId' => Core::getUser()->getStore()->getId() )) as $purchaseOrderItem)
		{
			$product = $purchaseOrderItem->getProduct();
			$EANcodes = ProductCode::getAllByCriteria('pro_code.productId = :productId and pro_code.typeId = :typeId', array('productId'=> $product->getId(), 'typeId'=> ProductCodeType::ID_EAN), true, 1, 1);
			$EANcodes = count($EANcodes) ? $EANcodes[0]->getCode() : '';
			$UPCcodes = ProductCode::getAllByCriteria('pro_code.productId = :productId and pro_code.typeId = :typeId', array('productId'=> $product->getId(), 'typeId'=> ProductCodeType::ID_UPC), true, 1, 1);
			$UPCcodes = count($UPCcodes) ? $UPCcodes[0]->getCode() : '';
			$warehouseLocations = PreferredLocation::getAllByCriteria('productId = :productId and typeId = :typeId and storeId = :storeId', array('productId'=> $product->getId(), 'typeId'=> PreferredLocationType::ID_WAREHOUSE, 'storeId' => Core::getUser()->getStore()->getId()), true, 1, 1);
			$warehouseLocation = (count($warehouseLocations) > 0 && $warehouseLocations[0]->getLocation() instanceof Location) ? $warehouseLocations[0]->getLocation()->getName() : '';
			$productArray = $product->getJson();
			$productArray['codes'] = array('EAN'=>$EANcodes, 'UPC'=>$UPCcodes);
			$productArray['warehouseLocation'] = $warehouseLocation;

			$array['purchaseOrderItem'][] = array('purchaseOrderItem'=> $purchaseOrderItem->getJson(), 'product'=> $productArray);
		}
		return $array;
	}
	/**
	 * check product: if the PO contain such product
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 *
	 * @throws Exception
	 *
	 */
	public function checkProduct($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$items = array();
			$purchaseOrder = PurchaseOrder::get(trim($param->CallbackParameter->purchaseOrder->id));
			if(!$purchaseOrder instanceof PurchaseOrder)
				throw new Exception('Invalid PurchaseOrder passed in!');
			$product = Product::get(trim($param->CallbackParameter->product->id));
			if(!$product instanceof Product)
				throw new Exception('Invalid Product passed in!');
			$results['count'] = PurchaseOrderItem::countByCriteria('purchaseOrderId = :purchaseOrderId and productId = :productId and storeId = :storeId', array('purchaseOrderId' => $purchaseOrder->getId(), 'productId' => $product->getId(), 'storeId' => Core::getUser()->getStore()->getId()));
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

			$where = 'pro_pro_code.code = :searchExact or pro.name like :searchTxt OR sku like :searchTxt';
			$params = array('searchExact' => $searchTxt , 'searchTxt' => '%' . $searchTxt . '%');

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
			Product::getQuery()->eagerLoad('Product.codes', 'left join');
			$products = Product::getAllByCriteria($where, $params, true, 1, DaoQuery::DEFAUTL_PAGE_SIZE, array('pro.sku' => 'asc'));

			foreach($products as $product)
			{
				if(!$product instanceof Product)
					throw new Exception('Invalid Product passed in!');
				$EANcodes = ProductCode::getAllByCriteria('pro_code.productId = :productId and pro_code.typeId = :typeId', array('productId'=> $product->getId(), 'typeId'=> ProductCodeType::ID_EAN), true, 1, 1);
				$EANcodes = count($EANcodes) > 0 ? $EANcodes[0]->getCode() : '';

				$UPCcodes = ProductCode::getAllByCriteria('pro_code.productId = :productId and pro_code.typeId = :typeId', array('productId'=> $product->getId(), 'typeId'=> ProductCodeType::ID_UPC), true, 1, 1);
				$UPCcodes = count($UPCcodes) > 0 ? $UPCcodes[0]->getCode() : '';

				$array = $product->getJson();
				$array['codes'] = array('EAN'=>$EANcodes, 'UPC'=>$UPCcodes);
				$items[] = $array;
			}
			$results['items'] = $items;
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
		try {
			Dao::beginTransaction();

			$items = array();
			$purchaseOrder = PurchaseOrder::get(trim($param->CallbackParameter->purchaseOrder->id));
			if(!$purchaseOrder instanceof PurchaseOrder)
				throw new Exception('Invalid PurchaseOrder passed in!');
			$comment = trim($param->CallbackParameter->comments);
			$purchaseOrder->addComment(Comments::TYPE_WAREHOUSE, $comment);
			$products = $param->CallbackParameter->products;

			$outStandingOrders = array();
			$invoiceNos = array();
			foreach ($products->matched as $item) {
				$product = Product::get(trim($item->product->id));
				$purchaseOrderItem = PurchaseOrderItem::get(trim($item->product->poItemId));
				if(!$product instanceof Product)
					throw new Exception('Invalid Product passed in!');

				if(isset($item->product->EANcode) ) {
					$EANcode = trim($item->product->EANcode);
					$productcodes = ProductCode::getAllByCriteria('pro_code.productId = :productId and pro_code.typeId = :typeId', array('productId'=> $product->getId(), 'typeId'=> ProductCodeType::ID_EAN), true, 1, 1);
					if(count($productcodes) > 0) {
						$productcodes[0]->setCode($EANcode)->save();
					} else {
						ProductCode::create($product, ProductCodeType::get(ProductCodeType::ID_EAN), $EANcode);
					}
				}
				if(isset($item->product->UPCcode) ) {
					$UPCcode = trim($item->product->UPCcode);
					$productcodes = ProductCode::getAllByCriteria('pro_code.productId = :productId and pro_code.typeId = :typeId', array('productId'=> $product->getId(), 'typeId'=> ProductCodeType::ID_UPC), true, 1, 1);
					if(sizeof($productcodes)) {
						$productcodes[0]->setCode($UPCcode)->save();
					} else {
						ProductCode::create($product, ProductCodeType::get(ProductCodeType::ID_UPC), $UPCcode);
					}
				}
				if(isset($item->product->warehouseLocation) && ($locationName = trim($item->product->warehouseLocation)) !== '') {
					$locs = Location::getAllByCriteria('name = ? and storeId = ?', array($locationName, Core::getUser()->getStore()->getId()), true, 1, 1);
					$loc = (count($locs) > 0 ? $locs[0] : Location::create($locationName, $locationName));
					$product->addLocation(PreferredLocationType::get(PreferredLocationType::ID_WAREHOUSE), $loc);
				}
				$serials = $item->serial;
				$totalQty = 0;
				foreach ($serials as $serial) {
					$qty = trim($serial->qty);
					$totalQty += intval($qty);
					$serialNo = trim($serial->serialNo);
					$unitPrice = trim($serial->unitPrice);
					$invoiceNo = trim($serial->invoiceNo);
					$invoiceNos[] = $invoiceNo;
					$comments = trim($serial->comments);
					ReceivingItem::create($purchaseOrder, $purchaseOrderItem, $product, $unitPrice, $qty, $serialNo, $invoiceNo, $comments);
				}
				
				OrderItem::getQuery()->eagerLoad('OrderItem.order', 'inner join', 'ord', 'ord.id = ord_item.orderId and ord.active = 1 and ord.type = :ordType and ord_item.productId = :productId and ord.statusId in ( :statusId1, :statusId2, :statusId3) and ord.storeId = :storeId');
				$orderItems = OrderItem::getAllByCriteria('ord_item.active = 1 and ord.storeId = ord_item.storeId', array(
						'ordType' => Order::TYPE_INVOICE
						,'productId' => $product->getId()
						,'statusId1' => OrderStatus::ID_INSUFFICIENT_STOCK
						,'statusId2' => OrderStatus::ID_ETA
						,'statusId3' => OrderStatus::ID_STOCK_CHECKED_BY_PURCHASING
						,'storeId' => Core::getUser()->getStore()->getId()
				));
				if(count($orderItems) > 0) {
					$orders = array();
					foreach($orderItems as $orderItem) {
						if(!array_key_exists($orderItem->getOrder()->getId(), $orders))
							$orders[$orderItem->getOrder()->getId()] = $orderItem->getOrder()->getJson();
					}
					$outStandingOrders[$product->getId()] = array('product' => $product->getJson(), 'recievedQty' => $totalQty, 'outStandingOrders' => array_values($orders));
				}
				
			}
			

			foreach ($purchaseOrder->getItems() as $poItem){
				$purchaseOrderItem = PurchaseOrderItem::get($poItem->getId());
				if($purchaseOrderItem->getReceivedQty() >= $poItem->getQty()){
					$productEta = ProductEta::getAllByCriteria('purchaseOrderId = ? and purchaseOrderItemId = ?', array($purchaseOrder->getId(),$poItem->getId()), true, 1, 1);
					if(count($productEta) > 0){
						$productEta[0]->setReceived(1)
						->save();
					}
				}
			}
				
			$stock = $product->getStock();
			if ($stock instanceof ProductStockInfo)
			{
				if($stock->getStockOnHand() > 5){
					$status = ProductStatus::get(2);
				}else {
					$status = ProductStatus::get(3);
				}
					$stock->setStatus($status);
					$stock->save();				
			}
			
			$results['outStandingOrders'] = count($outStandingOrders) > 0 ? array_values($outStandingOrders) : array();
			$results['item'] = PurchaseOrder::get($purchaseOrder->getId())->getJson();
			$invoiceNos = array_unique($invoiceNos);
			$results['invoiceNos'] = $invoiceNos;

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