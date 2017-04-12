<?php
/**
 * OrderAttention Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class OrderAttention extends BaseEntityAbstract
{

	const STS_ID_NEW = 'NEW';
	const STS_ID_PROCESSED = 'PROCESSED';
	const STS_ID_CANCELLED = 'CANCELLED';
    /**
     * The order id
     *
     * @var Product
     */
    protected $order;
    /**
     * The status
     *
     * @var string
     */
    private $status;
    /**
     * Getter for order
     *
     * @return
     */
    public function getOrder()
    {
    	$this->loadManyToOne('order');
    	return $this->order;
    }
    /**
     * Setter for order
     *
     * @param Order $value The order
     *
     * @return OrderAttention
     */
    public function setOrder(Order $value)
    {
    	$this->order = $value;
    	return $this;
    }
    /**
     * getter status
     *
     * @return string
     */
    public function getStatus()
    {
    	return $this->status;
    }
    /**
     * Setter status
     *
     * @param string $status
     *
     * @return OrderAttention
     */
    public function setStatus($value)
    {
    	$this->status = $value;
    	return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'ord_atn');
        DaoMap::setManyToOne('order', 'Order', 'ord_atn_ord', true);
        DaoMap::setStringType('status');
        DaoMap::setManyToOne('store', 'Store', 'si');
        parent::__loadDaoMap();
        DaoMap::createIndex('order');
        DaoMap::commit();
    }
    /**
     * Getting OrderAttenion object
     *
     * @param  $orderId
     * @return OrderAttenion
     */
    public static function getOrderAttentionObj($orderId)
    {
    	$where = array('orderId = ? and storeId = ?');
    	$params = array($orderId, Core::getUser()->getStore()->getId());
    	$ordAtns= self::getAllByCriteria(implode(' AND ', $where), $params);
    	if (count($ordAtns) > 0)
    	{
    		$ordAtn = $ordAtns[0];
    		if ($ordAtn instanceof OrderAttention)
    			return $ordAtn;
    	}
    	return null;
    }
}

?>
