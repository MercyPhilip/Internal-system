var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{_openinFB:!0,_preSetData:{},setPreSetData:function(a){this._preSetData=a;return this},_getTitleRowData:function(){return{}},setOpenInFancyBox:function(a){this._openinFB=a;return this},refreshResultRow:function(a){var c,b;(c=$(this.resultDivId).down("tbody"))||(c=$(this.resultDivId));(b=c.down(".item_row[item_id="+a.id+"]"))?b.replace(this._getResultRow(a,!1).addClassName("item_row")):c.insert({top:this._getResultRow(a,!1).addClassName("item_row")});return this},
_openURL:function(a){if(!0!==this._openinFB)return window.location=a,this;jQuery.fancybox({width:"95%",height:"95%",autoScale:!1,autoDimensions:!1,fitToView:!1,autoSize:!1,type:"iframe",href:a});return this},showTaskPage:function(a){return a&&a.id?this._openURL("/task/"+a.id+".html?blanklayout=1"):this},showProductPage:function(a){return a&&a.id?this._openURL("/product/"+a.id+".html?blanklayout=1"):this},showKitDetailsPage:function(a){return this._openURL("/kit/"+(a&&a.id?a.id:"new")+".html?blanklayout=1")},
showOrderDetailsPage:function(a){return a&&a.id?this._openURL("/orderdetails/"+a.id+".html?blanklayout=1"):this},showCustomerDetailsPage:function(a){return a&&a.id?this._openURL("/customer/"+a.id+".html?blanklayout=1"):this},_showShippmentDetailsPage:function(a){var c;c=a.shippment;c=(new Element("div",{"class":"panel-body"})).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-md-2 text-right"})).update("<strong>Courier Name:</strong>")}).insert({bottom:(new Element("div",
{"class":"col-md-10"})).update(c.courier.name)})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-md-2 text-right"})).update("<strong>Date:</strong>")}).insert({bottom:(new Element("div",{"class":"col-md-10"})).update(moment(this.loadUTCTime(c.shippingDate)).format("lll"))})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-md-2 text-right"})).update("<strong>Con. Note No.:</strong>")}).insert({bottom:(new Element("div",{"class":"col-md-10"})).update(c.conNoteNo)})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",
{"class":"col-md-2 text-right"})).update("<strong>No. Of Cartons:</strong>")}).insert({bottom:(new Element("div",{"class":"col-md-10"})).update(c.noOfCartons)})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-md-2 text-right"})).update("<strong>Address:</strong>")}).insert({bottom:(new Element("div",{"class":"col-md-10"})).update(c.address.full)})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-md-2 text-right"})).update("<strong>Instructions:</strong>")}).insert({bottom:(new Element("div",
{"class":"col-md-10"})).update(c.deliveryInstructions)})});this.showModalBox("<strong>Shippment Details for "+a.barcode+":</strong>",c);return this},_getResultRow:function(a,c){var b={me:this};b.tag=!0===b.isTitle?"th":"td";b.isTitle=c||!1;b.row=(new Element("tr",{"class":"order_item "+(!0===b.isTitle?"":"btn-hide-row"),item_id:!0===b.isTitle?"":a.id})).store("data",a).insert({bottom:(new Element(b.tag,{"class":"col-xs-1"})).insert({bottom:!0===b.isTitle?"Barcode":(new Element("a",{href:"javascript: void(0);",
title:"view details"})).update(a.barcode).observe("click",function(){b.me.showKitDetailsPage(a)})})}).insert({bottom:(new Element(b.tag,{"class":"col-xs-4"})).insert({bottom:!0===b.isTitle?"Product":(new Element("div")).insert({bottom:(new Element("div",{"class":"col-md-12"})).insert({bottom:(new Element("a",{href:"javascript: void(0);",title:a.product.sku})).update(a.product.sku).observe("click",function(){b.me.showProductPage(a.product)})})}).insert({bottom:(new Element("div",{"class":"col-md-12"})).setStyle("padding: 0px;").update("<small>"+
a.product.name+"</small>")})})}).insert({bottom:(new Element(b.tag,{"class":"col-xs-2"})).insert({bottom:!0===b.isTitle?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-5"})).update("Price (inc. GST)")}).insert({bottom:(new Element("div",{"class":"col-xs-5"})).update("Cost (exc. GST)")}):(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-5"})).update(b.me.getCurrency(a.price))}).insert({bottom:(new Element("div",{"class":"col-xs-5"})).update(b.me.getCurrency(a.cost))})})}).insert({bottom:(new Element(b.tag,
{"class":"col-xs-1"})).insert({bottom:!0===b.isTitle?"From Task":a.task&&a.task.id?(new Element("a",{href:"javascript: void(0);","class":"truncate",title:a.task.id})).update(a.task.id).observe("click",function(){b.me.showTaskPage(a.task)}):""})}).insert({bottom:(new Element(b.tag,{"class":"col-xs-1"})).insert({bottom:!0===b.isTitle?"Sold To Customer":a.soldToCustomer&&a.soldToCustomer.name?(new Element("a",{href:"javascript: void(0);","class":"truncate",title:a.soldToCustomer.name})).update(a.soldToCustomer.name).observe("click",
function(){b.me.showCustomerDetailsPage(a.customer)}):""})}).insert({bottom:(new Element(b.tag,{"class":"col-xs-1"})).insert({bottom:!0===b.isTitle?"Sold Date":a.soldDate&&"0001-01-01 00:00:00"!==a.soldDate?moment(b.me.loadUTCTime(a.soldDate)).format("lll"):""})}).insert({bottom:(new Element(b.tag,{"class":"col-xs-1"})).insert({bottom:!0===b.isTitle?"Sold On Order":a.soldOnOrder&&a.soldOnOrder.orderNo?(new Element("a",{href:"javascript: void(0);","class":"truncate",title:a.soldOnOrder.orderNo})).update(a.soldOnOrder.orderNo).observe("click",
function(){b.me.showOrderDetailsPage(a.soldOnOrder)}):""})}).insert({bottom:(new Element(b.tag,{"class":"col-xs-1"})).insert({bottom:!0===b.isTitle?"Shipped Via":a.shippment&&a.shippment.id?(new Element("a",{href:"javascript: void(0);","class":"truncate",title:a.shippment.courier.name})).update(a.shippment.courier.name).observe("click",function(){b.me._showShippmentDetailsPage(a)}):""})});return b.row},_initOrderSearchBox:function(){var a,c;a=jQuery('[search_field="ord.id"]').select2({minimumInputLength:3,
multiple:!0,ajax:{delay:250,url:"/ajax/getAll",type:"POST",data:function(a){return{searchTxt:"orderNo like ? and storeId = ?",searchParams:["%"+a+"%",jQuery("#storeId").attr("value")],entityName:"Order",pageNo:1,userId:jQuery("#userId").attr("value")}},results:function(a,d,e){c=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){c.push({id:a.id,text:a.orderNo,data:a})});return{results:c}}},cache:!0,formatResult:function(a){return a?'<div class="row order_item"><div class="col-xs-3">'+
a.data.orderNo+'</div><div class="col-xs-3" order_status="'+a.data.status.name+'">'+a.data.status.name+'</div><div class="col-xs-6"><small>'+(a.data.customer&&a.data.customer.name?a.data.customer.name:"")+"</small></div></div >":""},escapeMarkup:function(a){return a}});this._preSetData&&this._preSetData.order&&this._preSetData.order.id&&a.select2("data",[{id:this._preSetData.order.id,text:this._preSetData.order.orderNo,data:this._preSetData.order}]);return this},_initCustomerSearchBox:function(){var a,
c;a=jQuery('[search_field="customer.id"]').select2({minimumInputLength:3,multiple:!0,ajax:{delay:250,url:"/ajax/getAll",type:"POST",data:function(a){return{searchTxt:"name like ? and storeId = ?",searchParams:["%"+a+"%",jQuery("#storeId").attr("value")],entityName:"Customer",pageNo:1,userId:jQuery("#userId").attr("value")}},results:function(a,d,e){c=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){c.push({id:a.id,text:a.name,data:a})});return{results:c}}},cache:!0,escapeMarkup:function(a){return a}});
this._preSetData&&this._preSetData.customer&&this._preSetData.customer.id&&a.select2("data",[{id:this._preSetData.customer.id,text:this._preSetData.customer.name,data:this._preSetData.customer}]);return this},_initTaskSearchBox:function(){var a,c;a=jQuery('[search_field="taskIds"]').select2({minimumInputLength:3,multiple:!0,ajax:{delay:250,url:"/ajax/getAll",type:"POST",data:function(a){return{searchTxt:"id like ? and storeId = ?",searchParams:["%"+a+"%",jQuery("#storeId").attr("value")],entityName:"Task",
pageNo:1,userId:jQuery("#userId").attr("value")}},results:function(a,d,e){c=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){c.push({id:a.id,text:a.id,data:a})});return{results:c}}},cache:!0,escapeMarkup:function(a){return a}});this._preSetData&&this._preSetData.task&&this._preSetData.task.id&&a.select2("data",[{id:this._preSetData.task.id,text:this._preSetData.task.name,data:this._preSetData.task}]);return this},_formatProductRow:function(a){return a?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",
{"class":"col-xs-5 truncate",title:"SKU:"+a.data.sku})).setStyle("max-width: none;").update(a.data.sku)}).insert({bottom:(new Element("div",{"class":"col-xs-7 truncate",title:a.data.name})).setStyle("max-width: none;").update(a.data.name)}):""},_initProductSearch:function(){var a,c;a=this;$$(".select2.search-product").each(function(b){b.hasClassName("loaded")||(a._signRandID(b),jQuery("#"+b.id).select2({placeholder:"Search a product",minimumInputLength:3,allowClear:!0,multiple:!0,ajax:{url:"/ajax/getAll",
dataType:"json",quietMillis:250,data:function(a,c){return{entityName:"Product",searchTxt:"(name like :searchTxt or mageId = :searchTxtExact or sku = :searchTxtExact) and isKit = "+b.readAttribute("isKit"),searchParams:{searchTxt:"%"+a+"%",searchTxtExact:a},pageNo:c,pageSize:10,userId:jQuery("#userId").attr("value")}},results:function(a,b){c=[];a.resultData.items.each(function(a){c.push({id:a.id,text:"["+a.sku+"] "+a.name,data:a})});return{results:c,more:10*b<a.resultData.pagination.totalRows}}},formatResult:function(b){return a._formatProductRow(b)},
formatSelection:function(b){return a._formatProductRow(b)},escapeMarkup:function(a){return a}}))});return a},init:function(){var a;a=this;jQuery(".datepicker").datetimepicker({format:"DD/MM/YYYY"});a._initCustomerSearchBox()._initProductSearch()._initTaskSearchBox()._initOrderSearchBox();$("searchBtn").observe("click",function(){a.getSearchCriteria().getResults(!0,15,9E4)});return a}});