<?php
/**
 * TierUser Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class TierUser extends BaseEntityAbstract
{

    /**
     * The tier level
     *
     * @var TierLevel
     */
    protected $tierLevel;
    /**
     * The useraccount of the person
     * @var UserAccount
     */
    protected $tierUser;
    /**
     * The customer info
     * @var Customer
     */
    protected $customer;
    /**
     * The percentage
     * @var double
     */
    private $percentage;
    /**
     * getter customer
     *
     * @return Customer
     */
    public function getCustomer()
    {
    	$this->loadManyToOne('customer');
    	return $this->customer;
    }
    /**
     * Setter customer
     *
     * @param  $customer The customer
     *
     * @return TierUser
     */
    public function setCustomer($customer)
    {
    	$this->customer = $customer;
    	return $this;
    }
    /**
     * getter UserAccount
     *
     * @return UserAccount
     */
    public function getTieruser()
    {
        $this->loadManyToOne('tierUser');
        return $this->tierUser;
    }
    /**
     * Setter UserAccount
     *
     * @param  $userAccount The useraccount
     *
     * @return TierUser
     */
    public function setTieruser($tierUser)
    {
        $this->tierUser = $tierUser;
        return $this;
    }
    /**
     * getter TierLevel
     *
     * @return TierLevel
     */
    public function getTierLevel()
    {
        $this->loadManyToOne('tierLevel');
        return $this->tierLevel;
    }
    /**
     * Setter tierlevel
     *
     * @param TierLevel $tierLevel The tier level
     *
     * @return TierUser
     */
    public function setTierLevel($tierLevel)
    {
        $this->tierLevel = $tierLevel;
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
     * @param  $percentage
     *
     * @return TierUser
     */
    public function setPercentage($percentage)
    {
    	$this->percentage = $percentage;
    	return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'tru');
        DaoMap::setManyToOne('tierLevel', 'TierLevel', 'trl');
        DaoMap::setManyToOne('tierUser', 'UserAccount', 'ua');
        DaoMap::setManyToOne('customer', 'Customer', 'cust');
        DaoMap::setIntType('percentage', 'double', '10,4');
        DaoMap::setManyToOne('store', 'Store', 'si');
        parent::__loadDaoMap();

        DaoMap::commit();
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntityAbstract::getJson()
     */
    public function getJson($extra = array(), $reset = false)
    {
    	$array = $extra;
    	if(!$this->isJsonLoaded($reset))
    	{
    		$array['user'] = $this->getTieruser()->getJson();
    		$array['tierLevel'] = $this->getTierLevel()->getJson();
    		$array['customer'] = $this->getCustomer()->getJson();
    	}
    	$array = parent::getJson($array, $reset);
    	return $array;
    }
}

?>
