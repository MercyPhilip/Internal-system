<?php
/**
 * TierRule Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class TierRule extends BaseEntityAbstract
{
	const PRIORITY_ID_PID = 1;
	const PRIORITY_ID_BRANDCATEGORY = 2;
	const PRIORITY_ID_BRAND = 3;
	const PRIORITY_ID_CATEGORY = 4;
    /**
     * The product
     *
     * @var Product
     */
    protected $product;
    /**
     * The manufacturer
     *
     * @var Manufacturer
     */
    protected $manufacturer;
    /**
     * The category
     *
     * @var ProductCategory
     */
    protected $category;
    /**
     * Priority
     * @var unknown
     */
    private $priorityId;
    /**
     * Getter for Priority
     *
     * @return int
     */
    public function getPriorityId()
    {
    	return $this->priorityId;
    }
    /**
     * Setter for Priority
     *
     * @param int $value The Priority
     *
     * @return TierRule
     */
    public function setPriorityId($value)
    {
    	$this->priorityId = $value;
    	return $this;
    }
    /**
     * Getter for category
     *
     * @return ProductCategory
     */
    public function getCategory()
    {
    	$this->loadManyToOne('category');
    	return $this->category;
    }
    /**
     * Setter for category
     *
     * @param ProductCategory $value The category
     *
     * @return TierRule
     */
    public function setCategory(ProductCategory $value)
    {
    	$this->category = $value;
    	return $this;
    }
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
     * @return TierRule
     */
    public function setProduct(Product $value)
    {
    	$this->product = $value;
    	return $this;
    }
    /**
     * Getter for manufacturer
     *
     * @return Manufacturer
     */
    public function getManufacturer()
    {
    	$this->loadManyToOne('manufacturer');
    	return $this->manufacturer;
    }
    /**
     * Setter for manufacturer
     *
     * @param Manufacturer $value
     *
     * @return TierRule
     */
    public function setManufacturer(Manufacturer $value = null)
    {
    	$this->manufacturer = $value;
    	return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'tr_rl');
        DaoMap::setManyToOne('product', 'Product', 'tr_rl_cat_pro',true);
        DaoMap::setManyToOne('manufacturer', 'Manufacturer', 'tr_rl_man', true);
        DaoMap::setManyToOne('category', 'ProductCategory', 'tr_rl_cat_cate', true);
        DaoMap::setIntType('priorityId', 'int', 10, true);
        parent::__loadDaoMap();
        DaoMap::createIndex('product');
        DaoMap::createIndex('manufacturer');
        DaoMap::createIndex('category');
        DaoMap::createIndex('priorityId');
        
        DaoMap::commit();
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
    		$array['manufacturer'] = $this->getManufacturer() instanceof Manufacturer ? $this->getManufacturer()->getJson() : null;
    		$array['category'] = $this->getCategory() instanceof ProductCategory ? $this->getCategory()->getJson() : null;
    		$array['tierprices'] = array_map(create_function('$a', 'return $a->getJson();'), TierPrice::getTierPrices($this));
    	}
    	return parent::getJson($array, $reset);
    }
}

?>
