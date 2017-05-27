var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{_getTitleRowData:function(){return{serialNo:"Serial No.",qty:"Qty",product:"Product",unitPrice:"Unit Cost(Excl. GST)",invoiceNo:"Invoice No.",created:"Received By",purchaseOrder:"Purchase Order"}},_bindSearchKey:function(){var b,c,a;b=this;$("searchPanel").getElementsBySelector("[search_field]").each(function(a){a.observe("keydown",function(a){b.keydown(a,function(){$(b.searchDivId).down("#searchBtn").click()})})});c=(new Element("input",{"class":"select2 form-control",
"data-placeholder":"search for a Products",search_field:"pro.ids"})).insert({bottom:(new Element("option")).update("")});$("searchDiv").down('[search_field="pro.ids"]').replace(c);jQuery('.select2[search_field="pro.ids"]').select2({allowClear:!0,hidden:!0,multiple:!0,ajax:{url:"/ajax/getProducts",dataType:"json",delay:10,data:function(a){return{searchTxt:a,pageNo:1,pageSize:10,userId:jQuery("#userId").attr("value")}},results:function(b){a=[];b.resultData.items.each(function(b){a.push({id:b.id,text:b.name,
data:b})});return{results:a}},cache:!0},formatResult:function(a){return a?"<div value="+a.data.id+">"+a.data.name+"</div >":""},escapeMarkup:function(a){return a},minimumInputLength:3});c=(new Element("input",{"class":"select2 form-control","data-placeholder":"search for a PO",search_field:"purchaseorderids"})).insert({bottom:(new Element("option")).update("")});$("searchDiv").down('[search_field="purchaseorderids"]').replace(c);jQuery('.select2[search_field="purchaseorderids"]').select2({allowClear:!0,
hidden:!0,multiple:!0,ajax:{url:"/ajax/getPurchaseOrders",dataType:"json",delay:10,data:function(a){return{searchTxt:a,pageNo:1,pageSize:10,userId:jQuery("#userId").attr("value")}},results:function(b){a=[];b.resultData.items.each(function(b){a.push({id:b.id,text:b.purchaseOrderNo,data:b})});return{results:a}},cache:!0},formatResult:function(a){return a?"<div value="+a.data.id+">"+a.data.purchaseOrderNo+"</div >":""},escapeMarkup:function(a){return a},minimumInputLength:3});return this},_submitDeletion:function(b,
c){var a,e,d;a=this;e=$(b).up(".confirm-div");e.getElementsBySelector(".msg").each(function(a){a.remove()});a.postAjax(a.getCallbackId("deleteItem"),{id:c.id},{onLoading:function(){a._signRandID(b);jQuery("#"+b.id).button("loading")},onComplete:function(){jQuery("#"+b.id).button("reset")},onSuccess:function(b,c){try{d=a.getResp(c,!1,!0);if(!d||!d.item||!d.item.id)return null;$$('.item_row[item_id="'+d.item.id+'"]').each(function(a){a.remove()});a.hideModalBox()}catch(f){e.insert({top:(new Element("h4",
{"class":"msg"})).update((new Element("span",{"class":"label label-danger"})).update(f))})}}})},_showDeleteConfirmPanel:function(b){var c,a;c=this;a=(new Element("div",{"class":"confirm-div"})).insert({bottom:(new Element("div")).insert({bottom:(new Element("h4")).update("You are about to delete this received item, by doing so, it may:")}).insert({bottom:(new Element("ul")).insert({bottom:(new Element("li")).update("This <strong>serial number("+b.serialNo+")</strong> will not be searchable or accessible any more in the future.")}).insert({bottom:(new Element("li")).update("The Status <strong>Purchase Order("+
b.purchaseOrder.purchaseOrderNo+")</strong> may change")}).insert({bottom:(new Element("li")).update("The total <strong>StockOnHand count</strong> will change")}).insert({bottom:(new Element("li")).update("The total <strong>StockOnHand value</strong> will change")})})}).insert({bottom:(new Element("div",{"class":"text-right"})).insert({bottom:(new Element("span",{"class":"btn btn-default pull-left"})).update("CANCEL").observe("click",function(){c.hideModalBox()})}).insert({bottom:(new Element("span",
{"class":"btn btn-danger","data-loading-text":"Deleting ..."})).update("Yes, Delete It").observe("click",function(){c._submitDeletion(this,b)})})});c.showModalBox('<strong class="text-danger">Confirm Deletion:</strong>',a);return c},_getResultRow:function(b,c){var a={me:this};a.tag=!0===a.isTitle?"th":"td";a.isTitle=c||!1;a.row=(new Element("tr",{"class":!0===a.isTitle?"":"item-data-row"})).store("data",b).insert({bottom:(new Element(a.tag,{"class":"col-xs-1"})).update(b.serialNo)}).insert({bottom:(new Element(a.tag,
{"class":"col-xs-1"})).update(b.qty)}).insert({bottom:(new Element(a.tag,{"class":"col-xs-3"})).update(!0===a.isTitle?b.product:(new Element("a",{href:"/product/"+b.product.id+".html",target:"_BLANK"})).update(b.product.sku))}).insert({bottom:(new Element(a.tag,{"class":"col-xs-1"})).update(!0===a.isTitle?b.unitPrice:a.me.getCurrency(b.unitPrice))}).insert({bottom:(new Element(a.tag,{"class":"col-xs-3"})).update(!0===a.isTitle?b.purchaseOrder:(new Element("a",{href:"/purchase/"+b.purchaseOrder.id+
".html",target:"_BLANK"})).update(b.purchaseOrder.purchaseOrderNo+" ["+b.purchaseOrder.status+"]"))}).insert({bottom:(new Element(a.tag,{"class":"col-xs-2"})).update(!0===a.isTitle?b.created:b.createdBy.person.fullname+" @ "+a.me.loadUTCTime(b.created).toLocaleString())}).insert({bottom:(new Element(a.tag,{"class":"col-xs-1"})).update(!0===a.isTitle?"":(new Element("div",{"class":"btn-group"})).insert({bottom:(new Element("span",{"class":"btn btn-xs btn-danger"})).insert({bottom:new Element("span",
{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){a.me._showDeleteConfirmPanel(b)})}))});return a.row}});