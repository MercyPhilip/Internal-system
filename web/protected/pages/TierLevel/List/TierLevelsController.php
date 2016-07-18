<?php
/**
 * This is the listing page for Sales Target
*
* @package    Web
* @subpackage Controller
* @author     
*/
class TierLevelsController extends CRUDPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'tierlevel';
	protected $_focusEntity = 'TierLevel';
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
		if(!AccessControl::canAccessUsersPage(Core::getRole()))
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
			$tierLevels = TierLevel::getAll(true, $pageNo, $pageSize, array(), $stats);
			$results['pageStats'] = $stats;
			$results['items'] = array();
			foreach($tierLevels as $item)
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
			$tiername = trim($param->CallbackParameter->item->name);
			$percentage = doubleval(trim($param->CallbackParameter->item->percentage));
			
			if(!$item instanceof $class)
			{
				$item = new $class();
			}
			
			//double check whether the username has been used
			if ($item->getId() != '')
				$levels = $class::getAllByCriteria('name=? and id!=?', array($tiername, $item->getId()), false, 1, 1);
			else
				$levels = $class::getAllByCriteria('name=?', array($tiername), false, 1, 1);
			if(count($levels) > 0)
				throw new Exception('TierName(=' . $tiername . ') has been used, please choose another one!');
					
			$item->setName($tiername)
				->setPercentage($percentage)
				->save();

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

