<?php
/**
 * Entity for ProductEta
*
* @package    Core
* @subpackage Entity
* @author     lhe<helin16@gmail.com>
*/
class ProductEta extends BaseEntityAbstract
{
	/**
	 * The product
	 *
	 * @var Product
	 */
	protected $product;
	/**
	 * The purchaseorder
	 *
	 * @var PurchaseOrder
	 */
	protected $purchaseOrder;
	/**
	 * The purchaseorderitem
	 *
	 * @var PurchaseOrderItem
	 */
	protected $purchaseOrderItem;
	/**
	 * The purchaseorder item id
	 *
	 * @var integer
	 */
// 	private $itemId;
	/**
	 * The eta of the po
	 *
	 * @var UDate
	 */
	private $eta = '';
	/**
	 * Whether this PO is received
	 *
	 * @var bool
	 */
	private $received = false;
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
	 * @return ProductEta
	 */
	public function setProduct(Product $value)
	{
		$this->product = $value;
		return $this;
	}
	/**
	 * Getter for purchaseOrder
	 *
	 * @return PurchaseOrder
	 */
	public function getPurchaseOrder()
	{
		$this->loadManyToOne('purchaseOrder');
		return $this->purchaseOrder;
	}
	/**
	 * Setter for purchaseOrder
	 *
	 * @param PurchaseOrder $value The purchaseOrder
	 *
	 * @return ProductEta
	 */
	public function setPurchaseOrder(PurchaseOrder $value)
	{
		$this->purchaseOrder = $value;
		return $this;
	}
	/**
	 * Getter for purchaseOrderItem
	 *
	 * @return PurchaseOrderItem
	 */
	public function getPurchaseOrderItem()
	{
		$this->loadManyToOne('purchaseOrderItem');
		return $this->purchaseOrderItem;
	}
	/**
	 * Setter for purchaseOrderItem
	 *
	 * @param PurchaseOrderItem $value The purchaseOrderItem
	 *
	 * @return ProductEta
	 */
	public function setPurchaseOrderItem(PurchaseOrderItem $value)
	{
		$this->purchaseOrderItem = $value;
		return $this;
	}
/* 	/**
	 * Getter for purchaseOrder item id
	 *
	 * @return PurchaseOrder Item Id
	 */
/* 	public function getItemId()
	{
		return $this->itemId;
	} */
	/**
	 * Setter for purchaseOrder item id
	 *
	 * @param integer $value The purchaseOrder item id
	 *
	 * @return ProductEta
	 */
/* 	public function setItemId($value)
	{
		$this->itemId = $value;
		return $this;
	}  */
	/**
	 * Getter for ETA
	 *
	 * @return UDate
	 */
	public function getEta()
	{
		return $this->eta;
	}
	/**
	 * Setter for ETA
	 *
	 * @param string $value The purchaseOrder id
	 *
	 * @return ProductEta
	 */
	public function setEta($value)
	{
		$this->eta = $value;
		return $this;
	}
	/**
	 * Getter for received
	 *
	 * @return bool
	 */
	public function getReceived()
	{
		return (trim($this->received) === '1');
	}
	/**
	 * Setter for received
	 *
	 * @param unkown $value The received
	 *
	 * @return ProductEta
	 */
	public function setReceived($value)
	{
		$this->received = $value;
		return $this;
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
			$array['po'] = $this->getPurchaseOrder() instanceof PurchaseOrder ? $this->getPurchaseOrder()->getJson() : array();
			$array['item'] = $this->getPurchaseOrderItem() instanceof PurchaseOrderItem ? $this->getPurchaseOrderItem()->getJson() : array();
		}
		return parent::getJson($array, $reset);
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'pro_eta');

		DaoMap::setManyToOne('purchaseOrder', 'PurchaseOrder', 'pro_eta_po');
		DaoMap::setManyToOne('purchaseOrderItem', 'PurchaseOrderItem', 'pro_eta_item');
		DaoMap::setManyToOne('product', 'Product', 'pro_eta_pro');
// 		DaoMap::setIntType('itemId');
		DaoMap::setDateType('eta');
		DaoMap::setBoolType('received');
		DaoMap::setManyToOne('store', 'Store', 'si');
		parent::__loadDaoMap();
// 		DaoMap::createIndex('itemId');
		DaoMap::createIndex('eta');
		DaoMap::createIndex('received');
		DaoMap::commit();
	}
	/**
	 * creating a Product ETA
	 *
	 * @param PurchaseOrder $po
	 * @param Product       $product
	 * @param integer 		$itemId
	 * @param DateFormat    $eta
	 *
	 * @return ProductEta
	 */
	public static function create(PurchaseOrder $po, Product $product, PurchaseOrderItem $item, $eta)
	{
		$entity = new ProductEta();
		$entity->setPurchaseOrder($po)
		->setPurchaseOrderItem($item)
		->setProduct($product)
// 		->setItemId($itemId)
		->setEta($eta)
		->setStore(Core::getUser()->getStore())
		->save();

		return $entity;
	}
}
