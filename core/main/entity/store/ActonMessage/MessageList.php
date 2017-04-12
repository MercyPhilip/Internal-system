<?php
/**
 * Entity for MessageList
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class MessageList extends BaseEntityAbstract
{
	/**
	 * The massage id of this message
	 *
	 * @var string
	 */
	private $msgId;
	/**
	 * The title of this message
	 *
	 * @var string
	 */
	private $title;
	/**
	 * The create time  of this message
	 *
	 * @var string
	 */
	private $timeWhen;
	/**
	 * The sender_name of this message
	 *
	 * @var string
	 */
	private $senderName;
	/**
	 * The sender email of this message
	 *
	 * @var string
	 */
	private $senderEmail;
	/**
	 * The sender id of this message
	 *
	 * @var string
	 */
	private $senderId;
	/**
	 * Is this message text only or not
	 *
	 * @var bool
	 */
	private $isTextOnly;
	/**
	 * Getter for message id
	 *
	 * @return string
	 */
	public function getMsgId()
	{
	    return $this->msgId;
	}
	/**
	 * Setter for message id
	 *
	 * @param string $value The Msgid
	 *
	 * @return MessageList
	 */
	public function setMsgId($value)
	{
	    $this->msgId = $value;
	    return $this;
	}
	/**
	 * Getter for title
	 *
	 * @return string
	 */
	public function getTitle()
	{
	    return $this->title;
	}
	/**
	 * Setter for title
	 *
	 * @param string $value The title
	 *
	 * @return MessageList
	 */
	public function setTitle($value)
	{
	    $this->title = $value;
	    return $this;
	}
	/**
	 * Getter for time_when
	 *
	 * @return
	 */
	public function getTimeWhen()
	{
	    return $this->timeWhen;
	}
	/**
	 * Setter for time_when
	 *
	 * @param string $value The TimeWhen
	 *
	 * @return MessageList
	 */
	public function setTimeWhen($value)
	{
	    $this->timeWhen = $value;
	    return $this;
	}
	/**
	 * Getter for sender name
	 *
	 * @return string
	 */
	public function getSenderName()
	{
		return $this->senderName;
	}
	/**
	 * Setter for sender name
	 *
	 * @param string $value The sender name
	 *
	 * @return MessageList
	 */
	public function setSenderName($value)
	{
		$this->senderName = $value;
		return $this;
	}
	/**
	 * Getter for sender email
	 *
	 * @return string
	 */
	public function getSenderEmail()
	{
	    return $this->senderEmail;
	}
	/**
	 * Setter for sender email
	 *
	 * @param string $value The sender email
	 *
	 * @return MessageList
	 */
	public function setSenderEmail($value)
	{
	    $this->senderEmail = $value;
	    return $this;
	}
	/**
	 * Getter for sender_id
	 *
	 * @return string
	 */
	public function getSenderId()
	{
	    return $this->senderId;
	}
	/**
	 * Setter for sender_id
	 *
	 * @param string $value The sender id
	 *
	 * @return MessageList
	 */
	public function setSenderId($value)
	{
	    $this->senderId = $value;
	    return $this;
	}
	/**
	 * Getter for is_text_only
	 *
	 * @return bool
	 */
	public function getIsTextOnly()
	{
		return (trim($this->isTextOnly) === '1');
	}
	/**
	 * Setter for is_text_only
	 *
	 * @param unkown $value The is_text_only
	 *
	 * @return MessageList
	 */
	public function setIsTextOnly($value)
	{
		$this->isTextOnly = $value;
		return $this;
	}
	
	/**
	 * Creating a instance of this
	 *
	 * @param string  $msg_id
	 * @param string  $title
	 * @param string  $time_when
	 * @param string  $sender_name
	 * @param string  $sender_email
	 * @param string  $sender_id
	 * @param bool    $is_text_only
	 *
	 * @return Ambigous <GenericDAO, BaseEntityAbstract>
	 */
	public static function create($param)
	{
		$msg_id = trim($param['msg_id']);
		$title = trim($param['title']);
		$time_when = trim($param['time_when']);
		$sender_name = trim($param['sender_name']);
		$sender_email = trim($param['sender_email']);
		$sender_id = trim($param['sender_id']);
		
		if($param['is_text_only'] === 'false'){
			$is_text_only = 0;
		} else {
			$is_text_only = 1;
		}
		$class =__CLASS__;
		
		$obj = new $class;

		$obj->setMsgId($msg_id)
				->setTitle($title)
				->setTimeWhen($time_when)
				->setSenderName($sender_name)
				->setSenderEmail($sender_email)
				->setSenderId($sender_id)
				->setIsTextOnly($is_text_only)
				->save();
				
		return $obj;
		
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'msg_list');

		DaoMap::setStringType('msgId', 'varchar', 12);
		DaoMap::setStringType('title', 'varchar', 100);
		DaoMap::setStringType('timeWhen', 'varchar', 50);
		DaoMap::setStringType('senderName', 'varchar', 100);
		DaoMap::setStringType('senderEmail', 'varchar', 100);
		DaoMap::setStringType('senderId', 'varchar', 10);
		DaoMap::setBoolType('isTextOnly');
		parent::__loadDaoMap();

		DaoMap::createIndex('msgId');
		DaoMap::createIndex('title');
		DaoMap::createIndex('timeWhen');
		DaoMap::createIndex('senderName');
		DaoMap::createIndex('senderEmail');
		DaoMap::createIndex('senderId');
		DaoMap::createIndex('isTestOnly');

		DaoMap::commit();
	}
}