<?php
/** StockTake Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     
 */
class StockTake extends BaseEntityAbstract
{
	/**
	 * The PreferredLocation
	 *
	 * @var PreferredLocation
	 */
	protected $preferredlocation;
	/**
	 * The quantity
	 *
	 * @var quantity
	 */
	private $qty;
	/**
	 * Getter for product
	 *
	 * @return
	 */
	public function getPreferredLocation()
	{
		$this->loadManyToOne('preferredlocation');
		return $this->preferredlocation;
	}
	/**
	 * Setter for product
	 *
	 * @param PreferredLocation $value The product
	 *
	 * @return StockTake
	 */
	public function setPreferredLocation(PreferredLocation $value)
	{
		$this->preferredlocation = $value;
		return $this;
	}
	/**
	 * Getter for qty
	 *
	 * @return
	 */
	public function getQty()
	{
		return $this->qty;
	}
	/**
	 * Setter for qty
	 *
	 * @param $value The qty
	 *
	 * @return StockTake
	 */
	public function setQty($value)
	{
		$this->qty = $value;
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::getJson()
	 */
	public function getJson($extra = array(), $reset = false)
	{
		try {
			$array = $extra;
			if(!$this->isJsonLoaded($reset))
			{
				$array['location'] = $this->getPreferredLocation() instanceof PreferredLocation ? $this->getPreferredLocation()->getJson() : null;
			}
		}
		catch (Exception $ex)
		{
			throw new Exception(' ********** getJson exception :' .   $ex->getMessage());
		}
		return parent::getJson($array, $reset);
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'prost');
		DaoMap::setManyToOne('preferredlocation', 'PreferredLocation', 'prost_pre');
		DaoMap::setIntType('qty', 'int', 10, false);
		DaoMap::setManyToOne('store', 'Store', 'si');
		parent::__loadDaoMap();

		DaoMap::createIndex('preferredlocation');
		DaoMap::createIndex('qty');

		DaoMap::commit();
	}
	/**
	 * Creating a stocktake object
	 *
	 * @param PreferredLocation $preferredLocation
	 *
	 * @return StockTake
	 */
	public static function create($preferredLocation, $qty)
	{
		if (!$preferredLocation instanceof PreferredLocation) return null;
		
		$stockTake = self::getAllByCriteria('preferredLocationId = ? ', array(trim($preferredLocation->getId())), true, 1, 1);
		if (count($stockTake) == 0)
			$obj = new StockTake();
		else
			$obj = $stockTake[0];
		$originalQty = $obj->getQty();
		
		return $obj->setPreferredLocation($preferredLocation)
		->setQty(intval($qty))
		->setStore(Core::getUser()->getStore())
		->save()
		->addLog('StockTake(' . $originalQty . ' => ' . $qty . '), location[' . $preferredLocation->getLocation()->getName(). '] by [' . Core::getUser()->getUserName() . ']', Log::TYPE_SYSTEM, 'STOCKTAKE_QTY_CHG', __CLASS__ . '::' . __FUNCTION__);
	}
	/**
	 * Getting the quantity via product
	 *
	 * @param string $product The product
	 *
	 * @return null|StockTake
	 */
	public static function getQuantity($locations)
	{
		$ret = array();
		$locationArray = array();
		foreach($locations as $location)
		{
			$locationArray = $location;

			$obj = self::getAllByCriteria('preferredlocationId = ? and storeId = ? ', array(trim($location['id']), Core::getUser()->getStore()->getId()), true, 1, 1);
			if (count($obj) === 0)
				$locationArray['counting'] = 0;
			else
				$locationArray['counting'] = $obj[0]->getQty();
			$ret[] = $locationArray;
		}
		return $ret;
	}
	/**
	 * Getting the quantity via product
	 *
	 * @param string $product The product
	 *
	 * @return null|StockTake
	 */
	public static function getTotalCounting($locations)
	{
		$ret = array();
		$locationArray = array();
		//get location Ids
		$locationIds = array();
		foreach($locations as $location)
		{
			if(isset($location->id))
				$locationIds[] = trim($location->id);
		}
		$sql = 'select SUM(qty) totalcounting from stocktake where active = 1 and storeId= ' . Core::getUser()->getStore()->getId(). ' and preferredlocationId in (' . implode(',', $locationIds)  . ')';
		$result = Dao::getResultsNative($sql, array(), PDO::FETCH_ASSOC);
		if(count($result) === 0)
			return 0;
		else
			return $result[0]['totalcounting'];
	}

}