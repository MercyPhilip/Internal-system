<?php
/**
 * This is the ProductController
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class ProductController extends CRUDPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'products';
	protected $_focusEntity = 'Product';
	/**
	 * The switch for priceMatch functions
	 *
	 * @var string
	 */
	private  $enable;	
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
		if(!AccessControl::canAccessProductsPage(Core::getRole()))
			die('You do NOT have access to this page');
		
		$this->enable = Config::get('PriceMatch','Enable');
	}
	
	/**
	 * Getting the enable
	 *
	 * @return string
	 */
	public function getEnable() {
		return trim($this->enable);
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
		$js .= 'pageJs.totalValueId = "total-found-value";';
		$js .= 'pageJs.totalQtyId = "total-found-qty";';
		$js .= 'pageJs._loadManufactures('.json_encode($manufactureArray).')';
		$js .= '._loadSuppliers('.json_encode($supplierArray).')';
		$js .= '._loadCategories('.json_encode($productCategoryArray).')';
		$js .= '._loadProductStatuses('.json_encode($statuses).')';
		$js .= "._loadChosen()";
		$js .= "._bindSearchKey()";
		$js .= "._bindNewRuleBtn()";
		$js .= ".setCallbackId('checkPriceMatchEnable', '" . $this->checkPriceMatchEnable->getUniqueID() . "')";
		$js .= ".setCallbackId('priceMatching', '" . $this->priceMatchingBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('toggleActive', '" . $this->toggleActiveBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('toggleSellOnWeb', '" . $this->toggleSellOnWebBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('updatePrice', '" . $this->updatePriceBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('updateStockLevel', '" . $this->updateStockLevelBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('toggleIsKit', '" . $this->toggleIsKitBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('toggleManualFeed', '" . $this->toggleManualFeedBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('newRule', '" . $this->newRuleBtn->getUniqueID() . "')";
		$js .= ".setConfigPriceMatch(" . json_encode(Config::get('PriceMatch', 'Enable')) . ")";
		$js .= ".setConfigGst(" . json_encode(Config::get('Accounting', 'GST')) . ");";
		//$js .= ".getResults(true, " . $this->pageSize . ");";
// 		if(!AccessControl::canEditPrice())
// 			$js .= "pageJs.readOnlyMode();";
		$mode = AccessControl::canEditPrice();
		$js .= "pageJs.readOnlyMode(" . intval($mode) .  "," . Core::getUser()->getStore()->getId() . "," . Core::getRole()->getId() . ");";
		return $js;
	}
	public function newRule($sender, $param)
	{
		$results = $errors = array();
		try
		{
			Dao::beginTransaction();
			
			$results = $param->CallbackParameter;
			
			if(!isset($param->CallbackParameter->productId) || !($product = Product::get(trim($param->CallbackParameter->productId))) instanceof Product)
				throw new Exception('Invalid Product Id passed in, "' . $param->CallbackParameter->productId . '" given');
			if(!isset($param->CallbackParameter->rule))
				throw new Exception('Invalid PriceMatchRule passed in, "' . $param->CallbackParameter->rule . '" given');
			if(!isset($param->CallbackParameter->rule->active))
				throw new Exception('Must pass in active (bool) for PriceMatchRule, "' . $param->CallbackParameter->rule->active . '" given');
			else $active = $param->CallbackParameter->rule->active;
			if($active === true && (!isset($param->CallbackParameter->rule->company_id) || !($company = PriceMatchCompany::get(trim($param->CallbackParameter->rule->company_id))) instanceof PriceMatchCompany))
				throw new Exception('Invalid PriceMatchCompany Id passed in, "' . $param->CallbackParameter->rule->company_id . '" given');
			if($active === false && ($rule = ProductPriceMatchRule::getByProduct($product)) instanceof ProductPriceMatchRule)
			{
				$rule->setActive($active)->save();
				$results = $rule->getJson();
				
			}
			elseif($active === true)
			{
				
				$rule = ProductPriceMatchRule::create($product, $company, trim($param->CallbackParameter->rule->price_from), trim($param->CallbackParameter->rule->price_to), trim($param->CallbackParameter->rule->offset));
				PriceMatchConnector::run($product->getSku(), true);
				
				PriceMatchConnector::getMinRecord($product->getSku(), true);
				PriceMatchConnector::getNewPrice($product->getSku(), true, true);
				$results = $rule->getJson();
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
	public function getRequestProductID()
	{
		return ($product = Product::get($this->Request['id']))  instanceof Product ? $product->getId() : '';
	}
	/**
	 * Updating the full description of the product
	 *
	 * @param Product $product
	 * @param unknown $param
	 *
	 * @return ProductController
	 */
	private function _updateFullDescription(Product &$product, $param)
	{
		//update full description
		if(isset($param->CallbackParameter->fullDescription) && ($fullDescription = trim($param->CallbackParameter->fullDescription)) !== '')
		{
			if(($fullAsset = Asset::getAsset($product->getFullDescAssetId())) instanceof Asset)
				Asset::removeAssets(array($fullAsset->getAssetId()));
			$fullAsset = Asset::registerAsset('full_description_for_product.txt', $fullDescription, Asset::TYPE_PRODUCT_DEC);
			$product->setFullDescAssetId($fullAsset->getAssetId());
		}
		return $this;
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
	            $objects = Product::getProducts(
	            		$serachCriteria->sku
	            		,$serachCriteria->name
	            		,$serachCriteria->supplierIds
	            		,$serachCriteria->manufacturerIds
	            		,$serachCriteria->categoryIds
	            		,$serachCriteria->productStatusIds
	            		,$serachCriteria->active
	            		,$pageNo
	            		,$pageSize
	            		,array('pro.name' => 'asc')
	            		,$stats
	            		,$serachCriteria->stockLevel
	            		,$sumArray
	            		,$serachCriteria->sh_from
	            		,$serachCriteria->sh_to
	            		,$serachCriteria->sellOnWeb
	            		,$serachCriteria->barcode
	            		);
            }
            $results['pageStats'] = $stats;
            $results['items'] = array();
            foreach($objects as $obj)
            {
                $tmpArray = $obj->getJson();
                $tier0Prices = ProductTierPrice::getAllByCriteria('productId = ? and tierLevelId = 0', array($obj->getId()));
                $objsOfStore1 = ProductStockInfo::getAllByCriteria('productId = ? and storeId = 1', array($obj->getId()));
                $unitCostOfStore1 = 0;
                if (count($objsOfStore1) > 0)
                {
                	$objsOfStore1 = $objsOfStore1[0];
                	$unitCostOfStore1 = intval($objsOfStore1->getStockOnHand()) === 0 ? 0 : round(abs($objsOfStore1->getTotalOnHandValue()) / abs(intval($objsOfStore1->getStockOnHand())), 2);
                }
                $rets = array();
                foreach($tier0Prices as $tier0Price)
                {
                	$ret = array();
                	$ret = $tier0Price->getJson();
                	$ret['unitCost'] = $unitCostOfStore1;
                	$rets[] = $ret;
                }
                //get cost trend
                $costTrends = $this->getCostTrend($obj->getId());
                $tmpArray['costtrends'] = $costTrends;
                $tmpArray['tierprices'] = $rets;
                $results['items'][] = $tmpArray;
            }
            $results['totalStockOnHand'] = isset($sumArray['totalStockOnHand']) ? trim($sumArray['totalStockOnHand']) : 0;
            $results['totalOnHandValue'] = isset($sumArray['totalOnHandValue']) ? trim($sumArray['totalOnHandValue']) : 0;
        }
        catch(Exception $ex)
        {
            $errors[] = $ex->getMessage() ;
        }
        $param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
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
        $result->stockLevel = $serachCriteria['pro.stockLevel'];
        //sellOnWeb
        if(trim($serachCriteria['pro.sellOnWeb']) === "ALL")
        	$result->sellOnWeb = " ";
        else $result->sellOnWeb = trim($serachCriteria['pro.sellOnWeb']);
        //barcode
		$result->barcode = trim($serachCriteria['pro.barcode']);
        return $result;
    }
    /**
     * Getting price matching information
     *
     * @param unknown $sender
     * @param unknown $param
     */
    public function priceMatching($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		$id = isset($param->CallbackParameter->id) ? $param->CallbackParameter->id : '';
    		$product = Product::get($id);
    		$prices = ProductPrice::getPrices($product, ProductPriceType::get(ProductPriceType::ID_RRP));
    		
    		$companies = PriceMatcher::getAllCompaniesForPriceMatching();
    		//$prices = PriceMatcher::getPrices($companies, $product->getSku(), (count($prices)===0 ? 0 : $prices[0]->getPrice()) );
    		$prices = PriceMatcher::getMatchPrices($companies, $product->getSku(), (count($prices)===0 ? 0 : $prices[0]->getPrice()) );
    		
    		
//     		$myPrice = $prices['myPrice'];
//     		$minPrice = $prices['minPrice'];
//     		$msyPrice = $prices['companyPrices']['MSY'];
    		$prices['id'] = $id;
    		$results = $prices;
    	}
    	catch(Exception $ex)
    	{
    		$errors[] = $ex->getMessage().$ex->getTraceAsString();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);

    }
    
    /**
     * toggleSellOnWeb
     * 
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     */
    public function toggleSellOnWeb($sender, $param)
    {

    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		$id = isset($param->CallbackParameter->productId) ? $param->CallbackParameter->productId : '';
    		if(!($product = Product::get($id)) instanceof Product)
    			throw new Exception('Invalid product!');
    		$sellOnWeb = intval($param->CallbackParameter->isSellOnWeb);
    		if (($product->getStockOnHand() > 0) && !$sellOnWeb)
    		{
    			throw new Exception("Can't take off this product from online because SOH is not zero.");
    		}
    		$product->setSellOnWeb(intval($param->CallbackParameter->isSellOnWeb))
    		->save()
    		->addLog('SellOnWeb changed by ' . Core::getUser()->getUserName() . '(' . intval(!$sellOnWeb) . ' => ' . intval($sellOnWeb) . ')', Log::TYPE_SYSTEM, 'SELLONWEB_CHG', __CLASS__ . '::' . __FUNCTION__);
    		$results['item'] = $product->getJson();
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
     * toggleActive
     *
     * @param unknown $sender
     * @param unknown $param
     */
    public function toggleActive($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		$id = isset($param->CallbackParameter->productId) ? $param->CallbackParameter->productId : '';
    		if(!($product = Product::get($id)) instanceof Product)
    			throw new Exception('Invalid product!');
    		$product->setActive(intval($param->CallbackParameter->active))
    			->save();
    		$results['item'] = $product->getJson();
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
     * toggleIsKit
     *
     * @param unknown $sender
     * @param unknown $param
     */
    public function toggleIsKit($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		$id = isset($param->CallbackParameter->productId) ? $param->CallbackParameter->productId : '';
    		if(!($product = Product::get($id)) instanceof Product)
    			throw new Exception('Invalid product!');
    		$product->setIsKit(intval($param->CallbackParameter->isKit))
    			->save();
    		$results['item'] = $product->getJson();
    		Dao::commitTransaction();
    	}
    	catch(Exception $ex)
    	{
    		Dao::rollbackTransaction();
    		$errors[] = $ex->getMessage();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
    public function toggleManualFeed($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		$id = isset($param->CallbackParameter->productId) ? $param->CallbackParameter->productId : '';
    		if(!($product = Product::get($id)) instanceof Product)
    			throw new Exception('Invalid product!');
    		$product->setManualDatafeed(intval($param->CallbackParameter->isManualFeed) === 1)
    			->save();
    		$results['item'] = $product->getJson();
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
     * updateproduct price
     *
     * @param unknown $sender
     * @param unknown $param
     */
    public function updatePrice($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		$id = isset($param->CallbackParameter->productId) ? $param->CallbackParameter->productId : '';
    		if(!($product = Product::get($id)) instanceof Product)
    			throw new Exception('Invalid product!');
    		if(!isset($param->CallbackParameter->newPrice))
    			throw new Exception('No New Price Provided!');
    		$isSpecial = 0;
    		if(isset($param->CallbackParameter->isSpecial))
    		{
    			$isSpecial = intval($param->CallbackParameter->isSpecial);
    		}
    		$newPrice = StringUtilsAbstract::getValueFromCurrency(trim($param->CallbackParameter->newPrice));
    		
    		if ($isSpecial === 0)
    		{
    			$priceType = ProductPriceType::ID_RRP;
    		}
    		else 
    		{
    			$priceType = ProductPriceType::ID_CASUAL_SPECIAL;
    		}
    		
    		$prices = ProductPrice::getAllByCriteria('productId = ? and typeId = ?', array($product->getId(), $priceType), true, 1, 1);
    		if(count($prices) > 0) {
    			$msg = 'Update price for product(SKU=' . $product->getSku() . ') to '. StringUtilsAbstract::getCurrency($newPrice);
    			$price = $prices[0];
    		} else {
    			$msg = 'New Price Created for product(SKU=' . $product->getSku() . '): '. StringUtilsAbstract::getCurrency($newPrice);
    			$price = new ProductPrice();
    			$price->setProduct($product)
    				->setType(ProductPriceType::get($priceType));
    		}

    		$price->setPrice($newPrice)
	    		->save()
	    		->addComment($msg, Comments::TYPE_NORMAL)
	    		->addLog($msg, Log::TYPE_SYSTEM);
    		$product->addComment($msg, Log::TYPE_SYSTEM)
	    		->addLog($msg, Log::TYPE_SYSTEM);

    		
    		
    		$results['item'] = $product->getJson();
    		Dao::commitTransaction();
    	}
    	catch(Exception $ex)
    	{
    		Dao::rollbackTransaction();
    		$errors[] = $ex->getMessage() . $ex->getTraceAsString();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
    public function updateStockLevel($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		$id = isset($param->CallbackParameter->productId) ? $param->CallbackParameter->productId : '';
    		if(!($product = Product::get($id)) instanceof Product)
    			throw new Exception('Invalid product!');
    		if(!isset($param->CallbackParameter->newValue))
    			throw new Exception('No New ' . $param->CallbackParameter->type .' Provided!');
    		else $newValue = intval($param->CallbackParameter->newValue);
    		if(!isset($param->CallbackParameter->type))
    			throw new Exception('Invalue Type "' . $param->CallbackParameter->type . '" Provided!');
    		else $type = $param->CallbackParameter->type;
    		switch($param->CallbackParameter->type)
    		{
    			case 'stockMinLevel':
    				$msg = 'Update ' . $type .' for product(SKU=' . $product->getSku() . ') to '. $param->CallbackParameter->newValue;
    				$product->setStockMinLevel($newValue)
	    				->addComment($msg, Comments::TYPE_NORMAL)
	    				->addLog($msg, Log::TYPE_SYSTEM);
    				break;
    			case 'stockReorderLevel':
    				$msg = 'Update ' . $type .' for product(SKU=' . $product->getSku() . ') to '. $param->CallbackParameter->newValue;
    				$product->setStockReorderLevel($newValue)
	    				->addComment($msg, Comments::TYPE_NORMAL)
	    				->addLog($msg, Log::TYPE_SYSTEM);
    				break;
    			default: throw new Exception('Invalue Type "' . $param->CallbackParameter->type . '" Provided!');
    		}
    		$product->save();
    		$results['item'] = $product->getJson();
    		Dao::commitTransaction();
    	}
    	catch(Exception $ex)
    	{
    		Dao::rollbackTransaction();
    		$errors[] = $ex->getMessage() . $ex->getTraceAsString();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
    /**
     * 
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     */
    private function getCostTrend($productId)
    {
    	$results = $errors = array();
    	try
    	{
    		$id = isset($productId) ? $productId : '';
    		if(!($product = Product::get($id)) instanceof Product)
    			throw new Exception('Invalid product!');
    		$storeId = Core::getUser()->getStore()->getId();
    		$sql = "select DISTINCT r.updated, r.purchaseOrderId, r.unitPrice, po.purchaseOrderNo  from receivingitem r, purchaseorder po 
    				where po.id = r.purchaseOrderId and r.storeId = po.storeId and po.active = 1 and 
    				r.productId = ? and r.storeId = ? order by r.updated desc limit 10";
    		$rets = Dao::getResultsNative($sql, array($id, $storeId), PDO::FETCH_ASSOC);
    		if (count($rets) > 0)
    		{
    			$date = array();
    			foreach ($rets as $key => $row)
    			{
    				$date[$key] = $row['updated'];
    			}
    			array_multisort($date, SORT_ASC, $rets);
    			$results['trends'] = $rets;
    			// array_column is only supported since php5.5
    			// so need to use other function to replace it
    			$results['order'] = $this->getOrder(self::arraycolumn($rets, 'unitPrice'));
    		}
    	}
    	catch(Exception $ex)
    	{
    		$errors[] = $ex->getMessage() . $ex->getTraceAsString();
    	}
    	return $results;
    }
    /**
     * get the order 
     * 1: asc
     * 0: mixed
     * -1: desc
     * @param unknown $rgData
     * @return NULL|number
     */
    private function getOrder($rgData)
    {
    	if(!count($rgData) || count($rgData)==1)
    	{
    		return null;
    	}
    	$sCurrent = doubleval(array_shift($rgData));
    	//$iOrder   = doubleval(current($rgData)) >= $sCurrent ? 1 : -1;
    	if (doubleval(current($rgData)) > $sCurrent)
    	{
    		$iOrder = 1;
    	}
    	else if (doubleval(current($rgData)) < $sCurrent)
    	{
    		$iOrder = -1;
    	}
    	else
    		$iOrder = 2;
    	foreach($rgData as $mValue)
    	{
    		if(($sCurrent>doubleval($mValue) && $iOrder == 1) ||
    				($sCurrent < doubleval($mValue) && $iOrder == -1))
    		{
    			return 0;
    		}
    		else if ($sCurrent>doubleval($mValue) && $iOrder == 2)
    		{
    			$iOrder = -1;
    		}
    		else if ($sCurrent<doubleval($mValue) && $iOrder == 2)
    		{
    			$iOrder = 1;
    		}
    		$sCurrent = doubleval($mValue);
    	}
    	return $iOrder;
    }
    private static function arraycolumn(array $input, $columnKey, $indexKey = null) {
    	$array = array();
    	foreach ($input as $value) {
    		if ( ! isset($value[$columnKey])) {
    			trigger_error("Key \"$columnKey\" does not exist in array");
    			return false;
    		}
    		if (is_null($indexKey)) {
    			$array[] = $value[$columnKey];
    		}
    		else {
    			if ( ! isset($value[$indexKey])) {
    				trigger_error("Key \"$indexKey\" does not exist in array");
    				return false;
    			}
    			if ( ! is_scalar($value[$indexKey])) {
    				trigger_error("Key \"$indexKey\" does not contain scalar value");
    				return false;
    			}
    			$array[$value[$indexKey]] = $value[$columnKey];
    		}
    	}
    	return $array;
    }
    
    /**
     * Check PriceMatch function enable or not
     *
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     *
     */
    public function checkPriceMatchEnable($sender, $param) {
    	$results = $errors = array();
    	try {
    		$results['enable'] = $this->getEnable();
    	}
    	catch(Exception $ex)
    	{
    		$errors[] = $ex->getMessage();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }    
}
?>