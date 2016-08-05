<?php
/**
 * This is the ListController
 *
 * @package    Web
 * @subpackage Controller
 * @author     
 */
class ListController extends CRUDPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'tiers';
	protected $_focusEntity = 'TierRule';
	
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
		if(!AccessControl::canAccessProductsPage(Core::getRole()))
			die('You do NOT have access to this page');
	}
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$manufactureArray = $supplierArray = $statuses = $productCategoryArray = array();
		foreach (Manufacturer::getAll() as $os)
			$manufactureArray[] = $os->getJson();
		foreach (ProductCategory::getAll() as $os)
			$productCategoryArray[] = $os->getJson();
		$tierLevels = array_map(create_function('$a', 'return $a->getJson();'), TierLevel::getAllByCriteria('id <> 1'));
		$tierPriceType = array_map(create_function('$a', 'return $a->getJson();'), TierPriceType::getAll());;
		$js = parent::_getEndJs();
		$js .= "pageJs.setPreData(" . json_encode($tierLevels) . "," .json_encode($tierPriceType) . ")";
		$js .= '._loadManufactures('.json_encode($manufactureArray).')';
		$js .= '._loadCategories('.json_encode($productCategoryArray).')';
		$js .= "._loadChosen()";
		$js .= "._bindSearchKey()";
		$js .= ".getResults(true, " . $this->pageSize . ");";
		return $js;
	}

	/**
	 * Getting the items
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function getItems($sender, $param)
    {
        $results = $errors = array();
        try
        {
            $class = trim($this->_focusEntity);
            $serachCriteria = json_decode(json_encode($param->CallbackParameter->searchCriteria), true);
            
            $sumArray = array();
            $pageNo = 1;
            $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
            if(isset($param->CallbackParameter->pagination))
            {
                $pageNo = $param->CallbackParameter->pagination->pageNo;
                $pageSize = $param->CallbackParameter->pagination->pageSize;
            }

            $stats = array();
            
            $serachCriteria = $this->getSearchCriteria($serachCriteria);
            $objects = $this->getProducts(
            		$serachCriteria->sku
            		,$serachCriteria->name
            		,$serachCriteria->manufacturerIds
            		,$serachCriteria->categoryIds
            		,$pageNo
            		,$pageSize
            		,array('tr_rl.id' => 'asc')
            		,$stats
            		);

            
            $results['pageStats'] = $stats;
            $results['items'] = array();
            $qty = array();
            foreach($objects as $obj)
            {
            	$results['items'][] = $obj->getJson();
            }
        }
        catch(Exception $ex)
        {
            $errors[] = $ex->getMessage() ;
        }
        $param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
    /**
     * Finding the products with different params
     *
     * @param unknown $sku
     * @param unknown $name
     * @param array $supplierIds
     * @param array $manufacturerIds
     * @param array $categoryIds
     * @param array $statusIds
     * @param string $active
     * @param string $pageNo
     * @param unknown $pageSize
     * @param unknown $orderBy
     * @param unknown $stats
     *
     * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
     */
    private function getProducts($sku, $name, array $manufacturerIds = array(), array $categoryIds = array(), $pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array(), &$stats = array())
    {
    	$where = array(1);
    	$params = array();

    	if ((($sku = trim($sku)) !== '') || (($name = trim($name)) !== '')) {
    		if ($sku !== '')
    		{
    			$where[] = 'pro.sku like :sku';
    			$params['sku'] = '%' . $sku . '%';
    		}
    		if ($name !== '')
    		{
    			$where[] = 'pro.name like :proName';
    			$params['proName'] = '%' . $name . '%';
    		}
    		TierRule::getQuery()->eagerLoad('TierRule.product', 'inner join', 'pro', 'pro.id = tr_rl.productId');
    	}
    	if (count($manufacturerIds) > 0) {
    		$ps = array();
    		$keys = array();
    		foreach ($manufacturerIds as $index => $value) {
    			$key = 'manf_' . $index;
    			$keys[] = ':' . $key;
    			$ps[$key] = trim($value);
    		}
    		$where[] = 'tr_rl.manufacturerId in (' . implode(',', $keys) . ')';
    		$params = array_merge($params, $ps);
    	}
    	if (count($categoryIds) > 0) {
    		$ps = array();
    		$keys = array();
    		foreach ($categoryIds as $index => $value) {
    			if(($category = ProductCategory::get($value)) instanceof ProductCategory)
    			{
    				$key = 'cateId_' . $index;
    				$keys[] = ':' . $key;
    				$ps[$key] = $category->getId();
    				$parent_category_ids = array();
    				foreach ($category->getAllChildrenIds() as $child_category_id)
    				{
    					$key = 'cateId_' . $index . '_' . $child_category_id;
    					$keys[] = ':' . $key;
    					$ps[$key] = $child_category_id;
    				}
    			}
    		}
    		$where[] = 'tr_rl.categoryId in (' . implode(',', $keys) . ')';
    		$params = array_merge($params, $ps);
    	}
    	$objs = TierRule::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, $orderBy, $stats);
    	return $objs;
    }
	/**
	 * getSearchCriteria
	 * @param unknown $serachCriteria
	 * @throws Exception
	 */
    private function getSearchCriteria($serachCriteria)
    {
    	$result = new stdClass();
    	//sku
        $sku = trim($serachCriteria['pro.sku']);
        $result->sku = $sku;
        //name
        $result->name = trim($serachCriteria['pro.name']);
        //manufactures
        if(!isset($serachCriteria['pro.manufacturerIds']) || is_null($serachCriteria['pro.manufacturerIds']))
        	$result->manufacturerIds = array();
        else $result->manufacturerIds = $serachCriteria['pro.manufacturerIds'];
        //categories
        if(!isset($serachCriteria['pro.productCategoryIds']) || is_null($serachCriteria['pro.productCategoryIds']))
        	$result->categoryIds = array();
        else $result->categoryIds = $serachCriteria['pro.productCategoryIds'];
        return $result;
    }
    /**
     * save the items
     *
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     *
     */
    public function saveItem($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		$class = trim($this->_focusEntity);
    		if(!isset($param->CallbackParameter->item))
    			throw new Exception("System Error: no item information passed in!");
    		$item = (isset($param->CallbackParameter->item->id) && ($item = $class::get($param->CallbackParameter->item->id)) instanceof $class) ? $item : null;
    		$productId = isset($param->CallbackParameter->item->productId) ? trim($param->CallbackParameter->item->productId) : '';
    		$product = null;
    		if ($productId !== '')
    			$product = Product::get($productId);
    		$brand = isset($param->CallbackParameter->item->brand) && (($brand = Manufacturer::get($param->CallbackParameter->item->brand)) instanceof Manufacturer) ? $brand : null;
    		$category = isset($param->CallbackParameter->item->category) && (($category = ProductCategory::get($param->CallbackParameter->item->category)) instanceof ProductCategory) ? $category : null;
    		//$tierprices = isset($param->CallbackParameter->item->tierprices) && (count($param->CallbackParameter->item->tierprices) > 0) ? $param->CallbackParameter->item->tierprices : array();
    		
    		$tierprices = isset($param->CallbackParameter->item->tierprices) ? json_decode(json_encode($param->CallbackParameter->item->tierprices), true) : array();
    		if ((!$product instanceof Product) && (!$brand instanceof Manufacturer) && (!$category instanceof ProductCategory))
    			throw new Exception("System Error: Sku, Brand and Category cannot be all empty!");
    		if (count($tierprices) === 0)
    			throw new Exception("System Error: Tier Price cannot be all empty!");
    		if (!$item instanceof $class)
    		{
    			// new rule
    			// the priority is 1) sku 2) brand and category 3) category 4) brand
    			// if the sku is set, even if brand and category are set, they will be ignored
    			// check if the product has already been set in current rule
    			$item = new TierRule();
    			$newTierPrice = new TierPrice();
    			
    			if ($product instanceof Product)
    			{
    				$tierRule = TierRule::getAllByCriteria('productId = ?', array($product->getId()));
    				if (count($tierRule) > 0)
    					throw new Exception("System Error: This product has alreay had tier price rule!");
    				$item->setProduct($product)->setPriorityId(TierRule::PRIORITY_ID_PID);
    			}
    			else if (($brand instanceof Manufacturer) && ($category instanceof ProductCategory))
    			{
    				$tierRule = TierRule::getAllByCriteria('manufacturerId = ? and categoryId = ?', array($brand->getId(), $category->getId()));
    				if (count($tierRule) > 0)
    					throw new Exception("System Error: This combination of brand and category has alreay had tier price rule!");
    				$item->setCategory($category)->setManufacturer($brand)->setPriorityId(TierRule::PRIORITY_ID_BRANDCATEGORY);
    			}
    			else if ($category instanceof ProductCategory)
    			{
    				$tierRule = TierRule::getAllByCriteria('categoryId = ? and manufacturerId is null', array($category->getId()));
    				if (count($tierRule) > 0)
    					throw new Exception("System Error: This category has alreay had tier price rule!");
    				$item->setCategory($category)->setPriorityId(TierRule::PRIORITY_ID_CATEGORY);
    			}
    			else if ($brand instanceof Manufacturer)
    			{
    				$tierRule = TierRule::getAllByCriteria('manufacturerId = ? and categoryId is null', array($brand->getId()));
    				if (count($tierRule) > 0)
    					throw new Exception("System Error: This brand has alreay had tier price rule!");
    				$item->setManufacturer($brand)->setPriorityId(TierRule::PRIORITY_ID_BRAND);
    			}
    			$item->save();
    			$this->setTierPrices($item, $tierprices);
    		}
    		else
    		{
    			// update
    			$this->setTierPrices($item, $tierprices);
    			//delete all old tier prices of the rule
    			ProductTierPrice::updateByCriteria('active = 0', 'active = 1 and tierruleId = ?' , array($item->getId()));
    		}
			// apply rule to products
			ProductTierPrice::create($item);
			
    		$results['item'] = $item->getJson();
    		
    		Dao::commitTransaction();
    	}
    	catch(Exception $ex)
    	{
    		Dao::rollbackTransaction();
    		$errors[] = $ex->getMessage();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
    /**
     * set tier prices
     * 
     * @param TierRule $tierRule
     * @param unknown $param
     * @return ListController
     */
    private function setTierPrices(TierRule $tierRule, $tierprices)
    {
    	if(isset($tierprices) && count($tierprices) > 0)
    	{
    		//delete all tier prices first
    		$deleteIds = array();
    		foreach($tierprices as $key => $tierprice)
    		{
    			if(trim($tierprice['active']) === '0' && isset($tierprice['id']))
    			{
    				$deleteIds[] = trim($tierprice['id']);
    				unset($tierprices[$key]);
    			}
    		}
    		// check duplicate
    		// tierId and quantity are keys.
    		$tierKey = array();
    		foreach($tierprices as $tierprice)
    		{
    			$key = $tierprice['tierId'] . intval(trim($tierprice['quantity']));
    			if (isset($tierKey[$key]))
    			{
    				throw new Exception("System Error: Duplicate tier price tier level and quantity.");
    			}
    			$tierKey[$key] = $key;
    		}
    		if(count($deleteIds) > 0)
    		{
    			TierPrice::updateByCriteria('active = 0', 'id in (' . implode(',', $deleteIds) . ')');
    		}
    
    		//update or create new
    		foreach($tierprices as $tierprice)
    		{
    			if(isset($tierprice['id']) && in_array(trim($tierprice['id']), $deleteIds))
    				continue;
    			if(!($type = TierPriceType::get(trim($tierprice['typeId']))) instanceof TierPriceType)
    				continue;
    			$tierLevelId = trim($tierprice['tierId']);
    			$tierLevel = TierLevel::get($tierLevelId);
    			$quantity = intval(trim($tierprice['quantity']));
    			$value = trim($tierprice['value']);
    			if(!isset($tierprice['id']) || ($id = trim($tierprice['id'])) === '')
    			{
    				//if it's deactivated one, ignore
    				if(trim($tierprice['active']) === '1')
    				{
    					$newTierPrice = new TierPrice();
    					$newTierPrice->setTierRule($tierRule)
    						->setTierLevel($tierLevel)
    						->setQuantity($quantity)
    						->setTierPriceType($type)
    						->setValue($value)
    						->save();
    				}
    			}
    			else if (($tierRulePrice= TierPrice::get($id)) instanceof TierPrice)
    			{
    				$tierRulePrice->setQuantity($quantity)
    					->setActive(trim($tierprice['active']) === '1')
    					->setTierRule($tierRule)
    					->setTierLevel($tierLevel)
    					->setTierPriceType($type)
    					->setValue($value)
    					->save();
    			}
    		}
    	}
    	return $this;
    }
    /**
     * delete the items
     *
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     *
     */
    public function deleteItems($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		$class = trim($this->_focusEntity);
    		$ids = isset($param->CallbackParameter->ids) ? $param->CallbackParameter->ids : array();
    		if(count($ids) > 0)
    		{
    			$class::updateByCriteria('active = 0', 'id in (' . implode(',', $ids) . ')');
    			TierPrice::updateByCriteria('active = 0', 'active = 1 and tierruleId in (' . implode(',', $ids) . ')');
    			ProductTierPrice::updateByCriteria('active = 0', 'active = 1 and tierruleId in (' . implode(',', $ids) . ')');
    		}
    		Dao::commitTransaction();
    	}
    	catch(Exception $ex)
    	{
    		Dao::rollbackTransaction();
    		$errors[] = $ex->getMessage();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
}
?>
