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
		
		$js = parent::_getEndJs();
		$js .= "pageJs.setPreData(" . json_encode($customer->getJson()) . ")";
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
			$isBlocked = !is_numeric($param->CallbackParameter->id) ? '' : trim($param->CallbackParameter->isBlocked);
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

			if(is_numeric($param->CallbackParameter->id)) {
				$customer = Customer::get(trim($param->CallbackParameter->id));
				if(!$customer instanceof Customer)
					throw new Exception('Invalid Customer passed in!');
				// only admin and accounting can change the isBlocked attribute
				if ((Core::getRole()->getId() != Role::ID_SYSTEM_ADMIN && Core::getRole()->getId() != Role::ID_ACCOUNTING) && ($customer->getIsBlocked() != $isBlocked))
				{
					throw new Exception('You do not have privileges to change isBlocked attribute, please inquire Administrator for support!');
				}
				$customer->setName($name)
					->setEmail($email)
					->setTerms($terms)
					->setIsBlocked($isBlocked)
					->setContactNo($contactNo)
					->setActive($active);
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

			} else {
				if(trim($billingStreet) === '' && trim($billingCity) === '' && trim($billingState) === '' && trim($billingCountry) === '' && trim($billingPostcode) === '' && trim($billingName) === '' && trim($billingContactNo) === '' && trim($billingCompanyName) === '')
					$billingAdressFull = null;
				else
					$billingAdressFull = Address::create($billingStreet, $billingCity, $billingState, $billingCountry, $billingPostcode, $billingName, $billingContactNo, $billingCompanyName);
				if(trim($shippingStreet) === '' && trim($shippingCity) === '' && trim($shippingState) === '' && trim($shippingCountry) === '' && trim($shippingPosecode) === '' && trim($shippingName) === '' && trim($shippingContactNo) === '' && trim($shippingCompanyName) === '')
					$shippingAdressFull = null;
				else
					$shippingAdressFull = Address::create($shippingStreet, $shippingCity, $shippingState, $shippingCountry, $shippingPosecode, $shippingName, $shippingContactNo, $shippingCompanyName);
				$customer = Customer::create($name, $contactNo, $email, $billingAdressFull, false, '', $shippingAdressFull, 0, $terms, $isBlocked);
				if(!$customer instanceof Customer)
					throw new Exception('Error creating customer!');
			}

			$results['url'] = '/customer/' . $customer->getId() . '.html';
			$results['item'] = $customer->getJson();
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
