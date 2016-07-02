<?php
/** SalesTarget Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class SalesTarget extends BaseEntityAbstract
{
	const TYPE_OPEN = 'OPEN';
	const TYPE_CLOSE = 'CLOSED';
	const TYPE_REVENUE_TODAY = 'TODAY';
	const TYPE_REVENUE_UPTODATE = 'UPTODATE';
	
	/**
	 * The start date of sales target period
	 *
	 * @var string
	 */
	private $dfrom = '';
	/**
	 * The end date of sales target period
	 *
	 * @var string
	 */
	private $dto = '';
	/**
	 * The days of sales target period
	 *
	 * @var int
	 */
	private $dperiod = '';
	/**
	 * The revenue of sales target period
	 *
	 * @var double
	 */
	private $targetRevenue;
	/**
	 * The margin of sales target period
	 *
	 * @var double
	 */
	private $targetProfit;
	/**
	 * The user id that the sales target for
	 * for future use
	 * 
	 * @var int
	 */
	private $uid;
	/**
	 * The status of thsi sales target
	 *
	 * @var string
	 */
	private $status;
	/**
	 * Getter for dfrom
	 *
	 * @return string
	 */
	public function getDfrom()
	{
		return $this->dfrom;
	}
	/**
	 * Setter for dfrom
	 *
	 * @param string $value The dfrom
	 *
	 * @return SalesTarget
	 */
	public function setDfrom($value)
	{
		$this->dfrom = $value;
		return $this;
	}
	/**
	 * Getter for dto
	 *
	 * @return string
	 */
	public function getDto()
	{
	    return $this->dto;
	}
	/**
	 * Setter for contactName
	 *
	 * @param string $value The dto
	 *
	 * @return SalesTarget
	 */
	public function setDto($value)
	{
	    $this->dto = $value;
	    return $this;
	}
	/**
	 * Getter for dperiod
	 *
	 * @return int
	 */
	public function getDPeriod()
	{
	    return $this->dperiod;
	}
	/**
	 * Setter for sKey
	 *
	 * @param string $value The dperiod
	 *
	 * @return SalesTarget
	 */
	public function setDPeriod($value)
	{
	    $this->dperiod = $value;
	    return $this;
	}
	/**
	 * Getter for targetrevenue
	 *
	 * @return double
	 */
	public function getTargetRevenue()
	{
	    return $this->targetRevenue;
	}
	/**
	 * Setter for targetrevenue
	 *
	 * @param string $value The targetrevenue
	 *
	 * @return SalesTarget
	 */
	public function setTargetRevenue($value)
	{
	    $this->targetRevenue = $value;
	    return $this;
	}
	/**
	 * Getter for targetProfit
	 *
	 * @return string
	 */
	public function getTargetProfit()
	{
	    return $this->targetProfit;
	}
	/**
	 * Setter for targetProfit
	 *
	 * @param string $value The targetProfit
	 *
	 * @return SalesTarget
	 */
	public function setTargetProfit($value)
	{
	    $this->targetProfit = $value;
	    return $this;
	}
	/**
	 * Getter for status
	 *
	 * @return string
	 */
	public function getStatus()
	{
	    return $this->status;
	}
	/**
	 * Setter for status
	 *
	 * @param string $value The status
	 *
	 * @return SalesTarget
	 */
	public function setStatus($value)
	{
	    $this->status = $value;
	    return $this;
	}
	/**
	 * Getter for uid
	 *
	 * @return int
	 */
	public function getUid()
	{
	    return $this->uid;
	}
	/**
	 * Setter for uid
	 *
	 * @param string $value The uid
	 *
	 * @return SalesTarget
	 */
	public function setUid($value)
	{
	    $this->uid = $value;
	    return $this;
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
			$array['sales'] = trim($this);
		}
		return parent::getJson($array, $reset);
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'stgt');

		DaoMap::setDateType('dfrom','datetime');
		DaoMap::setDateType('dto','datetime');
		DaoMap::setIntType('dperiod','int', 10);
		DaoMap::setIntType('targetrevenue', 'double', '12,4');
		DaoMap::setIntType('targetprofit', 'double', '12,4');
		DaoMap::setIntType('uid','int', 10);
		DaoMap::setStringType('status','varchar', 50);

		parent::__loadDaoMap();

		DaoMap::createIndex('dfrom');
		DaoMap::createIndex('dto');
		DaoMap::createIndex('dperiod');
		DaoMap::createIndex('uid');
		DaoMap::createIndex('status');

		DaoMap::commit();
	}
	/**
	 * Creating a salestarget object
	 *
	 * @param string $dfrom
	 * @param string $dto
	 * @param string $targetrevenue
	 * @param string $targetprofit
	 *
	 * @return SalesTarget
	 */
	public static function create($dfrom, $dto, $targetrevenue, $targetprofit, $uid = 0, $status = SalesTarget::TYPE_OPEN )
	{
		if(trim($dfrom) === '' && trim($dto) === '' && trim($targetrevenue) === '' && trim($targetprofit) === '' )
			return null;
		$dateFrom = date_create($dfrom);
		$dateTo = date_create($dto);
		$diff = date_diff($dateTo,$dateFrom);
		$days = $diff->days + 1;
		
		$obj = new SalesTarget();
		return $obj->setDfrom(trim($dfrom))
			->setDto(trim($dto))
			->setDPeriod($days)
			->setTargetRevenue(doubleval(trim($targetrevenue)))
			->setTargetProfit(doubleval(trim($targetprofit)))
			->setStatus($status)
			->setUid($uid)
			->save();
	}
	/**
	 * Get current info of sales target
	 * 
	 * @return SalesTarget
	 */
	public static function getCurrentSalesTarget()
	{
		try {
			$objs = self::getAllByCriteria("DATE_FORMAT(CONVERT_TZ(NOW(), 'UTC', 'Australia/Victoria'), '%Y-%m-%d') between dfrom and dto", array(), true, 1, 1);
			$salesTarget = ( count($objs) > 0 ? $objs[0] : null );
			return $salesTarget;
		} catch (Exception $e) {
			return null;
		}
	}
	/**
	 * Get current info of sales target
	 *
	 * @param string $type
	 * @return SalesTarget
	 */
	public static function getSalesInfo($type)
	{
		try {
			if ($type === SalesTarget::TYPE_REVENUE_TODAY)
			{
				$sql = "Select * from salesdailylog Where YYYYMMDD = DATE_FORMAT(CONVERT_TZ(NOW(), 'UTC', 'Australia/Victoria'), '%Y-%m-%d')";
				$result = Dao::getResultsNative($sql, array(), PDO::FETCH_ASSOC);
			}
			else if ($type === SalesTarget::TYPE_REVENUE_UPTODATE)
			{
				$salestarget = self::getCurrentSalesTarget();
				if ($salestarget instanceof SalesTarget)
				{
					$startDate = $salestarget->getDfrom();
					$sql = "select  DATE_FORMAT(CONVERT_TZ(NOW(), 'UTC', 'Australia/Victoria'), '%Y-%m') YYYYMM, SUM(totalAmount) totalAmount,
							SUM(totalPaid) totalPaid, SUM(totalCreditNoteValue) totalCreditNoteValue,
							SUM(totalMargin) totalMargin, SUM(totalActualMargin) totalActualMargin
							From salesdailylog Where YYYYMMDD between ? and DATE_FORMAT(CONVERT_TZ(NOW(), 'UTC', 'Australia/Victoria'), '%Y-%m-%d')";
					$result = Dao::getResultsNative($sql, array($startDate), PDO::FETCH_ASSOC);
				}
				else
				{
					$sql = "select  DATE_FORMAT(CONVERT_TZ(NOW(), 'UTC', 'Australia/Victoria'), '%Y-%m') YYYYMM, SUM(totalAmount) totalAmount,
							SUM(totalPaid) totalPaid, SUM(totalCreditNoteValue) totalCreditNoteValue, 
							SUM(totalMargin) totalMargin, SUM(totalActualMargin) totalActualMargin 
							From salesdailylog Where YYYYMMDD between CONCAT(DATE_FORMAT(CONVERT_TZ(NOW(), 'UTC', 'Australia/Victoria'), '%Y-%m'),'-01') and DATE_FORMAT(CONVERT_TZ(NOW(), 'UTC', 'Australia/Victoria'), '%Y-%m-%d')";
					$result = Dao::getResultsNative($sql, array(), PDO::FETCH_ASSOC);
				}
			}
			else
			{
				return array();
			}
			
			if(count($result) === 0)
				return array();
			return $result[0];
		} catch (Exception $e) {
			return array();
		}
	}
	/**
	 * validate the data range
	 * 
	 * @param date $dFrom
	 * @param date $dTo
	 */
	public static function validateDateRange($salestarget, $dFrom, $dTo)
	{
		try
		{
			// check if $dFrom between dfrom and dto
			// or if $dto between dfrom and dto
			// or if $dFrom < dfrom and dto < $dTo
			if ($salestarget instanceof SalesTarget)
			{
				// update existing one
				$sql = '((:dfrom between dfrom and dto) or (:dto between dfrom and dto) or (dfrom >= :dfrom and dto <= :dto))  and id <> :id';
				$params = array(':dfrom' => $dFrom, ':dto' => $dTo, ':id' => $salestarget->getId());
			}
			else
			{
				// new one
				$sql = '((:dfrom between dfrom and dto) or (:dto between dfrom and dto) or (dfrom >= :dfrom and dto <= :dto))';
				$params = array(':dfrom' => $dFrom, ':dto' => $dTo);
			}
			$objs = self::getAllByCriteria($sql, $params, true, 1, 1);
			if (count($objs) > 0)
			{
				// range already exists
				return false;
			}
			return true;
		}
		catch (Exception $ex)
		{
			return false;
		}

	}

}