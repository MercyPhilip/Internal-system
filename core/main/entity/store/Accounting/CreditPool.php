<?php
/**
 * Entity for CreditPool
 *
 * @package    Core
 * @subpackage Entity
 * @author
 */
class CreditPool extends BaseEntityAbstract
{
	/**
	 * The customer
	 *
	 * @var Customer
	 */
	protected $customer;
	/**
	 * Total value of the credit
	 *
	 * @var double
	 */
	private $totalCreditLeft = 0.0000;
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
	 * @return CreditPool
	 */
	public function setTotalCreditLeft($value)
	{
	    $this->totalCreditLeft = doubleval($this->totalCreditLeft) + doubleval(trim($value));
	    return $this;
	}
	/**
	 * Getter for customer
	 *
	 * @return Customer
	 */
	public function getCustomer()
	{
		$this->loadManyToOne('customer');
	    return $this->customer;
	}
	/**
	 * Setter for customer
	 *
	 * @param Customer $value The customer
	 *
	 * @return CreditPool
	 */
	public function setCustomer($value)
	{
	    $this->customer = $value;
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see HydraEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'cpl');

		DaoMap::setManyToOne('customer', 'Customer', 'cn_cus');
		DaoMap::setIntType('totalCreditLeft', 'double', '10,4');
		parent::__loadDaoMap();

