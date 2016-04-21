<?php
/**
 * Entity for CreditNoteStatus
 *
 * @package    Core
 * @subpackage Entity
 * @author
 */
class CreditNoteStatus extends BaseEntityAbstract
{
	const TYPE_OPEN = 'OPEN';
	const TYPE_PARTIAL= 'PARTIALLY APPLIED';
	const TYPE_FULL= 'FULLY APPLIED';
	const TYPE_CANCELLED= 'CANCELLED';
	
	/**
	 * The creditPool
	 *
	 * @var CreditPool
	 */
	protected $creditPool;
	/**
	 * Total creditNote
	 *
	 * @var CreditNote
	 */
	protected $creditNote;
	/**
	 * creditAmount
	 *
	 * @var number
	 */
	private $creditAmount = 0.0000;
	/**
	 * creditAmountAvailable
	 *
	 * @var number
	 */
	private $creditAmountAvailable = 0.0000;
	/**
	 * status
	 *
	 * @var 
	 */
	private $status;	
	/**
	 * Getter for creditAmount
	 *
	 * @return double
	 */
	public function getCreditAmount()
	{
	    return doubleval($this->creditAmount);
	}
	/**
	 * Setter for creditAmount
	 *
	 * @param double $value - the credit
	 *
	 * @return CreditNoteStatus
	 */
	public function setCreditAmount($value)
	{
	    $this->creditAmount = doubleval(trim($value));
	    return $this;
	}
	/**
	 * Getter for CreditAmountAvailable
	 *
	 * @return double
	 */
	public function getCreditAmountAvailable()
	{
		return doubleval($this->creditAmountAvailable);
	}
	/**
	 * Setter for CreditAmountAvailable
	 *
	 * @param double $value - the credit
	 *
	 * @return CreditNoteStatus
	 */
	public function setCreditAmountAvailable($value)
	{
		$this->creditAmountAvailable = doubleval(trim($value));
		return $this;
	}
	/**
	 * Getter for creditPool
	 *
	 * @return CreditPool
	 */
	public function getCreditPool()
	{
		$this->loadManyToOne('creditPool');
	    return $this->creditPool;
	}
	/**
	 * Setter for creditpool
	 *
	 * @param CreditPool $value The creditpool
	 *
	 * @return CreditNoteStatus
	 */
	public function setCreditPool($value)
	{
	    $this->creditPool = $value;
	    return $this;
	}
	/**
	 * Getter for creditNote
	 *
	 * @return CreditNote
	 */
	public function getCreditNote()
	{
		$this->loadManyToOne('creditNote');
		return $this->creditNote;
	}
	/**
	 * Setter for creditNote
	 *
	 * @param CreditNote $value The creditNote
	 *
	 * @return CreditNoteStatus
	 */
	public function setCreditNote($value)
	{
		$this->creditNote = $value;
		return $this;
	}
	/**
	 * Getter for status
	 *
	 * @return sting
	 */
	public function getStatus()
	{
		return $this->status;
	}
	/**
	 * Setter for status
	 *
	 * @param string $value - the status
	 *
	 * @return CreditNoteStatus
	 */
	public function setStatus($value)
	{
		$this->status = trim($value);
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'cns');

		DaoMap::setManyToOne('creditPool', 'CreditPool', 'cns_cp');
		DaoMap::setManyToOne('creditNote', 'CreditNote', 'cns_cn');
		DaoMap::setIntType('creditAmount', 'double', '10,4');
		DaoMap::setIntType('creditAmountAvailable', 'double', '10,4');
		DaoMap::setStringType('status', 'varchar', '50');
		parent::__loadDaoMap();

