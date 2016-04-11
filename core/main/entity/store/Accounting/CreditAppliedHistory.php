<?php
/**
 * Entity for CreditAppliedHistory
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class CreditAppliedHistory extends BaseEntityAbstract
{
	/**
	 * The creditNote
	 *
	 * @var CreditNote
	 */
	protected $creditNote;
	/**
	 * The payment
	 *
	 * @var Payment
	 */
	protected $payment;
	/**
	 * creditAmount
	 *
	 * @var number
	 */
	private $creditAmount = 0.0000;
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
	 * @return CreditAppliedHistory
	 */
	public function setCreditAmount($value)
	{
	    $this->creditAmount = doubleval(trim($value));
	    return $this;
	}
	/**
	 * Getter for payment
	 *
	 * @return Payment
	 */
	public function getPayment()
	{
		$this->loadManyToOne('payment');
	    return $this->payment;
	}
	/**
	 * Setter for payment
	 *
	 * @param Payment $value The payment
	 *
	 * @return CreditAppliedHistory
	 */
	public function setPayment($value)
	{
	    $this->payment = $value;
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
	 * @return CreditAppliedHistory
	 */
	public function setCreditNote($value)
	{
		$this->creditNote = $value;
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'cah');

		DaoMap::setManyToOne('payment', 'Payment', 'cah_pm');
		DaoMap::setManyToOne('creditNote', 'CreditNote', 'cah_cn');
		DaoMap::setIntType('creditAmount', 'double', '10,4');
		parent::__loadDaoMap();

		DaoMap::commit();
	}
	/**
	 * Creating a CreditAppliedHistory
	 *
	 * @param CreditNote $creditNote
	 * @param Payment $payment
	 * @param number $creditAmountApplied
	 *
	 * @return CreditAppliedHistory
	 */
	public static function create(CreditNote $creditNote, $payment, $creditAmountApplied)
	{
		if (!$payment instanceof Payment)
		{
			return;
		}
		//$creditAmountApplied = doubleval($payment->getValue());
		$creditAppliedHistory= new CreditAppliedHistory();
		$creditAppliedHistory->setCreditNote($creditNote)
			->setPayment($payment)
			->setCreditAmount($creditAmountApplied)
			->save();
		return $creditAppliedHistory;
	}
}