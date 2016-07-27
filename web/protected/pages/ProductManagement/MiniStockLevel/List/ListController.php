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
		$js .= "._bindExcelKey()";
		$js .= ".setCallbackId('updateStockLevel', '" . $this->updateStockLevelBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('updateETA', '" . $this->updateETABtn->getUniqueID() . "')";
		$js .= ".setCallbackId('genReport', '" . $this->genReportBtn->getUniqueID() . "')";
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
            
            // get product id map
            $proIdMaps = array();
            foreach($results['items'] as $row)
            	$proIdMaps[$row['id']] = $row + array('lastbuyprice' => '', 'eta' => '', 'ow' => 0, 'tw' => 0, 'om' => 0, 'poId' => '', 'quantity' => '');
            
            $productIds = array_keys($proIdMaps);
            // get last buy price and ETA
            $etaLastbuys = $this->getETALastBuy($productIds);
            foreach($etaLastbuys as $row)
            {
            	$proIdMaps[$row['id']] = isset($proIdMaps[$row['id']])? array_merge($proIdMaps[$row['id']], $row) : $proIdMaps[$row['id']];
            }
            // get run rate
            $rates = $this->getRunRateData($productIds);
            foreach($rates as $row)
            {
            	$proIdMaps[$row['id']] = isset($proIdMaps[$row['id']])? array_merge($proIdMaps[$row['id']], $row): $proIdMaps[$row['id']];
            }
            //rebuild array
            $retMaps = array();
            foreach($proIdMaps as $row)
            	$retMaps[] = $row;
            $results['pageStats'] = $stats;
            $results['items'] = $retMaps;
            
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
    	Product::getQuery()->eagerLoad('Product.stocks', 'inner join', 'pro_stock_info', 'pro.id = pro_stock_info.productId and pro_stock_info.storeId = :storeId');
    	$params['storeId'] = Core::getUser()->getStore()->getId();
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
    		$where[] = 'pro_stock_info.stockOnHand >= :stockOnHand_from';
    		$params['stockOnHand_from'] = intval($sh_from);
    	}
    	if (($sh_to = trim($sh_to)) !== '') {
    		$where[] = 'pro_stock_info.stockOnHand <= :stockOnHand_to';
    		$params['stockOnHand_to'] = intval($sh_to);
    	}
    	$where[] = 'pro_stock_info.stockOnHand <= pro_stock_info.stockMinLevel';
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
     * get eta and last buy price
     * @param unknown $productIds
     */
    private function getETALastBuy($productIds)
    {
    	if(count($productIds) === 0)
    		return array();
    	$sql = "SELECT
					`id`,
					lastbuyprice,
					eta,
					poId
				FROM
					(
						SELECT
							LB.productId `id`,
							ifnull(LB.unitPrice, '') lastbuyprice,
							ifnull(ETA.eta, '') eta,
							ETA.poId poId
						FROM
							(
								SELECT DISTINCT
									rec1.productId,
									rec1.updated,
									rec1.unitPrice
								FROM
									receivingitem rec1,
									(
										SELECT
											rec2.productId,
											max(rec2.updated) `updated`
										FROM
											receivingitem rec2
										WHERE rec2.active = 1 and rec2.storeId = :storeId
										GROUP BY
											rec2.productId
									) rec3
								WHERE
									rec1.productId = rec3.productId
								AND rec1.updated = rec3.updated
							) LB
						LEFT JOIN (
							SELECT DISTINCT
								poi.productId,
								po.id poId,
								DATE_FORMAT(max(po.eta), '%Y-%m-%d') `eta`
							FROM
								purchaseorder po,
								purchaseorderitem poi
							WHERE
								po.id = poi.purchaseOrderId and poi.active = 1 and po.active = 1 and po.storeId = poi.storeId and po.storeId = :storeId
							AND po.`status` IN (
								'NEW',
								'ORDERED',
								'RECEIVING'
							)
							GROUP BY
								poi.productId
						) ETA ON LB.productId = ETA.productId
						UNION
							SELECT
								ETA.productId `id`,
								ifnull(LB.unitPrice, '') lastbuyprice,
								ifnull(ETA.eta, '') eta,
								ETA.poId poId
							FROM
								(
									SELECT DISTINCT
										rec1.productId,
										rec1.updated,
										rec1.unitPrice
									FROM
										receivingitem rec1,
										(
											SELECT
												rec2.productId,
												max(rec2.updated) `updated`
											FROM
												receivingitem rec2
											WHERE rec2.active = 1  and rec2.storeId = :storeId
											GROUP BY
												rec2.productId
										) rec3
									WHERE
										rec1.productId = rec3.productId
									AND rec1.updated = rec3.updated
								) LB
							RIGHT JOIN (
								SELECT DISTINCT
									poi.productId,
									po.id poId,
									DATE_FORMAT(max(po.eta), '%Y-%m-%d') `eta`
								FROM
									purchaseorder po,
									purchaseorderitem poi
								WHERE
									po.id = poi.purchaseOrderId and poi.active = 1 and po.active = 1 and po.storeId = poi.storeId and po.storeId = :storeId
								AND po.`status` IN (
									'NEW',
									'ORDERED',
									'RECEIVING'
								)
								GROUP BY
									poi.productId
							) ETA ON LB.productId = ETA.productId
					) LE
				WHERE `id` in (" . implode(', ', $productIds) . ")";
    	return Dao::getResultsNative($sql, array('storeId' => Core::getUser()->getStore()->getId()), PDO::FETCH_ASSOC);
    }
    /**
     * get run rate data
     * @param unknown $productIds
     */
    private function getRunRateData($productIds)
    {
    	if(count($productIds) === 0)
    		return array();
    	$_7DaysBefore = UDate::now()->modify('-7 day');
    	$_14DaysBefore = UDate::now()->modify('-14 day');
    	$_1mthBefore = UDate::now()->modify('-1 month');
    	$sql = "select ord_item.productId `id`,
	            sum(if(ord.orderDate >= '" . $_7DaysBefore . "', ord_item.qtyOrdered, 0)) `ow`,
	            sum(if(ord.orderDate >= '" . $_14DaysBefore . "', ord_item.qtyOrdered, 0)) `tw`,
	            sum(if(ord.orderDate >= '" . $_1mthBefore . "', ord_item.qtyOrdered, 0)) `om`
	            from `orderitem` ord_item
	            inner join `order` ord on (ord.type = :type and ord.active = 1 and ord.id = ord_item.orderId and ord.storeId = ord_item.storeId)
	            where ord_item.active = 1 and ord_item.storeId = :storeId and ord_item.productId in (" . implode(', ', $productIds) . ")
	            group by ord_item.productId";
		return Dao::getResultsNative($sql, array('storeId' => Core::getUser()->getStore()->getId(), 'type' => Order::TYPE_INVOICE), PDO::FETCH_ASSOC);
    }
    /**
     * update mini stock level
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     */
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
    			default: throw new Exception('Invalue Type "' . $param->CallbackParameter->type . '" Provided!');
    		}
    		$product->save();
    		$results['items'][] = $product->getJson();
    		// get product id map
    		$proIdMaps = array();
    		foreach($results['items'] as $row)
    			$proIdMaps[$row['id']] = $row + array('lastbuyprice' => '', 'eta' => '', 'ow' => 0, 'tw' => 0, 'om' => 0, 'poId' => '', 'quantity' => '');
    		$productIds = array_keys($proIdMaps);
    		// get last buy price and ETA
    		$etaLastbuys = $this->getETALastBuy($productIds);
    		foreach($etaLastbuys as $row)
    		{
    			$proIdMaps[$row['id']] = isset($proIdMaps[$row['id']])? array_merge($proIdMaps[$row['id']], $row) : $proIdMaps[$row['id']];
    		}
    		// get run rate
    		$rates = $this->getRunRateData($productIds);
    		foreach($rates as $row)
    		{
    			$proIdMaps[$row['id']] = isset($proIdMaps[$row['id']])? array_merge($proIdMaps[$row['id']], $row): $proIdMaps[$row['id']];
    		}
    		//rebuild array
    		$retMaps = array();
    		foreach($proIdMaps as $row)
    			$retMaps = $row;
    		$results['item'] = $retMaps;
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
     * update eta 
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     */
    public function updateETA($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		Dao::beginTransaction();
    		$id = isset($param->CallbackParameter->productId) ? $param->CallbackParameter->productId : '';
    		if(!($product = Product::get($id)) instanceof Product)
    			throw new Exception('Invalid product!');
    		$poId = isset($param->CallbackParameter->poId) ? trim($param->CallbackParameter->poId) : '';
    		if(!($po = PurchaseOrder::get($poId)) instanceof PurchaseOrder)
    			throw new Exception('Invalid PurchaseOrder (No:['. $poId . ']!');
    		$newETA =  isset($param->CallbackParameter->newETA) ? trim($param->CallbackParameter->newETA) : '';
    		$oldETA = isset($param->CallbackParameter->oldETA) ? trim($param->CallbackParameter->oldETA) : '';
    		
    		$msg = 'Update eta for purchaseorder(PONo=' . $po->getPurchaseOrderNo() . ')  from [' . $oldETA. '] to ['. $newETA . ']';
    		$po->setEta($newETA)
    			->addComment($msg, Comments::TYPE_NORMAL)
    			->addLog($msg, Log::TYPE_SYSTEM);
    		$po->save();
    		$results['items'][] = $product->getJson();
    		// get product id map
    		$proIdMaps = array();
    		foreach($results['items'] as $row)
    			$proIdMaps[$row['id']] = $row + array('lastbuyprice' => '', 'eta' => '', 'ow' => 0, 'tw' => 0, 'om' => 0, 'poId' => '', 'quantity' => '');
    		$productIds = array_keys($proIdMaps);
    		// get last buy price and ETA
    		$etaLastbuys = $this->getETALastBuy($productIds);
    		foreach($etaLastbuys as $row)
    		{
    			$proIdMaps[$row['id']] = isset($proIdMaps[$row['id']])? array_merge($proIdMaps[$row['id']], $row) : $proIdMaps[$row['id']];
    		}
    		// get run rate
    		$rates = $this->getRunRateData($productIds);
    		foreach($rates as $row)
    		{
    			$proIdMaps[$row['id']] = isset($proIdMaps[$row['id']])? array_merge($proIdMaps[$row['id']], $row): $proIdMaps[$row['id']];
    		}
    		//rebuild array
    		$retMaps = array();
    		foreach($proIdMaps as $row)
    			$retMaps = $row;
    		$results['item'] = $retMaps;
    		Dao::commitTransaction();
    	}
    	catch(Exception $ex)
    	{
    		Dao::rollbackTransaction();
    		$errors[] = $ex->getMessage();// . $ex->getTraceAsString();
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
    public function genReport($sender, $param)
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
    		} else {
    			$serachCriteria = $this->getSearchCriteria($serachCriteria);
    			$stats = array();
    			$objects = $this->getProducts(
    					$serachCriteria->sku
    					,$serachCriteria->name
    					,$serachCriteria->supplierIds
    					,$serachCriteria->manufacturerIds
    					,$serachCriteria->categoryIds
    					,$serachCriteria->productStatusIds
    					,$serachCriteria->active
    					,null
    					,DaoQuery::DEFAUTL_PAGE_SIZE
    					,array('pro.name' => 'asc')
    					,$stats
    					,$serachCriteria->sh_from
    					,$serachCriteria->sh_to
    					,$serachCriteria->sellOnWeb
    			);
    		}
    		$results['items'] = array();
    		foreach($objects as $obj)
    		{
    			$results['items'][] = $obj->getJson();
    		}
    	
    		// get product id map
    		$proIdMaps = array();
    		foreach($results['items'] as $row)
    			$proIdMaps[$row['id']] = $row + array('lastbuyprice' => '', 'eta' => '', 'ow' => 0, 'tw' => 0, 'om' => 0, 'poId' => '', 'quantity' => '');
    	
    		$productIds = array_keys($proIdMaps);
    		// get last buy price and ETA
    		$etaLastbuys = $this->getETALastBuy($productIds);
    		foreach($etaLastbuys as $row)
    		{
    			$proIdMaps[$row['id']] = isset($proIdMaps[$row['id']])? array_merge($proIdMaps[$row['id']], $row) : $proIdMaps[$row['id']];
    		}
    		// get run rate
    		$rates = $this->getRunRateData($productIds);
    		foreach($rates as $row)
    		{
    			$proIdMaps[$row['id']] = isset($proIdMaps[$row['id']])? array_merge($proIdMaps[$row['id']], $row): $proIdMaps[$row['id']];
    		}
    		//rebuild array
    		$retMaps = array();
    		foreach($proIdMaps as $row)
    			$retMaps[] = $row;
    		$results['items'] = $retMaps;
    		if (!($asset = $this->_getExcel($retMaps)) instanceof Asset)
    			throw new Exception('Failed to create a excel file');
    		$results['url'] = $asset->getUrl();
    	}
    	catch(Exception $ex)
    	{
    		$errors[] = $ex->getMessage() ;
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
    /**
     * create excel file
     * @return PHPExcel
     */
    private function _getExcel($data)
    {
    	$phpexcel= new PHPExcel();
    	$activeSheet = $phpexcel->setActiveSheetIndex(0);
    
    	$columnNo = 0;
    	$rowNo = 1; // excel start at 1 NOT 0
    	// header row
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'SKU');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Product Name');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Brand');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Supplier');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last Buy Price');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Mini Stock Level');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'ETA');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'StockOnHand');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'StockOnPO');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last Week');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last Fortnight');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Last 1 Month');
    	$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Quantity to be Ordered');
    	$rowNo++;
    	foreach($data as $rowNoData)
    	{
    		$columnNo = 0; // excel start at 1 NOT 0
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['sku']);
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['name']);
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, isset($rowNoData['manufacturer']) ? $rowNoData['manufacturer']['name'] : '');
    		$supplierName = array();
    		if ( isset($rowNoData['supplierCodes']))
    		{
    			foreach($rowNoData['supplierCodes'] as $supplierCode)
    			{
    				if (isset($supplierCode['supplier']))
    					$supplierName[] = $supplierCode['supplier']['name'];
    			}
    		}
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, implode(', ', $supplierName));
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['lastbuyprice']);
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['stockMinLevel']);
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['eta']);
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['stockOnHand']);
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['stockOnPO']);
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['ow']);
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['tw']);
    		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['om']);
    		//$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $rowNoData['quantity']);
    		$rowNo++;
    	}
    	// Set document properties
    	$now = UDate::now();
    	$objWriter = new PHPExcel_Writer_Excel2007($phpexcel);
    	$filePath = '/tmp/' . md5($now);
    	$objWriter->save($filePath);
    	$fileName = 'MSL_' . str_replace(':', '_', str_replace('-', '_', str_replace(' ', '_', $now->setTimeZone(SystemSettings::getSettings(SystemSettings::TYPE_SYSTEM_TIMEZONE))))) . '.xlsx';
    	$asset = Asset::registerAsset($fileName, file_get_contents($filePath), Asset::TYPE_TMP);
    	return $asset;
    }
    
}
?>
