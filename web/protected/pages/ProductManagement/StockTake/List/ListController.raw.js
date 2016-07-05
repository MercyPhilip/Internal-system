/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
	manufactures: []
	,suppliers: []
	,productCategories: []
	,productStatuses: []
	,_locationTypes: [] //pre defined data: locationTypes
	,_nextPageColSpan: 9
	,_autoLoading: false
	,_getTitleRowData: function() {
		return {'sku': 'SKU', 'name': 'Product Name','manufacturer' : {'name': 'Brand'}, 'supplierCodes': [{'supplier': {'name': 'Supplier'}, 'code': ''}],  'stockOnHand': 'SOH'};
	}
	/**
	 * Set some pre defined data before javascript start
	 */
	,setPreData: function(locationTypes) {
		this._locationTypes = locationTypes;
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
	 * Getting the locations for a product
	 */
	,_getLocations: function (locations) {
		var tmp = {};
		tmp.me = this;
		if (!locations) return '';
		tmp.locationStrings = [];
		locations.each(function(location) {
			tmp.locationStrings.push('<div><small><strong class="hidden-xs hide-when-info hidden-sm">' + location.type.name + ': </strong><abbr title="Type: '  + location.type.name + '">' + location.value + ': </abbr>' + location.counting + ' </small></div>');
		})
		return tmp.locationStrings.join('');
	}
	/**
	 * Getting the locations for a product
	 */
	,_getTotalCounting: function (locations) {
		var tmp = {};
		tmp.me = this;
		if (!locations) return '';
		tmp.totalCounting = 0;
		locations.each(function(location) {
			tmp.totalCounting = parseInt(tmp.totalCounting) + parseInt(location.counting);
		})
		return tmp.totalCounting;
	}
	/**
	 * Getting each row for displaying the result list
	 */
	,_getResultRow: function(row, isTitle) {
		var tmp = {};
		tmp.me = this;
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? '' : 'btn-hide-row'), 'product_id' : row.id})
			.store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'sku', 'title': row.name}).addClassName('col-xs-1')
				.insert({'bottom':tmp.isTitle === true ? row.sku : new Element('a', {'href': '/product/' + row.id + '.html', 'target': '_BLANK', 'class': 'sku-link truncate'})
				.update(row.sku)
				})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'manufacturer hidden-xs hide-when-info hidden-sm', 'style' : 'width:5%'}).addClassName('col-xs-1').update(row.manufacturer ? row.manufacturer.name : '') })
			.insert({'bottom': new Element(tmp.tag, {'class': 'stock'}).addClassName('col-xs-1').update(
					tmp.isTitle === true ?
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-12', 'title': 'Current Stock on Hand'}).update('Current SOH') })
							:
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-12', 'title': 'Current Stock on Hand'}).update(row.stockOnHand) })
								)
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'stock'}).addClassName('col-xs-8').update(
					tmp.isTitle === true ?
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-3', 'title': 'Stock Counting'}).update('Totoal Counting') })
								.insert({'bottom': new Element('div', {'class': 'col-xs-9 ', 'title': 'Locations'}).update('Locations') })
							:
							new Element('div', {'class': 'row'})
								.insert({'bottom': new Element('div', {'class': 'col-xs-3', 'title': 'TotalQuantity'}).update(tmp.me._getTotalCounting(row.locations)) })
								.insert({'bottom': new Element('div', {'class': 'col-xs-9', 'title': 'Locations'}).update(tmp.me._getLocations(row.locations)) })
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
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'}).store('data', row)
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-1 '})
				.insert({'bottom': new Element('span', {'class': ' sku'})
					.insert({'bottom': row.sku })
				})
				.insert({'bottom': new Element('input', {'class': '', 'type': 'hidden','save-item-panel': 'id', 'value': row.id})
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-1 hidden-xs hide-when-info hidden-sm '})
				.insert({'bottom': new Element('span', {'class': 'brand'})
					.insert({'bottom': row.manufacturer ? row.manufacturer.name : '' })
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-1'}).update(
				new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('span', {'class': ' col-xs-12 stockOnHand'})
					.insert({'bottom': row.stockOnHand ? row.stockOnHand : 0 })
				})
			)
			})
			.insert({'bottom': new Element('td', {'class': 'form-group col-xs-8'}).update(
				new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('span', {'class': ' col-xs-3 quantity'})
					.insert({'bottom': tmp.me._getTotalCounting(row.locations) })
				})
				.insert({'bottom': new Element('span', {'class': ' col-xs-9 locations'})
					.insert({'bottom': tmp.me._getListPanel('Locations:', row.locations, {'counting' : 'Counting', 'type': 'Type', 'value': 'value'}, tmp.me._locationTypes).wrap(new Element('div', {'class': 'col-xs-12 locations-panel'})) })
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
					.insert({'bottom': new Element('span', {'class': 'btn btn-primary', 'title': 'Apply'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-saved'}) })
						.observe('click', function(){
							tmp.btn = this;
							tmp.data = tmp.me._applystockonhand(tmp.btn, $(tmp.btn).up('.save-item-panel'), 'save-item-panel');
							if (tmp.data)
							{
								if (jQuery('.tooltip'))
									jQuery('.tooltip').remove();
							}
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
	,_getListPanelRow: function(data, selBoxData, titleData, isTitle, selBoxChangeFunc) {
		var tmp = {};
		tmp.me = this;
		tmp.isTitle = (isTitle || false);
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.countingString = titleData.counting.toLowerCase();
		tmp.typeString = titleData.type.toLowerCase();
		tmp.valueString = titleData.value.toLowerCase();
		tmp.randId = 'NEW_' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
		tmp.inputBoxDiv = new Element('div', {'class': 'input-group input-group-sm'})
		.insert({'bottom': new Element('input', {'type': 'number', 'class': 'form-control', 'list-panel-row': 'counting', 'required': true, 'value': data[tmp.countingString] ? data[tmp.countingString] : ''})
			.writeAttribute('list-item', (data.id ? data.id : tmp.randId))
		})
		.observe('click', function(event){
			$(this).down('input').select();
		});
		tmp.newRow = new Element('tr')
			.insert({'bottom': new Element(tmp.tag).update( tmp.isTitle === true ? titleData.counting : tmp.inputBoxDiv.wrap(new Element('div', {'class': 'form-group'})) ) })
			.insert({'bottom': new Element(tmp.tag).update(
					tmp.isTitle === true ? titleData.type :
					tmp.me._getSelBox(selBoxData, (data[tmp.typeString] && data[tmp.typeString].id ? data[tmp.typeString].id : ''))
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
			.insert({'bottom': new Element('input', {'type': 'text', 'class': 'form-control', 'list-panel-row': 'value', 'required': true, 'value': (data[tmp.valueString] ? data[tmp.valueString]: '') })
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
				})
			});
		tmp.newRow.insert({'bottom': new Element(tmp.tag).update( tmp.isTitle === true ? titleData.value : tmp.inputBoxDiv.wrap(new Element('div', {'class': 'form-group'})) ) });
		return tmp.newRow;
	}
	/**
	 * General listing panel
	 */
	,_getListPanel: function(title, listData, titleData, selBoxData, selBoxChangeFunc) {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'panel panel-default'})
		.insert({'bottom': new Element('span', {'class': 'btn btn-primary btn-xs pull-right', 'title': 'New'})
			.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-plus'}) })
				.insert({'bottom': ' NEW' })
				.observe('click', function(){
					tmp.parentPanel = $(this).up('.panel');
					tmp.newData = {};
					tmp.parentPanel.down('.table tbody').insert({'bottom': tmp.me._getListPanelRow(tmp.newData, selBoxData, titleData, false, selBoxChangeFunc).addClassName('list-panel-row').writeAttribute('item_id', '') });
					tmp.parentPanel.down('.list-div').show();
				})
		})
		.insert({'bottom': new Element('div', {'class': 'list-div table-responsive'})
				.insert({'bottom': new Element('table', {'class': 'table table-condensed', 'style' : 'width : auto'})
					.insert({'bottom': new Element('thead').update( tmp.me._getListPanelRow(titleData, selBoxData, titleData, true, selBoxChangeFunc) ) })
					.insert({'bottom': tmp.listDiv = new Element('tbody') })
				})
			});
		if(listData) {
			listData.each(function(data){
				tmp.listDiv.insert({'bottom': tmp.me._getListPanelRow(data, selBoxData, titleData, false, selBoxChangeFunc).addClassName('list-panel-row').writeAttribute('item_id', data.id) });
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
		//get all locations
		tmp.data.locations = tmp.me._collectFormData(savePanel.down('.locations-panel'), 'list-panel-row', 'list-item');
		if(tmp.data.locations === null)
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
						$(tmp.me.resultDivId).down('tbody').insert({'top': tmp.newRow });
						savePanel.remove();
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
	 * apply stock to product
	 */
	,_applystockonhand: function(btn, savePanel, attrName) {
		var tmp = {};
		tmp.me = this;
		tmp.data = tmp.me._collectFormData(savePanel, attrName);
		if(tmp.data === null)
			return;
		//get all locations
		tmp.data.locations = tmp.me._collectFormData(savePanel.down('.locations-panel'), 'list-panel-row', 'list-item');
		if(tmp.data.locations === null)
			return;
		tmp.me.postAjax(tmp.me.getCallbackId('applyStockOnHandBtn'), {'item': tmp.data}, {
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
						$(tmp.me.resultDivId).down('tbody').insert({'top': tmp.newRow });
						savePanel.remove();
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

});