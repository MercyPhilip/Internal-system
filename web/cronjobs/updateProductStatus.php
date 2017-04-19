<?php
require_once dirname(__FILE__) . '/../bootstrap.php';
ini_set("memory_limit", "-1");
set_time_limit(0);
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT_STORE2));
try
{
	$sqlNoStock= 'select pro.id from product pro ' . 'inner join productstockinfo sto on pro.id = sto.productId' . ' where pro.active = 1 and sto.active = 1 and sto.stockOnHand = 0 and sto.storeId = 1 and sto.statusId <> 1 and sto.statusId <> 6';
	$productNoStocks = Dao::getResultsNative($sqlNoStock);

	foreach ($productNoStocks as $product){

		ProductStockInfo::updateByCriteria('statusId = 8', 'productId = ? and active = 1 and storeId = 1', array($product['id']));
		Product::updateByCriteria('updatedById = '. UserAccount::ID_SYSTEM_ACCOUNT_STORE2, 'id = ? and active = 1', array($product['id']));
	}
	
	$sqlMinus= 'select pro.id from product pro ' . 'inner join productstockinfo sto on pro.id = sto.productId' . ' where pro.active = 1 and sto.active = 1 and sto.stockOnHand > 0 and sto.stockOnHand < 5 and sto.storeId = 1 and sto.statusId <> 3 and sto.statusId <> 6';
	$productMinus= Dao::getResultsNative($sqlMinus);
	foreach ($productMinus as $product){

		ProductStockInfo::updateByCriteria('statusId = 3', 'productId = ? and active = 1 and storeId = 1', array($product['id']));
		Product::updateByCriteria('updatedById = '. UserAccount::ID_SYSTEM_ACCOUNT_STORE2, 'id = ? and active = 1', array($product['id']));
	}
	
	$sqlPlus= 'select pro.id from product pro ' . 'inner join productstockinfo sto on pro.id = sto.productId' . ' where pro.active = 1 and sto.active = 1 and sto.stockOnHand > 5 and sto.storeId = 1 and sto.statusId <> 2 and sto.statusId <> 6';
	$productPlus= Dao::getResultsNative($sqlPlus);

	foreach ($productPlus as $product){

		ProductStockInfo::updateByCriteria('statusId = 2', 'productId = ? and active = 1 and storeId = 1', array($product['id']));
		Product::updateByCriteria('updatedById = '. UserAccount::ID_SYSTEM_ACCOUNT_STORE2, 'id = ? and active = 1', array($product['id']));
	}
	
	

}
catch(Exception $ex)
{
	$errors[] = $ex->getMessage() . $ex->getTraceAsString();
}