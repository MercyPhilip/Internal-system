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
		return {'sku': 'SKU', 'name': 'Product Name','manufacturer' : {'name': 'Brand'}, 'supplierCodes': [{'supplier': {'name': 'Supplier'}, 'code': ''}],  'stockOnHand': 'SOH'};
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
	 * Getting each row for displaying the result list
	 */
	,_getResultRow: function(row, isTitle) {
		var tmp = {};
		tmp.me = this;
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		
		if (row.totalOnHandValue != 0 && row.stockOnHand != 0)
		{
			tmp.avgcost = row.totalOnHandValue/row.stockOnHand;
			tmp.avgcost = tmp.me.getCurrency(tmp.avgcost);
		}
		else
		{
			tmp.avgcost = 'N/A';
		}
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? '' : 'btn-hide-row'), 'product_id' : row.id})
			.store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'sku', 'title': row.name}).addClassName('col-xs-1')
				.insert({'bottom':tmp.isTitle === true ? row.sku : new Element('a', {'href': '/product/' + row.id + '.html', 'target': '_BLANK', 'class': 'sku-link truncate'})
				.update(row.sku)
				})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'product_name hidden-xs hide-when-info hidden-sm'})
				.addClassName('col-xs-2').insert({'bottom': row.name})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'manufacturer hidden-xs hide-when-info hidden-sm', 'style' : 'width:5%'}).addClassName('col-xs-1').update(row.manufacturer ? row.manufacturer.name : '') })
			.insert({'bottom': new Element(tmp.tag, {'class': 'stock'}).addClassName('col-xs-7').update(
					tmp.isTitle === true ?
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-4', 'title': 'Stock on Hand'}).update('SOH') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4 ', 'title': 'Total Stock On Hand Value'}).update('SOHV') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4 ', 'title': 'Average Cost'}).update('Average Cost') })
							:
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-4', 'title': 'Stock on Hand'}).update(row.stockOnHand) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4', 'title': 'Total Stock on Hand Value'}).update(tmp.me.getCurrency(row.totalOnHandValue)) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-4 ', 'title': 'Average Cost'}).update(tmp.avgcost) })
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
//							tmp.editEl.down('.form-control[save-item-panel]').focus();
//							tmp.editEl.down('.form-control[save-item-panel]').select();
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
		if (row.totalOnHandValue != 0 && row.stockOnHand != 0)
		{
			tmp.avgcost = row.totalOnHandValue/row.stockOnHand;
			tmp.avgcost = tmp.me.getCurrency(tmp.avgcost);
		}
		else
		{
			tmp.avgcost = 'N/A';
		}
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'}).store('data', row)
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-1 '})
				.insert({'bottom': new Element('span', {'class': ' sku'})
					.insert({'bottom': row.sku })
				})
				.insert({'bottom': new Element('input', {'class': '', 'type': 'hidden','save-item-panel': 'id', 'value': row.id})
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-2 hidden-xs hide-when-info hidden-sm '})
				.insert({'bottom': new Element('span', {'class': 'productname'})
					.insert({'bottom': row.name })
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-1 hidden-xs hide-when-info hidden-sm '})
				.insert({'bottom': new Element('span', {'class': 'brand'})
					.insert({'bottom': row.manufacturer ? row.manufacturer.name : '' })
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-7'}).update(
				new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('span', {'class': ' col-xs-4 StockOnPO'})
					.insert({'bottom': new Element('input', {'class': 'form-control', 'name': 'Stock on Hand', 'save-item-panel': 'stockOnHand', 'placeholder': 'Stock On Hand', 'type': 'number', 'value': row.stockOnHand ? row.stockOnHand : 0}) })
						.observe('keydown', function(event){
							tmp.txtBox = $(this);
							tmp.me.keydown(event, function() {
								tmp.txtBox.up('.item_row').down('[save-item="totalOnHandValue"]').select();
							});
						})
						.observe('keyup', function(){
							tmp.txtBox = $(this);
							tmp.valueBox = tmp.txtBox.up('.item_row').down('[save-item="totalOnHandValue"]');
								tmp.valueBox.value = tmp.me.getCurrency(row.unitCost * $F(tmp.txtBox.down('input')));
						})
						.observe('click', function(event){
							$(this).down('input').select();
						})
				})
				.insert({'bottom': new Element('span', {'class': ' col-xs-4 totalOnHandValue'})
					.insert({'bottom': new Element('input', {'class': 'form-control', 'disabled': true, 'name': 'Total Stock on Hand Value', 'save-item': 'stockOnHandValue', 'placeholder': 'Stock On Hand Value', 'type': 'value', 'value': row.totalOnHandValue ? tmp.me.getCurrency(row.totalOnHandValue) : tmp.me.getCurrency(0)}) })
						.observe('keydown', function(event){
							tmp.txtBox = $(this);
							tmp.me.keydown(event, function() {
								tmp.txtBox.up('.item_row').down('[save-item="stockOnOrder"]').select();
							});
						})
						.observe('click', function(event){
							$(this).down('input').select();
						})
						.observe('change', function(event){
							$(this).down('input').value = tmp.me.getCurrency(tmp.me.getValueFromCurrency($(this).down('input').value));
						})
				})
				.insert({'bottom': new Element('span', {'class': ' col-xs-4 averagecost'})
					.insert({'bottom': tmp.avgcost  })
				})
			)
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
});