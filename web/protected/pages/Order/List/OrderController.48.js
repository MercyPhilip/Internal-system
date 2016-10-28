var PageJs=new Class.create;
PageJs.prototype=Object.extend(new BPCPageJs,{resultDivId:"",searchDivId:"",totalNoOfItemsId:"",_pagination:{pageNo:1,pageSize:10},_searchCriteria:{},_infoTypes:{},orderStatuses:[],_type:"INVOICE",_loadChosen:function(){jQuery(".chosen").select2();return this},_bindSearchKey:function(){var a;a=this;$("searchDiv").getElementsBySelector("[search_field]").each(function(c){c.observe("keydown",function(b){a.keydown(b,function(){$("searchBtn").click()})})});return this},_loadStatuses:function(a){this.orderStatuses=a;
var c;c=$(this.searchDivId).down("#orderStatusId");this.orderStatuses.each(function(a){c.insert({bottom:(new Element("option",{value:a.id})).update(a.name)})});return this},setSearchCriteria:function(a){var c,b,d,e,f,g;c=$(this.searchDivId);$H(a).each(function(a){b=a.key;d=a.value;if(e=c.down('[search_field="'+b+'"]'))for(f=e.options.length,g=0;g<f;g++)0<=d.indexOf(1*e.options[g].value)&&(e.options[g].selected=!0)});this._loadChosen()._bindSearchKey();return this},getSearchCriteria:function(){var a,
c,b,d;a=this;null===a._searchCriteria&&(a._searchCriteria={});c=!0;$(a.searchDivId).getElementsBySelector("[search_field]").each(function(e){b=e.readAttribute("search_field");e.hasClassName("datepicker")?(a._signRandID(e),d=jQuery("#"+e.id).data("DateTimePicker").date(),a._searchCriteria[b]=d?new Date(d.local().format("YYYY-MM-DDT"+("orderDate_from"===b||"invDate_from"===b?"00:00:00":"23:59:59"))):""):a._searchCriteria[b]=$F(e);if($F(e)instanceof Array&&0<$F(e).size()||"string"===typeof $F(e)&&!$F(e).blank())c=
!1});!0===c&&(a._searchCriteria=null);return this},getResults:function(a,c){var b,d,e,f,g,h,k;b=this;d=a||!1;null===b._searchCriteria?b.showModalBox("Warning","Nothing to search!",!0):(!0===d&&(b._pagination.pageNo=1),b._pagination.pageSize=c||b._pagination.pageSize,b._searchCriteria["ord.type"]=b._type,b._searchCriteria.extraSearchCriteria=b._extraSearchCriteria?b._extraSearchCriteria:"",b.postAjax(b.getCallbackId("getOrders"),{pagination:b._pagination,searchCriteria:b._searchCriteria},{onLoading:function(){jQuery("#searchBtn").button("loading");
jQuery(".popovershipping").popover("hide");!0===d&&($(b.totalNoOfItemsId).update("0"),$(b.totalSumId).update(b.getCurrency(0)),$(b.totalDueId).update(b.getCurrency(0)),$(b.resultDivId).update("").insert({after:(new Element("div",{"class":"panel-body"})).update(b.getLoadingImg())}))},onSuccess:function(a,c){try{if(e=b.getResp(c,!1,!0))$(b.totalNoOfItemsId).update(e.pageStats.totalRows),$(b.totalSumId).update(b.getCurrency(e.totalAmount)),$(b.totalDueId).update((new Element("span",{title:"Total Amt: "+
b.getCurrency(e.totalAmount)+"\nTotal Paid: "+b.getCurrency(e.totalPaid)+"\nTotal Credited: "+b.getCurrency(e.totalCreditNoteValue)+"\nTotal PaidViaCrdit: "+b.getCurrency(e.paidViaCredit)})).update(b.getCurrency(e.totalAmount-e.totalPaid-e.totalCreditNoteValue+1*e.paidViaCredit))),f=$(b.resultDivId),!0===d&&(g={orderNo:"Order Info.",type:"Type",custName:"Customer Name",shippingAddr:"Shipping Address",invNo:"Invoice No.",status:{name:"Status"},totalDue:"Total Due",passPaymentCheck:"Payment Cleared?"},
f.update(b._getResultRow(g,!0).wrap(new Element("thead")))),f.getElementsBySelector(".paginWrapper").each(function(a){a.remove()}),(h=$(f).down("tbody"))||$(f).insert({bottom:h=new Element("tbody")}),e.items.each(function(a){h.insert({bottom:b._getResultRow(a)})}),e.pageStats.pageNumber<e.pageStats.totalPages&&f.insert({bottom:b._getNextPageBtn().addClassName("paginWrapper")}),f.getElementsBySelector(".popovershipping.newPopover").each(function(a){a.removeClassName("newPopover");k=a.up(".order_item").retrieve("data");
jQuery("#"+a.id).popover({container:"body",title:'<div class="row"><div class="col-xs-10">Details for: '+k.orderNo+'</div><div class="col-xs-2"><a class="pull-right" href="javascript:void(0);" onclick="jQuery(\'#'+a.id+"').popover('hide');\"><strong>&times;</strong></a></div></div>",content:jQuery(".popover_content",jQuery("#"+a.id)).html(),html:!0,placement:"right",trigger:"manual"})})}catch(l){b.showModalBox('<strong class="text-danger">Error</strong>',l,!0)}},onComplete:function(){jQuery("#searchBtn").button("reset");
$(b.resultDivId).up(".panel").down(".panel-body")&&$(b.resultDivId).up(".panel").down(".panel-body").remove()}}))},_getNextPageBtn:function(){var a;a=this;return(new Element("tfoot")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("td",{colspan:"11","class":"text-center"})).insert({bottom:(new Element("span",{"class":"btn btn-primary","data-loading-text":"Fetching more results ..."})).update("Show More").observe("click",function(){a._pagination.pageNo=1*a._pagination.pageNo+1;jQuery(this).button("loading");
a.getResults()})})})})},_getOrderDetailsDiv:function(a){var c,b;c=a.infos[this._infoTypes.custName][0].value;b=a.infos[this._infoTypes.custEmail][0].value;return(new Element("div")).insert({bottom:(new Element("div")).update('<span class="glyphicon glyphicon-user" title="Customer Name"></span>: '+c)}).insert({bottom:(new Element("div")).update('<span class="glyphicon glyphicon-envelope" title="Customer Email"></span>: <a href="mailto:'+b+'">'+b+"</a>")}).insert({bottom:(new Element("div")).update('<span class="glyphicon glyphicon-shopping-cart" title="Order Date"></span>: '+
a.orderDate)}).insert({bottom:(new Element("div")).update("<strong>Shipping</strong>:")}).insert({bottom:(new Element("div")).update('<span class="glyphicon glyphicon-user" title="Customer Name"></span>: '+a.address.shipping.contactName)}).insert({bottom:(new Element("div")).update('<span class="glyphicon glyphicon-phone-alt" title="Phone"></span>: '+a.address.shipping.contactNo)}).insert({bottom:(new Element("div")).update('<span class="glyphicon glyphicon-map-marker" title="Address"></span>: '+
a.address.shipping.full)})},_getTitledDiv:function(a,c){return(new Element("div",{"class":"field_div"})).insert({bottom:(new Element("span",{"class":"inlineblock title"})).update(a)}).insert({bottom:(new Element("span",{"class":"inlineblock divcontent"})).update(c)})},_openDetailsPage:function(a){var c;c=this;jQuery.fancybox({width:"95%",height:"95%",autoScale:!1,autoDimensions:!1,fitToView:!1,autoSize:!1,helpers:{overlay:{locked:!1}},type:"iframe",href:"/orderdetails/"+a.id+".html?blanklayout=1",
beforeClose:function(){a&&a.id&&$(c.resultDivId).down(".order_item[order_id="+a.id+"]")&&$$("iframe.fancybox-iframe").first().contentWindow.pageJs&&$$("iframe.fancybox-iframe").first().contentWindow.pageJs._order&&$(c.resultDivId).down(".order_item[order_id="+a.id+"]").replace(c._getResultRow($$("iframe.fancybox-iframe").first().contentWindow.pageJs._order))}});return c},_getOrderInfoCell:function(a){var c,b,d,e;c=this;b=(new Element("div")).insert({bottom:(new Element("span")).insert({bottom:d=(new Element("a",
{id:"orderno-btn-"+a.id,"class":"orderNo visible-xs visible-sm visible-md visible-lg newPopover popovershipping",href:"javascript:void(0);"})).update(a.orderNo).insert({bottom:(new Element("div",{style:"display: none;","class":"popover_content"})).update(c._getOrderDetailsDiv(a))})})});c.observeClickNDbClick(d,function(b){e=b.target;jQuery(e).popover("hide");c._openDetailsPage(a)},function(a){});return b},_getPaymentCell:function(a,c){var b,d,e,f;b=this;switch(c){case "totalAmount":d="Total Amout";
e="totalAmount";break;case "totalPaid":d="Total Paid";e="totalPaid";break;case "totalCreditNoteValue":d="Total Credit Note Value";e="totalCreditNoteValue";break;case "totalCreditAvailable":d="Total Credit Available";e="totalCreditAvailable";a[e]=a.customer.creditpool?a.customer.creditpool.totalCreditLeft:0;break;default:d="ERROR(_getPaymentCell)"}return(new Element("a",{href:"javascript: void(0);"})).insert({bottom:a.passPaymentCheck&&"totalPaid"===c?(new Element("span",{title:0>=Math.round(a.totalDue,
2)?"Full Paid":"Short Paid","class":0>=Math.round(a.totalDue,2)?"text-success":"text-danger"})).setStyle("margin-right: 3px;").update(new Element("span",{"class":"glyphicon "+(0>=Math.round(a.totalDue,2)?"glyphicon-ok-sign":"glyphicon-warning-sign")})):""}).insert({bottom:(new Element("span")).update(f=b.getCurrency(a[e])).writeAttribute("title",d+":"+f)}).observe("click",function(){"totalCreditNoteValue"===e?window.open("/creditnote.html?orderid="+a.id,"_blank"):b._openDetailsPage(a)})},_getMarginCell:function(a){var c;
c=this;return(new Element("a",{href:"javascript: void(0);"})).insert({bottom:(new Element("span")).update(c.getCurrency(a.margin)).writeAttribute("title","Order margin:"+c.getCurrency(a.margin))}).observe("click",function(){c._openDetailsPage(a)})},_getPurchasingCell:function(a){var c,b,d;c=this;b=0<=["4","5","6","7","8"].indexOf(a.status.id);d=0<=["4","6"].indexOf(a.status.id);return(new Element("div")).insert({bottom:b?(new Element("a",{href:"javascript: void(0);","class":d?"text-danger":"text-success",
title:a.stockChkedWIssues?"insufficient stock":"Stock checked"})).update(new Element("span",{"class":"glyphicon "+(d?"glyphicon-warning-sign":"glyphicon-ok-sign")})).observe("click",function(){c._openDetailsPage(a)}):""})},_getWarehouseCell:function(a){var c,b,d;c=this;b=0<=["6","7","8"].indexOf(a.status.id);d=0<=["6"].indexOf(a.status.id);return(new Element("div")).insert({bottom:b?(new Element("a",{href:"javascript: void(0);","class":d?"text-danger":"text-success",title:a.chkedWIssues?"insufficient stock":
"Stock Handled successfully"})).update(new Element("span",{"class":"glyphicon "+(d?"glyphicon-warning-sign":"glyphicon-ok-sign")})).observe("click",function(){c._openDetailsPage(a)}):""})},_getResultRow:function(a,c){var b,d,e,f,g;b=this;e=(d=c||!1)?"D.Method":a.infos["9"]?a.infos[9][0].value:"";f=(new Element("tr",{"class":!0===d?"":"order_item",order_id:a.id})).store("data",a).insert({bottom:(new Element("td",{"class":"orderInfo  col-xs-1"})).update(d?"Order No.":b._getOrderInfoCell(a))}).insert({bottom:(new Element("td",
{"class":"order-date col-xs-1"})).update(!0===d?"Order Date":moment(b.loadUTCTime(a.orderDate)).format("ll"))}).insert({bottom:(new Element("td",{"class":"invoiceNo col-xs-1"})).update(!0===d?"Inv. No.":(new Element("small")).update(a.invNo))}).insert({bottom:(new Element("td",{"class":"pONo col-xs-1 hide-when-info hidden-sm"})).setStyle("style:word-wrap: break-word; word-break: break-all;").update(d?"PO No.":(new Element("div")).update(a.pONo))}).insert({bottom:(new Element("td",{"class":"customer",
title:!0===d?"":a.customer.tier.name})).update(!0===d?"Customer":a.customer.name)}).insert({bottom:(new Element("td",{"class":"Terms"})).update(!0===d?"Terms":b._getDaysInterval(a,a.customer.terms))}).insert({bottom:(new Element("td",{"class":"col-xs-3"})).update((new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"text-right col-xs-4 "})).update(d?"Total Amt":b._getPaymentCell(a,"totalAmount"))}).insert({bottom:(new Element("div",{"class":"text-right col-xs-4 "})).update(d?
"Paid Amt":b._getPaymentCell(a,"totalPaid"))}).insert({bottom:(new Element("div",{"class":"text-right col-xs-4 "+(0<a.totalCreditNoteValue?"tr-red":"")})).setStyle("padding: 0px;").update(d?"Credit Amt":b._getPaymentCell(a,"totalCreditAvailable"))}))}).insert({bottom:(new Element("td",{"class":"col-xs-1"})).update((new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"text-center",title:"Purchasing"})).update(d?"Pur.":b._getPurchasingCell(a))}))}).insert({bottom:(new Element("td",
{"class":"status col-xs-1 truncate",title:a.status.name,order_status:a.status.name})).update(a.status?a.status.name:"")}).insert({bottom:g=(new Element("td",{"class":"col-xs-1 truncate"+(-1<e.toLowerCase().indexOf("pickup")?" danger":""),title:e})).update(e)});b.observeClickNDbClick(g,function(){},d?function(){}:function(){b.showModalBox("Delivery Method for Order "+a.orderNo,e)});return f},_initDeliveryMethods:function(){var a,c;a=$(this.searchDivId).down('[search_field="delivery_method"]');this._signRandID(a);
jQuery("#"+a.id).select2({minimumInputLength:3,multiple:!0,allowClear:!0,ajax:{delay:250,url:"/ajax/getDeliveryMethods",type:"POST",data:function(a){return{searchTxt:a,storeId:jQuery("#storeId").attr("value"),userId:jQuery("#userId").attr("value")}},results:function(a,d,e){c=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){text=a.trim().stripTags();c.push({id:text+"{}",text:text,data:text})});return{results:c}},cache:!0}});return this},_initCustomerSelect2:function(){var a,
c;a=$(this.searchDivId).down("#custName");this._signRandID(a);jQuery("#"+a.id).select2({minimumInputLength:3,multiple:!1,allowClear:!0,ajax:{delay:250,url:"/ajax/getCustomers",type:"POST",data:function(a){return{searchTxt:a,storeId:jQuery("#storeId").attr("value"),userId:jQuery("#userId").attr("value")}},results:function(a,d,e){c=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){c.push({id:a.name,text:a.name,data:a})});return{results:c}},cache:!0}});return this},_changeType:function(a){var c;
jQuery(".type-swither-item.active").removeClass("active");this._type=$(a).addClassName("active").readAttribute("data-type");this._extraSearchCriteria=$(a).readAttribute("extraSearchCriteria");c="panel-default";switch(this._type){case "ORDER":c="panel-success";break;case "INVOICE":c="panel-default";break;case "QUOTE":c="panel-warning"}$(a).up(".panel").removeClassName("panel-success").removeClassName("panel-default").removeClassName("panel-warning").addClassName(c);$("searchBtn").click();return this},
_initTypeSwither:function(){var a;a=this;$$(".type-swither-item").each(function(c){c.observe("click",function(){a._changeType(this)})});return a},init:function(){var a,c;jQuery(".datepicker").datetimepicker({format:"DD/MM/YYYY"});this._initDeliveryMethods()._initCustomerSelect2()._initTypeSwither();$("right-panel").store("InsufficientStockOrdersListPanelJs",a=new InsufficientStockOrdersListPanelJs(this)).update(a.getListPanel().addClassName("panel-default"));a.load();$("salestarget-panel").store("SalesTargetListPanelJs",
c=new SalesTargetListPanelJs(this)).update(c.getListPanel().addClassName("panel-default"));c.load();this._loadProducts();return this},_getDaysInterval:function(a,c){if((invDate=a.invDate)&&"0001-01-01 00:00:00"!=invDate){var b=invDate,b=new Date(b.substr(0,4),b.substr(5,2)-1,b.substr(8,2),b.substr(11,2),b.substr(14,2),b.substr(17,2)),d=-(new Date).getTimezoneOffset()/60;b.setHours(b.getHours()+d);b=(new Date).getTime()-b.getTime();b=Math.floor(b/864E5);totalPaid=Math.round(100*a.totalPaid)/100;totalAmount=
Math.round(100*a.totalAmount)/100;return b>c&&totalPaid<totalAmount?(new Element("a",{href:"javascript: void(0);"})).insert({bottom:(new Element("div",{"class":"tr-red"})).update(c).writeAttribute("title","Over due expired :"+(b-c)+" days")}):c}return c},_loadProducts:function(){var a,c,b,d;a=$(this.searchDivId).down('[search_field="productId"]');this._signRandID(a);jQuery("#"+a.id).select2({minimumInputLength:3,multiple:!1,allowClear:!0,ajax:{url:"/ajax/getAll",dataType:"json",delay:10,type:"POST",
data:function(a,b){return{searchTxt:"sku like ? and active = 1",searchParams:["%"+a+"%"],entityName:"Product",pageNo:b,userId:jQuery("#userId").attr("value")}},results:function(a,b,d){c=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){c.push({id:a.id,text:a.sku,data:a})});return{results:c,more:a.resultData&&a.resultData.pagination&&a.resultData.pagination.totalPages&&b<a.resultData.pagination.totalPages}},cache:!0},formatResult:function(a){return a?'<div class="row"><div class="col-xs-12">'+
a.data.sku+"</div></div>":""},formatSelection:function(a){if(!a)return"";b=a.text;return d=(new Element("div")).update(b)},escapeMarkup:function(a){return a}});return this}});