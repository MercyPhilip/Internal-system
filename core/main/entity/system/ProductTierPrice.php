<?php
/**
 * ProductTierPrice Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class ProductTierPrice extends BaseEntityAbstract
{
	const PRIORITY_ID_PID = 1;
	const PRIORITY_ID_BRANDCATEGORY = 2;
	const PRIORITY_ID_CATEGORY = 3;
	const PRIORITY_ID_BRAND = 4;
	/**
	 * The product
	 *
	 * @var Product
	 */
	protected $product;
    /**
     * The tier rule
     *
     * @var TierRule
     */
    protected  $tierrule;
    /**
     * The tier level
     *
     * @var TierLevel
     */
    protected $tierLevel;
    /**
     * The quantity
     *
     * @var int
     */
    private $quantity;
    /**
     * The tier price type
     *
     * @var TierPriceType
     */
    protected  $tierpricetype;
    /**
     * The tier price or percentage
     *
     * @var double
     */
    private $value;
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
     * @return ProductTierPrice
     */
    public function setPriorityId($value)
    {
    	$this->priorityId = $value;
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
     * @return ProductTierPrice
     */
    public function setProduct(Product $value)
    {
    	$this->product = $value;
    	return $this;
    }
    /**
     * Getter for tier price type
     *
     * @return TierPriceType
     */
    public function getTierPriceType()
    {
    	$this->loadManyToOne('tierpricetype');
    	return $this->tierpricetype;
    }
    /**
     * Setter for tierrule
     *
     * @param TierPriceType $value The tierrule
     *
     * @return ProductTierPrice
     */
    public function setTierPriceType(TierPriceType $value)
    {
    	$this->tierpricetype = $value;
    	return $this;
    }
    /**
     * Getter for tierrule
     *
     * @return TierRule
     */
    public function getTierRule()
    {
    	$this->loadManyToOne('tierrule');
    	return $this->tierrule;
    }
    /**
     * Setter for tierrule
     *
     * @param TierRule $value The tierrule
     *
     * @return ProductTierPrice
     */
    public function setTierRule($value)
    {
    	$this->tierrule = $value;
    	return $this;
    }
    /**
     * Getter for tier level
     *
     * @return TierLevel
     */
    public function getTierLevel()
    {
    	$this->loadManyToOne('tierLevel');
    	return $this->tierLevel;
    }
    /**
     * Setter for tierLevel
     *
     * @param TierLevel $value The tier level
     *
     * @return ProductTierPrice
     */
    public function setTierLevel(TierLevel $value)
    {
    	$this->tierLevel = $value;
    	return $this;
    }
    /**
     * getter quantity
     *
     * @return int
     */
    public function getQuantity()
    {
        return $this->quantity;
    }
    /**
     * Setter quantity
     *
     * @param int $quantity The quantity
     *
     * @return ProductTierPrice
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
        return $this;
    }
    /**
     * getter price
     *
     * @return double
     */
    public function getValue()
    {
    	return $this->value;
    }
    /**
     * Setter price
     *
     * @param double $price
     *
     * @return ProductTierPrice
     */
    public function setValue($value)
    {
    	$this->value = $value;
    	return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'pro_trpr');
        DaoMap::setManyToOne('product', 'Product', 'pro_trpr_pro', true);
        DaoMap::setManyToOne('tierrule', 'TierRule', 'trl_pr_tr_rl', true);
        DaoMap::setManyToOne('tierLevel', 'TierLevel', 'trl_pr_trl', true);
        DaoMap::setIntType('quantity', 'int', 10, true);
        DaoMap::setIntType('value', 'double', '10,4', true);
        DaoMap::setManyToOne('tierpricetype', 'TierPriceType', 'trl_pr_tpt', true);
        DaoMap::setIntType('priorityId', 'int', 10, true);
        parent::__loadDaoMap();
        DaoMap::createIndex('product');
        DaoMap::createIndex('tierrule');
        DaoMap::createIndex('tierLevel');
        DaoMap::createIndex('priorityId');

        DaoMap::commit();
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntityAbstract::getJson()
     */
    public function getJson($extra = array(), $reset = false)
    {
    	$ret = array();
    	$array = $extra;
    	if(!$this->isJsonLoaded($reset))
    	{
    		$array['product'] = $this->getProduct() instanceof Product ? $this->getProduct()->getJson() : null;
    		$array['tierLevel'] = $this->getTierLevel() instanceof TierLevel ? $this->getTierLevel()->getJson() : null;
    		$array['tierPriceType'] = $this->getTierPriceType() instanceof TierPriceType ? $this->getTierPriceType()->getJson() : null;
    	}
    	$ret = parent::getJson($array, $reset);
    	$qty = $ret['quantity'];
    	if ($qty === 0)
    		$ret['quantity'] = '';
    	return $ret;
    }
    /**
     * Getting all the tier prices
     *
     * @param Product $product
     * @param TierPriceType $type
     * @param string $activeOnly
     * @param string $pageNo
     * @param unknown $pageSize
     * @param unknown $orderBy
     * @param unknown $stats
     * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
     */
    public static function getTierPrices(Product $product, TierPriceType $type = null, $activeOnly = true, $pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array(), &$stats = array())
    {
    	$where = array('productId = ? ');
    	$params = array($product->getId());
    	if($type instanceof TierPriceType)
    	{
    		$where[] = 'tierpricetypeId = ?';
    		$params[] = $type->getId();
    	}
    	$objs = self::getAllByCriteria(implode(' AND ', $where), $params, $activeOnly, $pageNo , $pageSize, $orderBy, $stats);
    	$rets = array();
    	foreach($objs as $obj)
    	{
    		$rets[] = $obj->getJson();
    	}
    	return $rets;
    }
    /**
     * Getting the product tier price
     *
     * @param TierRule $tierRule
     * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
     */
    public static function getProductTierPrice(Product $product)
    {
    	$where = array('productId = ? ');
    	$params = array($product->getId());
    	$objs = ProductTierPrice::getAllByCriteria(implode(' AND ', $where), $params);
    	if (count($objs) > 0)
    		$objs = $objs[0];
    	else
    		$objs = null;
    	return $objs;
    }
    /**
     * Getting all the tier prices
     *
     * @param TierRule $tierRule
     * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
     */
    public static function create(TierRule $tierRule)
    {
    	// create new tier price for the products
    	// according to the tier rule
    	// check whether the rule has sku
    	$product = $tierRule->getProduct();
    	$category = $tierRule->getCategory();
    	$brand = $tierRule->getManufacturer();
    	$tierPrices = array_map(create_function('$a', 'return $a->getJson();'), TierPrice::getTierPrices($tierRule));
    	if ($product instanceof Product)
    	{
    		//update or new
    		ProductTierPrice::updateTierPrices($tierRule, $product, $tierPrices);
    	}
    	else
    	{
    		$categoryIds = $category instanceof ProductCategory ? array($category->getId()) : array();
    		$brandIds = $brand instanceof Manufacturer ? array($brand->getId()) : array();
    		$supplierIds = array();
    		// got all related products
    		$products = Product::getProducts(
    				''
    				,''
    				,$supplierIds
    				,$brandIds
    				,$categoryIds
    				);
    		foreach($products as $product)
    		{
    			//update or new
    			ProductTierPrice::updateTierPrices($tierRule, $product, $tierPrices);
    		}
    	}
    	return true;
    }
    /**
     * create new tier price for products
     * @param TierRule $tierRule
     * @param unknown $product
     * @param unknown $tierprices
     */
    public static function setTierPrices(TierRule $tierRule, Product $product, $tierprices)
    {
    	foreach($tierprices as $tierprice)
    	{
    		if(!($type = TierPriceType::get(trim($tierprice['tierPriceType']['id']))) instanceof TierPriceType)
    			continue;
    		$tierLevelId = trim($tierprice['tierLevel']['id']);
    		$tierLevel = TierLevel::get($tierLevelId);
    		$quantity = trim($tierprice['quantity']);
    		$value = trim($tierprice['value']);
    		$newproductTierPrice = new ProductTierPrice();
    		$newproductTierPrice->setProduct($product)
    			->setTierLevel($tierLevel)
    			->setQuantity($quantity)
    			->setTierPriceType($type)
    			->setValue($value)
    			->setPriorityId($tierRule->getPriorityId())
    			->setTierRule($tierRule)
    			->save();
    	}
    }
    /**
     * update tier prices of the product
     * @param TierRule $tierRule
     * @param Product $product
     * @param unknown $tierprices
     */
    public static function updateTierPrices(TierRule $tierRule, Product $product, $tierprices)
    {
    	$obj = ProductTierPrice::getProductTierPrice($product);
    	if ($obj instanceof ProductTierPrice)
    	{
    		// Tier price has already existed
    		// but priority is lower than new rule
    		// then replace the existed tier price
    		// or do nothing
    		if ((trim($obj->getPriorityId()) == '') || ($obj->getPriorityId() >= $tierRule->getPriorityId()))
    		{
    			// delete existed ones
    			ProductTierPrice::updateByCriteria('active = 0', 'productId = ? and active = 1', array($product->getId()));
    			// create new ones
    			ProductTierPrice::setTierPrices($tierRule, $product, $tierprices);
    		}
    	}
    	else
    	{
    		// create new ones
    		ProductTierPrice::setTierPrices($tierRule, $product, $tierprices);
    	}
    }
}

?>
