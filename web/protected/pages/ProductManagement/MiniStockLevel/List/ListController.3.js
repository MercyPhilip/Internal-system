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
						tmp.me._bindDatePicker(tmp.newRow);
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
					tmp.row.replace(tmp.newRow = tmp.me._getResultRow(tmp.result.item, false));
					tmp.me._bindDatePicker(tmp.newRow);
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
	 * update eta
	 */
	,_updateETA: function(productId, poId, newETA, oldETA) {
		var tmp = {};
		tmp.me = this;
		tmp.me.postAjax(tmp.me.getCallbackId('updateETA'), {'productId' : productId, 'poId': poId, 'newETA': newETA, 'oldETA' : oldETA}, {
			'onLoading': function() {}
		,'onSuccess': function(sender, param) {
			try {
				tmp.result = tmp.me.getResp(param, false, true);
				if(!tmp.result || !tmp.result.item || !tmp.result.item.id)
					return;
				tmp.row = $(tmp.me.resultDivId).down('.product_item[product_id=' + tmp.result.item.id + ']');
				if(tmp.row) {
					tmp.row.replace(tmp.newRow = tmp.me._getResultRow(tmp.result.item, false));
					tmp.me._bindDatePicker(tmp.newRow);
					tmp.me._bindPriceInput();
				}
			} catch (e) {
				tmp.me.showModalBox('<strong class="text-danger">Error When Update ETA :</strong>', '<strong>' + e + '</strong>');
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
		return tmp.me;
	}
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
								tmp.me.getResults(false, tmp.me._pagination.pageSize, true);
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
		tmp.row = new Element('tr', {'class': 'visible-xs visible-md visible-lg visible-sm ' + (tmp.isTitle === true ? '' : 'product_item '), 'product_id' : row.id})
			.store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'sku', 'title': row.name}).addClassName('col-xs-1')
				.insert({'bottom':row.sku})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'product_name hidden-xs hide-when-info hidden-sm'})
				.addClassName('col-xs-2').insert({'bottom': row.name})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'manufacturer hide-when-info', 'style' : 'width:5%'}).addClassName('col-xs-1').update(row.manufacturer ? row.manufacturer.name : '') })
			.insert({'bottom': new Element(tmp.tag, {'class': 'supplier hide-when-info hidden-sm', 'style' : 'width:5%'}).addClassName('col-xs-1').update(
					row.supplierCodes ? tmp.me._getSupplierCodes(row.supplierCodes, isTitle) : '')
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'hidden-xs hide-when-info hidden-sm row'}).addClassName('col-xs-3')
				.insert({'bottom': new Element('div', {'class': 'col-sm-4'}).update(tmp.isTitle === true ? 'Last Buy Price' : tmp.me.getCurrency(row.lastbuyprice))})
				.insert({'bottom': new Element('div', {'class': 'col-sm-4'}).update(tmp.isTitle === true ? 'Mini Stock Level' : new Element('input', {'class': "click-to-edit stockMinLevel-input", 'value': row.stockMinLevel, 'product-id': row.id}).setStyle('width: 80%') ) })
				.insert({'bottom': new Element('div', {'class': 'col-sm-4'}).update(tmp.isTitle === true ? 'ETA' : new Element('input', {'class': "click-to-edit eta-input datepicker", 'value': row.eta, 'poId': row.poId, 'product-id': row.id}).setStyle('width: 100%') ) })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'qty hidden-sm'}).addClassName('col-xs-2').update(
					tmp.isTitle === true ?
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-6', 'title': 'Stock on Hand'}).update('SH') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-6 hide-when-info', 'title': 'Stock On PO'}).update('SP') })
							:
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-6', 'title': 'Stock on Hand'}).update(row.stockOnHand) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-6 hide-when-info', 'title': 'Stock On PO'}).update(row.stockOnPO) })
					)
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'runrate hidden-sm'}).addClassName('col-xs-2').update(
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
	// output excel
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