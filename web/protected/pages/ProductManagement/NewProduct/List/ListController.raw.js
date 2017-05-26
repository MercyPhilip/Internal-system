/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
	/**
	 * get title of the row
	 */
	_getTitleRowData: function() {
		return {'id' : 'ID', 'sku': 'Sku', 'name': 'Name', 'category': 'Category', 'price': 'Price', 'stock' : 'Stock Level',  'status': 'Processing Status', 'localOnly': 'Local Only'};
	}
	/**
	 * Load the _loadProductStatuses
	 */
	,_loadNewProductStatuses: function(productStatuses) {
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
		jQuery(".select2").select2({
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
		$('searchPanel').getElementsBySelector('[search_field]').each(function(item) {
			item.observe('keydown', function(event) {
				tmp.me.keydown(event, function() {
					$(tmp.me.searchDivId).down('#searchBtn').click();
				});
			})
		});
		return this;
	}
	/**
	 * export csv report
	 */
	,genReport: function(btn) {
		var tmp = {};
		tmp.me = this;
		tmp.data = {};
		$$('[search_field]').each(function(item){
			tmp.data[item.readAttribute('search_field')] = $F(item);
		});
		tmp.me.postAjax(tmp.me.getCallbackId('genReportmBtn'), tmp.data, {
			'onLoading': function() {
				jQuery(btn).button('loading');
			}
			,'onSuccess': function (sender, param) {
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result || !tmp.result.url)
						return;
					tmp.newWind = window.open(tmp.result.url);
					if(!tmp.newWind) {
						throw 'You browser is blocking the popup window, please click <a class="btn btn-xs btn-primary" href="' + tmp.result.url + '" target="__BLANK">here</a> to open it manually.';
					}
				} catch (e) {
					tmp.me.showModalBox('<b>Error:</b>', '<b class="text-danger">' + e + '</b>');
				}
			}
			,'onComplete': function() {
				jQuery(btn).button('reset');
			}
		})
		return tmp.me;
	}
	/**
	 * show the edit panel
	 */
	,_getEditPanel: function(row) {
		var tmp = {};
		tmp.me = this;
		tmp.categories = '';
		if (row.product && row.product.categories)
		{
			row.product.categories.each(function(item) {
				tmp.categories = (tmp.categories == '' ? item.name : tmp.categories + ',' + item.name);
			});
		}
		tmp.price = '';
		if (row.product && row.product.prices)
		{
			row.product.prices.each(function(price) {
				if(price.type && parseInt(price.type.id) === 1) {
					tmp.price = price.price;
				}
			});
		}
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'}).store('data', row)
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'disabled': true, 'class': 'form-control', 'save-item-panel': 'id', 'value': row.id ? row.id : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-12'})
					.insert({'bottom': new Element('input', {'required': true, 'disabled': row.id ? true: false, 'class': 'form-control input-sm ', 'placeholder': 'The SKU', 'save-item-panel': 'sku', 'value': row.product && row.product.sku ? row.product.sku : ''}) })
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-12'})
					.insert({'bottom': new Element('input', {'class': 'form-control input-sm ', 'placeholder': 'The Name', 'save-item-panel': 'name', 'value': row.product && row.product.name ? row.product.name : ''}) })
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'class': 'chosen form-control input-sm', 'entityName' : 'ProductCategory', 'placeholder': 'The Category','save-item-panel': 'category', 'rowid': row.id ? row.id : '', 'value': row.product && row.product.categories ? row.product.categories : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'class': 'form-control', 'placeholder': 'The Price', 'validate_currency': true, 'save-item-panel': 'price', 'value': tmp.price ? tmp.me._getCurrency(tmp.price) : ''}) })
					.observe('change', function(){
						tmp.me._currencyInputChanged(tmp.newDiv.down('[save-item-panel=price]'));
					})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'class': 'chosen form-control input-sm', 'entityName' : 'ProductStatus', 'placeholder': 'The Stock Level', 'save-item-panel': 'stock', 'value': row.product && row.product.status ? row.product.status.name : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'disabled': row.id ? false: true,'class': 'chosen form-control input-sm', 'entityName' : 'NewProductStatus', 'placeholder': 'The Status', 'save-item-panel': 'status', 'value': row.status && row.status.name ? row.status.name : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'type': 'checkbox', 'disabled': row.id ? false: true, 'class': 'chosen form-control input-sm', 'save-item-panel': 'localOnly', 'checked': false }) })
			})
			.insert({'bottom': new Element('td', {'class': 'text-right'})
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
	 * get the row info
	 */
	,_getResultRow: function(row, isTitle) {
		var tmp = {};
		tmp.me = this;
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.categories = '';
		if (row.product && row.product.categories)
		{
			row.product.categories.each(function(item) {
				tmp.categories = (tmp.categories == '' ? item.name : tmp.categories + ',' + item.name);
			});
		}
		tmp.price = '';
		if (row.product && row.product.prices)
		{
			row.product.prices.each(function(price) {
				if(price.type && parseInt(price.type.id) === 1) {
					tmp.price = price.price;
				}
			});
		}
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? '' : 'btn-hide-row')}).store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'name'}).update(tmp.isTitle === true ? row.id : row.id) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-1'}).update(tmp.isTitle === true ? row.sku : row.product.sku) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-3'}).update(tmp.isTitle === true ? row.name : row.product.name) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-3'}).update(tmp.isTitle === true ? row.category : tmp.categories) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-1'}).update(tmp.isTitle === true ? row.price : tmp.me._getCurrency(tmp.price)) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-1'}).update(tmp.isTitle === true ? row.stock : row.product.status? row.product.status.name : '') })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-1'}).update(tmp.isTitle === true ? row.status : row.status.name) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name'}).update(tmp.isTitle === true ? row.localOnly : new Element('input', {'disabled': true, 'class': 'localOnly', 'type': 'checkbox', 'checked': row.product.localOnly})) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'text-right col-xs-1 '}).update(
				tmp.isTitle === true ?  
				(new Element('span', {'class': 'btn btn-primary btn-xs', 'title': 'New'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-plus'}) })
					.insert({'bottom': ' NEW' })
					.observe('click', function(){
						$(this).up('thead').insert({'bottom': tmp.newEditEl = tmp.me._getEditPanel({}) });
						tmp.newEditEl.down('.form-control[save-item-panel]').focus();
						tmp.newEditEl.down('.form-control[save-item-panel]').select();
						tmp.newEditEl.getElementsBySelector('.form-control[save-item-panel]').each(function(item) {
							item.observe('keydown', function(event){
								tmp.me.keydown(event, function() {
									tmp.newEditEl.down('.btn-success span').click();
								});
								return false;
							})
						});
						tmp.me._loadSelectOptions(null, tmp.newEditEl);
					})
				)
				: (new Element('span', {'class': 'btn-group btn-group-xs'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-default', 'title': 'Edit'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-pencil'}) })
						.observe('click', function(){
							$(this).up('.item_row').replace(tmp.editEl = tmp.me._getEditPanel(row));
							tmp.editEl.down('.form-control[save-item-panel]').focus();
							tmp.editEl.down('.form-control[save-item-panel]').select();
							tmp.editEl.getElementsBySelector('.form-control[save-item-panel]').each(function(item) {
								item.observe('keydown', function(event){
									tmp.me.keydown(event, function() {
										tmp.editEl.down('.btn-success span').click();
									});
									return false;
								})
							});
							tmp.me._loadSelectOptions(row, tmp.editEl);
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
					.insert({'bottom': new Element('a', {'class': 'btn btn-success', 'title': 'Full Edit', 'href': '/product/' + row.product.id + '.html', 'target': '_BLANK'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-edit'}) })
					})
				) 
			) })
		return tmp.row;
	}
	/**
	 * delete row
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
					if(!tmp.result)
						return;
					tmp.count = $(tmp.me.totalNoOfItemsId).innerHTML * 1 - 1;
					$(tmp.me.totalNoOfItemsId).update(tmp.count <= 0 ? 0 : tmp.count);
					if(tmp.row) {
						tmp.row.remove();
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
	 * format the currency
	 */
	,_getCurrency: function(number, dollar, decimal, decimalPoint, thousandPoint) {
		var tmp = {};
		tmp.decimal = (isNaN(decimal = Math.abs(decimal)) ? 2 : decimal);
		tmp.dollar = (dollar == undefined ? "$" : dollar);
		tmp.decimalPoint = (decimalPoint == undefined ? "." : decimalPoint);
		tmp.thousandPoint = (thousandPoint == undefined ? "," : thousandPoint);
		tmp.sign = (number < 0 ? "-" : "");
		tmp.Int = parseInt(number = Math.abs(+number || 0).toFixed(tmp.decimal)) + "";
		tmp.j = (tmp.j = tmp.Int.length) > 3 ? tmp.j % 3 : 0;
		return tmp.dollar + tmp.sign + (tmp.j ? tmp.Int.substr(0, tmp.j) + tmp.thousandPoint : "") + tmp.Int.substr(tmp.j).replace(/(\d{3})(?=\d)/g, "$1" + tmp.thousandPoint) + (tmp.decimal ? tmp.decimalPoint + Math.abs(number - tmp.Int).toFixed(tmp.decimal).slice(2) : "");
	}
	/**
	 * Getting the absolute value from currency
	 */
	,_getValueFromCurrency: function(currency) {
		if(!currency)
			return '';
		return (currency + '').replace(/\s*/g, '').replace(/\$/g, '').replace(/,/g, '');
	}
	/**
	 * Marking a form group to has-error
	 */
	,_markFormGroupError: function(input, errMsg) {
		var tmp = {};
		tmp.me = this;
		if(input.up('.form-group')) {
			input.store('clearErrFunc', function(btn) {
				input.up('.form-group').removeClassName('has-error');
				jQuery('#' + input.id).tooltip('hide').tooltip('destroy').show();
			})
			.up('.form-group').addClassName('has-error');
			tmp.me._signRandID(input);
			jQuery('#' + input.id).tooltip({
				'trigger': 'manual'
				,'placement': 'auto'
				,'container': 'body'
				,'placement': 'bottom'
				,'html': true
				,'title': errMsg
				,'content': errMsg
			})
			.tooltip('show');
			$(input).observe('change', function(){
				tmp.func = $(input).retrieve('clearErrFunc');
				if(typeof(tmp.func) === 'function')
					tmp.func();
			});
		}
		return tmp.me;
	}
	/**
	 * bind Change EVENT to current box for currency formating
	 */
	,_currencyInputChanged: function(inputBox) {
		var tmp = {};
		tmp.me = this;
		if($F(inputBox).blank()) {
			return false;
		}
		tmp.inputValue = tmp.me._getValueFromCurrency($F(inputBox));
		if(tmp.inputValue.match(/^(-)?\d+(\.\d{1,4})?$/) === null) {
			tmp.me._markFormGroupError(inputBox, 'Invalid currency format provided!');
			return false;
		}
		$(inputBox).value = tmp.me._getCurrency(tmp.inputValue);
		return true;
	},
	/**
	 * load categories and status
	 */
	_loadSelectOptions: function(row, editEl) {
		var tmp = {};
		tmp.me = this;
		var category = editEl.down('.chosen[save-item-panel="category"]');
		var status = editEl.down('.chosen[save-item-panel="status"]');
		var stock = editEl.down('.chosen[save-item-panel="stock"]');
		tmp.me._signRandID(category);
		tmp.me._signRandID(status);
		tmp.me._signRandID(stock);
		
		jQuery('#' + category.id).select2({
			multiple: true,
			allowClear: true,
			ajax: { url: "/ajax/getAll",
				dataType: 'json',
				delay: 10,
				type: 'POST',
				data: function(params, page) {
					return {"searchTxt": 'name like ?', 'searchParams': ['%' + params + '%'], 'entityName': 'ProductCategory', 'pageNo': page};
				},
				results: function (data, page, query) {
					 tmp.result = [];
					 if(data.resultData && data.resultData.items) {
						 data.resultData.items.each(function(item){
							 tmp.result.push({'id': item.id, 'text': item.name, 'data': item});
						 });
					 }
					 return { 'results' : tmp.result, 'more': (data.resultData && data.resultData.pagination && data.resultData.pagination.totalPages && page < data.resultData.pagination.totalPages) };
				},
				cache: true
			},
			formatResult : function(result) {
				if(!result)
					return '';
				return '<div class="row"><div class="col-xs-12">' + result.data.namePath + '</div></div>';
			},
			formatSelection: function(result) {
				if(!result)
					 return '';
				tmp.text = result.text;
				tmp.newDiv = new Element('div').update(tmp.text);
				return tmp.newDiv;
			},
			escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
		});
		jQuery('#' + status.id).select2({
			multiple: false,
			allowClear: true,
			ajax: { url: "/ajax/getAll",
				dataType: 'json',
				delay: 10,
				type: 'POST',
				data: function(params, page) {
					return {"searchTxt": 'name like ?', 'searchParams': ['%' + params + '%'], 'entityName': 'NewProductStatus', 'pageNo': page};
				},
				results: function (data, page, query) {
					 tmp.result = [];
					 if(data.resultData && data.resultData.items) {
						 data.resultData.items.each(function(item){
							 tmp.result.push({'id': item.id, 'text': item.name, 'data': item});
						 });
					 }
					 return { 'results' : tmp.result, 'more': (data.resultData && data.resultData.pagination && data.resultData.pagination.totalPages && page < data.resultData.pagination.totalPages) };
				},
				cache: true
			},
			formatResult : function(result) {
				if(!result)
					return '';
				return '<div class="row"><div class="col-xs-12">' + result.data.name + '</div></div>';
			},
			formatSelection: function(result) {
				if(!result)
					 return '';
				tmp.text = result.text;
				tmp.newDiv = new Element('div').update(tmp.text);
				return tmp.newDiv;
			},
			escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
		});
		jQuery('#' + stock.id).select2({
			multiple: false,
			allowClear: true,
			ajax: { url: "/ajax/getAll",
				dataType: 'json',
				delay: 10,
				type: 'POST',
				data: function(params, page) {
					return {"searchTxt": 'name like ? and id in (2,4,5,8)', 'searchParams': ['%' + params + '%'], 'entityName': 'ProductStatus', 'pageNo': page};
				},
				results: function (data, page, query) {
					 tmp.result = [];
					 if(data.resultData && data.resultData.items) {
						 data.resultData.items.each(function(item){
							 tmp.result.push({'id': item.id, 'text': item.name, 'data': item});
						 });
					 }
					 return { 'results' : tmp.result, 'more': (data.resultData && data.resultData.pagination && data.resultData.pagination.totalPages && page < data.resultData.pagination.totalPages) };
				},
				cache: true
			},
			formatResult : function(result) {
				if(!result)
					return '';
				return '<div class="row"><div class="col-xs-12">' + result.data.name + '</div></div>';
			},
			formatSelection: function(result) {
				if(!result)
					 return '';
				tmp.text = result.text;
				tmp.newDiv = new Element('div').update(tmp.text);
				return tmp.newDiv;
			},
			escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
		});
		if (row)
		{
			if (row.product && row.product.categories)
			{
				tmp.categories = [];
				row.product.categories.each(function(item){
					tmp.categories.push({'id': item.id, 'text': item.name});
				});
				jQuery('#' + category.id).select2('data' , tmp.categories);
			}
			if (row.status)
				jQuery('#' + status.id).select2('data' , {'id': row.status.id, 'text': row.status.name });
			if (row.product && row.product.status)
				jQuery('#' + stock.id).select2('data' , {'id': row.product.status.id, 'text': row.product.status.name });
		}
		return tmp.me;
	}
});