<?php
/**
 * TierPrice Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class TierPrice extends BaseEntityAbstract
{
    /**
     * The tier rule
     *
     * @var TierRule
     */
    protected  $tierrule;
    /**
     * The tier level
     *
     * @var TierLevel
     */
    protected $tierLevel;
    /**
     * The quantity
     *
     * @var int
     */
    private $quantity;
    /**
     * The tier price type
     *
     * @var TierPriceType
     */
    protected  $tierpricetype;
    /**
     * The tier price or percentage
     *
     * @var double
     */
    private $value;
    /**
     * Getter for tier price type
     *
     * @return TierPriceType
     */
    public function getTierPriceType()
    {
    	$this->loadManyToOne('tierpricetype');
    	return $this->tierpricetype;
    }
    /**
     * Setter for tierrule
     *
     * @param TierPriceType $value The tierrule
     *
     * @return TierPrice
     */
    public function setTierPriceType(TierPriceType $value)
    {
    	$this->tierpricetype = $value;
    	return $this;
    }
    /**
     * Getter for tierrule
     *
     * @return TierRule
     */
    public function getTierRule()
    {
    	$this->loadManyToOne('tierrule');
    	return $this->tierrule;
    }
    /**
     * Setter for tierrule
     *
     * @param TierRule $value The tierrule
     *
     * @return TierPrice
     */
    public function setTierRule(TierRule $value)
    {
    	$this->tierrule = $value;
    	return $this;
    }
    /**
     * Getter for tier level
     *
     * @return TierLevel
     */
    public function getTierLevel()
    {
    	$this->loadManyToOne('tierLevel');
    	return $this->tierLevel;
    }
    /**
     * Setter for tierLevel
     *
     * @param TierLevel $value The tier level
     *
     * @return TierPrice
     */
    public function setTierLevel(TierLevel $value)
    {
    	$this->tierLevel = $value;
    	return $this;
    }
    /**
     * getter quantity
     *
     * @return int
     */
    public function getQuantity()
    {
        return $this->quantity;
    }
    /**
     * Setter quantity
     *
     * @param int $quantity The quantity
     *
     * @return TierPrice
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
        return $this;
    }
    /**
     * getter price
     *
     * @return double
     */
    public function getValue()
    {
    	return $this->value;
    }
    /**
     * Setter price
     *
     * @param double $price
     *
     * @return TierPrice
     */
    public function setValue($value)
    {
    	$this->value = $value;
    	return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'trl_pr');
        DaoMap::setManyToOne('tierrule', 'TierRule', 'trl_pr_tr_rl', true);
        DaoMap::setManyToOne('tierLevel', 'TierLevel', 'trl_pr_trl', true);
        DaoMap::setIntType('quantity', 'int', 10, true);
        DaoMap::setIntType('value', 'double', '10,4', true);
        DaoMap::setManyToOne('tierpricetype', 'TierPriceType', 'trl_pr_tpt', true);
        parent::__loadDaoMap();
        DaoMap::createIndex('tierrule');
        DaoMap::createIndex('tierLevel');

        DaoMap::commit();
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntityAbstract::getJson()
     */
    public function getJson($extra = array(), $reset = false)
    {
    	$ret = array();
    	$array = $extra;
    	if(!$this->isJsonLoaded($reset))
    	{
    		$array['tierLevel'] = $this->getTierLevel() instanceof TierLevel ? $this->getTierLevel()->getJson() : null;
    		$array['tierPriceType'] = $this->getTierPriceType() instanceof TierPriceType ? $this->getTierPriceType()->getJson() : null;
    	}
    	$ret = parent::getJson($array, $reset);
    	$qty = $ret['quantity'];
    	if ($qty === 0)
    		$ret['quantity'] = '';
    	return $ret;
    }
    /**
     * Getting all the tier prices
     *
     * @param TierRule $tierRule
     * @param TierPriceType $type
     * @param string $activeOnly
     * @param string $pageNo
     * @param unknown $pageSize
     * @param unknown $orderBy
     * @param unknown $stats
     * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
     */
    public static function getTierPrices(TierRule $tierRule, TierPriceType $type = null, $activeOnly = true, $pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array('tierLevelId' => 'asc'), &$stats = array())
    {
    	$where = array('tierruleId = ? ');
    	$params = array($tierRule->getId());
    	if($type instanceof TierPriceType)
    	{
    		$where[] = 'tierpricetypeId = ?';
    		$params[] = $type->getId();
    	}
    	return self::getAllByCriteria(implode(' AND ', $where), $params, $activeOnly, $pageNo , $pageSize, $orderBy, $stats);
    }
}

?>
