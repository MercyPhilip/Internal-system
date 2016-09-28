/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
	manufactures: []
	,productCategories: []
	,_tierLevels: []
	,_tierPriceTypes: []
	,_nextPageColSpan: 9
	,_tierPriceRule : null
	,_autoLoading: false
	,_postIndex: null // for new rule post, start from 0
	,_selected: null // for new rule post, selected products
	,newRuleResultContainerId: 'new_rule_result_container' // the element id for new rule post result container	
	,_getTitleRowData: function() {
		return {'sku': 'SKU', 'category': {'name': 'Category'}, 'manufacturer' : {'name': 'Brand'}, 'tier': 'Tier Price'};
	}
	/**
	 * Set some pre defined data before javascript start
	 */
	,setPreData: function(tierLevels, tierPriceTypes) {
		this._tierLevels = tierLevels;
		this._tierPriceTypes = tierPriceTypes;
		return this;
	}
	/**
	 * Load the manufacturers
	 */
	,_loadManufactures: function(manufactures) {
		this.manufactures = manufactures;
		var tmp = {};
		tmp.me = this;
		tmp.selectionBox = $(tmp.me.searchDivId).down('[search_field="pro.manufacturerIds"]');
		tmp.me.manufactures.each(function(option) {
			tmp.selectionBox.insert({'bottom': new Element('option',{'value': option.id}).update(option.name) });
		});
		return this;
	}
	/**
	 * Load thecategories
	 */
	,_loadCategories: function(categories) {
		this.categories = categories;
		var tmp = {};
		tmp.me = this;
		tmp.selectionBox = $(tmp.me.searchDivId).down('[search_field="pro.productCategoryIds"]');
		tmp.me.categories.sort(function(a, b){
			return a.namePath > b.namePath;
		}).each(function(option) {
			tmp.selectionBox.insert({'bottom': new Element('option',{'value': option.id}).update(option.namePath) });
		});
		return this;
	}
	/**
	 * Load the _loadProductStatuses
	 */
	,_loadProductStatuses: function(productStatuses) {
		this.productStatuses = productStatuses;
		var tmp = {};
		tmp.me = this;
		tmp.selectionBox = $(tmp.me.searchDivId).down('[search_field="pro.productStatusIds"]');
		tmp.me.productStatuses.each(function(option) {
			tmp.selectionBox.insert({'bottom': new Element('option',{'value': option.id}).update(option.name) });
		});
		return this;
	}
	/**
	 * Load the suppliers
	 */
	,_loadSuppliers: function(suppliers) {
		this.suppliers = suppliers;
		var tmp = {};
		tmp.me = this;
		tmp.selectionBox = $(tmp.me.searchDivId).down('[search_field="pro.supplierIds"]');
		tmp.me.suppliers.each(function(option) {
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
				tmp.me._tickAll = false;
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
	,_bindNewRuleBtn: function(btn,product) {
		var tmp = {};
		tmp.me = this;
		tmp.product = (product || null);
		tmp.btn = (btn || $('newRuleBtn'));
		
		tmp.me.observeClickNDbClick(
				tmp.btn
				,function(){
					tmp.selected = tmp.me._getSelection();
					tmp.totalQty = $('total-found-count').innerHTML;
					
					if(tmp.product === null && tmp.selected !== null && tmp.selected.length > 0) {
						tmp.tierLayer = new Element('div')
							.insert({'bottom': new Element('h3', {'class': 'col-lg-12'}).update('only <b>' + tmp.selected.length + '</b> out of <b>' + tmp.totalQty + '</b> is selected, Contrinue?') })
							.insert({'bottom': new Element('i', {'class': 'btn btn-danger btn-lg'}).update('No')
								.observe('click', function(){tmp.me.hideModalBox();})
							})
							.insert({'bottom': new Element('i', {'class': 'btn btn-success btn-lg pull-right'}).update('Yes').setStyle(tmp.selected.length === 0 ? 'display: none;' : '') 
								.observe('click', function(){
									jQuery("#select2-drop-mask").select2("close"); // close all select2
									jQuery('#' + tmp.me.modalId).on("hidden.bs.modal", function(){
										if (jQuery('.tooltip'))
											jQuery('.tooltip').remove();
									});
									$(this).up('.modal-body').update('')
										.insert({'bottom': tmp.ruleContainer = tmp.me._getTierPriceRuleEl(null, tmp.selected) })
										.insert({'bottom': new Element('div', {'class': 'row', 'id': tmp.me.newRuleResultContainerId}) });
									//tmp.me._getPriceMatchCompanySelect2(jQuery('[match_rule="company_id"]'),true);
								})
							});
						tmp.me.showModalBox('Tier Price Rule', tmp.tierLayer, false, null, null, true);
					}
					else if(tmp.product && jQuery.isNumeric(tmp.product.id)) {
						
					}
				}
				,null
				);
		return tmp.me;
	}
	,_getTierPriceRuleEl: function(product, selected) {
		var tmp = {};
		tmp.me = this;
		tmp.product = (product || null);
		tmp.selected = (selected || null);

		tmp.newDiv = new Element('div', {'class': ''})
			.insert({'bottom': new Element('div', {'class': 'col-xs-12'})
				
				.insert({'bottom': new Element('div', {'class': 'form-group col-xs-12'})
				.insert({'bottom': new Element('span', {'class': 'tierrule'})
					.insert({'bottom': tmp.me._getListPanel('TierPrice:', [], {'tier' : 'TierLevel', 'quantity': 'Quantity','type': 'TierPriceType', 'value': 'value'}, tmp.me._tierPriceTypes, tmp.me._tierLevels).wrap(new Element('div', {'class': 'tierprices-panel'})) })
					})
				})
			
			})
			.insert({'bottom': new Element('div', {'class': 'col-xs-12 text-right'})
				.insert({'bottom': new Element('i', {'class': 'btn btn-sm btn-success btn-new-rule right-panel'}).update('Confirm') 
					.observe('click', function(e){
						tmp.me._tierPriceRule = tmp.me._collectFormData($(this).up('.modal-body'), 'list-panel-row', 'list-item');
						if (tmp.me._tierPriceRule == null) return;
						tmp.me._selected = tmp.product === null ? tmp.selected : tmp.product;
						tmp.me._postIndex = 0;
						tmp.me.postNewRule($(this));
					})
				})
				.insert({'bottom': new Element('i', {'class': 'btn btn-sm btn-danger btn-del-rule right-panel'}).update('<i class="glyphicon glyphicon-trash"></i>') 
					.observe('click', function(e){
						tmp.me._tierPriceRule = tmp.me._collectFormData($(this).up('.modal-body'), 'list-panel-row', 'list-item');
						tmp.me._selected = tmp.product === null ? tmp.selected : tmp.product;
						tmp.me._postIndex = 0;
						tmp.me.postNewRule($(this), true);
					})
				})
			});
		return tmp.newDiv;
	}
	,postNewRule: function(btn, del) {
		var tmp = {};
		tmp.me = this;
		tmp.btn = (btn || null);
		tmp.del = (del || false);
		if(tmp.btn !== null)
			tmp.me._signRandID(tmp.btn);
		
		active = (tmp.del === true ? false : true);
		
		if(tmp.me._selected[tmp.me._postIndex]) {
			window.onbeforeunload = function(){
			   return "Processing... Please Do not close";
			};
			tmp.ModalBox = $(tmp.me.modalId);
			if(tmp.ModalBox)
				tmp.ModalBox.down('.modal-header').update('<h4 style="color:red;">Processing... Please Do NOT close</h4>');
			
			tmp.me.postAjax(tmp.me.getCallbackId('newRule'), {'productId': tmp.me._selected[tmp.me._postIndex]['id'], 'rule': tmp.me._tierPriceRule, 'active' : active}, {
				'onLoading': function () {
					if(tmp.btn !== null)
						jQuery('.right-panel.btn').button('loading');
				}
				,'onSuccess': function(sender, param) {
					try{
						tmp.result = tmp.me.getResp(param, false, true);
						if(!tmp.result)
							return;
						$(tmp.me.newRuleResultContainerId)
							.insert({'bottom': new Element('d', {'class': 'col-xs-9'}).update(tmp.me._selected[tmp.me._postIndex].sku) })
							.insert({'bottom': new Element('div', {'class': 'col-xs-3'}).update('done') });
					} catch (e) {
						$(tmp.me.newRuleResultContainerId)
							.insert({'top': tmp.me.getAlertBox('', e).addClassName('alert-danger col-xs-12') 
								.insert({'top': new Element('b', {'class': 'col-xs-12'}).update('SKU: ' + tmp.me._selected[tmp.me._postIndex].sku) })
							});
					}
				}
				,'onComplete': function() {
					window.onbeforeunload = null;
					if(tmp.btn !== null)
						jQuery('.right-panel.btn').button('reset');
					tmp.me._postIndex = tmp.me._postIndex + 1;
					tmp.me.postNewRule(tmp.btn, tmp.del);
				}
			});
		}
		else {
			$(tmp.me.newRuleResultContainerId).insert({'top': new Element('div', {'class': 'col-xs-12'}).update('All Done!') });
			tmp.me.hideModalBox();
			jQuery('#' + tmp.me.modalId).remove();
			$('searchBtn').click();
		}
	}
	/**
	 * get results
	 */
	,getResults: function(reset, pageSize, auto, tickNew) {
		var tmp = {};
		tmp.me = this;
		
		tmp.reset = (reset || false);
		tmp.auto = (auto || false);
		tmp.tickNew = (tickNew || false);
		tmp.resultDiv = $(tmp.me.resultDivId);

		if(tmp.reset === true)
			tmp.me._pagination.pageNo = 1;
		
		// auto load next page
		if(tmp.auto === true && $$('.btn-show-more').length > 0) {
			tmp.me._autoLoading = true;
			tmp.me._pagination.pageNo = tmp.me._pagination.pageNo*1 + 1;
		}
		
		tmp.me._pagination.pageSize = (pageSize || tmp.me._pagination.pageSize);
		tmp.me.postAjax(tmp.me.getCallbackId('getItems'), {'pagination': tmp.me._pagination, 'searchCriteria': tmp.me._searchCriteria}, {
			'onLoading': function () {
				jQuery('#' + tmp.me.searchDivId + ' .btn').button('loading');
				jQuery('#' + tmp.me.searchDivId + ' input').prop('disabled', true);
				jQuery('#' + tmp.me.searchDivId + ' select').prop('disabled', true);
				//reset div
				if(tmp.reset === true) {
					tmp.resultDiv.update( new Element('tr').update( new Element('td').update( tmp.me.getLoadingImg() ) ) );
				}
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result)
						return;
					$(tmp.me.totalNoOfItemsId).update(tmp.result.pageStats.totalRows);
					//reset div
					if(tmp.reset === true) {
						tmp.resultDiv.update(tmp.me._getResultRow(tmp.me._getTitleRowData(), true).wrap(new Element('thead')));
					}
					//remove next page button
					tmp.resultDiv.getElementsBySelector('.paginWrapper').each(function(item){
						item.remove();
					});
					//show all items
					tmp.tbody = $(tmp.resultDiv).down('tbody');
					if(!tmp.tbody)
						$(tmp.resultDiv).insert({'bottom': tmp.tbody = new Element('tbody') });
					tmp.result.items.each(function(item) {
						tmp.tbody.insert({'bottom': tmp.newRow = tmp.me._getResultRow(item).addClassName('item_row').writeAttribute('item_id', item.id) });
						if (tmp.me._tickAll)
							tmp.newRow.down('.product-selected').click();
					});
					if(tmp.me._singleProduct !== true) {
						//show the next page button
						if(tmp.result.pageStats.pageNumber < tmp.result.pageStats.totalPages)
							tmp.resultDiv.insert({'bottom': tmp.me._getNextPageBtn().addClassName('paginWrapper') });
					}
					// auto load next page
					if(tmp.auto === true && $$('.btn-show-more').length > 0) {
						tmp.me.getResults(false, tmp.me._pagination.pageSize, true);
					}
					else { // finished auto loading
						tmp.me._autoLoading = false;
						tmp.me.hideModalBox();
						jQuery('#' + tmp.me.searchDivId + ' .btn').button('reset');
						jQuery('#' + tmp.me.searchDivId + ' input').prop('disabled', false);
						jQuery('#' + tmp.me.searchDivId + ' select').prop('disabled', false);
					}
					tmp.me._getSelection();
				} catch (e) {
					tmp.resultDiv.insert({'bottom': tmp.me.getAlertBox('Error', e).addClassName('alert-danger') });
				}
			}
			,'onComplete': function() {
				if(tmp.auto !== true) {
					jQuery('#' + tmp.me.searchDivId + ' .btn').button('reset');
					jQuery('#' + tmp.me.searchDivId + ' input').prop('disabled', false);
					jQuery('#' + tmp.me.searchDivId + ' select').prop('disabled', false);
				}
			}
		});
	}
	/**
	 * get next page
	 */
	,_getNextPageBtn: function() {
		var tmp = {};
		tmp.me = this;
		tmp.totalQty = $('total-found-count').innerHTML;
		return new Element('tfoot')
			.insert({'bottom': new Element('tr')
				.insert({'bottom': new Element('td', {'colspan': tmp.me._nextPageColSpan, 'class': 'text-center'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-primary btn-show-more', 'data-loading-text':"Fetching more results ..."}).update('Next Page')
						.observe('click', function() {
							tmp.me._pagination.pageNo = tmp.me._pagination.pageNo*1 + 1;
							jQuery(this).button('loading');
							tmp.me.getResults(false, tmp.me._pagination.pageSize, false, true);
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-warning btn-show-more', 'data-loading-text':"Fetching more results ..."}).update('<b>Show ALL Pages</b>').setStyle('margin-left: 10px; color: black;')
						.observe('click', function() {
							if(tmp.totalQty > 1000)
								tmp.me.showModalBox('Warning', '<h3>There are ' + tmp.totalQty + ' products for current search conditions. <br/>Please narrow down the search');
							else
							{
								tmp.me.getResults(false, tmp.me._pagination.pageSize, true);
							}
						})
					})
				})
			});
	}
	/**
	 * Getting the tierprices for a product
	 */
	,_getTierPrices: function (row) {
		var tmp = {};
		tmp.me = this;
		tiers = row.tierprices;
		//unitCost = (row.totalOnHandValue != 0 && row.stockOnHand != 0) ? tmp.me.getCurrency(row.totalOnHandValue/row.stockOnHand) : 'N/A';
		unitCost = (row.totalOnHandValue != 0 && row.stockOnHand != 0) ? row.totalOnHandValue/row.stockOnHand : Number(row.buyinprice);
		tmp.price = '';
		tmp.specilaPrice = '';
		tmp.srp = '';
		warning = false;
		if(row.prices) {
			row.prices.each(function(price) {
				if(price.type && parseInt(price.type.id) === 1) {
					tmp.price = Number(price.price);
				}
				else if(price.type && (parseInt(price.type.id) === 2))
				{
					tmp.specilaPrice = Number(price.price);
				}
				else if(price.type && (parseInt(price.type.id) === 7))
				{
					tmp.srp = Number(price.price);
				}
			});
		}
		if ((!tiers) || !unitCost) return '';
		tmp.tierStrings = [];
		tiers.each(function(tier) {
			warning = false;
			if (tier.tierPriceType.id == 1)
			{
				tierPrice = Number((unitCost * (tier.value / 100) + unitCost) * 1.1).toFixed(2);
				
			}
			else
			{
				tierPrice = Number(tier.value).toFixed(2);
			}
			if (tmp.srp && tierPrice > tmp.srp)
				warning = true;
			if (tmp.price && tierPrice > tmp.price)
				warning = true;
			tmp.tierStrings.push('<div ' + (warning? 'style="color : red;"' : '') + '><small><strong class="hidden-xs hide-when-info hidden-sm">' + tier.tierLevel.name + ': </strong>' + tmp.me.getCurrency(tierPrice) + ': <abbr title="Quantity" >' + (tier.quantity > 0 ? tier.quantity : '') + ' </abbr></small></div>');
		})
		return tmp.tierStrings.join('');
	}
	/**
	 * Getting the tierprice rules for a product
	 */
	,_getTierPriceRules: function (tiers) {
		var tmp = {};
		tmp.me = this;
		if (!tiers) return '';
		tmp.tierStrings = [];
		tiers.each(function(tier) {
			tmp.tierStrings.push('<div><small><strong class="hidden-xs hide-when-info hidden-sm">' + tier.tierLevel.name + ': </strong><abbr title="Type: '  + tier.tierPriceType.name + '">' + Number(tier.value).toFixed(2) + ': </abbr><abbr title="Quantity" >' + (tier.quantity > 0 ? tier.quantity : '') + ' </abbr></small></div>');
		})
		return tmp.tierStrings.join('');
	}
	/**
	 * get selected
	 */
	,_getSelection: function() {
		var tmp = {}
		tmp.me = this;
		tmp.products = [];
		
		tmp.itemList = $('item-list');
		tmp.itemList.getElementsBySelector('.product_item.item_row').each(function(row){
			tmp.checked = row.down('input.product-selected[type="checkbox"]').checked;
			tmp.productId = row.readAttribute('product_id');
			if(tmp.checked === true && jQuery.isNumeric(tmp.productId) === true)
				tmp.products.push(row.retrieve('data'));
		});
		
		$('total-selected-count').update(tmp.products.length);
		
		return tmp.products;
	}
	/**
	 * Getting each row for displaying the result list
	 */
	,_getResultRow: function(row, isTitle) {
		console.log('row=', row);
		var tmp = {};
		tmp.me = this;
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.categories = '';
		if (row.categories)
		{
			row.categories.each(function(item) {
				tmp.categories = (tmp.categories == '' ? item.name : tmp.categories + ';' + item.name);
			});
		}
		tmp.price = '';
		tmp.specilaPrice = '';
		tmp.srp = '';
		if(row.prices) {
			row.prices.each(function(price) {
				if(price.type && parseInt(price.type.id) === 1) {
					tmp.price = price.price;
				}
				else if(price.type && (parseInt(price.type.id) === 2))
				{
					tmp.specilaPrice = price.price;
				}
				else if(price.type && (parseInt(price.type.id) === 7))
				{
					tmp.srp = price.price;
				}
			});
		}
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? '' : 'product_item btn-hide-row'), 'product_id' : row.id})
			.store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'sku', 'title': row.name}).addClassName('col-xs-1')
				.insert({'bottom': new Element('span').setStyle('margin: 0 5px 0 0')
					.insert({'bottom': new Element('input', {'type': 'checkbox', 'class': 'product-selected'})
						.observe('click', function(e){
							tmp.checked = this.checked;
							if(tmp.isTitle === true) {
								tmp.me._tickAll = tmp.checked;
								$(tmp.me.resultDivId).getElementsBySelector('.product_item .product-selected').each(function(el){
									el.checked = tmp.checked;
								});
							}
							tmp.me._getSelection();
						})
					})
				})
				.insert({'bottom':tmp.isTitle === true ? row.sku : new Element('a', {'href': '/product/' + row.id + '.html', 'target': '_BLANK', 'class': 'sku-link truncate'})
				.update(row.sku)
				})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'category'}).addClassName('col-xs-2').update(
					tmp.isTitle === true ?
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-12'}).update('Category') })
							:
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-12'}).update(tmp.categories) })
								)
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'manufacturer hidden-xs hide-when-info hidden-sm', 'style' : 'width:5%'}).addClassName('col-xs-1').update(row.manufacturer ? row.manufacturer.name : '') })
			.insert({'bottom': new Element(tmp.tag, {'class': 'prices'}).addClassName('col-xs-3').update(
					tmp.isTitle === true ?
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-2'}).update('SOH') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-3'}).update('RRP(Inc)') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-3'}).update('Cost(Ex)') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4'}).update('Tier Prices(Inc)') })
							:
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-2'}).update(row.stockOnHand) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-3'}).update(tmp.srp? tmp.me.getCurrency(tmp.srp): tmp.me.getCurrency(tmp.price)) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-3'}).update((row.totalOnHandValue != 0 && row.stockOnHand != 0) ? tmp.me.getCurrency(row.totalOnHandValue/row.stockOnHand) : row.buyinprice ? tmp.me.getCurrency(row.buyinprice) : 'N/A') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4'}).update(tmp.me._getTierPrices(row)) })
				)
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'stock'}).addClassName('col-xs-4').update(
					tmp.isTitle === true ?
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-12'}).update('Tier Price Rules') })
							:
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-12'}).update(tmp.me._getTierPriceRules(row.tierprices)) })
				)
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'text-right col-xs-1 '}).update(
				tmp.isTitle === true ?  
					''
				: (new Element('span', {'class': 'btn-group btn-group-xs'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-default', 'title': 'Edit'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-pencil'}) })
						.observe('click', function(){
							$(this).up('.item_row').replace(tmp.editEl = tmp.me._getEditPanel(row));
							tmp.editEl.getElementsBySelector('.form-control[save-item-panel]').each(function(item) {
								item.observe('keydown', function(event){
									tmp.me.keydown(event, function() {
										tmp.editEl.down('.btn-success span').click();
									});
									return false;
								})
							});
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-danger', 'title': 'Delete'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-trash'}) })
						.observe('click', function(){
							if(!confirm('Are you sure you want to delete this item?'))
								return false;
							tmp.me._deleteItem(row);
						})
					})
				) 
			) });
		return tmp.row;
	}
	/**
	 * show the edit panel
	 */
	,_getEditPanel: function(row) {
		var tmp = {};
		tmp.me = this;
		tmp.categories = '';
		if (row.categories)
		{
			row.categories.each(function(item) {
				tmp.categories = (tmp.categories == '' ? item.name : tmp.categories + ';' + item.name);
			});
		}
		tmp.price = '';
		tmp.specilaPrice = '';
		tmp.srp = '';
		if(row.prices) {
			row.prices.each(function(price) {
				if(price.type && parseInt(price.type.id) === 1) {
					tmp.price = price.price;
				}
				else if(price.type && (parseInt(price.type.id) === 2))
				{
					tmp.specilaPrice = price.price;
				}
				else if(price.type && (parseInt(price.type.id) === 7))
				{
					tmp.srp = price.price;
				}
			});
		}
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'}).store('data', row)
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-1 '})
				.insert({'bottom': new Element('span', {'class': ' productId'}).update(row.sku)
				})
				.insert({'bottom': new Element('input', {'class': '', 'type': 'hidden','save-item-panel': 'id', 'value': row.id? row.id : ''})
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-2'})
				.insert({'bottom': new Element('span', {'class': 'row category'}).update(tmp.categories)
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-1 hidden-xs hide-when-info hidden-sm '})
				.insert({'bottom': new Element('span', {'class': 'brand'}).update(row.manufacturer ? row.manufacturer.name : '' )
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-3'})
				.insert({'bottom': new Element('div', {'class': 'row prices'})
				.insert({'bottom': new Element('div', {'class': 'col-xs-2'}).update(row.stockOnHand) })
				.insert({'bottom': new Element('div', {'class': 'col-xs-3'}).update(tmp.srp? tmp.me.getCurrency(tmp.srp): tmp.me.getCurrency(tmp.price)) })
				.insert({'bottom': new Element('div', {'class': 'col-xs-3'}).update((row.totalOnHandValue != 0 && row.stockOnHand != 0) ? tmp.me.getCurrency(row.totalOnHandValue/row.stockOnHand) : 'N/A') })
				.insert({'bottom': new Element('div', {'class': 'col-xs-4'}).update(tmp.me._getTierPrices(row)) })
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-4'})
				.insert({'bottom': new Element('span', {'class': 'tierrule'})
					.insert({'bottom': tmp.me._getListPanel('TierPrice:', row.tierprices, {'tier' : 'TierLevel', 'quantity': 'Quantity','type': 'TierPriceType', 'value': 'value'}, tmp.me._tierPriceTypes, tmp.me._tierLevels).wrap(new Element('div', {'class': 'tierprices-panel'})) })
				})
			
			})
			.insert({'bottom': new Element('td', {'class': 'form-group text-right col-xs-1'})
				.insert({'bottom':  new Element('span', {'class': 'btn-group btn-group-sm'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-success', 'title': 'Save'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-ok'}) })
						.observe('click', function(){
							tmp.btn = this;
							tmp.data = tmp.me._saveItem(tmp.btn, $(tmp.btn).up('.save-item-panel'), 'save-item-panel');
							if (tmp.data)
							{
								if (jQuery('.tooltip'))
									jQuery('.tooltip').remove();
							}
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-danger', 'title': 'Delete'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-remove'}) })
						.observe('click', function(){
							if(row.id)
								$(this).up('.save-item-panel').replace(tmp.me._getResultRow(row).addClassName('item_row').writeAttribute('item_id', row.id) );
							else
								$(this).up('.save-item-panel').remove();
							if (jQuery('.tooltip'))
								jQuery('.tooltip').remove();
						})
					})
				})
			});
		return tmp.newDiv;
	}
	/**
	 * General getting a selection box
	 */
	,_getSelBox: function(options, selectedValue) {
		var tmp = {};
		tmp.me = this;
		tmp.selBox = new Element('select');
		options.each(function(opt){
			tmp.selBox.insert({'bottom': new Element('option', {'value': opt.id, 'selected' : (selectedValue && opt.id === selectedValue ? true : false)}).update(opt.name) })
		});
		return tmp.selBox;
	}
	/**
	 * Getting the row for function: _getListPanel()
	 */
	,_getListPanelRow: function(data, selPriceTypeBoxData, selTierBoxData, titleData, isTitle, selBoxChangeFunc) {
		var tmp = {};
		tmp.me = this;
		tmp.isTitle = (isTitle || false);
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.tierString = titleData.tier.charAt(0).toLowerCase() + titleData.tier.slice(1);
		tmp.qtyString = titleData.quantity.toLowerCase();
		tmp.typeString = titleData.type.charAt(0).toLowerCase() + titleData.type.slice(1);
		tmp.valueString = titleData.value.toLowerCase();
		tmp.randId = 'NEW_' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
		tmp.inputBoxDiv = new Element('div', {'class': 'input-group input-group-sm'})
		.insert({'bottom': new Element('input', {'type': 'number', 'class': 'form-control', 'list-panel-row': 'quantity',  'value': Number(data[tmp.qtyString]) > 0 ? data[tmp.qtyString] : ''})
			.writeAttribute('list-item', (data.id ? data.id : tmp.randId))
		})
		.observe('click', function(event){
			$(this).down('input').select();
		});
		tmp.newRow = new Element('tr')
			.insert({'bottom': new Element(tmp.tag).setStyle('width: 20%').update( 
					tmp.isTitle === true ? titleData.tier : 
						tmp.me._getSelBox(selTierBoxData, (data[tmp.tierString] && data[tmp.tierString].id ? data[tmp.tierString].id : ''))
						.addClassName('form-control input-sm ')
						.writeAttribute('list-panel-row', 'tierId')
						.writeAttribute('required', true)
						.writeAttribute('list-item', (data.id ? data.id : tmp.randId))
						.observe('change', function(event) {
							if(typeof(selBoxChangeFunc) === 'function')
								selBoxChangeFunc(event);
						})
						.wrap(new Element('div', {'class': 'form-group'}))
				)
			})
			.insert({'bottom': new Element(tmp.tag).setStyle('width: 20%').update( tmp.isTitle === true ? titleData.quantity : tmp.inputBoxDiv.wrap(new Element('div', {'class': 'form-group'})) ) })
			.insert({'bottom': new Element(tmp.tag).setStyle('width: 30%').update(
					tmp.isTitle === true ? titleData.type :
					tmp.me._getSelBox(selPriceTypeBoxData, (data[tmp.typeString] && data[tmp.typeString].id ? data[tmp.typeString].id : ''))
						.addClassName('form-control input-sm ')
						.writeAttribute('list-panel-row', 'typeId')
						.writeAttribute('required', true)
						.writeAttribute('list-item', (data.id ? data.id : tmp.randId))
						.observe('change', function(event) {
							if(typeof(selBoxChangeFunc) === 'function')
								selBoxChangeFunc(event);
						})
						.wrap(new Element('div', {'class': 'form-group'}))
				)
			});
		if(data.id) {
			tmp.newRow.insert({'bottom': new Element('input', {'type': 'hidden', 'class': 'form-control', 'list-panel-row': 'id', 'value': (data.id) })
				.writeAttribute('list-item', (data.id ? data.id : tmp.randId))
			});
		}
		tmp.inputBoxDiv = new Element('div', {'class': 'input-group input-group-sm'})
			.insert({'bottom': new Element('input', {'type': 'text', 'class': 'form-control', 'list-panel-row': 'value', 'required': true, 'value': (data[tmp.valueString] ? Number(data[tmp.valueString]).toFixed(2): '') })
				.writeAttribute('list-item', (data.id ? data.id : tmp.randId))
			})
			.insert({'bottom': new Element('input', {'type': 'hidden', 'class': 'form-control', 'list-panel-row': 'active', 'value': '1' })
				.writeAttribute('list-item', (data.id ? data.id : tmp.randId))
			})
			.insert({'bottom': new Element('span', {'class': 'btn btn-danger input-group-addon'})
				.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-trash'}) })
				.observe('click', function() {
					if(data.id) {
						$(this).up('.input-group').down('[list-panel-row=active]').value = '0';
						$(this).up('.input-group').down('[list-panel-row=value]').writeAttribute('required', false);
						$(this).up('.list-panel-row').hide();
					} else {
						$(this).up('.list-panel-row').remove();
					}
					if (jQuery('.tooltip'))
						jQuery('.tooltip').remove();
				})
			});
		tmp.newRow.insert({'bottom': new Element(tmp.tag).update( tmp.isTitle === true ? titleData.value : tmp.inputBoxDiv.wrap(new Element('div', {'class': 'form-group'})) ) });
		return tmp.newRow;
	}
	/**
	 * General listing panel
	 */
	,_getListPanel: function(title, listData, titleData, selPriceTypeBoxData, selTierBoxData, selBoxChangeFunc) {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'panel panel-default'})
		.insert({'bottom': new Element('span', {'class': 'btn btn-primary btn-xs pull-right', 'title': 'New'})
			.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-plus'}) })
				.insert({'bottom': ' NEW' })
				.observe('click', function(){
					tmp.parentPanel = $(this).up('.panel');
					tmp.newData = {};
					tmp.parentPanel.down('.table tbody').insert({'bottom': tmp.me._getListPanelRow(tmp.newData, selPriceTypeBoxData, selTierBoxData, titleData, false, selBoxChangeFunc).addClassName('list-panel-row').writeAttribute('item_id', '') });
					tmp.parentPanel.down('.list-div').show();
				})
		})
		.insert({'bottom': new Element('div', {'class': 'list-div table-responsive'})
				.insert({'bottom': new Element('table', {'class': 'table table-condensed', 'style' : 'width : auto'})
					.insert({'bottom': new Element('thead').update( tmp.me._getListPanelRow(titleData, selPriceTypeBoxData, selTierBoxData, titleData, true, selBoxChangeFunc) ) })
					.insert({'bottom': tmp.listDiv = new Element('tbody') })
				})
			});
		if(listData) {
			listData.each(function(data){
				tmp.listDiv.insert({'bottom': tmp.me._getListPanelRow(data, selPriceTypeBoxData, selTierBoxData, titleData, false, selBoxChangeFunc).addClassName('list-panel-row').writeAttribute('item_id', data.id) });
			});
		}
		return tmp.newDiv;
	}
	/**
	 * submit save
	 */
	,_saveItem: function(btn, savePanel, attrName) {
		var tmp = {};
		tmp.me = this;
		tmp.data = tmp.me._collectFormData(savePanel, attrName);
		if(tmp.data === null)
			return;
		//get all tierprices
		tmp.data.tierprices = tmp.me._collectFormData(savePanel.down('.tierprices-panel'), 'list-panel-row', 'list-item');
		if(tmp.data.tierprices === null)
			return;
		tmp.me.postAjax(tmp.me.getCallbackId('saveItem'), {'item': tmp.data}, {
			'onLoading': function () {
				if(tmp.data.id) {
					savePanel.addClassName('item_row').writeAttribute('item_id', tmp.data.id);
				}
				savePanel.hide();
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result || !tmp.result.item)
						return;
					tmp.row = $(tmp.me.resultDivId).down('tbody').down('.item_row[item_id=' + tmp.result.item.id + ']');
					tmp.newRow = tmp.me._getResultRow(tmp.result.item).addClassName('item_row').writeAttribute('item_id', tmp.result.item.id);
					if(!tmp.row)
					{
						savePanel.remove();
						$(tmp.me.resultDivId).down('tbody').insert({'top': tmp.newRow });
						$(tmp.me.totalNoOfItemsId).update($(tmp.me.totalNoOfItemsId).innerHTML * 1 + 1);
					}
					else
					{
						tmp.row.replace(tmp.newRow);
					}

				} catch (e) {
					tmp.me.showModalBox('<span class="text-danger">ERROR:</span>', e, true);
					savePanel.show();
				}
			}
		});
		return tmp.me;
	}
	/**
	 * delete items
	 */
	,_deleteItem: function(row) {
		var tmp = {};
		tmp.me = this;
		tmp.row = $(tmp.me.resultDivId).down('tbody').down('.item_row[item_id=' + row.id + ']');
		tmp.me.postAjax(tmp.me.getCallbackId('deleteItems'), {'id': row.id}, {
			'onLoading': function () {
				if(tmp.row) {
					tmp.row.hide();
				}
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result || !tmp.result.item)
						return;
					tmp.newRow = tmp.me._getResultRow(tmp.result.item).addClassName('item_row').writeAttribute('item_id', tmp.result.item.id);
					if(tmp.row) {
						tmp.row.replace(tmp.newRow);
					}
				} catch (e) {
					tmp.me.showModalBox('<span class="text-danger">ERROR</span>', e, true);
					if(tmp.row) {
						tmp.row.show();
					}
				}
			}
		});
		return tmp.me;
	}
	/**
	 * clear all tier prices
	 */
	,clearAll: function(btn) {
		var tmp = {};
		tmp.me = this;
		reset = true;
		pageSize = tmp.me._pagination.pageSize;
		tmp.reset = (reset || false);
		tmp.resultDiv = $(tmp.me.resultDivId);
		if(!confirm('You are about to clear all tier prices.\n Continue?'))
		{
			return;
		}
		if(tmp.reset === true)
			tmp.me._pagination.pageNo = 1;
		tmp.me._pagination.pageSize = (pageSize || tmp.me._pagination.pageSize);
		tmp.me.postAjax(tmp.me.getCallbackId('clearAllBtn'), {'pagination': tmp.me._pagination, 'searchCriteria': tmp.me._searchCriteria}, {
			'onLoading': function () {
				jQuery('#' + tmp.me.searchDivId + ' #searchBtn').button('loading');
				//reset div
				if(tmp.reset === true) {
					tmp.resultDiv.update( new Element('tr').update( new Element('td').update( tmp.me.getLoadingImg() ) ) );
				}
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result)
						return;
					$(tmp.me.totalNoOfItemsId).update(tmp.result.pageStats.totalRows);

					//reset div
					if(tmp.reset === true) {
						tmp.resultDiv.update(tmp.me._getResultRow(tmp.me._getTitleRowData(), true).wrap(new Element('thead')));
						if(!tmp.result.items || tmp.result.items.size() === 0) {
							tmp.resultDiv.insert({'bottom': tmp.me.getAlertBox('Nothing found.', '').addClassName('alert-warning') });
						}
					}
					//remove next page button
					tmp.resultDiv.getElementsBySelector('.paginWrapper').each(function(item){
						item.remove();
					});

					//show all items
					tmp.tbody = $(tmp.resultDiv).down('tbody');
					if(!tmp.tbody)
						$(tmp.resultDiv).insert({'bottom': tmp.tbody = new Element('tbody') });
					tmp.result.items.each(function(item) {
						tmp.tbody.insert({'bottom': tmp.me._getResultRow(item).addClassName('item_row').writeAttribute('item_id', item.id) });
					});
					//show the next page button
					if(tmp.result.pageStats.pageNumber < tmp.result.pageStats.totalPages)
						tmp.resultDiv.insert({'bottom': tmp.me._getNextPageBtn().addClassName('paginWrapper') });
				} catch (e) {
					tmp.resultDiv.insert({'bottom': tmp.me.getAlertBox('Error', e).addClassName('alert-danger') });
				}
			}
			,'onComplete': function() {
				jQuery('#' + tmp.me.searchDivId + ' #searchBtn').button('reset');
			}
		});
	}
});
