<?php
/**
 * This is the listing page for Sales Target
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
	public $menuItem = 'product';
	protected $_focusEntity = 'NewProduct';
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
		if(!AccessControl::canAccessCreateProductPage(Core::getRole()))
			die('You do NOT have access to this page');
	}
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		foreach (NewProductStatus::getAll() as $os)
			$statuses[] = $os->getJson();
		foreach (ProductCategory::getAll() as $os)
			$productCategoryArray[] = $os->getJson();
		
		$js = parent::_getEndJs();
		$js .= "pageJs";
		$js .= '._loadCategories('.json_encode($productCategoryArray).')';
		$js .= '._loadNewProductStatuses('.json_encode($statuses).')';
		$js .= "._loadChosen()";
		$js .= "._bindSearchKey()";
		$js .= ".setCallbackId('genReportmBtn', '" . $this->genReportmBtn->getUniqueID() . "')";
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
			$where = array();
			$params = array();
			if(!isset($param->CallbackParameter->searchCriteria) || count($serachCriteria = json_decode(json_encode($param->CallbackParameter->searchCriteria), true)) === 0)
			{
				// search all
			}
			else
			{
				//sku
				if (isset($serachCriteria['pro.sku']) && ($sku = trim($serachCriteria['pro.sku'])) != '')
				{
					$where[] = 'npro_pro.sku like :sku';
					$params['sku'] = '%' . $sku . '%';
				}
				//name
				if (isset($serachCriteria['pro.name']) && ($name = trim($serachCriteria['pro.name'])) != '')
				{
					$where[] = 'npro_pro.name like :proName';
					$params['proName'] = '%' . $name . '%';
				}
				//categories
				if(!isset($serachCriteria['pro.productCategoryIds']) || is_null($serachCriteria['pro.productCategoryIds']))
					$categoryIds = array();
				else 
					$categoryIds = $serachCriteria['pro.productCategoryIds'];
				if (count($categoryIds) > 0)
				{
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
					NewProduct::getQuery()->eagerLoad('Product.categories', 'inner join', 'pro_cate', 'npro.productId = pro_cate.productId');
					$where[] =  'pro_cate.categoryId in (' . implode(',', $keys) . ')';
					$params = array_merge($params, $ps);
				}
				//product statuses
				if(!isset($serachCriteria['pro.productStatusIds']) || is_null($serachCriteria['pro.productStatusIds']))
					$productStatusIds = array();
				else 
					$productStatusIds = $serachCriteria['pro.productStatusIds'];
				if (count($productStatusIds) > 0) {
					$ps = array();
					$keys = array();
					foreach ($productStatusIds as $index => $value) {
						$key = 'stId_' . $index;
						$keys[] = ':' . $key;
						$ps[$key] = trim($value);
					}
					$where[] = 'npro.statusId in (' . implode(',', $keys) . ')';
					$params = array_merge($params, $ps);
				}
			}
			
			
			$pageNo = 1;
			$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
			if(isset($param->CallbackParameter->pagination))
			{
				$pageNo = $param->CallbackParameter->pagination->pageNo;
				$pageSize = $param->CallbackParameter->pagination->pageSize;
			}
			$stats = array();
			NewProduct::getQuery()->eagerLoad('NewProduct.product', 'inner join', 'npro_pro', 'npro.productId = npro_pro.id and npro.active = 1  ');
			$orderby = array();
			if (count($where) > 0)
			{
				$newProducts = NewProduct::getAllByCriteria(implode(' AND ', $where), $params, true, $pageNo, $pageSize, array(), $stats);
			}
			else
			{
				$newProducts = NewProduct::getAll(true, $pageNo, $pageSize, array(), $stats);
			}
			$results['pageStats'] = $stats;
			$results['items'] = array();
			foreach($newProducts as $item)
				$results['items'][] = $item->getJson();
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
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
			$sku = trim($param->CallbackParameter->item->sku);
			$name = trim($param->CallbackParameter->item->name);
			$categoriesParam = isset($param->CallbackParameter->item->category) ? explode(',', $param->CallbackParameter->item->category) : array();
			$categories = array();
			foreach($categoriesParam as $category)
			{
				if (trim($category) != '')
					$categories[] = $category;
			}
			if (count($categories) == 0)
			{
				throw new Exception("System Error: Category cannot be empty!");
			}
			$price = trim($param->CallbackParameter->item->price);
			$status = (isset($param->CallbackParameter->item->status) && ($status = NewProductStatus::get($param->CallbackParameter->item->status)) instanceof NewProductStatus) ? $status : null;
			$stock = (isset($param->CallbackParameter->item->stock) && ($stock = ProductStatus::get($param->CallbackParameter->item->stock)) instanceof ProductStatus) ? $stock : null;
			$search = array('$', ',');
			$replace = array();
			$price = doubleval(str_replace($search, $replace, $price));
			if($item instanceof $class)
			{
				$product = $item->getProduct();
				if (!$product instanceof Product)
				{
					throw new Exception("Invalid product!");
				}
				if (!$status instanceof NewProductStatus) $status = NewProductStatus::get(NewProductStatus::ID_STATUS_NEW);
				$item->setStatus($status)->save();
				if ($status->getId() == NewProductStatus::ID_STATUS_DONE)
					$sellOnWeb = true;
				else
					$sellOnWeb = false;
				$categoryAttribute = $this->getDefaultAttribute($categories);
				if ($categoryAttribute instanceof CategoryAttribute)
				{
					$assetAccNo = $categoryAttribute->getAssetAccNo();
					$revenueAccNo = $categoryAttribute->getRevenueAccNo();
					$costAccNo = $categoryAttribute->getCostAccNo();
					$attributesetId = $categoryAttribute->getAttributesetId();
					if($assetAccNo !== null && is_string($assetAccNo))
						$product->setAssetAccNo(trim($assetAccNo));
					if($revenueAccNo !== null && is_string($revenueAccNo))
						$product->setRevenueAccNo(trim($revenueAccNo));
					if($costAccNo !== null && is_string($costAccNo))
						$product->setCostAccNo(trim($costAccNo));
					if($attributesetId !== null && is_string($attributesetId))
						$product->setAttributeSet(ProductAttributeSet::get($attributesetId));
				}
				$product->setName($name)
					->setSellOnWeb($sellOnWeb)
					->setStatus($stock)
					->save();
				$this->_updateCategories($product, $categories)
					->_setPrices($product, $price);

			}
			else
			{
				$product = Product::getBySku($sku);
				if ($product instanceof Product)
				{
					throw new Exception("The product has already existed!");
				}
				$product = new Product();
				$categoryAttribute = $this->getDefaultAttribute($categories);
				if ($categoryAttribute instanceof CategoryAttribute)
				{
					$assetAccNo = $categoryAttribute->getAssetAccNo();
					$revenueAccNo = $categoryAttribute->getRevenueAccNo();
					$costAccNo = $categoryAttribute->getCostAccNo();
					$attributesetId = $categoryAttribute->getAttributesetId();
					if($assetAccNo !== null && is_string($assetAccNo))
						$product->setAssetAccNo(trim($assetAccNo));
					if($revenueAccNo !== null && is_string($revenueAccNo))
						$product->setRevenueAccNo(trim($revenueAccNo));
					if($costAccNo !== null && is_string($costAccNo))
						$product->setCostAccNo(trim($costAccNo));
					if($attributesetId !== null && is_string($attributesetId))
						$product->setAttributeSet(ProductAttributeSet::get($attributesetId));
				}
				$product->setSku($sku)
						->setName($name)
						->setSellOnWeb(false)
						->save();
				$this->_updateCategories($product, $categories)
					->_setPrices($product, $price);
				$stores = Store::getAll();
				foreach($stores as $store)
					$status = ProductStockInfo::create($product, null, $store);
				if ($stock != null) $product->setStatus($stock);
				$item = NewProduct::create($product);
			}
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
			if($categoryId !== '')
			{
				$categoryAttribute = CategoryAttribute::getByCategoryId($categoryId);
				if ($categoryAttribute instanceof CategoryAttribute)
				{
					$result = $categoryAttribute;
					break;
				}
			}
		}
		return $result;
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
			$id = isset($param->CallbackParameter->id) ? $param->CallbackParameter->id : '';
			$item = $class::get($id);
			if($item instanceof $class)
			{
				$item->getProduct()->setActive(false)->save();
				
				$item->setActive(false)->save();
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
	/**
	 * update category
	 * @param Product $product
	 * @param unknown $param
	 * @return ListController
	 */
	private function _updateCategories(Product &$product, $categoryIds)
	{
		// delete all associated categories
		Product_Category::deleteByCriteria('productId = ?', array(trim($product->getId())));
		// create new categories
		if(isset($categoryIds) && count($categoryIds) > 0)
		{
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
	public function genReport($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$searchParams = json_decode(json_encode($param->CallbackParameter), true);
			$wheres = $joins = $params =array();
			//sku
			if (isset($searchParams['pro.sku']) && ($sku = trim($searchParams['pro.sku'])) != '')
			{
				$wheres[] = 'npro_pro.sku like :sku';
				$params['sku'] = '%' . $sku . '%';
			}
			//name
			if (isset($searchParams['pro.name']) && ($name = trim($searchParams['pro.name'])) != '')
			{
				$wheres[] = 'npro_pro.name like :proName';
				$params['proName'] = '%' . $name . '%';
			}
			if(!isset($searchParams['pro.productCategoryIds']) || is_null($searchParams['pro.productCategoryIds']))
				$categoryIds = array();
			else
				$categoryIds = $searchParams['pro.productCategoryIds'];
			if (count($categoryIds) > 0)
			{
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
				NewProduct::getQuery()->eagerLoad('Product.categories', 'inner join', 'pro_cate', 'npro.productId = pro_cate.productId');
				$wheres[] =  'pro_cate.categoryId in (' . implode(',', $keys) . ')';
				$params = array_merge($params, $ps);
			}
			//product statuses
			if(!isset($searchParams['pro.productStatusIds']) || is_null($searchParams['pro.productStatusIds']))
				$productStatusIds = array();
			else
				$productStatusIds = $searchParams['pro.productStatusIds'];
			if (count($productStatusIds) > 0) {
				$ps = array();
				$keys = array();
				foreach ($productStatusIds as $index => $value) {
					$key = 'stId_' . $index;
					$keys[] = ':' . $key;
					$ps[$key] = trim($value);
				}
				$wheres[] = 'npro.statusId in (' . implode(',', $keys) . ')';
				$params = array_merge($params, $ps);
			}
			
			$pageNo = null;
			$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;

			$stats = array();
			NewProduct::getQuery()->eagerLoad('NewProduct.product', 'inner join', 'npro_pro', 'npro.productId = npro_pro.id and npro.active = 1  ');
			$orderby = array();
			if (count($wheres) > 0)
			{
				$newProducts = NewProduct::getAllByCriteria(implode(' AND ', $wheres), $params, true, $pageNo, $pageSize, array(), $stats);
			}
			else
			{
				$newProducts = NewProduct::getAll(true, $pageNo, $pageSize, array(), $stats);
			}
			if(count($newProducts) === 0)
				throw new Exception('No result found!');
			if(count($newProducts) > 5000)
				throw new Exception('Too many rows are found, please narrow down your search criteria!');
			if (!($asset = $this->_getExcel($newProducts)) instanceof Asset)
				throw new Exception('Failed to create a excel file');
			$results['url'] = $asset->getUrl();
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * @return PHPExcel
	 */
	private function _getExcel($newProducts)
	{
		$phpexcel= new PHPExcel();
		$activeSheet = $phpexcel->setActiveSheetIndex(0);
		$columnNo = 0;
		$rowNo = 1; // excel start at 1 NOT 0
		// header row
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'sku');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'name');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'feature');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'description');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'short_description');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'price');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'category');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'stock');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'brand');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'supplier');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'weight');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'assaccno');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'revaccno');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'cstaccno');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'attributeset');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'image1');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'image2');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'image3');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'image4');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'image5');
		$rowNo++;
		// data row
		foreach($newProducts as $newProduct)
		{
			$categoryNames = array();
			$columnNo = 0; // excel start at 1 NOT 0
			$product = $newProduct->getProduct();
			if (!$product instanceof Product) continue;
			$NewProductStatus = $newProduct->getStatus();
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getSku()); //sku
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getName()); //name
			$featureId = $product->getCustomTabAssetId();
			$fullDescId = $product->getFullDescAssetId();
			$feature = Asset::getAsset($featureId);
			$feature = ($feature instanceof Asset) ? $feature->read() : '';
			$fullDescription = Asset::getAsset($fullDescId);
			$fullDescription = ($fullDescription instanceof Asset) ? $fullDescription->read() : '';
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $feature); //feature	
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $fullDescription); //description
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getShortDescription()); //short description
			$price = $product->getRRP() ? $product->getRRP()->getPrice() : 0;
				
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, StringUtilsAbstract::getCurrency(doubleval($price))); //price
			$categories = $product->getCategories();
			
			foreach($categories as $category)
			{
				if (!$category->getCategory() instanceof ProductCategory) continue;
				$categoryNames[] = $category->getCategory()->getName();
			}
			if (count($categoryNames) > 0)
				$categoryName = implode(';', $categoryNames);
			else
				$categoryName = '';
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $categoryName); //categories
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getStatus() instanceof ProductStatus ? $product->getStatus()->getName() : ''); //stock
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getManufacturer() instanceof Manufacturer ? $product->getManufacturer()->getName() : ''); //brand
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, ''); // supplier
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getWeight()); //weight
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getAssetAccNo()); //ass acc no
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getRevenueAccNo());
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getCostAccNo());
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $product->getAttributeSet() instanceof ProductAttributeSet ? $product->getAttributeSet()->getId() : '');
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, ''); //image1
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, ''); //image2
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, ''); //image3
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, ''); //image4
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, ''); //image5
			$rowNo++;
		}
		// Set document properties
		$now = UDate::now();
		$objWriter = new PHPExcel_Writer_CSV($phpexcel);
		$filePath = '/tmp/' . md5($now);
		$objWriter->save($filePath);
		$fileName = 'NewProductExport_' . str_replace(':', '_', str_replace('-', '_', str_replace(' ', '_', $now->setTimeZone(SystemSettings::getSettings(SystemSettings::TYPE_SYSTEM_TIMEZONE))))) . '.csv';
		$asset = Asset::registerAsset($fileName, file_get_contents($filePath), Asset::TYPE_TMP);
		return $asset;
	}
	
}
?>

