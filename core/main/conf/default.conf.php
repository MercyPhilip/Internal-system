<?php
return array(
	'Database' => array(
			'Driver' => 'mysql',
			'DBHost' => 'localhost',
			'DB' => 'bpcinternal_multistore',
			'Username' => 'root',
			'Password' => 'root'
		),
	'PriceMatch' => array(
			'Enable' => 1
	),
	'DebugMode' => array(
			'Enable' => 1
	),
	'Acton' => array(
			'Enable' => 0
	),
	'PDFInvoice' => array(
			'LogoUrl' 	  => 'http://nav-demo.budgetpc.com.au/skin/frontend/base/default/../../../../../media/wysiwyg/logo/Navtech-2-Col-Logo-Sml.jpg'
			,'BankDetail' => array(
					'AccName' => 'NavTech',
					'Bsb'	  => '123456',
					'AccNo'  => '123456789',
			),
			'CompanyDetail' => array(
					'Name'    => 'NavTech',
					'Addr'    => 'Unit xxx, 45 Gilby Rd, Mt Waverley',
					'Phone'   => '12345678',
					'Website' => 'nav-demo.budgetpc.com.au',
					'ABN'	  => '12 345 678 901'
			),
			'TermsCondition' => array(
					'All goods sold by NavTech Security come with guarantees that cannot be excluded under the Australian Consumer Law. All NavTech Security customers are entitled to a replacement or refund for a major failure if the goods fail to be of acceptable quality. You are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable quality and failure does not amount to a major failure.'
					,'All products carry return to base warranty unless otherwise stated. No advance replacement is available. Return shipping and insurance fees are paid by the customer when sending goods back to NavTech Security, unless special discount / arrangement given. NavTech Security will pay shipping fees when sending goods back to the customer.'
					,'Proof of purchase are required for all returns. An online return authorisation must be filed and approved for any products being sent back to NavTech Security. For more information please visit <a href="http://nav-demo.budgetpc.com.au/return/">nav-demo.budgetpc.com.au/return</a>'
					,'A $50 per hour fee may apply if warranty goods are found to be without fault.'
					,'Returns of non faulty items are considered on a case by case basis. A minimum 15% restocking fee applies.'
					,'Above goods remain the property of NavTech Security until payment has been received in full. Until title passes, NavTech Security can retain, repossess and/or resell all goods.'
					,'Are you happy with our service? Please send us your feedback. <a href="mailto:sales@nav-demo.budgetpc.com.au">sales@nav-demo.budgetpc.com.au</a>'
			)
	),
);

?>
