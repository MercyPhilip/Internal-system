/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
    /**
     * Getting the title row data
     */
    _getTitleRowData: function() {
      return {'sku': 'SKU', 'name': 'Product Name', 'company': 'Customer Name', 'customer': 'Contact Name', 'address': 'Address', 'tel': 'Contact Number', 'orderNumber': 'Order Number' , 'unitPrice': 'Unit Price(Ex)', 'qty': 'Qty', 'orderDate': 'Order Date', 'comment': 'Comment', 'pickedDate': 'Picked Date'};
    }
	,setRoleId: function(roleId) {
		this._roleId = roleId;
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
				if(!$$('#showSearch').first().checked)
					$$('#showSearch').first().click();
				else
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
	,getResults: function(reset, pageSize) {
		var tmp = {};
		tmp.num = 0;
		tmp.me = this;
		tmp.reset = (reset || false);
		tmp.resultDiv = $(tmp.me.resultDivId);
		if(tmp.reset === true)
			tmp.me._pagination.pageNo = 1;
		tmp.me._pagination.pageSize = (pageSize || tmp.me._pagination.pageSize);
		tmp.me.postAjax(tmp.me.getCallbackId('getItems'), {'pagination': tmp.me._pagination,'searchCriteria': tmp.me._searchCriteria}, {
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
					
					tmp.result.items.each(function(item) {
						tmp.tbody.insert({'bottom': tmp.me._getResultRow(item).addClassName('item_row').writeAttribute('item_id', item.id) });
					});
					
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
   * get delivered
   */
	,_deliveredItem: function(delivery) {
		var tmp = {};
		tmp.me = this;
		tmp.row = $$('[item_id="'+ delivery.id +'"]').first();
		tmp.me.postAjax(tmp.me.getCallbackId('deliveryItem'), {'item_id': delivery.id, 'order_id': delivery.order.id, 'signature': delivery.signature, 'recepiant': delivery.recepiant}, {
			'onLoading': function() {
				if(tmp.row)
					tmp.row.hide();
				tmp.me.hideModalBox();
			}
			,'onSuccess': function(sender, param){
				try {
					tmp.row.toggleClassName('success');
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
    if(tmp.isTitle === false){
    	tmp.address = row.order.address.shipping.street + ',' + row.order.address.shipping.city + ',' + row.order.address.shipping.region + ',' + row.order.address.shipping.country;
	    if(tmp.address == ''){
	    	tmp.address = row.order.address.shipping.full;
	    }
    }
    tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? 'item_top_row' : 'btn-hide-row item_row') + (row.active == 0 ? ' success' : ''), 'item_id': (tmp.isTitle === true ? '' : row.id)}).store('data', row)
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'sku'}).update(row.sku)
        :new Element(tmp.tag, {'class': 'sku', 'item': 'sku', 'data-title': 'SKU'}).update(row.item.product.sku)     
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'name'}).update(row.name)
        :new Element(tmp.tag, {'class': 'name', 'item': 'name', 'data-title': 'Product Name'}).update(row.item.product.name)   
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'company'}).update(row.company)
        :new Element(tmp.tag, {'class': 'company', 'item': 'company', 'data-title': 'Customer Name'}).update(row.order.customer.name)   
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'customer'}).update(row.customer)
    	:new Element(tmp.tag, {'class': 'customer', 'item': 'customer', 'data-title': 'Contact Name'}).update(row.order.customer.address.shipping.contactName)   
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'address'}).update(row.address)
    	:new Element(tmp.tag, {'class': 'address', 'item': 'address', 'data-title': 'Address'})
      		.insert({'bottom': new Element('span', {'style': 'display: inline-block'})
      			.insert({'bottom': new Element('a', {'class': 'visible-xs visible-md visible-sm visible-lg', 'href': 'http://maps.google.com/maps?q=' + encodeURIComponent( tmp.address ), 'target': '_blank' })
      				.insert({'bottom': new Element('span', {'class': 'fa fa-map-marker address-shipping', 'style': 'font-size: 2.3em;'}) })
      			 })  
      		})
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'tel'}).update(row.tel)
    	:new Element(tmp.tag, {'class': 'tel', 'item': 'tel', 'data-title': 'Contact Number'}).update(row.order.customer.contactNo)   
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'orderNumber'}).update(row.orderNumber)
        :new Element(tmp.tag, {'class': 'orderNumber', 'item': 'orderNumber', 'data-title': 'Order Number'}).update(row.order.orderNo)
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'unitprice'}).update(row.unitPrice)
        :new Element(tmp.tag, {'class': 'unitprice', 'item': 'unitprice', 'data-title': 'Unit Price(Ex)'}).update(row.item.unitPrice)
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'qty'}).update(row.qty)
        :new Element(tmp.tag, {'class': 'qty', 'item': 'qty', 'data-title': 'Qty'}).update(row.item.qtyOrdered)
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'orderDate'}).update(row.orderDate)
        :new Element(tmp.tag, {'class': 'orderDate', 'item': 'orderDate', 'data-title': 'Order Date'}).update(moment(row.order.orderDate).format('DD/MM/YYYY'))
      });
    
    	if(tmp.me._roleId === 1){
    		tmp.row.insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'comment'}).update(row.comment)
    	              :new Element(tmp.tag, {'class': 'comment', 'item': 'comment_'+row.id, 'data-title': 'Comment'}).update(row.comment)
    	          });
    	}else{
    		tmp.row.insert({'bottom': new Element(tmp.tag, {'class': 'comment', 'data-title': 'Comment'})
    	      	.insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'comment'}).update(row.comment)
    	    		:new Element('input', {'class': 'comment', 'item': 'comment_'+row.id, 'style': 'width:100%;', 'value': row.comment})
    	      	})
    	      });
    	}

    	tmp.row.insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'pickedDate'}).update(row.pickedDate)
          :new Element(tmp.tag, {'class': 'pickedDate', 'item': 'pickedDate', 'data-title': 'Picked Date'}).update(moment(row.arrangedDate).format('DD/MM/YYYY'))
      })
      .insert({'bottom': tmp.btns = new Element(tmp.tag, {'class': 'text-center'}) });
		if(tmp.isTitle !== true)
			tmp.btns.insert({'bottom': new Element('div', {'class': 'btn-group'})
				.insert({'bottom': tmp.me._roleId === 1 ? null
					:new Element('button', {'class': 'btn btn-default btn-md', 'title': 'Save Comment'})
				
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-saved'}) })
					.observe('click', function(){
						tmp.me._saveComment(row);
					})
				})
				.insert({'bottom': new Element('button', {'class': 'btn btn-success btn-md', 'title': 'Confirm'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-ok-circle'}) })
					.observe('click', function(){
						tmp.me._showConfirmDelivery(row);
					})
				})
			});
    return tmp.row;
  }
	/**
	 * showing the confirmation panel for deliverying the order
	 */
	,_showConfirmDelivery: function(delivery) {
		var tmp = {};
		tmp.me = this;
		tmp.confirmDiv = new Element('div')
			.insert({'bottom': new Element('div', {'id': 'signatureparent'})
				.insert({'bottom': new Element('span',{'class':'recepiantText row'}).update('Recepiant: ')
					.insert({'bottom': new Element('input',{'class':'recepiant'})})
				})
				.insert({'bottom': new Element('span',{'class': 'row'}).update('Signature: ')})
				.insert({'bottom': new Element('div', {'id': 'signature'})	})
			})
			.insert({'bottom': new Element('div')
				.insert({'bottom': new Element('span', {'class': 'btn btn-success'})
					.update('YES, confirmed')
					.observe('click', function(){
						delivery.recepiant = jQuery('.recepiant').val();
						delivery.signature = tmp.me.signature.jSignature('getData', 'svgbase64');
						tmp.me._deliveredItem(delivery);
					})
				})
				.insert({'bottom': new Element('span', {'class': 'btn btn-default pull-right'})
					.update('NO, cancel this')
					.observe('click', function(){
						tmp.me.hideModalBox();
					})
				})
			});
		
		tmp.me.showModalBox('<strong class="text-warning">Delivery Confirmation</strong>', tmp.confirmDiv);
		tmp.me._jSignature();
		return tmp.me;
	}
	/**
	 * save the comment for deliverying the order
	 */
	,_saveComment: function(delivery) {
		var tmp = {};
		tmp.me = this;
		delivery.comment = jQuery('[item=comment_'+delivery.id).val();
		tmp.row = $$('[item_id="'+ delivery.id +'"]').first();
		tmp.me.postAjax(tmp.me.getCallbackId('saveComment'), {'item_id': delivery.id, 'comment': delivery.comment}, {
			'onSuccess': function(sender, param){
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result.item)
						throw 'errror';
					if(tmp.result.item == 'no comment')
						throw 'No commnet added';
					tmp.me.showModalBox('Success', 'Save Successfully!', false);
					tmp.row.replace(tmp.me._getResultRow(tmp.result.item, false));
				} catch(e) {
					tmp.me.showModalBox('<span class="text-danger">ERROR</span>', e, true);
				}
			}
		});
	}
	/**
	 * signature confirm
	 */
	,_jSignature: function() {
		var tmp = {};
		tmp.me = this;
		jQuery(document).ready(function() {
			// This is the part where jSignature is initialized.
			tmp.me.signature = jQuery("#signature").jSignature({'UndoButton':true});

		})
		return tmp.me;
	}
});