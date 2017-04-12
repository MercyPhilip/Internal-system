<?php
require_once dirname(__FILE__) . '/class/ExportAbstract.php';
require_once dirname(__FILE__) . '/class/SalesExport_Xero.php';
require_once dirname(__FILE__) . '/class/CreditNoteExport_Xero.php';
require_once dirname(__FILE__) . '/class/BillExport_Xero.php';
require_once dirname(__FILE__) . '/class/ManualJournalExport_Xero.php';
require_once dirname(__FILE__) . '/class/ItemExport_Magento.php';
require_once dirname(__FILE__) . '/class/PaymentExport_Xero.php';
// for store1
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT_STORE1));
//run sales export for xero
SalesExport_Xero::run(true);

//run creditnote for xero
CreditNoteExport_Xero::run(true);

//run bill export for xero
BillExport_Xero::run(true);

//run ManualJournalExport_Xero export for xero
ManualJournalExport_Xero::run(true);
//run item list export for xero
ItemExport_Magento::run(true);

//run payment export for xero
PaymentExport_Xero::run(true);

//run open invoice export
OpenInvoiceExport::run(true);

// for store2
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT_STORE2));
//run sales export for xero
SalesExport_Xero::run(true);
//run creditnote for xero
CreditNoteExport_Xero::run(true);
//run bill export for xero
BillExport_Xero::run(true);
//run ManualJournalExport_Xero export for xero
ManualJournalExport_Xero::run(true);

//run item list export for xero
ItemExport_Magento::run(true);

//run payment export for xero
PaymentExport_Xero::run(true);

//run open invoice export
OpenInvoiceExport::run(true);