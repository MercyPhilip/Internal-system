
<?php
/**
 * Entity for CategoryAttribute
*
* @package    Core
* @subpackage Entity
* @author     larry
*/
class CategoryAttribute extends BaseEntityAbstract
{
	
	/**
	 * The category name
	 *
	 * @var string
	 */
	private $categoryName;
	
	/**
	 * The category id
	 * @var int
	 */
	private $categoryId;
	/**
	 * asset account no
	 * @var int
	 */
	private $assetAccNo;
	/**
	 * revenue account no
	 * @var int
	 */
	private $revenueAccNo;	
	/**
	 * cost account no
	 * @var int
	 */
	private $costAccNo;
	/**
	 * The attributeset id
	 * @var int
	 */
	private $attributesetId;
		
	/**
	 * getter for category name
	 *
	 * @return string
	 */
	public function getCategoryName()
	{
		return $this->categoryName;
	}
	/**
	 * Setter for category name
	 *
	 * @return MappingRule
	 */
	public function setCategoryName($categoryName)
	{
		$this->categoryName = $categoryName;
		return $this;
	}
	
	public function getCategoryId()
	{
		return $this->categoryId;
	}
	public function setCategoryId($categoryId)
	{
		$this->categoryId = $categoryId;
		return $this;
	}
	/**
	 * Getter for assetAccNo
	 * @return number
	 */
	public function getAssetAccNo()
	{
		return $this->assetAccNo;
	}
	/**
	 * Setter for assetAccNo
	 * @param number assetAccNo
	 * @return MappingRule
	 */
	public function setAssetAccNo($assetAccNo)
	{
		$this->assetAccNo = $assetAccNo;
		return $this;
	}
	/**
	 * Getter for revenueAccNo
	 * @return number
	 */
	public function getRevenueAccNo()
	{
		return $this->revenueAccNo;
	}
	/**
	 * Setter for revenueAccNo
	 * @param number revenueAccNo
	 * @return MappingRule
	 */
	public function setRevenueAccNo($revenueAccNo)
	{
		$this->revenueAccNo = $revenueAccNo;
		return $this;
	}
	/**
	 * Getter for costAccNo
	 * @return number
	 */
	public function getCostAccNo()
	{
		return $this->costAccNo;
	}
	/**
	 * Setter for costAccNo
	 * @param number costAccNo
	 * @return MappingRule
	 */
	public function setCostAccNo($costAccNo)
	{
		$this->costAccNo = $costAccNo;
		return $this;
	}
	
	/**
	 * Getter for attributesetId
	 * @return number
	 */
	public function getAttributesetId()
	{
		return $this->attributesetId;
	}
	/**
	 * Setter for attributesetId
	 * @param number attributesetId
	 * @return MappingRule
	 */
	public function setAttributesetId($attributesetId)
	{
		$this->attributesetId = $attributesetId;
		return $this;
	}
		
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'catattr');

		DaoMap::setintType('categoryId', 'int', '10');
		DaoMap::setStringType('categoryName', 'varchar', 255);
		DaoMap::setintType('assetAccNo', 'int', '10');
		DaoMap::setintType('revenueAccNo', 'int', '10');
		DaoMap::setintType('costAccNo', 'int', '10');
		DaoMap::setIntType('attributesetId', 'int', '10', true);
		
		parent::__loadDaoMap();
		
		DaoMap::createIndex('categoryId');
		DaoMap::createIndex('categoryName');
		DaoMap::createIndex('assetAccNo');
		DaoMap::createIndex('revenueAccNo');
		DaoMap::createIndex('costAccNo');
		DaoMap::createIndex('attributesetId');
		
		DaoMap::commit();
	}
	/**
	 * get mapping rule by category ids
	 * 
	 * @param string $categoryIds
	 * @param bool $activeOnly
	 * @return MappingRule|NULL
	 */
	public static function getByCategoryId($categoryId, $activeOnly = true)
	{
		/*
		 * when multiple records exist, 
		 * choose the first one
		 * 
		 */
		$categoryId = trim($categoryId);
		$objects = self::getAllByCriteria('categoryId = ? ', array($categoryId), (intval($activeOnly) === 1), 1, 1, array('updated' => 'desc'));
		return ( count($objects) > 0 ? $objects[0] : null );
	}

}