		DaoMap::commit();
	}
	/**
	 * Creating a CreditNoteStatus
	 *
	 * @param CreditNote $creditNote
	 * @param number $creditAmount
	 *
	 * @return CreditNoteStatus
	 */
	public static function create(CreditPool $creditPool, CreditNote $creditNote)
	{
		/*
		 * if the order has not been paid then no need to create credit
		 * if the order has been paid then the credit will be the total value input on the creditnote page
		 * but if the total value > total paid then the credit will be the total paid amount,
		 * because there is a case that customer only paid part amount of the total order amount
		 */
		$order = $creditNote->getOrder();
		$totalCredit = doubleval($creditNote->getTotalValue());
		$totalPaid = 0;
		
		if ($order instanceof  Order)
		{
			$totalPaid = $order->getTotalPaid();
		}
		
		if (($totalPaid > 0) && ($totalPaid >= $totalCredit))
		{
			$totalPaid = $totalCredit;
		}
		
		$creditAmount = doubleval($totalPaid);
		$creditAmountAvailable = $creditAmount - doubleval($creditNote->getTotalPaid());
		
		if ($creditAmountAvailable <= 0)
		{
			$status = self::TYPE_FULL;
		}
		else if ($creditAmount == $creditAmountAvailable)
		{
			$status = self::TYPE_OPEN;
		}
		else
		{
			$status = self::TYPE_PARTIAL;
		}	
		$creditNoteStatus = new CreditNoteStatus();
		$creditNoteStatus->setCreditPool($creditPool)
			->setCreditNote($creditNote)
			->setStatus($status)
			->setCreditAmount($creditAmount)
			->setCreditAmountAvailable($creditAmountAvailable)
			->save();
		return $creditNoteStatus;
	}
	/**
	 * Update the status and credit avaiable
	 * 
	 * @param CreditPool $creditPool
	 * @param CreditNote $creditNote
	 * @param Payment $payment
	 */
	public static function Update(CreditPool $creditPool, CreditNote $creditNote, Payment $payment)
	{
		$objs = self::getAllByCriteria('creditpoolId = ? and creditNoteId = ? ', array($creditPool->getId(), $creditNote->getId()), true, 1, 1);
		if (count($objs) <= 0)
		{
			return;
		}
		$creditNoteStatus = $objs[0];
		
		$creditAmount = doubleval($creditNoteStatus->getCreditAmount());
		$creditAmountAvailable = doubleval($creditNoteStatus->getCreditAmountAvailable()) - doubleval($payment->getValue());
		if ($creditAmountAvailable <= 0)
		{
			$status = self::TYPE_FULL;
		}
		else if ($creditAmount == $creditAmountAvailable)
		{
			$status = self::TYPE_OPEN;
		}
		else
		{
			$status = self::TYPE_PARTIAL;
		}
		$creditNoteStatus->setStatus($status)
			->setCreditAmountAvailable($creditAmountAvailable)
			->save();
		return $creditNoteStatus;
	}
	/**
	 * Get all creditnotes with status <> FULLY APPLIED
	 * 
	 * @param CreditPool $creditPool
	 */
	public static function getAllCreditNoteStatus(CreditPool $creditPool)
	{
		$creditNoteSts = array();
		if (!$creditPool instanceof CreditPool)
		{
			return $creditNoteSts;
		}
		$creditPoolId = $creditPool->getId();
		$creditNoteSts = self::getAllByCriteria('creditpoolId = ? and status <> ?', array($creditPool->getId(), CreditNoteStatus::TYPE_FULL), true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array('created' => 'ASC'));
		return $creditNoteSts;
	}
	/**
	 * Get the creditnotestauts
	 * 
	 * @param CreditNote $creditNote
	 */
	public static function getCreditNoteStatus($creditNote)
	{
		if (!$creditNote instanceof CreditNote)
		{
			return null;
		}
		$objs = self::getAllByCriteria('creditNoteId = ? ', array($creditNote->getId()), true, 1, 1);
		if (count($objs) <= 0)
		{
			return null;
		}
		$creditNoteStatus = $objs[0];
		if ($creditNoteStatus instanceof CreditNoteStatus)
		{
			return $creditNoteStatus;
		}
		return null;
	}
	
}