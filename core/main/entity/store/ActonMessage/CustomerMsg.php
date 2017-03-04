<?php
/**
 * Entity for CustomerMsg
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class CustomerMsg extends BaseEntityAbstract
{
	/**
	 * The customer id of this customer
	 *
	 * @var integer
	 */
	private $customerId;
	/**
	 * The email of this customer
	 *
	 * @var string
	 */
	private $email;
	/**
	 * The message list id  of this message
	 *
	 * @var integer
	 */
	private $msgListId;
	/**
	 * The number of opened
	 *
	 * @var integer
	 */
	private $opened;
	/**
	 * The number of clicked
	 *
	 * @var integer
	 */
	private $clicked;
	/**
	 * Getter for customer id
	 *
	 * @return integer
	 */
	public function getCustomerId()
	{
	    return $this->customerId;
	}
	/**
	 * Setter for customer id
	 *
	 * @param integer $value The customerID
	 *
	 * @return CustomerMsg
	 */
	public function setCustomerId($value)
	{
	    $this->customerId = $value;
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
	 * @return CustomerMsg
	 */
	public function setEmail($value)
	{
	    $this->email = $value;
	    return $this;
	}
	/**
	 * Getter for message list id
	 *
	 * @return integer
	 */
	public function getMsgListId()
	{
		return $this->msgListId;
	}
	/**
	 * Setter for message list id
	 *
	 * @param integer $value The msgListId
	 *
	 * @return CustomerMsg
	 */
	public function setMsgListId($value)
	{
		$this->msgListId = $value;
		return $this;
	}
	/**
	 * Getter for opened
	 *
	 * @return integer
	 */
	public function getOpened()
	{
	    return $this->opened;
	}
	/**
	 * Setter for opened
	 *
	 * @param integer $value The opened
	 *
	 * @return CustomerMsg
	 */
	public function setOpened($value)
	{
	    $this->opened = $value;
	    return $this;
	}
	/**
	 * Getter for clicked
	 *
	 * @return integer
	 */
	public function getClicked()
	{
		return $this->clicked;
	}
	/**
	 * Setter for clicked
	 *
	 * @param integer $value The clicked
	 *
	 * @return CustomerMsg
	 */
	public function setClicked($value)
	{
		$this->clicked = $value;
		return $this;
	}

	/**
	 * Creating a instance of this
	 *
	 * @param integer  $customerId
	 * @param string   $email
	 * @param integer  $msgListId
	 * @param integer  $opened
	 * @param integer  $clicked
	 *
	 * @return Ambigous <GenericDAO, BaseEntityAbstract>
	 */
	public static function create($customerId, $email, $msgListId, $opened, $clicked)
	{

		$class =__CLASS__;
		
		$obj = new $class;

		$obj->setCustomerId($customerId)
				->setEmail(trim($email))
				->setMsgListId($msgListId)
				->setOpened($opened)
				->setClicked($clicked)
				->save();

		return $obj;
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'cust_msg');

		DaoMap::setIntType('customerId');
		DaoMap::setStringType('email', 'varchar', 100);
		DaoMap::setIntType('msgListId');
		DaoMap::setIntType('opened');
		DaoMap::setIntType('clicked');
		parent::__loadDaoMap();

		DaoMap::createIndex('customerId');
		DaoMap::createIndex('email');
		DaoMap::createIndex('msgListId');
		DaoMap::createIndex('opened');
		DaoMap::createIndex('clicked');

		DaoMap::commit();
	}
}