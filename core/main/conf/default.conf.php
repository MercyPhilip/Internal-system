<?php
return array(
	'Database' => array(
			'Driver' => 'mysql',
			'DBHost' => 'localhost',
			'DB' => 'umb_backend',
			'Username' => 'root',
			'Password' => ''
		),
	'PriceMatch' => array(
			'Enable' => 0
	),
	'DebugMode' => array(
			'Enable' => 1
	),
	'Acton' => array(
			'Enable' => 0
	),
	'PDFInvoice' => array(
			'LogoUrl' 	  => '/themes/default/images/logo.png'
			,'BankDetail' => array(
					'AccName' => 'NAVTECH SECURITY',
					'Bsb'	  => '633 000',
					'AccNo'  => '132 858 127',
			),
			'CompanyDetail' => array(
					'Name'    => 'Navtech Security Pty Ltd',
					'Addr'    => '67/170 Forster Road, Mt Waverley VIC 3149',
					'Phone'   => '+61 3 8510 7754',
					'Website' => 'www.navtechsecurity.com.au',
					'ABN'	  => '45 783 138 980'
			),
			'TermsCondition' => array(
					'All goods sold by Navtech Security come with guarantees that cannot be excluded under the Australian Consumer Law. All Navtech Security customers are entitled to a replacement or refund for a major failure if the goods fail to be of acceptable quality. You are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable quality and failure does not amount to a major failure.'
					,'All products carry return to base warranty unless otherwise stated. No advance replacement is available. Return shipping and insurance fees are paid by the customer when sending goods back to Navtech Security, unless special discount / arrangement given. Navtech Security will pay shipping fees when sending goods back to the customer.'
					,'Proof of purchase are required for all returns. An online return authorisation must be filed and approved for any products being sent back to Navtech Security. For more information please visit <a href="www.navtechsecurity.com.au/return/">www.navtechsecurity.com.au/return</a>'
					,'A $50 per hour fee may apply if warranty goods are found to be without fault.'
					,'Returns of non faulty items are considered on a case by case basis. A minimum 15% restocking fee applies.'
					,'Above goods remain the property of Navtech Security until payment has been received in full. Until title passes, Navtech Security can retain, repossess and/or resell all goods.'
					,'Are you happy with our service? Please send us your feedback. <a href="mailto:sales@navtechsecurity.com.au">sales@navtechsecurity.com.au</a>'
			)
	),
	'Accounting' => array(
			'GST' => 'EX', // EX - exclude gst, INC - include gst
	),
	'Prefix'	 => array(
			'OrderManual' => 'NTM',
			'Invoice' 	  => 'NTINV',
			'PO'	  	  => 'NTP',
			'Barcode' 	  => 'NTB',
			'CreditNote'  => 'NTC',
	),	
	'Email' => array(
			'Purchasing' => 'purchasing@navtechsecurity.com.au'
	),
);

?>
