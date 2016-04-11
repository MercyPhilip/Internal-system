<?php
/**
 * Entity for CreditPoolHistory
 *
 * @package    Core
 * @subpackage Entity
 * @author
 */
class CreditPoolHistory extends BaseEntityAbstract
{
	const TYPE_CREDIT = 'CREDIT';
	const TYPE_ORDER= 'ORDER';
	const TYPE_REFUND= 'REFUND';
	
	/**
	 * The customer
	 *
	 * @var Customer
	 */
	protected $creditpool;
	/**
	 * The type
	 *
	 * @var type
	 */
	private $type;
	/**
	 * The typeId
	 *
	 * @var typeId
	 */
	private $typeId;
	/**
	 * Total value of the amount
	 *
	 * @var double
	 */
	private $amount = 0.0000;
	/**
	 * Total value of the credit
	 *
	 * @var double
	 */
	private $totalCreditLeft = 0.0000;
	/**
	 * Getter for creditpool
	 *
	 * @return creditpool
	 */
	public function getCreditPool()
	{
		$this->loadManyToOne('creditpool');
		return $this->creditpool;
	}
	/**
	 * Setter for creditpool
	 *
	 * @param creditpool $value The creditpool
	 *
	 * @return CreditPoolHistory
	 */
	public function setCreditPool($value)
	{
		$this->creditpool = $value;
		return $this;
	}
	/**
	 * Getter for type
	 *
	 * @return string
	 */	
	public function getType()
	{
		return $this->type;
	}
	/**
	 * Setter for type
	 *
	 * @return string
	 */	
	public function setType($value)
	{
		$this->type = $value;
		return $this;
	}
	/**
	 * Getter for type Id
	 *
	 * @return string
	 */
	public function getTypeId()
	{
		return $this->typeId;
	}
	/**
	 * Setter for type id
	 *
	 * @return string
	 */
	public function setTypeId($value)
	{
		$this->typeId = $value;
		return $this;
	}	
	/**
	 * Getter for amount
	 *
	 * @return double
	 */
	public function getAmount()
	{
		return doubleval($this->amount);
	}
	/**
	 * Setter for amount
	 *
	 * @param double $value - the credit
	 *
	 * @return CreditPoolHistory
	 */
	public function setAmount($value)
	{
		$this->amount = doubleval(trim($value));
		return $this;
	}
	
	/**
	 * Getter for totalCreditLeft
	 *
	 * @return double
	 */
	public function getTotalCreditLeft()
	{
	    return doubleval($this->totalCreditLeft);
	}
	/**
	 * Setter for totalCreditLeft
	 *
	 * @param double $value - the credit
	 *
	 * @return CreditPoolHistory
	 */
	public function setTotalCreditLeft($value)
	{
	    $this->totalCreditLeft = doubleval(trim($value));
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'cplh');

		DaoMap::setManyToOne('creditpool', 'CreditPool', 'cplh_cpl');
		DaoMap::setStringType('type', 'varchar', '50');
		DaoMap::setIntType('typeId', 'double', '10,4');
		DaoMap::setIntType('amount', 'double', '10,4');
		DaoMap::setIntType('totalCreditLeft', 'double', '10,4');
		parent::__loadDaoMap();

		DaoMap::commit();
	}
	/**
	 * Creating a CreditPool
	 *
	 * @param CreditPool $creditpool
	 * @param number $type
	 * @param number $typeId
	 * @param number $creditAmount
	 *
	 * @return CreditPoolHistory
	 */
	public static function create($creditpool, $type, $typeId, $creditAmount)
	{
		// if created from order
		if (!$creditpool instanceof CreditPool)
		{
			return;
		}
		switch ($type)
		{
			case CreditPoolHistory::TYPE_CREDIT:
				// money in due to credit
				$creditAmount = doubleval(trim($creditAmount));
				break;
			case CreditPoolHistory::TYPE_ORDER:
			case CreditPoolHistory::TYPE_REFUND:
				// money out from credit due to new order or refund
				$creditAmount = 0 - doubleval(trim($creditAmount));
				break;
			default:
				return;
				break;
		}
		$totalCreditLeft = $creditpool->getTotalCreditLeft();
		$cph = new CreditPoolHistory();
		$cph->setCreditPool($creditpool)
			->setType($type)
			->setTypeId($typeId)
			->setAmount($creditAmount)
			->setTotalCreditLeft($totalCreditLeft)
			->save();
		
		return $cph;
	}

}