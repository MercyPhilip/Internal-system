<?php
require_once dirname(__FILE__) . '/class/ExportAbstract.php';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));
// //run sales export for xero
require_once dirname(__FILE__) . '/class/SalesReverseExport_Xero.php';
//export those invoices which are cancelled
SalesReverseExport_Xero::setStatusIds(array(OrderStatus::ID_CANCELLED));
SalesReverseExport_Xero::run(true);

//export those invoices which are NEW, ONHOLD, ETA, STOCKCHECKED and INSUFFICIENT STOCK
SalesReverseExport_Xero::setStatusIds(array(OrderStatus::ID_NEW, OrderStatus::ID_ON_HOLD, OrderStatus::ID_ETA, OrderStatus::ID_STOCK_CHECKED_BY_PURCHASING, OrderStatus::ID_INSUFFICIENT_STOCK));
SalesReverseExport_Xero::run(true);
