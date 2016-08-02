<?php
/**
 * Entity for ProductStockInfo
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class ProductStockInfo extends BaseEntityAbstract
{
	/**
	 * The product
	 * 
	 * @var Product
	 */
	private $productId;
	/**
	 * The quantity that we are ordering from supplier
	 *
	 * @var int
	 */
	private $stockOnOrder = 0;
	/**
	 * The quantity we have
	 *
	 * @var int
	 */
	private $stockOnHand = 0;
	/**
	 * The quantity we have
	 *
	 * @var int
	 */
	private $stockOnPO = 0;
	/**
	 * The quantity in parts for build
	 *
	 * @var int
	 */
	private $stockInParts = 0;
	/**
	 * The quantity in RMA for build
	 *
	 * @var int
	 */
	private $stockInRMA = 0;
	/**
	 * The minimum stock level
	 *
	 * @var int
	 */
	private $stockMinLevel = null;
	/**
	 * The reorder stock lelvel
	 *
	 * @var int
	 */
	private $stockReorderLevel = null;
	/**
	 * The total value for RMA stock
	 *
	 * @var double
	 */
	private $totalRMAValue = 0;
	/**
	 * The total value for all stock on hand units
	 *
	 * @var double
	 */
	private $totalOnHandValue = 0;
	/**
	 * The total value for all stock on parts for build
	 *
	 * @var double
	 */
	private $totalInPartsValue = 0;
	/**
	 * Product status
	 *
	 * @var ProductStatus
	 */
	protected $status = null;
	/**
	 * Getter for product
	 *
	 * @return Product
	 */
	public function getProductId()
	{
		return $this->productId;
	}
	/**
	 * Setter for product
	 *
	 * @param Product $value The product
	 *
	 * @return ProductCode
	 */
	public function setProductId($value)
	{
		$this->productId = $value;
		return $this;
	}
	/**
	 * Getter for stockOnOrder
	 *
	 * @return
	 */
	public function getStockOnOrder()
	{
	    return $this->stockOnOrder;
	}
	/**
	 * Setter for stockOnOrder
	 *
	 * @param double $value The stockOnOrder
	 *
	 * @return Product
	 */
	public function setStockOnOrder($value)
	{
	    $this->stockOnOrder = $value;
	    return $this;
	}
	/**
	 * Getter for stockOnHand
	 *
	 * @return int
	 */
	public function getStockOnHand()
	{
	    return $this->stockOnHand;
	}
	/**
	 * Setter for stockOnHand
	 *
	 * @param int $value The stockOnHand
	 *
	 * @return Product
	 */
	public function setStockOnHand($value)
	{
	    $this->stockOnHand = $value;
	    return $this;
	}
	/**
	 * Getter for stockOnPO
	 *
	 * @return int
	 */
	public function getStockOnPO()
	{
	    return $this->stockOnPO;
	}
	/**
	 * Setter for stockOnPO
	 *
	 * @param int $value The stockOnHand
	 *
	 * @return Product
	 */
	public function setStockOnPO($value)
	{
	    $this->stockOnPO = $value;
	    return $this;
	}
	/**
	 * Getter for stockInParts
	 *
	 * @return int
	 */
	public function getStockInParts()
	{
	    return $this->stockInParts;
	}
	/**
	 * Setter for stockInParts
	 *
	 * @param int $value The stockInParts
	 *
	 * @return Product
	 */
	public function setStockInParts($value)
	{
	    $this->stockInParts = $value;
	    return $this;
	}
	/**
	 * Getter for stockInRMA
	 *
	 * @return int
	 */
	public function getStockInRMA()
	{
	    return $this->stockInRMA;
	}
	/**
	 * Setter for stockInRMA
	 *
	 * @param int $value The stockInRMA
	 *
	 * @return Product
	 */
	public function setStockInRMA($value)
	{
	    $this->stockInRMA = $value;
	    return $this;
	}
	/**
	 * getter for stockMinLevel
	 *
	 * @return int|null
	 */
	public function getStockMinLevel()
	{
		return $this->stockMinLevel;
	}
	/**
	 * Setter for stockMinLevel
	 *
	 * @return Product
	 */
	public function setStockMinLevel($stockMinLevel)
	{
		$this->stockMinLevel = $stockMinLevel;
		return $this;
	}
	/**
	 * getter for stockReorderLevel
	 *
	 * @return int|null
	 */
	public function getStockReorderLevel()
	{
		return $this->stockReorderLevel;
	}
	/**
	 * Setter for stockReorderLevel
	 *
	 * @return Product
	 */
	public function setStockReorderLevel($stockReorderLevel)
	{
		$this->stockReorderLevel = $stockReorderLevel;
		return $this;
	}
	/**
	 * Getter for status
	 *
	 * @return ProductStatus
	 */
	public function getStatus ()
	{
		$this->loadManyToOne('status');
		return $this->status;
	}
	/**
	 * Setter for status
	 *
	 * @param ProductStatus $value
	 *
	 * @return Product
	 */
	public function setStatus($value)
	{
		$this->status = $value;
		return $this;
	}
	/**
	 * Getter for totalOnHandValue
	 *
	 * @return double
	 */
	public function getTotalOnHandValue  ()
	{
		return $this->totalOnHandValue ;
	}
	/**
	 * Setter for totalOnHandValue
	 *
	 * @param double $value
	 *
	 * @return Product
	 */
	public function setTotalOnHandValue ($value )
	{
		$this->totalOnHandValue = $value;
		return $this;
	}
	/**
	 * Getter for totalInPartsValue
	 *
	 * @return double
	 */
	public function getTotalInPartsValue  ()
	{
		return $this->totalInPartsValue ;
	}
	/**
	 * Setter for totalInPartsValue
	 *
	 * @param double $value
	 *
	 * @return Product
	 */
	public function setTotalInPartsValue ($value )
	{
		$this->totalInPartsValue = $value;
		return $this;
	}
	/**
	 * Getter for totalRMAValue
	 *
	 * @return double
	 */
	public function getTotalRMAValue()
	{
	    return $this->totalRMAValue;
	}
	/**
	 * Setter for totalRMAValue
	 *
	 * @param double $value The totalRMAValue
	 *
	 * @return Product
	 */
	public function setTotalRMAValue($value)
	{
	    $this->totalRMAValue = $value;
	    return $this;
	}

	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'pro_stock_info');
		DaoMap::setManyToOne('store', 'Store', 'si', true);
		//DaoMap::setManyToOne('product', 'Product', 'pro', true);
		DaoMap::setIntType('productId', 'int', '10,4', false);
		DaoMap::setIntType('totalOnHandValue', 'double', '10,4', false);
		DaoMap::setIntType('totalInPartsValue', 'double', '10,4', false);
		DaoMap::setIntType('stockOnHand', 'int', 10, false);
		DaoMap::setIntType('stockOnOrder', 'int', 10, false);
		DaoMap::setIntType('stockOnPO', 'int', 10, false);
		DaoMap::setIntType('stockInParts', 'int', 10, false);
		DaoMap::setIntType('stockInRMA', 'int', 10, false);
		DaoMap::setIntType('stockMinLevel', 'int', 10, true, true);
		DaoMap::setIntType('stockReorderLevel', 'int', 10, true, true);
		DaoMap::setIntType('totalRMAValue', 'double', '10,4', false);
		DaoMap::setManyToOne('status', 'ProductStatus', 'pro_status', true);
		parent::__loadDaoMap();
	
		DaoMap::createIndex('stockOnHand');
		DaoMap::createIndex('stockOnOrder');
		DaoMap::createIndex('stockOnPO');
		DaoMap::createIndex('stockInParts');
		DaoMap::createIndex('stockInRMA');

		DaoMap::commit();
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::getJson()
	 */
	public function getJson($extra = array(), $reset = false)
	{
		try {
			$array = $extra;
			if(!$this->isJsonLoaded($reset))
			{
				$array['status'] = ($i=$this->getStatus()) instanceof ProductStatus ? $i->getJson() : null;
				$array['storeId'] = ($this->getStore()) instanceof Store ? $this->getStore()->getJson() : null;
			}
	
		}
		catch (Exception $ex)
		{
			throw new Exception(' ********** getJson exception :' .   $ex->getMessage());
		}
		return parent::getJson($array, $reset);
	}
	/**
	 * Creating the stock based on product
	 *
	 * @param Product $product          The product
	 * @param int    $stockOnHand   	The total quantity on hand for this product
	 * @param int    $stockOnOrder  	The total quantity on order from supplier for this product
	 * @param int    $stockMinLevel 	The minimum stock level for this product
	 * @param int    $stockReorderLevel	The reorder stock level for this product
	 * @param ProductStatus $status     The status
	 * @return Ambigous <ProductStockInfo, NULL>
	 */
	public static function create($product = null, $status = null,  $store = null, $stockOnHand = null, $stockOnOrder = null, $stockMinLevel = null, $stockReorderLevel = null)
	{
		if ($product instanceof Product)
		{
			$stock = new ProductStockInfo();
			$stock->setProductId($product->getId());
			if (!$store instanceof Store)
			{
				$store = Core::getUser()->getStore();
			}
			$stock->setStore($store);
			if (!$status instanceof ProductStatus)
			{
				// default is CALL_FOR_ETA
				$status = ProductStatus::get(8);
			}
			$stock->setStatus($status);
			if($stockOnOrder !== null && is_numeric($stockOnOrder))
				$stock->setStockOnOrder(intval($stockOnOrder));
			if($stockMinLevel !== null && is_numeric($stockMinLevel))
				$stock->setStockMinLevel(intval($stockMinLevel));
			if($stockReorderLevel !== null && is_numeric($stockReorderLevel))
				$stock->setStockReorderLevel(intval($stockReorderLevel));
			if($stockOnHand !== null && is_numeric($stockOnHand))
				$stock->setStockOnHand(intval($stockOnHand));
			return $stock->save();
		}
		return null;
	}
}
	
	