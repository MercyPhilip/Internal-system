<?php
/**
 * Store Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class Store extends BaseEntityAbstract
{

    /**
     * The name of the store
     *
     * @var string
     */
    private $name;
    /**
     * getter name of the store
     *
     * @return String
     */
    public function getName()
    {
        return $this->name;
    }
    /**
     * Setter store name
     *
     * @param String $name The store name
     *
     * @return Store
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__toString()
     */
    public function __toString()
    {
        return $this->getName();
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'si');
        DaoMap::setStringType('name', 'varchar', 100);
        parent::__loadDaoMap();

        DaoMap::createUniqueIndex('name');
        DaoMap::commit();
    }
}

?>