		DaoMap::commit();
	}
	/**
	 * Creating a CreditPool
	 *
	 * @param CreditNote $creditNote
	 * @param number $creditAmount
	 *
	 * @return CreditPool
	 */
	public static function create(CreditNote $creditNote)
	{
		$order = $creditNote->getOrder();
		$customer = $creditNote->getCustomer();
		if (!$customer instanceof Customer)
		{
			// must have customer info to create credit
			return null;
		}
		// if created from customer
		$objs = self::getAllByCriteria('customerId = ?', array($customer->getId()), true, 1, 1);
		$creditpool = ( count($objs) > 0 ? $objs[0] : new CreditPool() );
		
		// if created from order
		if ($order instanceof  Order)
		{
			// for those customers that are not terms account has not paid
			// Or for terms account, passpaymentcheck is 1 but paid nothing
			if (!$order->getPassPaymentCheck() || (doubleval($order->getTotalPaid()) <= doubleval(0)))
			{
				$creditpool->setCustomer($customer)
					->setTotalCreditLeft(0)
					->save();
				return $creditpool;
			}
		}

		if ($order instanceof  Order) 
		{
			$totalPaid = $order->getTotalPaid();
		}
		else 
		{
			$totalPaid = $creditNote->getTotalValue();
		}
		$creditAmount = doubleval($totalPaid);
		$creditpool->setCustomer($customer)
			->setTotalCreditLeft($creditAmount)
			->save();
		
		//Create log for creditpool
		CreditPoolLog::create($creditpool, CreditPoolLog::TYPE_CREDIT, $creditNote->getId(), $creditAmount);
		
		// if has refund
		if ($creditNote->getTotalPaid() > 0)
		{
			$creditAmount = 0 - doubleval($creditNote->getTotalPaid());
			$creditpool->setTotalCreditLeft($creditAmount)->save();
			
			//Create log for creditpool
			CreditPoolLog::create($creditpool, CreditPoolLog::TYPE_REFUND, $creditNote->getId(), $creditAmount);
		}
		
		return $creditpool;
	}
	/**
	 * Use the credit left to pay for a new order
	 * 
	 * @param Order $order
	 * @param Payment $payment
	 * 
	 * @return CreditPool
	 */
	public static function applyToOrder(Order $order, Payment $payment)
	{
		// must apply to order
		if (!$order instanceof  Order || !$payment instanceof Payment)
		{
			return;
		}	
		$customer = $order->getCustomer();		
		$objs = self::getAllByCriteria('customerId = ?', array($customer->getId()), true, 1, 1);
		if (count($objs) <= 0)
		{
			// if cant find the customer
			// then there should be no credit for use
			return;
		}
		$creditpool = $objs[0];
		$creditPaidAmount = 0;

		if ($payment->getMethod()->getId() != PaymentMethod::ID_STORE_CREDIT)
		{
			// the payment method is not offset credit ( id= 11)
			return;
		}
		$creditPaidAmount = doubleval($payment->getValue());
		$creditPaidAmount = 0 - $creditPaidAmount;
		// update credit left
		$creditpool->setTotalCreditLeft($creditPaidAmount)->save();
		
		//Create log for creditpool
		CreditPoolLog::create($creditpool, CreditPoolLog::TYPE_ORDER, $order->getId(), $creditPaidAmount);
	
		return $creditpool;
	}
	/**
	 * Use the credit left to refund cash to customer
	 *
	 * @param CreditNote $creditNote
	 * @param Payment $payment
	 *
	 * @return CreditPool
	 */
	public static function applyToRefund(CreditNote $creditNote, Payment $payment)
	{
		// must apply to creditnote
		if (!$creditNote instanceof CreditNote || !$payment instanceof Payment)
		{
			return null;
		}
		$customer = $creditNote->getCustomer();
		$objs = self::getAllByCriteria('customerId = ?', array($customer->getId()), true, 1, 1);
		if (count($objs) <= 0)
		{
			// if cant find the customer
			// then there should be no credit for use
			return null;
		}
		$creditpool = $objs[0];
		$creditAmount = doubleval($payment->getValue());
		$creditPaidAmount = 0 - $creditAmount;
		// update credit left
		$creditpool->setTotalCreditLeft($creditPaidAmount)->save();
		//Create log for creditpool
		CreditPoolLog::create($creditpool, CreditPoolLog::TYPE_REFUND, $creditNote->getId(), $creditPaidAmount);

		return $creditpool;
	}
	
	/**
	 * Get CreditPool by customer ID
	 *
	 *@param Customer $customer
	 *
	 * @return CreditPool
	 */
	public static function getCreditPoolByCustomer($customer)
	{
		$objs = self::getAllByCriteria('customerId = ?', array($customer->getId()), true, 1, 1);
		if (count($objs) <= 0)
		{
			// if cant find the customer
			// then there should be no credit for use
			return null;
		}
		$creditpool = $objs[0];	
		return $creditpool;
	}
	/**
	 * Update the credit pool and status and log
	 * 
	 * @param unknown $entity
	 * @param Payment $payment
	 */
	public static function UpdateCreditPool($entity, Payment $payment)
	{
		if (!$payment instanceof Payment)
		{
			return;
		}
		if ($entity instanceof Order)
		{
			if ($payment->getMethod()->getId() != PaymentMethod::ID_STORE_CREDIT)
			{
				// the payment method is not offset credit ( id= 11)
				return;
			}
			$creditpool = CreditPool::applyToOrder($entity, $payment);
			if (!$creditpool instanceof CreditPool)
			{
				return;
			}
			// automatically select an creditnote ordered by created time
			// to apply
			self::UpdateCreditStatusLogByOrder($creditpool, $entity, $payment);
		}
		else if ($entity instanceof CreditNote)
		{
			$creditpool = CreditPool::applyToRefund($entity, $payment);
			if (!$creditpool instanceof CreditPool)
			{
				return;
			}
			$creditNoteStatus = CreditNoteStatus::update($creditpool, $entity, $payment);
			$creditAppliedLog = CreditAppliedLog::create($entity, $payment, doubleval($payment->getValue()));
		}
	}
	/**
	 * Update credit status and applied log
	 * 
	 * @param CreditPool $creditpool
	 * @param Order $order
	 * @param Payment $payment
	 */
	public static function UpdateCreditStatusLogByOrder(CreditPool $creditpool, Order $order, Payment $payment)
	{
		if (!$creditpool instanceof CreditPool || !$order instanceof Order || !$payment instanceof Payment)
		{
			return;
		}
		$creditToBePaid = doubleval($payment->getValue());
		// get all credit notes
		$creditNoteStss = CreditNoteStatus::getAllCreditNoteStatus($creditpool);
		foreach($creditNoteStss as $creditNoteSts)
		{
			$creditAmountAvailable = doubleval($creditNoteSts->getCreditAmountAvailable());
			if ($creditAmountAvailable > $creditToBePaid)
			{
				// partially applied
				$creditAmountAvailable = $creditAmountAvailable - $creditToBePaid;
				$creditAmountApplied = $creditToBePaid;
				$creditToBePaid = 0;
				$creditNoteSts->setCreditAmountAvailable($creditAmountAvailable)
					->setStatus(CreditNoteStatus::TYPE_PARTIAL)
					->save();
			}
			else
			{
				// fully applied
				$creditToBePaid = $creditToBePaid - $creditAmountAvailable;
				$creditAmountApplied = $creditAmountAvailable;
				$creditAmountAvailable = 0;
				$creditNoteSts->setCreditAmountAvailable($creditAmountAvailable)
					->setStatus(CreditNoteStatus::TYPE_FULL)
					->save();
			}			
			$creditAppliedLog = CreditAppliedLog::create($creditNoteSts->getCreditNote(), $payment, $creditAmountApplied);		
			if ($creditToBePaid <= 0)
			{
				break;
			}
		}
	}
	
}