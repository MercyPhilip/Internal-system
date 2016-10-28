var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{manufactures:[],suppliers:[],productCategories:[],productStatuses:[],_nextPageColSpan:9,_autoLoading:!1,_getTitleRowData:function(){return{sku:"SKU",name:"Product Name",shortDesc:"Short Description",manufacturer:{name:"Brand"},supplierCodes:[{supplier:{name:"Supplier"},code:""}],stockOnHand:"SOH"}},_loadManufactures:function(a){this.manufactures=a;var b;b=$(this.searchDivId).down('[search_field="pro.manufacturerIds"]');this.manufactures.each(function(a){b.insert({bottom:(new Element("option",{value:a.id})).update(a.name)})});
return this},_loadProductStatuses:function(a){this.productStatuses=a;var b;b=$(this.searchDivId).down('[search_field="pro.productStatusIds"]');this.productStatuses.each(function(a){b.insert({bottom:(new Element("option",{value:a.id})).update(a.name)})});return this},_loadSuppliers:function(a){this.suppliers=a;var b;b=$(this.searchDivId).down('[search_field="pro.supplierIds"]');this.suppliers.each(function(a){b.insert({bottom:(new Element("option",{value:a.id})).update(a.name)})});return this},_loadCategories:function(a){this.categories=
a;var b;b=$(this.searchDivId).down('[search_field="pro.productCategoryIds"]');this.categories.sort(function(a,b){return a.namePath>b.namePath}).each(function(a){b.insert({bottom:(new Element("option",{value:a.id})).update(a.namePath)})});return this},_loadChosen:function(){jQuery(".chosen").select2({minimumResultsForSearch:Infinity});return this},_bindSearchKey:function(){var a;a=this;$$("#searchBtn").first().observe("click",function(b){a.getSearchCriteria().getResults(!0,a._pagination.pageSize)});
$("searchDiv").getElementsBySelector("[search_field]").each(function(b){b.observe("keydown",function(b){a.keydown(b,function(){$(a.searchDivId).down("#searchBtn").click()})})});return this},_bindExcelKey:function(){var a;a=this;$$("#excelBtn").first().observe("click",function(b){a.getSearchCriteria().genReport(!0)});return this},_getSupplierCodes:function(a,b){var d;d=[];a.each(function(a){d.push(!0===b?"Supplier":'<abbr title="Code: '+a.code+'">'+(a.supplier&&a.supplier.name?a.supplier.name:"")+
"</abbr>")});return d.join(", ")},getResults:function(a,b,d,g){var c,e,h,f,k,m,l;c=this;e=a||!1;h=d||!1;f=$(c.resultDivId);!0===e&&(c._pagination.pageNo=1);!0===h&&0<$$(".btn-show-more").length&&(c._autoLoading=!0,c._pagination.pageNo=1*c._pagination.pageNo+1);c._pagination.pageSize=b||c._pagination.pageSize;c.postAjax(c.getCallbackId("getItems"),{pagination:c._pagination,searchCriteria:c._searchCriteria},{onLoading:function(){jQuery("#"+c.searchDivId+" .btn").button("loading");jQuery("#"+c.searchDivId+
" input").prop("disabled",!0);jQuery("#"+c.searchDivId+" select").prop("disabled",!0);!0===e&&f.update((new Element("tr")).update((new Element("td")).update(c.getLoadingImg())))},onSuccess:function(a,b){try{if(k=c.getResp(b,!1,!0))$(c.totalNoOfItemsId).update(k.pageStats.totalRows),!0===e&&f.update(c._getResultRow(c._getTitleRowData(),!0).wrap(new Element("thead"))),f.getElementsBySelector(".paginWrapper").each(function(a){a.remove()}),(m=$(f).down("tbody"))||$(f).insert({bottom:m=new Element("tbody")}),
k.items.each(function(a){m.insert({bottom:l=c._getResultRow(a).addClassName("item_row").writeAttribute("item_id",a.id)});c._bindDatePicker(l)}),!0!==c._singleProduct&&k.pageStats.pageNumber<k.pageStats.totalPages&&f.insert({bottom:c._getNextPageBtn().addClassName("paginWrapper")}),c._bindPriceInput(),!0===h&&0<$$(".btn-show-more").length?c.getResults(!1,c._pagination.pageSize,!0):(c._autoLoading=!1,c.hideModalBox(),jQuery("#"+c.searchDivId+" .btn").button("reset"),jQuery("#"+c.searchDivId+" input").prop("disabled",
!1),jQuery("#"+c.searchDivId+" select").prop("disabled",!1))}catch(n){f.insert({bottom:c.getAlertBox("Error",n).addClassName("alert-danger")})}},onComplete:function(){!0!==h&&(jQuery("#"+c.searchDivId+" .btn").button("reset"),jQuery("#"+c.searchDivId+" input").prop("disabled",!1),jQuery("#"+c.searchDivId+" select").prop("disabled",!1))}})},_updateStockLevel:function(a,b,d,g){var c,e,h,f;c=this;"stockMinLevel"!==g&&"stockReorderLevel"!==g&&c.showModalBox("Error","Invalid type passin to updateStockLevel");
c.postAjax(c.getCallbackId("updateStockLevel"),{productId:a,newValue:b,type:g},{onLoading:function(){},onSuccess:function(k,m){try{(e=c.getResp(m,!1,!0))&&e.item&&e.item.id&&(jQuery("."+g+"-input[product-id="+e.item.id+"]").attr("original-"+g,b),h=$(c.resultDivId).down(".product_item[product_id="+e.item.id+"]"))&&(h.replace(f=c._getResultRow(e.item,!1)),c._bindDatePicker(f),c._bindPriceInput())}catch(l){c.showModalBox('<strong class="text-danger">Error When Update '+g+":</strong>","<strong>"+l+"</strong>"),
jQuery("."+g+"-input[product-id="+a+"]").val(d)}}});return c},_updateETA:function(a,b,d,g){var c,e,h,f;c=this;c.postAjax(c.getCallbackId("updateETA"),{productId:a,poId:b,newETA:d,oldETA:g},{onLoading:function(){},onSuccess:function(a,b){try{(e=c.getResp(b,!1,!0))&&e.item&&e.item.id&&(h=$(c.resultDivId).down(".product_item[product_id="+e.item.id+"]"))&&(h.replace(f=c._getResultRow(e.item,!1)),c._bindDatePicker(f),c._bindPriceInput())}catch(l){c.showModalBox('<strong class="text-danger">Error When Update ETA :</strong>',
"<strong>"+l+"</strong>")}}});return c},_bindPriceInput:function(){var a,b,d;a=this;jQuery(".stockMinLevel-input[product-id]").not(".stockMinLevel-input-binded").click(function(){jQuery(this).attr("original-stockMinLevel",jQuery(this).val()).select()}).keydown(function(d){b=jQuery(this);a.keydown(d,function(){b.blur()})}).focusout(function(){d=jQuery(this).val();jQuery(this).val(d)}).change(function(){a._updateStockLevel(jQuery(this).attr("product-id"),jQuery(this).val(),jQuery(this).attr("original-stockMinLevel"),
"stockMinLevel")}).addClass("stockMinLevel-input-binded");return a},_getNextPageBtn:function(){var a,b;a=this;b=$("total-found-count").innerHTML;return(new Element("tfoot")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("td",{colspan:a._nextPageColSpan,"class":"text-center"})).insert({bottom:(new Element("span",{"class":"btn btn-primary btn-show-more","data-loading-text":"Fetching more results ..."})).update("Next Page").observe("click",function(){a._pagination.pageNo=1*a._pagination.pageNo+
1;jQuery(this).button("loading");a.getResults(!1,a._pagination.pageSize,!1,!0)})}).insert({bottom:(new Element("span",{"class":"btn btn-warning btn-show-more","data-loading-text":"Fetching more results ..."})).update("<b>Show ALL Pages</b>").setStyle("margin-left: 10px; color: black;").observe("click",function(){1E3<b?a.showModalBox("Warning","<h3>There are "+b+" products for current search conditions. <br/>Please narrow down the search"):a.getResults(!1,a._pagination.pageSize,!0)})})})})},_getResultRow:function(a,
b){var d={me:this};d.tag=!0===d.isTitle?"th":"td";d.isTitle=b||!1;d.row=(new Element("tr",{"class":"visible-xs visible-md visible-lg visible-sm "+(!0===d.isTitle?"":"product_item "),product_id:a.id})).store("data",a).insert({bottom:(new Element(d.tag,{"class":"sku",title:a.name})).addClassName("col-xs-1").insert({bottom:a.sku})}).insert({bottom:(new Element(d.tag,{"class":"product_name hidden-xs hide-when-info hidden-sm"})).addClassName("col-xs-2").insert({bottom:a.name})}).insert({bottom:(new Element(d.tag,
{"class":"manufacturer hide-when-info",style:"width:5%"})).addClassName("col-xs-1").update(a.manufacturer?a.manufacturer.name:"")}).insert({bottom:(new Element(d.tag,{"class":"supplier hide-when-info hidden-sm",style:"width:5%"})).addClassName("col-xs-1").update(a.supplierCodes?d.me._getSupplierCodes(a.supplierCodes,b):"")}).insert({bottom:(new Element(d.tag,{"class":"hidden-xs hide-when-info hidden-sm row"})).addClassName("col-xs-3").insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(!0===
d.isTitle?"Last Buy Price":d.me.getCurrency(a.lastbuyprice))}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(!0===d.isTitle?"Mini Stock Level":(new Element("input",{"class":"click-to-edit stockMinLevel-input",value:a.stockMinLevel,"product-id":a.id})).setStyle("width: 80%"))}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(!0===d.isTitle?"ETA":(new Element("input",{"class":"click-to-edit eta-input datepicker",value:a.eta,poId:a.poId,"product-id":a.id})).setStyle("width: 100%"))})}).insert({bottom:(new Element(d.tag,
{"class":"qty hidden-sm"})).addClassName("col-xs-2").update(!0===d.isTitle?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-6",title:"Stock on Hand"})).update("SH")}).insert({bottom:(new Element("div",{"class":"col-xs-6 hide-when-info",title:"Stock On PO"})).update("SP")}):(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-6",title:"Stock on Hand"})).update(a.stockOnHand)}).insert({bottom:(new Element("div",{"class":"col-xs-6 hide-when-info",
title:"Stock On PO"})).update(a.stockOnPO)}))}).insert({bottom:(new Element(d.tag,{"class":"runrate hidden-sm"})).addClassName("col-xs-2").update(!0===d.isTitle?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Run rate of 7 days"})).update("1W")}).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Run rate of 14 days"})).update("2W")}).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Run rate of 1 month"})).update("1M")}):
(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Run rate of 7 days"})).update(a.ow)}).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Run rate of 14 days"})).update(a.tw)}).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Run rate of 1 month"})).update(a.om)}))});return d.row},_bindDatePicker:function(a){var b;b=this;etaCtl=a.down(".datepicker");b._signRandID(etaCtl);jQuery("#"+
etaCtl.id).datetimepicker({format:"YYYY-MM-DD",useCurrent:!1});(a=jQuery("#"+etaCtl.id).attr("value"))&&jQuery("#"+etaCtl.id).data("DateTimePicker").date(new Date(a));jQuery("#"+etaCtl.id).on("dp.change",function(a){var d=a.date?a.date.format("YYYY-MM-DD"):"";a=a.oldDate?a.oldDate.format("YYYY-MM-DD"):"";var c=jQuery(this).attr("poId");c?b._updateETA(jQuery(this).attr("product-id"),c,d,a):jQuery(this).val("").datetimepicker("update")});return b},genReport:function(a){var b={me:this};b.resultDiv=$(b.me.resultDivId);
b.me.postAjax(b.me.getCallbackId("genReport"),{searchCriteria:b.me._searchCriteria},{onLoading:function(){jQuery("#"+b.me.searchDivId+" .btn").button("loading");jQuery("#"+b.me.searchDivId+" input").prop("disabled",!0);jQuery("#"+b.me.searchDivId+" select").prop("disabled",!0);!0===b.reset&&b.resultDiv.update((new Element("tr")).update((new Element("td")).update(b.me.getLoadingImg())))},onSuccess:function(a,g){try{if(b.result=b.me.getResp(g,!1,!0),b.result&&b.result.url&&(b.newWind=window.open(b.result.url),
!b.newWind))throw'You browser is blocking the popup window, please click <a class="btn btn-xs btn-primary" href="'+b.result.url+'" target="__BLANK">here</a> to open it manually.';}catch(c){b.resultDiv.insert({bottom:b.me.getAlertBox("Error",c).addClassName("alert-danger")})}},onComplete:function(){!0!==b.auto&&(jQuery("#"+b.me.searchDivId+" .btn").button("reset"),jQuery("#"+b.me.searchDivId+" input").prop("disabled",!1),jQuery("#"+b.me.searchDivId+" select").prop("disabled",!1))}});return b.me}});