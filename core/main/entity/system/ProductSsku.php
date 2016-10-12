<?php
/**
 * ProductSsku Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class ProductSsku extends BaseEntityAbstract
{

    /**
     * The product id
     *
     * @var Product
     */
    protected  $product;
    /**
     * The supplier sku
     *
     * @var string
     */
    private $ssku;
    /**
     * Getter for product
     *
     * @return
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
     * @return ProductSsku
     */
    public function setProduct(Product $value)
    {
    	$this->product = $value;
    	return $this;
    }
    /**
     * getter supplier sku
     *
     * @return string
     */
    public function getSsku()
    {
    	return $this->ssku;
    }
    /**
     * Setter supllier sku
     *
     * @param string $value
     *
     * @return ProductSsku
     */
    public function setSsku($value)
    {
    	$this->ssku = $value;
    	return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'pro_ssku');
        DaoMap::setManyToOne('product', 'Product', 'pro_ssku_pro', true);
        DaoMap::setStringType('ssku');
        parent::__loadDaoMap();
        DaoMap::createIndex('product');
        DaoMap::commit();
    }
    /**
     * Getting ProductSsku object
     *
     * @param  $productId
     * @return ProductSsku
     */
    public static function getObj($productId)
    {
    	$where = array('productId = ? ');
    	$params = array($productId);
    	$objs = self::getAllByCriteria(implode(' AND ', $where), $params);
    	if (count($objs) > 0)
    	{
    		$obj = $objs[0];
    		if ($obj instanceof ProductSsku)
    			return $obj;
    	}
    	return null;
    }
}

?>
