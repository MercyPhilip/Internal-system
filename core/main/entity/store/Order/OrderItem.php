<?php
/**
 * Entity for OrderItem
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class OrderItem extends BaseEntityAbstract
{
	/**
	 * The order
	 *
	 * @var Order
	 */
	protected $order;
	/**
	 * The product
	 *
	 * @var Product
	 */
	protected $product;
	/**
	 * The quantity that orderred
	 *
	 * @var int
	 */
	private $qtyOrdered;
	/**
	 * The unit price for that product
	 *
	 * @var number
	 */
	private $unitPrice;
	/**
	 * The total price for that product
	 *
	 * @var number
	 */
	private $totalPrice;
	/**
	 * The ETA of the product
	 *
	 * @var UDate
	 */
	private $eta = null;
	/**
	 * Whether the warehouse has picked this item for shipping
	 *
	 * @var bool
	 */
	private $isPicked = false;
	/**
	 * Whether the warehouse has shipped
	 *
	 * @var bool
	 */
	private $isShipped = false;
	/**
	 * Whether this item has been ordered by purchasing
	 *
	 * @var bool
	 */
	private $isOrdered = false;
	/**
	 * The magento order_item_id
	 *
	 * @var int
	 */
	private $mageOrderId = 0;
	/**
	 * The margin of each sale item
	 *
	 * @var item
	 */
	private $margin = 0;
	/**
	 * The item description of the order item
	 *
	 * @var string
	 */
	private $itemDescription = '';
	/**
	 * The product's unitCost
	 *
	 * @var double
	 */
	private $unitCost;
	/**
	 * Getter for order
	 *
	 * @return Order
	 */
	public function getOrder()
	{
		$this->loadManyToOne('order');
	    return $this->order;
	}
	/**
	 * Setter for order
	 *
	 * @param Order $value The order
	 *
	 * @return OrderItem
	 */
	public function setOrder($value)
	{
	    $this->order = $value;
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
	 * @param Product $value The product
	 *
	 * @return OrderItem
	 */
	public function setProduct($value)
	{
	    $this->product = $value;
	    return $this;
	}
	/**
	 * Getter for qtyOrdered
	 *
	 * @return int
	 */
	public function getQtyOrdered()
	{
	    return $this->qtyOrdered;
	}
	/**
	 * Setter for qtyOrdered
	 *
	 * @param int $value The qtyOrdered
	 *
	 * @return OrderItem
	 */
	public function setQtyOrdered($value)
	{
	    $this->qtyOrdered = $value;
	    return $this;
	}
	/**
	 * Getter for unitPrice
	 *
	 * @return number
	 */
	public function getUnitPrice()
	{
	    return $this->unitPrice;
	}
	/**
	 * Setter for unitPrice
	 *
	 * @param number $value The unitPrice
	 *
	 * @return OrderItem
	 */
	public function setUnitPrice($value)
	{
	    $this->unitPrice = $value;
	    return $this;
	}
	/**
	 * Getter for totalPrice
	 *
	 * @return number
	 */
	public function getTotalPrice()
	{
	    return $this->totalPrice;
	}
	/**
	 * Setter for totalPrice
	 *
	 * @param number $value The totalPrice
	 *
	 * @return OrderItem
	 */
	public function setTotalPrice($value)
	{
	    $this->totalPrice = $value;
	    return $this;
	}
	/**
	 * Getter for eta
	 *
	 * @return UDate
	 */
	public function getEta()
	{
		if($this->eta === null || $this->eta === '' )
			return null;
		if(is_string($this->eta))
			$this->eta = new UDate($this->eta);
	    return $this->eta;
	}
	/**
	 * Setter for eta
	 *
	 * @param string $value The eta
	 *
	 * @return OrderItem
	 */
	public function setEta($value)
	{
	    $this->eta = $value;
	    return $this;
	}
	/**
	 * Getter for isPicked
	 *
	 * @return Bool
	 */
	public function getIsPicked()
	{
	    return trim($this->isPicked) === '1';
	}
	/**
	 * Setter for isPicked
	 *
	 * @param string $value The isPicked
	 *
	 * @return OrderItem
	 */
	public function setIsPicked($value)
	{
	    $this->isPicked = $value;
	    return $this;
	}
	/**
	 * Getter for isShipped
	 *
	 * @return Bool
	 */
	public function getIsShipped()
	{
	    return trim($this->isShipped) === '1';
	}
	/**
	 * Setter for isShipped
	 *
	 * @param string $value The isShipped
	 *
	 * @return OrderItem
	 */
	public function setIsShipped($value)
	{
	    $this->isShipped = $value;
	    return $this;
	}
	/**
	 * Getter for isOrdered
	 *
	 * @return book
	 */
	public function getIsOrdered()
	{
	    return trim($this->isOrdered) === '1';
	}
	/**
	 * Setter for isOrdered
	 *
	 * @param bool $value The isOrdered
	 *
	 * @return OrderItem
	 */
	public function setIsOrdered($value)
	{
	    $this->isOrdered = $value;
	    return $this;
	}
	/**
	 * Getter for mageOrderId
	 *
	 * @return
	 */
	public function getMageOrderId()
	{
	    return $this->mageOrderId;
	}
	/**
	 * Setter for mageOrderId
	 *
	 * @param int $value The mageOrderId
	 *
	 * @return OrderItem
	 */
	public function setMageOrderId($value)
	{
	    $this->mageOrderId = $value;
	    return $this;
	}
	/**
	 * Getter for margin
	 *
	 * @return double
	 */
	public function getMargin()
	{
	    return $this->margin;
	}
	/**
	 * Setter for margin
	 *
	 * @param int $value The margin
	 *
	 * @return OrderItem
	 */
	public function setMargin($value)
	{
	    $this->margin = $value;
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
	 * @param int $value The itemDescription
	 *
	 * @return OrderItem
	 */
	public function setItemDescription($value)
	{
	    $this->itemDescription = $value;
	    return $this;
	}

	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::getJson()
	 */
	public function getJson($extra = array(), $reset = false)
	{
		$array = $extra;
	    if(!$this->isJsonLoaded($reset))
	    {
	    	$array['product'] = $this->getProduct() instanceof Product ? $this->getProduct()->getJson() : null;
	    	$array['order'] = $this->getOrder() instanceof Order ? $this->getOrder()->getJson() : null;
	    	$array['sellingitems'] = array_map(create_function('$a', 'return $a->getJson();'), $this->getSellingItems());
	    }
	    return parent::getJson($array, $reset);
	}
	/**
	 * Add a selling item
	 *
	 * @param string      $serialNo
	 * @param string      $description
	 * @param SellingItem $newSellingItem
	 *
	 * @return OrderItem
	 */
	public function addSellingItem($serialNo, $description = '', SellingItem &$newSellingItem = null)
	{
		$newSellingItem = SellingItem::create($this, $serialNo, $description);
		return self::get($this->getId());
	}
	/**
	 * Getting the selling items
	 *
	 * @param string $serialNo
	 * @param string $description
	 * @param string $activeOnly
	 * @param int    $pageNo
	 * @param int    $pageSize
	 * @param array  $orderBy
	 * @param array  $stats
	 * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
	 */
	public function getSellingItems($serialNo = '', $description = '', $activeOnly = true, $pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array(), &$stats = array())
	{
		return SellingItem::getSellingItems($this, $serialNo, $description, null, null, $activeOnly, $pageNo, $pageSize, $orderBy, $stats);
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
	 * @return OrderItem
	 */
	public function setUnitCost($value)
	{
	    $this->unitCost = $value;
	    return $this;
	}
	/**
	 * ReCalMargin
	 *
	 * @return OrderItem
	 */
	public function reCalMargin()
	{
		$this->setMargin(StringUtilsAbstract::getValueFromCurrency($this->getTotalPrice()) - StringUtilsAbstract::getValueFromCurrency($this->getUnitCost()) * 1.1 * intval($this->getQtyOrdered()));
		return $this;
	}
	/**
	 * The cal margin from product
	 *
	 * @return OrderItem
	 */
	public function reCalMarginFromProduct()
	{
		if(!$this->getProduct() instanceof Product)
			return $this;
		$this->setUnitCost($this->getProduct()->getUnitCost())
			->reCalMargin();
		return $this;
	}
	/**
	 * Reset the CostNMargin from all the Kits in Selling Items
	 * 
	 * @return OrderItem
	 */
	public function resetCostNMarginFromKits()
	{
		if(!$this->getProduct() instanceof Product || intval($this->getProduct()->getIsKit()) !== 1)
			return $this;
		$totalKitsCost = 0;
		$totalNoOfKits = 0;
		foreach(SellingItem::getAllByCriteria('orderItemId = ?', array($this->getId())) as $sellingItem) {
			if(!($kit = $sellingItem->getKit()) instanceof Kit)
				continue;
			$totalKitsCost = $totalKitsCost + $kit->getCost();
			$totalNoOfKits++;
		}
		$this->setUnitCost(intval($totalNoOfKits) === 0 ? 0 : ($this->getProduct()->getUnitCost()) / $totalNoOfKits )
			->reCalMargin();
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(trim($this->getMageOrderId()) === '')
			$this->setMageOrderId('0');

		//when brandnew, calculate margin
		if(trim($this->getUnitCost()) === '') {
			$this->reCalMarginFromProduct();
		}

		if(trim($this->getId()) === '') {
			if(trim($this->getItemDescription()) === '')
				$this->setItemDescription($this->getProduct()->getName());
		} else if (intval($this->getActive()) === 1) { //if the isPicked changed
			$product = $this->getProduct();
			$kitCount = 0;
			//for picked
			if(self::countByCriteria('id = ? and isPicked != ?', array($this->getId(), $this->getIsPicked())) > 0) {
				$kitCount = ($kitCount === 0 ? SellingItem::countByCriteria('orderItemId = ? and kitId is not null and active = 1 ', array($this->getId())) : $kitCount);
				if(intval($product->getIsKit()) === 1 && intval($kitCount) !== intval($this->getQtyOrdered()))
					throw new EntityException($this->getQtyOrdered() . ' Kit(s) needs to be scanned to this OrderItem(SKU=' . $this->getProduct()->getSku() . ', unitPrice=' . StringUtilsAbstract::getCurrency($this->getUnitPrice()) . ', qty=' . $this->getQtyOrdered() . ') before it can be marked as PICKED, but got:' . $kitCount);
				//we are picking this product
				if(intval($this->getIsPicked()) === 1) {
					$product->picked($this->getQtyOrdered(), '', $this);
					$this->addLog('This item is now marked as picked', Log::TYPE_SYSTEM, 'Auto Log', __CLASS__ . '::' . __FUNCTION__);
				} else {
					$product->picked(0 - $this->getQtyOrdered(), '', $this);
					$this->addLog('This item is now Un-marked as picked', Log::TYPE_SYSTEM, 'Auto Log', __CLASS__ . '::' . __FUNCTION__);
				}
			}
			//for shipped
			if(self::countByCriteria('id = ? and isShipped != ?', array($this->getId(), $this->getIsShipped())) > 0) {
				$kitCount = ($kitCount === 0 ? SellingItem::countByCriteria('orderItemId = ? and kitId is not null and active = 1 ', array($this->getId())) : $kitCount);
				if(intval($product->getIsKit()) === 1 && intval($kitCount) !== intval($this->getQtyOrdered()))
					throw new EntityException($this->getQtyOrdered() . ' Kit(s) needs to be scanned to this OrderItem(ID=' . $this->getId() . ') before it can be marked as SHIPPED, but got:' . $kitCount);
				//we are picking this product
				if(intval($this->getIsShipped()) === 1) {
					$product->shipped($this->getQtyOrdered(), '', $this);
					$this->addLog('This item is now marked as SHIPPED', Log::TYPE_SYSTEM, 'Auto Log', __CLASS__ . '::' . __FUNCTION__);
				} else {
					$product->shipped(0 - $this->getQtyOrdered(), '', $this);
					$this->addLog('This item is now Un-marked as SHIPPED', Log::TYPE_SYSTEM, 'Auto Log', __CLASS__ . '::' . __FUNCTION__);
				}
			}
		} else { //if the orderitem is been deactivated
			if(self::countByCriteria('id = ? and active != ?', array($this->getId(), $this->getActive())) > 0) {
				if(self::countByCriteria('id = ? and isShipped = 1', array($this->getId())) > 0) {
					$msg = 'This item is now Un-marked as SHIPPED, as OrderItem(Order: ' . $this->getOrder()->getOrderNo() . ' SKU: ' . $this->getProduct()->getSku() . ', Qty: ' . $this->getQtyOrdered() . ') is now Deactivated';
					$product->shipped(0 - $this->getQtyOrdered(), $msg, $this);
					$this->addLog($msg, Log::TYPE_SYSTEM, 'Auto Log', __CLASS__ . '::' . __FUNCTION__);
				}
				if(self::countByCriteria('id = ? and isPicked = 1', array($this->getId())) > 0) {
					$msg = 'This item is now Un-PICKED, as OrderItem(Order: ' . $this->getOrder()->getOrderNo() . ' SKU: ' . $this->getProduct()->getSku() . ', Qty: ' . $this->getQtyOrdered() . ') is now Deactivated';
					$product->shipped(0 - $this->getQtyOrdered(), $msg, $this);
					$this->addLog($msg, Log::TYPE_SYSTEM, 'Auto Log', __CLASS__ . '::' . __FUNCTION__);
				}
				foreach(SellingItem::getAllByCriteria('orderItemId = ?', array($this->getId())) as $sellingItem) {
					$sellingItem->setActive(false)
						->save();
				}
			}
		}
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'ord_item');

		DaoMap::setManyToOne('order', 'Order', 'ord');
		DaoMap::setManyToOne('product', 'Product', 'pro');
		DaoMap::setIntType('qtyOrdered');
		DaoMap::setIntType('unitPrice', 'double', '10,4');
		DaoMap::setIntType('totalPrice', 'double', '10,4');
		DaoMap::setDateType('eta', 'datetime', true, null);
		DaoMap::setBoolType('isPicked');
		DaoMap::setBoolType('isShipped');
		DaoMap::setBoolType('isOrdered');
		DaoMap::setIntType('mageOrderId');
		DaoMap::setIntType('margin', 'double', '10,4');
		DaoMap::setIntType('unitCost', 'double', '10,4');
		DaoMap::setStringType('itemDescription', 'varchar', '255');
		DaoMap::setManyToOne('store', 'Store', 'si');
		parent::__loadDaoMap();

		DaoMap::createIndex('isPicked');
		DaoMap::createIndex('isShipped');
		DaoMap::createIndex('isOrdered');
		DaoMap::createIndex('qtyOrdered');
		DaoMap::createIndex('unitPrice');
		DaoMap::createIndex('totalPrice');
		DaoMap::createIndex('margin');
		DaoMap::createIndex('unitCost');
		DaoMap::commit();
	}
	/**
	 * creating the orderitem object
	 *
	 * @param Order   $order
	 * @param Product $product
	 * @param number  $unitPrice
	 * @param number  $qty
	 * @param number  $totalPrice
	 * @param number  $mageOrderItemId The order_item_id from Magento
	 * @param string  $eta
	 *
	 * @return OrderItem
	 */
	public static function create(Order $order, Product $product, $unitPrice, $qty, $totalPrice, $mageOrderItemId = 0, $eta = null, $itemDescription = '')
	{
		$item = new OrderItem();
		$item->setOrder($order)
			->setProduct($product)
			->setUnitPrice($unitPrice)
			->setQtyOrdered($qty)
			->setItemDescription($itemDescription)
			->setTotalPrice($totalPrice === null ? $unitPrice * $qty : $totalPrice)
			->setMageOrderId($mageOrderItemId)
			->setEta($eta)
			->setStore(Core::getUser()->getStore())
			->save();
		return $item;
	}
	/**
	 * Getting the order item via order and product
	 *
	 * @param Order   $order
	 * @param Product $product
	 * @param bool    $activeOnly
	 * @param int     $pageNo
	 * @param int     $pageSize
	 * @param array   $orderBy
	 * @param array   $stats
	 *
	 * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
	 */
	public static function getItems(Order $order, Product $product = null, $activeOnly = true, $pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array(), &$stats = array())
	{
		$where = 'orderId = ?';
		$params = array($order->getId());
		if($product instanceof Product)
		{
			$where .=' AND productId = ?';
			$params[] = $product->getId();
		}
		return self::getAllByCriteria($where, $params, $activeOnly, $pageNo, $pageSize, $orderBy, $stats);
	}
}