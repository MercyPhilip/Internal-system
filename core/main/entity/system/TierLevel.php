<?php
/**
 * TierLevel Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class TierLevel extends BaseEntityAbstract
{
	const ID_TIER0 = 0;
	const ID_GENERAL = 1;
    /**
     * The tier name
     *
     * @var string
     */
    private $name;
    /**
     * The mag ID in magento
     *
     * @var int
     */
    private $magId;
    /**
     * The tier price percentage
     *
     * @var double
     */
    private $percentage;
    /**
     * getter name
     *
     * @return String
     */
    public function getName()
    {
        return $this->name;
    }
    /**
     * Setter name
     *
     * @param String $ame The name
     *
     * @return TierLevel
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }
    /**
     * getter magId
     *
     * @return int
     */
    public function getMagId()
    {
    	return $this->magId;
    }
    /**
     * Setter magId
     *
     * @param String $value The magId
     *
     * @return TierLevel
     */
    public function setMagId($value)
    {
    	$this->magId = $value;
    	return $this;
    }
    /**
     * getter percentage
     *
     * @return double
     */
    public function getPercentage()
    {
    	return $this->percentage;
    }
    /**
     * Setter percentage
     *
     * @param double $percentage
     *
     * @return TierLevel
     */
    public function setPercentage($percentage)
    {
    	$this->percentage = $percentage;
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
        DaoMap::begin($this, 'trl');
        DaoMap::setStringType('name', 'varchar', 100);
        DaoMap::setIntType('magId','int', 10);
        DaoMap::setIntType('percentage', 'double', '5,2', true);
        parent::__loadDaoMap();

        DaoMap::createUniqueIndex('name');
        DaoMap::createUniqueIndex('magId');
        DaoMap::commit();
    }
}

?>
