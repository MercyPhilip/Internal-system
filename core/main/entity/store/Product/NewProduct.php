<?php
/** SalesTarget Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class NewProduct extends BaseEntityAbstract
{
	/**
	 * The product
	 *
	 * @var Product
	 */
	protected $product;
	/**
	 * The status
	 *
	 * @var NewProductStatus
	 */
	protected $status;
	/**
	 * Getter for product
	 *
	 * @return
	 */
	public function getProduct()
	{
		$this->loadManyToOne('product');
		return $this->product;
	}
	/**
	 * Setter for product
	 *
	 * @param Product $value The product
	 *
	 * @return NewProduct
	 */
	public function setProduct(Product $value)
	{
		$this->product = $value;
		return $this;
	}
	/**
	 * Getter for status
	 *
	 * @return
	 */
	public function getStatus()
	{
		$this->loadManyToOne('status');
		return $this->status;
	}
	/**
	 * Setter for status
	 *
	 * @param NewProductStatus $value The status
	 *
	 * @return NewProduct
	 */
	public function setStatus(NewProductStatus $value)
	{
		$this->status = $value;
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::getJson()
	 */
	public function getJson($extra = array(), $reset = false)
	{
		try {
			$array = $extra;
			if(!$this->isJsonLoaded($reset))
			{
				$array['product'] = $this->getProduct() instanceof Product ? $this->getProduct()->getJson() : null;
				$array['status'] = $this->getStatus() instanceof NewProductStatus ? $this->getStatus()->getJson() : null;
			}
		}
		catch (Exception $ex)
		{
			throw new Exception(' ********** getJson exception :' .   $ex->getMessage());
		}
		return parent::getJson($array, $reset);
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'npro');
		DaoMap::setManyToOne('product', 'Product', 'npro_pro');
		DaoMap::setManyToOne('status', 'NewProductStatus', 'npro_prosts');
		parent::__loadDaoMap();

		DaoMap::createIndex('product');
		DaoMap::createIndex('status');

		DaoMap::commit();
	}
	/**
	 * Creating a salestarget object
	 *
	 * @param Product $product
	 *
	 * @return NewProduct
	 */
	public static function create($product)
	{
		if (!$product instanceof Product) return null;
		
		$obj = new NewProduct();
		return $obj->setProduct($product)
			->setStatus(NewProductStatus::get(NewProductStatus::ID_STATUS_NEW))
			->save();
	}
	/**
	 * Getting the product via productId
	 *
	 * @param string $productId The id of the product
	 *
	 * @return null|NewProduct
	 */
	public static function getByProductId($productId)
	{
		$products = self::getAllByCriteria('productId = ? ', array(trim($productId)), false, 1, 1);
		return (count($products) === 0 ? null : $products[0]);
	}
	/**
	 * Creating a salestarget object
	 *
	 * @param Product $product
	 *
	 * @return NewProduct
	 */
	public static function UpdateStatus($product, $statusId = NewProductStatus::ID_STATUS_COMPLETED)
	{
		if (!$product instanceof Product) return null;
		$stats = array();
		NewProduct::getQuery()->eagerLoad('NewProduct.product', 'inner join', 'npro_pro', 'npro.productId = pro.id ');
		$where = 'npro.productId = ?';
		$params = array($product->getId());
		$newProducts = NewProduct::getAllByCriteria($where, $params, null, DaoQuery::DEFAUTL_PAGE_SIZE, array(), $stats);
		if (count($newProducts) > 0)
		{
			$obj = $newProducts[0];
			return $obj->setStatus(NewProductStatus::get($statusId))
				->save();
		}
		return null;
	}
}