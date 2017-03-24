<?php
require_once dirname(__FILE__) . '/../../../bootstrap.php';
ini_set("memory_limit", "-1");
set_time_limit(0);
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

$fileName = '/home/tlan16/Desktop/email lists.csv';

$text = file_get_contents($fileName);
$emails = explode(" ", $text);

try
{
	foreach ($emails as $email){
// 		Config::dd($email);
		Customer::updateByCriteria('groupGame = 1', 'email = ? and active = ?', array(trim($email),1));
	}
}
catch(Exception $ex)
{
	$errors[] = $ex->getMessage() . $ex->getTraceAsString();
}