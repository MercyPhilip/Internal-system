<?php
/**
 * This is the PriceMatchController
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class SkuMatchController extends BPCPageAbstract
{
	public $PageSize = 10;
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'skuMatch';
	const PRICE = 'price';
// 	const WHOLESALE_PRICE = 'wholesale_price';
	const SHORTDESCRIPTION = 'short_description';
	const FEATURE = 'feature';
	const LONGDESCRIPTION = 'description';
	const CATEGORY = 'category';
	const SKU = 'sku';
	const NAME = 'name';
	const STOCK = 'stock';
	const BRAND = 'brand';
	const SUPPLIER = 'supplier';
	const WEIGHT = 'weight';
/* 	const ASSETACCNO = 'assaccno';
	const REVACCNO = 'revaccno';
	const COSTACCNO = 'cstaccno'; */
	const ATTRIBUTESET = 'attributeset';
/* 	const IMAGE1 = 'image1';
	const IMAGE2 = 'image2';
	const IMAGE3 = 'image3';
	const IMAGE4 = 'image4';
	const IMAGE5 = 'image5'; */
	const IMAGE = 'image'; 
	const SRP = 'srp';
	const BUYINPRICE = 'buyinprice';
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::onLoad()
	 */
	public function onLoad($param)
	{
		parent::onLoad($param);
		if(!AccessControl::canAccessCreateProductPage(Core::getRole()))
			die(BPCPageAbstract::show404Page('Access Denied', 'You do NOT have the access to this page!'));
		if(Core::getUser()->getStore()->getId() != 1)
			die(BPCPageAbstract::show404Page('Access Denied', 'You do NOT have the access to this page!'));
	}
	/**
	 * Getting The end javascript
	 *
	 * @return string
	 */
	protected function _getEndJs()
	{
		$importDataTypes = array('update_product'=>'UPDATE PRODUCT', 'update_srp' => 'UPDATE SRP(PRICE)', 
				'update_buyinprice' => 'UPDATE PRICE BOOK', 'update_supplier_sku' => 'UPDATE SUPLLIER SKU');
		$tierLevelNames = array();
		$tierLevels = TierLevel::getAllByCriteria('id <> 1', array());
		if (count($tierLevels) > 0){
			foreach ($tierLevels as $tierLevel){
				$tierLevelNames[] = $tierLevel->getName();
			}
		}
		$js = parent::_getEndJs();
		$js .= 'pageJs';
		$js .= ".setHTMLID('importerDiv', 'importer_div')";
		$js .= ".setHTMLID('importDataTypesDropdownId', 'import_type_dropdown')";
		$js .= '.setCallbackId("getAllCodeForProduct", "' . $this->getAllCodeForProductBtn->getUniqueID() . '")';
		$js .= '._loadTierLevels('.json_encode($tierLevelNames).')';
		$js .= '.load(' . json_encode($importDataTypes) . ');';
		return $js;
	}
	/**
	 * import products
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 */
	public function getAllCodeForProduct($sender, $param)
	{
		$result = $errors = $item = array();
		try
		{
			Dao::beginTransaction();
			$data = isset($param->CallbackParameter) ? $param->CallbackParameter : null;
			if (($data == null) || !isset($data->importDataTypes) || (($type = trim($data->importDataTypes)) === '') || (($type = trim($data->importDataTypes)) === 'Select a Import Type'))
				throw new Exception('Invalid upload type passed in!');
			switch ($type)
			{
/* 				case 'new_product':
					$item = $this->importNewProduct($data, false);
					$result['path'] = $item instanceof NewProduct ? '/product/' . $item->getProduct()->getId() . '.html' : '';
					$result['item'] = $item instanceof NewProduct ? $item->getJson() : array();
					break; */
				case 'update_product':
					$tierLevels = TierLevel::getAllByCriteria('id <> 1', array());
					
					$item = $this->importNewProduct($data, $tierLevels, true);
					if ($item instanceof Product){
						$result['path'] = '/product/' . $item->getId() . '.html';
						$result['item'] = $item->getJson();
					}elseif ($item instanceof NewProduct) {
						$result['path'] = '/product/' . $item->getProduct()->getId() . '.html';
						$result['item'] = $item->getJson();
					}else{
						$result['path'] = '';
						$result['item'] = array();
					}
				/* 	$result['path'] = $item instanceof Product ? '/product/' . $item->getId() . '.html' : '';
					$result['item'] = $item instanceof Product ? $item->getJson() : array(); */
					break;
				case 'update_srp':
					$item = $this->importSRP($data);
					$result['path'] = $item instanceof Product ? '/product/' . $item->getId() . '.html' : '';
					$result['item'] = $item instanceof Product ? $item->getJson() : array();
					break;
				case 'update_buyinprice':
					$item = $this->importPriceBook($data);
					$result['path'] = $item instanceof Product ? '/product/' . $item->getId() . '.html' : '';
					$result['item'] = $item instanceof Product ? $item->getJson() : array();
					break;
				default:
					throw new Exception('Invalid upload type passed in!');
			}
			Dao::commitTransaction();
		}
		catch(Exception $ex)
		{
			Dao::rollbackTransaction();
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($result, $errors);
	}
	/**
	 * import new products
	 * @param array $rows
	 * @throws Exception
	 * @return ListController
	 */
	private function importNewProduct($row, $tierLevels, $isUpdate = false)
	{
		$row = new ArrayObject($row);
		$index = $row['index'];
		$sku = isset($row[self::SKU]) ? trim($row[self::SKU]) : '';
		if ($sku == '')
		{
			throw new Exception('Invalid sku passed in! (line ' . $index .')');
		}
		$name = isset($row[self::NAME]) ? trim($row[self::NAME]) : '';
		$price = isset($row[self::PRICE]) ? trim($row[self::PRICE]) : '';
// 		$wholesalePrice = isset($row[self::WHOLESALE_PRICE]) ? trim($row[self::WHOLESALE_PRICE]) : '';
		$stockName = isset($row[self::STOCK]) ? trim($row[self::STOCK]) : '';
		$description = isset($row[self::LONGDESCRIPTION]) ? trim($row[self::LONGDESCRIPTION]) : '';
		$feature = isset($row[self::FEATURE]) ? trim($row[self::FEATURE]) : '';
		$short_desc = isset($row[self::SHORTDESCRIPTION]) ? trim($row[self::SHORTDESCRIPTION]) : '';
		$brandName = isset($row[self::BRAND]) ? trim($row[self::BRAND]) : '';
		$supplierName = isset($row[self::SUPPLIER]) ? trim($row[self::SUPPLIER]) : '';
		$weight = isset($row[self::WEIGHT]) ? trim($row[self::WEIGHT]) : '';
/* 		$assaccNo = isset($row[self::ASSETACCNO]) ? trim($row[self::ASSETACCNO]) : '';
		$revaccNo = isset($row[self::REVACCNO]) ? trim($row[self::REVACCNO]) : '';
		$costaccNo = isset($row[self::COSTACCNO]) ? trim($row[self::COSTACCNO]) : ''; */
		$attributeset = isset($row[self::ATTRIBUTESET]) ? trim($row[self::ATTRIBUTESET]) : '';
/* 		$image1 = isset($row[self::IMAGE1]) ? trim($row[self::IMAGE1]) : '';
		$image2 = isset($row[self::IMAGE2]) ? trim($row[self::IMAGE2]) : '';
		$image3 = isset($row[self::IMAGE3]) ? trim($row[self::IMAGE3]) : '';
		$image4 = isset($row[self::IMAGE4]) ? trim($row[self::IMAGE4]) : '';
		$image5 = isset($row[self::IMAGE5]) ? trim($row[self::IMAGE5]) : '';
		$images = array($image1, $image2, $image3, $image4, $image5); */
		$categories = isset($row[self::CATEGORY]) ? trim($row[self::CATEGORY]) : '';
		if ($categories != '')
			$categories = explode(';', $categories);
		else
			$categories = array();
		$images = isset($row[self::IMAGE]) ? trim($row[self::IMAGE]) : '';
		if ($images != '')
			$images = explode(';', $images);
		else
			$images = array();
		$status = array();
		if ($stockName != '')
		{
			$stock = ProductStatus::getAllByCriteria('name = ?', array($stockName), true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array(), $status);
			if (count($stock) > 0)
			{
				$stock = $stock[0];
			}
			else
			{
				throw new Exception("[sku:" . $sku . "] invalid stock name [" . $stockName . "] ! (line:" . $index . ")");
			}
		}
		else
			$stock = null;
		if ($brandName != '')
		{
			$brand = Manufacturer::getAllByCriteria('name = ?', array($brandName), true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array(), $status);
			if (count($brand) > 0)
			{
				$brand = $brand[0];
			}
			else
			{
				throw new Exception("[sku:" . $sku . "] invalid brand name [" . $brandName . "] ! (line:" . $index . ")");
			}
		}
		else
			$brand = null;
		$categoryIds = array();
		foreach($categories as $categoryName)
		{
			$category = ProductCategory::getAllByCriteria('name = ?', array($categoryName), true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array(), $status);
			if (count($category) > 0)
			{
				$category = $category[0];
				$categoryIds[] = $category->getId();
			}
			else
			{
				throw new Exception("[sku:" . $sku . "] No such a category[" . $categoryName . "] ! (line:" . $index . ")");
			}
		}
		if ($supplierName != '')
		{
			$supplier = Supplier::getAllByCriteria('name = ?', array($supplierName), true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array(), $status);
			if (count($supplier) > 0)
			{
				$supplier = $supplier[0];
			}
			else
			{
				throw new Exception("[sku:" . $sku . "] invalid supplier [" . $supplierName . "] ! (line:" . $index . ")");
			}
		}
		else 
			$supplier = null;
		$search = array('$', ',');
		$replace = array();
		$price = doubleval(str_replace($search, $replace, $price));
		$tierPrices = array();
		if (count($tierLevels) > 0){
			foreach ($tierLevels as $tierLevel){
				if ($row[$tierLevel->getName()] != ''){
					$tierPrices[$tierLevel->getId()] = trim($row[$tierLevel->getName()]);
					$tierPrices[$tierLevel->getId()] = doubleval(str_replace($search, $replace, $tierPrices[$tierLevel->getId()]));
				}
			}
		}
		
		$product = Product::getBySku($sku);
		if ($isUpdate)
		{
			// update products
			if (!$product instanceof Product)
			{
				// new product import
				$isNewProduct = $product instanceof Product ? NewProduct::getByProductId($product->getId()) : null;
				if (($product instanceof Product) && (!$isNewProduct instanceof NewProduct))
				{
					throw new Exception("[sku:" . $sku . "] has already existed! (line:" . $index . ")");
				}
				if (($product instanceof Product) && ($isNewProduct instanceof NewProduct) && ($isNewProduct->getStatus()->getId() == NewProductStatus::ID_STATUS_DONE))
				{
					throw new Exception("[sku:" . $sku . "] staus is DONE! (line:" . $index . ")");
				}
				if (!$product instanceof Product)
				{
					if (count($categoryIds) == 0)
					{
						throw new Exception("[sku:" . $sku . "] Category cannot be empty! (line:" . $index . ")");
					}
					$product = new Product();
				}
				$product->setSku($sku)->setSellOnWeb(false)->setActive(true);
				if (trim($weight) != '')  $product->setWeight(doubleval($weight));
				$categoryAttribute = $this->getDefaultAttribute($categoryIds);
			/* 	if ((trim($assaccNo) != '') && (trim($revaccNo) != '')
						&& (trim($costaccNo) != '') && (trim($attributeset) != '')) */
				if (trim($attributeset) != '')
				{
				/* 	$product->setAssetAccNo(trim($assaccNo));
					$product->setRevenueAccNo(trim($revaccNo));
					$product->setCostAccNo(trim($costaccNo)); */
					$productAttributeSet = ProductAttributeSet::getAllByCriteria('name = ?', array(trim($attributeset)));
					if (count($productAttributeSet) > 0){
						$product->setAttributeSet($productAttributeSet[0]);
					}else{
						throw new Exception("[sku:" . $sku . "] Invalid attributeset provided! (line:" . $index . ")");
					}
					
				}
				else if ($categoryAttribute instanceof CategoryAttribute)
				{
				/* 	$assetAccNo = $categoryAttribute->getAssetAccNo();
					$revenueAccNo = $categoryAttribute->getRevenueAccNo();
					$costAccNo = $categoryAttribute->getCostAccNo(); */
					$attributesetId = $categoryAttribute->getAttributesetId();
				/* 	if($assetAccNo !== null && is_string($assetAccNo))
						$product->setAssetAccNo(trim($assetAccNo));
						if($revenueAccNo !== null && is_string($revenueAccNo))
							$product->setRevenueAccNo(trim($revenueAccNo));
							if($costAccNo !== null && is_string($costAccNo))
								$product->setCostAccNo(trim($costAccNo)); */
					if($attributesetId !== null && is_string($attributesetId))
						$product->setAttributeSet(ProductAttributeSet::get($attributesetId));
				}
				if ($name != '') $product->setName($name);
				if ($brand != null) $product->setManufacturer($brand);
				if ($description != '')
				{
					if(($fullAsset = Asset::getAsset($product->getFullDescAssetId())) instanceof Asset)
						Asset::removeAssets(array($fullAsset->getAssetId()));
						$fullAsset = Asset::registerAsset('full_description_for_product.txt', $description, Asset::TYPE_PRODUCT_DEC);
						$product->setFullDescAssetId($fullAsset->getAssetId());
				}
				if ($feature != '')
				{
					if(($fullAsset = Asset::getAsset($product->getCustomTabAssetId())) instanceof Asset)
						Asset::removeAssets(array($fullAsset->getAssetId()));
						$fullAsset = Asset::registerAsset('customtab_for_product.txt', $feature, Asset::TYPE_PRODUCT_DEC);
						$product->setCustomTabAssetId($fullAsset->getAssetId());
				}
				if ($short_desc != '') $product->setShortDescription($short_desc);
				$product->save();
				if (!$product->getStock() instanceof ProductStockInfo )
				{
					$stores = Store::getAll();
					foreach($stores as $store)
						$status = ProductStockInfo::create($product, null, $store);
				}
				if ($stock != null) $product->setStatus($stock);
				if ($supplier != null) $product->addSupplier($supplier);
				$this->_updateCategories($product, $categoryIds)->_setPrices($product, $price);
				if (count($tierPrices) > 0) $this->_setTierPrices($product, $tierPrices);
				$this->_updateImages($product, $images);
				if (!$isNewProduct instanceof NewProduct)
				{
					$isNewProduct = NewProduct::create($product);
				}
				else
				{
					$isNewProduct->setStatus(NewProductStatus::get(NewProductStatus::ID_STATUS_COMPLETED));
					$isNewProduct->setProduct($product)->save();
				}
				return $isNewProduct;
			} else {
				if ($name != '') $product->setName($name);
				if ($stock != null) $product->setStatus($stock);
				if (trim($weight) != '')  $product->setWeight(doubleval($weight));
				if ($supplier != null) $product->addSupplier($supplier);
				if ($brand != null) $product->setManufacturer($brand);
				if ($description != '')
				{
					if(($fullAsset = Asset::getAsset($product->getFullDescAssetId())) instanceof Asset)
						Asset::removeAssets(array($fullAsset->getAssetId()));
						$fullAsset = Asset::registerAsset('full_description_for_product.txt', $description, Asset::TYPE_PRODUCT_DEC);
						$product->setFullDescAssetId($fullAsset->getAssetId());
				}
				if ($feature != '')
				{
					if(($fullAsset = Asset::getAsset($product->getCustomTabAssetId())) instanceof Asset)
						Asset::removeAssets(array($fullAsset->getAssetId()));
						$fullAsset = Asset::registerAsset('customtab_for_product.txt', $feature, Asset::TYPE_PRODUCT_DEC);
						$product->setCustomTabAssetId($fullAsset->getAssetId());
				}
				// check accountNo and attributeset 
				// if null then upate
				$categoryAttribute = $this->getDefaultAttribute($categoryIds);
/* 				if ((trim($product->getAssetAccNo()) == '') 
						&& (trim($product->getRevenueAccNo()) == '')
						&& (trim($product->getCostAccNo()) == '') 
						&& ($categoryAttribute instanceof CategoryAttribute)) */
				if ($categoryAttribute instanceof CategoryAttribute)
				{
					/* $assetAccNo = $categoryAttribute->getAssetAccNo();
					$revenueAccNo = $categoryAttribute->getRevenueAccNo();
					$costAccNo = $categoryAttribute->getCostAccNo(); */
					$attributesetId = $categoryAttribute->getAttributesetId();
				/* 	if($assetAccNo !== null && is_string($assetAccNo))
						$product->setAssetAccNo(trim($assetAccNo));
					if($revenueAccNo !== null && is_string($revenueAccNo))
						$product->setRevenueAccNo(trim($revenueAccNo));
					if($costAccNo !== null && is_string($costAccNo))
						$product->setCostAccNo(trim($costAccNo)); */
				}
				if ((!$product->getAttributeSet() instanceof ProductAttributeSet)
						&& ($categoryAttribute instanceof CategoryAttribute))
				{
					$attributesetId = $categoryAttribute->getAttributesetId();
					if($attributesetId !== null && is_string($attributesetId))
						$product->setAttributeSet(ProductAttributeSet::get($attributesetId));
				}
				if ($short_desc != '') $product->setShortDescription($short_desc);
				$product->save();
				$this->_updateCategories($product, $categoryIds)
					->_setPrices($product, $price);
				if (count($tierPrices) > 0) $this->_setTierPrices($product, $tierPrices);
				$this->_updateImages($product, $images);
				
				return $product;
			}
		}
	}
	/**
	 * update category
	 * @param Product $product
	 * @param unknown $param
	 * @return ListController
	 */
	private function _updateCategories(Product &$product, $categoryIds)
	{
		// create new categories
		if(isset($categoryIds) && count($categoryIds) > 0)
		{
			// delete all associated categories
			Product_Category::deleteByCriteria('productId = ?', array(trim($product->getId())));
			foreach($categoryIds as $categoryId)
			{
				if(!($category = ProductCategory::get($categoryId)))
					continue;
				Product_Category::create($product, $category);
			}
		}
		return $this;
	}
	/**
	 * update price
	 * @param Product $product
	 * @param unknown $param
	 * @throws Exception
	 * @return ListController
	 */
	private function _setPrices(Product &$product, $newPrice)
	{		
		$priceType = ProductPriceType::ID_RRP;
		$prices = ProductPrice::getAllByCriteria('productId = ? and typeId = ?', array($product->getId(), $priceType), true, 1, 1);
		if(count($prices) > 0) {
			$msg = 'Update price for product(SKU=' . $product->getSku() . ') to '. StringUtilsAbstract::getCurrency($newPrice);
			$price = $prices[0];
			if ($newPrice <= doubleval(0)) return $this;
		} else {
			if ($newPrice <= doubleval(0)) throw new Exception('Invalid price passed in! (sku: ' . $product->getSku() .')');
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
		return $this;
	}
	/**
	 * update price
	 * @param Product $product
	 * @param unknown $param
	 * @throws Exception
	 * @return ListController
	 */
	private function _setTierPrices(Product &$product, $prices)
	{	
		$tierRules = TierRule::getAllByCriteria('productId = ?', array($product->getId()));
		if (count($tierRules) > 0){
			
			$tierRule = $tierRules[0];
			$tierPrices = TierPrice::getTierPrices($tierRule);
			$productTierPrices = ProductTierPrice::getAllByCriteria('productId = ?', array($product->getId()));
			foreach ($prices as $key => $price){
				foreach ($tierPrices as $tierPrice){
					if ($tierPrice->getTierLevel()->getId() == $key){
						break;
					}else{
						$tierPrice = new TierPrice();
					}
				}
				$tierPrice->setTierRule($tierRule)
				->setTierLevel(TierLevel::get($key))
				->setQuantity(1)
				->setTierPriceType(TierPriceType::get(2))
				->setValue($price)
				->save();
				
				foreach ($productTierPrices as $productTierPrice){
					if ($productTierPrice->getTierLevel()->getId() == $key){
						break;
					}else{
						$productTierPrice = new ProductTierPrice();

					}
				}
				
				$productTierPrice->setProduct($product)
				->setTierLevel(TierLevel::get($key))
				->setQuantity(1)
				->setTierPriceType(TierPriceType::get(2))
				->setValue($price)
				->setPriorityId(ProductTierPrice::PRIORITY_ID_PID)
				->setTierRule($tierRule)
				->save();
				
				$msg = 'Update ' . TierLevel::get($key)->getName() . ' price for product(SKU=' . $product->getSku() . ') to '. StringUtilsAbstract::getCurrency($price);
				$product->addComment($msg, Log::TYPE_SYSTEM)
				->addLog($msg, Log::TYPE_SYSTEM);
			}
			
		} else {
			$tierRule = new TierRule();
			$tierRule->setProduct($product)->setPriorityId(TierRule::PRIORITY_ID_PID)->save();
			foreach ($prices as $key => $price){
				
				$tierPrice = new TierPrice();
				$productTierPrice = new ProductTierPrice();
				
				$tierPrice->setTierRule($tierRule)
				->setTierLevel(TierLevel::get($key))
				->setQuantity(1)
				->setTierPriceType(TierPriceType::get(2))
				->setValue($price)
				->save();
				
				$productTierPrice->setProduct($product)
				->setTierLevel(TierLevel::get($key))
				->setQuantity(1)
				->setTierPriceType(TierPriceType::get(2))
				->setValue($price)
				->setPriorityId(ProductTierPrice::PRIORITY_ID_PID)
				->setTierRule($tierRule)
				->save();
				
				$msg = 'New ' . TierLevel::get($key)->getName() . ' Price Created for product(SKU=' . $product->getSku() . '): '. StringUtilsAbstract::getCurrency($price);
				$product->addComment($msg, Log::TYPE_SYSTEM)
				->addLog($msg, Log::TYPE_SYSTEM);
			}
		}
		return $this;
	}
	/**
	 * add images to product
	 * @param Product $product
	 * @param unknown $images
	 */
	private function _updateImages(Product &$product, $images)
	{
		$imageDatas = array();
		foreach ($images as $iamge_url)
		{
			if (trim($iamge_url) === '')
			{
				continue;
			}
			/*
			 * To filter some unacceptable image types
			 */
			$filename = trim(basename($iamge_url));
			$file_parts = pathinfo($filename);
			$filename = isset($file_parts['basename'])? trim($file_parts['basename']) : "" ;
			$extension = isset($file_parts['extension'])? trim($file_parts['extension']) : "" ;
			if (($filename === '') || ($extension === '') || (($extension !== "") && !in_array(strtolower($extension), array('jpg', 'png'))))
			{
				continue;
			}
			$imgData = ComScriptCURL::readUrl($iamge_url);
			if ($imgData === false)
			{
				continue;
			}
			$imageDatas[] = array(
				'name' => $filename,
				'content' => $imgData
			);
		}
		
		if (is_array($imageDatas) && count($imageDatas) > 0) {
			$exisitingImgsKeys = array();
			$exisitingImgs = $product->getImages();
			foreach ($exisitingImgs as $image) {
				if ((($asset = Asset::getAsset($image->getImageAssetId())) instanceof Asset)) {
					$imgKey = md5($asset->read());
					$exisitingImgsKeys[] = $imgKey;
				}
			}
			foreach ($imageDatas as $image) {
				//if haven't got any content at all
				if (!isset($image['content'])) {
					continue;
				}
				$newImageContent = $image['content'];
				$newImgKey = md5($newImageContent);
				//if we've got the image already
				if (in_array($newImgKey, $exisitingImgsKeys)) {
					continue;
				}
				$asset = Asset::registerAsset($image['name'], $newImageContent, Asset::TYPE_PRODUCT_IMG);
				$product->addImage($asset);
			}
		}
		return $this;
	}
	/**
	 * get asset/revenue/cost account no and attributest by category id
	 *
	 * @param array category ids
	 * @return array CategoryAttribute
	 */
	private function getDefaultAttribute($categoryIds)
	{
		if (!is_array($categoryIds))
			throw new Exception('must passin category ids as an array');
		$result = null;
		foreach ($categoryIds as $categoryId)
		{
			$categoryId = trim($categoryId);
			if($categoryId !== '' && $categoryId != 1)
			{
				$categoryAttribute = CategoryAttribute::getByCategoryId($categoryId);
				if ($categoryAttribute instanceof CategoryAttribute && $categoryAttribute->getAttributesetId() !== null)
				{
					$result = $categoryAttribute;
					break;
				}
			}
		}
		if ($result === null){
			$result = CategoryAttribute::getByCategoryId(1);
		}
		return $result;
	}
	/**
	 * import new products
	 * @param array $rows
	 * @throws Exception
	 * @return ListController
	 */
	private function importSRP($row)
	{
		$row = new ArrayObject($row);
		$index = $row['index'];
		$sku = isset($row[self::SKU]) ? trim($row[self::SKU]) : '';
		if ($sku == '')
		{
			throw new Exception('Invalid sku passed in! (line ' . $index .')');
		}
		$srp = isset($row[self::SRP]) ? trim($row[self::SRP]) : '';
		$search = array('$', ',');
		$replace = array();
		$price = doubleval(str_replace($search, $replace, $srp));
		if ($price <= doubleval(0))
		{
			throw new Exception('Invalid SRP passed in! (line ' . $index .')');
		}
		$product = Product::getBySku($sku);
		if (!$product instanceof Product)
		{
			// no such a product
			throw new Exception('No such a product (line ' . $index .')');
		}
		// get SRP 
		$prices = ProductPrice::getPrices($product, ProductPriceType::get(ProductPriceType::ID_SRP));
		if (count($prices) > 0)
		{
			$product->removePrice(ProductPriceType::get(ProductPriceType::ID_SRP))
				->addPrice(ProductPriceType::get(ProductPriceType::ID_SRP), $price);
		}
		else
		{
			// new srp
			$product->addPrice(ProductPriceType::get(ProductPriceType::ID_SRP), $price);
		}
		return $product;
	}
	/**
	 * import buyin price for products
	 * @param array $rows
	 * @throws Exception
	 * @return ListController
	 */
	private function importPriceBook($row)
	{
		$row = new ArrayObject($row);
		$index = $row['index'];
		$sku = isset($row[self::SKU]) ? trim($row[self::SKU]) : '';
		if ($sku == '')
		{
			throw new Exception('Invalid sku passed in! (line ' . $index .')');
		}
		$buyinPrice = isset($row[self::BUYINPRICE]) ? trim($row[self::BUYINPRICE]) : '';
		$search = array('$', ',');
		$replace = array();
		$price = doubleval(str_replace($search, $replace, $buyinPrice));
		if ($price <= doubleval(0))
		{
			throw new Exception('Invalid BUYINPRICE passed in! (line ' . $index .')');
		}
		$product = Product::getBySku($sku);
		if (!$product instanceof Product)
		{
			// no such a product
			throw new Exception('No such a product (line ' . $index .')');
		}
		// get ProductBuyinPrice
		$buyinPriceObj = ProductBuyinPrice::getBuyinPriceObj($product->getId());
		if ($buyinPriceObj instanceof ProductBuyinPrice)
		{
			// update
			$buyinPriceObj->setPrice($price)->save();
		}
		else
		{
			// new
			$buyinPriceObj = new ProductBuyinPrice();
			$buyinPriceObj->setProduct($product)
				->setPrice($price)->save();
		}
		return $product;
	}
}
?>