var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{manufactures:[],suppliers:[],productCategories:[],productStatuses:[],_showRightPanel:!1,_nextPageColSpan:9,_getTitleRowData:function(){return{sku:"SKU",name:"Product Name",locations:"Locations",invenAccNo:"AccNo.",manufacturer:{name:"Brand"},supplierCodes:[{supplier:{name:"Supplier"},code:""}],active:"act?",stockOnOrder:"OnOrder",stockOnHand:"OnHand",stockOnPO:"OnPO"}},toggleSearchPanel:function(a){$(a).toggle();this.deSelectProduct();return this},_loadManufactures:function(a){this.manufactures=
a;var c;c=$(this.searchDivId).down('[search_field="pro.manufacturerIds"]');this.manufactures.each(function(b){c.insert({bottom:(new Element("option",{value:b.id})).update(b.name)})});return this},_loadProductStatuses:function(a){this.productStatuses=a;var c;c=$(this.searchDivId).down('[search_field="pro.productStatusIds"]');this.productStatuses.each(function(b){c.insert({bottom:(new Element("option",{value:b.id})).update(b.name)})});return this},_loadSuppliers:function(a){this.suppliers=a;var c;c=
$(this.searchDivId).down('[search_field="pro.supplierIds"]');this.suppliers.each(function(b){c.insert({bottom:(new Element("option",{value:b.id})).update(b.name)})});return this},_loadCategories:function(a){this.categories=a;var c;c=$(this.searchDivId).down('[search_field="pro.productCategoryIds"]');this.categories.sort(function(b,a){return b.namePath>a.namePath}).each(function(b){c.insert({bottom:(new Element("option",{value:b.id})).update(b.namePath)})});return this},_loadChosen:function(){jQuery(".chosen").select2();
return this},_bindSearchKey:function(){var a;a=this;$$("#searchBtn").first().observe("click",function(c){$$("#showSearch").first().checked?(a.deSelectProduct(),a.getSearchCriteria().getResults(!0,a._pagination.pageSize)):$$("#showSearch").first().click()});$("searchDiv").getElementsBySelector("[search_field]").each(function(c){c.observe("keydown",function(b){a.keydown(b,function(){$(a.searchDivId).down("#searchBtn").click()})})});return this},_getSupplierCodes:function(a,c){var b;b=[];a.each(function(a){b.push(!0===
c?"Supplier":'<abbr title="Code: '+a.code+'">'+(a.supplier&&a.supplier.name?a.supplier.name:"")+"</abbr>")});return b.join(", ")},_getLocations:function(a,c){var b;if(!0===c)return"Locations";b=[];a.each(function(a){b.push('<div><small><strong class="hidden-xs hide-when-info hidden-sm">'+a.type.name+': </strong><abbr title="Type: '+a.type.name+'">'+a.value+"</abbr></small></div>")});return b.join("")},_displayPriceMatchResult:function(a,c){var b,d,e,f,g;b=this;d=0;e=new Element("tbody");$H(a.companyPrices).each(function(a){0!==
parseInt(a.value.price)&&(0===parseInt(d)&&0<parseFloat(a.value.price)||parseFloat(a.value.price)<parseFloat(d))&&(d=a.value.price);e.insert({bottom:(new Element("tr")).insert({bottom:(new Element("td",{colspan:3})).update(a.key)}).insert({bottom:(new Element("td")).update(a.value.priceURL&&!a.value.priceURL.blank()?(new Element("a",{href:a.value.priceURL,target:"__blank"})).update(b.getCurrency(a.value.price)):b.getCurrency(a.value.price))})})});f=parseFloat(a.myPrice)-parseFloat(d);g="";0!==parseInt(d)&&
(0<parseInt(f)?g="label label-danger":0>parseInt(f)&&(g="label label-success"));return(new Element("table",{"class":"table table-striped table-hover price-match-listing"})).insert({bottom:(new Element("thead")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("th")).update("SKU")}).insert({bottom:(new Element("th")).update("My Price")}).insert({bottom:(new Element("th",{"class":"price_diff"})).update("Price Diff.")}).insert({bottom:(new Element("th")).update("Min Price")})})}).insert({bottom:(new Element("tbody")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("td")).update(a.sku)}).insert({bottom:(new Element("td")).update(new Element("input",
{"class":"click-to-edit price-input",value:b.getCurrency(a.myPrice),"product-id":c}))}).insert({bottom:(new Element("td",{"class":"price_diff"})).update((new Element("span",{"class":""+g})).update(b.getCurrency(f)))}).insert({bottom:(new Element("td",{"class":"price_min"})).update(b.getCurrency(d))})})}).insert({bottom:(new Element("thead")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("th",{colspan:3})).update("Company")}).insert({bottom:(new Element("th")).update("Price")})})}).insert({bottom:e})},
_getInfoPanel:function(a){return(new Element("div",{id:"info_panel_"+a.id})).insert({bottom:(new Element("div",{"class":"col-md-6"})).insert({bottom:(new Element("div",{"class":"panel panel-default price-match-div"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).update("<strong>Price Match</strong>")}).insert({bottom:(new Element("div",{"class":"panel-body price-match-listing"})).update(this.getLoadingImg())})})}).insert({bottom:(new Element("div",{"class":"col-md-6"})).insert({bottom:(new Element("div",
{"class":"panel panel-default price-trend-div"})).insert({bottom:(new Element("div",{"class":"panel-body"})).insert({bottom:new Element("iframe",{frameborder:"0",scrolling:"auto",width:"100%",height:"400px"})})})})}).insert({bottom:(new Element("div",{"class":"col-md-6"})).insert({bottom:(new Element("div",{"class":"panel panel-default"})).insert({bottom:(new Element("div",{"class":"panel-body"})).update("<h4>Reserved for Next Phase of Developing</h4>")})})}).insert({bottom:(new Element("div",{"class":"col-md-6"})).insert({bottom:(new Element("div",
{"class":"panel panel-default"})).insert({bottom:(new Element("div",{"class":"panel-body"})).update("<h4>Reserved for Next Phase of Developing</h4>")})})})},_showProductInfoOnRightPanel:function(a){var c,b,d;c=this;b=c._getInfoPanel(a);b.down(".price-trend-div iframe").writeAttribute("src","/statics/product/pricetrend.html?productid="+a.id);c.postAjax(c.getCallbackId("priceMatching"),{id:a.id},{onLoading:function(){b.down(".price-match-div .price-match-listing").replace((new Element("div",{"class":"panel-body price-match-listing"})).update(c.getLoadingImg()))},
onSuccess:function(b,f){try{if(d=c.getResp(f,!1,!0))$("info_panel_"+a.id)&&$("info_panel_"+a.id).down(".price-match-div .price-match-listing").replace(c._displayPriceMatchResult(d,a.id)),c._bindPriceInput()}catch(g){c.showModalBox("Error",g,!0)}}});return b},deSelectProduct:function(){jQuery(".product_item.success",jQuery("#"+this.resultDivId)).removeClass("success").popover("hide");$(this.resultDivId).up(".list-panel").removeClassName("col-xs-4").addClassName("col-xs-12");jQuery(".hide-when-info",
jQuery("#"+this.resultDivId)).show();this._showRightPanel=!1;return this},getResults:function(a,c){var b,d,e,f,g;b=this;d=a||!1;e=$(b.resultDivId);!0===d&&(b._pagination.pageNo=1);b._pagination.pageSize=c||b._pagination.pageSize;b.postAjax(b.getCallbackId("getItems"),{pagination:b._pagination,searchCriteria:b._searchCriteria},{onLoading:function(){jQuery("#"+b.searchDivId+" #searchBtn").button("loading");!0===d&&e.update((new Element("tr")).update((new Element("td")).update(b.getLoadingImg())))},
onSuccess:function(a,c){try{if(f=b.getResp(c,!1,!0))$(b.totalNoOfItemsId).update(f.pageStats.totalRows),!0===d&&e.update(b._getResultRow(b._getTitleRowData(),!0).wrap(new Element("thead"))),e.getElementsBySelector(".paginWrapper").each(function(a){a.remove()}),(g=$(e).down("tbody"))||$(e).insert({bottom:g=new Element("tbody")}),f.items.each(function(a){g.insert({bottom:b._getResultRow(a).addClassName("item_row").writeAttribute("item_id",a.id)})}),!0!==b._singleProduct?f.pageStats.pageNumber<f.pageStats.totalPages&&
e.insert({bottom:b._getNextPageBtn().addClassName("paginWrapper")}):0<f.items.size()&&b._displaySelectedProduct(f.items[0]),b._bindPriceInput()}catch(h){e.insert({bottom:b.getAlertBox("Error",h).addClassName("alert-danger")})}},onComplete:function(){jQuery("#"+b.searchDivId+" #searchBtn").button("reset")}})},_displaySelectedProduct:function(a){var c,b;c=this;$(c.resultDivId).up(".list-panel").removeClassName("col-xs-12").addClassName("col-xs-4");jQuery(".hide-when-info",jQuery("#"+c.resultDivId)).hide();
c._showRightPanel=!0;jQuery(".product_item.success",jQuery("#"+c.resultDivId)).removeClass("success").popover("hide");b=jQuery('[product_id="'+a.id+'"]',jQuery("#"+c.resultDivId)).addClass("success");b.hasClass("popover-loaded")||b.popover({title:'<div class="row"><div class="col-xs-10">Details for: '+a.sku+'</div><div class="col-xs-2"><a class="btn btn-primary btn-sm" href="/product/'+a.id+'.html" target="_BLANK"><span class="glyphicon glyphicon-pencil"></span></a><span class="btn btn-danger pull-right btn-sm" onclick="pageJs.deSelectProduct();"><span class="glyphicon glyphicon-remove"></span></span></div></div>',
html:!0,placement:"right",container:"body",trigger:"manual",viewport:{selector:".list-panel",padding:0},content:function(){return c._showProductInfoOnRightPanel(a).wrap(new Element("div")).innerHTML},template:'<div class="popover" role="tooltip" style="max-width: none; z-index: 0;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}).addClass("popover-loaded");b.popover("toggle");return c},toggleActive:function(a,c){var b,d;b=this;b.postAjax(b.getCallbackId("toggleActive"),
{productId:c.id,active:a},{onSuccess:function(a,f){try{(d=b.getResp(f,!1,!0))&&d.item&&0<$$(".product_item[product_id="+c.id+"]").size()&&$$(".product_item[product_id="+c.id+"]").first().replace(b._getResultRow(d.item,!1))}catch(g){b.showModalBox("ERROR",g,!0)}}});return b},_updatePrice:function(a,c,b){var d,e;d=this;d.postAjax(d.getCallbackId("updatePrice"),{productId:a,newPrice:d.getValueFromCurrency(c)},{onLoading:function(){},onSuccess:function(f,g){try{(e=d.getResp(g,!1,!0))&&e.item&&e.item.id&&
jQuery(".price-input[product-id="+e.item.id+"]").attr("original-price",d.getValueFromCurrency(c))}catch(k){d.showModalBox('<strong class="text-danger">Error When Update Price:</strong>',"<strong>"+k+"</strong>"),jQuery(".price-input[product-id="+a+"]").val(d.getCurrency(b))}}});return d},_updateStockLevel:function(a,c,b,d){var e,f,g;e=this;"stockMinLevel"!==d&&"stockReorderLevel"!==d&&e.showModalBox("Error","Invalid type passin to tmp.me._updateStockLevel");e.postAjax(e.getCallbackId("updateStockLevel"),
{productId:a,newValue:c,type:d},{onLoading:function(){},onSuccess:function(k,l){try{(f=e.getResp(l,!1,!0))&&f.item&&f.item.id&&(jQuery("."+d+"-input[product-id="+f.item.id+"]").attr("original-"+d,c),g=$(e.resultDivId).down(".product_item[product_id="+f.item.id+"]"))&&(g.replace(e._getResultRow(f.item,!1)),e._bindPriceInput())}catch(h){e.showModalBox('<strong class="text-danger">Error When Update '+d+":</strong>","<strong>"+h+"</strong>"),jQuery("."+d+"-input[product-id="+a+"]").val(b)}}});return e},
_bindPriceInput:function(){var a,c,b;a=this;jQuery(".price-input[product-id]").not(".price-input-binded").click(function(){jQuery(this).attr("original-price",a.getValueFromCurrency(jQuery(this).val())).select()}).keydown(function(b){c=jQuery(this);a.keydown(b,function(){c.blur()})}).focusout(function(){b=a.getValueFromCurrency(jQuery(this).val());jQuery(this).val(a.getCurrency(b))}).change(function(){a._updatePrice(jQuery(this).attr("product-id"),jQuery(this).val(),a.getValueFromCurrency(jQuery(this).attr("original-price")))}).addClass("price-input-binded");
jQuery(".stockMinLevel-input[product-id]").not(".stockMinLevel-input-binded").click(function(){jQuery(this).attr("original-stockMinLevel",jQuery(this).val()).select()}).keydown(function(b){c=jQuery(this);a.keydown(b,function(){c.blur()})}).focusout(function(){b=jQuery(this).val();jQuery(this).val(b)}).change(function(){a._updateStockLevel(jQuery(this).attr("product-id"),jQuery(this).val(),jQuery(this).attr("original-stockMinLevel"),"stockMinLevel")}).addClass("stockMinLevel-input-binded");jQuery(".stockReorderLevel-input[product-id]").not(".stockReorderLevel-input-binded").click(function(){jQuery(this).attr("original-stockReorderLevel",
jQuery(this).val()).select()}).keydown(function(b){c=jQuery(this);a.keydown(b,function(){c.blur()})}).focusout(function(){b=jQuery(this).val();jQuery(this).val(b)}).change(function(){a._updateStockLevel(jQuery(this).attr("product-id"),jQuery(this).val(),jQuery(this).attr("original-stockReorderLevel"),"stockReorderLevel")}).addClass("stockReorderLevel-input-binded");return a},_getResultRow:function(a,c){var b={me:this};b.tag=!0===b.isTitle?"th":"td";b.isTitle=c||!1;b.price="";a.prices&&a.prices.each(function(a){a.type&&
1===parseInt(a.type.id)&&(b.price=a.price)});b.row=(new Element("tr",{"class":"visible-xs visible-md visible-lg visible-sm "+(!0===b.isTitle?"":"product_item "+(a.stockOnHand<=a.stockMinLevel?"danger":a.stockOnHand<=a.stockReorderLevel?"warning":"")),product_id:a.id})).store("data",a).insert({bottom:(new Element(b.tag,{"class":"sku",title:a.name})).addClassName("col-xs-2").insert({bottom:(new Element("span")).setStyle("margin: 0 5px 0 0").insert({bottom:(new Element("input",{type:"checkbox","class":"product-selected"})).observe("click",
function(){b.checked=this.checked;!0===b.isTitle&&$(b.me.resultDivId).getElementsBySelector(".product_item .product-selected").each(function(a){a.checked=b.checked})})})}).insert({bottom:!0===b.isTitle?a.sku:(new Element("a",{href:"javascript: void(0);","class":"sku-link"})).observe("click",function(c){b.me._displaySelectedProduct(a)}).update(a.sku)})}).insert({bottom:(new Element(b.tag,{"class":"product_name hidden-xs hide-when-info hidden-sm"})).addClassName("col-xs-2").setStyle(b.me._showRightPanel?
"display: none":"").update(a.name)}).insert({bottom:(new Element(b.tag,{"class":"hidden-xs hide-when-info hidden-sm"})).addClassName("col-xs-2").setStyle(b.me._showRightPanel?"display: none":"").insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(!0===b.isTitle?"Price":(new Element("input",{"class":"click-to-edit price-input",value:b.me.getCurrency(b.price),"product-id":a.id})).setStyle("width: 100%"))}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(!0===b.isTitle?"Min St":
(new Element("input",{"class":"click-to-edit stockMinLevel-input",value:a.stockMinLevel,"product-id":a.id})).setStyle("width: 100%"))}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(!0===b.isTitle?"Re St":(new Element("input",{"class":"click-to-edit stockReorderLevel-input",value:a.stockReorderLevel,"product-id":a.id})).setStyle("width: 100%"))})}).insert({bottom:(new Element(b.tag,{"class":"locations hide-when-info hidden-sm"})).addClassName("col-xs-1").update(a.locations?b.me._getLocations(a.locations,
c):"")}).insert({bottom:(new Element(b.tag,{"class":"inventeryCode hide-when-info"})).addClassName("col-xs-1").update(a.invenAccNo?a.invenAccNo:"")}).insert({bottom:(new Element(b.tag,{"class":"manufacturer hide-when-info"})).addClassName("col-xs-1").update(a.manufacturer?a.manufacturer.name:"")}).insert({bottom:(new Element(b.tag,{"class":"supplier hide-when-info hidden-sm"})).addClassName("col-xs-1").update(a.supplierCodes?b.me._getSupplierCodes(a.supplierCodes,c):"")}).insert({bottom:(new Element(b.tag,
{"class":"qty hidden-sm"})).addClassName("col-xs-1").update(!0===b.isTitle?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Stock on Hand"})).update("SH")}).insert({bottom:(new Element("div",{"class":"col-xs-4",title:"Average Cost"})).update("Cost")}).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Stock On PO"})).update("SP")}):(new Element("div",{"class":"row"})).update((new Element("a",{href:"/productqtylog.html?productid="+
a.id,target:"_BLANK"})).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Stock on Hand"})).update(a.stockOnHand)}).insert({bottom:(new Element("div",{"class":"col-xs-4",title:"Average Cost"})).update(0!=a.totalOnHandValue&&0!=a.stockOnHand?b.me.getCurrency(a.totalOnHandValue/a.stockOnHand):"N/A")}).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Stock On PO"})).update(a.stockOnPO)})))}).insert({bottom:(new Element(b.tag,{"class":"product_active hide-when-info hidden-sm"})).addClassName("col-xs-1").insert({bottom:(new Element("div",
{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-5 text-right"})).insert({bottom:!0===b.isTitle?"Act?":new Element("input",{type:"checkbox",disabled:!0,checked:a.active})})}).insert({bottom:(new Element("div",{"class":"col-xs-3"})).insert({bottom:!0===b.isTitle?"":(new Element("a",{href:"/serialnumbers.html?productid="+a.id,target:"_BLANK",title:"Serial Numbers."})).update("SN")})}).insert({bottom:(new Element("div",{"class":"col-xs-4"})).insert({bottom:!0===b.isTitle?"":(new Element("div",
{"class":""})).insert({bottom:(new Element("a",{"class":"btn btn-primary btn-xs",href:"/product/"+a.id+".html",target:"_BLANK"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-pencil"})})}).insert({bottom:!0===a.active?(new Element("span",{"class":"btn btn-danger btn-xs"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(c){Event.stop(c);b.btn=this;confirm("You are about to deactivate this product.\n Continue?")&&b.me.toggleActive(!1,
a)}):(new Element("span",{"class":"btn btn-success btn-xs"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-repeat"})}).observe("click",function(c){Event.stop(c);b.btn=this;confirm("You are about to ReACTIVATE this product.\n Continue?")&&b.me.toggleActive(!0,a)})})})})})});return b.row}});