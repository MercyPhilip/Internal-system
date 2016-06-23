/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
	manufactures: []
	,suppliers: []
	,productCategories: []
	,productStatuses: []
	,_nextPageColSpan: 9
	,_autoLoading: false
	,_getTitleRowData: function() {
		return {'sku': 'SKU', 'name': 'Product Name','shortDesc': 'Short Description', 'manufacturer' : {'name': 'Brand'}, 'supplierCodes': [{'supplier': {'name': 'Supplier'}, 'code': ''}],  'stockOnHand': 'SOH'};
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
				tmp.me.deSelectProduct();
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
	 * Binding the excel key
	 */
	,_bindExcelKey: function() {
		var tmp = {}
		tmp.me = this;
		$$('#excelBtn').first()
			.observe('click', function(event) {
				tmp.me.getSearchCriteria().genReport(true);
			});
		return this;
	}
	/**
	 * Getting the supplier codes for display result list per row
	 */
	,_getSupplierCodes: function(supplierCodes, isTitle) {
		var tmp = {};
		tmp.me = this;
		tmp.supplierCodeString = [];
		supplierCodes.each(function(suppliercode) {
			tmp.supplierCodeString.push(isTitle === true ? 'Supplier' : '<abbr title="Code: '  + suppliercode.code + '">' + (suppliercode.supplier && suppliercode.supplier.name ? suppliercode.supplier.name : '') + '</abbr>');
		})
		return tmp.supplierCodeString.join(', ');
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
					});
					if(tmp.me._singleProduct !== true) {
						//show the next page button
						if(tmp.result.pageStats.pageNumber < tmp.result.pageStats.totalPages)
							tmp.resultDiv.insert({'bottom': tmp.me._getNextPageBtn().addClassName('paginWrapper') });
					}
					tmp.me._bindPriceInput();
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
	 * update mini stock level
	 */
	,_updateStockLevel: function(productId, newValue, originalValue, type) {
		var tmp = {};
		tmp.me = this;
		if(type !== 'stockMinLevel' && type !== 'stockReorderLevel')
			tmp.me.showModalBox('Error', 'Invalid type passin to updateStockLevel');
		tmp.me.postAjax(tmp.me.getCallbackId('updateStockLevel'), {'productId': productId, 'newValue': newValue, 'type': type}, {
			'onLoading': function() {}
		,'onSuccess': function(sender, param) {
			try {
				tmp.result = tmp.me.getResp(param, false, true);
				if(!tmp.result || !tmp.result.item || !tmp.result.item.id)
					return;
				jQuery('.' + type + '-input[product-id=' + tmp.result.item.id + ']').attr('original-' + type, newValue);
				tmp.row = $(tmp.me.resultDivId).down('.product_item[product_id=' + tmp.result.item.id + ']');
				if(tmp.row) {
					tmp.me.deSelectProduct();
					tmp.row.replace(tmp.me._getResultRow(tmp.result.item, false));
					tmp.me._bindPriceInput();
				}
			} catch (e) {
				tmp.me.showModalBox('<strong class="text-danger">Error When Update ' + type + ':</strong>', '<strong>' + e + '</strong>');
				jQuery('.' + type + '-input[product-id=' + productId + ']').val(originalValue);
			}
		}
		})
		return tmp.me;
	}
	/**
	 * update selling price
	 */
	,_updatePrice: function(productId, newPrice, originalPrice) {
		var tmp = {};
		tmp.me = this;
		tmp.me.postAjax(tmp.me.getCallbackId('updateSellingPrice'), {'productId': productId, 'newPrice': tmp.me.getValueFromCurrency(newPrice)}, {
			'onLoading': function() {}
			,'onSuccess': function(sender, param) {
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result || !tmp.result.item || !tmp.result.item.id)
						return;
					jQuery('.price-input[product-id=' + tmp.result.item.id + ']').attr('original-price', tmp.me.getValueFromCurrency(newPrice));
					tmp.row = $(tmp.me.resultDivId).down('.product_item[product_id=' + tmp.result.item.id + ']');
					if(tmp.row) {
						tmp.me.deSelectProduct();
						tmp.row.replace(tmp.me._getResultRow(tmp.result.item, false));
						tmp.me._bindPriceInput();
					}
				} catch (e) {
					tmp.me.showModalBox('<strong class="text-danger">Error When Update Price:</strong>', '<strong>' + e + '</strong>');
					jQuery('.price-input[product-id=' + productId + ']').val(tmp.me.getCurrency(originalPrice));
				}
			}
		})
		return tmp.me;
	}
	/**
	 * binding the price input event
	 */
	,_bindPriceInput: function() {
		var tmp = {};
		tmp.me = this;
		jQuery('.stockMinLevel-input[product-id]').not('.stockMinLevel-input-binded')
			.click(function (){
				jQuery(this)
				.attr('original-stockMinLevel', jQuery(this).val())
				.select();
			})
			.keydown(function(event) {
				tmp.inputBox = jQuery(this);
				tmp.me.keydown(event, function(){
					tmp.inputBox.blur();
				});
			})
			.focusout(function(){
				tmp.value = jQuery(this).val();
				jQuery(this).val(tmp.value);
			})
			.change(function() {
				tmp.me._updateStockLevel(jQuery(this).attr('product-id'), jQuery(this).val(), jQuery(this).attr('original-stockMinLevel'), 'stockMinLevel' );
			})
			.addClass('stockMinLevel-input-binded');
		jQuery('.price-input[product-id]:not(".price-input-binded")')
		.click(function (){
			jQuery(this)
				.attr('original-price', tmp.me.getValueFromCurrency(jQuery(this).val()))
				.select();
		})
		.keydown(function(event) {
			tmp.inputBox = jQuery(this);
			tmp.me.keydown(event, function(){
				tmp.inputBox.blur();
			});
		})
		.focusout(function(){
			tmp.value = tmp.me.getValueFromCurrency(jQuery(this).val());
			jQuery(this).val(tmp.me.getCurrency(tmp.value));
		})
		.change(function() {
			tmp.me._updatePrice(jQuery(this).attr('product-id'), jQuery(this).val(), tmp.me.getValueFromCurrency( jQuery(this).attr('original-price') ));
		})
		.addClass('price-input-binded');
		return tmp.me;
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
							tmp.me.deSelectProduct();
							tmp.me.getResults(false, tmp.me._pagination.pageSize, false, true);
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-warning btn-show-more', 'data-loading-text':"Fetching more results ..."}).update('<b>Show ALL Pages</b>').setStyle('margin-left: 10px; color: black;')
						.observe('click', function() {
							if(tmp.totalQty > 1000)
								tmp.me.showModalBox('Warning', '<h3>There are ' + tmp.totalQty + ' products for current search conditions. <br/>Please narrow down the search');
							else
							{
								tmp.me.deSelectProduct();
								tmp.me.getResults(false, tmp.me._pagination.pageSize, true);
							}
						})
					})
				})
			});
	}
	/**
	 * Getting each row for displaying the result list
	 */
	,_getResultRow: function(row, isTitle) {
		var tmp = {};
		tmp.me = this;
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		
		tmp.price = 0;
		if(row.prices) {
			row.prices.each(function(price) {
				if(price.type && parseInt(price.type.id) === 1) {
					tmp.price = price.price;
					tmp.updatedDate = price.updated;
				}
			});
		}
		if (row.totalOnHandValue != 0 && row.stockOnHand != 0 && tmp.price !=0)
		{
			tmp.avgcost = row.totalOnHandValue/row.stockOnHand;
			tmp.margin = (((tmp.price - tmp.avgcost) / tmp.price) * 100).toFixed(2) + '%';
			tmp.avgcost = tmp.me.getCurrency(tmp.avgcost);
		}
		else
		{
			tmp.avgcost = 'N/A';
			tmp.margin = '';
		}
		tmp.row = new Element('tr', {'class': 'visible-xs visible-md visible-lg visible-sm ' + (tmp.isTitle === true ? '' : 'product_item '), 'product_id' : row.id})
			.store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'sku', 'title': row.name}).addClassName('col-xs-1')
				.insert({'bottom':tmp.isTitle === true ? row.sku : new Element('a', {'href': 'javascript: void(0);', 'class': 'sku-link truncate'})
					.observe('click', function(e){
						Event.stop(e);
						tmp.me._displaySelectedProduct(row);
					})
				.update(row.sku)
				})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'product_name hidden-xs hide-when-info hidden-sm'})
				.addClassName('col-xs-2').insert({'bottom': row.name})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'manufacturer ', 'style' : 'width:5%'}).addClassName('col-xs-1').update(row.manufacturer ? row.manufacturer.name : '') })
			.insert({'bottom': new Element(tmp.tag, {'class': 'supplier  hidden-sm', 'style' : 'width:5%'}).addClassName('col-xs-1').update(
					row.supplierCodes ? tmp.me._getSupplierCodes(row.supplierCodes, isTitle) : '')
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'hidden-xs  hidden-sm row'}).addClassName('col-xs-3')
				.insert({'bottom': new Element('div', {'class': 'col-sm-4'}).update(tmp.isTitle === true ? 'Last Buy Price' : tmp.me.getCurrency(row.lastbuyprice))})
				.insert({'bottom': new Element('div', {'class': 'col-sm-4'}).update(tmp.isTitle === true ? 'Last Reveived Date' : row.lastrecdate) })
				.insert({'bottom': new Element('div', {'class': 'col-sm-4'}).update(tmp.isTitle === true ? 'Mini Stock Level' : new Element('input', {'class': "click-to-edit stockMinLevel-input", 'value': row.stockMinLevel, 'product-id': row.id}).setStyle('width: 80%') ) })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'qty hidden-sm'}).addClassName('col-xs-3').update(
					tmp.isTitle === true ?
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-3', 'title': 'Stock on Hand'}).update('SH') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-3 ', 'title': 'Average Cost'}).update('Average Cost') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-3 ', 'title': 'Price'}).update('Selling Price') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-3 ', 'title': 'Margin'}).update('Margin') })
							:
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-3', 'title': 'Stock on Hand'}).update(row.stockOnHand) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-3 ', 'title': 'totalOnHandValue is ' + row.totalOnHandValue}).update(tmp.avgcost) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-3 '}).update(new Element('input', {'class': 'click-to-edit price-input', 'product-id': row.id, 'value': tmp.me.getCurrency(tmp.price) }).setStyle('width: 80%'))})
								.insert({'bottom': new Element('div', {'class': 'col-xs-3 ', 'title': 'Margin'}).update(new Element('div', {'class':'margin'}).update(tmp.margin)) })
			)
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'runrate hidden-sm'}).addClassName('col-xs-1').update(
					tmp.isTitle === true ?
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-4 hide-when-info', 'title': 'Run rate of 7 days'}).update('1W') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4 hide-when-info', 'title': 'Run rate of 14 days'}).update('2W') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4 hide-when-info', 'title': 'Run rate of 1 month'}).update('1M') })
							:
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-4 hide-when-info', 'title': 'Run rate of 7 days'}).update(row.ow) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4 hide-when-info', 'title': 'Run rate of 14 days'}).update(row.tw) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4 hide-when-info', 'title': 'Run rate of 1 month'}).update(row.om) })
					)
			});
		return tmp.row;
	}
	/**
	 * unselect the product
	 */
	,deSelectProduct: function() {
		var tmp = {};
		tmp.me = this;
		jQuery('.product_item.success', jQuery('#' + tmp.me.resultDivId)).removeClass('success').popover('hide');
		$(tmp.me.resultDivId).up('.list-panel').removeClassName('col-xs-9').addClassName('col-xs-12');
		jQuery('.hide-when-info', jQuery('#' + tmp.me.resultDivId)).show();
		tmp.me._showRightPanel = false;
		return tmp.me;
	}
	/**
	 * Displaying the selected product
	 */
	,_displaySelectedProduct: function(item) {
		var tmp = {};
		tmp.me = this;
		$(tmp.me.resultDivId).up('.list-panel').removeClassName('col-xs-12').addClassName('col-xs-9');
		jQuery('.hide-when-info', jQuery('#' + tmp.me.resultDivId)).hide();
		tmp.me._showRightPanel = true;

		//remove all active class
		jQuery('.product_item.success', jQuery('#' + tmp.me.resultDivId)).removeClass('success').popover('hide');
		//mark this one as active
		tmp.selectedRow = jQuery('[product_id="' + item.id + '"]', jQuery('#' + tmp.me.resultDivId))
			.addClass('success');
		if(!tmp.selectedRow.hasClass('popover-loaded')) {
			tmp.selectedRow
			.on('shown.bs.popover', function (e) {
				tmp.me._getPriceMatchCompanySelect2(jQuery('.rightPanel[match_rule="company_id"]'), null, item);
			})
			.popover({
				'title'    : '<div class="row"><div class="col-xs-10">Details for: ' + item.sku + '</div><div class="col-xs-2"><div class="btn-group pull-right"><span class="btn btn-danger btn-sm" onclick="pageJs.deSelectProduct();"><span class="glyphicon glyphicon-remove"></span></span></div></div></div>',
				'html'     : true,
				'placement': 'right',
				'container': 'body',
				'trigger'  : 'manual',
				'viewport' : {"selector": ".list-panel", "padding": 0 },
				'content'  : function() { return tmp.rightPanel = tmp.me._showProductInfoOnRightPanel(item).wrap(new Element('div')).innerHTML; },
				'template' : '<div class="popover" role="tooltip" style="max-width: none; z-index: 0;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
			})
			.addClass('popover-loaded');
		}
		tmp.selectedRow.popover('show');
		return tmp.me;
	}
	/**
	 * get price match company
	 */
	,_getPriceMatchCompanySelect2: function(el, product) {
		var tmp = {};
		tmp.me = this;
		tmp.product = (product || null);
		
		tmp.selectBox = jQuery(el).select2({
			ajax: {
				delay: 250
				,url: '/ajax/getAll'
				,type: 'POST'
				,data: function (params) {
					return {"searchTxt": 'companyName like ?', 'searchParams': ['%' + params + '%'], 'entityName': 'PriceMatchCompany'};
				}
				,results: function(data, page, query) {
					tmp.result = [];
					if(data.resultData && data.resultData.items) {
						data.resultData.items.each(function(item){
							if(tmp.me._checkUniquePriceMatchCompanies(tmp.result, item) === false)
								tmp.result.push({'id': item.id, 'text': item.companyName, 'data': item});
						});
					}
					return { 'results' : tmp.result };
				}
			}
			,cache: true
			,escapeMarkup: function (markup) { return markup; } // let our custom formatter work
		});
		if(tmp.product !== null && tmp.product.priceMatchRule && tmp.product.priceMatchRule.id && tmp.product.priceMatchRule.priceMatchCompany && tmp.product.priceMatchRule.priceMatchCompany.id) {
			tmp.selectBox.select2('data', {'id': tmp.product.priceMatchRule.priceMatchCompany.id, 'text': tmp.product.priceMatchRule.priceMatchCompany.companyName, 'data': tmp.product.priceMatchRule.priceMatchCompany});
		}
		return tmp.selectBox;
	}
	/**
	 * show product info
	 */
	,_showProductInfoOnRightPanel: function(product) {
		var tmp = {};
		tmp.me = this;
		tmp.infoPanel = tmp.me._getInfoPanel(product);

		tmp.me.postAjax(tmp.me.getCallbackId('priceMatching'), {'id': product.id}, {
			'onLoading': function() {
				tmp.infoPanel.down('.price-match-div .price-match-listing').replace(new Element('div', {'class': 'panel-body price-match-listing'}).update(tmp.me.getLoadingImg()));
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result)
						return;
					if($('info_panel_' + product.id))
						$('info_panel_' + product.id).down('.price-match-div .price-match-listing').replace(tmp.me._displayPriceMatchResult(tmp.result, product));
				} catch (e) {
					tmp.me.showModalBox('Error', e, true);
				}
			}
		});
		return tmp.infoPanel;
	}
	/**
	 * Displaying the price matching result
	 */
	,_displayPriceMatchResult: function(prices, product) {
		var tmp = {};
		tmp.me = this;
		tmp.minPrice = 0;
		tmp.tbody = new Element('tbody');
		
		$H(prices["companyPrices"]).each(function(price){
			if(parseInt(price.value.price) !== 0) {
				if((parseInt(tmp.minPrice) === 0 && parseFloat(price.value.price) > 0) || parseFloat(price.value.price) < parseFloat(tmp.minPrice))
					tmp.minPrice = price.value.price;
			}
			tmp.tbody.insert({'bottom': new Element('tr')
				.insert({'bottom': new Element('td', {'colspan': 3}).update(price.key).addClassName((product.priceMatchRule && price.key===product.priceMatchRule.priceMatchCompany.companyName) ? 'success' : '') })
				.insert({'bottom': new Element('td').update(price.value.priceURL && !price.value.priceURL.blank() ? new Element('a', {'href': price.value.priceURL, 'target': '__blank'}).update(tmp.me.getCurrency(price.value.price)) : tmp.me.getCurrency(price.value.price)) })
			})
		});
		tmp.priceDiff = parseFloat(prices.myPrice) - parseFloat(tmp.minPrice);
		tmp.priceDiffClass = '';
		if(parseInt(tmp.minPrice) !== 0) {
			if(parseInt(tmp.priceDiff) > 0)
				tmp.priceDiffClass = 'label label-danger';
			else if (parseInt(tmp.priceDiff) < 0)
				tmp.priceDiffClass = 'label label-success';
		}
		tmp.newDiv = new Element('table', {'class': 'table table-striped table-hover price-match-listing'})
			.insert({'bottom': new Element('thead')
				.insert({'bottom': new Element('tr')
					.insert({'bottom': new Element('th').update('SKU') })
					.insert({'bottom': new Element('th').update('My Price') })
					.insert({'bottom': new Element('th', {'class': 'price_diff'}).update('Price Diff.') })
					.insert({'bottom': new Element('th').update('Min Price') })
				})
			})
			.insert({'bottom': new Element('tbody')
				.insert({'bottom': new Element('tr')
					.insert({'bottom': new Element('td').update(prices.sku) })
					.insert({'bottom': new Element('td').update(tmp.me.getCurrency(prices.myPrice)) })
					.insert({'bottom': new Element('td', {'class': 'price_diff'}).update(new Element('span', {'class': '' + tmp.priceDiffClass}).update(tmp.me.getCurrency(tmp.priceDiff)) ) })
					.insert({'bottom': new Element('td', {'class': 'price_min'}).update(tmp.me.getCurrency(tmp.minPrice) ) })
				})
			})
			.insert({'bottom': new Element('thead')
				.insert({'bottom': new Element('tr')
					.insert({'bottom': new Element('th', {'colspan': 3}).update('Company') })
					.insert({'bottom': new Element('th').update('Price') })
				})
			})
			.insert({'bottom': tmp.tbody });
		return tmp.newDiv;
	}
	/**
	 * get info panel
	 */
	,_getInfoPanel: function(product) {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'id': 'info_panel_' + product.id})
			.insert({'bottom': new Element('div', {'class': 'col-xs-12'})
				.insert({'bottom': new Element('div', {'class': 'panel panel-default price-match-div'})
					.insert({'bottom': new Element('div', {'class': 'panel-heading'}).update('<strong>Price Match</strong>') })
					.insert({'bottom': new Element('div', {'class': 'panel-body price-match-listing'}).update(tmp.me.getLoadingImg()) })
				})
			})
			;
		return tmp.newDiv;
	}
	/**
	 * initialing the js for date picker
	 */
	,_bindDatePicker: function(editEl) {
		
		var tmp = {};
		tmp.me = this;
		etaCtl = editEl.down('.datepicker');
		tmp.me._signRandID(etaCtl);
		jQuery('#' + etaCtl.id).datetimepicker({
			format: 'YYYY-MM-DD',
			useCurrent: false
		});
		var dvalue = jQuery('#' + etaCtl.id).attr('value');
		if (dvalue)
		{
			jQuery('#' + etaCtl.id).data('DateTimePicker').date(new Date(dvalue));
		}
		jQuery('#' + etaCtl.id).on("dp.change", function (e) {
			var newDate = e.date ? e.date.format('YYYY-MM-DD') : '';
			var oldDate = e.oldDate? e.oldDate.format('YYYY-MM-DD') : '';
			var poId = jQuery(this).attr('poId');
			if (!poId) 
			{
				jQuery(this).val("").datetimepicker('update');
				return;
			}
			tmp.me._updateETA(jQuery(this).attr('product-id'), poId, newDate, oldDate);
		});
		return tmp.me;
	}
	/**
	 * generate report
	 */
	,genReport: function(btn) {
		var tmp = {};
		tmp.me = this;
		
		tmp.resultDiv = $(tmp.me.resultDivId);

		tmp.me.postAjax(tmp.me.getCallbackId('genReport'), {'searchCriteria': tmp.me._searchCriteria}, {
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
					if(!tmp.result || !tmp.result.url)
						return;
					tmp.newWind = window.open(tmp.result.url);
					if(!tmp.newWind) {
						throw 'You browser is blocking the popup window, please click <a class="btn btn-xs btn-primary" href="' + tmp.result.url + '" target="__BLANK">here</a> to open it manually.';
					}
					
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
		return tmp.me;
	}
});