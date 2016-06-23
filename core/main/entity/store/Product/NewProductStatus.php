<?php
/** NewProductStatus Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class NewProductStatus extends BaseEntityAbstract
{
	const ID_STATUS_NEW = 1;
	const ID_STATUS_COMPLETED = 2;
	const ID_STATUS_DONE = 3;
	/**
	 * The name
	 *
	 * @var name
	 */
	private $name;
	/**
	 * Getter for name
	 *
	 * @return String
	 */
	public function getName()
	{
		return $this->name;
	}
	/**
	 * Setter for name
	 *
	 * @param string $value 
	 *
	 * @return NewProductStatus
	 */
	public function setName($value)
	{
		$this->name = $value;
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'nprosts');
		DaoMap::setStringType('name', 'varchar', 50);
		parent::__loadDaoMap();

		DaoMap::createIndex('name');
		DaoMap::commit();
	}
	/**
	 * Creating a NewProductStatus object
	 *
	 * @param string $name
	 *
	 * @return NewProductStatus
	 */
	public static function create($name)
	{
		
		$obj = new NewProductStatus();
		return $obj->setName($name)
			->save();
	}

}