<?php
/**
 * Entity for PickupDelivery
*
* @package    Core
* @subpackage Entity
* @author     lhe<helin16@gmail.com>
*/
class PickupDelivery extends BaseEntityAbstract
{
	const TYPE_PICKUP = 'PICKUP';
	const TYPE_DELIVERY = 'DELIVERY';
	/**
	 * type of pickup/delivery
	 *
	 * @var string
	 */
	private $type;
	/**
	 * The PO/Order number
	 *
	 * @var PurchaseOrder/Order
	 */
	protected $order;
	/**
	 * The PO/Order tem number
	 *
	 * @var PurchaseOrder/Order Item
	 */
	protected $item;
	/**
	 * The supplier
	 *
	 * @var Supplier
	 */
	protected $supplier;
	/**
	 * The product
	 *
	 * @var Product
	 */
	protected $product;
	/**
	 * Whether this PO is arranged to pickup/Order to delivery
	 *
	 * @var bool
	 */
	private $arranged = false;
	/**
	 * The date and time when this PO is arranged to pickup/Order to delivery
	 *
	 * @var UDate
	 */
	private $arrangedDate;
	/**
	 * The used ID who arranged this PO to pickup/Order to delivery
	 *
	 * @int
	 */
	protected $arrangedBy;
	/**
	 * Whether this PO is done to pickup/Order to delivery
	 *
	 * @var bool
	 */
	private $done = false;
	/**
	 * The date and time when this PO is done to pickup/Order to delivery
	 *
	 * @var UDate
	 */
	private $doneDate;
	/**
	 * The used ID who done this PO to pickup/Order to delivery
	 *
	 * @int
	 */
	protected $doneBy;
	/**
	 * Getter for type
	 *
	 * @return string
	 */
	public function getType()
	{
		return $this->type;
	}
	/**
	 * Setter for stype
	 *
	 * @param string $value The type
	 *
	 * @return PickupDelivery
	 */
	public function setType($value)
	{
		$this->type = trim($value);
		return $this;
	}
	/**
	 * Getter for purchaseOrder/order
	 *
	 * @return PurchaseOrder/Order
	 */
	public function getOrder()
	{
		$this->loadManyToOne('order');
		return $this->order;
	}
	/**
	 * Setter for order/purchaseOrder
	 *
	 * @param Order/PurchaseOrder $value The order/purchaseOrder
	 *
	 * @return PickupDelivery
	 */
	public function setOrder($value)
	{
		$this->order = $value;
		return $this;
	}
	/**
	 * Getter for purchaseOrder/order item
	 *
	 * @return PurchaseOrder/Order Item
	 */
	public function getItem()
	{
		$this->loadManyToOne('item');
		return $this->item;
	}
	/**
	 * Setter for order/purchaseOrder item
	 *
	 * @param Order/PurchaseOrder Item $value The order/purchaseOrder item
	 *
	 * @return PickupDelivery
	 */
	public function setItem($value)
	{
		$this->item = $value;
		return $this;
	}
	/**
	 * Getter for supplier
	 *
	 * @return Supplier
	 */
	public function getSupplier()
	{
		$this->loadManyToOne('supplier');
		return $this->supplier;
	}
	/**
	 * Setter for supplier
	 *
	 * @param Supplier $value The supplier
	 *
	 * @return PickupDelivery
	 */
	public function setSupplier(Supplier $value)
	{
		$this->supplier = $value;
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
	 * @return PickupDelivery
	 */
	public function setProduct(Product $value)
	{
		$this->product = $value;
		return $this;
	}
	/**
	 * Getter for arranged
	 *
	 * @return bool
	 */
	public function getArranged()
	{
		return (trim($this->arranged) === '1');
	}
	/**
	 * Setter for arranged
	 *
	 * @param unkown $value The arranged
	 *
	 * @return PickupDelivery
	 */
	public function setArranged($value)
	{
		$this->arranged = $value;
		return $this;
	}
	/**
	 * Getter for arrangedDate
	 *
	 * @return UDate
	 */
	public function getArrangedDate()
	{
		$this->arrangedDate = new UDate(trim($this->arrangedDate));
		return $this->arrangedDate;
	}
	/**
	 * Setter for arrangedDate
	 *
	 * @param string $value The arrangedDate
	 *
	 * @return PickupDelivery
	 */
	public function setArrangedDate($value)
	{
		$this->arrangedDate = $value;
		return $this;
	}
	/**
	 * Getter for arrangedBy
	 *
	 * @return string
	 */
	public function getArrangedBy()
	{
		$this->loadManyToOne('arrangedBy');
		return $this->arrangedBy;
	}
	/**
	 * Setter for arrangedBy
	 *
	 * @param string $value The arrangedBy
	 *
	 * @return PickupDelivery
	 */
	public function setArrangedBy(UserAccount $value)
	{
		$this->arrangedBy = $value;
		return $this;
	}
	/**
	 * Getter for arranged
	 *
	 * @return bool
	 */
	public function getDone()
	{
		return (trim($this->done) === '1');
	}
	/**
	 * Setter for Done
	 *
	 * @param unkown $value The done
	 *
	 * @return PickupDelivery
	 */
	public function setDone($value)
	{
		$this->done= $value;
		return $this;
	}
	/**
	 * Getter for doneDate
	 *
	 * @return UDate
	 */
	public function getDoneDate()
	{
		$this->doneDate = new UDate(trim($this->doneDate));
		return $this->doneDate;
	}
	/**
	 * Setter for doneDate
	 *
	 * @param string $value The doneDate
	 *
	 * @return PickupDelivery
	 */
	public function setDoneDate($value)
	{
		$this->doneDate = $value;
		return $this;
	}
	/**
	 * Getter for doneBy
	 *
	 * @return string
	 */
	public function getDoneBy()
	{
		$this->loadManyToOne('doneBy');
		return $this->doneBy;
	}
	/**
	 * Setter for doneBy
	 *
	 * @param string $value The doneBy
	 *
	 * @return PickupDelivery
	 */
	public function setDoneBy(UserAccount $value)
	{
		$this->doneBy = $value;
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		if ($this->type == self::TYPE_PICKUP){
			$class = 'PurchaseOrder';
			$classItem = 'PurchaseOrderItem';
		}else{
			$class = 'Order';
			$classItem = 'OrderItem';
		}
		DaoMap::begin($this, 'pickup_deliv');

		DaoMap::setStringType('type', 'varchar', 10);
		DaoMap::setManyToOne('order', $class, 'pickup_deliv_ord');
		DaoMap::setManyToOne('item', $classItem, 'pickup_deliv_item');
		DaoMap::setManyToOne('supplier', 'Supplier', 'pickup_deliv_sup');
		DaoMap::setManyToOne('product', 'Product', 'pickup_deliv_pro');
		DaoMap::setManyToOne('store', 'Store', 'si');
		DaoMap::setBoolType('arranged', 'bool', false);
		DaoMap::setDateType('arrangedDate');
		DaoMap::setManyToOne('arrangedBy', 'UserAccount');
		DaoMap::setBoolType('done', 'bool', false);
		DaoMap::setDateType('donedate');
		DaoMap::setManyToOne('doneBy', 'UserAccount');
		parent::__loadDaoMap();

		DaoMap::createIndex('type');
		DaoMap::createIndex('arranged');
		DaoMap::createIndex('arrangedDate');
		DaoMap::createIndex('arrangedBy');
		DaoMap::createIndex('done');
		DaoMap::createIndex('adoneDate');
		DaoMap::createIndex('doneBy');

		DaoMap::commit();
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::getJson()
	 */
	public function getJson($extra = array(), $reset = false, $getItems = false)
	{
		$array = $extra;
		if(!$this->isJsonLoaded($reset))
		{
			$array['product'] = $this->getProduct() instanceof Product ? $this->getProduct()->getJson() : array();
			$array['order'] = count($this->getOrder()) > 0 ? $this->getOrder()->getJson() : array();
			$array['item'] = count($this->getItem()) > 0 ? $this->getItem()->getJson() : array();
			$array['comment'] = count($this->getComment()) > 0 ? $this->getComment()[0]->getComments() : '';
		}
		return parent::getJson($array, $reset);
	}
	/**
	 * get all purchase order items under this PO
	 *
	 * @return array
	 */
	public function getPurchaseOrderItems()
	{
		return PurchaseOrderItem::getAllByCriteria('purchaseOrderId = ? and storeId = ?', array($this->getOrder()->getId(), Core::getUser()->getStore()->getId()));
	}
	/**
	 * get all order items under this Order
	 *
	 * @return array
	 */
	public function getOrderItems()
	{
		return OrderItem::getAllByCriteria('orderId = ? and storeId = ?', array($this->getOrder()->getId(), Core::getUser()->getStore()->getId()));
	}
	/**
	 * creating a Pickup Delivery
	 *
	 * @param string   $type
	 * @param Supplier $supplier
	 * @param Product  $product
	 * @param Order/PO $order
	 *
	 * @return PickupDelivery
	 */
	public static function create(Supplier $supplier, Product $product, $order, $item, $type)
	{
		$entity = new PickupDelivery();
		
		$entity->setSupplier($supplier)
		->setType(trim($type))
		->setOrder($order)
		->setItem($item)
		->setProduct($product)
		->setArranged(1)
		->setArrangedDate(UDate::now())
		->setArrangedBy(Core::getUser())
		->setDoneBy(Core::getUser())
		->setStore(Core::getUser()->getStore())
		->save();
		return $entity;
	}
}