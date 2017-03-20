<?php
/**
 * Menu template
 *
 * @package    Web
 * @subpackage Layout
 * @author     lhe
 */
class Menu extends TTemplateControl
{
    /**
     * (non-PHPdoc)
     * @see TControl::onLoad()
     */
	public function onLoad($param)
	{
	}
	public function getMenuItems()
	{
		$pageItem = trim($this->getPage()->menuItem);
		
		$array = array(
			'' => array('url' => '/', 'name' => 'Home', 'icon' => '<span class="glyphicon glyphicon-home"></span>')
			,'Orders' => array(
				'icon' => '<span class="glyphicon glyphicon-search"></span>',
				'order' => array('url' => '/order.html', 'name' => 'Orders', 'icon' => '<span class="glyphicon glyphicon-search"></span>')
			)
		);
		/*if(AccessControl::canAccessPriceMatchPage(Core::getRole()) )
			$array['priceMatch'] = array('url' => '/pricematch.html', 'name' => 'Price Match', 'icon' => '<span class="glyphicon glyphicon-usd"></span>' );*/
		if(AccessControl::canAccessCreateOrderPage(Core::getRole()) )
			$array['Orders']['neworder'] = array('url' => '/order/new.html', 'name' => 'New Order', 'icon' => '<span class="glyphicon glyphicon-plus"></span>');
		if(AccessControl::canAccessOrderItemsPage(Core::getRole()) )
			$array['Orders']['orderitems'] = array('url' => '/orderitems.html', 'name' => 'OrderItems');
		if(AccessControl::canAccessOrderItemsPage(Core::getRole()) && (Core::getUser()->getStore()->getId() == 1) ) 
			$array['Orders']['priceMatch'] = array('url' => '/pricematch.html', 'name' => 'Price Match', 'icon' => '<span class="glyphicon glyphicon-usd"></span>');
		if(AccessControl::canAccessProductsPage(Core::getRole()) ) {
			$array['Products'] = array(
				'icon' => '<span class="glyphicon glyphicon-th-list"></span>',
				'products' => array('url' => '/products.html', 'name' => 'Products', 'icon' => '<span class="glyphicon glyphicon-th-list"></span>'),
				'serialNumbers' => array('url' => '/serialnumbers.html', 'name' => 'Serial Numbers', 'icon' => '<span class="glyphicon glyphicon-search"></span>'),
				'manufacturers' => array('url' => '/manufacturers.html', 'name' => 'Manufactures'),
				'suppliers' => array('url' => '/suppliers.html', 'name' => 'Suppliers'),
				'productcodetypes' => array('url' => '/productcodetypes.html', 'name' => 'Product Code Types', 'icon' => '<span class="glyphicon glyphicon-barcode"></span>'),
				'productcategories' => array('url' => '/productcategories.html', 'name' => 'Product Categories')
			);
			if(AccessControl::canAccessStockAdjustPage(Core::getRole()))
				$array['Products']['stockadjustment'] = array('url' => '/stockadjustment.html', 'name' => 'Stock Adjustment', 'icon'=> '<span class=""></span>');
			$array['Products']['productquantitylog']  = array('url' => '/productqtylog.html', 'name' => 'Qty Log', 'icon'=> '<span class=""></span>');
			$array['Products']['accounting']  = array('url' => '/accounting.html', 'name' => 'Accounting Info', 'icon'=> '<span class=""></span>');
			$array['Products']['importer']  = array('url' => '/importer/new.html', 'name' => 'Importer', 'icon'=> '<span class="fa fa-bars"></span>');
			$array['Products']['ageingreport']  = array('url' => '/productageing.html', 'name' => 'Ageing Report (beta)', 'icon'=> '<span class="glyphicon glyphicon-eye-open"></span>');
			$array['Products']['systembuilds'] = array('url' => '/build.html', 'name' => 'System Builds');

		}
		if(AccessControl::canAccessPurcahseOrdersPage(Core::getRole()) )
		{
			$array['Purchase'] = array(
				'icon' => '<span class="glyphicon glyphicon-shopping-cart"></span>',
				'PurchaseOrder' =>array('url' => '/purchase.html', 'name' => 'Purchase Orders', 'icon' => '<span class="glyphicon glyphicon-shopping-cart"></span>'),
				'NEW PO' =>array('url' => '/purchase/new.html', 'name' => 'NEW PO', 'icon' => '<span class="glyphicon glyphicon-plus"></span>'),
				'NEW PO Credit' =>array('url' => '/purchase/credit/new.html', 'name' => 'NEW PO Credit', 'icon' => '<span class="glyphicon glyphicon-plus"></span>'),
				'Receiving' =>array('url' => '/receiving.html', 'name' => 'Receiving PO', 'icon' => '<span class="fa fa-home"></span>'),
				'serialNumbers' => array('url' => '/serialnumbers.html', 'name' => 'Serial Numbers', 'icon' => '<span class="glyphicon glyphicon-search"></span>'),
			);
			if (Core::getUser()->getStore()->getId() == 1)
			{
				$array['Purchase']['priceMatch'] = array('url' => '/pricematch.html', 'name' => 'Price Match', 'icon' => '<span class="glyphicon glyphicon-usd"></span>' );
			}
		}
		if(AccessControl::canAccessOrderItemsPage(Core::getRole()) )
			$array['Customers'] = array('url' => '/customer.html', 'name' => 'Customers', 'icon' => '<span class="glyphicon glyphicon-user"></span>' );
		if(AccessControl::canAccessAccountsPage(Core::getRole()) )
			$array['Accounts'] = array(
					'icon' => '<span class="glyphicon glyphicon-time"></span>',
					'PaymentMethod' =>array('url' => '/paymentmethod.html', 'name' => 'Payment Method', 'icon' => '<span class="glyphicon glyphicon-record"></span>'),
					'Bill' =>array('url' => '/bills.html', 'name' => 'Bills', 'icon' => '<span class="glyphicon glyphicon-usd"></span>'),
					'accounting' => array('url' => '/accounting.html', 'name' => 'Accounting Info', 'icon'=> '<span class=""></span>'),
					'report' => array('url' => '/report.html', 'name' => 'Report', 'icon'=> '<span class=""></span>'),
					'CreditNote' => array('url' => '/creditnote.html', 'name' => 'Credit Note', 'icon'=> '<span class=""></span>'),
					'RMA' => array('url' => '/rma.html', 'name' => 'RMA', 'icon'=> '<span class=""></span>'),
					'importer' => array('url' => '/importer/new.html', 'name' => 'Importer', 'icon'=> '<span class="fa fa-bars"></span>'),
			);
		if(AccessControl::canAccessLogisticsPage(Core::getRole()) ) {
			$array['Logistics'] = array(
					'icon' => '<span class="fa fa-arrows"></span>',
					'PurchaseOrder' =>array('url' => '/purchase.html', 'name' => 'Purchase Orders', 'icon' => '<span class="glyphicon glyphicon-shopping-cart"></span>'),
					'Receiving' =>array('url' => '/receiving.html', 'name' => 'Receiving Products', 'icon' => '<span class="fa fa-home"></span>'),
					'serialNumbers' => array('url' => '/serialnumbers.html', 'name' => 'Serial Numbers', 'icon' => '<span class="glyphicon glyphicon-search"></span>'),
					'Locations' =>array('url' => '/locations.html', 'name' => 'Locations', 'icon' => '<span class="fa fa-arrows"></span>'),
					'PreferLocationTypes' =>array('url' => '/locationtypes.html', 'name' => 'Prefer Location Types', 'icon' => '<span class="glyphicon glyphicon-tasks"></span>')
			);
			if(AccessControl::canAccessStockAdjustPage(Core::getRole()))
				$array['Logistics']['stockadjustment'] = array('url' => '/stockadjustment.html', 'name' => 'Stock Adjustment', 'icon'=> '<span class=""></span>');
			$array['Logistics']['courier'] = array('url' => '/courier.html', 'name' => 'Courier', 'icon'=> '<span class=""></span>');
			$array['Logistics']['Bill'] = array('url' => '/bills.html', 'name' => 'Supplier Invoices', 'icon' => '<span class="glyphicon glyphicon-usd"></span>');
		}
		if(AccessControl::canAccessWorkShopPage(Core::getRole()) ) {
			$array['Workshop'] = array(
					'icon' => '<span class="glyphicon glyphicon-wrench"></span>',
					'newTask' =>array('url' => '/task/new.html', 'name' => 'New Task', 'icon' => '<span class="glyphicon glyphicon-plus"></span>'),
					'tasks' =>array('url' => '/tasks.html', 'name' => 'Tasks', 'icon' => '<span class="glyphicon glyphicon-align-left"></span>'),
					'newKit' =>array('url' => '/kit/new.html', 'name' => 'Build a Kit', 'icon' => '<span class="fa fa-gavel"></span>'),
					'kits' => array('url' => '/kits.html', 'name' => 'Kits', 'icon' => '<span class="glyphicon glyphicon-search"></span>')
			);
		}
		if(AccessControl::canAccessReportsPage(Core::getRole()) ) {
			$array['Reports'] = array(
					'icon' => '<span class="fa fa-area-chart"></span>',
					'RunRates' =>array('url' => '/report/runrate.html', 'name' => 'Run Rate', 'icon' => '<span class="glyphicon glyphicon-plus"></span>'),
					'BuyInReport' =>array('url' => '/report/buyinreport.html', 'name' => 'Buy In Report', 'icon' => '<span class="glyphicon glyphicon-log-in"></span>'),
					'SellingReport' =>array('url' => '/report/sellingreport.html', 'name' => 'Selling Report', 'icon' => '<span class="glyphicon glyphicon-log-out"></span>'),
					'eta' => array('url' => '/etareport.html', 'name' => 'ETA', 'icon' => '<span class="glyphicon glyphicon-eye-open"></span>')
			);
		}
		if(AccessControl::canAccessCreateProductPage(Core::getRole())) {
			if (Core::getUser()->getStore()->getId() != 1)
			{
				$array['Management'] = array(
						'icon' => '<span class="glyphicon glyphicon-list"></span>',
						'msl' => array('url' => '/management/ministocklevel.html', 'name' => 'Minimum Stock Level', 'icon' => '<span class="glyphicon glyphicon-object-align-bottom"></span>'),
						'categorymanagement' => array('url' => '/management/categorymanagement.html', 'name' => 'Category Management', 'icon' => '<span class="glyphicon glyphicon-folder-open"></span>'),
						'stocktake' => array('url' => '/management/stocktake.html', 'name' => 'Stock Take', 'icon' => '<span class="glyphicon glyphicon-transfer"></span>')
				);
			}
			else
			{
				$array['Management'] = array(
						'icon' => '<span class="glyphicon glyphicon-list"></span>',
						'newProducts' => array('url' => '/management/products.html', 'name' => 'New Products', 'icon' => '<span class="glyphicon glyphicon-plus-sign"></span>'),
						'import' => array('url' => '/management/import.html', 'name' => 'Import(csv)', 'icon' => '<span class="glyphicon glyphicon-upload"></span>'),
						'msl' => array('url' => '/management/ministocklevel.html', 'name' => 'Minimum Stock Level', 'icon' => '<span class="glyphicon glyphicon-object-align-bottom"></span>'),
						'categorymanagement' => array('url' => '/management/categorymanagement.html', 'name' => 'Category Management', 'icon' => '<span class="glyphicon glyphicon-folder-open"></span>'),
					'stocktake' => array('url' => '/management/stocktake.html', 'name' => 'Stock Take', 'icon' => '<span class="glyphicon glyphicon-transfer"></span>'),
					'tierrule' => array('url' => '/management/tierrule.html', 'name' => 'Tier Rule Setting', 'icon' => '<span class="glyphicon glyphicon-cog"></span>'),
					'producttierprice' => array('url' => '/management/producttierprice.html', 'name' => 'Product Tier Price', 'icon' => '<span class="glyphicon glyphicon-usd"></span>')
				);
			}
		}
		if(AccessControl::canAccessUsersPage(Core::getRole()) ) {
			if (Core::getUser()->getStore()->getId() != 1)
			{
				$array['Systems'] = array(
						'icon' => '<span class="glyphicon glyphicon-cog"></span>',
						'users' => array('url' => '/users.html', 'name' => 'Users', 'icon' => '<span class="glyphicon glyphicon-user"></span>'),
						'salestarget' => array('url' => '/salestarget.html', 'name' => 'SalesTarget', 'icon' => '<span class="glyphicon glyphicon-usd"></span>'),
						'messages' => array('url' => '/messages.html', 'name' => 'Messages', 'icon' => '<span class="glyphicon glyphicon-envelope"></span>'),
						'logs' => array('url' => '/logs.html', 'name' => 'Logs', 'icon' => '<span class="fa fa-book"></span>'),
				);
			}
			else 
			{
				$array['Systems'] = array(
						'icon' => '<span class="glyphicon glyphicon-cog"></span>',
						'users' => array('url' => '/users.html', 'name' => 'Users', 'icon' => '<span class="glyphicon glyphicon-user"></span>'),
						'tierlevels' => array('url' => '/tierlevels.html', 'name' => 'TierLevels', 'icon' => '<span class="glyphicon glyphicon-cog"></span>'),
						'salestarget' => array('url' => '/salestarget.html', 'name' => 'SalesTarget', 'icon' => '<span class="glyphicon glyphicon-usd"></span>'),
						'messages' => array('url' => '/messages.html', 'name' => 'Messages', 'icon' => '<span class="glyphicon glyphicon-envelope"></span>'),
						'logs' => array('url' => '/logs.html', 'name' => 'Logs', 'icon' => '<span class="fa fa-book"></span>'),
						'systemsettings' => array('url' => '/systemsettings.html', 'name' => 'Settings', 'icon' => '<span class="glyphicon glyphicon-cog"></span>')
				);
			}

		}
		$html = "<ul class='nav navbar-nav'>";
			foreach($array as $key => $item)
			{
				$hasNextLevel = !isset($item['name']) && is_array($item) && count($item) > 0;
				$activeClass = ($pageItem === $key || array_key_exists($pageItem, $item) ? 'active' : '');
				$html .= "<li class='" . $activeClass . " visible-xs visible-sm visible-md visible-lg'>";
				$html .= "<a href='" . ($hasNextLevel === true ? '#' : $item['url']) . "' " . ($hasNextLevel === true ? 'class="dropdown-toggle" data-toggle="dropdown"' : '') . ">";
					$html .= (isset($item['icon']) ? $item['icon'] . ' ' : '') . ($hasNextLevel === true ? $key .'<span class="caret"></span>' : $item['name']);
				$html .= "</a>";
					if($hasNextLevel === true)
					{
						$html .= "<ul class='dropdown-menu'>";
						foreach($item as $k => $i)
						{
							if(is_string($i) || !isset($i['url']))
								continue;
							$html .= "<li class='" . ($pageItem === $k ? 'active' : '') . "'><a href='" . $i['url'] . "'>" . (isset($i['icon']) ? $i['icon'] . ' ' : '') .$i['name'] . "</a></li>";
						}
						$html .= "</ul>";
					}
				$html .= "</li>";
			}
		$html .= "</ul>";
		return $html;
	}
}
?>
