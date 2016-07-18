/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
	/**
	 * get title of the row
	 */
	_getTitleRowData: function() {
		return {'id' : 'ID', 'name': 'Tier Name', 'percentage': 'Tier Price(%)'};
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
				.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control', 'placeholder': 'The name of the tier','save-item-panel': 'name', 'value': row.name ? row.name : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control', 'validate_number' : true, 'placeholder': 'The price percetage of the tier', 'save-item-panel': 'percentage', 'value': row.percentage ? Number(row.percentage).toFixed(2) : ''}) })
					.observe('change', function(){
						tmp.me._percentageInputChanged(tmp.newDiv.down('[save-item-panel=percentage]'));
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
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-2'}).update(row.name) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-2'}).update(tmp.isTitle? row.percentage : row.percentage ? Number(row.percentage).toFixed(2) : '') })
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
	,_percentageInputChanged: function(inputBox) {
//		var tmp = {};
//		tmp.me = this;
//		if($F(inputBox).blank()) {
//			return false;
//		}
//		tmp.inputValue = $F(inputBox);
//		if(tmp.inputValue.toString().match(/^(-)?\d+(\.\d{0,2})?$/) === null) {
//			tmp.me._markFormGroupError(inputBox, 'Invalid percentage format provided!');
//			return false;
//		}
//		console.log('tmp.inputValue 1 =', tmp.inputValue);
//		tmp.inputValue = tmp.inputValue.toString().match(/^\d+(?:\.\d{0,2})?/);
//		console.log('tmp.inputValue 2 =', tmp.inputValue);
//
//		$(inputBox).value = Number(tmp.inputValue).toFixed(2);
//		return true;
	}
});