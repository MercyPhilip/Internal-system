var NoETAOrdersListPanelJs = new Class.create();
NoETAOrdersListPanelJs.prototype = {
	_pageJs : null
	,_panelHTMLID: ''

	,initialize : function(_pageJs) {
		this._pageJs = _pageJs;
		this._panelHTMLID = 'NoETAOrdersListPanelJs_' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
	}

	,getListPanel: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'panel', 'id': tmp.me._panelHTMLID})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'}).update('NO ETA and Insufficient Stock Orders:') });
		return tmp.newDiv;
	}
	,_getListItem: function(item) {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('a', {'class': 'list-group-item', 'href': 'javascript: void(0);'})
			.store('data', item)
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'})
					.insert({'bottom': new Element('a', {'href': '/orderdetails/' + item.id + '.html', 'target': '_BLANK'})
						.update(item.orderNo)
					})
				})
				.insert({'bottom': new Element('div', {'class': 'col-sm-3 text-right'})
					.insert({'bottom': new Element('em').update(moment(item.orderDate).format('DD/MMM/YY')) })
				})
				.insert({'bottom': new Element('div', {'class': 'col-sm-3 '})
					.insert({'bottom': new Element('small').update(item.status.name) })
				})
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'})
					.insert({'bottom': new Element('small').update(item.customer.name) })
				})
			});
		return tmp.newDiv;
	}
	/**
	 * Show the list
	 */
	,showList: function() {
		var tmp = {};
		tmp.me = this;
		if(!$(tmp.me._panelHTMLID))
			return tmp.me;
		tmp.loadingDiv = new Element('div', {'class': 'panel-body'}).update(tmp.me._pageJs.getLoadingImg());
		tmp.ajax = new Ajax.Request('/ajax/getNoETAStockOrders', {
			method: 'get'
			,parameters: {'pageNo': 1, 'pageSize': 3, 'storeId' : jQuery('#storeId').attr('value'), 'userId' : jQuery('#userId').attr('value')}
			,onCreate: function() {
				$(tmp.me._panelHTMLID).insert({'bottom': tmp.loadingDiv});
			}
			,onSuccess: function(transport) {
				try {
					tmp.result = tmp.me._pageJs.getResp(transport.responseText, false, true);
					if(!tmp.result || !tmp.result.items)
						return;
					if($(tmp.me._panelHTMLID).down('panel-body'))
						$(tmp.me._panelHTMLID).down('panel-body').remove();

					tmp.list = $(tmp.me._panelHTMLID).down('list-group');
					if(!tmp.list)
						$(tmp.me._panelHTMLID).insert({'bottom': tmp.list = new Element('div', {'class': 'list-group'}) });
					tmp.result.items.each(function(item){
						tmp.list.insert({'bottom': tmp.me._getListItem(item) });
					})
				} catch (e) {
					$(tmp.me._panelHTMLID).insert({'bottom': new Element('div', {'class': 'panel-body'}).update(tmp.me.getAlertBox('ERROR: ', e).addClassName('alert-danger')) });
				}
			}
			,onComplete: function() {
				tmp.loadingDiv.remove();
			}
		});
		return tmp.me;
	}
	/**
	 * loading the data
	 */
	,load: function() {
		 var tmp = {};
		 tmp.me = this;
		 //check whther the pament list panel is loaded.
		 if($(tmp.me._panelHTMLID)) {
			 tmp.me.showList();
		 }
		 return tmp.me;
	}
};