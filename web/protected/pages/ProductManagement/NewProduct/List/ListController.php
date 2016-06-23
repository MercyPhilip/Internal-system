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
			$categories = isset($param->CallbackParameter->item->category) ? explode(',', $param->CallbackParameter->item->category) : array();
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
				$product->setSku($sku)
						->setName($name)
						->setStatus($stock)
						->setSellOnWeb(false)
						->save();
				$this->_updateCategories($product, $categories)
					->_setPrices($product, $price);
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
				
				$item->setActive(false)
				->save();
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
}
?>

