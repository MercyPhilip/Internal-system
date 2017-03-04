<?php
/**
 * Entity for MessageReport
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class MessageReport extends BaseEntityAbstract
{
	/**
	 * The message list id of this report
	 *
	 * @var integer
	 */
	private $msgListId;
	/**
	 * The list id of this report
	 *
	 * @var string
	 */
	private $listId;
	/**
	 * The data  of this report
	 *
	 * @var string
	 */
	private $data;
	/**
	 * The os of this report
	 *
	 * @var string
	 */
	private $os;
	/**
	 * The email of this report
	 *
	 * @var string
	 */
	private $email;
	/**
	 * The ip of this report
	 *
	 * @var string
	 */
	private $ip;
	/**
	 * The browser of this report
	 *
	 * @var string
	 */
	private $browser;
	/**
	 * The customer name of this report
	 *
	 * @var string
	 */
	private $name;
	/**
	 * The action of this report
	 *
	 * @var string
	 */
	private $action;
	/**
	 * The time of this report
	 *
	 * @var string
	 */
	private $when;
	/**
	 * The receive id of this report
	 *
	 * @var string
	 */
	private $recId;
	/**
	 * The link uri of this report
	 *
	 * @var string
	 */
	private $linkuri;
	/**
	 * The drilldown type of this report
	 *
	 * @var string
	 */
	private $drilldownType;	
	/**
	 * The time stamp of this report
	 *
	 * @var string
	 */
	private $timeStamp;
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
	 * @return MessageReport
	 */
	public function setMsgListId($value)
	{
	    $this->msgListId = $value;
	    return $this;
	}
	/**
	 * Getter for list id
	 *
	 * @return string
	 */
	public function getListID()
	{
	    return $this->listId;
	}
	/**
	 * Setter for list id
	 *
	 * @param string $value The listId
	 *
	 * @return MessageReport
	 */
	public function setListId($value)
	{
	    $this->listId = $value;
	    return $this;
	}
	/**
	 * Getter for data
	 *
	 * @return
	 */
	public function getData()
	{
	    return $this->data;
	}
	/**
	 * Setter for data
	 *
	 * @param string $value The data
	 *
	 * @return MessageReport
	 */
	public function setData($value)
	{
	    $this->data = $value;
	    return $this;
	}
	/**
	 * Getter for os
	 *
	 * @return string
	 */
	public function getOs()
	{
		return $this->os;
	}
	/**
	 * Setter for os
	 *
	 * @param string $value The os
	 *
	 * @return MessageReport
	 */
	public function setOs($value)
	{
		$this->os = $value;
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
	 * @return MessageReport
	 */
	public function setEmail($value)
	{
	    $this->email = $value;
	    return $this;
	}
	/**
	 * Getter for ip
	 *
	 * @return string
	 */
	public function getIp()
	{
	    return $this->ip;
	}
	/**
	 * Setter for ip
	 *
	 * @param string $value The ip
	 *
	 * @return MessageReport
	 */
	public function setIp($value)
	{
	    $this->ip= $value;
	    return $this;
	}
	/**
	 * Getter for browser
	 *
	 * @return string
	 */
	public function getBrowser()
	{
	    return $this->browser;
	}
	/**
	 * Setter for browser
	 *
	 * @param string $value The browser
	 *
	 * @return MessageReport
	 */
	public function setBrowser($value)
	{
	    $this->browser= $value;
	    return $this;
	}
	/**
	 * Getter for customer name
	 *
	 * @return string
	 */
	public function getName()
	{
		return $this->name;
	}
	/**
	 * Setter for customer name
	 *
	 * @param string $value The customer name
	 *
	 * @return MessageReport
	 */
	public function setName($value)
	{
		$this->name= $value;
		return $this;
	}
	/**
	 * Getter for action
	 *
	 * @return string
	 */
	public function getAction()
	{
		return $this->action;
	}
	/**
	 * Setter for action
	 *
	 * @param string $value The action
	 *
	 * @return MessageReport
	 */
	public function setAction($value)
	{
		$this->action= $value;
		return $this;
	}
	/**
	 * Getter for when
	 *
	 * @return string
	 */
	public function getWhen()
	{
		return $this->when;
	}
	/**
	 * Setter for when
	 *
	 * @param string $value The when
	 *
	 * @return MessageReport
	 */
	public function setWhen($value)
	{
		$this->when= $value;
		return $this;
	}
	/**
	 * Getter for receive id
	 *
	 * @return string
	 */
	public function getRecId()
	{
		return $this->recId;
	}
	/**
	 * Setter for receive id
	 *
	 * @param string $value The receive id
	 *
	 * @return MessageReport
	 */
	public function setRecId($value)
	{
		$this->recId= $value;
		return $this;
	}
	/**
	 * Getter for link uri
	 *
	 * @return string
	 */
	public function getLinkuri()
	{
		return $this->linkuri;
	}
	/**
	 * Setter for link uri
	 *
	 * @param string $value The link uri
	 *
	 * @return MessageReport
	 */
	public function setLinkuri($value)
	{
		$this->linkuri= $value;
		return $this;
	}
	/**
	 * Getter for drilldown type
	 *
	 * @return string
	 */
	public function getDrilldownType()
	{
		return $this->drilldownType;
	}
	/**
	 * Setter for drilldown type
	 *
	 * @param string $value The drilldown type
	 *
	 * @return MessageReport
	 */
	public function setDrilldownType($value)
	{
		$this->drilldownType= $value;
		return $this;
	}
	/**
	 * Getter for time stamp
	 *
	 * @return string
	 */
	public function getTimeStamp()
	{
		return $this->timeStamp;
	}
	/**
	 * Setter for time stamp
	 *
	 * @param string $value The time stamp
	 *
	 * @return MessageReport
	 */
	public function setTimeStamp($value)
	{
		$this->timeStamp= $value;
		return $this;
	}
	/**
	 * Creating a instance of this
	 *
	 * @param array   $param
	 * @param string  $msgListIdd
	 * @param string  $drilldownType
	 *
	 * @return Ambigous <GenericDAO, BaseEntityAbstract>
	 */
	public static function create($param, $msgListId, $drilldownType)
	{
// 		$msg_list_id = trim($msgListId);
		$drilldown_type = trim($drilldownType);
		$list_id = trim($param[0]);
		
		if($drilldown_type == 'OPENED'){
			$data		= '';
			$os			= trim($param[1]);
			$ip			= trim($param[2]);
			$browser 	= trim($param[3]);
			$name	 	= trim($param[4]);
			$action	 	= '';
			$when	 	= trim($param[5]);
			$rec_id		= trim($param[6]);
			$email	 	= trim($param[7]);
			$time_stamp = trim($param[8]);
			$link_uri 	= '';
		} else {
			$data		= trim($param[1]);
			$os			= trim($param[2]);
			$ip			= trim($param[3]);
			$browser 	= trim($param[4]);
			$name	 	= trim($param[5]);
			$action	 	= trim($param[6]);
			$when	 	= trim($param[7]);
			$rec_id		= trim($param[8]);
			$email	 	= trim($param[9]);
			$time_stamp = trim($param[10]);
			$link_uri 	= trim($param[11]);			
		}

		$class =__CLASS__;

		$obj = new $class;

		$obj->setMsgListId($msgListId)
			->setDrilldownType($drilldown_type)
			->setListId($list_id)
			->setData($data)
			->setOs($os)
			->setIp($ip)
			->setBrowser($browser)
			->setName($name)
			->setAction($action)
			->setWhen($when)
			->setRecId($rec_id)
			->setEmail($email)
			->setTimeStamp($time_stamp)
			->setLinkuri($link_uri)
			->save();

		return $obj;
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'msg_report');

		DaoMap::setIntType('msgListId');
		DaoMap::setStringType('listId', 'varchar', 50);
		DaoMap::setStringType('data', 'varchar', 150);
		DaoMap::setStringType('os', 'varchar', 50);
		DaoMap::setStringType('ip', 'varchar', 20);
		DaoMap::setStringType('browser', 'varchar', 50);
		DaoMap::setStringType('name', 'varchar', 100);
		DaoMap::setStringType('action', 'varchar', 100);
		DaoMap::setStringType('when', 'varchar', 50);
		DaoMap::setStringType('recId', 'varchar', 20);
		DaoMap::setStringType('email', 'varchar', 100);
		DaoMap::setStringType('timeStamp', 'varchar', 13);
		DaoMap::setStringType('linkuri', 'varchar', 150);
		DaoMap::setStringType('drilldownType', 'varchar', 15);
		parent::__loadDaoMap();

		DaoMap::createIndex('msgListId');
		DaoMap::createIndex('listId');
		DaoMap::createIndex('data');
		DaoMap::createIndex('os');
		DaoMap::createIndex('ip');
		DaoMap::createIndex('browser');
		DaoMap::createIndex('name');
		DaoMap::createIndex('action');
		DaoMap::createIndex('when');
		DaoMap::createIndex('recId');
		DaoMap::createIndex('email');
		DaoMap::createIndex('timeStamp');
		DaoMap::createIndex('linkuri');
		DaoMap::createIndex('drilldownType');

		DaoMap::commit();
	}
}