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
	const SHORTDESCRIPTION = 'short_description';
	const LONGDESCRIPTION = 'description';
	const CATEGORY = 'category';
	const SKU = 'sku';
	const NAME = 'name';
	const STOCK = 'stock';
	const BRAND = 'brand';
	const IMAGE1 = 'image1';
	const IMAGE2 = 'image2';
	const IMAGE3 = 'image3';
	const IMAGE4 = 'image4';
	const IMAGE5 = 'image5';
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::onLoad()
	 */
	public function onLoad($param)
	{
		parent::onLoad($param);
		if(!AccessControl::canAccessCreateProductPage(Core::getRole()))
			die(BPCPageAbstract::show404Page('Access Denied', 'You do NOT have the access to this page!'));
	}
	/**
	 * Getting The end javascript
	 *
	 * @return string
	 */
	protected function _getEndJs()
	{
		$importDataTypes = array('new_product'=> 'NEW PRODUCT');

		$js = parent::_getEndJs();
		$js .= 'pageJs';
		$js .= ".setHTMLID('importerDiv', 'importer_div')";
		$js .= ".setHTMLID('importDataTypesDropdownId', 'import_type_dropdown')";
		$js .= '.setCallbackId("getAllCodeForProduct", "' . $this->getAllCodeForProductBtn->getUniqueID() . '")';
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
				case 'new_product':
					$item = $this->importNewProduct($data);
					$result['path'] = $item instanceof NewProduct ? '/product/' . $item->getProduct()->getId() . '.html' : '';
					$result['item'] = $item instanceof NewProduct ? $item->getJson() : array();
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
	private function importNewProduct($row)
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
		$stock = isset($row[self::STOCK]) ? trim($row[self::STOCK]) : '';
		$description = isset($row[self::LONGDESCRIPTION]) ? trim($row[self::LONGDESCRIPTION]) : '';
		if ($description != '')
		{
			$description = preg_replace('/""/', '"', $description);
			$description = substr(substr($description, 1), 0, -1);
		}
		$short_desc = isset($row[self::SHORTDESCRIPTION]) ? trim($row[self::SHORTDESCRIPTION]) : '';
		$brand = isset($row[self::BRAND]) ? trim($row[self::BRAND]) : '';
		$image1 = isset($row[self::IMAGE1]) ? trim($row[self::IMAGE1]) : '';
		$image2 = isset($row[self::IMAGE2]) ? trim($row[self::IMAGE2]) : '';
		$image3 = isset($row[self::IMAGE3]) ? trim($row[self::IMAGE3]) : '';
		$image4 = isset($row[self::IMAGE4]) ? trim($row[self::IMAGE4]) : '';
		$image5 = isset($row[self::IMAGE5]) ? trim($row[self::IMAGE5]) : '';
		$images = array($image1, $image2, $image3, $image4, $image5);
		$categories = isset($row[self::CATEGORY]) ? trim($row[self::CATEGORY]) : '';
		if ($categories != '')
			$categories = explode(';', $categories);
		else
			$categories = array();
		$status = array();
		$stock = ProductStatus::getAllByCriteria('name = ?', array($stock), true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array(), $status);
		if (count($stock) > 0)
		{
			$stock = $stock[0];
		}
		else
		{
			$stock = null;
		}
		$categoryIds = array();
		foreach($categories as $category)
		{
			$category = ProductCategory::getAllByCriteria('name = ?', array($category), true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array(), $status);
			if (count($category) > 0)
			{
				$category = $category[0];
				$categoryIds[] = $category->getId();
			}
		}		
		$search = array('$', ',');
		$replace = array();
		$price = doubleval(str_replace($search, $replace, $price));
		$product = Product::getBySku($sku);
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
			$product = new Product();
		}
		
		$product->setSku($sku)->setSellOnWeb(false);
		if ($name != '') $product->setName($name);
		if ($stock != null) $product->setStatus($stock); 
		if ($description != '') 
		{
			if(($fullAsset = Asset::getAsset($product->getFullDescAssetId())) instanceof Asset)
				Asset::removeAssets(array($fullAsset->getAssetId()));
			$fullAsset = Asset::registerAsset('full_description_for_product.txt', $description, Asset::TYPE_PRODUCT_DEC);
			$product->setFullDescAssetId($fullAsset->getAssetId());
		}

		if ($short_desc != '') $product->setShortDescription($short_desc);
		$product->save();
		$this->_updateCategories($product, $categoryIds)
			->_setPrices($product, $price);
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
			//$imageDatas = new ArrayObject($imageDatas);
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
}
?>