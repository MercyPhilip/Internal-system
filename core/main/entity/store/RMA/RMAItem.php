<?php
class RMAItem extends BaseEntityAbstract
{
	const BSTATUS_RECEIVING = 'RECEIVING';
	const BSTATUS_RECEIVED = 'RECEIVED';
	const BSTATUS_SHIPPED = 'SHIPPED';
	const BSTATUS_CLOSED = 'CLOSED';
	
	const SSTATUS_WAITINGRA = 'WAITINGRA';
	const SSTATUS_RECEIVEDRA = 'RECEIVEDRA';
	const SSTATUS_REPAIRING = 'REPAIRING';
	const SSTATUS_FIXED = 'FIXED';
	const SSTATUS_REPLACED = 'REPLACED';
	const SSTATUS_CLOSED = 'CLOSED';
	/**
	 * The RMA
	 *
	 * @var RMA
	 */
	protected $RMA;
	/**
	 * the order item this RMA is for
	 * @var unknown
	 */
	protected $orderItem = null;
	/**
	 * The product of this credit item
	 *
	 * @var Product
	 */
	protected $product;
	/**
	 * serial no of this item
	 * @var ReceivingItem
	 */
	protected $receivingItem = null;
	/**
	 * The Qty that we are crediting
	 *
	 * @var int
	 */
	private $qty;
	/**
	 * the unitCost, If an orderItem is linked, then it will take the orderitem's unitCost; Otherwise, it will take the current unitCost of the product
	 *
	 * @var double
	 */
	private $unitCost;
	/**
	 * The item description
	 *
	 * @var string
	 */
	private $itemDescription;
	/**
	 * The receivedDate
	 * 
	 * @var UDate
	 */
	private $receivedDate;
	/**
	 * BPC status
	 * @var string
	 */
	private $bstatus;
	/**
	 * Supplier Status
	 * @var string
	 */
	private $sstatus;
	/**
	 * serial No
	 * @var string
	 */
	private $serialNo;
	/**
	 * purchase order No
	 * @var string
	 */
	private $purchaseOrderNo;
	/**
	 * supplier name
	 * @var string
	 */
	private $supplier;
	/**
	 * supplier RMA No
	 * @var string
	 */
	private $supplierRMANo;
	/**
	 * new serial no
	 * @var string
	 */
	private $newSerialNo;
	/**
	 *  Getter for serial no
	 *
	 *  @return string
	 */
	public function getSerialNo()
	{
		return $this->serialNo;
	}
	/**
	 * Setter for serialNo
	 *
	 * @param string $value The serialNo
	 *
	 * @return RMAItem
	 */
	public function setSerialNo($value)
	{
		$this->serialNo = $value;
		return $this;
	}
	/**
	 *  Getter for new serial no
	 *
	 *  @return string
	 */
	public function getNewSerialNo()
	{
		return $this->newSerialNo;
	}
	/**
	 * Setter for new serialNo
	 *
	 * @param string $value The serialNo
	 *
	 * @return RMAItem
	 */
	public function setNewSerialNo($value)
	{
		$this->newSerialNo = $value;
		return $this;
	}
	/**
	 *  Getter for purchase order no
	 *
	 *  @return string
	 */
	public function getPurchaseOrderNo()
	{
		return $this->purchaseOrderNo;
	}
	/**
	 * Setter for purchase order no
	 *
	 * @param string $value The purchaseOrderNo
	 *
	 * @return RMAItem
	 */
	public function setPurchaseOrderNo($value)
	{
		$this->purchaseOrderNo = $value;
		return $this;
	}
	/**
	 *  Getter for supplier name
	 *
	 *  @return string
	 */
	public function getSupplier()
	{
		return $this->supplier;
	}
	/**
	 * Setter for supplier name
	 *
	 * @param string $value The supplier
	 *
	 * @return RMAItem
	 */
	public function setSupplier($value)
	{
		$this->supplier = $value;
		return $this;
	}
	/**
	 *  Getter for supplier RMA No
	 *
	 *  @return string
	 */
	public function getSupplierRMANo()
	{
		return $this->supplierRMANo;
	}
	/**
	 * Setter for supplierRMANo
	 *
	 * @param string $value The supplierRMANo
	 *
	 * @return RMAItem
	 */
	public function setSupplierRMANo($value)
	{
		$this->supplierRMANo = $value;
		return $this;
	}
	/**
	 *  Getter for bstatus
	 *  
	 *  @return string
	 */
	public function getBStatus()
	{
		return $this->bstatus;
	}
	/**
	 * Setter for BStatus
	 *
	 * @param string $value The bstatus
	 *
	 * @return RMAItem
	 */
	public function setBStatus($value)
	{
		$this->bstatus = $value;
		return $this;
	}
	/**
	 *  Getter for sstatus
	 *
	 *  @return string
	 */
	public function getSStatus()
	{
		return $this->sstatus;
	}
	/**
	 * Setter for sstatus
	 *
	 * @param string $value The sstatus
	 *
	 * @return RMAItem
	 */
	public function setSStatus($value)
	{
		$this->sstatus = $value;
		return $this;
	}
	/**
	 * Getter for RMA
	 *
	 * @return RMA
	 */
	public function getRMA()
	{
		$this->loadManyToOne('RMA');
	    return $this->RMA;
	}
	/**
	 * Setter for RMA
	 *
	 * @param RMA $value The RMA
	 *
	 * @return RMAItem
	 */
	public function setRMA(RMA $value)
	{
	    $this->RMA = $value;
	    return $this;
	}
	/**
	 * Getter for orderItem
	 *
	 * @return OrderItem
	 */
	public function getOrderItem()
	{
		$this->loadManyToOne('orderItem');
		return $this->orderItem;
	}
	/**
	 * Setter for orderItem
	 *
	 * @param unkown $value The orderItem
	 *
	 * @return RMAItem
	 */
	public function setOrderItem(OrderItem $value = null)
	{
		$this->orderItem = $value;
		return $this;
	}
	/**
	 * Getter for receivingItem
	 *
	 * @return ReceivingItem
	 */
	public function getReceivingItem()
	{
		$this->loadManyToOne('receivingItem');
		return $this->receivingItem;
	}
	/**
	 * Setter for receivingItem
	 *
	 * @param unkown $value The receivingItem
	 *
	 * @return RMAItem
	 */
	public function setReceivingItem(ReceivingItem $value = null)
	{
		$this->receivingItem = $value;
		return $this;
	}
	/**
	 * Getter for product
	 *
	 * @return Product
	 */
	public function getProduct()
	{
		$this->loadManyToOne('product');
		return $this->product;
	}
	/**
	 * Setter for product
	 *
	 * @param unkown $value The product
	 *
	 * @return RMAItem
	 */
	public function setProduct(Product $value)
	{
		$this->product = $value;
		return $this;
	}
	/**
	 * Getter for qty
	 *
	 * @return int
	 */
	public function getQty()
	{
		return $this->qty;
	}
	/**
	 * Setter for qty
	 *
	 * @param int $value The qty
	 *
	 * @return RMAItem
	 */
	public function setQty($value)
	{
		$this->qty = $value;
		return $this;
	}
	/**
	 * Getter for unitCost
	 *
	 * @return double
	 */
	public function getUnitCost()
	{
		return $this->unitCost;
	}
	/**
	 * Setter for unitCost
	 *
	 * @param double $value The unitCost
	 *
	 * @return RMAItem
	 */
	public function setUnitCost($value)
	{
		$this->unitCost = $value;
		return $this;
	}
	/**
	 * Getter for itemDescription
	 *
	 * @return string
	 */
	public function getItemDescription()
	{
		return $this->itemDescription;
	}
	/**
	 * Setter for itemDescription
	 *
	 * @param string $value The itemDescription
	 *
	 * @return RMAItem
	 */
	public function setItemDescription($value)
	{
		$this->itemDescription = $value;
		return $this;
	}
	/**
	 * The getter for receivedDate
	 *
	 * @return UDate
	 */
	public function getReceivedDate ()
	{
	    return new UDate(trim($this->receivedDate));
	}
	/**
	 * Setter for receivedDate
	 * 
	 * @param mixed $value The new value of receivedDate
	 *
	 * @return RMAItem
	 */
	public function setReceivedDate ($value)
	{
	    $this->receivedDate = $value;
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(!is_numeric($this->getQty()))
			throw new EntityException('Qty of the RMAItem needs to be a integer.');
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::postSave()
	 */
	public function postSave()
	{
// 		if(trim($this->getReceivedDate()) !== trim(UDate::zeroDate())) {
// 			if(self::countByCriteria('RMAId = ? and receivedDate = ? and storeId = ?', array($this->getRMA()->getId(), trim(UDate::zeroDate()), Core::getUser()->getStore()->getId())) > 0)
// 				$this->getRMA()
// 					->setStatus(RMA::STATUS_RECEIVING)
// 					->save()
// 					->addComment('Setting Status to "' . RMA::STATUS_RECEIVING . '", as received one of items');
// 			else
// 				$this->getRMA()
// 					->setStatus(RMA::STATUS_RECEIVED)
// 					->save()
// 					->addComment('Setting Status to "' . RMA::STATUS_RECEIVED . '", as no more item to receive');
// 		}
//		$this->getRMA()->addComment('Setting BPC Status to "' . $this->getBStatus() . '", Supplier Status to' . $this->getSStatus() . '"');
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'ra_item');

		DaoMap::setManyToOne('RMA', 'RMA', 'ra_item_ra');
		DaoMap::setManyToOne('orderItem', 'OrderItem', 'ra_item_ord_item', true);
		DaoMap::setManyToOne('product', 'Product', 'ra_pro');
		DaoMap::setManyToOne('receivingItem', 'ReceivingItem', 'ra_item_rev', true);
		DaoMap::setIntType('qty');
		DaoMap::setIntType('unitCost', 'double', '10,4');
		DaoMap::setStringType('itemDescription', 'varchar', '255');
		DaoMap::setStringType('bstatus', 'varchar', '30');
		DaoMap::setStringType('sstatus', 'varchar', '30');
		DaoMap::setStringType('serialNo', 'varchar', '100');
		DaoMap::setStringType('purchaseOrderNo', 'varchar', '50');
		DaoMap::setStringType('supplier', 'varchar', '50');
		DaoMap::setStringType('supplierRMANo', 'varchar', '50');
		DaoMap::setStringType('newSerialNo', 'varchar', '100');
		DaoMap::setDateType('receivedDate');
		DaoMap::setManyToOne('store', 'Store', 'si');

		parent::__loadDaoMap();

		DaoMap::createIndex('qty');
		DaoMap::createIndex('unitCost');
		DaoMap::createIndex('receivedDate');
		DaoMap::createIndex('bstatus');
		DaoMap::createIndex('sstatus');
		DaoMap::createIndex('serialNo');
		DaoMap::createIndex('purchaseOrderNo');
		DaoMap::createIndex('supplier');
		DaoMap::createIndex('supplierRMANo');
		DaoMap::createIndex('newSerialNo');

		DaoMap::commit();
	}
	/**
	 * Creating a RMA Item
	 *
	 * @param RMA     $rma
	 * @param Product $product
	 * @param int     $qty
	 * @param double  $itemDescription
	 * @param duble   $unitCost
	 *
	 * @return RMAItem
	 */
	public static function create(RMA $rma, Product $product, $qty, $itemDescription = '', $unitCost = null, $receivingItem = null, $bstatus = '', $sstatus = '', $serialNo = null, $supplier = null, $supplierRMANo = null, $purchaseOrderNo = null, $newSerialNo = null)
	{
		$item = new RMAItem();
		if ($receivingItem) $item->setReceivingItem($receivingItem);
		$item->setRMA($rma)
			->setProduct($product)
			->setQty($qty)
			->setStore(Core::getUser()->getStore())
			->setBStatus($bstatus)
			->setSStatus($sstatus)
			->setItemDescription(trim($itemDescription))
			->setUnitCost($unitCost !== null ? $unitCost : $product->getUnitCost())
			->setSerialNo($serialNo)
			->setPurchaseOrderNo($purchaseOrderNo)
			->setSupplier($supplier)
			->setSupplierRMANo($supplierRMANo)
			->setNewSerialNo($newSerialNo)
			->save();
		$msg = 'A RMAItem has been created with ' . $qty . 'Product(s) (SKU=' . $product->getSku() . ', ID=' . $product->getId() . '), unitCost=' . ($item->getUnitCost() !== null ? StringUtilsAbstract::getCurrency($item->getUnitCost()) : NULL);
		$rma->addComment($msg, Comments::TYPE_SYSTEM)
			->addLog($msg, Comments::TYPE_SYSTEM);
		return $item;
	}
	/**
	 * Creating a RMA Item
	 *
	 * @param RMA       $rma
	 * @param OrderItem $product
	 * @param int       $qty
	 * @param double    $itemDescription
	 * @param duble     $unitCost
	 *
	 * @return RMAItem
	 */
	public static function createFromOrderItem(RMA $rma, OrderItem $orderItem, $qty, $itemDescription = '', $unitCost = null, $receivingItem = null, $bstatus = '', $sstatus = '')
	{
		$item = new RMAItem();
		if ($receivingItem) $item->setReceivingItem($receivingItem);
		$item->setRMA($rma)
			->setOrderItem($orderItem)
			->setProduct($orderItem->getProduct())
			->setQty($qty)
			->setBStatus($bstatus)
			->setSStatus($sstatus)
			->setStore(Core::getUser()->getStore())
			->setItemDescription(trim($itemDescription))
			->setUnitCost($unitCost !== null ? $unitCost : $orderItem->getUnitCost())
			->save();
		$msg = 'A RMAItem has been created based on OrderItem(ID=' . $orderItem->getId() . ', OrderNo=' . $orderItem->getOrder()->getOrderNo() . ') with ' . $qty . 'Product(s) (SKU=' . $product->getSku() . ', ID=' . $product->getId() . '), unitCost=' . StringUtilsAbstract::getCurrency($item->getUnitCost()) ;
		$rma->addComment($msg, Comments::TYPE_SYSTEM)
			->addLog($msg, Comments::TYPE_SYSTEM);
		return $item;
	}
	/**
	 * get RMA Items by RMA
	 *
	 * @param RMA|string $rma
	 * @return Ambigous <NULL, unknown>
	 */
	public static function getByRMA($rma)
	{
		$rma = $rma instanceof RMA ? $rma : RMA::get(trim($rma));
		$rma = $rma instanceof RMA ? $rma : (count($rmas = RMA::getAllByCriteria('RMAId = ? and storeId = ?', array(trim($rma), Core::getUser()->getStore()->getId()), true, 1, 1)) > 0 ? $rmas[0] : null);
		return $rma instanceof RMA ? (count($items = self::getAllByCriteria('RMAId = ? and storeId = ?', array($rma->getId(), Core::getUser()->getStore()->getId()), true)) > 0 ? $items : null) : null;
	}
	/**
	 * Getting all the BPC statuses for the RMA
	 *
	 * @return multitype:string
	 */
	public static function getAllBStatuses()
	{
		return array(self::BSTATUS_RECEIVING, self::BSTATUS_RECEIVED, self::BSTATUS_SHIPPED, self::BSTATUS_CLOSED);
	}
	/**
	 * Getting all the supplier statuses for the RMA
	 *
	 * @return multitype:string
	 */
	public static function getAllSStatuses()
	{
		return array(self::SSTATUS_WAITINGRA, self::SSTATUS_RECEIVEDRA, self::SSTATUS_REPAIRING, self::SSTATUS_FIXED, self::SSTATUS_REPLACED, self::SSTATUS_CLOSED);
	}
}