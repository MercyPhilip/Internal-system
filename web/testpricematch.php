<?php
require_once 'bootstrap.php';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));
// try {
	
	$where = array(1);
	$params = array();
	$value = array('MSY','CPL','Umart');
	$where[] = 'companyName IN ('.implode(", ", array_fill(0, count($value), "?")).')';
	$params = array_merge($params, $value);
	$companies = PriceMatchCompany::getAllByCriteria(implode(' AND ', $where), $params);
	
	echo 'Companies: ' . join(', ', array_map(create_function('$a', 'return $a->getCompanyName();'), $companies)) . "\n\n";
	
	PriceMatchConnector::runAllProduct($companies,true,true);
	
// 	echo "Hello<br/>";
// 	Dao::beginTransaction();
// 	echo '<pre>';

	
	
// 	$product = Product::get(39739);
// 	$sku = $product->getSku();
// 	$where = array(1);
// 	$params = array();
// 	$value = array(1,3,8);
// 	$where[] = 'id IN ('.implode(", ", array_fill(0, count($value), "?")).')';
// 	$params = array_merge($params, $value);
// // 	Dao::$debug = true;
// 	$companies = PriceMatchCompany::getAllByCriteria(implode(' AND ', $where), $params);
// 	$companies = PriceMatchCompany::getAll();
// // 	Dao::$debug = false;
// // 	var_dump(array_map(create_function('$a', 'return $a->getCompanyName();'), $companies));
// 	echo "--------------------------------------<br/>";
	
	
	
	
// 	$min = PriceMatchMin::create($sku);
// // 	var_dump($min);
// 	$record = PriceMatchRecord::create(PriceMatchCompany::get(1), $min, '12.2');
// 	$record = PriceMatchRecord::create(PriceMatchCompany::get(2), $min, '2.2');
// 	$record = PriceMatchRecord::create(PriceMatchCompany::get(3), $min, '6.2');
	
// 	$min->getMin(array('componieIds'=>array(1,3)));
	
// 	var_dump($record);
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
// 	var_dump(PriceMatchConnector::run($product,$companies));
	
// 	echo '</pre>';
// 	Dao::commitTransaction();
// } catch (Exception $e)
// { 
// // 	Dao::rollbackTransaction();
// 	throw $e;
// }
?>