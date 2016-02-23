<?php
/**
 * Entity for ProductSkuMap
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class ProductSkuMap extends InfoEntityAbstract
{
	
	private $productId;
	
	/**
	 * The sku of the product from datafeed
	 *
	 * @var string
	 */
	private $msku;

	/**
	 * The sku of the product from .5
	 *
	 * @var string
	 */
	private $fsku;
	
	/**
	 * Getter for productId
	 *
	 * @return string
	 */
	public function getProductId()
	{
		return $this->productId;
	}
	/**
	 * Setter for productId
	 *
	 * @param string $value The productId
	 *
	 * @return Product
	 */
	public function setProductId($value)
	{
		$this->productId = $value;
		return $this;
	}
	
	/**
	 * Getter for sku
	 *
	 * @return string
	 */
	public function getmSku()
	{
	    return $this->msku;
	}
	/**
	 * Setter for sku
	 *
	 * @param string $value The sku
	 *
	 * @return Product
	 */
	public function setmSku($value)
	{
	    $this->msku = $value;
	    return $this;
	}
	
	/**
	 * Getter for sku
	 *
	 * @return string
	 */
	public function getfSku()
	{
		return $this->fsku;
	}
	/**
	 * Setter for sku
	 *
	 * @param string $value The sku
	 *
	 * @return Product
	 */
	public function setfSku($value)
	{
		$this->fsku = $value;
		return $this;
	}
	
	/**
	 * Creating the productstatus based on sku
	 *
	 * @param string $msku        The msku of the product
	 * @param string $fsku The fsku of the product
	 *
	 * @return Ambigous <Product, Ambigous, NULL, BaseEntityAbstract>
	 */
	public static function create($productId, $msku, $fsku)
	{
		$class = __CLASS__;
		$msku = trim($msku);
		
		$objects = self::getAllByCriteria('productId = ? and msku = ? ', array($productId, $msku), true, 1, 1, array('id' => 'asc'));
		if(count($objects) > 0 && $productId !== '' && $msku !== '')
		{
			$obj = $objects[0];
		}
		else
		{
			$obj = new $class();
			$obj->setProductId($productId)->
			setmSku(trim($msku));
		}
		return $obj->setfSku(trim($fsku))->save();
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::__toString()
	 */
	public function __toString()
	{
		return trim($this->getfSku());
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'pro_mpsku');
		DaoMap::setIntType('productId', 'int', 10);
		DaoMap::setStringType('msku', 'varchar', 50);
		DaoMap::setStringType('fsku', 'varchar', 50);
		parent::__loadDaoMap();
	
		DaoMap::createUniqueIndex('productId');
		DaoMap::createUniqueIndex('msku');
		DaoMap::createUniqueIndex('fsku');
		DaoMap::commit();
	}
	
	/**
	 * Getting the mapping sku via msku
	 *
	 * @param string $sku The sku of the product
	 *
	 * @return null|ProductSkuMap
	 */
	public static function getMappingSku($msku)
	{
		$productskumap = self::getAllByCriteria('msku = ? ', array(trim($msku)), false, 1, 1);
		return (count($productskumap) === 0 ? null : $productskumap[0]);
	}
}
