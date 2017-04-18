<?php
require_once dirname(__FILE__) . '/../bootstrap.php';
ini_set("memory_limit", "-1");
set_time_limit(0);
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT_STORE2));

$sql = 'select pro.id from product pro ' . 'inner join productstockinfo sto on pro.id = sto.productId' . ' where pro.active = 1 and sto.active = 1 and sto.stockOnHand = 0 and sto.storeId = 1 and sto.statusId <> 1 and sto.statusId <> 6 and pro.sellOnWeb = 1 and pro.updated < "2016-03-31 23:59:59"';
$productIds = Dao::getResultsNative($sql);

try
{
	foreach ($productIds as $productId){

		ProductStockInfo::updateByCriteria('statusId = 8', 'productId = ? and active = 1 and storeId = 1', array($productId['id']));
	}
}
catch(Exception $ex)
{
	$errors[] = $ex->getMessage() . $ex->getTraceAsString();
}