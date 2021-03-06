/**
 * The page Js file
 */
var PageJs = new Class.create();
/**
 * tier level
 */
PageJs.TierLevel = {
	ID_GENERAL: 1 // default
};
PageJs.prototype = Object.extend(new DetailsPageJs(), {
	_customer: {}
	,_tierlevels: []
	/**
	 * Set some pre defined data before javascript start
	 */
	,setPreData: function(customer, tierlevels) {
		this._customer = customer;
		this._tierlevels = tierlevels;
		return this;
	}
	/**
	 * setting Act-on config 
	 */
	,setConfigActon: function(actonSetting) {
		this._actonSetting = actonSetting;
		return this;
	}
	/**
	 * This function should return you the edit div for this item
	 */
	,_getItemDiv: function() {
		var tmp = {};
		tmp.me = this;

		tmp.newDiv = new Element('div', {'class': 'customer-editing-container'})
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': tmp.me._getCustomerSummaryDiv(tmp.me._item).wrap(new Element('div', {'class': 'col-sm-12'})) })
			})
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': tmp.me._getCustomerBillingSummaryDiv(tmp.me._item).wrap(new Element('div', {'class': 'col-sm-6'})) })
				.insert({'bottom': tmp.me._getCustomerShippingSummaryDiv(tmp.me._item).wrap(new Element('div', {'class': 'col-sm-6'})) })
			})
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('span', {'id': 'saveBtn', 'class': 'btn btn-primary pull-right col-sm-4', 'data-loading-text': 'saving ...'}).update('Save')
					.observe('click', function() {
						tmp.me._submitSave(this);
					})
				})
			})
		;
		return tmp.newDiv;
	}
	/**
	 * Ajax: saving the item
	 */
	,_submitSave: function(btn) {
		var tmp = {};
		tmp.me = this;
		tmp.data = tmp.me._collectFormData($(tmp.me.getHTMLID('itemDiv')), 'save-item');
		if(tmp.data === null)
			return tmp.me;
		tmp.data.id = tmp.me._customer.id ? tmp.me._customer.id : '';
		//submit all data
		tmp.me.saveItem(btn, tmp.data, function(data){
			tmp.me.showModalBox('<strong class="text-success">Saved Successfully!</strong>', 'Saved Successfully!', true);
			tmp.me._item = data.item;
			tmp.me.refreshParentWindow();
			window.parent.jQuery.fancybox.close();
		});
		return tmp.me;
	}
	/**
	 * Binding the save key
	 */
	,_bindSaveKey: function() {
		var tmp = {}
		tmp.me = this;
		$$('.customer-editing-container').first().getElementsBySelector('[save-item]').each(function(item) {
			item.observe('keydown', function(event) {
				tmp.me.keydown(event, function() {
					$$('.customer-editing-container').first().down('#saveBtn').click();
				});
			})
		});
		return this;
	}
	,refreshParentWindow: function() {
		var tmp = {};
		tmp.me = this;
		if(!window.parent)
			return;
		tmp.parentWindow = window.parent;
		tmp.row = $(tmp.parentWindow.document.body).down('#' + tmp.parentWindow.pageJs.resultDivId + ' .item_row[item_id=' + tmp.me._item.id + ']');
		if(tmp.row) {
			tmp.row.replace(tmp.parentWindow.pageJs._getResultRow(tmp.me._item).addClassName('success'));
		}
		else
		{
			if (tmp.parentWindow.pageJs && (typeof tmp.parentWindow.pageJs.getSearchCriteria == 'function'))
				tmp.parentWindow.pageJs.getSearchCriteria().getResults(true, tmp.parentWindow.pageJs._pagination.pageSize);
		}
	}
	/**
	 * Load the tier level
	 */
	,_getTierSelBox: function () {
		var tmp = {};
		var tierIdSelected = PageJs.TierLevel.ID_GENERAL; // default is general
		tmp.me = this;
		if(tmp.me._customer && tmp.me._customer.id) {
			tierIdSelected = tmp.me._customer.tier.id;
		}
		//getting the selection box
		tmp.selBox = new Element('select', {'save-item': 'tier'});
		tmp.me._tierlevels.each(function(tier) {
			tmp.opt = new Element('option', {'value': tier.id}).update(tier.name);
			if(tierIdSelected == tier.id) {
				tmp.opt.writeAttribute('selected', true);
			}
			tmp.selBox.insert({'bottom': tmp.opt });
		});
		return tmp.selBox;
	}
	/**
	 * Getting the customer summary div
	 */
	,_getCustomerSummaryDiv: function (item) {
		var tmp = {};
		tmp.me = this;
		tmp.item = item;
		tmp.newDiv = new Element('div', {'class': 'panel panel-default'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'})
				.insert({'bottom': new Element('a', {'href': 'javascript: void(0);', 'title': 'click to show/hide below'})
					.insert({'bottom': new Element('strong').update(tmp.item.name ? 'Editing: ' + tmp.item.name : 'Creating new customer: ') })
				})
				.observe('click', function() {
					$(this).up('.panel').down('.panel-body').toggle();
				})
			})
			.insert({'bottom': new Element('div', {'class': 'panel-body'}) });
		
				tmp.childDiv = new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update(tmp.me._getFormGroup('Company Name / Customer Name', new Element('input', {'required': true, 'save-item': 'name', 'type': 'text', 'value': tmp.item.name ? tmp.item.name : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-2'}).update(tmp.me._getFormGroup('Email', new Element('input', {'save-item': 'email', 'type': 'email', 'value': tmp.item.email ? tmp.item.email : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-2'}).update(tmp.me._getFormGroup('Contact No?', new Element('input', {'save-item': 'contactNo', 'type': 'value', 'value': tmp.item.contactNo ? tmp.item.contactNo : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-1'}).update(tmp.me._getFormGroup('Terms', new Element('input', {'save-item': 'terms', 'type': 'value', 'value': tmp.item.terms ? tmp.item.terms : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-1'}).update(tmp.me._getFormGroup('Credit Left', new Element('input', {'class': 'form-control', 'save-item': 'credit', 'validate_currency': true, 'value': tmp.item.creditpool ? tmp.me.getCurrency(tmp.item.creditpool.totalCreditLeft) : 0}) ) ) })
						.observe('change', function(){
							tmp.me._currencyInputChanged(tmp.newDiv.down('[save-item=credit]'));
						})
					.insert({'bottom': new Element('div', {'class': 'col-sm-1'}).update(tmp.me._getFormGroup('Tier Level', tmp.me._getTierSelBox() ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-1'}).update(tmp.me._getFormGroup('IsBlocked?', new Element('input', {'save-item': 'isBlocked', 'type': 'checkbox', 'checked': tmp.item.isBlocked ? tmp.item.isBlocked : false}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-1'}).update(tmp.me._getFormGroup('Active?', new Element('input', {'save-item': 'active', 'type': 'checkbox', 'checked': tmp.item.active ? tmp.item.active : false}) ) ) });
				
				// Add for grouping customers by philip
				if(tmp.me._actonSetting == 1){
					tmp.childDiv = tmp.childDiv.insert({'bottom': new Element('div', {'class': 'row'})
						.insert({'bottom': new Element('div', {'class': 'col-sm-1'}).update(tmp.me._getFormGroup('Commercial Group', new Element('input', {'save-item': 'groupCom', 'type': 'checkbox', 'checked': tmp.item.groupCom ? tmp.item.groupCom : false}) ) ) })
						.insert({'bottom': new Element('div', {'class': 'col-sm-1'}).update(tmp.me._getFormGroup('Educational Group', new Element('input', {'save-item': 'groupEdu', 'type': 'checkbox', 'checked': tmp.item.groupEdu ? tmp.item.groupEdu : false}) ) ) })
						.insert({'bottom': new Element('div', {'class': 'col-sm-1'}).update(tmp.me._getFormGroup('Gaming Group', new Element('input', {'save-item': 'groupGame', 'type': 'checkbox', 'checked': tmp.item.groupGame ? tmp.item.groupGame : false}) ) ) })
					});
				}
				//end add
				
				tmp.newDiv = tmp.newDiv.insert({'bottom': tmp.childDiv});
		return tmp.newDiv;
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
	}
	/**
	 * copy field between two address fields
	 */
	,_copyInfoFields: function (btn,from,to,tag) {
		var tmp = {};
		tmp.me = this;
		if($$('.customer-editing-container').first().down('#' + from + '-info' + ' #' + from + tag + ' input').value !== '')
			$(btn).up('.panel').down('#' + to + tag +' input').writeAttribute('value',$$('.customer-editing-container').first().down('#' + from + '-info' + ' #' + from + tag + ' input').value);
	}
	/**
	 * Getting the customer billing summary div
	 */
	,_getCustomerBillingSummaryDiv: function (item) {
		var tmp = {};
		tmp.me = this;
		tmp.item = item;
		tmp.address = tmp.item.id && tmp.item.address && tmp.item.address.billing ? tmp.item.address.billing : {};
		tmp.newDiv = new Element('div', {'class': 'panel panel-default', 'id': 'billing-info'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'})
				.insert({'bottom': new Element('strong').update(tmp.item.name ? 'Billing Info: ' + tmp.item.name : 'Billing Info: new customer') })
				.insert({'bottom': new Element('small', {'class': 'pull-right'})
					.insert({'bottom': new Element('button', {'class': 'btn btn-default btn-xs', 'type': 'button'}).update('Copy from Shipping') })
				})
				.observe('click', function() {
					tmp.me._copyInfoFields($(this),'shipping','billing','CompanyName');
					tmp.me._copyInfoFields($(this),'shipping','billing','Name');
					tmp.me._copyInfoFields($(this),'shipping','billing','ContactNo');
					tmp.me._copyInfoFields($(this),'shipping','billing','Street');
					tmp.me._copyInfoFields($(this),'shipping','billing','City');
					tmp.me._copyInfoFields($(this),'shipping','billing','State');
					tmp.me._copyInfoFields($(this),'shipping','billing','Country');
					tmp.me._copyInfoFields($(this),'shipping','billing','Posecode');
				})
			})
			.insert({'bottom': new Element('div', {'class': 'panel-body'})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-12', 'id': 'billingCompanyName'}).update(tmp.me._getFormGroup('Company Name', new Element('input', {'save-item': 'billingCompanyName', 'type': 'text', 'value': tmp.address.companyName ? tmp.address.companyName : ''}) ) ) })
				})
			
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-12', 'id': 'billingName'}).update(tmp.me._getFormGroup('Name', new Element('input', {'save-item': 'billingName', 'type': 'text', 'value': tmp.address.contactName ? tmp.address.contactName : ''}) ) ) })
				})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-12', 'id': 'billingContactNo'}).update(tmp.me._getFormGroup('Contact No.', new Element('input', {'save-item': 'billingContactNo', 'type': 'value', 'value': tmp.address.contactNo ? tmp.address.contactNo : ''}) ) ) })
				})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-6', 'id': 'billingStreet'}).update(tmp.me._getFormGroup('Street', new Element('input', {'save-item': 'billingStreet', 'type': 'text', 'value': tmp.address.street ? tmp.address.street : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-6', 'id': 'billingCity'}).update(tmp.me._getFormGroup('City', new Element('input', {'save-item': 'billingCity', 'type': 'text', 'value': tmp.address.city ? tmp.address.city : ''}) ) ) })
				})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-4', 'id': 'billingState'}).update(tmp.me._getFormGroup('State', new Element('input', {'save-item': 'billingState', 'type': 'text', 'value': tmp.address.region ? tmp.address.region : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-4', 'id': 'billingCountry'}).update(tmp.me._getFormGroup('Country', new Element('input', {'save-item': 'billingCountry', 'type': 'text', 'value': tmp.address.country ? tmp.address.country : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-4', 'id': 'billingPosecode'}).update(tmp.me._getFormGroup('Post Code', new Element('input', {'save-item': 'billingPosecode', 'type': 'text', 'value': tmp.address.postCode ? tmp.address.postCode : ''}) ) ) })
				})
			})
		;
		return tmp.newDiv;
	}
	/**
	 * Getting the customer shipping summary div
	 */
	,_getCustomerShippingSummaryDiv: function (item) {
		var tmp = {};
		tmp.me = this;
		tmp.item = item;
		tmp.address = tmp.item.id && tmp.item.address && tmp.item.address.shipping ? tmp.item.address.shipping : {};
		tmp.newDiv = new Element('div', {'class': 'panel panel-default', 'id': 'shipping-info'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'})
				.insert({'bottom': new Element('strong').update(tmp.item.name ? 'Shipping Info: ' + tmp.item.name : 'Shipping Info: new customer') })
				.insert({'bottom': new Element('small', {'class': 'pull-right'})
					.insert({'bottom': new Element('button', {'class': 'btn btn-default btn-xs', 'type': 'button'}).update('Copy from Billing') })
				})
				.observe('click', function() {
					tmp.me._copyInfoFields($(this),'billing','shipping','CompanyName');
					tmp.me._copyInfoFields($(this),'billing','shipping','Name');
					tmp.me._copyInfoFields($(this),'billing','shipping','ContactNo');
					tmp.me._copyInfoFields($(this),'billing','shipping','Street');
					tmp.me._copyInfoFields($(this),'billing','shipping','City');
					tmp.me._copyInfoFields($(this),'billing','shipping','State');
					tmp.me._copyInfoFields($(this),'billing','shipping','Country');
					tmp.me._copyInfoFields($(this),'billing','shipping','Posecode');
				})
			})
			.insert({'bottom': new Element('div', {'class': 'panel-body'})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-12', 'id': 'shippingCompanyName'}).update(tmp.me._getFormGroup('Company Name', new Element('input', {'save-item': 'shippingCompanyName', 'type': 'text', 'value': tmp.address.companyName ? tmp.address.companyName : ''}) ) ) })
				})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-12', 'id': 'shippingName'}).update(tmp.me._getFormGroup('Name', new Element('input', {'save-item': 'shippingName', 'type': 'text', 'value': tmp.address.contactName ? tmp.address.contactName : ''}) ) ) })
				})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-12', 'id': 'shippingContactNo'}).update(tmp.me._getFormGroup('Contact No.', new Element('input', {'save-item': 'shippingContactNo', 'type': 'value', 'value': tmp.address.contactNo ? tmp.address.contactNo : ''}) ) ) })
				})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-6', 'id': 'shippingStreet'}).update(tmp.me._getFormGroup('Street', new Element('input', {'save-item': 'shippingStreet', 'type': 'text', 'value': tmp.address.street ? tmp.address.street : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-6', 'id': 'shippingCity'}).update(tmp.me._getFormGroup('City', new Element('input', {'save-item': 'shippingCity', 'type': 'text', 'value': tmp.address.city ? tmp.address.city : ''}) ) ) })
				})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-4', 'id': 'shippingState'}).update(tmp.me._getFormGroup('State', new Element('input', {'save-item': 'shippingState', 'type': 'text', 'value': tmp.address.region ? tmp.address.region : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-4', 'id': 'shippingCountry'}).update(tmp.me._getFormGroup('Country', new Element('input', {'save-item': 'shippingCountry', 'type': 'text', 'value': tmp.address.country ? tmp.address.country : ''}) ) ) })
					.insert({'bottom': new Element('div', {'class': 'col-sm-4', 'id': 'shippingPosecode'}).update(tmp.me._getFormGroup('Post Code', new Element('input', {'save-item': 'shippingPosecode', 'type': 'text', 'value': tmp.address.postCode ? tmp.address.postCode : ''}) ) ) })
				})
			})
		;
		return tmp.newDiv;
	}
	/**
	 * Getting a form group for forms
	 */
	,_getFormGroup: function (label, input) {
		return new Element('div', {'class': 'form-group form-group-sm form-group-sm-label'})
			.insert({'bottom': new Element('label').update(label) })
			.insert({'bottom': input.addClassName('form-control') });
	}
	/**
	 * Public: binding all the js events
	 */
	,bindAllEventNObjects: function() {
		var tmp = {};
		tmp.me = this;
		return tmp.me;
	}
});