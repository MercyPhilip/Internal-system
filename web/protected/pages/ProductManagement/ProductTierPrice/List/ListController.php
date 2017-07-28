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
	protected $_focusEntity = 'ProductTierPrice';
	
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
		if(!AccessControl::canAccessProductsPage(Core::getRole()))
			die('You do NOT have access to this page');
		if(Core::getUser()->getStore()->getId() != 1)
			die(BPCPageAbstract::show404Page('Access Denied', 'You do NOT have the access to this page!'));
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
		foreach (Supplier::getAll() as $os)
			$supplierArray[] = $os->getJson();
		foreach (ProductStatus::getAll() as $os)
			$statuses[] = $os->getJson();
					
		$js = parent::_getEndJs();
		$js .= "pageJs.setPreData(" . json_encode($tierLevels) . "," .json_encode($tierPriceType) . ")";
		$js .= '._loadManufactures('.json_encode($manufactureArray).')';
		$js .= '._loadCategories('.json_encode($productCategoryArray).')';
		$js .= '._loadSuppliers('.json_encode($supplierArray).')';
		$js .= '._loadProductStatuses('.json_encode($statuses).')';
		$js .= "._loadChosen()";
		$js .= "._bindSearchKey()";
		$js .= "._bindNewRuleBtn()";
		$js .= ".setCallbackId('clearAllBtn', '" . $this->clearAllBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('newRule', '" . $this->newRuleBtn->getUniqueID() . "')";
		$js .= ".getResults(true, " . $this->pageSize . ");";
		return $js;
	}
	/**
	 * create new rule
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 */
	public function newRule($sender, $param)
	{
		$results = $errors = array();
		try
		{
			Dao::beginTransaction();
			if(!isset($param->CallbackParameter->productId) || !($product = Product::get(trim($param->CallbackParameter->productId))) instanceof Product)
				throw new Exception('Invalid Product Id passed in, "' . $param->CallbackParameter->productId . '" given');
			if(!isset($param->CallbackParameter->rule))
				throw new Exception('Invalid TierPriceRule passed in, "' . $param->CallbackParameter->rule . '" given');
			if(!isset($param->CallbackParameter->active))
				throw new Exception('Must pass in active (bool) for TierPriceRule, "' . $param->CallbackParameter->active . '" given');
			else $active = $param->CallbackParameter->active;
			$tierprices = isset($param->CallbackParameter->rule) ? json_decode(json_encode($param->CallbackParameter->rule), true) : array();
			if($active === false)
			{
				ProductTierPrice::updateByCriteria('active = 0', 'productId = ? and active = 1', array($product->getId()));
			}
			elseif($active === true)
			{
				// first delete all
				// then create new
				ProductTierPrice::updateByCriteria('active = 0', 'productId = ? and active = 1', array($product->getId()));
				$this->setTierPrices($product, $tierprices);
			}
			$tmpArray = array();
			$tmpArray = $product->getJson();				
			$tierprices = ProductTierPrice::getTierPrices($product);
			$tmpArray['tierprices'] = $tierprices;
			$results['item'] = $tmpArray;
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
            		,$serachCriteria->supplierIds
            		,$serachCriteria->manufacturerIds
            		,$serachCriteria->categoryIds
            		,$serachCriteria->productStatusIds
            		,$serachCriteria->active
            		,$pageNo
            		,$pageSize
            		,array('pro.sku' => 'asc')
            		,$stats
            		,$serachCriteria->sh_from
            		,$serachCriteria->sh_to
            		,$serachCriteria->sellOnWeb
            		);
            
            $results['pageStats'] = $stats;
            $results['items'] = array();
            $tierPrices = array();
            foreach($objects as $obj)
            {
               	$tmpArray = $obj->getJson();
            	$tierPrices = ProductTierPrice::getTierPrices($obj);
            	$tmpArray['tierprices'] = $tierPrices;
            	$tmpArray['buyinprice'] = ProductBuyinPrice::getBuyinPrice($obj->getId());
            	$results['items'][] = $tmpArray;
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
    private function getProducts($sku, $name, array $supplierIds = array(), array $manufacturerIds = array(), array $categoryIds = array(), array $statusIds = array(), $active = null, $pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array(), &$stats = array(), $sh_from = null, $sh_to = null, $sellOnWeb = null)
    {
    	$where = array(1);
    	$params = array();
    
    	if (is_array($sku)) {
    		$skus = array();
    		$keys = array();
    		foreach ($sku as $index => $value) {
    			$key = 'sku_' . $index;
    			$keys[] = ':' . $key;
    			$skus[$key] = trim($value);
    		}
    		$where[] = 'pro.sku in (' . implode(',', $keys) . ')';
    		$params = array_merge($params, $skus);
    	} else if (($sku = trim($sku)) !== '') {
    		$where[] = 'pro.sku like :sku';
    		$params['sku'] = '%' . $sku . '%';
    	}
    	if (($name = trim($name)) !== '') {
    		$where[] = 'pro.name like :proName';
    		$params['proName'] = '%' . $name . '%';
    	}
    	if (($active = trim($active)) !== '') {
    		$where[] = 'pro.active = :active';
    		$params['active'] = intval($active);
    	}
    	if (($sellOnWeb = trim($sellOnWeb)) !== '') {
    		$where[] = 'pro.sellOnWeb = :sellOnWeb';
    		$params['sellOnWeb'] = intval($sellOnWeb);
    	}
    	if (count($manufacturerIds) > 0) {
    		$ps = array();
    		$keys = array();
    		foreach ($manufacturerIds as $index => $value) {
    			$key = 'manf_' . $index;
    			$keys[] = ':' . $key;
    			$ps[$key] = trim($value);
    		}
    		$where[] = 'pro.manufacturerId in (' . implode(',', $keys) . ')';
    		$params = array_merge($params, $ps);
    	}
    	Product::getQuery()->eagerLoad('Product.stocks', 'inner join', 'pro_stock_info', 'pro.id = pro_stock_info.productId and pro_stock_info.storeId = :storeId');
    	$params['storeId'] = Core::getUser()->getStore()->getId();
    	
    	if (count($statusIds) > 0) {
			$ps = array();
			$keys = array();
			foreach ($statusIds as $index => $value) {
				$key = 'stId_' . $index;
				$keys[] = ':' . $key;
				$ps[$key] = trim($value);
			}
 			$where[] = 'pro_stock_info.statusId in (' . implode(',', $keys) . ')';
 			$params = array_merge($params, $ps);
		}
    	if (count($supplierIds) > 0) {
    		$ps = array();
    		$keys = array();
    		foreach ($supplierIds as $index => $value) {
    			$key = 'spId_' . $index;
    			$keys[] = ':' . $key;
    			$ps[$key] = trim($value);
    		}
    		Product::getQuery()->eagerLoad('Product.supplierCodes', 'inner join', 'pro_sup_code', 'pro.id = pro_sup_code.productId and pro_sup_code.active =1 and pro_sup_code.supplierId in (' . implode(',', $keys) . ')');
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
    		Product::getQuery()->eagerLoad('Product.categories', 'inner join', 'pro_cate', 'pro.id = pro_cate.productId and pro_cate.categoryId in (' . implode(',', $keys) . ')');
    		$params = array_merge($params, $ps);
    	}
		
		if (($sh_from = trim($sh_from)) !== '') {
			$where[] = 'pro_stock_info.stockOnHand >= :stockOnHand_from';
			$params['stockOnHand_from'] = intval($sh_from);
		}
		if (($sh_to = trim($sh_to)) !== '') {
			$where[] = 'pro_stock_info.stockOnHand <= :stockOnHand_to';
			$params['stockOnHand_to'] = intval($sh_to);
		}
    	
    	$products = Product::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, $orderBy, $stats);
    	return $products;
    	
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
        if(strpos($sku, ',') !== false) {
        	$sku = array_map(create_function('$a', 'return trim($a);'), explode(',', $sku));
        }
        $result->sku = $sku;
        //name
        $result->name = trim($serachCriteria['pro.name']);
        //suppliers
        if(!isset($serachCriteria['pro.supplierIds']) || is_null($serachCriteria['pro.supplierIds']))
        	$result->supplierIds = array();
        else $result->supplierIds = $serachCriteria['pro.supplierIds'];
        //manufactures
        if(!isset($serachCriteria['pro.manufacturerIds']) || is_null($serachCriteria['pro.manufacturerIds']))
        	$result->manufacturerIds = array();
        else $result->manufacturerIds = $serachCriteria['pro.manufacturerIds'];
        //categories
        if(!isset($serachCriteria['pro.productCategoryIds']) || is_null($serachCriteria['pro.productCategoryIds']))
        	$result->categoryIds = array();
        else $result->categoryIds = $serachCriteria['pro.productCategoryIds'];
        //product statuses
        if(!isset($serachCriteria['pro.productStatusIds']) || is_null($serachCriteria['pro.productStatusIds']))
        	$result->productStatusIds = array();
        else $result->productStatusIds = $serachCriteria['pro.productStatusIds'];
        //product active
        if(trim($serachCriteria['pro.active']) === "ALL")
        	$result->active = " ";
        else $result->active = trim($serachCriteria['pro.active']);
        //stock on hand from
        if(is_array(json_decode($serachCriteria['pro.sh'])) && count(json_decode($serachCriteria['pro.sh'])) === 2)
        {
        	$array = json_decode($serachCriteria['pro.sh']);
            $result->sh_from = $array[0];
            $result->sh_to = $array[1];
        }
        else throw new Exception('Invalid stock on hand range, "' . $serachCriteria['pro.sh'] . '" given');
        //stock level
        $result->stockLevel = array();
        //sellOnWeb
        if(trim($serachCriteria['pro.sellOnWeb']) === "ALL")
        	$result->sellOnWeb = " ";
        else $result->sellOnWeb = trim($serachCriteria['pro.sellOnWeb']);
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
    		if(!isset($param->CallbackParameter->item))
    			throw new Exception("System Error: no item information passed in!");
    		if (!isset($param->CallbackParameter->item->id) || !($item = Product::get($param->CallbackParameter->item->id)) instanceof Product)
    		{
    			throw new Exception("System Error: Invalid product passed in!");
    		}
    		$tierprices = isset($param->CallbackParameter->item->tierprices) ? json_decode(json_encode($param->CallbackParameter->item->tierprices), true) : array();
    		$this->setTierPrices($item, $tierprices);
    		$tmpArray = $item->getJson();
    		$tierPrices = ProductTierPrice::getTierPrices($item);
    		$tmpArray['tierprices'] = $tierPrices;
    		$results['item'] = $tmpArray;
    		
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
     * @param Product $product
     * @param unknown $param
     * @return ListController
     */
    private function setTierPrices(Product $product, $tierprices)
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
    			ProductTierPrice::updateByCriteria('active = 0', 'id in (' . implode(',', $deleteIds) . ')');
    		}
    		
    		$tierRules = TierRule::getAllByCriteria('productId = ?', array($product->getId()));
    		if (count($tierRules) > 0){
    			$tierRule = $tierRules[0];
    		}else{
    			throw new Exception("System Error: No tier rule for this product.");
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
    					$newproductTierPrice = new ProductTierPrice();
    					$newproductTierPrice->setProduct($product)
    						->setTierLevel($tierLevel)
    						->setQuantity($quantity)
    						->setTierPriceType($type)
    						->setValue($value)
    						->setPriorityId(ProductTierPrice::PRIORITY_ID_PID)
    						->setTierRule($tierRule)
    						->save();
    				}
    			}
    			else if (($productTierPrice= ProductTierPrice::get($id)) instanceof ProductTierPrice)
    			{
    				$productTierPrice->setQuantity($quantity)
    					->setActive(trim($tierprice['active']) === '1')
    					->setTierLevel($tierLevel)
    					->setTierPriceType($type)
    					->setValue($value)
    					->setPriorityId(ProductTierPrice::PRIORITY_ID_PID)
    					->setTierRule($tierRule)
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
    		$id = isset($param->CallbackParameter->id) ? $param->CallbackParameter->id : '';
    		$item = Product::get($id);
    		if($item instanceof Product)
    		{
    			ProductTierPrice::updateByCriteria('active = 0', 'productId = ? and active = 1', array($item->getId()));
    		}
    		else
    		{
    			throw new Exception("System Error: Invalid product passed in!");
    		}
    		$tmpArray = $item->getJson();
    		$tierPrices = ProductTierPrice::getTierPrices($item);
    		$tmpArray['tierprices'] = $tierPrices;
    		$results['item'] = $tmpArray;
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
     * initialize the new stock take table
     *
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     *
     */
    public function clearAll($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		//clear records in stocktake table
    		ProductTierPrice::updateByCriteria('active = 0', 'active != 0');
    		Dao::commitTransaction();
    	}
    	catch(Exception $ex)
    	{
    		Dao::rollbackTransaction();
    		$errors[] = $ex->getMessage();
    		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    		return;
    	}
    	 
    	$this->getItems($sender, $param);
    }
}
?>
