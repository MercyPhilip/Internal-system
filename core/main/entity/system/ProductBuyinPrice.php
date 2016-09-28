<?php
/**
 * ProductBuyinPrice Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class ProductBuyinPrice extends BaseEntityAbstract
{

    /**
     * The product id
     *
     * @var Product
     */
    protected  $product;
    /**
     * The buyin price
     *
     * @var double
     */
    private $price;
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
     * @return ProductTierPrice
     */
    public function setProduct(Product $value)
    {
    	$this->product = $value;
    	return $this;
    }
    /**
     * getter buyin price
     *
     * @return double
     */
    public function getPrice()
    {
    	return $this->price;
    }
    /**
     * Setter buyin price
     *
     * @param double $price
     *
     * @return ProductBuyinPrice
     */
    public function setPrice($value)
    {
    	$this->price = $value;
    	return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'pro_bip');
        DaoMap::setManyToOne('product', 'Product', 'pro_bip_pro', true);
        DaoMap::setIntType('price', 'double', '10,4', true);
        parent::__loadDaoMap();
        DaoMap::createIndex('product');
        DaoMap::commit();
    }
    /**
     * Getting buyin price
     *
     * @param  $productId
     * @return buyin price
     */
    public static function getBuyinPrice($productId)
    {
    	$where = array('productId = ? ');
    	$params = array($productId);
    	$buyinPrices = self::getAllByCriteria(implode(' AND ', $where), $params);
    	if (count($buyinPrices) > 0)
    	{
    		$buyinPrice = $buyinPrices[0];
    		if ($buyinPrice instanceof ProductBuyinPrice)
    			return $buyinPrice->getPrice();
    	}
    	return 0;
    }
}

?>
