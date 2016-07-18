<?php
/**
 * Entity for Customer
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class Customer extends BaseEntityAbstract
{
	/**
	 * The name of this customer
	 *
	 * @var string
	 */
	private $name;
	/**
	 * The description of this customer
	 *
	 * @var string
	 */
	private $description = '';
	/**
	 * The contact  of this customer
	 *
	 * @var string
	 */
	private $contactNo;
	/**
	 * The email of this customer
	 *
	 * @var string
	 */
	private $email;
	/**
	 * The terms of this customer
	 *
	 * @var int
	 */
	private $terms;
	/**
	 * The billing of this customer
	 *
	 * @var Address
	 */
	protected $billingAddress = null;
	/**
	 * The shipping of this customer
	 *
	 * @var Address
	 */
	protected $shippingAddress = null;
	/**
	 * The id of the customer in magento
	 *
	 * @var int
	 */
	private $mageId = 0;
	/**
	 * Whether this order is imported from B2B
	 *
	 * @var bool
	 */
	private $isFromB2B = false;
	/**
	 * The credit of the customer has
	 * 
	 * @var CreditPool
	 */
	private $creditPool = null;
	/**
	 * Whether this customer is blocked
	 *
	 * @var bool
	 */
	private $isBlocked = false;
	/**
	 *  The tier level of the customer
	 * @var unknown
	 */
	protected $tier = null;
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
	 * @return Customer
	 */
	public function setName($value)
	{
	    $this->name = $value;
	    return $this;
	}
	/**
	 * Getter for description
	 *
	 * @return string
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
	 * @return Customer
	 */
	public function setDescription($value)
	{
	    $this->description = $value;
	    return $this;
	}
	/**
	 * Getter for contactNo
	 *
	 * @return
	 */
	public function getContactNo()
	{
	    return $this->contactNo;
	}
	/**
	 * Setter for contactNo
	 *
	 * @param string $value The contactNo
	 *
	 * @return Customer
	 */
	public function setContactNo($value)
	{
	    $this->contactNo = $value;
	    return $this;
	}
	/**
	 * Getter for email
	 *
	 * @return string
	 */
	public function getEmail()
	{
	    return $this->email;
	}
	/**
	 * Setter for email
	 *
	 * @param string $value The email
	 *
	 * @return Customer
	 */
	public function setEmail($value)
	{
	    $this->email = $value;
	    return $this;
	}
	/**
	 * Getter for terms
	 *
	 * @return int
	 */
	public function getTerms()
	{
		return $this->terms;
	}
	/**
	 * Setter for terms
	 *
	 * @param string $value The terms
	 *
	 * @return Customer
	 */
	public function setTerms($value)
	{
		$this->terms = $value;
		return $this;
	}
	/**
	 * Getter for billingAddress
	 *
	 * @return Address
	 */
	public function getBillingAddress()
	{
		$this->loadManyToOne('billingAddress');
	    return $this->billingAddress;
	}
	/**
	 * Setter for billingAddress
	 *
	 * @param Address $value The addresses
	 *
	 * @return Customer
	 */
	public function setBillingAddress(Address $value = null)
	{
	    $this->billingAddress = $value;
	    return $this;
	}
	/**
	 * Getter for shippingAddress
	 *
	 * @return
	 */
	public function getShippingAddress()
	{
		$this->loadManyToOne('shippingAddress');
	    return $this->shippingAddress;
	}
	/**
	 * Setter for shippingAddress
	 *
	 * @param Address $value The shippingAddress
	 *
	 * @return Customer
	 */
	public function setShippingAddress(Address $value = null)
	{
	    $this->shippingAddress = $value;
	    return $this;
	}
	/**
	 * Getter for isFromB2B
	 *
	 * @return bool
	 */
	public function getIsFromB2B()
	{
		return (trim($this->isFromB2B) === '1');
	}
	/**
	 * Setter for isFromB2B
	 *
	 * @param unkown $value The isFromB2B
	 *
	 * @return Order
	 */
	public function setIsFromB2B($value)
	{
		$this->isFromB2B = $value;
		return $this;
	}
	/**
	 * Getter for isBlocked
	 *
	 * @return bool
	 */
	public function getIsBlocked()
	{
		return (trim($this->isBlocked) === '1');
	}
	/**
	 * Setter for isBlocked
	 *
	 * @param unkown $value The isBlocked
	 *
	 * @return Customer
	 */
	public function setIsBlocked($value)
	{
		$this->isBlocked = $value;
		return $this;
	}
	/**
	 * Getter for mageId
	 *
	 * @return
	 */
	public function getMageId()
	{
	    return $this->mageId;
	}
	/**
	 * Setter for mageId
	 *
	 * @param int $value The mageId
	 *
	 * @return Customer
	 */
	public function setMageId($value)
	{
	    $this->mageId = $value;
	    return $this;
	}
	/**
	 * Getter for tier
	 *
	 * @return TierLevel
	 */
	public function getTier()
	{
		$this->loadManyToOne('tier');
		return $this->tier;
	}
	/**
	 * Setter for tier
	 *
	 * @param TierLevel $value The tier
	 *
	 * @return Customer
	 */
	public function setTier(TierLevel $value = null)
	{
		$this->tier = $value;
		return $this;
	}
	/**
	 * Creating a instance of this
	 *
	 * @param string  $name
	 * @param string  $contactNo
	 * @param string  $email
	 * @param Address $billingAddr
	 * @param bool    $isFromB2B    Whether this is imported via B2B
	 * @param string  $description  The description of this customer
	 * @param Address $shippingAddr The shiping address
	 * @param int     $mageId       The id of the customer in Magento
	 * @param bool    $isBlocked    Whether the customer is blocked due to expiration of the terms
	 *                              If the customer is blocked then no orders from this customer can be changed to invoice any more
	 *                              unless the administrator unblocks it.
	 *                              Only administrator and accountant can block and unblock customer.
	 *
	 * @return Ambigous <GenericDAO, BaseEntityAbstract>
	 */
	public static function create($name, $contactNo, $email, Address $billingAddr = null, $isFromB2B = false, $description = '', Address $shippingAddr = null, $mageId = 0, $terms = 0, $isBlocked = false, $tierId = TierLevel::ID_GENERAL)
	{
		$name = trim($name);
		$contactNo = trim($contactNo);
		$email = trim($email);
		$isFromB2B = ($isFromB2B === true);
		$terms = intval(trim($terms));
		$isBlocked = ($isBlocked === true);
		$class =__CLASS__;
		$objects = self::getAllByCriteria('email = ?', array($email), true, 1, 1);
		if(count($objects) > 0 && $email !== '')
		{
			$obj = $objects[0];
			$terms = $obj->getTerms();
			$mageId = $obj->getMageId();
		}
		else
		{
			$obj = new $class();
			$obj->setIsFromB2B($isFromB2B);
		}
		$tier = TierLevel::get($tierId);
		if (!$tier instanceof TierLevel)
			$tier = TierLevel::get(TierLevel::ID_GENERAL);
		$obj->setName($name)
			->setDescription(trim($description))
			->setContactNo($contactNo)
			->setEmail($email)
			->setBillingAddress($billingAddr)
			->setShippingAddress($shippingAddr)
			->setMageId($mageId)
			->setTerms($terms)
			->setTier($tier)
			->setIsBlocked($isBlocked)
			->save();
		$comments = 'Customer(ID=' . $obj->getId() . ')' . (count($objects) > 0 ? 'updated' : 'created') . ' via B2B with (name=' . $name . ', contactNo=' . $contactNo . ', email=' . $email . ', terms=' . $terms . ', tierLevel=' . $tier->getId().  ', isBlocked=' . $isBlocked .')';
		if($isFromB2B === true)
			Comments::addComments($obj, $comments, Comments::TYPE_SYSTEM);
		Log::LogEntity($obj, $comments, Log::TYPE_SYSTEM, '', $class . '::' . __FUNCTION__);
		return $obj;
	}
	/**
	 * Getting all the orders for a customer
	 *
	 * @param int   $pageNo
	 * @param int   $pageSize
	 * @param array $orderBy
	 *
	 * @return multitype:|Ambigous <multitype:, multitype:BaseEntityAbstract>
	 */
	public function getOrders($pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array(), &$stats = array())
	{
		if(($id = trim($this->getId())) === '')
			return array();
		return self::getAllByCriteria('customerId = ?', array($id), true, $pageNo, $pageSize, $orderBy, $stats);
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
			$array['address']['shipping'] = $this->getShippingAddress() instanceof Address ? $this->getShippingAddress()->getJson() : array();
			$array['address']['billing'] = $this->getBillingAddress() instanceof Address ? $this->getBillingAddress()->getJson() : array();
			$array['creditpool'] = $this->getCreditPool() instanceof CreditPool ? $this->creditPool->getJson() : array();
			$array['tier'] = $this->getTier() instanceof TierLevel ? $this->getTier()->getJson() : array();
		}
		return parent::getJson($array, $reset);
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'cust');

		DaoMap::setStringType('name', 'varchar', 100);
		DaoMap::setStringType('description', 'varchar', 255);
		DaoMap::setStringType('contactNo', 'varchar', 50);
		DaoMap::setStringType('email', 'varchar', 100);
		DaoMap::setIntType('terms');
		DaoMap::setManyToOne('billingAddress', 'Address', 'cust_bill_addr', true);
		DaoMap::setManyToOne('shippingAddress', 'Address', 'cust_ship_addr', true);
		DaoMap::setIntType('mageId');
		DaoMap::setBoolType('isFromB2B');
		DaoMap::setBoolType('isBlocked');
		DaoMap::setManyToOne('tier', 'TierLevel', 'cust_tier', true);
		parent::__loadDaoMap();

		DaoMap::createIndex('name');
		DaoMap::createIndex('contactNo');
		DaoMap::createIndex('email');
		DaoMap::createIndex('terms');
		DaoMap::createIndex('isFromB2B');
		DaoMap::createIndex('isBlocked');
		DaoMap::createIndex('mageId');
		DaoMap::createIndex('tier');

		DaoMap::commit();
	}
	
	/**
	 * Getting  the credit for a customer
	 *
	 * @param Customer $this
	 *
	 * @return CreditPool
	 */
	public function getCreditPool()
	{
		$this->creditPool = CreditPool::getCreditPoolByCustomer($this);
		return $this->creditPool;
	}
}