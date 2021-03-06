<?php
/**
 * This is the Product details page
 *
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class DetailsController extends DetailsPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'customer.details';
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$_focusEntityName
	 */
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
	 * Getting The end javascript
	 *
	 * @return string
	 */
	protected function _getEndJs()
	{
		if(!isset($this->Request['id']))
			die('System ERR: no param passed in!');
		if(trim($this->Request['id']) === 'new') {
			$customer = new Customer();
			$customer->setBillingAddress(new Address());
			$customer->setShippingAddress(new Address());
		}
		else if(!($customer = Customer::get($this->Request['id'])) instanceof Customer)
			die('Invalid Customer!');
		
		foreach (TierLevel::getAll() as $tier)
			$tiers[] = $tier->getJson();
		$js = parent::_getEndJs();
		$js .= "pageJs.setPreData(" . json_encode($customer->getJson()) . ',' . json_encode($tiers) . ")";
		$js .= ".load()";
		$js .= ".bindAllEventNObjects()";
		$js .= "._bindSaveKey();";
		return $js;
	}
	/**
	 * (non-PHPdoc)
	 * @see DetailsPageAbstract::saveItem()
	 */
	public function saveItem($sender, $param)
	{

		$results = $errors = array();
		try
		{
			Dao::beginTransaction();
			
			$name = trim($param->CallbackParameter->name);
			$id = !is_numeric($param->CallbackParameter->id) ? '' : trim($param->CallbackParameter->id);
			$active = !is_numeric($param->CallbackParameter->id) ? '' : trim($param->CallbackParameter->active);
			$email = trim($param->CallbackParameter->email);
			$terms = intval(trim($param->CallbackParameter->terms));
			$tierLevel = intval(trim($param->CallbackParameter->tier));
			$isBlocked = !is_numeric($param->CallbackParameter->id) ? '' : trim($param->CallbackParameter->isBlocked);
			// Add for grouping customers by philip
			if (Config::get('Acton', 'Enable') == 1){
				$groupCom = !is_numeric($param->CallbackParameter->id) ? '' : trim($param->CallbackParameter->groupCom);
				$groupEdu = !is_numeric($param->CallbackParameter->id) ? '' : trim($param->CallbackParameter->groupEdu);
				$groupGame = !is_numeric($param->CallbackParameter->id) ? '' : trim($param->CallbackParameter->groupGame);
			
				if ($groupCom == 1 || $groupEdu == 1 || $groupGame == 1) {
					$groupGen = !is_numeric($param->CallbackParameter->id) ? '' : '0';
				} else {
					$groupGen = !is_numeric($param->CallbackParameter->id) ? '' : 0;
				}
			}
			// end add
			$creditLeft = !intval($param->CallbackParameter->credit) ? '' : trim($param->CallbackParameter->credit);
			if(($creditLeft = StringUtilsAbstract::getValueFromCurrency(trim($param->CallbackParameter->credit))) === '' || !is_numeric($creditLeft))
			{
				$creditLeft = 0;
			}
					
			$contactNo = trim($param->CallbackParameter->contactNo);
			$billingCompanyName = trim($param->CallbackParameter->billingCompanyName);
			$billingName = trim($param->CallbackParameter->billingName);
			$billingContactNo = trim($param->CallbackParameter->billingContactNo);
			$billingStreet = trim($param->CallbackParameter->billingStreet);
			$billingCity = trim($param->CallbackParameter->billingCity);
			$billingState = trim($param->CallbackParameter->billingState);
			$billingCountry = trim($param->CallbackParameter->billingCountry);
			$billingPostcode = trim($param->CallbackParameter->billingPosecode);
			$shippingCompanyName = trim($param->CallbackParameter->shippingCompanyName);
			$shippingName = trim($param->CallbackParameter->shippingName);
			$shippingContactNo = trim($param->CallbackParameter->shippingContactNo);
			$shippingStreet = trim($param->CallbackParameter->shippingStreet);
			$shippingCity = trim($param->CallbackParameter->shippingCity);
			$shippingState = trim($param->CallbackParameter->shippingState);
			$shippingCountry = trim($param->CallbackParameter->shippingCountry);
			$shippingPosecode = trim($param->CallbackParameter->shippingPosecode);
			$tier = TierLevel::get(trim($tierLevel));
			if (!$tier instanceof TierLevel)
				throw new Exception('Invalid Tier Level passed in!');
			if(is_numeric($param->CallbackParameter->id)) {
				$customer = Customer::get(trim($param->CallbackParameter->id));
				if(!$customer instanceof Customer)
					throw new Exception('Invalid Customer passed in!');
				// only admin and accounting can change the isBlocked attribute
				if ((($tier->getId() == TierLevel::ID_TIER_0 || $customer->getTier()->getId() == TierLevel::ID_TIER_0)) && Core::getRole()->getId() != Role::ID_SYSTEM_ADMIN)
				{
					throw new Exception('You do not have privileges to create or change tier 0 customer, please inquire Administrator for support!');
				}
				if ((Core::getRole()->getId() != Role::ID_SYSTEM_ADMIN && Core::getRole()->getId() != Role::ID_ACCOUNTING) && ($customer->getIsBlocked() != $isBlocked))
				{
					throw new Exception('You do not have privileges to change isBlocked attribute, please inquire Administrator for support!');
				}
				// only admin and accounting can update credit
				if ((Core::getRole()->getId() != Role::ID_SYSTEM_ADMIN && Core::getRole()->getId() != Role::ID_ACCOUNTING))
				{
					$creditPool = $customer->getCreditPool();
					if (((!$creditPool instanceof CreditPool) && ($creditLeft != 0)) 
							|| (($creditPool instanceof CreditPool) && (doubleval($creditLeft) != doubleval($creditPool->getTotalCreditLeft()))))
					{
						throw new Exception('You do not have privileges to change credit attribute, please inquire Administrator for support!');
					}
				}
				else
				{
					$creditPool = $customer->getCreditPool();
					if ((!$creditPool instanceof CreditPool) && $creditLeft != 0)
					{
						$creditPool = new CreditPool();
						$creditPool->setCustomer($customer)
							->setStore(Core::getUser()->getStore())
							->updateTotalCreditLeft($creditLeft)
							->save()
							->addLog('credit created by ' . Core::getUser()->getUserName() . '($0.00' . ' => ' . StringUtilsAbstract::getCurrency($creditPool->getTotalCreditLeft()) . ')', Log::TYPE_SYSTEM, 'CREDIT_CHG', __CLASS__ . '::' . __FUNCTION__);
					}
					else if ($creditPool instanceof CreditPool && $creditLeft != $creditPool->getTotalCreditLeft())
					{
						$origCredt = $creditPool->getTotalCreditLeft();
						$creditPool->updateTotalCreditLeft($creditLeft)
							->save()
							->addLog('credit changed by ' . Core::getUser()->getUserName() . '(' . StringUtilsAbstract::getCurrency($origCredt) . ' => ' . StringUtilsAbstract::getCurrency($creditPool->getTotalCreditLeft()) . ')', Log::TYPE_SYSTEM, 'CREDIT_CHG', __CLASS__ . '::' . __FUNCTION__);
					}
				}
				$oldTierId = $customer->getTier()->getId();
				$customer->setName($name)
					->setEmail($email)
					->setTerms($terms)
					->setTier($tier)
					->setIsBlocked($isBlocked)
					->setContactNo($contactNo)
					->setActive($active);
				// Add for grouping customers by philip
				if (Config::get('Acton', 'Enable') == 1){
					$customer->setGroupGen($groupGen)
						->setGroupCom($groupCom)
						->setGroupEdu($groupEdu)
						->setGroupGame($groupGame);
				}
				// end add
				$billingAddress = $customer->getBillingAddress();
				if($billingAddress instanceof Address) {
					$billingAddress->setStreet($billingStreet)
						->setCity($billingCity)
						->setRegion($billingState)
						->setCountry($billingCountry)
						->setPostCode($billingPostcode)
						->setContactName($billingName)
						->setContactNo($billingContactNo)
						->setCompanyName($billingCompanyName)
						->save();
				} else if(trim($billingStreet) !== '' || trim($billingCity) !== '' || trim($billingState) !== '' || trim($billingCountry) !== '' || trim($billingPostcode) !== '' || trim($billingName) !== '' || trim($billingContactNo) !== '' || trim($billingCompanyName) !== '') {
					$customer->setBillingAddress(Address::create($billingStreet, $billingCity, $billingState, $billingCountry, $billingPostcode, $billingName, $billingContactNo, $billingCompanyName));
				}
				$shippingAddress = $customer->getShippingAddress();
				if($shippingAddress instanceof Address && $billingAddress instanceof Address && $shippingAddress->getId() !== $billingAddress->getId()) {
					$shippingAddress->setStreet($shippingStreet)
						->setCity($shippingCity)
						->setRegion($shippingState)
						->setCountry($shippingCountry)
						->setPostCode($shippingPosecode)
						->setContactName($shippingName)
						->setContactNo($shippingContactNo)
						->setCompanyName($shippingCompanyName)
						->save();
				} else if(trim($shippingStreet) !== '' || trim($shippingCity) !== '' || trim($shippingState) !== '' || trim($shippingCountry) !== '' || trim($shippingPosecode) !== '' || trim($shippingName) !== '' || trim($shippingContactNo) !== '' || trim($shippingCompanyName) !== '') {
					$customer->setShippingAddress(Address::create($shippingStreet, $shippingCity, $shippingState, $shippingCountry, $shippingPosecode, $shippingName, $shippingContactNo, $shippingCompanyName));
				}
				$customer->save();
				if ($oldTierId != $tierLevel)
				{
					$custInfo = array();
					if (($customer->getMageId() > 0) && $tierLevel != 0)
					{
						//need to update magento customer info
						$connector = CustomerConnector::getConnector(B2BConnector::CONNECTOR_TYPE_CUSTOMER,
								SystemSettings::getSettings(SystemSettings::TYPE_B2B_SOAP_WSDL),
								SystemSettings::getSettings(SystemSettings::TYPE_B2B_SOAP_USER),
								SystemSettings::getSettings(SystemSettings::TYPE_B2B_SOAP_KEY));
						// update
						$custInfo = array('group_id' => $tierLevel);
						$result = $connector->updateCustomer($customer->getMageId(), $custInfo);
						if (!$result)
							throw new Exception('***warning*** update Customer "' . $customerId . '" info to magento faled. Message from Magento: "' . $e -> getMessage() . '"');
					}
				}
			} else {
				// only admin and accounting can change the isBlocked attribute
				if (($tier->getId() == TierLevel::ID_TIER_0) && (Core::getRole()->getId() != Role::ID_SYSTEM_ADMIN))
				{
					throw new Exception('You do not have privileges to create or change tier 0 customer, please inquire Administrator for support!');
				}
				if(trim($billingStreet) === '' && trim($billingCity) === '' && trim($billingState) === '' && trim($billingCountry) === '' && trim($billingPostcode) === '' && trim($billingName) === '' && trim($billingContactNo) === '' && trim($billingCompanyName) === '')
					$billingAdressFull = null;
				else
					$billingAdressFull = Address::create($billingStreet, $billingCity, $billingState, $billingCountry, $billingPostcode, $billingName, $billingContactNo, $billingCompanyName);
				if(trim($shippingStreet) === '' && trim($shippingCity) === '' && trim($shippingState) === '' && trim($shippingCountry) === '' && trim($shippingPosecode) === '' && trim($shippingName) === '' && trim($shippingContactNo) === '' && trim($shippingCompanyName) === '')
					$shippingAdressFull = null;
				else
					$shippingAdressFull = Address::create($shippingStreet, $shippingCity, $shippingState, $shippingCountry, $shippingPosecode, $shippingName, $shippingContactNo, $shippingCompanyName);
				if (Config::get('Acton', 'Enable') == 1){
					$customer = Customer::create($name, $contactNo, $email, $billingAdressFull, false, '', $shippingAdressFull, 0, $terms, $isBlocked, $tierLevel, $groupCom, $groupEdu, $groupGame. $groupGen);
				}else{
					$customer = Customer::create($name, $contactNo, $email, $billingAdressFull, false, '', $shippingAdressFull, 0, $terms, $isBlocked, $tierLevel);
				}
				if(!$customer instanceof Customer)
					throw new Exception('Error creating customer!');
			}

			$results['url'] = '/customer/' . $customer->getId() . '.html';
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
			
			Dao::commitTransaction();
		}
		catch(Exception $ex)
		{
			Dao::rollbackTransaction();
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
}
?>