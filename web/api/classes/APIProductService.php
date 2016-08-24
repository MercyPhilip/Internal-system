<?php
class APIProductService extends APIServiceAbstract
{
   protected $entityName = 'Product';
   
   public function get_getAllSku($params)
   {
   	return $this->getallskus($params);
   	 
   }
   
   public function post_getAllSku($params)
   {                    
   	return $this->getallskus($params);
   	 
   }
   
   public function put_getAllSku($params)
   {
   	return $this->getallskus($params);
   	 
   }
   public function post_getStockOnHand($params)
   {
   	return $this->getall($params);
   	 
   }
   
   public function put_getStockOnHand($params)
   {
   	return $this->getall($params);
   	 
   }
   /**
    * Data feed import POST
    *
    * @param array $params
    *
    * @return array
    */
   public function post_dataFeedImport($params)
   {
       return $this->_dataFeedImport($params);
   }
   /**
    * Data feed import PUT
    *
    * @param array $params
    *
    * @return array
    */
   public function put_dataFeedImport($params)
   {
       return $this->_dataFeedImport($params);
   }
   /**
    * create/update product via datafeed.
    *
    * @param array $params
    *
    * @return array
    */
   private function _dataFeedImport($params)
   {
   	   try{
   	   	   Dao::beginTransaction();
	       $this->_runner->log('dataFeedImport: ', __CLASS__ . '::' . __FUNCTION__);
	       $sku = $this->_getPram($params, 'sku', null, true);
	       // change msku to fsku
	       $skuMap = ProductSkuMap::getMappingSku($sku);
	       if($skuMap instanceof ProductSkuMap)
	       {
	       	$fsku = $skuMap->getfSku();
	       	$this->log_product("UPDATE", "=== updating === msku=$sku, fsku= $fsku",  '', APIService::TAB);
	       	$sku = $fsku;
	       }	       
	       $name = $this->_getPram($params, 'name', null, true);
	       $shortDesc = $this->_getPram($params, 'short_description', $name);
	       $fullDesc = $this->_getPram($params, 'description', '');
	       $price = StringUtilsAbstract::getValueFromCurrency($this->_getPram($params, 'price', null, true));
	       $supplierName = $this->_getPram($params, 'supplier', null, true);
	       $supplierCode = $this->_getPram($params, 'supplier_code', null, true);
	       $supplier = $this->_getEntityByName($supplierName, 'Supplier');
	       if(!$supplier instanceof Supplier)
				throw new Exception("invalid supplier:" . $supplierName);

	       $manufacturerId = $this->_getPram($params, 'manufacturer_id', null, true);
	       $manufacturer = Manufacturer::get($manufacturerId);
	       if(!$manufacturer instanceof Manufacturer)
	       		throw new Exception("invalid Manufacturer:" . $manufacturerId);
	       $statusName = $this->_getPram($params, 'availability', null, true);
	       $status = $this->_getEntityByName($statusName, 'ProductStatus');
	       if(!$status instanceof ProductStatus)
	       	throw new Exception("invalid ProductStatus:" . $statusName);

	       $assetAccNo = $this->_getPram($params, 'assetAccNo', null);
	       $revenueAccNo = $this->_getPram($params, 'revenueAccNo', null);
	       $costAccNo = $this->_getPram($params, 'costAccNo', null);
	       $categoryIds = $this->_getPram($params, 'category_ids', array());
	       $canSupplyQty = $this->_getPram($params, 'qty', 0);
	       $weight = $this->_getPram($params, 'weight', 0);
	       $images = $this->_getPram($params, 'images', array());
	       $showOnWeb = $this->_getPram($params, 'showonweb', true);
	       $attributesetId = $this->_getPram($params, 'attributesetId', null);
	       $this->log_product("UPDATE", "=== updating === sku=$sku, supplierCode= $supplierCode, canSupplyQty=$canSupplyQty",  '', APIService::TAB);
	       
	       // check whether the product belongs to categories that are manually managed
	       // if yes then only update stock level
	       $sql = "select id from manualmanage where supplierId = ? and manufactureId = ? and active = 1";
	       $sql =  $sql . ' and categoryId in (' . implode(',', $categoryIds) . ')';
	       $rets = Dao::getResultsNative($sql, array($supplier->getId(), $manufacturerId));
	       if (count($rets) > 0)
	       {
	           $json = array();
	           $product = Product::getBySku($sku);
	           if ($product instanceof Product)
	           {
	               $existingSupplierCodes = $product->getSupplierCodes();
	               $existingSupplierQty = 0;
	               foreach ($existingSupplierCodes as $existingSupplierCode)
	               {
	                   if ($existingSupplierCode->getCode() == $supplierCode)
	                   {
	                       $existingSupplierQty = intval($existingSupplierCode->getCanSupplyQty());
	                       break;
	                   }
	               }
	               $existingStatus = $product->getStatus()->getName();
	               $newStatus = $status->getName();
	               if (trim($existingStatus) != trim($newStatus))
	               {
	                   $this->log_product("UPDATE", "=== updating manualmanage === sku=$sku, existingStatus= $existingStatus, newStatus=$newStatus",  '', APIService::TAB);
	                   $product->setStatus($status)->save();
	               }
	               
	               if ($existingSupplierQty != $canSupplyQty)
	               {
	                   $this->log_product("UPDATE", "=== updating manualmanage === sku=$sku, existingSupplierQty=$existingSupplierQty, canSupplyQty=$canSupplyQty, ",  '', APIService::TAB);
	                   $product->addSupplier($supplier, $supplierCode, $canSupplyQty);
	               }
	               $json = $product->getJson();
	               Dao::commitTransaction();
	               
	           }
	           return $json;
	       }
	       $canUpdate = false;
	       $isUpdated = false;

	       //if we have this product already, then skip
	       if (!($product = Product::getBySku($sku)) instanceof Product) {
	           $this->_runner->log('new SKU(' . $sku . ') for import, creating ...', '', APIService::TAB);
	           $product = Product::create($sku, $name, '', null, null, false, $shortDesc, $fullDesc, '', $manufacturer, $assetAccNo, $revenueAccNo, $costAccNo, null, null, true, $weight, $attributesetId);
	           $this->log_product("NEW", "=== new === sku=$sku, name=$name, shortDesc=$shortDesc, fullDesc=$fullDesc, category=" . implode(', ', $categoryIds),  '', APIService::TAB);
	           $canUpdate = true;
	       } else {
	       		//$this->log_product("UPDATE", "=== update === sku=$sku, name=$name, shortDesc=$shortDesc, fullDesc=$fullDesc, category=" . implode(', ', $categoryIds),  '', APIService::TAB);
		       	$existingAssetAccNo = $product->getAssetAccNo();
		       	$existingCostAccNo = $product->getCostAccNo();
		       	$existingRevenueAccNo = $product->getRevenueAccNo();
		       	//$existigPrice = $product->getPrices();
		       	$existigPrice = ProductPrice::getPrices($product, ProductPriceType::get(ProductPriceType::ID_RRP));
		       	if (count($existigPrice) === 0)
		       	{
		       		$existigPrice = 0;
		       	}
		       	else
		       	{
		       		$existigPrice = $existigPrice[0]->getPrice();
		       	}
		       	
		       	$existingSupplierCodes = $product->getSupplierCodes();
		       	$existingSupplierQty = 0;
		       	foreach ($existingSupplierCodes as $existingSupplierCode)
		       	{
		       		if ($existingSupplierCode->getCode() == $supplierCode)
		       		{
		       			$existingSupplierQty = intval($existingSupplierCode->getCanSupplyQty());
		       			$this->log_product("UPDATE", "=== updating === sku=$sku, supplierCode= $supplierCode, existingSupplierQty=$existingSupplierQty",  '', APIService::TAB);		       			
		       			break;
		       		}
		       	}

		       	$existingStatus = $product->getStatus()->getName();
		       	
		       	if($existingAssetAccNo === null || trim($existingAssetAccNo) === '')
		       	{
		       		if($assetAccNo !== null && is_string($assetAccNo))
		       		{
		       			$product->setAssetAccNo(trim($assetAccNo));
		       			$isUpdated = true;
		       		}
		       		$this->log_product("UPDATE", "=== updating === sku=$sku assetAccNo= $assetAccNo",  '', APIService::TAB);
		       	}
		       	if($existingCostAccNo === null || trim($existingCostAccNo) === '')
		       	{
		       		if($costAccNo !== null && is_string($costAccNo))
		       		{
		       			$product->setCostAccNo(trim($costAccNo));
		       			$isUpdated = true;
		       		}
		       		$this->log_product("UPDATE", "=== updating === sku=$sku costAccNo= $costAccNo",  '', APIService::TAB);
		       	}
		       	if($existingRevenueAccNo === null || trim($existingRevenueAccNo) === '')
		       	{
		       		if($revenueAccNo !== null && is_string($revenueAccNo))
		       		{
		       			$product->setRevenueAccNo(trim($revenueAccNo));
		       			$isUpdated = true;
		       		}
		       		$this->log_product("UPDATE", "=== updating === sku=$sku revenueAccNo= $revenueAccNo",  '', APIService::TAB);
		       	}    	 
	           //if there is no price matching rule for this product
	           if (($rulesCount = intval(ProductPriceMatchRule::countByCriteria('active = 1 and productId = ?', array($product->getId())))) === 0) {
	               $this->_runner->log('Found SKU(' . $sku . '): ', '', APIService::TAB);

	               $fullAsset = Asset::getAsset($product->getFullDescAssetId());
	               $this->_runner->log('Finding asset for full description, assetId:' . ($fullAsset instanceof Asset ? $fullAsset->getAssetId() : ''), '', APIService::TAB . APIService::TAB);
	               $fullAssetContent = '';
	               if ($fullAsset instanceof Asset) {
	               	   $fullAssetContent = file_get_contents($fullAsset->getPath());
		               $this->_runner->log('Got full asset content before html_decode: <' . $fullAssetContent . '>', '', APIService::TAB . APIService::TAB);
		               $fullAssetContent= trim(str_replace('&nbsp;', '', $fullAssetContent));
		               $this->_runner->log('Got full asset content after html_code: <' . $fullAssetContent . '>', '', APIService::TAB . APIService::TAB);
	               }
	               if ($fullAssetContent === '') {

	                   $this->_runner->log('GOT BLANK FULL DESD. Updating full description.', '', APIService::TAB . APIService::TAB . APIService::TAB);
	                   if ($fullAsset instanceof Asset) {
	                       Asset::removeAssets(array($fullAsset->getAssetId()));
			       		   $this->_runner->log('REMOVED old empty asset for full description', '', APIService::TAB . APIService::TAB . APIService::TAB);
	                   }
	                   
	                   $fullAsset = Asset::registerAsset('full_description_for_product.txt', $fullDesc, Asset::TYPE_PRODUCT_DEC);
	                   $product->setFullDescAssetId($fullAsset->getAssetId())
	                       ->save();
		       		   $this->_runner->log('Added a new full description with assetId: ' . $fullAsset->getAssetId(), '', APIService::TAB . APIService::TAB);
		       		   
				       $canUpdate = true;
				       $this->log_product("UPDATE", "=== updating === sku=$sku Found ",  '', APIService::TAB);
	               }
	               else 
	               {
	                   $this->log_product("SKIP", "=== SKIP updating === sku=$sku for full description not null, existigPrice=$existigPrice, newprice=$price, existingStatus=$existingStatus, newstatus=$status",  '', APIService::TAB);
	                   // need to update price and stock info                 
	                   if (doubleval($existigPrice) != doubleval($price))
	                   {
		                   	$product->removePrice(ProductPriceType::get(ProductPriceType::ID_RRP))
		                   	->addPrice(ProductPriceType::get(ProductPriceType::ID_RRP), $price);
		                   	$isUpdated = true;
	                   }
					  
					   if (trim($existingStatus) != trim($status))
					   {
	                   		$product->setStatus($status);
	                   		$isUpdated = true;
					   }
					   
// 					   $statusId = $status->getId();
					   if ($existingSupplierQty != $canSupplyQty)
					   {
					   		$this->log_product("SKIP", "=== updating === sku=$sku, existingSupplierQty=$existingSupplierQty, canSupplyQty=$canSupplyQty, ",  '', APIService::TAB);
					   		$product->addSupplier($supplier, $supplierCode, $canSupplyQty);
					   		//$isUpdated = true;
					   }
					   
					   if ($isUpdated === true)
					   {
					   		$this->log_product("SKIP", "=== updating === sku=$sku  ",  '', APIService::TAB);
	                   		$product->save();
					   }
	               }
	               
	           } else {
	           	  $this->_runner->log('SKIP updating. Found ProductPriceMatchRule count:' . $rulesCount, '', APIService::TAB);
	           	  $this->log_product("SKIP", "=== SKIP updating === sku=$sku Found ProductPriceMatchRule count:$rulesCount, existingStatus=$existingStatus, newstatus=$status",  '', APIService::TAB);	
	           	  // need to update stock info
	           	  if (trim($existingStatus) != trim($status))
				  {
                   		$product->setStatus($status);
                   		$isUpdated = true;
				  }
				  if ($existingSupplierQty != $canSupplyQty)
				  {
				  	$this->log_product("SKIP", "=== updating === sku=$sku, existingSupplierQty=$existingSupplierQty, canSupplyQty=$canSupplyQty, ",  '', APIService::TAB);
				  	$product->addSupplier($supplier, $supplierCode, $canSupplyQty);
				  	//$isUpdated = true;
				  }
				  if ($isUpdated === true)
				  {
				  		$this->log_product("SKIP", "=== updating pricematchrule  === sku=$sku  ",  '', APIService::TAB);
                   		$product->save();
				  }
	           }
	       }
          
	       $json = $product->getJson();

	       //only update categories and status when there is no pricematching rule or created new
	       if ($canUpdate === true) {
	       	//short description, name, manufacturer
	       	$this->_runner->log('Updating the price to: ' . StringUtilsAbstract::getCurrency($price), '', APIService::TAB . APIService::TAB);
	       	$product->setShortDescription($shortDesc)
	       		->setName($name)
	       		->setManufacturer($manufacturer)
	       		->setWeight($weight)
	       		->setSellOnWeb($showOnWeb)
				->removePrice(ProductPriceType::get(ProductPriceType::ID_RRP))
	       		->addPrice(ProductPriceType::get(ProductPriceType::ID_RRP), $price);
	       		//show on web
		       if (is_array($categoryIds) && count($categoryIds) > 0) {
		       		$this->_runner->log('Updating the categories: ' . implode(', ', $categoryIds), '', APIService::TAB . APIService::TAB);
		       		foreach ($categoryIds as $categoryId) {
		       			if (!($category = ProductCategory::get($categoryId)) instanceof ProductCategory)
		       				continue;
		       			if (count($ids = explode(ProductCategory::POSITION_SEPARATOR, trim($category->getPosition()))) > 0) {
		       				foreach (ProductCategory::getAllByCriteria('id in (' . implode(',', $ids) . ')') as $cate) {
		       					$product->addCategory($cate);
					       		$this->_runner->log('Updated Category ID: ' . $cate->getId(), '', APIService::TAB . APIService::TAB . APIService::TAB);
		       				}
		       			}
		       		}
		       }
		       //updating the images
		       if (is_array($images) && count($images) > 0) {
		           $this->_runner->log('Processing ' . count($images) . ' image(s) ...', '', APIService::TAB . APIService::TAB);
		           $exisitingImgsKeys = array();
		           $this->_runner->log('Checking exsiting images...', '', APIService::TAB . APIService::TAB . APIService::TAB);
		           $exisitingImgs = $product->getImages();
		           $this->_runner->log('Got ' . count($exisitingImgs) . ' exisiting image(s), keys: ', '', APIService::TAB . APIService::TAB . APIService::TAB . APIService::TAB);
	               foreach ($exisitingImgs as $image) {
	                   if ((($asset = Asset::getAsset($image->getImageAssetId())) instanceof Asset)) {
	                       $imgKey = md5($asset->read());
    	                   $exisitingImgsKeys[] = $imgKey;
        	               $this->_runner->log($imgKey, '', APIService::TAB . APIService::TAB . APIService::TAB . APIService::TAB . APIService::TAB);
	                   }
	               }
	               $this->_runner->log('Checking ' . count($images) . ' new image(s) ...', '', APIService::TAB . APIService::TAB);
		           foreach ($images as $image) {
		               //if haven't got any content at all
		               if (!isset($image['content'])) {
        	               $this->_runner->log('No Content, SKIP!', '', APIService::TAB . APIService::TAB . APIService::TAB);
		                   continue;
		               }
		               $newImageContent = base64_decode($image['content']);
		               $newImgKey = md5($newImageContent);
		               //if we've got the image already
		               if (in_array($newImgKey, $exisitingImgsKeys)) {
        	               $this->_runner->log('Same Image Exists[' . $newImgKey . '], SKIP!', '', APIService::TAB . APIService::TAB . APIService::TAB);
		                   continue;
		               }
		               $asset = Asset::registerAsset($image['name'], $newImageContent, Asset::TYPE_PRODUCT_IMG);
		               $this->_runner->log('Registered a new Asset [AssetID=' . $asset->getAssetId() . '].', '', APIService::TAB . APIService::TAB . APIService::TAB);
		               $product->addImage($asset);
		               $this->_runner->log('Added to product(SKU=' . $product->getSku() . ')', '', APIService::TAB . APIService::TAB . APIService::TAB);

		           }
		       }
		       $product->setStatus($status);
		       $this->_runner->log('Updated Status to: ' . $status->getName(), '', APIService::TAB . APIService::TAB);
		       $product->addSupplier($supplier, $supplierCode, $canSupplyQty);
		       $this->_runner->log('Updated Supplier(ID' . $supplier->getId() . ', name=' . $supplier->getName() . ') with code: ' . $supplierCode . 'canSupplyQty=' . $canSupplyQty, '', APIService::TAB . APIService::TAB);
		       $json = $product->save()->getJson();
		       $this->_runner->log('Saved Product ID: ' . $product->getId(), '', APIService::TAB . APIService::TAB);
	       }
	       Dao::commitTransaction();
	       return $json;
   	   } catch (Exception $e) {
   	   		Dao::rollbackTransaction();
   	   		throw $e;
   	   }
   }
   private function _getEntityByName($name, $entityName)
   {
		$entities = $entityName::getAllByCriteria('name = ?', array(trim($name)), 1, 1);
		return count($entities) > 0 ? $entities[0] : null;
   }
   /**
    * Getting All for entity
    *
    * @param unknown $params
    *
    * @throws Exception
    * @return multitype:multitype:
    */
   private function getall($params)
   {
   	$stockOnHand = 0;
  	$entityName = trim($this->entityName);

  	$searchTxt = $this->_getPram($params, 'searchTxt', 'active = 1');
  	$searchParams = $this->_getPram($params, 'searchParams', array());
  	// in .5 some skus may have already been changed
  	// so need to get original skus
  	$fsku = ProductSkuMap::getMappingSku($searchParams[0]);
  	if ($fsku instanceof ProductSkuMap) $searchParams = array($fsku->getfSku());
  	$pageNo = $this->_getPram($params, 'pageNo', 1);
  	$pageSize = $this->_getPram($params, 'pageSize', DaoQuery::DEFAUTL_PAGE_SIZE);
  	$active = $this->_getPram($params, 'active', true);
  	$orderBy = $this->_getPram($params, 'orderBy', array());
  	
  	$stats = array();
  	$items = $entityName::getAllByCriteria($searchTxt, $searchParams, $active, $pageNo, $pageSize, $orderBy, $stats);
  	$return = array();
  	foreach($items as $item)
  	    $return[] = $item->getJson();
  	$results = array('items' => $return, 'pagination' => $stats);
   	if (count($results['items'] > 0))
   	{
   		$results=$results['items'][0];
   	}
   	$stockOnHand = $results['stockOnHand'];
   	return array('stockOnHand' => $stockOnHand);
   }
   
