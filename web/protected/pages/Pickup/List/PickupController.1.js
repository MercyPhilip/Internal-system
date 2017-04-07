/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
  /**
   * Getting the title row data
   */
  ,_getTitleRowData: function() {
    return {'sku': 'SKU', 'name': 'Product Name', 'supplier': 'Supplier','poNumber': 'PO Number' , 'unitPrice': 'Unit Price(Ex)', 'qty': 'Qty', 'poDate': 'PO Date', 'pickupDate': 'Pickup Date'};
  }
  
	,getResults: function(reset, pageSize) {
		var tmp = {};
		tmp.num = 0;
		tmp.me = this;
		tmp.reset = (reset || false);
		tmp.resultDiv = $(tmp.me.resultDivId);

		if(tmp.reset === true)
			tmp.me._pagination.pageNo = 1;
		tmp.me._pagination.pageSize = (pageSize || tmp.me._pagination.pageSize);
		tmp.me.postAjax(tmp.me.getCallbackId('getItems'), {'pagination': tmp.me._pagination}, {
			'onLoading': function () {
				jQuery('#' + tmp.me.searchDivId + ' #searchBtn').button('loading');
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
					
					$('pre-selected-count').update(tmp.num);
					tmp.result.items.each(function(item) {
						item.item.totalProdcutCount = item.totalProdcutCount;
						item = item.item;
						tmp.tbody.insert({'bottom': tmp.me._getResultRow(item).addClassName('item_row').writeAttribute('item_id', item.id) });
						if(item.pickup == true){
							tmp.num += 1;	
						}
					});
					//set amount of arranged pickup
					if($('pre-selected-count').innerHTML.length > 0){
						tmp.num += parseInt($('pre-selected-count').innerHTML);
					}
					
					$('pre-selected-count').update(tmp.num);
					
					//show the next page button
					if(tmp.result.pageStats.pageNumber < tmp.result.pageStats.totalPages)
						tmp.resultDiv.insert({'bottom': tmp.me._getNextPageBtn().addClassName('paginWrapper') });
				} catch (e) {
					tmp.resultDiv.insert({'bottom': tmp.me.getAlertBox('Error', e).addClassName('alert-danger') });
				}
			}
			,'onComplete': function() {
				jQuery('#' + tmp.me.searchDivId + ' #searchBtn').button('reset');
			}
		});
	}
  /**
   * get pickeded
   */
	,_pickupedItem: function(po) {
		var tmp = {};
		tmp.me = this;
		tmp.row = $$('[item_id="'+ po.id +'"]').first();
		tmp.me.postAjax(tmp.me.getCallbackId('deactivateItems'), {'item_id': po.id}, {
			'onLoading': function() {
				if(tmp.row)
					tmp.row.hide();
				tmp.me.hideModalBox();
			}
			,'onSuccess': function(sender, param){
				try {
					tmp.row.toggleClassName('danger');
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result.item)
						throw 'errror';
					tmp.row.replace(tmp.me._getResultRow(tmp.result.item, false));
				} catch(e) {
					tmp.me.showModalBox('<span class="text-danger">ERROR</span>', e, true);
				}
			}
			,'onComplete': function() {
				if(tmp.row)
					tmp.row.show();
			}
		});
	}
  /**
   * get result row for data given
   */
  ,_getResultRow: function(row, isTitle) {
    var tmp = {};
    tmp.me = this;
    tmp.tag = (isTitle === true ? 'th' : 'td');
    tmp.isTitle = (isTitle || false);
    tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? 'item_top_row' : 'btn-hide-row item_row') + (row.active == 0 ? ' danger' : ''), 'item_id': (tmp.isTitle === true ? '' : row.id)}).store('data', row)
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'sku col-xs-1'}).update(row.sku)
        :new Element(tmp.tag, {'class': 'sku col-xs-1', 'item': 'sku'}).update(row.product.sku)     
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'name col-xs-4 truncate'}).update(row.name)
        :new Element(tmp.tag, {'class': 'name col-xs-4 truncate', 'item': 'name'}).update(row.product.name)   
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'supplier col-xs-2 truncate'}).update(row.supplier)
          :new Element(tmp.tag, {'class': 'supplier col-xs-2 truncate', 'item': 'supplier'}).update(row.po.supplier.name)   
      })
      
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'ponumber col-xs-1 truncate'}).update(row.poNumber)
        :new Element(tmp.tag, {'class': 'ponumber col-xs-1 truncate', 'item': 'po'}).update(row.po.purchaseOrderNo)
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'unitprice col-xs-1 truncate'}).update(row.unitPrice)
          :new Element(tmp.tag, {'class': 'unitprice col-xs-1 truncate', 'item': 'unitprice'}).update(row.item.unitPrice)
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'qty col-xs-1 truncate'}).update(row.qty)
          :new Element(tmp.tag, {'class': 'qty col-xs-1 truncate', 'item': 'qty'}).update(row.item.qty)
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'podate col-xs-1 truncate'}).update(row.poDate)
          :new Element(tmp.tag, {'class': 'podate col-xs-1 truncate', 'item': 'podate'}).update(moment(row.item.created).format('DD/MM/YYYY'))
      }); 
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'podate col-xs-1 truncate'}).update(row.poDate)
          :new Element(tmp.tag, {'class': 'pickupdate col-xs-1 truncate', 'item': 'pickupdate'}).update(moment(row.item.arrangePickupDate).format('DD/MM/YYYY'))
      })
      .insert({'bottom': tmp.btns = new Element(tmp.tag, {'class': 'col-xs-1 text-right'}) 	});
		if(tmp.isTitle !== true)
			tmp.btns.insert({'bottom': new Element('div', {'class': 'btn-group'})
				.insert({'bottom': new Element('span', {'class': 'btn btn-danger btn-xs', 'title': 'Delete'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-trash'}) })
					.observe('click', function(){
						tmp.me._shoConfirmPickup(row);
					})
				})
			});
  	})
    return tmp.row;
  }
	/**
	 * showing the confirmation panel for pickuping the po
	 */
	,_shoConfirmPickup: function(purchaseorder) {
		var tmp = {};
		tmp.me = this;
		tmp.confirmDiv = new Element('div')
			.insert({'bottom': new Element('strong').update('You are about to delete a Purchase Order: ' + purchaseorder.purchaseOrderNo) })
			.insert({'bottom': new Element('strong').update('After confirming deletion:') })
			.insert({'bottom': new Element('ul')
				.insert({'bottom': new Element('li').update(' - All received item will be deleted, and stock will be reverted from StockOnHand to StockOnPO.') })
				.insert({'bottom': new Element('li').update(' - This PO will be dactivated.') })
			})
			.insert({'bottom': new Element('div').update(new Element('strong').update('Are you sure you want to continue?')) })
			.insert({'bottom': new Element('div')
				.insert({'bottom': new Element('span', {'class': 'btn btn-danger'})
					.update('YES, deactivate it')
					.observe('click', function(){
						tmp.me._pickupItem(purchaseorder);
					})
				})
				.insert({'bottom': new Element('span', {'class': 'btn btn-default pull-right'})
					.update('NO, cancel this')
					.observe('click', function(){
						tmp.me.hideModalBox();
					})
				})
			});
		tmp.me.showModalBox('<strong class="text-warning">Confirm</strong>', tmp.confirmDiv);
		return tmp.me;
	}
});