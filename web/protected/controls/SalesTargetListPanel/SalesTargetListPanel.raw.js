var SalesTargetListPanelJs = new Class.create();
SalesTargetListPanelJs.prototype = {
	_pageJs : null
	,_panelHTMLID: ''
	/**
	 * Initialize
	 */
	,initialize : function(_pageJs) {
		this._pageJs = _pageJs;
		this._panelHTMLID = 'SalesTargetListPanelJs_' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
	}
	/**
	 * create list panel
	 */
	,getListPanel: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'panel', 'id': tmp.me._panelHTMLID})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'}).update('Sales Target :') });
		return tmp.newDiv;
	}
	/**
	 * insert sales info to list
	 */
	,_getListItem: function(item, list) {
		var tmp = {};
		tmp.me = this;
		targetrevenue = item.sales.targetrevenue ? item.sales.targetrevenue : 0;
		targetprofit = item.sales.targetprofit ? item.sales.targetprofit : 0;
		tmp.div1 = new Element('a', {'class': 'list-group-item'})
			.store('data', item)
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-6'}).update('Revenue(Incl.): <strong>' + tmp.me._pageJs.getCurrency(targetrevenue)+ '</strong>') })
				.insert({'bottom': new Element('div', {'class': 'col-sm-6'}).update('Profit(Incl.): <strong>' + tmp.me._pageJs.getCurrency(targetprofit) + '</strong>') })
			});
		list.insert({'bottom': tmp.div1 });

		tmp.div2 = new Element('a', {'class': 'list-group-item'})
			.store('data', item)
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update('Period:') })
				.insert({'bottom': new Element('div', {'class': 'col-sm-4'}).update('<strong>' + moment(item.sales.dfrom).format('DD/MMM/YYYY') + '</strong>') })
				.insert({'bottom': new Element('div', {'class': 'col-sm-1'}).update('<strong>' + ' To ' + '</strong>') })
				.insert({'bottom': new Element('div', {'class': 'col-sm-4'}).update('<strong>' + moment(item.sales.dto).format('DD/MMM/YYYY') + '</strong>') })
			});
		list.insert({'bottom': tmp.div2 });

		tmp.div3 = new Element('a', {'class': 'list-group-item'})
			.store('data', item)
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-6'}).update('Days Left : <strong>' + item.daysleft + '</strong>') })
				.insert({'bottom': new Element('div', {'class': 'col-sm-6'}).update('Total Days : <strong>' + item.sales.dperiod + '</strong>') })
			});
		list.insert({'bottom': tmp.div3 });
		tmp.div4 = new Element('a', {'class': 'list-group-item', 'style' : 'background-color:#f5f5f5'})
		.store('data', item)
		.insert({'bottom': new Element('div', {'class': 'row'})
			.insert({'bottom': new Element('div', {'class': 'col-sm-12'}).update('Sales Progress :') })
		});
		list.insert({'bottom': tmp.div4 });

		todayAmount = item.today.totalAmount ? item.today.totalAmount : 0;
		todayPaid = item.today.totalPaid ? item.today.totalPaid : 0;
		todayMargin = item.today.totalMargin ? item.today.totalMargin : 0;
		tmp.div5 = new Element('a', {'class': 'list-group-item'})
			.store('data', item)
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("") })
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("Total Amt") })
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("Paid Amt") })
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("Margin") })
			})
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("Today(Incl.):") })
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("<strong>" + tmp.me._pageJs.getCurrency(todayAmount) + '</strong>') })
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("<strong>" + tmp.me._pageJs.getCurrency(todayPaid) + '</strong>') })
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("<strong>" + tmp.me._pageJs.getCurrency(todayMargin) + '</strong>') })
			});
		list.insert({'bottom': tmp.div5 });

		totalAmount = item.period.totalAmount ? item.period.totalAmount : 0;
		totalPaid = item.period.totalPaid ? item.period.totalPaid : 0;
		totalMargin = item.period.totalMargin ? item.period.totalMargin : 0;
		tmp.div6 = new Element('a', {'class': 'list-group-item'})
			.store('data', item)
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("Total(Incl.):") })
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("<strong>" + tmp.me._pageJs.getCurrency(totalAmount) + '</strong>') })
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("<strong>" + tmp.me._pageJs.getCurrency(totalPaid) + '</strong>') })
				.insert({'bottom': new Element('div', {'class': 'col-sm-3'}).update("<strong>" + tmp.me._pageJs.getCurrency(totalMargin) + '</strong>') })
			});
		list.insert({'bottom': tmp.div6 });

		return list;
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
		tmp.ajax = new Ajax.Request('/ajax/getSalesTarget', {
			method: 'get'
			,parameters: {'pageNo': 1, 'pageSize': 30, 'storeId' : jQuery('#storeId').attr('value'), 'userId' : jQuery('#userId').attr('value')}
			,onCreate: function() {
				$(tmp.me._panelHTMLID).insert({'bottom': tmp.loadingDiv});
			}
			,onSuccess: function(transport) {
				try {
					tmp.result = tmp.me._pageJs.getResp(transport.responseText, false, true);
					if(!tmp.result || !tmp.result.items)
					{
						return;
					}
					if($(tmp.me._panelHTMLID).down('panel-body'))
						$(tmp.me._panelHTMLID).down('panel-body').remove();
					tmp.list = $(tmp.me._panelHTMLID).down('list-group');
					if(!tmp.list)
						$(tmp.me._panelHTMLID).insert({'bottom': tmp.list = new Element('div', {'class': 'list-group'}) });
					tmp.me._getListItem(tmp.result.items, tmp.list);
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