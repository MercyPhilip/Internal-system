<?php

/**
 * This is the listing page for customer
 * 
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class ListController extends CRUDPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'customer';
	protected $_focusEntity = 'Customer';
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
		foreach (TierLevel::getAll() as $tier)
			$tiers[] = $tier->getJson();
		$js = parent::_getEndJs();
		$js .= "pageJs._bindSearchKey()";
		$js .= '._loadTiers('.json_encode($tiers).')';
		$js .= "._loadChosen()";
		$js .= "._bindMergeCustomersBtn()";
		$js .= ".setCallbackId('deactivateItems', '" . $this->deactivateItemBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('mergeCustomers', '" . $this->mergeBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('integrateActon', '" . $this->integrateActonBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('updateActon', '" . $this->updateActon->getUniqueID() . "')";
		$js .= ".checkboxToggle()";
		$js .= ".setCallbackId('checkActOnEnable', '" . $this->checkActOnEnable->getUniqueID() . "')";
 		if(isset($_REQUEST['cust']) && trim($_REQUEST['cust']) !== '') {
			$js .= ".getResults(true, " . $this->pageSize . ");";
		} 
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
            $class = trim($this->_focusEntity);
            $pageNo = 1;
            $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
            
            if(isset($param->CallbackParameter->pagination))
            {
                $pageNo = $param->CallbackParameter->pagination->pageNo;
                $pageSize = $param->CallbackParameter->pagination->pageSize * 3;
            }
            
            $serachCriteria = isset($param->CallbackParameter->searchCriteria) ? json_decode(json_encode($param->CallbackParameter->searchCriteria), true) : array();

            $where = array(1);
            $params = array();
            foreach($serachCriteria as $field => $value)
            {
            	if((is_array($value) && count($value) === 0) || (is_string($value) && (($value = trim($value)) === '') || is_null($value)))
            		continue;
            	
            	$query = $class::getQuery();
            	switch ($field)
            	{
            		case 'cust.name': 
					{
						$where[] = 'cust.name like ?';
            			$params[] = '%' . $value . '%';
						break;
					}
					case 'cust.email': 
					{
						$where[] =  $field . " = ? ";
						$params[] = $value;
						break;
					}
					case 'cust.description':
					{
						$where[] =  $field . " = ? ";
						$params[] = $value;
						break;
					}
					case 'cust.tier':
					{
						if (count($value) > 0) {
							$where[] = 'cust.tierId in (' . implode(',', $value) . ')';
            	}
						break;
					}
					// Add for grouping customers by philip
					case 'cust.groupCom':
						{
							$where[] =  $field . " = ? ";
							$params[] = is_numeric($value)? $value: '1';
							break;
						}
					case 'cust.groupEdu':
						{
							$where[] =  $field . " = ? ";
							$params[] = is_numeric($value)? $value: '1';
							break;
						}
					case 'cust.groupGame':
						{
							$where[] =  $field . " = ? ";
							$params[] = is_numeric($value)? $value: '1';
							break;
						}
					case 'cust.groupGen':
						{
							$where[] =  $field . " = ? ";
							$params[] = is_numeric($value)? $value: '1';
							break;
						}
					case 'cust.num':
						{
							if($value == 1){
								$flag = 1;
							} elseif ($value == 0){
								$flag = 0;
							} else {
								$flag = 2;
							}
							break;
						}
					// end add
				}
            }
            $stats = array();
            $where[] = 'cust.storeId = ?';
            $params[] = Core::getUser()->getStore()->getId();
            
            $objects = $class::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, array('cust.name' => 'asc'), $stats);

            $results['pageStats'] = $stats;
            $results['items'] = array();
            foreach($objects as $obj) {
                $results['items'][] = $obj->getJson();
            }
            
            $acton = new ActOnConnector();
            $actONEnable = $acton->getEnable();
            
            if($actONEnable == 1){
            	$msgLists = MessageList::getAll();
            	if(count($msgLists) !== 0){
            		$results['items'] = $this->getMessageInfo($results['items'],$flag, $msgLists);
            	}
            }
        }
        catch(Exception $ex)
        {
            $errors[] = $ex->getMessage() . $ex->getTraceAsString();
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
	public function deactivateItems($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$class = trim($this->_focusEntity);
			$id = isset($param->CallbackParameter->item_id) ? $param->CallbackParameter->item_id : array();
			
			$customer = Customer::get($id);
			
			if(!$customer instanceof Customer)
				throw new Exception();
			$customer->setActive(false)
				->save();
			$results['item'] = $customer->getJson();
						
			$acton = new ActOnConnector();
			$actONEnable = $acton->getEnable();
			
			if($actONEnable == 1){
				$msgLists = MessageList::getAll();
				if(count($msgLists) !== 0){
					$data['items'][] = $customer->getJson();
					$data['items'] = $this->getMessageInfo($data['items'], 2, $msgLists);
					$results['item'] = $data['items'][0];
				}
			}
		}
        catch(Exception $ex)
        {
            $errors[] = $ex->getMessage() . $ex->getTraceAsString();
        }
        $param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * merge customers
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 */
	public function mergeCustomers($sender, $param)
	{
		$results = $errors = array();
		try
		{
			Dao::beginTransaction();
			$customers = isset($param->CallbackParameter) && isset($param->CallbackParameter->item) ? $param->CallbackParameter->item : array();
			if (count($customers) > 1)
			{
				// select one as base
				$baseCustomer = $customers[0]->id;
				$baseCustomer = Customer::get($baseCustomer);
				if (!$baseCustomer instanceof Customer)
				{
					throw new Exception('Invalid customer!');
				}
				if ($baseCustomer->getCreditPool() instanceof CreditPool)
				{
					$baseCustomerCredit = $baseCustomer->getCreditPool();
				}
				else
				{
					// create new one
					$baseCustomerCredit = new CreditPool();
					$baseCustomerCredit->setCustomer($baseCustomer)
						->setStore(Core::getUser()->getStore())
						->setTotalCreditLeft(0)->save();
				}
				foreach($customers as $customer)
				{
					$customer = $customer->id;
					$customer = Customer::get($customer);
					if (!$customer instanceof Customer) continue;
					if ($customer->getId() == $baseCustomer->getId()) continue;
					// 1) replace customerId in creditnote, order, rma, task tables
					//$orders = Dao::execSql('update `order` set customerId = :baseCustomerId where customerId = :customerId and active = 1', array('baseCustomerId' => $baseCustomer->getId(), 'customerId' => $customer->getId()));
					$orders = Order::updateByCriteria('customerId = :baseCustomerId', 'customerId = :customerId and active = 1', array('baseCustomerId' => $baseCustomer->getId(), 'customerId' => $customer->getId()));
					//$rmas = Dao::execSql('update `rma` set customerId = :baseCustomerId where customerId = :customerId and active = 1',  array('baseCustomerId' => $baseCustomer->getId(), 'customerId' => $customer->getId()));
					$rmas = RMA::updateByCriteria('customerId = :baseCustomerId', 'customerId = :customerId and active = 1', array('baseCustomerId' => $baseCustomer->getId(), 'customerId' => $customer->getId()));
					//$tasks = Dao::execSql('update `task` set customerId = :baseCustomerId where customerId = :customerId and active = 1',  array('baseCustomerId' => $baseCustomer->getId(), 'customerId' => $customer->getId()));
					$tasks = Task::updateByCriteria('customerId = :baseCustomerId', 'customerId = :customerId and active = 1', array('baseCustomerId' => $baseCustomer->getId(), 'customerId' => $customer->getId()));
					//$creditnotes = Dao::execSql('update `creditnote` set customerId = :baseCustomerId where customerId = :customerId and active = 1',  array('baseCustomerId' => $baseCustomer->getId(), 'customerId' => $customer->getId()));
					$creditnotes = CreditNote::updateByCriteria('customerId = :baseCustomerId', 'customerId = :customerId and active = 1', array('baseCustomerId' => $baseCustomer->getId(), 'customerId' => $customer->getId()));
					// 2) merge credit to one customer and delete the others
					$customerCreditPool =  $customer->getCreditPool();
					if ($customerCreditPool instanceof CreditPool)
					{
						$credits = $customerCreditPool->getTotalCreditLeft();
						$baseCustomerCredit->setTotalCreditLeft($credits)->save();
						$customerCreditPool->setActive(false)->save();
					}
					
					// 3) deactivate the customer in customer table
					$customer->setActive(false)->save();
				}
			}
			Dao::commitTransaction();
		}
		catch(Exception $ex)
		{
			Dao::rollbackTransaction();
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	
	}
	
	/**
	 * Integrate customers to Act-On
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function integrateActon($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$pageNo = 1;
			$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
			$class = trim($this->_focusEntity);
			$serachCriteria = isset($param->CallbackParameter) ? json_decode(json_encode($param->CallbackParameter), true) : array();
			$stats = array();
			$where = array(1);
			$params = array();
			$noSearch = true;
			
			$lists = array();

			foreach($serachCriteria as $field => $value)
			{
				if((is_array($value) && count($value) === 0) || (is_string($value) && (($value = trim($value)) === '') || is_null($value)))
					continue;
					$query = $class::getQuery();
					
					switch ($field)
					{
						case 'cust.name': 
						{
							$where[] = 'cust.name like ?';
	            			$params[] = '%' . $value . '%';
							break;
						}
						case 'cust.email': 
						{
							$where[] =  $field . " = ? ";
							$params[] = $value;
							break;
						}
						case 'cust.description':
						{
							$where[] =  $field . " = ? ";
							$params[] = $value;
							break;
						}
						case 'cust.tier':
						{
							if (count($value) > 0) {
								$where[] = 'cust.tierId in (' . implode(',', $value) . ')';
	            			}
							break;
						}
						case 'cust.groupCom':
							{
								$where[] =  $field . " = ? ";
								$params[] = is_numeric($value)? $value: '1';
								$lists[] = 'Commercial';
								break;
							}
						case 'cust.groupEdu':
							{
								$where[] =  $field . " = ? ";
								$params[] = is_numeric($value)? $value: '1';
								$lists[] = 'Educational';
								break;
							}
						case 'cust.groupGame':
							{
								$where[] =  $field . " = ? ";
								$params[] = is_numeric($value)? $value: '1';
								$lists[] = 'Gaming';
								break;
							}
						case 'cust.groupGen':
							{
								$where[] =  $field . " = ? ";
								$params[] = is_numeric($value)? $value: '1';
								$lists[] = 'General';
								break;
							}
						case 'cust.num':
							{	
								if($value == 1){
									$flag = 1;
								} elseif($value == 0) {
									$flag = 0;
								} else {
									$flag = 2;
								}
								break;
							}
					}
					$noSearch = false;
			}
			$where[] = 'cust.storeId = ?';
			$params[] = Core::getUser()->getStore()->getId();
			$objects = $class::getAllByCriteria(implode(' AND ', $where), $params, false, null, DaoQuery::DEFAUTL_PAGE_SIZE, array('cust.name' => 'asc'), $stats);

			foreach($objects as $obj) {
				$arr['items'][] = $obj->getJson();
			}
			
			if(count($objects) === 0)
				throw new Exception('No result found!');
			
			if($flag !== 2){		
				$msgLists = MessageList::getAll();
				if(count($msgLists) !== 0){
					$arr['items'] = $this->getMessageInfo($arr['items'], $flag, $msgLists);		
				}
			}

			if(count($arr['items']) > 5000)
				throw new Exception('Too many rows are found, please narrow down your search criteria! rows:' . count($objects));
				if (!($asset = $this->_getExcel($arr['items'])) instanceof Asset)

					throw new Exception('Failed to create a excel file');
								
			// Get token from file then create list in Act-On	
			$accessTokenFile = '/tmp/access_token.txt';
			if (file_exists($accessTokenFile) && ( (time() - filemtime($accessTokenFile)) < 3000 )){
				$access_token = trim(file_get_contents($accessTokenFile));
			} else {
				$access_token = ActOnConnector::getToken();
			}

			$fileName = $asset->getPath();
			
			$countList = count($lists);
			if($countList > 1) {
				$listname = $lists[0];
				for($i = 1; $i< $countList; $i++) {
					$listname .= '/' . $lists[$i];
				}
			} else {
				$listname = $lists[0];
			}
			
 			$results = ActOnConnector::createList($access_token, $fileName, $listname);	

 			if(array_key_exists('errorCode', $results)){
 				// errorCode 10056 means list already exists
 				if($results['errorCode'] == 10056){

					$results['filename'] = $fileName;
					$results['listname'] = $listname;

 				}
 			}
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * @return message info
	 */
/* 	public static function getMessageInfo($arr, $flag, $msgLists)
	{
		foreach ($msgLists as $msgList){
			$msgInfos[] = ['id' => $msgList->getId(), 'title' => $msgList->getTitle()];
		}

		foreach ($arr as $keyCust => &$valueCust){
			$n = 0;
			$resFlag = 0;
			foreach ($msgInfos as $msgInfo){
				 
				$cust_msgs = CustomerMsg::getAllByCriteria('customerId = ? and msgListId = ?', array($valueCust['id'], $msgInfo['id']));
	
				if(count($cust_msgs) !== 0){
	
					$valueCust['message'][] = ['title' => $msgInfo['title'], 'opened' => $cust_msgs[0]->getOpened(), 'clicked' => $cust_msgs[0]->getClicked(),'nameOpen' => 'OPENED', 'nameClick' => 'CLICKED'];
					$resFlag = 1;
				} else {
	
					$valueCust['message'][] = ['title' => $msgInfo['title'], 'opened' => 0, 'clicked' => 0, 'nameOpen' => 'OPENED', 'nameClick' => 'CLICKED'];
				}
				$n++;
			}
			$valueCust['messageNum'] = $n;
			if($flag == 0 && $resFlag == 1){
				unset($arr[$keyCust]);
			} elseif ($flag == 1 && $resFlag == 0){
				unset($arr[$keyCust]);
			}
		}
		
		$arrResult = array_values($arr);

		return $arrResult;
	} */
	
	/**
	 * @return PHPExcel
	 */
	private function _getExcel($arrs)
	{
		$phpexcel= new PHPExcel();
		$activeSheet = $phpexcel->setActiveSheetIndex(0);
		$columnNo = 0;
		$rowNo = 1; // excel start at 1 NOT 0
		// header row
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Name');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Email');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Contact No');
 		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Company');
 		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Street');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'City');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'State');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Post Code');
		$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, 'Country');  
		// data row
		foreach($arrs as $arr)
		{
			$rowNo++;
			$columnNo = 0; // excel start at 1 NOT 0
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $arr['name']); //Name
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $arr['email']); //Email
			$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $arr['contactNo']); //Contact No
			
 			$billingAddress = $arr['address']['billing'];
			if(count($billingAddress) !== 0){
				
				$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $billingAddress['companyName']); //Company
 				$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $billingAddress['street']); //Street
				$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $billingAddress['city']); //City
				$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $billingAddress['region']); //State
				$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $billingAddress['postCode']); //Post Code
				$activeSheet->setCellValueByColumnAndRow($columnNo++ , $rowNo, $billingAddress['country']); //Country 
			} 
		}
		// Set document properties
		$now = UDate::now();
		$objWriter = new PHPExcel_Writer_CSV($phpexcel);
		$filePath = '/tmp/' . md5($now);
		$objWriter->save($filePath);
		$fileName = 'Customer_' . str_replace(':', '_', str_replace('-', '_', str_replace(' ', '_', $now->setTimeZone(SystemSettings::getSettings(SystemSettings::TYPE_SYSTEM_TIMEZONE))))) . '.csv';
		$asset = Asset::registerAsset($fileName, file_get_contents($filePath), Asset::TYPE_TMP);
		return $asset;
	}	
	
	/**
	 * Update customers list in Act-On
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function updateActon($sender, $param)
	{
		$results = $errors = array();
		try {	
			$acctoken_file = '/tmp/access_token.txt';
			$access_token = '';
			if (file_exists($acctoken_file)){
				$access_token = trim(file_get_contents($acctoken_file));
			}
			$fileName = isset($param->CallbackParameter) && isset($param->CallbackParameter->filename) ? $param->CallbackParameter->filename : array();
			$listName = isset($param->CallbackParameter) && isset($param->CallbackParameter->listname) ? $param->CallbackParameter->listname : array();
			$listId = ActOnConnector::getList($access_token, $listName);
	
			$results = ActOnConnector::updateList($access_token, $fileName, $listId);

		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * Check Act-On function enable or not
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */	
	public function checkActOnEnable($sender, $param) {
		$results = $errors = array();
		try {
			$acton = new ActOnConnector();
			$results['enable'] = $acton->getEnable();
			}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
/* 		if(!isset($param)){
			$param = new stdClass();
		} */
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	
}
?>