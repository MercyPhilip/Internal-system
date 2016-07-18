<?php
class CustomerConnector extends B2BConnector
{
	/**
	 * update customer group info
	 * 
	 * @param customer Id and customer info
	 * 
	 * @return array
	 */
	public function updateCustomer($customerId, $custInfo = array())
	{
		try 
		{
			if ($customerId > 0)
			{
				// update
				$result = $this->_connect()->customerCustomerUpdate($this->_session, $customerId, $custInfo);
			}
		} catch (SoapFault $e) {
			throw new Exception('***warning*** update Customer "' . $customerId . '" info to magento faled. Message from Magento: "' . $e -> getMessage() . '"');
		}
		return $result;
	}
}