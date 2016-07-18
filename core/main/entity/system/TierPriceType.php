<?php
/**
 * Entity for TierPriceType
 *
 * @package    Core
 * @subpackage Entity
 * @author    
 */
class TierPriceType extends BaseEntityAbstract
{
	const ID_PERCENTAGE = 1;
	const ID_PRICE = 2;

	/**
	 * The name of the product
	 * 
	 * @var string
	 */
	private $name;
	/**
	 * The Description of the type
	 * 
	 * @var string
	 */
	private $description = '';
	/**
	 * Getter for name
	 *
	 * @return string
	 */
	public function getName() 
	{
	    return $this->name;
	}
	/**
	 * Setter for name
	 *
	 * @param string $value The name
	 *
	 * @return TierPriceType
	 */
	public function setName($value) 
	{
	    $this->name = $value;
	    return $this;
	}
	/**
	 * Getter for description
	 *
	 * @return 
	 */
	public function getDescription() 
	{
	    return $this->description;
	}
	/**
	 * Setter for description
	 *
	 * @param string $value The description
	 *
	 * @return TierPriceType
	 */
	public function setDescription($value) 
	{
	    $this->description = $value;
	    return $this;
	}
	/**
	 * Creating the tier price type
	 * 
	 * @param string $name        The name of the TierPriceType
	 * @param string $description The decription of the TierPriceType
	 * 
	 * @return Ambigous <Product, Ambigous, NULL, BaseEntityAbstract>
	 */
	public static function create($name, $description = '')
	{
		$class = __CLASS__;
		$obj = new $class();
		return $obj->setName(trim($name))
			->setDescription(trim($description))
			->save();
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::__toString()
	 */
	public function __toString()
	{
		return trim($this->getName());
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'tr_price_type');
		DaoMap::setStringType('name', 'varchar', 100);
		DaoMap::setStringType('description', 'varchar', 255);
		parent::__loadDaoMap();
		
		DaoMap::createUniqueIndex('name');
		DaoMap::commit();
	}

}