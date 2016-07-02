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
	public $menuItem = 'products';
	protected $_focusEntity = 'Product';
	
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
		foreach (Supplier::getAll() as $os)
			$supplierArray[] = $os->getJson();
		foreach (ProductStatus::getAll() as $os)
			$statuses[] = $os->getJson();
		foreach (ProductCategory::getAll() as $os)
			$productCategoryArray[] = $os->getJson();
		
		$js = parent::_getEndJs();
		if(($product = Product::get($this->Request['id']))  instanceof Product) {
			$js .= "$('searchPanel').hide();";
			$js .= "pageJs._singleProduct = true;";
		}
		$js .= 'pageJs._loadManufactures('.json_encode($manufactureArray).')';
		$js .= '._loadSuppliers('.json_encode($supplierArray).')';
		$js .= '._loadCategories('.json_encode($productCategoryArray).')';
		$js .= '._loadProductStatuses('.json_encode($statuses).')';
		$js .= "._loadChosen()";
		$js .= "._bindSearchKey()";
		$js .= ".getResults(true, " . $this->pageSize . ");";
		return $js;
	}
	public function getRequestProductID()
	{
		return ($product = Product::get($this->Request['id']))  instanceof Product ? $product->getId() : '';
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
            if(!isset($param->CallbackParameter->searchCriteria) || count($serachCriteria = json_decode(json_encode($param->CallbackParameter->searchCriteria), true)) === 0)
                throw new Exception('System Error: search criteria not provided!');
            $sumArray = array();
            if(isset($serachCriteria['pro.id']) && ($product = Product::get($serachCriteria['pro.id'])) instanceof Product) {
            	$objects = array($product);
            	$stats = array('totalPages' => 1);
            } else {
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
            }
            
            $results['pageStats'] = $stats;
            $results['items'] = array();
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
    	if (count($statusIds) > 0) {
    		$ps = array();
    		$keys = array();
    		foreach ($statusIds as $index => $value) {
    			$key = 'stId_' . $index;
    			$keys[] = ':' . $key;
    			$ps[$key] = trim($value);
    		}
    		$where[] = 'pro.statusId in (' . implode(',', $keys) . ')';
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
    		Product::getQuery()->eagerLoad('Product.supplierCodes', 'inner join', 'pro_sup_code', 'pro.id = pro_sup_code.productId and pro_sup_code.supplierId in (' . implode(',', $keys) . ')');
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
    		$where[] = 'pro.stockOnHand >= :stockOnHand_from';
    		$params['stockOnHand_from'] = intval($sh_from);
    	}
    	if (($sh_to = trim($sh_to)) !== '') {
    		$where[] = 'pro.stockOnHand <= :stockOnHand_to';
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
    		$class = trim($this->_focusEntity);
    		if(!isset($param->CallbackParameter->item))
    			throw new Exception("System Error: no item information passed in!");
    		$item = (isset($param->CallbackParameter->item->id) && ($item = $class::get($param->CallbackParameter->item->id)) instanceof $class) ? $item : null;
    		if (!$item instanceof $class)
    			throw new Exception("System Error: Invalid item information passed in!");
    		$stockOnHand = trim($param->CallbackParameter->item->stockOnHand);
			$unitCost = $item->getUnitCost();
			if ($stockOnHand != null && ($stockOnHand = trim($stockOnHand)) !== trim($origStockOnHand = $item->getStockOnHand())) {
				$item->setTotalOnHandValue($stockOnHand * $unitCost)
				->setStockOnHand($stockOnHand)->save();
			}
			$msg = 'Stock changed: StockOnHand [' . $origStockOnHand . ' => ' . $stockOnHand . ']';
			$item->snapshotQty(null, ProductQtyLog::TYPE_STOCK_ADJ, 'Manual Adjusted by ' . Core::getUser()->getPerson()->getFullName())->save();
			
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
    
}
?>