   /**
    * output new products list
    *
    * @param string $msg
    * @param string $funcName
    * @param string $preFix
    * @param string $postFix
    *
    * @return 
    */
   private function log_product($type, $msg, $funcName='', $preFix ='', $postFix = "\n")
   {
   	$maxsize = 5 * 1024 * 1024; //Max filesize in bytes (e.q. 5MB)
   	$dir = "/tmp/";
   	if ($type === "NEW")
   	{
   		$filename = "new_productlist.log";
   	}
   	elseif ($type === "UPDATE")
   	{
   		$filename = "update_productlist.log";
   	}
   	else
   	{
   		$filename = "skip_productlist.log";
   	}
   	
   	$productfile = $dir.$filename;
   	   	
   	$log = ((trim($msg) === '') ? '' : (UDate::now() . ': ')) . $preFix . $msg . ($funcName === '' ? '' : (' [' . $funcName . '] ')) . $postFix;
   		
   	if(file_exists($productfile) &&
   		filesize($productfile) > $maxsize)
   	{
   		$nb = 1;
   		$logfiles = scandir($dir);
   		foreach ($logfiles as $file) 
   		{
   			$tmpnb = substr($file, strlen($filename) - 1);
   			if($nb < $tmpnb)
   			{
   				$nb = $tmpnb;
   			}
   		}
   		rename($dir.$filename, $dir.$filename.($nb + 1));
   	}
   		
   	if(!is_file($productfile))
   	{
   		file_put_contents($productfile, 'Init log file: ' . $productfile . '>>>>' . "\n");
   	}
    file_put_contents($productfile, $log, FILE_APPEND);	 
   		
   }
   
