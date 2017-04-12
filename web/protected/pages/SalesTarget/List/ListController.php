<?php
/**
 * This is the listing page for Sales Target
*
* @package    Web
* @subpackage Controller
* @author     
*/
class ListController extends CRUDPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'salestarget';
	protected $_focusEntity = 'SalesTarget';
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
		if(!AccessControl::canAccessProductsPage(Core::getRole()))
			die('You do NOT have access to this page');
	}
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .= "pageJs";
		$js .= "._bindSearchKey()";
		$js .= ".getResults(true, " . $this->pageSize . ");";
		return $js;
	}
	/**
	 * Getting the items
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function getItems($sender, $param)
	{
		$results = $errors = array();
		try
		{
			if(!isset($param->CallbackParameter->searchCriteria) || ($serachCriteria = trim($param->CallbackParameter->searchCriteria)) === '')
				$serachCriteria = '';
			
			$pageNo = 1;
			$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
			if(isset($param->CallbackParameter->pagination))
			{
				$pageNo = $param->CallbackParameter->pagination->pageNo;
				$pageSize = $param->CallbackParameter->pagination->pageSize;
			}
			
			$stats = array();
			$where[] = 'stgt.storeId = ?';
			$params[] = Core::getUser()->getStore()->getId();
			$salestargets = SalesTarget::getAllByCriteria(implode(' AND ', $where), $params, true, $pageNo, $pageSize, array(), $stats);
			$results['pageStats'] = $stats;
			$results['items'] = array();
			foreach($salestargets as $item)
				$results['items'][] = $item->getJson();
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * save the items
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function saveItem($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$class = trim($this->_focusEntity);
			if(!isset($param->CallbackParameter->item))
				throw new Exception("System Error: no item information passed in!");
			$item = (isset($param->CallbackParameter->item->id) && ($item = $class::get($param->CallbackParameter->item->id)) instanceof $class) ? $item : null;
			$dfrom = trim($param->CallbackParameter->item->dfrom);
			$dto = trim($param->CallbackParameter->item->dto);
			$targetrevenue = trim($param->CallbackParameter->item->targetrevenue);
			$targetprofit = trim($param->CallbackParameter->item->targetprofit);
			$search = array('$', ',');
			$replace = array();
			$targetrevenue = doubleval(str_replace($search, $replace, $targetrevenue));
			$targetprofit = doubleval(str_replace($search, $replace, $targetprofit));
			$dateFrom = date_create($dfrom);
			$dateTo = date_create($dto);
			$diff = date_diff($dateTo, $dateFrom);
			$days = $diff->days + 1;
			if($item instanceof $class)
			{
				$isValid = SalesTarget::validateDateRange($item, $dfrom, $dto);
				if (!$isValid)
				{
					throw new Exception("The date range you input overlaps with the existing ones!");
				}
				$item->setDfrom($dfrom)
					->setDto($dto)
					->setDPeriod($days)
					->setTargetRevenue(doubleval(trim($targetrevenue)))
					->setTargetProfit(doubleval(trim($targetprofit)))
					->setStore(Core::getUser()->getStore())
					->save();
			}
			else
			{
				$isValid = SalesTarget::validateDateRange(null, $dfrom, $dto);
				if (!$isValid)
				{
					throw new Exception("The date range you input overlaps with the existing ones!");
				}
				$item = $class::create($dfrom, $dto, $targetrevenue, $targetprofit);
			}
			$results['item'] = $item->getJson();
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * delete the items
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function deleteItems($sender, $param)
	{
		
		$results = $errors = array();
		try
		{
			$class = trim($this->_focusEntity);
			$ids = isset($param->CallbackParameter->ids) ? $param->CallbackParameter->ids : array();
			if(count($ids) > 0)
			{
				$item = $class::get($ids[0]);
				if($item instanceof $class)
				{
					$item->setActive(false)
					->save();
				}
			}
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
}
?>

