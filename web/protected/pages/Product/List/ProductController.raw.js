var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{manufactures:[],suppliers:[],_tickAll:!1,productCategories:[],productStatuses:[],_showRightPanel:!1,_nextPageColSpan:9,_autoLoading:!1,_postIndex:null,_selected:null,_priceMatchRule:null,newRuleResultContainerId:"new_rule_result_container",_getTitleRowData:function(){return{sku:"SKU",name:"Product Name",locations:"Locations",invenAccNo:"AccNo.",manufacturer:{name:"Brand"},supplierCodes:[{supplier:{name:"Supplier"},code:""}],active:"act?",stockOnOrder:"OnOrder",
stockOnHand:"OnHand",stockOnPO:"OnPO"}},toggleSearchPanel:function(b){$(b).toggle();this.deSelectProduct();return this},_loadManufactures:function(b){this.manufactures=b;var c;c=$(this.searchDivId).down('[search_field="pro.manufacturerIds"]');this.manufactures.each(function(a){c.insert({bottom:(new Element("option",{value:a.id})).update(a.name)})});return this},_loadProductStatuses:function(b){this.productStatuses=b;var c;c=$(this.searchDivId).down('[search_field="pro.productStatusIds"]');this.productStatuses.each(function(a){c.insert({bottom:(new Element("option",
{value:a.id})).update(a.name)})});return this},_loadSuppliers:function(b){this.suppliers=b;var c;c=$(this.searchDivId).down('[search_field="pro.supplierIds"]');this.suppliers.each(function(a){c.insert({bottom:(new Element("option",{value:a.id})).update(a.name)})});return this},_loadCategories:function(b){this.categories=b;var c;c=$(this.searchDivId).down('[search_field="pro.productCategoryIds"]');this.categories.sort(function(a,b){return a.namePath>b.namePath}).each(function(a){c.insert({bottom:(new Element("option",
{value:a.id})).update(a.namePath)})});return this},_loadChosen:function(){jQuery(".chosen").select2({minimumResultsForSearch:Infinity});return this},_getSelection:function(){var b,c,a;b=[];$("item-list").getElementsBySelector(".product_item.item_row").each(function(d){c=d.down('input.product-selected[type="checkbox"]').checked;a=d.readAttribute("product_id");!0===c&&!0===jQuery.isNumeric(a)&&b.push(d.retrieve("data"))});$("total-selected-count").update(b.length);return b},_bindSearchKey:function(){var b;
b=this;$$("#searchBtn").first().observe("click",function(c){$$("#showSearch").first().checked?(b._tickAll=!1,b.deSelectProduct(),b.getSearchCriteria().getResults(!0,b._pagination.pageSize)):$$("#showSearch").first().click()});$("searchDiv").getElementsBySelector("[search_field]").each(function(c){c.observe("keydown",function(a){b.keydown(a,function(){$(b.searchDivId).down("#searchBtn").click()})})});return this},_getSupplierCodes:function(b,c){var a;a=[];b.each(function(b){a.push(!0===c?"Supplier":
'<abbr title="Code: '+b.code+'">'+(b.supplier&&b.supplier.name?b.supplier.name:"")+"</abbr>")});return a.join(", ")},postNewRule:function(b,c){var a,d,e,f,g;a=this;d=b||null;e=c||!1;null!==d&&a._signRandID(d);a._priceMatchRule.price_from=a.getValueFromCurrency(a._priceMatchRule.price_from);a._priceMatchRule.price_to=a.getValueFromCurrency(a._priceMatchRule.price_to);a._priceMatchRule.offset=a.getValueFromCurrency(a._priceMatchRule.offset);a._priceMatchRule.active=!0===e?!1:!0;a._selected[a._postIndex]?
(window.onbeforeunload=function(){return"Processing... Please Do not close"},(f=$(a.modalId))&&f.down(".modal-header").update('<h4 style="color:red;">Processing... Please Do NOT close</h4>'),a.postAjax(a.getCallbackId("newRule"),{productId:a._selected[a._postIndex].id,rule:a._priceMatchRule},{onLoading:function(){null!==d&&jQuery(".right-panel.btn").button("loading")},onSuccess:function(b,e){try{(g=a.getResp(e,!1,!0))&&$(a.newRuleResultContainerId).insert({bottom:(new Element("d",{"class":"col-xs-9"})).update(a._selected[a._postIndex].sku)}).insert({bottom:(new Element("div",
{"class":"col-xs-3"})).update("done")})}catch(d){$(a.newRuleResultContainerId).insert({top:a.getAlertBox("",d).addClassName("alert-danger col-xs-12").insert({top:(new Element("b",{"class":"col-xs-12"})).update("SKU: "+a._selected[a._postIndex].sku)})})}},onComplete:function(){window.onbeforeunload=null;null!==d&&jQuery(".right-panel.btn").button("reset");a._postIndex+=1;a.postNewRule(d,e)}})):($(a.newRuleResultContainerId).insert({top:(new Element("div",{"class":"col-xs-12"})).update("All Done!")}),
a.hideModalBox(),jQuery("#"+a.modalId).remove(),$("searchBtn").click())},_bindNewRuleBtn:function(b,c){var a,d,e,f,g,h;a=this;d=c||null;e=b||$("newPriceMatchRuleBtn");a.observeClickNDbClick(e,function(){f=a._getSelection();g=$("total-found-count").innerHTML;null===d&&null!==f&&0<f.length?(h=(new Element("div")).insert({bottom:(new Element("h3",{"class":"col-lg-12"})).update("only <b>"+f.length+"</b> out of <b>"+g+"</b> is selected, Contrinue?")}).insert({bottom:(new Element("i",{"class":"btn btn-danger btn-lg"})).update("No").observe("click",
function(){a.hideModalBox()})}).insert({bottom:(new Element("i",{"class":"btn btn-success btn-lg pull-right"})).update("Yes").setStyle(0===f.length?"display: none;":"").observe("click",function(){jQuery("#select2-drop-mask").select2("close");$(this).up(".modal-body").update("").insert({bottom:a._getPriceMatchRuleEl(null,f)}).insert({bottom:new Element("div",{"class":"row",id:a.newRuleResultContainerId})});a._getPriceMatchCompanySelect2(jQuery('[match_rule="company_id"]'),!0)})}),a.showModalBox("Warning",
h,!1,null,null,!0)):d&&jQuery.isNumeric(d.id)},null);return a},_getPriceMatchCompanySelect2:function(b,c){var a,d,e,f;a=this;d=c||null;e=jQuery(b).select2({ajax:{delay:250,url:"/ajax/getAll",type:"POST",data:function(a){return{searchTxt:"companyName like ?",searchParams:["%"+a+"%"],entityName:"PriceMatchCompany"}},results:function(b,e,d){f=[];b.resultData&&b.resultData.items&&b.resultData.items.each(function(b){!1===a._checkUniquePriceMatchCompanies(f,b)&&f.push({id:b.id,text:b.companyName,data:b})});
return{results:f}}},cache:!0,escapeMarkup:function(a){return a}});null!==d&&d.priceMatchRule&&d.priceMatchRule.id&&d.priceMatchRule.priceMatchCompany&&d.priceMatchRule.priceMatchCompany.id&&e.select2("data",{id:d.priceMatchRule.priceMatchCompany.id,text:d.priceMatchRule.priceMatchCompany.companyName,data:d.priceMatchRule.priceMatchCompany});return e},_checkUniquePriceMatchCompanies:function(b,c){var a;a=!1;b.each(function(b){!1===a&&b.text===c.companyName&&(a=!0)});return a},_getLocations:function(b,
c){var a;if(!0===c)return"Locations";a=[];b.each(function(b){a.push('<div><small><strong class="hidden-xs hide-when-info hidden-sm">'+b.type.name+': </strong><abbr title="Type: '+b.type.name+'">'+b.value+"</abbr></small></div>")});return a.join("")},_displayPriceMatchResult:function(b,c){var a,d,e,f,g;a=this;d=0;e=new Element("tbody");$H(b.companyPrices).each(function(b){0!==parseInt(b.value.price)&&(0===parseInt(d)&&0<parseFloat(b.value.price)||parseFloat(b.value.price)<parseFloat(d))&&(d=b.value.price);
e.insert({bottom:(new Element("tr")).insert({bottom:(new Element("td",{colspan:3})).update(b.key).addClassName(c.priceMatchRule&&b.key===c.priceMatchRule.priceMatchCompany.companyName?"success":"")}).insert({bottom:(new Element("td")).update(b.value.priceURL&&!b.value.priceURL.blank()?(new Element("a",{href:b.value.priceURL,target:"__blank"})).update(a.getCurrency(b.value.price)):a.getCurrency(b.value.price))})})});f=parseFloat(b.myPrice)-parseFloat(d);g="";0!==parseInt(d)&&(0<parseInt(f)?g="label label-danger":
0>parseInt(f)&&(g="label label-success"));return(new Element("table",{"class":"table table-striped table-hover price-match-listing"})).insert({bottom:(new Element("thead")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("th")).update("SKU")}).insert({bottom:(new Element("th")).update("My Price")}).insert({bottom:(new Element("th",{"class":"price_diff"})).update("Price Diff.")}).insert({bottom:(new Element("th")).update("Min Price")})})}).insert({bottom:(new Element("tbody")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("td")).update(b.sku)}).insert({bottom:(new Element("td")).update(new Element("input",
{"class":"click-to-edit price-input",value:a.getCurrency(b.myPrice),"product-id":c.id}))}).insert({bottom:(new Element("td",{"class":"price_diff"})).update((new Element("span",{"class":""+g})).update(a.getCurrency(f)))}).insert({bottom:(new Element("td",{"class":"price_min"})).update(a.getCurrency(d))})})}).insert({bottom:(new Element("thead")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("th",{colspan:3})).update("Company")}).insert({bottom:(new Element("th")).update("Price")})})}).insert({bottom:e})},
_getInfoPanel:function(b){return(new Element("div",{id:"info_panel_"+b.id})).insert({bottom:(new Element("div",{"class":"col-md-6"})).insert({bottom:(new Element("div",{"class":"panel panel-default price-match-div"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).update("<strong>Price Match</strong>")}).insert({bottom:(new Element("div",{"class":"panel-body price-match-listing"})).update(this.getLoadingImg())})})}).insert({bottom:(new Element("div",{"class":"col-md-6"})).insert({bottom:(new Element("div",
{"class":"panel panel-default price-trend-div"})).insert({bottom:(new Element("div",{"class":"panel-body"})).insert({bottom:new Element("iframe",{frameborder:"0",scrolling:"auto",width:"100%",height:"400px"})})})})}).insert({bottom:(new Element("div",{"class":"col-md-6"})).insert({bottom:(new Element("div",{"class":"panel panel-default"})).insert({bottom:(new Element("div",{"class":"panel-body"})).update("<h4>Reserved for Next Phase of Developing</h4>")})})}).insert({bottom:(new Element("div",{"class":"col-md-6"})).insert({bottom:(new Element("div",
{"class":"panel panel-default"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).update("<strong>Price Match Rule</strong>")}).insert({bottom:(new Element("div",{"class":"panel-body"})).update(this._getPriceMatchRuleEl(b))})})})},_getPriceMatchRuleEl:function(b,c){var a,d,e,f;a=this;d=b||null;e=c||null;return(new Element("div",{"class":""})).insert({bottom:(new Element("div",{"class":"col-xs-12"})).insert({bottom:(new Element("div",{"class":"form-group form-group-sm input-group"})).insert({bottom:(new Element("label",
{"class":"contorl-label input-group-addon"})).update("Target Competitor")}).insert({bottom:new Element("input",{type:"text","class":"form-control input-sm rightPanel",match_rule:"company_id"})})})}).insert({bottom:(new Element("div",{"class":"col-xs-6"})).insert({bottom:(new Element("div",{"class":"form-group form-group-sm input-group"})).insert({bottom:(new Element("label",{"class":"contorl-label input-group-addon"})).update("Lower Safty Boundary")}).insert({bottom:(new Element("input",{type:"text",
"class":"form-control input-sm",match_rule:"price_from",value:d&&d.priceMatchRule?d.priceMatchRule.price_from:""})).observe("keyup",function(a){$(this).up(".modal-body").down('[match_rule="price_to"]').value=$F($(this))}).observe("keydown",function(b){f=this;a.keydown(b,function(){Event.stop(b);$(f).up(".modal-body").down('[match_rule="offset"]').focus();$(f).up(".modal-body").down('[match_rule="offset"]').select()},function(){},Event.KEY_TAB)})})})}).insert({bottom:(new Element("div",{"class":"col-xs-6"})).insert({bottom:(new Element("div",
{"class":"form-group form-group-sm input-group"})).insert({bottom:(new Element("label",{"class":"contorl-label input-group-addon"})).update("Upper Safty Boundary")}).insert({bottom:(new Element("input",{type:"text","class":"form-control input-sm",match_rule:"price_to",value:d&&d.priceMatchRule?d.priceMatchRule.price_to:""})).observe("keyup",function(a){$(this).up(".modal-body").down('[match_rule="price_from"]').value=$F($(this))})})})}).insert({bottom:(new Element("div",{"class":"col-xs-9"})).insert({bottom:(new Element("div",
{"class":"form-group form-group-sm input-group"})).insert({bottom:(new Element("label",{"class":"contorl-label input-group-addon"})).update("Extra Margin After Price Match")}).insert({bottom:new Element("input",{type:"text","class":"form-control input-sm",match_rule:"offset",value:d&&d.priceMatchRule?d.priceMatchRule.offset:""})})})}).insert({bottom:(new Element("div",{"class":"col-xs-3 text-right"})).insert({bottom:(new Element("i",{"class":"btn btn-sm btn-success btn-new-rule right-panel"})).update("Confirm").observe("click",
function(b){a._priceMatchRule=a._collectFormData($(this).up(".modal-body"),"match_rule");a._selected=null===d?e:d;a._postIndex=0;a.postNewRule($(this))})}).insert({bottom:(new Element("i",{"class":"btn btn-sm btn-danger btn-del-rule right-panel"})).update('<i class="glyphicon glyphicon-trash"></i>').observe("click",function(b){a._priceMatchRule=a._collectFormData($(this).up(".modal-body"),"match_rule");a._selected=null===d?e:d;a._postIndex=0;a.postNewRule($(this),!0)})})})},_showProductInfoOnRightPanel:function(b){var c,
a,d;c=this;a=c._getInfoPanel(b);a.down(".price-trend-div iframe").writeAttribute("src","/statics/product/pricetrend.html?productid="+b.id);c.postAjax(c.getCallbackId("priceMatching"),{id:b.id},{onLoading:function(){a.down(".price-match-div .price-match-listing").replace((new Element("div",{"class":"panel-body price-match-listing"})).update(c.getLoadingImg()))},onSuccess:function(a,f){try{if(d=c.getResp(f,!1,!0))$("info_panel_"+b.id)&&$("info_panel_"+b.id).down(".price-match-div .price-match-listing").replace(c._displayPriceMatchResult(d,
b)),c._bindPriceInput()}catch(g){c.showModalBox("Error",g,!0)}}});return a},deSelectProduct:function(){jQuery(".product_item.success",jQuery("#"+this.resultDivId)).removeClass("success").popover("hide");$(this.resultDivId).up(".list-panel").removeClassName("col-xs-4").addClassName("col-xs-12");jQuery(".hide-when-info",jQuery("#"+this.resultDivId)).show();this._showRightPanel=!1;return this},getResults:function(b,c,a,d){var e,f,g,h,k,l,m;e=this;f=b||!1;g=a||!1;h=$(e.resultDivId);!0===f&&(e._pagination.pageNo=
1);!0===g&&0<$$(".btn-show-more").length&&(e._autoLoading=!0,e._pagination.pageNo=1*e._pagination.pageNo+1);e._pagination.pageSize=c||e._pagination.pageSize;e.postAjax(e.getCallbackId("getItems"),{pagination:e._pagination,searchCriteria:e._searchCriteria},{onLoading:function(){jQuery("#"+e.searchDivId+" .btn").button("loading");jQuery("#"+e.searchDivId+" input").prop("disabled",!0);jQuery("#"+e.searchDivId+" select").prop("disabled",!0);!0===f&&h.update((new Element("tr")).update((new Element("td")).update(e.getLoadingImg())));
$(e.totalQtyId).update(0);$(e.totalValueId).update(e.getCurrency(0))},onSuccess:function(a,b){try{if(k=e.getResp(b,!1,!0))$(e.totalNoOfItemsId).update(k.pageStats.totalRows),$(e.totalQtyId).update(k.totalStockOnHand),$(e.totalValueId).update(e.getCurrency(k.totalOnHandValue)),!0===f&&h.update(e._getResultRow(e._getTitleRowData(),!0).wrap(new Element("thead"))),h.getElementsBySelector(".paginWrapper").each(function(a){a.remove()}),(l=$(h).down("tbody"))||$(h).insert({bottom:l=new Element("tbody")}),
k.items.each(function(a){l.insert({bottom:m=e._getResultRow(a).addClassName("item_row").writeAttribute("item_id",a.id)});e._tickAll&&m.down(".product-selected").click()}),!0!==e._singleProduct?k.pageStats.pageNumber<k.pageStats.totalPages&&h.insert({bottom:e._getNextPageBtn().addClassName("paginWrapper")}):0<k.items.size()&&e._displaySelectedProduct(k.items[0]),e._bindPriceInput(),!0===g&&0<$$(".btn-show-more").length?e.getResults(!1,e._pagination.pageSize,!0):(e._autoLoading=!1,e.hideModalBox(),
jQuery("#"+e.searchDivId+" .btn").button("reset"),jQuery("#"+e.searchDivId+" input").prop("disabled",!1),jQuery("#"+e.searchDivId+" select").prop("disabled",!1)),e._getSelection()}catch(c){h.insert({bottom:e.getAlertBox("Error",c).addClassName("alert-danger")})}},onComplete:function(){!0!==g&&(jQuery("#"+e.searchDivId+" .btn").button("reset"),jQuery("#"+e.searchDivId+" input").prop("disabled",!1),jQuery("#"+e.searchDivId+" select").prop("disabled",!1))}})},_displaySelectedProduct:function(b){var c,
a,d,e;c=this;$(c.resultDivId).up(".list-panel").removeClassName("col-xs-12").addClassName("col-xs-4");jQuery(".hide-when-info",jQuery("#"+c.resultDivId)).hide();c._showRightPanel=!0;jQuery(".product_item.success",jQuery("#"+c.resultDivId)).removeClass("success").popover("hide");a=jQuery('[product_id="'+b.id+'"]',jQuery("#"+c.resultDivId)).addClass("success");a.hasClass("popover-loaded")||a.on("shown.bs.popover",function(a){c._getPriceMatchCompanySelect2(jQuery('.rightPanel[match_rule="company_id"]'),
null,b);d=$$(".btn-new-rule.right-panel").first().up(".panel-body");$$(".btn-new-rule.right-panel").first().observe("click",function(a){c._priceMatchRule=c._collectFormData($(this).up(".panel-body"),"match_rule");c._selected=[b];c._postIndex=0;c.postNewRule($(this))});$$(".btn-del-rule.right-panel").first().observe("click",function(a){c._priceMatchRule=c._collectFormData($(this).up(".panel-body"),"match_rule");c._selected=[b];c._postIndex=0;c.postNewRule($(this),!0)});b.priceMatchRule&&b.priceMatchRule.id&&
jQuery.isNumeric(b.priceMatchRule.id)||$$(".btn-del-rule.right-panel").first().hide();d.down('[match_rule="price_from"]').observe("keyup",function(a){$(this).up(".panel-body").down('[match_rule="price_to"]').value=$F($(this))}).observe("keydown",function(a){e=this;c.keydown(a,function(){Event.stop(a);$(e).up(".panel-body").down('[match_rule="offset"]').focus();$(e).up(".panel-body").down('[match_rule="offset"]').select()},function(){},Event.KEY_TAB)})}).popover({title:'<div class="row"><div class="col-xs-10">Details for: '+
b.sku+'</div><div class="col-xs-2"><div class="btn-group pull-right"><a class="btn btn-primary btn-sm" href="/product/'+b.id+'.html" target="_BLANK"><span class="glyphicon glyphicon-pencil"></span></a><span class="btn btn-danger btn-sm" onclick="pageJs.deSelectProduct();"><span class="glyphicon glyphicon-remove"></span></span></div></div></div>',html:!0,placement:"right",container:"body",trigger:"manual",viewport:{selector:".list-panel",padding:0},content:function(){return c._showProductInfoOnRightPanel(b).wrap(new Element("div")).innerHTML},
template:'<div class="popover" role="tooltip" style="max-width: none; z-index: 0;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}).addClass("popover-loaded");a.popover("show");return c},toggleSellOnWeb:function(b,c){var a,d;a=this;a.postAjax(a.getCallbackId("toggleSellOnWeb"),{productId:c.id,isSellOnWeb:b},{onSuccess:function(b,f){try{(d=a.getResp(f,!1,!0))&&d.item&&(0<$$(".product_item[product_id="+c.id+"]").size()&&$$(".product_item[product_id="+
c.id+"]").first().replace(a._getResultRow(d.item,!1)),a._bindPriceInput())}catch(g){a.showModalBox("ERROR",g,!0)}}});return a},toggleActive:function(b,c){var a,d;a=this;a.postAjax(a.getCallbackId("toggleActive"),{productId:c.id,active:b},{onSuccess:function(b,f){try{(d=a.getResp(f,!1,!0))&&d.item&&(0<$$(".product_item[product_id="+c.id+"]").size()&&$$(".product_item[product_id="+c.id+"]").first().replace(a._getResultRow(d.item,!1)),a._bindPriceInput())}catch(g){a.showModalBox("ERROR",g,!0)}}});return a},
toggleIsKit:function(b,c){var a,d,e;a=this;a.postAjax(a.getCallbackId("toggleIsKit"),{productId:c.id,isKit:b},{onSuccess:function(b,g){d=c;try{e=a.getResp(g,!1,!0);if(!e||!e.item)return;d=e.item}catch(h){a.showModalBox("ERROR",h,!0)}0<$$(".product_item[product_id="+c.id+"]").size()&&$$(".product_item[product_id="+c.id+"]").first().replace(a._getResultRow(d,!1));a._bindPriceInput()}});return a},toggleManualFeed:function(b,c){var a,d,e;a=this;a.postAjax(a.getCallbackId("toggleManualFeed"),{productId:c.id,
isManualFeed:b},{onSuccess:function(b,g){d=c;try{e=a.getResp(g,!1,!0);if(!e||!e.item)return;d=e.item}catch(h){a.showModalBox("ERROR",h,!0)}0<$$(".product_item[product_id="+c.id+"]").size()&&$$(".product_item[product_id="+c.id+"]").first().replace(a._getResultRow(d,!1));a._bindPriceInput()}});return a},_updatePrice:function(b,c,a,d){var e,f;e=this;d="1"===d?1:0;e.postAjax(e.getCallbackId("updatePrice"),{productId:b,newPrice:e.getValueFromCurrency(c),isSpecial:d},{onLoading:function(){},onSuccess:function(d,
h){try{(f=e.getResp(h,!1,!0))&&f.item&&f.item.id&&jQuery(".price-input[product-id="+f.item.id+"]").attr("original-price",e.getValueFromCurrency(c))}catch(k){e.showModalBox('<strong class="text-danger">Error When Update Price:</strong>',"<strong>"+k+"</strong>"),jQuery(".price-input[product-id="+b+"]").val(e.getCurrency(a))}}});return e},_updateStockLevel:function(b,c,a,d){var e,f,g;e=this;"stockMinLevel"!==d&&"stockReorderLevel"!==d&&e.showModalBox("Error","Invalid type passin to tmp.me._updateStockLevel");
e.postAjax(e.getCallbackId("updateStockLevel"),{productId:b,newValue:c,type:d},{onLoading:function(){},onSuccess:function(h,k){try{(f=e.getResp(k,!1,!0))&&f.item&&f.item.id&&(jQuery("."+d+"-input[product-id="+f.item.id+"]").attr("original-"+d,c),g=$(e.resultDivId).down(".product_item[product_id="+f.item.id+"]"))&&(g.replace(e._getResultRow(f.item,!1)),e._bindPriceInput())}catch(l){e.showModalBox('<strong class="text-danger">Error When Update '+d+":</strong>","<strong>"+l+"</strong>"),jQuery("."+d+
"-input[product-id="+b+"]").val(a)}}});return e},_bindPriceInput:function(){var b,c,a;b=this;jQuery('.price-input[product-id]:not(".price-input-binded")').click(function(){jQuery(this).attr("original-price",b.getValueFromCurrency(jQuery(this).val())).select()}).keydown(function(a){c=jQuery(this);b.keydown(a,function(){c.blur()})}).focusout(function(){a=b.getValueFromCurrency(jQuery(this).val());jQuery(this).val(b.getCurrency(a))}).change(function(){b._updatePrice(jQuery(this).attr("product-id"),jQuery(this).val(),
b.getValueFromCurrency(jQuery(this).attr("original-price")),jQuery(this).attr("isSpecial"))}).addClass("price-input-binded");jQuery(".stockMinLevel-input[product-id]").not(".stockMinLevel-input-binded").click(function(){jQuery(this).attr("original-stockMinLevel",jQuery(this).val()).select()}).keydown(function(a){c=jQuery(this);b.keydown(a,function(){c.blur()})}).focusout(function(){a=jQuery(this).val();jQuery(this).val(a)}).change(function(){b._updateStockLevel(jQuery(this).attr("product-id"),jQuery(this).val(),
jQuery(this).attr("original-stockMinLevel"),"stockMinLevel")}).addClass("stockMinLevel-input-binded");jQuery(".stockReorderLevel-input[product-id]").not(".stockReorderLevel-input-binded").click(function(){jQuery(this).attr("original-stockReorderLevel",jQuery(this).val()).select()}).keydown(function(a){c=jQuery(this);b.keydown(a,function(){c.blur()})}).focusout(function(){a=jQuery(this).val();jQuery(this).val(a)}).change(function(){b._updateStockLevel(jQuery(this).attr("product-id"),jQuery(this).val(),
jQuery(this).attr("original-stockReorderLevel"),"stockReorderLevel")}).addClass("stockReorderLevel-input-binded");return b},_getNextPageBtn:function(){var b,c;b=this;c=$("total-found-count").innerHTML;return(new Element("tfoot")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("td",{colspan:b._nextPageColSpan,"class":"text-center"})).insert({bottom:(new Element("span",{"class":"btn btn-primary btn-show-more","data-loading-text":"Fetching more results ..."})).update("Next Page").observe("click",
function(){b._pagination.pageNo=1*b._pagination.pageNo+1;jQuery(this).button("loading");b.getResults(!1,b._pagination.pageSize,!1,!0)})}).insert({bottom:(new Element("span",{"class":"btn btn-warning btn-show-more","data-loading-text":"Fetching more results ..."})).update("<b>Show ALL Pages</b>").setStyle("margin-left: 10px; color: black;").observe("click",function(){1E3<c?b.showModalBox("Warning","<h3>There are "+c+" products for current search conditions. <br/>Please narrow down the search"):b.getResults(!1,
b._pagination.pageSize,!0)})})})})},_getResultRow:function(b,c){var a={me:this};a.tag=!0===a.isTitle?"th":"td";a.isTitle=c||!1;a.price="";a.specilaPrice="";a.srp="";b.prices&&b.prices.each(function(b){b.type&&1===parseInt(b.type.id)?(a.price=b.price,a.updatedDate=b.updated):b.type&&2===parseInt(b.type.id)?a.specilaPrice=b.price:b.type&&7===parseInt(b.type.id)&&(a.srp=b.price)});a.row=(new Element("tr",{"class":"visible-xs visible-md visible-lg visible-sm "+(!0===a.isTitle?"":"product_item "+(parseInt(b.stockOnHand,
10)<=parseInt(b.stockMinLevel,10)?"danger":parseInt(b.stockOnHand,10)<=parseInt(b.stockReorderLevel,10)?"warning":"")),product_id:b.id})).store("data",b).insert({bottom:(new Element(a.tag,{"class":"sku",title:b.name})).addClassName("col-xs-1").observe("click",function(b){a.me._signRandID($(this));"INPUT"!=b.target.nodeName&&(jQuery("#"+$(this).id).find(":checkbox").prop("checked",!jQuery("#"+$(this).id).find(":checkbox").prop("checked")),!0===a.isTitle&&(a.checked=jQuery("#"+$(this).id).find(":checkbox").prop("checked"),
a.me._tickAll=a.checked,$(a.me.resultDivId).getElementsBySelector(".product_item .product-selected").each(function(b){b.checked=a.checked})));a.me._getSelection()}).insert({bottom:(new Element("span")).setStyle("margin: 0 5px 0 0").insert({bottom:(new Element("input",{type:"checkbox","class":"product-selected"})).observe("click",function(b){a.checked=this.checked;!0===a.isTitle&&(a.me._tickAll=a.checked,$(a.me.resultDivId).getElementsBySelector(".product_item .product-selected").each(function(b){b.checked=
a.checked}));a.me._getSelection()})})}).insert({bottom:!0===a.isTitle?b.sku:(new Element("a",{href:"javascript: void(0);","class":"sku-link truncate"})).observe("click",function(c){Event.stop(c);a.me._displaySelectedProduct(b)}).update(b.sku).setStyle(!1===b.sellOnWeb?"color: red;":"color: blue;")})}).insert({bottom:(new Element(a.tag,{"class":"product_name hidden-xs hide-when-info hidden-sm"})).addClassName("col-xs-3").setStyle(a.me._showRightPanel?"display: none":"").update(!0===a.isTitle?(new Element("div",
{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-1"})).update("")}).insert({bottom:(new Element("div",{"class":"col-sm-9"})).update("Product Name")}).insert({bottom:(new Element("div",{"class":"col-sm-2"})).update("IsKit?")}):(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-1"})).setStyle("padding: 0px;").insert({bottom:!0===a.isTitle?"":(new Element("div",{"class":"col-sm-1"})).insert({bottom:(new Element("a",{"class":"btn btn-primary btn-xs",
href:"/product/"+b.id+".html",target:"_BLANK"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-pencil"})})})})}).insert({bottom:(new Element("div",{"class":"col-sm-9"})).update(""===a.srp?b.name:'<abbr title="SRP: '+a.me.getCurrency(a.srp)+'">'+b.name+"</abbr>")}).setStyle(""===a.srp?";":"color: green;").insert({bottom:(new Element("div",{"class":"col-sm-2"})).update((new Element("input",{type:"checkbox",checked:b.isKit})).observe("click",function(c){a.btn=this;a.checked=$(a.btn).checked;
confirm(!0===a.checked?"You are about to set this product to a KIT, which you can NOT PICK or SHIP without providing a KIT barcode.\n Continue?":"You are about to set this product to NOT a KIT, which you can PICK or SHIP without providing a KIT barcode\n Continue?")?a.me.toggleIsKit(a.checked,b):$(a.btn).checked=!a.checked}))}))}).insert({bottom:(new Element(a.tag,{"class":"hidden-xs hide-when-info hidden-sm row"})).addClassName("col-xs-2").setStyle(a.me._showRightPanel?"display: none":"").insert({bottom:(new Element("div",
{"class":"col-sm-6"})).update(!0===a.isTitle?"Price":(new Element("input",{"class":"click-to-edit price-input",value:a.me.getCurrency(a.price),"product-id":b.id})).setStyle("width: 80%"))}).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(!0===a.isTitle?"Special Price":(new Element("input",{"class":"click-to-edit price-input",value:a.me.getCurrency(a.specilaPrice),"product-id":b.id,isSpecial:"1"})).setStyle("width: 80%"))})}).insert({bottom:a.match=(new Element(a.tag,{"class":"match"+
b.id+" hide-when-info hidden-sm",style:"width:5%"})).addClassName("col-xs-1").update().insert({bottom:(new Element("div",{"class":"col-sm-12"})).update(!0===a.isTitle?"Match":(new Element("span")).update(b.priceMatchRule&&b.priceMatchRule.priceMatchCompany?'<abbr title="Updated: '+a.updatedDate+'">'+b.priceMatchRule.priceMatchCompany.companyName+"</abbr>":"").setStyle("width: 100%"))})}).insert({bottom:(new Element(a.tag,{"class":"ManFeed hide-when-info hidden-sm",style:"width:5%"})).addClassName("col-xs-1").insert({bottom:(new Element("div",
{"class":"col-xs-12"})).insert({bottom:!0===a.isTitle?"ManFeed?":(new Element("input",{type:"checkbox",checked:b.manualDatafeed})).observe("click",function(c){a.btn=this;a.checked=$(a.btn).checked;confirm(!0===a.checked?"You are about to manual datafeed this product.\n Continue?":"You are about to NOT manfual datafeed this product.\n Continue?")?a.me.toggleManualFeed(a.checked,b):$(a.btn).checked=!a.checked})})})}).insert({bottom:(new Element(a.tag,{"class":"locations hide-when-info hidden-sm",style:"width:8%"})).addClassName("col-xs-1").update(b.locations?
a.me._getLocations(b.locations,c):"")}).insert({bottom:(new Element(a.tag,{"class":"sellonweb hide-when-info hidden-sm ",style:"width:1%"})).addClassName("col-xs-1").insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-3 text-right"})).insert({bottom:!0===a.isTitle?"SOW?":(new Element("input",{type:"checkbox",checked:b.sellOnWeb})).observe("click",function(c){a.btn=this;a.checked=$(a.btn).checked;confirm(!0===a.checked?"You are about to sell this product on web again.\n Continue?":
"You are NOT about to sell this product on web.\n Continue?")?a.me.toggleSellOnWeb(a.checked,b):$(a.btn).checked=!a.checked})})})})}).insert({bottom:(new Element(a.tag,{"class":"manufacturer hide-when-info",style:"width:5%"})).addClassName("col-xs-1").update(b.manufacturer?b.manufacturer.name:"")}).insert({bottom:(new Element(a.tag,{"class":"supplier hide-when-info hidden-sm",style:"width:5%"})).addClassName("col-xs-1").update(b.supplierCodes?a.me._getSupplierCodes(b.supplierCodes,c):"")}).insert({bottom:(new Element(a.tag,
{"class":"qty hidden-sm"})).addClassName("col-xs-1").update(!0===a.isTitle?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-4",title:"Stock on Hand"})).update("SH")}).insert({bottom:(new Element("div",{"class":"col-xs-4",title:"Average Cost"})).update("Cost")}).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Stock On PO"})).update("SP")}):(new Element("div",{"class":"row"})).update((new Element("a",{href:"/productqtylog.html?productid="+
b.id,target:"_BLANK"})).insert({bottom:(new Element("div",{"class":"col-xs-4",title:"Stock on Hand"})).update(b.stockOnHand)}).insert({bottom:(new Element("div",{"class":"col-xs-4",title:"Average Cost"})).update(0!=b.totalOnHandValue&&0!=b.stockOnHand?a.me.getCurrency(b.totalOnHandValue/b.stockOnHand):"N/A")}).insert({bottom:(new Element("div",{"class":"col-xs-4 hide-when-info",title:"Stock On PO"})).update(b.stockOnPO)})))}).insert({bottom:(new Element(a.tag,{"class":"product_active hide-when-info hidden-sm ",
style:"width:4%"})).addClassName("col-xs-1").insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-2 text-right"})).insert({bottom:!0===a.isTitle?"Act?":(new Element("input",{type:"checkbox",checked:b.active})).observe("click",function(c){a.btn=this;a.checked=$(a.btn).checked;confirm(!0===a.checked?"You are about to ReACTIVATE this product.\n Continue?":"You are about to deactivate this product.\n Continue?")&&a.me.toggleActive(a.checked,b)})})}).insert({bottom:(new Element("div",
{"class":"col-xs-2"})).setStyle("padding: 0px;").insert({bottom:!0===a.isTitle?"":(new Element("a",{href:"/serialnumbers.html?productid="+b.id,target:"_BLANK",title:"Serial Numbers."})).update("SN")})})})});if(!a.isTitle&&b.priceMatchRule&&a.updatedDate){var d=a.updatedDate,d=new Date(d.substr(0,4),d.substr(5,2)-1,d.substr(8,2),d.substr(11,2),d.substr(14,2),d.substr(17,2));d.setHours(d.getHours()+10);d=((new Date).getTime()-d.getTime())/864E5;1>d?jQuery(a.match).css({"background-color":"green"}):
2>d?jQuery(a.match).css({"background-color":"yellow"}):jQuery(a.match).css({"background-color":"orange"})}return a.row}});