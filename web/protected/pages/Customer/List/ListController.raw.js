/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
	_tiers: []
	,_getTitleRowData: function(message) {
		var tmp = {};
		tmp.me = this;
		message = message||{};
//		console.log(firstRow);
		
		if(message.length > 0 ){
			
			return {'email': "Email", 'terms' : 'Terms', 'tier' : {'name' : 'Tier'}, 'name': 'Name', 'contactNo': 'Contact Num', 'description': 'Description', 'message': message, 'addresses': 'Addresses',
				'address': {'billing': {'full': 'Billing Address'}, 'shipping': {'full': 'Shipping Address'} },
				'mageId': "Mage Id", 'active': "Active?", 'isBlocked' : 'IsBlocked', 'groupCom' : 'Commercial Group', 'groupEdu' : 'Educational Group', 'groupGame' : 'Gaming Group'
				};			
		} else {
			return {'email': "Email", 'terms' : 'Terms', 'tier' : {'name' : 'Tier'}, 'name': 'Name', 'contactNo': 'Contact Num', 'description': 'Description', 'addresses': 'Addresses',
				'address': {'billing': {'full': 'Billing Address'}, 'shipping': {'full': 'Shipping Address'} },
				'mageId': "Mage Id", 'active': "Active?", 'isBlocked' : 'IsBlocked', 'groupCom' : 'Commercial Group', 'groupEdu' : 'Educational Group', 'groupGame' : 'Gaming Group'
				};
		}

	}
	/**
	 * Load the tier
	 */
	,_loadTiers: function(_tiers) {
		this._tiers = _tiers;
		var tmp = {};
		tmp.me = this;
		tmp.selectionBox = $(tmp.me.searchDivId).down('[search_field="cust.tier"]');
		tmp.me._tiers.each(function(option) {
			tmp.selectionBox.insert({'bottom': new Element('option',{'value': option.id}).update(option.name) });
		});
		return this;
	}
	/**
	 * initiating the chosen input
	 */
	,_loadChosen: function () {
		jQuery(".chosen").select2({
		    minimumResultsForSearch: Infinity
		});
		return this;
	}
	/**
	 * Binding the search key
	 */
	,_bindSearchKey: function() {
		var tmp = {}
		tmp.me = this;
		$$('#searchBtn').first()
			.observe('click', function(event) {
				if(!$$('#showSearch').first().checked)
					$$('#showSearch').first().click();
				else
					tmp.me.getSearchCriteria().getResults(true, tmp.me._pagination.pageSize);
			});
		
		$('searchDiv').getElementsBySelector('[search_field]').each(function(item) {
			item.observe('keydown', function(event) {
				tmp.me.keydown(event, function() {
					$(tmp.me.searchDivId).down('#searchBtn').click();
				});
			})
		});

		return this;
	}
	/**
	 * Open edit page in a fancybox
	 */
	,_openEditPage: function(row) {
		var tmp = {};
		tmp.me = this;
		jQuery.fancybox({
			'width'			: '95%',
			'height'		: '95%',
			'autoScale'     : false,
			'autoDimensions': false,
			'fitToView'     : false,
			'autoSize'      : false,
			'type'			: 'iframe',
			'frameborder'	: '0',
			'border'		: '0',
			'seamless'		: 'seamless',
			'href'			: '/customer/' + (row && row.id ? row.id : 'new') + '.html'
 		});
		return tmp.me;
		
	}
	/**
	 * Highlisht seleteted row
	 */
	,_highlightSelectedRow : function (btn) {
		var tmp = {};
		tmp.me = this;
		tmp.item = btn.down('.glyphicon-plus') ? '' : $(btn).up('[item_id]').retrieve('data');
//		jQuery('.item_row.success').removeClass('success');
		tmp.selectedRow = jQuery('[item_id=' + tmp.item.id + ']')
		.addClass('success');
	}
	/**
	 * Displaying the selected address 
	 */
	,_displaySelectedAddress: function(btn) {
		var tmp = {};
		tmp.me = this;
		tmp.item = $(btn).up('[item_id]').retrieve('data');
		tmp.type = $(btn).down('span').classList.contains('address-shipping');
		
		jQuery('.popover-loaded').popover('hide');
		//remove highlight
		jQuery('.item_row.success').removeClass('success');
		//mark this one as active
		tmp.selectedRow = jQuery('[item_id=' + tmp.item.id + ']')
			.addClass('success');
		
		tmp.me._signRandID(btn); //sign it with a HTML ID to commnunicate with jQuery
		if(!jQuery('#' + btn.id).hasClass('popover-loaded')) {
			jQuery('#' + btn.id).popover({
				'title'    : '<div class="row"><div class="col-xs-10">Details for: ' + tmp.item.name + '</div><div class="col-xs-2" style="cursor: pointer" href="javascript:void(0);" onclick="jQuery(' + "'#" + btn.id + "'" + ').popover(' + "'hide'" + ');"><span class="pull-right glyphicon glyphicon-remove" ></span></div></div>',
				'html'     : true, 
				'placement': function () {return tmp.type? 'left' : 'right'},
				'container': 'body', 
				'trigger'  : 'manual',
				'viewport' : {"selector": ".list-panel", "padding": 0 },
				'content'  : function () {
					return tmp.type? '<p>' + tmp.item.address.shipping.full +'</p>' : '<p>' + tmp.item.address.billing.full +'</p>'
				},
				'template' : '<div class="popover" role="tooltip" style="max-width: none; z-index: 0;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
			})
			.addClass('popover-loaded');
		}
		jQuery('#' + btn.id).popover('toggle');
		return tmp.me;
	}
	,_bindMergeCustomersBtn: function(btn) {
		var tmp = {};
		tmp.me = this;
		tmp.btn = (btn || $('mergeBtn'));
		
		tmp.me.observeClickNDbClick(
				tmp.btn
				,function(){
					tmp.selected = tmp.me._getSelection();
					tmp.totalQty = $('total-found-count').innerHTML;
					
					if(tmp.selected !== null && tmp.selected.length > 1) {
						if(confirm('You are about to merge multiple customers to the first selected customer.\n' + (tmp.selected.length - 1) + ' customer(s) will be deleted. Continue?'))
						{
							// continue;
							tmp.me.postAjax(tmp.me.getCallbackId('mergeCustomers'), {'item': tmp.selected}, {
								'onLoading': function () {
									
								}
								,'onSuccess': function(sender, param) {
									try{
										// refresh all
										tmp.me.getSearchCriteria().getResults(true, tmp.me._pagination.pageSize);
									} catch (e) {
										tmp.me.showModalBox('<span class="text-danger">ERROR:</span>', e, true);
									}
								}
							});
						}
						return tmp.me;
					}
					else
					{
						alert('Please select at least two customers that you want to merge!');
					}
				}
				,null
				);
		return tmp.me;
	}
	/**
	 * get selected
	 */
	,_getSelection: function() {
		var tmp = {}
		tmp.me = this;
		tmp.customers = [];
		
		tmp.itemList = $('item-list');
		tmp.itemList.getElementsBySelector('.btn-hide-row.item_row').each(function(row){
			tmp.checked = row.down('input.customer-selected[type="checkbox"]').checked;
			tmp.customerId = row.readAttribute('item_id');
			if(tmp.checked === true && jQuery.isNumeric(tmp.customerId) === true)
				tmp.customers.push(row.retrieve('data'));
		});
		
		$('total-selected-count').update(tmp.customers.length);
		return tmp.customers;
	}
	/**
	 * get result row for data given
	 */
	,_getResultRow: function(row, isTitle) {

		var tmp = {};
		tmp.me = this;
		tmp.tag = (isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? 'item_top_row' : 'btn-hide-row item_row') + (row.active == 0 ? ' danger' : ''), 'item_id': (tmp.isTitle === true ? '' : row.id)}).store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-1'})
				.insert({'bottom': tmp.isTitle == true? '' : new Element('span').setStyle('margin: 0 5px 0 0')
					.insert({'bottom': new Element('input', {'type': 'checkbox', 'class': 'customer-selected'})
						.observe('click', function(e){
							tmp.checked = this.checked;
							tmp.me._getSelection();
						})
					})
				})
				.insert({'bottom': new Element('span').setStyle('margin: 0 5px 0 0')
					.update(row.name) 
					.observe('click', function(){
						tmp.me._highlightSelectedRow(this);
						$$('.popover-loaded').each(function(item){
							jQuery(item).popover('hide');
						});
					})	
					.observe('dblclick', function(){
						$$('.popover-loaded').each(function(item){
							jQuery(item).popover('hide');
						});
						tmp.me._openEditPage(row);
					})
				})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'email col-xs-1', 'style': 'text-decoration: underline;'}).update(row.email) 
				.observe('click', function(){
					tmp.me._highlightSelectedRow(this);
					$$('.popover-loaded').each(function(item){
						jQuery(item).popover('hide');
					});
				})	
				.observe('dblclick', function(){
					$$('.popover-loaded').each(function(item){
						jQuery(item).popover('hide');
					});
					tmp.newWindow = window.open('mailto:' + row.email, 'width=1300, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no');
					tmp.newWindow.close();
				})	
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'tier col-xs-1 truncate'}).update(row.tier.name)})
			.insert({'bottom': new Element(tmp.tag, {'class': 'terms col-xs-1 truncate'}).update(row.terms)})
			.insert({'bottom': new Element(tmp.tag, {'class': 'isBlocked col-xs-1'})
				.insert({'bottom': (tmp.isTitle === true ? row.isBlocked : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': row.isBlocked}) ) })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'contact col-xs-1 truncate'}).update(row.contactNo)})
			.insert({'bottom': new Element(tmp.tag, {'class': 'description col-xs-1'}).update(row.description) });

		if(row.hasOwnProperty('message')){	
//			console.log(row.message);
			for(var n = row.message.length; n--;) {
				tmp.row = tmp.row.insert({'bottom': new Element(tmp.tag, {'class': 'message col-xs-1','style': 'width: 12%'})
					.insert({'bottom': tmp.isTitle === true ? new Element('div',{'style': 'width: 100%'}).insert({'bottom': row.message[n].title })
							.insert({'bottom': new Element(tmp.tag, {'class': 'message col-xs-1','style': 'width: 12%; padding-left:0'})
						.insert({'bottom':	new Element('span',{'style': 'float:left; width: 40%; padding-top:5px'}).insert({'bottom':row.message[n].nameOpen }) })
						.insert({'bottom':	new Element('span',{'style': 'float:left; width: 60%; padding-top:5px'}).insert({'bottom':row.message[n].nameClick}) }) })
						: new Element('span', {'style': 'display: inline-block; padding-left:15px'})					
						.insert({'bottom': new Element('span', {'style': 'display: inline-block; padding-right: 15px'}).update(row.message[n].opened) })
						.insert({'bottom': new Element('span', {'style': 'display: inline-block; padding-left: 50px'}).update(row.message[n].clicked) })
					})
				})
			}
		}
			
		tmp.row = tmp.row.insert({'bottom': new Element(tmp.tag, {'class': 'address col-xs-1'})
				.insert({'bottom': tmp.isTitle === true ? row.addresses : new Element('span', {'style': 'display: inline-block'})
					.insert({'bottom': new Element('a', {'class': 'visible-xs visible-md visible-sm visible-lg', 'href': 'javascript: void(0);'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-plane address-shipping', 'style': 'font-size: 1.3em'}) })
						.observe('click', function(){
							tmp.me._displaySelectedAddress(this);
						})
					})
				})
				.insert({'bottom': tmp.isTitle === true ? '' : new Element('span', {'style': 'display: inline-block'})
					.insert({'bottom':  new Element('a', {'class': 'visible-xs visible-md visible-sm visible-lg', 'href': 'javascript: void(0);'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-usd address-billing', 'style': 'font-size: 1.3em; padding-left:10%;'}) })
						.observe('click', function(){
							tmp.me._displaySelectedAddress(this);
						})
					})
				})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'mageId col-xs-1'}).update(row.mageId) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'cust_active col-xs-1'})
				.insert({'bottom': (tmp.isTitle === true ? row.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': row.active}) ) })
			})	
			.insert({'bottom': new Element(tmp.tag, {'class': 'grouping col-xs-1'})
				.insert({'bottom': (tmp.isTitle === true ? row.groupCom : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': row.groupCom}) ) })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'grouping col-xs-1'})
				.insert({'bottom': (tmp.isTitle === true ? row.groupEdu : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': row.groupEdu}) ) })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'grouping col-xs-1'})
				.insert({'bottom': (tmp.isTitle === true ? row.groupGame : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': row.groupGame}) ) })
			})			
			
			.insert({'bottom': new Element(tmp.tag, {'class': 'text-right col-xs-1'}).update(
				tmp.isTitle === true ?  
				(new Element('span', {'class': 'btn btn-primary btn-xs', 'title': 'New'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-plus'}) })
					.insert({'bottom': ' NEW' })
					.observe('click', function(){
						$(this).up('thead').insert({'bottom': tmp.me._openEditPage() });
					})
				)
				: (new Element('span', {'class': 'btn-group btn-group-xs'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-default', 'title': 'Edit'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-pencil'}) })
						.observe('click', function(){
							$$('.popover-loaded').each(function(item){
								jQuery(item).popover('hide');
							});
							tmp.me._openEditPage(row);
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-danger', 'title': 'Delete'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-trash'}) })
						.observe('click', function(){
							if(!confirm('Are you sure you want to deactivate this item?'))
								return false;
							if(row.active)
								tmp.me._deactivateItem(this);
							$$('.popover-loaded').each(function(item){
								jQuery(item).popover('hide');
							});
						})
					}) ) 
				)
				.observe('click', function(){
					tmp.me._highlightSelectedRow(this);
					$$('.popover-loaded').each(function(item){
						jQuery(item).popover('hide');
					});
				})	
			});
		
		return tmp.row;
	}
	,_getNextPageBtn: function() {
		var tmp = {}
		tmp.me = this;
		return new Element('tfoot')
			.insert({'bottom': new Element('tr')
				.insert({'bottom': new Element('td', {'colspan': '8', 'class': 'text-center'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-primary', 'data-loading-text':"Fetching more results ..."}).update('Show More')
						.observe('click', function() {
							tmp.me._pagination.pageNo = tmp.me._pagination.pageNo*1 + 1;
							jQuery(this).button('loading');
							tmp.me.getResults();
						})
					})
				})
			});
	}
	/**
	 * insted of delete item, deactivate it
	 */
	,_deactivateItem: function(btn) {
		var tmp = {}
		tmp.me = this;
		tmp.row = $(btn).up('[item_id]');
		tmp.item = tmp.row.retrieve('data');
		tmp.me.postAjax(tmp.me.getCallbackId('deactivateItems'), {'item_id': tmp.item.id}, {
			'onLoading': function() {
				if(tmp.row) {
					tmp.row.toggleClassName('danger');
					tmp.row.hide(); 
				}
			}
			,'onSuccess': function(sender, param){
				try {
					tmp.row.toggleClassName('danger');
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result.item)
						throw 'errror';
					$$('[item_id="'+ tmp.result.item.id +'"]').first().replace(tmp.me._getResultRow(tmp.result.item, false));
					tmp.me._highlightSelectedRow($$('[item_id="'+ tmp.result.item.id +'"]').first().down('.glyphicon.glyphicon-trash'));
				} catch(e) {
					tmp.me.showModalBox('<span class="text-danger">ERROR</span>', e, true);
				}
			}
		})
	}
	/**
	 * upload customer list to Act-On
	 */
	,integrateActon: function(btn) {
		var tmp = {};
		tmp.me = this;
		tmp.data = {};
		$$('[search_field]').each(function(item){
			tmp.data[item.readAttribute('search_field')] = $F(item);
		});
		if(confirm(' Would you like to create a contact list on Act-On?'))
		{
			tmp.me.postAjax(tmp.me.getCallbackId('integrateActon'), tmp.data, {
				'onLoading': function() {
					jQuery(btn).button('loading');
				}
				,'onSuccess': function (sender, param) {
					try {
						tmp.result = tmp.me.getResp(param, false, true);
			
						if(!tmp.result)
							return;
						if(tmp.result.errorCode){
							// errorCode 10056 means list already exists
							if(tmp.result.errorCode == 10056){
								if(confirm('The list you selected already exists.\n' + ' Would you like to update the exist list?'))
								{
									tmp.me.postAjax(tmp.me.getCallbackId('updateActon'), {'filename': tmp.result.filename, 'listname': tmp.result.listname}, {
										'onLoading': function() {
											jQuery(btn).button('loading');
										}
										,'onSuccess': function (sender, param) {
											tmp.result = tmp.me.getResp(param, false, true);
											if(!tmp.result)
												return;
											if(tmp.result.errorCode){
												tmp.me.showModalBox('Error', tmp.result.message + ' --' + tmp.result.errorCode, false);
											} else if(tmp.result.status){
												tmp.me.showModalBox('Success', tmp.result.message, false);
											}
										}
										,'onComplete': function() {
											jQuery(btn).button('reset');
										}
									})
								}		
							} else {
								tmp.me.showModalBox('Error', tmp.result.message + ' --' + tmp.result.errorCode, false);
							}
	
						} else if(tmp.result.status){
							tmp.me.showModalBox('Success', tmp.result.message, false);
						}
						
	
					} catch (e) {
						tmp.me.showModalBox('<b>Error:</b>', '<b class="text-danger">' + e + '</b>');
					}
				}
				,'onComplete': function() {
					jQuery(btn).button('reset');
				}
			})
		}
		return tmp.me;
	}	
	,checkboxToggle: function(){
		var tmp = {};
		tmp.me = this;
		jQuery('#labelCom').click(function(){
			jQuery('#groupCom').prop('checked', true);
			jQuery('.groupGen').prop('checked', false);

		})
		jQuery('#labelEdu').click(function(){
			jQuery('#groupEdu').prop('checked', true);
			jQuery('.groupGen').prop('checked', false);

		})		
		jQuery('#labelGame').click(function(){
			jQuery('#groupGame').prop('checked', true);
			jQuery('.groupGen').prop('checked', false);

		})
		jQuery('#labelGen').click(function(){
			jQuery('#groupGen').prop('checked', true);
			jQuery('.groupCom').prop('checked', false);

		})
		jQuery('.groupGen').change(function() {
			if(jQuery(this).is(":checked")){
				jQuery('.groupCom').prop('checked', false);
			}
		})
		
		jQuery('.groupCom').change(function() {
			if(jQuery(this).is(":checked")){
				jQuery('.groupGen').prop('checked', false);
			}
		})
		return tmp.me;
	}
	,_checkActOnEnable: function() {
		var tmp = {}
		tmp.me = this;

		tmp.me.postAjax(tmp.me.getCallbackId('checkActOnEnable'),{},{
			'onLoading':function(){}
			,'onSuccess': function (sender, param) {
				tmp.result = tmp.me.getResp(param, false, true);
				
				if(!tmp.result)
					return;

				if(tmp.result.enable == 0){
					jQuery('#integrateActonBtn','#respondingNum').hide();
				}
			}
			,'onComplete': function(){}
		})			
		

		return tmp.me;
	}
});

jQuery('#integrateActonBtn').ready(function(){
	var check = new PageJs();
	check._checkActOnEnable();
});

jQuery(document).on('click','th > div > th > span',function(){
    var table = jQuery(this).parents('table').eq(0);
    var rows = table.find('tr:gt(0):lt(90)').toArray().sort(comparer(jQuery(this).parents('tr > th').index()));
//    console.log(table);
    this.asc = !this.asc;
    if (!this.asc){rows = rows.reverse();}
    table.children('tbody').empty().html(rows);
});
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return jQuery.isNumeric(valA) && jQuery.isNumeric(valB) ?
            valA - valB : valA.localeCompare(valB);
    };
}
function getCellValue(row, index){
    return jQuery(row).children('td').eq(index).text();
}