   /**
    * Getting All for entity
    *
    * @param unknown $params
    *
    * @throws Exception
    * @return multitype:multitype:
    */
   private function getallskus($params)
   {
   	$entityName = trim($this->entityName);
   
   	$searchTxt = $this->_getPram($params, 'searchTxt', 'active = 1');
   	$searchParams = $this->_getPram($params, 'searchParams', array());
   	$pageNo = $this->_getPram($params, 'pageNo', null);
   	$pageSize = $this->_getPram($params, 'pageSize', DaoQuery::DEFAUTL_PAGE_SIZE);
   	$active = $this->_getPram($params, 'active', true);
   	$orderBy = $this->_getPram($params, 'orderBy', array());
   
   	$stats = array();
   
   	$items = $entityName::getAllByCriteria($searchTxt, $searchParams, $active, $pageNo, $pageSize, $orderBy, $stats);
   	$return = array();
   	foreach($items as $item)
   	{
   		//$return[] = $item->getJson();
   		//$row['sku'] = $item->getSku();
   		//$row['shortDescription'] = $item->getShortDescription();
   		//$row['updated'] = $item->getUpdated()->format('Y-m-d H:i:s');
   		$return[] = array('sku' => $item->getSku(), 'shortDescription' => $item->getShortDescription(), 'updated' => $item->getUpdated()->format('Y-m-d H:i:s'));
   	}
   		
   	return array('items' => $return, 'pagination' => $stats);
   }
    
      
}