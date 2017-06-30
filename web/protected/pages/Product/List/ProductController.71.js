var PageJs=new Class.create;PageJs.prototype=Object.extend(new CRUDPageJs,{manufactures:[],suppliers:[],_tickAll:!1,productCategories:[],productStatuses:[],_showRightPanel:!1,_nextPageColSpan:9,_autoLoading:!1,_readOnlyMode:!1,_storeId:1,_roleId:0,_postIndex:null,_selected:null,_priceMatchRule:null,newRuleResultContainerId:"new_rule_result_container",_getTitleRowData:function(){return{sku:"SKU",name:"Product Name",locations:"Locations",invenAccNo:"AccNo.",manufacturer:{name:"Brand"},supplierCodes:[{supplier:{name:"Supplier"},code:""}],active:"act?",stockOnOrder:"OnOrder",stockOnHand:"OnHand",stockOnPO:"OnPO"}},toggleSearchPanel:function(e){var t={};return t.me=this,$(e).toggle(),t.me.deSelectProduct(),t.me},setConfigPriceMatch:function(e){return this._priceMatchSetting=e,0==this._priceMatchSetting&&jQuery("#newPriceMatchRuleBtn").hide(),this},setConfigGst:function(e){return this._gstSetting=e,"INC"==this._gstSetting?this._gstText="(inc GST)":this._gstText="(ex GST)",this},_loadManufactures:function(e){this.manufactures=e;var t={};return t.me=this,t.selectionBox=$(t.me.searchDivId).down('[search_field="pro.manufacturerIds"]'),t.me.manufactures.each(function(e){t.selectionBox.insert({bottom:new Element("option",{value:e.id}).update(e.name)})}),this},_loadProductStatuses:function(e){this.productStatuses=e;var t={};return t.me=this,t.selectionBox=$(t.me.searchDivId).down('[search_field="pro.productStatusIds"]'),t.me.productStatuses.each(function(e){t.selectionBox.insert({bottom:new Element("option",{value:e.id}).update(e.name)})}),this},_loadSuppliers:function(e){this.suppliers=e;var t={};return t.me=this,t.selectionBox=$(t.me.searchDivId).down('[search_field="pro.supplierIds"]'),t.me.suppliers.each(function(e){t.selectionBox.insert({bottom:new Element("option",{value:e.id}).update(e.name)})}),this},_loadCategories:function(e){this.categories=e;var t={};return t.me=this,t.selectionBox=$(t.me.searchDivId).down('[search_field="pro.productCategoryIds"]'),t.me.categories.sort(function(e,t){return e.namePath>t.namePath}).each(function(e){t.selectionBox.insert({bottom:new Element("option",{value:e.id}).update(e.namePath)})}),this},_loadChosen:function(){return jQuery(".chosen").select2({minimumResultsForSearch:1/0}),this},_getSelection:function(){var e={};return e.me=this,e.products=[],e.itemList=$("item-list"),e.itemList.getElementsBySelector(".product_item.item_row").each(function(t){e.checked=t.down('input.product-selected[type="checkbox"]').checked,e.productId=t.readAttribute("product_id"),!0===e.checked&&!0===jQuery.isNumeric(e.productId)&&e.products.push(t.retrieve("data"))}),$("total-selected-count").update(e.products.length),e.products},_bindSearchKey:function(){var e={};return e.me=this,$$("#searchBtn").first().observe("click",function(t){$$("#showSearch").first().checked?(e.me._tickAll=!1,e.me.deSelectProduct(),e.me.getSearchCriteria().getResults(!0,e.me._pagination.pageSize)):$$("#showSearch").first().click()}),$("searchDiv").getElementsBySelector("[search_field]").each(function(t){t.observe("keydown",function(t){e.me.keydown(t,function(){$(e.me.searchDivId).down("#searchBtn").click()})})}),this},_getSupplierCodes:function(e,t){var n={};return n.me=this,n.supplierCodeString=[],e.each(function(e){n.supplierCodeString.push(!0===t?"Supplier":'<abbr title="Code: '+e.code+'">'+(e.supplier&&e.supplier.name?e.supplier.name:"")+"</abbr>")}),n.supplierCodeString.join(", ")},postNewRule:function(e,t){var n={};n.me=this,n.btn=e||null,n.del=t||!1,null!==n.btn&&n.me._signRandID(n.btn),n.me._priceMatchRule.price_from=n.me.getValueFromCurrency(n.me._priceMatchRule.price_from),n.me._priceMatchRule.price_to=n.me.getValueFromCurrency(n.me._priceMatchRule.price_to),n.me._priceMatchRule.offset=n.me.getValueFromCurrency(n.me._priceMatchRule.offset),n.me._priceMatchRule.active=!0!==n.del,n.me._selected[n.me._postIndex]?(window.onbeforeunload=function(){return"Processing... Please Do not close"},n.ModalBox=$(n.me.modalId),n.ModalBox&&n.ModalBox.down(".modal-header").update('<h4 style="color:red;">Processing... Please Do NOT close</h4>'),n.me.postAjax(n.me.getCallbackId("newRule"),{productId:n.me._selected[n.me._postIndex].id,rule:n.me._priceMatchRule},{onLoading:function(){null!==n.btn&&jQuery(".right-panel.btn").button("loading")},onSuccess:function(e,t){try{if(n.result=n.me.getResp(t,!1,!0),!n.result)return;$(n.me.newRuleResultContainerId).insert({bottom:new Element("d",{class:"col-xs-9"}).update(n.me._selected[n.me._postIndex].sku)}).insert({bottom:new Element("div",{class:"col-xs-3"}).update("done")})}catch(e){$(n.me.newRuleResultContainerId).insert({top:n.me.getAlertBox("",e).addClassName("alert-danger col-xs-12").insert({top:new Element("b",{class:"col-xs-12"}).update("SKU: "+n.me._selected[n.me._postIndex].sku)})})}},onComplete:function(){window.onbeforeunload=null,null!==n.btn&&jQuery(".right-panel.btn").button("reset"),n.me._postIndex=n.me._postIndex+1,n.me.postNewRule(n.btn,n.del)}})):($(n.me.newRuleResultContainerId).insert({top:new Element("div",{class:"col-xs-12"}).update("All Done!")}),n.me.hideModalBox(),jQuery("#"+n.me.modalId).remove(),$("searchBtn").click())},_bindNewRuleBtn:function(e,t){var n={};return n.me=this,n.product=t||null,n.btn=e||$("newPriceMatchRuleBtn"),n.me.observeClickNDbClick(n.btn,function(){n.selected=n.me._getSelection(),n.totalQty=$("total-found-count").innerHTML,null===n.product&&null!==n.selected&&n.selected.length>0?(n.warningMsg=new Element("div").insert({bottom:new Element("h3",{class:"col-lg-12"}).update("only <b>"+n.selected.length+"</b> out of <b>"+n.totalQty+"</b> is selected, Contrinue?")}).insert({bottom:new Element("i",{class:"btn btn-danger btn-lg"}).update("No").observe("click",function(){n.me.hideModalBox()})}).insert({bottom:new Element("i",{class:"btn btn-success btn-lg pull-right"}).update("Yes").setStyle(0===n.selected.length?"display: none;":"").observe("click",function(){jQuery("#select2-drop-mask").select2("close"),$(this).up(".modal-body").update("").insert({bottom:n.ruleContainer=n.me._getPriceMatchRuleEl(null,n.selected)}).insert({bottom:new Element("div",{class:"row",id:n.me.newRuleResultContainerId})}),n.me._getPriceMatchCompanySelect2(jQuery('[match_rule="company_id"]'),!0)})}),n.me.showModalBox("Warning",n.warningMsg,!1,null,null,!0)):n.product&&jQuery.isNumeric(n.product.id)},null),n.me},_getPriceMatchCompanySelect2:function(e,t){var n={};return n.me=this,n.product=t||null,n.selectBox=jQuery(e).select2({ajax:{delay:250,url:"/ajax/getAll",type:"POST",data:function(e){return{searchTxt:"companyName like ?",searchParams:["%"+e+"%"],entityName:"PriceMatchCompany"}},results:function(e,t,o){return n.result=[],e.resultData&&e.resultData.items&&e.resultData.items.each(function(e){!1===n.me._checkUniquePriceMatchCompanies(n.result,e)&&n.result.push({id:e.id,text:e.companyName,data:e})}),{results:n.result}}},cache:!0,escapeMarkup:function(e){return e}}),null!==n.product&&n.product.priceMatchRule&&n.product.priceMatchRule.id&&n.product.priceMatchRule.priceMatchCompany&&n.product.priceMatchRule.priceMatchCompany.id&&n.selectBox.select2("data",{id:n.product.priceMatchRule.priceMatchCompany.id,text:n.product.priceMatchRule.priceMatchCompany.companyName,data:n.product.priceMatchRule.priceMatchCompany}),n.selectBox},_checkUniquePriceMatchCompanies:function(e,t){var n={};return n.me=this,n.found=!1,e.each(function(e){!1===n.found&&e.text===t.companyName&&(n.found=!0)}),n.found},_getLocations:function(e,t){var n={};return n.me=this,!0===t?"Locations":(n.locationStrings=[],e.each(function(e){n.locationStrings.push('<div><small><strong class="hidden-xs hide-when-info hidden-sm">'+e.type.name+': </strong><abbr title="Type: '+e.type.name+'">'+e.value+"</abbr></small></div>")}),n.locationStrings.join(""))},_displayPriceMatchResult:function(e,t){var n={};return n.me=this,n.minPrice=0,$H(e.companyPrices).each(function(e){0!==parseInt(e.value.price)&&(0===parseInt(n.minPrice)&&parseFloat(e.value.price)>0||parseFloat(e.value.price)<parseFloat(n.minPrice))&&(n.minPrice=e.value.price)}),n.priceDiff=parseFloat(e.myPrice)-parseFloat(n.minPrice),n.priceDiffClass="",0!==parseInt(n.minPrice)&&(parseInt(n.priceDiff)>0?n.priceDiffClass="label label-danger":parseInt(n.priceDiff)<0&&(n.priceDiffClass="label label-success")),n.newDiv=new Element("table",{class:"table table-striped table-hover price-match-listing"}).insert({bottom:new Element("thead").insert({bottom:new Element("tr").insert({bottom:new Element("th").update("My Price")}).insert({bottom:new Element("th",{class:"price_diff"}).update("Price Diff.")}).insert({bottom:new Element("th").update("Min Price")})})}).insert({bottom:new Element("tbody").insert({bottom:new Element("tr").insert({bottom:new Element("td").update(n.priceInput=new Element("input",{class:"click-to-edit price-input",value:n.me.getCurrency(e.myPrice),"product-id":t.id}).setStyle("width: 80%"))}).insert({bottom:new Element("td",{class:"price_diff"}).update(new Element("span",{class:""+n.priceDiffClass}).update(n.me.getCurrency(n.priceDiff)))}).insert({bottom:new Element("td",{class:"price_min"}).update(n.me.getCurrency(n.minPrice))})})}),n.newDiv},_displayCompetatorPrice:function(e,t){var n={};return n.me=this,n.newDiv=new Element("div"),$H(e.companyPrices).each(function(e){n.newDiv.insert({bottom:new Element("div",{class:"col-md-4 competator-price"}).insert({bottom:new Element("span",{class:"col-md-7"}).update(e.key).addClassName(t.priceMatchRule&&e.key===t.priceMatchRule.priceMatchCompany.companyName?"success":"")}).insert({bottom:new Element("span",{class:"col-md-5"}).update(e.value.priceURL&&!e.value.priceURL.blank()?new Element("a",{href:e.value.priceURL,target:"__blank"}).update(n.me.getCurrency(e.value.price)):n.me.getCurrency(e.value.price))})})}),n.newDiv},_getInfoPanel:function(e){var t={};return t.me=this,t.newDiv=new Element("div",{id:"info_panel_"+e.id}).insert({bottom:new Element("div",{class:"col-md-4"})}).insert({bottom:new Element("div",{class:"col-md-5"}).insert({bottom:new Element("div",{class:"panel panel-default price-trend-div"}).insert({bottom:new Element("div",{class:"panel-body"}).insert({bottom:new Element("iframe",{frameborder:"0",scrolling:"auto",width:"100%",height:"300px"})})})})}).insert({bottom:t.me._readOnlyMode?"":new Element("div",{class:"col-md-3"})}),t.me.postAjax(t.me.getCallbackId("checkPriceMatchEnable"),{},{onLoading:function(){},onSuccess:function(n,o){t.result=t.me.getResp(o,!1,!0),t.result&&1==t.result.enable&&($("info_panel_"+e.id).down(".col-md-4").insert(new Element("div",{class:"panel panel-default price-match-div"}).insert({bottom:new Element("div",{class:"panel-heading"}).update("<strong>Price Match</strong>")}).insert({bottom:new Element("div",{class:"panel-body price-match-listing"}).update(t.me.getLoadingImg())}).insert({bottom:new Element("div",{class:"panel-competator-price"}).update()})),$("info_panel_"+e.id).down(".col-md-3").insert(new Element("div",{class:"panel panel-default"}).insert({bottom:new Element("div",{class:"panel-heading"}).update("<strong>Price Match Rule</strong>")}).insert({bottom:new Element("div",{class:"panel-body"}).update(t.ProductRuleEl=t.me._getPriceMatchRuleEl(e))})))},onComplete:function(){}}),t.newDiv},_getPriceMatchRuleEl:function(e,t){var n={};return n.me=this,n.product=e||null,n.selected=t||null,n.newDiv=new Element("div",{class:""}).insert({bottom:new Element("div",{class:"col-xs-12"}).insert({bottom:new Element("div",{class:"form-group form-group-sm input-group"}).insert({bottom:new Element("label",{class:"contorl-label input-group-addon priceMatchRule"}).update("Target Competitor")}).insert({bottom:new Element("input",{type:"text",class:"form-control input-sm rightPanel",match_rule:"company_id"})})})}).insert({bottom:new Element("div",{class:"col-xs-12"}).insert({bottom:new Element("div",{class:"form-group form-group-sm input-group"}).insert({bottom:new Element("label",{class:"contorl-label input-group-addon priceMatchRule"}).update("Lower Safty Boundary")}).insert({bottom:new Element("input",{type:"text",class:"form-control input-sm",match_rule:"price_from",value:n.product&&n.product.priceMatchRule?n.product.priceMatchRule.price_from:""}).observe("keyup",function(e){$(this).up(".modal-body").down('[match_rule="price_to"]').value=$F($(this))}).observe("keydown",function(e){n.txtBox=this,n.me.keydown(e,function(){Event.stop(e),$(n.txtBox).up(".modal-body").down('[match_rule="offset"]').focus(),$(n.txtBox).up(".modal-body").down('[match_rule="offset"]').select()},function(){},Event.KEY_TAB)})})})}).insert({bottom:new Element("div",{class:"col-xs-12"}).insert({bottom:new Element("div",{class:"form-group form-group-sm input-group"}).insert({bottom:new Element("label",{class:"contorl-label input-group-addon priceMatchRule"}).update("Upper Safty Boundary")}).insert({bottom:new Element("input",{type:"text",class:"form-control input-sm",match_rule:"price_to",value:n.product&&n.product.priceMatchRule?n.product.priceMatchRule.price_to:""}).observe("keyup",function(e){$(this).up(".modal-body").down('[match_rule="price_from"]').value=$F($(this))})})})}).insert({bottom:new Element("div",{class:"col-xs-12"}).insert({bottom:new Element("div",{class:"form-group form-group-sm input-group"}).insert({bottom:new Element("label",{class:"contorl-label input-group-addon priceMatchRule"}).update("Extra Margin After Price Match")}).insert({bottom:new Element("input",{type:"text",class:"form-control input-sm",match_rule:"offset",value:n.product&&n.product.priceMatchRule?n.product.priceMatchRule.offset:""})})})}).insert({bottom:new Element("div",{class:"col-xs-12 text-right"}).insert({bottom:new Element("i",{class:"btn btn-sm btn-success btn-new-rule right-panel"}).update("Confirm").observe("click",function(e){n.me._priceMatchRule=n.me._collectFormData($(this).up(".modal-body"),"match_rule"),n.me._selected=null===n.product?n.selected:n.product,n.me._postIndex=0,n.me.postNewRule($(this))})}).insert({bottom:new Element("i",{class:"btn btn-sm btn-danger btn-del-rule right-panel"}).update('<i class="glyphicon glyphicon-trash"></i>').observe("click",function(e){n.me._priceMatchRule=n.me._collectFormData($(this).up(".modal-body"),"match_rule"),n.me._selected=null===n.product?n.selected:n.product,n.me._postIndex=0,n.me.postNewRule($(this),!0)})})}),n.newDiv},_showProductInfoOnRightPanel:function(e){var t={};return t.me=this,t.infoPanel=t.me._getInfoPanel(e),t.infoPanel.down(".price-trend-div iframe").writeAttribute("src","/statics/product/pricetrend.html?productid="+e.id),t.me.postAjax(t.me.getCallbackId("priceMatching"),{id:e.id},{onLoading:function(){t.infoPanel.down(".price-match-div .price-match-listing").replace(new Element("div",{class:"panel-body price-match-listing"}).update(t.me.getLoadingImg()))},onSuccess:function(n,o){try{if(t.result=t.me.getResp(o,!1,!0),!t.result)return;0!==jQuery(".popover .col-md-4").find(".panel").length&&0!==jQuery(".popover .col-md-3").find(".panel").length&&($("info_panel_"+e.id)&&$("info_panel_"+e.id).down(".price-match-div .price-match-listing").replace(t.me._displayPriceMatchResult(t.result,e)),$("info_panel_"+e.id).down(".price-match-div .panel-competator-price").replace(t.me._displayCompetatorPrice(t.result,e)),t.me._bindPriceInput())}catch(e){t.me.showModalBox("Error",e,!0)}}}),t.infoPanel},deSelectProduct:function(){var e={};return e.me=this,jQuery(".product_item.success",jQuery("#"+e.me.resultDivId)).removeClass("success").popover("hide"),jQuery("#spacetr").addClass("spacetr"),e.me._showRightPanel=!1,e.me},getResults:function(e,t,n,o){var i={};i.me=this,i.reset=e||!1,i.auto=n||!1,i.tickNew=o||!1,i.resultDiv=$(i.me.resultDivId),!0===i.reset&&(i.me._pagination.pageNo=1),!0===i.auto&&$$(".btn-show-more").length>0&&(i.me._autoLoading=!0,i.me._pagination.pageNo=1*i.me._pagination.pageNo+1),i.me._pagination.pageSize=t||i.me._pagination.pageSize,i.me.postAjax(i.me.getCallbackId("getItems"),{pagination:i.me._pagination,searchCriteria:i.me._searchCriteria},{onLoading:function(){jQuery("#"+i.me.searchDivId+" .btn").button("loading"),jQuery("#"+i.me.searchDivId+" input").prop("disabled",!0),jQuery("#"+i.me.searchDivId+" select").prop("disabled",!0),!0===i.reset&&i.resultDiv.update(new Element("tr").update(new Element("td").update(i.me.getLoadingImg()))),$(i.me.totalQtyId).update(0),$(i.me.totalValueId).update(i.me.getCurrency(0))},onSuccess:function(e,t){try{if(i.result=i.me.getResp(t,!1,!0),!i.result)return;$(i.me.totalNoOfItemsId).update(i.result.pageStats.totalRows),$(i.me.totalQtyId).update(i.result.totalStockOnHand),$(i.me.totalValueId).update(i.me.getCurrency(i.result.totalOnHandValue)),!0===i.reset&&i.resultDiv.update(i.me._getResultRow(i.me._getTitleRowData(),!0).wrap(new Element("thead"))),i.resultDiv.getElementsBySelector(".paginWrapper").each(function(e){e.remove()}),i.tbody=$(i.resultDiv).down("tbody"),i.tbody||$(i.resultDiv).insert({bottom:i.tbody=new Element("tbody")}),i.result.items.each(function(e){i.tbody.insert({bottom:i.newRow=i.me._getResultRow(e).addClassName("item_row").writeAttribute("item_id",e.id)}),i.me._tickAll&&i.newRow.down(".product-selected").click()}),!0!==i.me._singleProduct?i.result.pageStats.pageNumber<i.result.pageStats.totalPages&&i.resultDiv.insert({bottom:i.me._getNextPageBtn().addClassName("paginWrapper")}):i.result.items.size()>0&&i.me._displaySelectedProduct(i.result.items[0]),i.me._bindPriceInput(),!0===i.auto&&$$(".btn-show-more").length>0?i.me.getResults(!1,i.me._pagination.pageSize,!0):(i.me._autoLoading=!1,i.me.hideModalBox(),jQuery("#"+i.me.searchDivId+" .btn").button("reset"),jQuery("#"+i.me.searchDivId+" input").prop("disabled",!1),jQuery("#"+i.me.searchDivId+" select").prop("disabled",!1)),i.me._getSelection()}catch(e){i.resultDiv.insert({bottom:i.me.getAlertBox("Error",e).addClassName("alert-danger")})}},onComplete:function(){!0!==i.auto&&(jQuery("#"+i.me.searchDivId+" .btn").button("reset"),jQuery("#"+i.me.searchDivId+" input").prop("disabled",!1),jQuery("#"+i.me.searchDivId+" select").prop("disabled",!1))}})},_displaySelectedProduct:function(e){var t={};return t.me=this,e.id!==jQuery("#spacetr").attr("space_id")?(jQuery("#spacetr").remove(),jQuery(".product_item").removeClass("popover-loaded")):jQuery("#spacetr").toggleClass("spacetr"),t.me._showRightPanel=!0,jQuery(".product_item.success",jQuery("#"+t.me.resultDivId)).removeClass("success").popover("hide"),t.selectedRow=jQuery('[product_id="'+e.id+'"]',jQuery("#"+t.me.resultDivId)).addClass("success"),t.selectedRow.hasClass("popover-loaded")||(t.selectedRow.after('"<tr id="spacetr" space_id="'+e.id+'"><td><div id="spacediv" class="row"></div></td></tr>'),t.selectedRow.on("shown.bs.popover",function(n){0!==jQuery(".popover .col-md-4").find(".panel").length&&0!==jQuery(".popover .col-md-3").find(".panel").length&&(t.me._getPriceMatchCompanySelect2(jQuery('.rightPanel[match_rule="company_id"]'),null,e),t.container=$$(".btn-new-rule.right-panel").first().up(".panel-body"),$$(".btn-new-rule.right-panel").first().observe("click",function(n){t.me._priceMatchRule=t.me._collectFormData($(this).up(".panel-body"),"match_rule"),t.me._selected=[e],t.me._postIndex=0,t.me.postNewRule($(this))}),$$(".btn-del-rule.right-panel").first().observe("click",function(n){t.me._priceMatchRule=t.me._collectFormData($(this).up(".panel-body"),"match_rule"),t.me._selected=[e],t.me._postIndex=0,t.me.postNewRule($(this),!0)}),e.priceMatchRule&&e.priceMatchRule.id&&jQuery.isNumeric(e.priceMatchRule.id)||$$(".btn-del-rule.right-panel").first().hide(),t.container.down('[match_rule="price_from"]').observe("keyup",function(e){$(this).up(".panel-body").down('[match_rule="price_to"]').value=$F($(this))}).observe("keydown",function(e){t.txtBox=this,t.me.keydown(e,function(){Event.stop(e),$(t.txtBox).up(".panel-body").down('[match_rule="offset"]').focus(),$(t.txtBox).up(".panel-body").down('[match_rule="offset"]').select()},function(){},Event.KEY_TAB)}))}).popover({title:'<div class="row"><div class="col-xs-2"><div class="btn-group pull-right"><a class="btn btn-primary btn-sm" href="/product/'+e.id+'.html" target="_BLANK"><span class="glyphicon glyphicon-pencil"></span></a><span class="btn btn-danger btn-sm" onclick="pageJs.deSelectProduct();"><span class="glyphicon glyphicon-remove"></span></span></div></div></div>',html:!0,placement:"bottom",container:"#spacediv",trigger:"manual",viewport:{selector:".list-panel",padding:0},content:function(){return t.rightPanel=t.me._showProductInfoOnRightPanel(e).wrap(new Element("div")).innerHTML},template:'<div class="popover" role="tooltip" style="max-width: none; z-index: 1; width: 100%;left: 0px !important"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}).addClass("popover-loaded")),t.selectedRow.popover("show"),jQuery("#spacetr").height(393),jQuery(".popover-title").hide(),jQuery("html,body").animate({scrollTop:t.selectedRow.offset().top-jQuery(".panel-default").offset().top+40}),t.me},toggleSellOnWeb:function(e,t,n){var o={};return o.me=this,o.me.postAjax(o.me.getCallbackId("toggleSellOnWeb"),{productId:t.id,isSellOnWeb:e},{onSuccess:function(i,r){try{if(o.result=o.me.getResp(r,!1,!0),!o.result||!o.result.item)return;$$(".product_item[product_id="+t.id+"]").size()>0&&$$(".product_item[product_id="+t.id+"]").first().replace(o.me._getResultRow(o.result.item,!1)),o.me._bindPriceInput()}catch(t){$(n).checked=!e,o.me.showModalBox("ERROR",t,!0)}}}),o.me},toggleActive:function(e,t){var n={};return n.me=this,n.me.postAjax(n.me.getCallbackId("toggleActive"),{productId:t.id,active:e},{onSuccess:function(e,o){try{if(n.result=n.me.getResp(o,!1,!0),!n.result||!n.result.item)return;$$(".product_item[product_id="+t.id+"]").size()>0&&$$(".product_item[product_id="+t.id+"]").first().replace(n.me._getResultRow(n.result.item,!1)),n.me._bindPriceInput()}catch(e){n.me.showModalBox("ERROR",e,!0)}}}),n.me},toggleIsKit:function(e,t){var n={};return n.me=this,n.me.postAjax(n.me.getCallbackId("toggleIsKit"),{productId:t.id,isKit:e},{onSuccess:function(e,o){n.newProduct=t;try{if(n.result=n.me.getResp(o,!1,!0),!n.result||!n.result.item)return;n.newProduct=n.result.item}catch(e){n.me.showModalBox("ERROR",e,!0)}$$(".product_item[product_id="+t.id+"]").size()>0&&$$(".product_item[product_id="+t.id+"]").first().replace(n.me._getResultRow(n.newProduct,!1)),n.me._bindPriceInput()}}),n.me},toggleManualFeed:function(e,t){var n={};return n.me=this,n.me.postAjax(n.me.getCallbackId("toggleManualFeed"),{productId:t.id,isManualFeed:e},{onSuccess:function(e,o){n.newProduct=t;try{if(n.result=n.me.getResp(o,!1,!0),!n.result||!n.result.item)return;n.newProduct=n.result.item}catch(e){n.me.showModalBox("ERROR",e,!0)}$$(".product_item[product_id="+t.id+"]").size()>0&&$$(".product_item[product_id="+t.id+"]").first().replace(n.me._getResultRow(n.newProduct,!1)),n.me._bindPriceInput()}}),n.me},_updatePrice:function(e,t,n,o){var i={};return i.me=this,i.isSpecial="1"===o?1:0,i.me.postAjax(i.me.getCallbackId("updatePrice"),{productId:e,newPrice:i.me.getValueFromCurrency(t),isSpecial:i.isSpecial},{onLoading:function(){},onSuccess:function(o,r){try{if(i.result=i.me.getResp(r,!1,!0),!i.result||!i.result.item||!i.result.item.id)return;jQuery(".price-input[product-id="+i.result.item.id+"]").attr("original-price",i.me.getValueFromCurrency(t))}catch(t){i.me.showModalBox('<strong class="text-danger">Error When Update Price:</strong>',"<strong>"+t+"</strong>"),jQuery(".price-input[product-id="+e+"]").val(i.me.getCurrency(n))}}}),i.me},_updateStockLevel:function(e,t,n,o){var i={};return i.me=this,"stockMinLevel"!==o&&"stockReorderLevel"!==o&&i.me.showModalBox("Error","Invalid type passin to tmp.me._updateStockLevel"),i.me.postAjax(i.me.getCallbackId("updateStockLevel"),{productId:e,newValue:t,type:o},{onLoading:function(){},onSuccess:function(r,s){try{if(i.result=i.me.getResp(s,!1,!0),!i.result||!i.result.item||!i.result.item.id)return;jQuery("."+o+"-input[product-id="+i.result.item.id+"]").attr("original-"+o,t),i.row=$(i.me.resultDivId).down(".product_item[product_id="+i.result.item.id+"]"),i.row&&(i.row.replace(i.me._getResultRow(i.result.item,!1)),i.me._bindPriceInput())}catch(t){i.me.showModalBox('<strong class="text-danger">Error When Update '+o+":</strong>","<strong>"+t+"</strong>"),jQuery("."+o+"-input[product-id="+e+"]").val(n)}}}),i.me},_bindPriceInput:function(){var e={};return e.me=this,jQuery('.price-input[product-id]:not(".price-input-binded")').click(function(){jQuery(this).attr("original-price",e.me.getValueFromCurrency(jQuery(this).val())).select()}).keydown(function(t){e.inputBox=jQuery(this),e.me.keydown(t,function(){e.inputBox.blur()})}).focusout(function(){e.value=e.me.getValueFromCurrency(jQuery(this).val()),jQuery(this).val(e.me.getCurrency(e.value))}).change(function(){e.me._updatePrice(jQuery(this).attr("product-id"),jQuery(this).val(),e.me.getValueFromCurrency(jQuery(this).attr("original-price")),jQuery(this).attr("isSpecial"))}).addClass("price-input-binded"),jQuery(".stockMinLevel-input[product-id]").not(".stockMinLevel-input-binded").click(function(){jQuery(this).attr("original-stockMinLevel",jQuery(this).val()).select()}).keydown(function(t){e.inputBox=jQuery(this),e.me.keydown(t,function(){e.inputBox.blur()})}).focusout(function(){e.value=jQuery(this).val(),jQuery(this).val(e.value)}).change(function(){e.me._updateStockLevel(jQuery(this).attr("product-id"),jQuery(this).val(),jQuery(this).attr("original-stockMinLevel"),"stockMinLevel")}).addClass("stockMinLevel-input-binded"),jQuery(".stockReorderLevel-input[product-id]").not(".stockReorderLevel-input-binded").click(function(){jQuery(this).attr("original-stockReorderLevel",jQuery(this).val()).select()}).keydown(function(t){e.inputBox=jQuery(this),e.me.keydown(t,function(){e.inputBox.blur()})}).focusout(function(){e.value=jQuery(this).val(),jQuery(this).val(e.value)}).change(function(){e.me._updateStockLevel(jQuery(this).attr("product-id"),jQuery(this).val(),jQuery(this).attr("original-stockReorderLevel"),"stockReorderLevel")}).addClass("stockReorderLevel-input-binded"),e.me},_getNextPageBtn:function(){var e={};return e.me=this,e.totalQty=$("total-found-count").innerHTML,new Element("tfoot").insert({bottom:new Element("tr").insert({bottom:new Element("td",{colspan:e.me._nextPageColSpan,class:"text-center"}).insert({bottom:new Element("span",{class:"btn btn-primary btn-show-more","data-loading-text":"Fetching more results ..."}).update("Next Page").observe("click",function(){e.me._pagination.pageNo=1*e.me._pagination.pageNo+1,jQuery(this).button("loading"),e.me.deSelectProduct(),e.me.getResults(!1,e.me._pagination.pageSize,!1,!0)})}).insert({bottom:new Element("span",{class:"btn btn-warning btn-show-more","data-loading-text":"Fetching more results ..."}).update("<b>Show ALL Pages</b>").setStyle("margin-left: 10px; color: black;").observe("click",function(){e.totalQty>1e3?e.me.showModalBox("Warning","<h3>There are "+e.totalQty+" products for current search conditions. <br/>Please narrow down the search"):(e.me.deSelectProduct(),e.me.getResults(!1,e.me._pagination.pageSize,!0))})})})})},_getOtherStocks:function(e){var t={};return ret="",t.stockString=[],e&&e.stock&&e.stock.storeId?(currentStoreId=e.stock.storeId.id,e.stocks.each(function(e){e.storeId.id!=currentStoreId&&t.stockString.push(e.stockOnHand)}),t.stockString.join(", ")):ret},_getResultRow:function(e,t){var n={};if(n.me=this,n.tag=!0===n.isTitle?"th":"td",n.isTitle=t||!1,n.price="",n.specilaPrice="",n.srp="",e.prices&&e.prices.each(function(e){e.type&&1===parseInt(e.type.id)?(n.price=Number(e.price),n.updatedDate=e.updated):e.type&&2===parseInt(e.type.id)?n.specilaPrice=Number(e.price):e.type&&7===parseInt(e.type.id)&&(n.srp=Number(e.price))}),tiers=e.tierprices,n.tierStrings=[],tiers&&tiers.length>0?tiers.each(function(e){warning=!1,Number(e.unitCost)>0?(1==e.tierPriceType.id?tierPrice=Number(1.1*(e.unitCost*(e.value/100)+e.unitCost)).toFixed(2):tierPrice=Number(e.value).toFixed(2),n.srp&&tierPrice>n.srp&&(warning=!0),n.price&&tierPrice>n.price&&(warning=!0)):tierPrice=0,n.tierStrings.push("<div "+(warning?'style="color : red;"':"")+">"+(tierPrice>0?n.me.getCurrency(tierPrice):"N/A")+(e.quantity>0?': <abbr title="Quantity" >'+e.quantity+" </abbr>":"</div>"))}):n.tierStrings.push("N/A"),color=";",e.costtrends?0==e.costtrends.order?color="orange;":1==e.costtrends.order?color="red;":-1==e.costtrends.order&&(color="green;"):color=";",buyinPrice=n.tierStrings.join(""),n.row=new Element("tr",{class:"visible-xs visible-md visible-lg visible-sm "+(!0===n.isTitle?"":"product_item "+(parseInt(e.stockOnHand,10)<=parseInt(e.stockMinLevel,10)?"danger":parseInt(e.stockOnHand,10)<=parseInt(e.stockReorderLevel,10)?"warning":"")),product_id:e.id}).store("data",e).insert({bottom:new Element(n.tag,{class:"sku",title:e.name}).addClassName("col-xs-1").observe("click",function(e){if(n.me._signRandID($(this)),"INPUT"!=e.target.nodeName){if(jQuery("#"+$(this).id).find(":checkbox").prop("disabled"))return;jQuery("#"+$(this).id).find(":checkbox").prop("checked",!jQuery("#"+$(this).id).find(":checkbox").prop("checked")),!0===n.isTitle&&(n.checked=jQuery("#"+$(this).id).find(":checkbox").prop("checked"),n.me._tickAll=n.checked,$(n.me.resultDivId).getElementsBySelector(".product_item .product-selected").each(function(e){e.checked=n.checked}))}n.me._getSelection()}).insert({bottom:new Element("span").setStyle("margin: 0 5px 0 0").insert({bottom:n.skucbx=new Element("input",{type:"checkbox",class:"product-selected"}).observe("click",function(e){n.checked=this.checked,!0===n.isTitle&&(n.me._tickAll=n.checked,$(n.me.resultDivId).getElementsBySelector(".product_item .product-selected").each(function(e){e.checked=n.checked})),n.me._getSelection()})})}).insert({bottom:!0===n.isTitle?e.sku:new Element("a",{href:"javascript: void(0);",class:"sku-link truncate"}).observe("click",function(t){Event.stop(t),n.selectedRow=jQuery('[product_id="'+e.id+'"]',jQuery("#"+n.me.resultDivId)),n.selectedRow.hasClass("success")?n.me.deSelectProduct():n.me._displaySelectedProduct(e)}).update(e.sku).setStyle(!1===e.sellOnWeb?"color: red;":"color: blue;")})}).insert({bottom:new Element(n.tag,{class:"product_name hidden-xs hide-when-info hidden-sm"}).addClassName("col-xs-2").setStyle(n.me._showRightPanel?"display: none":"").update(!0===n.isTitle?new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-sm-1"}).update("")}).insert({bottom:new Element("div",{class:"col-sm-9"}).update("Product Name")}).insert({bottom:1!=n.me._storeId?"":new Element("div",{class:"col-sm-2"}).update("IsKit?")}):new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-sm-1"}).setStyle("padding: 0px;").insert({bottom:!0===n.isTitle?"":new Element("div",{class:"col-sm-1"}).insert({bottom:new Element("a",{class:"btn btn-primary btn-xs",href:"/product/"+e.id+".html",target:"_BLANK"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-pencil"})})})})}).insert({bottom:new Element("div",{class:"col-sm-9"}).update(""===n.srp?e.name:'<abbr title="SRP: '+n.me.getCurrency(n.srp)+'">'+e.name+"</abbr>")}).setStyle(""===n.srp?";":"color: green;").insert({bottom:1!=n.me._storeId?"":new Element("div",{class:"col-sm-2"}).update(n.kitcbx=new Element("input",{type:"checkbox",checked:e.isKit}).observe("click",function(t){n.btn=this,n.checked=$(n.btn).checked,confirm(!0===n.checked?"You are about to set this product to a KIT, which you can NOT PICK or SHIP without providing a KIT barcode.\n Continue?":"You are about to set this product to NOT a KIT, which you can PICK or SHIP without providing a KIT barcode\n Continue?")?n.me.toggleIsKit(n.checked,e):$(n.btn).checked=!n.checked}))}))}).insert({bottom:new Element(n.tag,{class:"hidden-xs hide-when-info hidden-sm row"}).addClassName("col-xs-2").setStyle(n.me._showRightPanel?"display: none":"").insert({bottom:new Element("div",{class:"col-sm-6"}).update(!0===n.isTitle?"Price "+n.me._gstText:n.txtprice=new Element("input",{class:"click-to-edit price-input",value:n.me.getCurrency(n.price),"product-id":e.id}).setStyle("width: 80%"))}).insert({bottom:new Element("div",{class:"col-sm-6"}).update(!0===n.isTitle?"Special Price "+n.me._gstText:n.txtsp=new Element("input",{class:"click-to-edit price-input",value:n.me.getCurrency(n.specilaPrice),"product-id":e.id,isSpecial:"1"}).setStyle("width: 80%"))})}),1==n.me_priceMatchSetting&&(n.row=n.row.insert({bottom:n.match=new Element(n.tag,{class:"match"+e.id+" hide-when-info hidden-sm",style:"width:5%"}).addClassName("col-xs-1").update().insert({bottom:new Element("div",{class:"col-sm-12"}).update(!0===n.isTitle?"Match":new Element("span").update(e.priceMatchRule&&e.priceMatchRule.priceMatchCompany?'<abbr title="Updated: '+n.updatedDate+'">'+e.priceMatchRule.priceMatchCompany.companyName+"</abbr>":"").setStyle("width: 100%"))})})),n.row=n.row.insert({bottom:new Element(n.tag,{class:"locations hide-when-info hidden-sm",style:"width:8%"}).addClassName("col-xs-1").update(e.locations?n.me._getLocations(e.locations,t):"")}).insert({bottom:1!=n.me._storeId?"":new Element(n.tag,{class:"sellonweb hide-when-info hidden-sm ",style:"width:1%"}).addClassName("col-xs-1").insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-sm-3 text-right"}).insert({bottom:!0===n.isTitle?"SOW?":n.sowcbx=new Element("input",{type:"checkbox",checked:e.sellOnWeb}).observe("click",function(t){n.btn=this,n.checked=$(n.btn).checked,confirm(!0===n.checked?"You are about to sell this product on web again.\n Continue?":"You are NOT about to sell this product on web.\n Continue?")?n.me.toggleSellOnWeb(n.checked,e,n.btn):$(n.btn).checked=!n.checked})})})})}).insert({bottom:new Element(n.tag,{class:"manufacturer hide-when-info",style:"width:5%"}).addClassName("col-xs-1").update(e.manufacturer?e.manufacturer.name:"")}).insert({bottom:new Element(n.tag,{class:"supplier hide-when-info hidden-sm",style:"width:5%"}).addClassName("col-xs-1").update(e.supplierCodes?n.me._getSupplierCodes(e.supplierCodes,t):"")}).insert({bottom:new Element(n.tag,{class:"qty hidden-sm"}).addClassName("col-xs-1").update(!0===n.isTitle?new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-xs-4",title:"Stock on Hand"}).update("SH")}).insert({bottom:new Element("div",{class:"col-xs-4 hide-when-info",title:"Stock On PO"}).update("SP")}).insert({bottom:new Element("div",{class:"col-xs-4",title:"Average Cost"}).update("Cost")}):new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-xs-4",title:"Stock on Hand"}).update(new Element("a",{href:"/productqtylog.html?productid="+e.id,target:"_BLANK"}).update(e.stockOnHand))}).insert({bottom:new Element("div",{class:"col-xs-4 hide-when-info",title:"Stock On PO"}).update(new Element("a",{href:"/productqtylog.html?productid="+e.id,target:"_BLANK"}).update(e.stockOnPO))}).insert({bottom:new Element("div",{class:"col-xs-4",title:"Average Cost"}).update(n.avgCostEl=new Element("a",{href:"javascript:void(0);",style:"color: "+color}).update(0!=e.totalOnHandValue&&0!=e.stockOnHand?n.me.getCurrency(e.totalOnHandValue/e.stockOnHand):"N/A"))}))}).insert({bottom:1==n.me._storeId?"":new Element(n.tag,{class:"buyinprice hide-when-info"}).addClassName("col-xs-1").update(!0===n.isTitle?new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-xs-6  text-right",title:"Stock of Mount Waverley"}).update("SSH")}).insert({bottom:new Element("div",{class:"col-xs-6  text-right",title:"Buyin price from Mount Waverley"}).update("Buyin")}):new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-xs-6  text-right",title:"Stock of Mount Waverley"}).update(n.me._getOtherStocks(e))}).insert({bottom:new Element("div",{class:"col-xs-6  text-right",title:"Buyin price from Mount Waverley"}).update(buyinPrice)}))}).insert({bottom:new Element(n.tag,{class:"product_active hide-when-info hidden-sm ",style:"width:4%"}).addClassName("col-xs-1").insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-xs-2 text-right"}).insert({bottom:!0===n.isTitle?"Act?":n.actcbx=new Element("input",{type:"checkbox",checked:e.active}).observe("click",function(t){n.btn=this,n.checked=$(n.btn).checked,confirm(!0===n.checked?"You are about to ReACTIVATE this product.\n Continue?":"You are about to deactivate this product.\n Continue?")&&n.me.toggleActive(n.checked,e)})})}).insert({bottom:new Element("div",{class:"col-xs-2"}).setStyle("padding: 0px;").insert({bottom:!0===n.isTitle?"":new Element("a",{href:"/serialnumbers.html?productid="+e.id,target:"_BLANK",title:"Serial Numbers."}).update("SN")})})})}),n.avgCostEl&&n.me.observeClickNDbClick(n.avgCostEl,function(){n.me.showHistoryBuyin(e)},function(){n.me.showHistoryBuyin(e)}),!n.isTitle&&e.priceMatchRule&&n.updatedDate){var o=n.updatedDate,i=new Date(o.substr(0,4),o.substr(5,2)-1,o.substr(8,2),o.substr(11,2),o.substr(14,2),o.substr(17,2));i.setHours(i.getHours()+10);var r=((new Date).getTime()-i.getTime())/864e5;r<1?jQuery(n.match).css({"background-color":"green"}):r<2?jQuery(n.match).css({"background-color":"yellow"}):jQuery(n.match).css({"background-color":"orange"})}return n.me._readOnlyMode&&(jQuery(n.skucbx).prop("disabled",!0),jQuery(n.kitcbx).prop("disabled",!0),jQuery(n.txtprice).prop("disabled",!0),jQuery(n.txtsp).prop("disabled",!0),jQuery(n.mancbx).prop("disabled",!0),jQuery(n.sowcbx).prop("disabled",!0),jQuery(n.actcbx).prop("disabled",!0)),n.row},showHistoryBuyin:function(e){var t={};return t.me=this,e.costtrends&&e.costtrends.trends&&0!=e.costtrends.trends.length?(t.newDiv=new Element("table",{class:"table table-striped table-hover buyin-price-listing"}).insert({bottom:new Element("thead").insert({bottom:new Element("tr").insert({bottom:new Element("th").update("PurchaseOrderNo")}).insert({bottom:new Element("th").update("Buyin Price")}).insert({bottom:new Element("th").update("Purchase Date")})})}).insert({bottom:t.body=new Element("tbody")}),e.costtrends.trends.each(function(e){t.newRow=new Element("tr").insert({bottom:new Element("td").update(e.purchaseOrderNo)}).insert({bottom:new Element("td").update(t.me.getCurrency(e.unitPrice))}).insert({bottom:new Element("td").update(e.updated)}),t.body.insert({bottom:t.newRow})}),t.me.showModalBox("Hisotry buyin cost for "+e.sku,t.newDiv)):t.me.showModalBox("Hisotry buyin cost for "+e.sku,"No purchase history!"),t.newDiv},readOnlyMode:function(e,t,n){var o={};o.me=this,o.me._readOnlyMode=!e,o.me._storeId=t,o.me._roleId=n,(o.me._readOnlyMode||1!=o.me._storeId)&&(jQuery("#newProductBtn").hide(),jQuery("#newPriceMatchRuleBtn").hide())},_getCostTrend:function(e){var t={};return t.me=this,t.productId=e||null,(t={}).me=this,t.me.postAjax(t.me.getCallbackId("getCostTrend"),{productId:e},{onLoading:function(){},onSuccess:function(n,o){try{if(t.result=t.me.getResp(o,!1,!0),!t.result||!t.result.item||!t.result.item.id)return;jQuery("."+type+"-input[product-id="+t.result.item.id+"]").attr("original-"+type,newValue),t.row=$(t.me.resultDivId).down(".product_item[product_id="+t.result.item.id+"]"),t.row&&(t.row.replace(t.me._getResultRow(t.result.item,!1)),t.me._bindPriceInput())}catch(n){t.me.showModalBox('<strong class="text-danger">Error When Update '+type+":</strong>","<strong>"+n+"</strong>"),jQuery("."+type+"-input[product-id="+e+"]").val(originalValue)}}}),t.me}});