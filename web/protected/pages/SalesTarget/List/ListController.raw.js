/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
	/**
	 * get title of the row
	 */
	_getTitleRowData: function() {
		return {'id' : 'ID', 'dfrom': 'From', 'dto': 'To', 'dperiod': 'Period', 'targetrevenue': 'Revenue(Incl.)', 'targetprofit': 'Profit(Incl.)'};
	}
	/**
	 * bind the key event to search button
	 */
	,_bindSearchKey: function() {
		var tmp = {}
		tmp.me = this;
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
	 * show the edit panel
	 */
	,_getEditPanel: function(row) {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'}).store('data', row)
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'disabled': true, 'class': 'form-control', 'save-item-panel': 'id', 'value': row.id ? row.id : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-12'})
					.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control input-sm datepicker', 'placeholder': 'The start date of the sales period', 'save-item-panel': 'dfrom', 'value': row.dfrom ? row.dfrom : ''}) })
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-12'})
					.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control input-sm datepicker', 'placeholder': 'The end date of the sales period', 'save-item-panel': 'dto', 'value': row.dto ? row.dto : ''}) })
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'disabled': true, 'class': 'form-control', 'save-item-panel': 'dperiod', 'value': row.dperiod ? row.dperiod : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control', 'placeholder': 'The revenue of the sales period', 'validate_currency': true, 'save-item-panel': 'targetrevenue', 'value': row.targetrevenue ? tmp.me._getCurrency(row.targetrevenue) : ''}) })
					.observe('change', function(){
						tmp.me._currencyInputChanged(tmp.newDiv.down('[save-item-panel=targetrevenue]'));
					})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control', 'placeholder': 'The profit of the sales period', 'validate_currency': true, 'save-item-panel': 'targetprofit', 'value': row.targetprofit ? tmp.me._getCurrency(row.targetprofit) : ''}) })
					.observe('change', function(){
						tmp.me._currencyInputChanged(tmp.newDiv.down('[save-item-panel=targetprofit]'));
					})
			})
			.insert({'bottom': new Element('td', {'class': 'text-right'})
				.insert({'bottom':  new Element('span', {'class': 'btn-group btn-group-sm'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-success', 'title': 'Save'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-ok'}) })
						.observe('click', function(){
							tmp.btn = this;
							tmp.me._saveItem(tmp.btn, $(tmp.btn).up('.save-item-panel'), 'save-item-panel');
							if (jQuery('.item_row'))
							{
								if (jQuery('.alert')) 
									jQuery('.alert').remove();
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
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? '' : 'btn-hide-row')}).store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-1'}).update(row.id) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-2'}).update(row.dfrom) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-2'}).update(row.dto) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-1'}).update(row.dperiod) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-2'}).update(tmp.isTitle === true ? row.targetrevenue : tmp.me._getCurrency(row.targetrevenue)) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-2'}).update(tmp.isTitle === true ? row.targetprofit : tmp.me._getCurrency(row.targetprofit)) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'text-right col-xs-2 '}).update(
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
						tmp.me._bindDatePicker(tmp.newEditEl);
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
							tmp.me._bindDatePicker(tmp.editEl);
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-danger', 'title': 'Delete'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-trash'}) })
						.observe('click', function(){
							if(!confirm('Are you sure you want to delete this item?'))
								return false;
							tmp.me._deleteItem(row);
						})
					}) ) 
			) })
		return tmp.row;
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
	 * initialing the js for date picker
	 */
	,_bindDatePicker: function(editEl) {
		
		var tmp = {};
		tmp.me = this;
		dfromCtl = editEl.down('[save-item-panel="dfrom"]');
		tmp.me._signRandID(dfromCtl);

		dtoCtl = editEl.down('[save-item-panel="dto"]');
		tmp.me._signRandID(dtoCtl);
		
		jQuery('#' + dfromCtl.id).datetimepicker({
			format: 'YYYY-MM-DD'
		});
		jQuery('#' + dtoCtl.id).datetimepicker({
			format: 'YYYY-MM-DD'
		});
		var dvalue = jQuery('#' + dfromCtl.id).attr('value');
		if (dvalue)
		{
			jQuery('#' + dfromCtl.id).data('DateTimePicker').date(new Date(dvalue));
		}
		else
		{
			jQuery('#' + dfromCtl.id).data('DateTimePicker').date(new Date());
			jQuery('#' + dfromCtl.id).attr('value', jQuery('#' + dfromCtl.id).data('DateTimePicker').date().utc().format('YYYY-MM-DD'));
		}
		
		var dvalue = jQuery('#' + dtoCtl.id).attr('value');
		if (dvalue)
		{
			jQuery('#' + dtoCtl.id).data('DateTimePicker').date(new Date(dvalue));
		}
		else
		{
			jQuery('#' + dtoCtl.id).data('DateTimePicker').date(new Date());
			jQuery('#' + dtoCtl.id).attr('value', jQuery('#' + dtoCtl.id).data('DateTimePicker').date().utc().format('YYYY-MM-DD'));
		}
		
		jQuery('#' + dfromCtl.id).data("DateTimePicker").maxDate(jQuery('#' + dtoCtl.id).data('DateTimePicker').date().utc().format('YYYY-MM-DD'));
		jQuery('#' + dtoCtl.id).data("DateTimePicker").minDate(jQuery('#' + dfromCtl.id).data('DateTimePicker').date().utc().format('YYYY-MM-DD'));
		
		jQuery('#' + dfromCtl.id).on("dp.change", function (e) {
			jQuery('#' + dtoCtl.id).data("DateTimePicker").minDate(e.date);
		});
		jQuery('#' + dtoCtl.id).on("dp.change", function (e) {
			jQuery('#' + dfromCtl.id).data("DateTimePicker").maxDate(e.date);
		});
		return tmp.me;
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
	}
});