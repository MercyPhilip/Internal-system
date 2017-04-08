var PageJs=new Class.create;PageJs.prototype=Object.extend(new CRUDPageJs,{_getTitleRowData:function(){return{sku:"SKU",name:"Product Name",supplier:"Supplier",poNumber:"PO Number",unitPrice:"Unit Price(Ex)",qty:"Qty",poDate:"PO Date",pickupDate:"Pickup Date"}},_bindSearchKey:function(){var a={};return a.me=this,$$("#searchBtn").first().observe("click",function(b){$$("#showSearch").first().checked?a.me.getSearchCriteria().getResults(!0,a.me._pagination.pageSize):$$("#showSearch").first().click()}),$("searchDiv").getElementsBySelector("[search_field]").each(function(b){b.observe("keydown",function(b){a.me.keydown(b,function(){$(a.me.searchDivId).down("#searchBtn").click()})})}),this},getResults:function(a,b){var c={};c.num=0,c.me=this,c.reset=a||!1,c.resultDiv=$(c.me.resultDivId),!0===c.reset&&(c.me._pagination.pageNo=1),c.me._pagination.pageSize=b||c.me._pagination.pageSize,c.me.postAjax(c.me.getCallbackId("getItems"),{pagination:c.me._pagination,searchCriteria:c.me._searchCriteria},{onLoading:function(){jQuery("#"+c.me.searchDivId+" #searchBtn").button("loading"),!0===c.reset&&c.resultDiv.update(new Element("tr").update(new Element("td").update(c.me.getLoadingImg())))},onSuccess:function(a,b){try{if(c.result=c.me.getResp(b,!1,!0),!c.result)return;$(c.me.totalNoOfItemsId).update(c.result.pageStats.totalRows),!0===c.reset&&c.resultDiv.update(c.me._getResultRow(c.me._getTitleRowData(),!0).wrap(new Element("thead"))),c.resultDiv.getElementsBySelector(".paginWrapper").each(function(a){a.remove()}),c.tbody=$(c.resultDiv).down("tbody"),c.tbody||$(c.resultDiv).insert({bottom:c.tbody=new Element("tbody")}),c.result.items.each(function(a){c.tbody.insert({bottom:c.me._getResultRow(a).addClassName("item_row").writeAttribute("item_id",a.id)})}),c.result.pageStats.pageNumber<c.result.pageStats.totalPages&&c.resultDiv.insert({bottom:c.me._getNextPageBtn().addClassName("paginWrapper")})}catch(a){c.resultDiv.insert({bottom:c.me.getAlertBox("Error",a).addClassName("alert-danger")})}},onComplete:function(){jQuery("#"+c.me.searchDivId+" #searchBtn").button("reset")}})},_pickupedItem:function(a){var b={};b.me=this,b.row=$$('[item_id="'+a.id+'"]').first(),console.log(a),b.me.postAjax(b.me.getCallbackId("pickupItem"),{item_id:a.id,po_id:a.order.id},{onLoading:function(){b.row&&b.row.hide(),b.me.hideModalBox()},onSuccess:function(a,c){try{if(b.row.toggleClassName("success"),b.result=b.me.getResp(c,!1,!0),!b.result.item)throw"errror";b.row.replace(b.me._getResultRow(b.result.item,!1))}catch(a){b.me.showModalBox('<span class="text-danger">ERROR</span>',a,!0)}},onComplete:function(){b.row&&b.row.show()}})},_getResultRow:function(a,b){var c={};return c.me=this,c.tag=!0===b?"th":"td",c.isTitle=b||!1,c.row=new Element("tr",{class:(!0===c.isTitle?"item_top_row":"btn-hide-row item_row")+(0==a.active?" success":""),item_id:!0===c.isTitle?"":a.id}).store("data",a).insert({bottom:!0===c.isTitle?new Element(c.tag,{class:"sku"}).update(a.sku):new Element(c.tag,{class:"sku",item:"sku","data-title":"SKU"}).update(a.product.sku)}).insert({bottom:!0===c.isTitle?new Element(c.tag,{class:"name"}).update(a.name):new Element(c.tag,{class:"name",item:"name","data-title":"Product Name"}).update(a.product.name)}).insert({bottom:!0===c.isTitle?new Element(c.tag,{class:"supplier"}).update(a.supplier):new Element(c.tag,{class:"supplier",item:"supplier","data-title":"Supplier"}).update(a.order.supplier.name)}).insert({bottom:!0===c.isTitle?new Element(c.tag,{class:"ponumber"}).update(a.poNumber):new Element(c.tag,{class:"ponumber",item:"po","data-title":"PO NUmber"}).update(a.order.purchaseOrderNo)}).insert({bottom:!0===c.isTitle?new Element(c.tag,{class:"unitprice"}).update(a.unitPrice):new Element(c.tag,{class:"unitprice",item:"unitprice","data-title":"Unit Price(Ex)"}).update(a.item.unitPrice)}).insert({bottom:!0===c.isTitle?new Element(c.tag,{class:"qty"}).update(a.qty):new Element(c.tag,{class:"qty",item:"qty","data-title":"Qty"}).update(a.item.qty)}).insert({bottom:!0===c.isTitle?new Element(c.tag,{class:"podate"}).update(a.poDate):new Element(c.tag,{class:"podate",item:"podate","data-title":"PO Date"}).update(moment(a.order.orderDate).format("DD/MM/YYYY"))}).insert({bottom:!0===c.isTitle?new Element(c.tag,{class:"podate"}).update(a.pickupDate):new Element(c.tag,{class:"pickupdate",item:"pickupdate","data-title":"Pickup Date"}).update(moment(a.item.arrangedDate).format("DD/MM/YYYY"))}).insert({bottom:c.btns=new Element(c.tag,{class:"text-center"})}),!0!==c.isTitle&&c.btns.insert({bottom:new Element("div",{class:"btn-group"}).insert({bottom:new Element("button",{class:"btn btn-success btn-md",title:"Confirm"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-ok-circle"})}).observe("click",function(){c.me._showConfirmPickup(a)})})}),c.row},_showConfirmPickup:function(a){var b={};return b.me=this,b.confirmDiv=new Element("div").insert({bottom:new Element("div").update(new Element("strong").update("Pickup Confirmation"))}).insert({bottom:new Element("div").insert({bottom:new Element("span",{class:"btn btn-success"}).update("YES, confirmed").observe("click",function(){b.me._pickupedItem(a)})}).insert({bottom:new Element("span",{class:"btn btn-default pull-right"}).update("NO, cancel this").observe("click",function(){b.me.hideModalBox()})})}),b.me.showModalBox('<strong class="text-warning">Confirm</strong>',b.confirmDiv),b.me}});