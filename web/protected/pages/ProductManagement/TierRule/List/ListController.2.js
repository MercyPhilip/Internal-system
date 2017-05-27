var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{manufactures:[],productCategories:[],_tierLevels:[],_tierPriceTypes:[],_nextPageColSpan:9,_autoLoading:!1,_getTitleRowData:function(){return{sku:"SKU",manufacturer:{name:"Brand"},category:{name:"Category"},tier:"Tier Price"}},setPreData:function(a,d){this._tierLevels=a;this._tierPriceTypes=d;return this},_loadManufactures:function(a){this.manufactures=a;var d;d=$(this.searchDivId).down('[search_field="pro.manufacturerIds"]');this.manufactures.each(function(a){d.insert({bottom:(new Element("option",
{value:a.id})).update(a.name)})});return this},_loadCategories:function(a){this.categories=a;var d;d=$(this.searchDivId).down('[search_field="pro.productCategoryIds"]');this.categories.sort(function(a,e){return a.namePath>e.namePath}).each(function(a){d.insert({bottom:(new Element("option",{value:a.id})).update(a.namePath)})});return this},_loadChosen:function(){jQuery(".chosen").select2({minimumResultsForSearch:Infinity});return this},_bindSearchKey:function(){var a;a=this;$$("#searchBtn").first().observe("click",
function(d){a.getSearchCriteria().getResults(!0,a._pagination.pageSize)});$("searchDiv").getElementsBySelector("[search_field]").each(function(d){d.observe("keydown",function(b){a.keydown(b,function(){$(a.searchDivId).down("#searchBtn").click()})})});return this},getResults:function(a,d,b,e){var c,f,h,g,k,l;c=this;f=a||!1;h=b||!1;g=$(c.resultDivId);!0===f&&(c._pagination.pageNo=1);!0===h&&0<$$(".btn-show-more").length&&(c._autoLoading=!0,c._pagination.pageNo=1*c._pagination.pageNo+1);c._pagination.pageSize=
d||c._pagination.pageSize;c.postAjax(c.getCallbackId("getItems"),{pagination:c._pagination,searchCriteria:c._searchCriteria},{onLoading:function(){jQuery("#"+c.searchDivId+" .btn").button("loading");jQuery("#"+c.searchDivId+" input").prop("disabled",!0);jQuery("#"+c.searchDivId+" select").prop("disabled",!0);!0===f&&g.update((new Element("tr")).update((new Element("td")).update(c.getLoadingImg())))},onSuccess:function(a,b){try{if(k=c.getResp(b,!1,!0))$(c.totalNoOfItemsId).update(k.pageStats.totalRows),
!0===f&&g.update(c._getResultRow(c._getTitleRowData(),!0).wrap(new Element("thead"))),g.getElementsBySelector(".paginWrapper").each(function(a){a.remove()}),(l=$(g).down("tbody"))||$(g).insert({bottom:l=new Element("tbody")}),k.items.each(function(a){l.insert({bottom:c._getResultRow(a).addClassName("item_row").writeAttribute("item_id",a.id)})}),!0!==c._singleProduct&&k.pageStats.pageNumber<k.pageStats.totalPages&&g.insert({bottom:c._getNextPageBtn().addClassName("paginWrapper")}),!0===h&&0<$$(".btn-show-more").length?
c.getResults(!1,c._pagination.pageSize,!0):(c._autoLoading=!1,c.hideModalBox(),jQuery("#"+c.searchDivId+" .btn").button("reset"),jQuery("#"+c.searchDivId+" input").prop("disabled",!1),jQuery("#"+c.searchDivId+" select").prop("disabled",!1))}catch(p){g.insert({bottom:c.getAlertBox("Error",p).addClassName("alert-danger")})}},onComplete:function(){!0!==h&&(jQuery("#"+c.searchDivId+" .btn").button("reset"),jQuery("#"+c.searchDivId+" input").prop("disabled",!1),jQuery("#"+c.searchDivId+" select").prop("disabled",
!1))}})},_getNextPageBtn:function(){var a,d;a=this;d=$("total-found-count").innerHTML;return(new Element("tfoot")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("td",{colspan:a._nextPageColSpan,"class":"text-center"})).insert({bottom:(new Element("span",{"class":"btn btn-primary btn-show-more","data-loading-text":"Fetching more results ..."})).update("Next Page").observe("click",function(){a._pagination.pageNo=1*a._pagination.pageNo+1;jQuery(this).button("loading");a.getResults(!1,
a._pagination.pageSize,!1,!0)})}).insert({bottom:(new Element("span",{"class":"btn btn-warning btn-show-more","data-loading-text":"Fetching more results ..."})).update("<b>Show ALL Pages</b>").setStyle("margin-left: 10px; color: black;").observe("click",function(){1E3<d?a.showModalBox("Warning","<h3>There are "+d+" products for current search conditions. <br/>Please narrow down the search"):a.getResults(!1,a._pagination.pageSize,!0)})})})})},_getTierPrices:function(a){var d;if(!a)return"";d=[];a.each(function(a){d.push('<div><small><strong class="hidden-xs hide-when-info hidden-sm">'+
a.tierLevel.name+': </strong><abbr title="Type: '+a.tierPriceType.name+'">'+Number(a.value).toFixed(2)+': </abbr><abbr title="Quantity" >'+(0<a.quantity?a.quantity:"")+" </abbr></small></div>")});return d.join("")},_getResultRow:function(a,d){var b={me:this};b.tag=!0===b.isTitle?"th":"td";b.isTitle=d||!1;b.row=(new Element("tr",{"class":!0===b.isTitle?"":"btn-hide-row",tierrule_id:a.id})).store("data",a).insert({bottom:(new Element(b.tag,{"class":"sku",title:a.product?a.product.name:""})).addClassName("col-xs-2").insert({bottom:!0===
b.isTitle?a.sku:(new Element("a",{href:a.product?"/product/"+a.product.id+".html":"",target:"_BLANK","class":"sku-link truncate"})).update(a.product?a.product.sku:"")})}).insert({bottom:(new Element(b.tag,{"class":"manufacturer hidden-xs hide-when-info hidden-sm",style:"width:5%"})).addClassName("col-xs-1").update(a.manufacturer?a.manufacturer.name:"")}).insert({bottom:(new Element(b.tag,{"class":"category"})).addClassName("col-xs-2").update(!0===b.isTitle?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",
{"class":"col-xs-12"})).update("Category")}):(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-12"})).update(a.category?a.category.name:"")}))}).insert({bottom:(new Element(b.tag,{"class":"stock"})).addClassName("col-xs-6").update(!0===b.isTitle?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-12"})).update("Tier Price")}):(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-12"})).update(b.me._getTierPrices(a.tierprices))}))}).insert({bottom:(new Element(b.tag,
{"class":"text-right col-xs-1 "})).update(!0===b.isTitle?(new Element("span",{"class":"btn btn-primary btn-xs",title:"New"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-plus"})}).insert({bottom:" NEW"}).observe("click",function(){$(this).up("thead").insert({bottom:b.newEditEl=b.me._getEditPanel({})});b.newEditEl.down(".form-control[save-item-panel]").focus();b.newEditEl.down(".form-control[save-item-panel]").select();b.newEditEl.getElementsBySelector(".form-control[save-item-panel]").each(function(a){a.observe("keydown",
function(a){b.me.keydown(a,function(){b.newEditEl.down(".btn-success span").click()});return!1})});b.me._loadSelectOptions(null,b.newEditEl)}):(new Element("span",{"class":"btn-group btn-group-xs"})).insert({bottom:(new Element("span",{"class":"btn btn-default",title:"Edit"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-pencil"})}).observe("click",function(){$(this).up(".item_row").replace(b.editEl=b.me._getEditPanel(a));b.editEl.getElementsBySelector(".form-control[save-item-panel]").each(function(a){a.observe("keydown",
function(a){b.me.keydown(a,function(){b.editEl.down(".btn-success span").click()});return!1})});b.me._loadSelectOptions(a,b.editEl)})}).insert({bottom:(new Element("span",{"class":"btn btn-danger",title:"Delete"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){if(!confirm("Are you sure you want to delete this item?"))return!1;b.me._deleteItem(a)})}))});return b.row},_getEditPanel:function(a){var d,b,e;d=this;return(new Element("tr",{"class":"save-item-panel info"})).store("data",
a).insert({bottom:(new Element("td",{"class":"form-group col-xs-2 "})).insert({bottom:(new Element("span",{"class":" productId"})).insert({bottom:new Element("input",{disabled:a.id?!0:!1,"class":"chosen form-control input-sm ",placeholder:"The SKU","save-item-panel":"productId",value:a.product&&a.product.sku?a.product.sku:""})})}).insert({bottom:new Element("input",{"class":"",type:"hidden","save-item-panel":"id",value:a.id?a.id:""})})}).insert({bottom:(new Element("td",{"class":"form-group col-xs-1 hidden-xs hide-when-info hidden-sm "})).insert({bottom:(new Element("span",
{"class":"brand"})).insert({bottom:new Element("input",{disabled:a.id?!0:!1,"class":"chosen form-control input-sm",entityName:"Manufacturer",placeholder:"The Brand","save-item-panel":"brand",rowid:a.id?a.id:"",value:a.manufacturer?a.manufacturer.name:""})})})}).insert({bottom:(new Element("td",{"class":"form-group col-xs-2"})).insert({bottom:(new Element("span",{"class":"category"})).insert({bottom:new Element("input",{disabled:a.id?!0:!1,"class":"chosen form-control input-sm",entityName:"ProductCategory",
placeholder:"The Category","save-item-panel":"category",rowid:a.id?a.id:"",value:a.category?a.category.name:""})})})}).insert({bottom:(new Element("td",{"class":"form-group col-xs-6"})).insert({bottom:(new Element("span",{"class":"tierrule"})).insert({bottom:d._getListPanel("TierPrice:",a.tierprices,{tier:"TierLevel",quantity:"Quantity",type:"TierPriceType",value:"value"},d._tierPriceTypes,d._tierLevels).wrap(new Element("div",{"class":"tierprices-panel"}))})})}).insert({bottom:(new Element("td",
{"class":"form-group text-right col-xs-1"})).insert({bottom:(new Element("span",{"class":"btn-group btn-group-sm"})).insert({bottom:(new Element("span",{"class":"btn btn-success",title:"Save"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok"})}).observe("click",function(){b=this;(e=d._saveItem(b,$(b).up(".save-item-panel"),"save-item-panel"))&&jQuery(".tooltip")&&jQuery(".tooltip").remove()})}).insert({bottom:(new Element("span",{"class":"btn btn-danger",title:"Delete"})).insert({bottom:new Element("span",
{"class":"glyphicon glyphicon-remove"})}).observe("click",function(){a.id?$(this).up(".save-item-panel").replace(d._getResultRow(a).addClassName("item_row").writeAttribute("item_id",a.id)):$(this).up(".save-item-panel").remove();jQuery(".tooltip")&&jQuery(".tooltip").remove()})})})})},_getSelBox:function(a,d){var b;b=new Element("select");a.each(function(a){b.insert({bottom:(new Element("option",{value:a.id,selected:d&&a.id===d?!0:!1})).update(a.name)})});return b},_getListPanelRow:function(a,d,b,
e,c,f){var h,g,k,l,m,n;c=c||!1;h=!0===c?"th":"td";g=e.tier.charAt(0).toLowerCase()+e.tier.slice(1);k=e.quantity.toLowerCase();l=e.type.charAt(0).toLowerCase()+e.type.slice(1);m=e.value.toLowerCase();n="NEW_"+String.fromCharCode(65+Math.floor(26*Math.random()))+Date.now();k=(new Element("div",{"class":"input-group input-group-sm"})).insert({bottom:(new Element("input",{type:"number","class":"form-control","list-panel-row":"quantity",value:0<Number(a[k])?a[k]:""})).writeAttribute("list-item",a.id?a.id:
n)}).observe("click",function(a){$(this).down("input").select()});d=(new Element("tr")).insert({bottom:(new Element(h)).update(!0===c?e.tier:this._getSelBox(b,a[g]&&a[g].id?a[g].id:"").addClassName("form-control input-sm ").writeAttribute("list-panel-row","tierId").writeAttribute("required",!0).writeAttribute("list-item",a.id?a.id:n).observe("change",function(a){"function"===typeof f&&f(a)}).wrap(new Element("div",{"class":"form-group"})))}).insert({bottom:(new Element(h)).update(!0===c?e.quantity:
k.wrap(new Element("div",{"class":"form-group"})))}).insert({bottom:(new Element(h)).update(!0===c?e.type:this._getSelBox(d,a[l]&&a[l].id?a[l].id:"").addClassName("form-control input-sm ").writeAttribute("list-panel-row","typeId").writeAttribute("required",!0).writeAttribute("list-item",a.id?a.id:n).observe("change",function(a){"function"===typeof f&&f(a)}).wrap(new Element("div",{"class":"form-group"})))});a.id&&d.insert({bottom:(new Element("input",{type:"hidden","class":"form-control","list-panel-row":"id",
value:a.id})).writeAttribute("list-item",a.id?a.id:n)});k=(new Element("div",{"class":"input-group input-group-sm"})).insert({bottom:(new Element("input",{type:"text","class":"form-control","list-panel-row":"value",required:!0,value:a[m]?Number(a[m]).toFixed(2):""})).writeAttribute("list-item",a.id?a.id:n)}).insert({bottom:(new Element("input",{type:"hidden","class":"form-control","list-panel-row":"active",value:"1"})).writeAttribute("list-item",a.id?a.id:n)}).insert({bottom:(new Element("span",{"class":"btn btn-danger input-group-addon"})).insert({bottom:new Element("span",
{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){a.id?($(this).up(".input-group").down("[list-panel-row=active]").value="0",$(this).up(".input-group").down("[list-panel-row=value]").writeAttribute("required",!1),$(this).up(".list-panel-row").hide()):$(this).up(".list-panel-row").remove()})});d.insert({bottom:(new Element(h)).update(!0===c?e.value:k.wrap(new Element("div",{"class":"form-group"})))});return d},_getListPanel:function(a,d,b,e,c,f){var h,g,k,l;h=this;a=(new Element("div",
{"class":"panel panel-default"})).insert({bottom:(new Element("span",{"class":"btn btn-primary btn-xs pull-right",title:"New"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-plus"})}).insert({bottom:" NEW"}).observe("click",function(){g=$(this).up(".panel");k={};g.down(".table tbody").insert({bottom:h._getListPanelRow(k,e,c,b,!1,f).addClassName("list-panel-row").writeAttribute("item_id","")});g.down(".list-div").show()})}).insert({bottom:(new Element("div",{"class":"list-div table-responsive"})).insert({bottom:(new Element("table",
{"class":"table table-condensed",style:"width : auto"})).insert({bottom:(new Element("thead")).update(h._getListPanelRow(b,e,c,b,!0,f))}).insert({bottom:l=new Element("tbody")})})});d&&d.each(function(a){l.insert({bottom:h._getListPanelRow(a,e,c,b,!1,f).addClassName("list-panel-row").writeAttribute("item_id",a.id)})});return a},_saveItem:function(a,d,b){var e,c,f,h,g;e=this;c=e._collectFormData(d,b);if(null!==c&&(c.tierprices=e._collectFormData(d.down(".tierprices-panel"),"list-panel-row","list-item"),
null!==c.tierprices))return e.postAjax(e.getCallbackId("saveItem"),{item:c},{onLoading:function(){c.id&&d.addClassName("item_row").writeAttribute("item_id",c.id);d.hide()},onSuccess:function(a,b){try{(f=e.getResp(b,!1,!0))&&f.item&&(h=$(e.resultDivId).down("tbody").down(".item_row[item_id="+f.item.id+"]"),g=e._getResultRow(f.item).addClassName("item_row").writeAttribute("item_id",f.item.id),h?h.replace(g):(d.remove(),$(e.resultDivId).down("tbody").insert({top:g}),$(e.totalNoOfItemsId).update(1*$(e.totalNoOfItemsId).innerHTML+
1)))}catch(m){e.showModalBox('<span class="text-danger">ERROR:</span>',m,!0),d.show()}}}),e},_applystockonhand:function(a,d,b){var e,c,f,h,g;e=this;c=e._collectFormData(d,b);if(null!==c&&(c.tierprices=e._collectFormData(d.down(".tierprices-panel"),"list-panel-row","list-item"),null!==c.tierprices))return e.postAjax(e.getCallbackId("applyStockOnHandBtn"),{item:c},{onLoading:function(){c.id&&d.addClassName("item_row").writeAttribute("item_id",c.id);d.hide()},onSuccess:function(a,b){try{(f=e.getResp(b,
!1,!0))&&f.item&&(h=$(e.resultDivId).down("tbody").down(".item_row[item_id="+f.item.id+"]"),g=e._getResultRow(f.item).addClassName("item_row").writeAttribute("item_id",f.item.id),h?h.replace(g):($(e.resultDivId).down("tbody").insert({top:g}),d.remove(),$(e.totalNoOfItemsId).update(1*$(e.totalNoOfItemsId).innerHTML+1)))}catch(m){e.showModalBox('<span class="text-danger">ERROR:</span>',m,!0),d.show()}}}),e},_loadSelectOptions:function(a,d){var b,e,c,f=d.down('.chosen[save-item-panel="category"]'),h=
d.down('.chosen[save-item-panel="productId"]'),g=d.down('.chosen[save-item-panel="brand"]');this._signRandID(f);this._signRandID(h);this._signRandID(g);jQuery("#"+f.id).select2({multiple:!1,allowClear:!0,ajax:{url:"/ajax/getAll",dataType:"json",delay:10,type:"POST",data:function(a,b){return{searchTxt:"name like ?",searchParams:["%"+a+"%"],entityName:"ProductCategory",pageNo:b}},results:function(a,c,d){b=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){b.push({id:a.id,text:a.name,
data:a})});return{results:b,more:a.resultData&&a.resultData.pagination&&a.resultData.pagination.totalPages&&c<a.resultData.pagination.totalPages}},cache:!0},formatResult:function(a){return a?'<div class="row"><div class="col-xs-12">'+a.data.namePath+"</div></div>":""},formatSelection:function(a){if(!a)return"";e=a.text;return c=(new Element("div")).update(e)},escapeMarkup:function(a){return a}});jQuery("#"+h.id).select2({multiple:!1,allowClear:!0,ajax:{url:"/ajax/getAll",dataType:"json",delay:10,
type:"POST",data:function(a,b){return{searchTxt:"sku like ? and active = 1",searchParams:["%"+a+"%"],entityName:"Product",pageNo:b,userId:jQuery("#userId").attr("value")}},results:function(a,c,d){b=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){b.push({id:a.id,text:a.sku,data:a})});return{results:b,more:a.resultData&&a.resultData.pagination&&a.resultData.pagination.totalPages&&c<a.resultData.pagination.totalPages}},cache:!0},formatResult:function(a){return a?'<div class="row"><div class="col-xs-12">'+
a.data.sku+"</div></div>":""},formatSelection:function(a){if(!a)return"";e=a.text;return c=(new Element("div")).update(e)},escapeMarkup:function(a){return a}});jQuery("#"+g.id).select2({multiple:!1,allowClear:!0,ajax:{url:"/ajax/getAll",dataType:"json",delay:10,type:"POST",data:function(a,b){return{searchTxt:"name like ?",searchParams:["%"+a+"%"],entityName:"Manufacturer",pageNo:b}},results:function(a,c,d){b=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){b.push({id:a.id,
text:a.name,data:a})});return{results:b,more:a.resultData&&a.resultData.pagination&&a.resultData.pagination.totalPages&&c<a.resultData.pagination.totalPages}},cache:!0},formatResult:function(a){return a?'<div class="row"><div class="col-xs-12">'+a.data.name+"</div></div>":""},formatSelection:function(a){if(!a)return"";e=a.text;return c=(new Element("div")).update(e)},escapeMarkup:function(a){return a}});a&&(a.category&&jQuery("#"+f.id).select2("data",{id:a.category.id,text:a.category.name}),a.product&&
jQuery("#"+h.id).select2("data",{id:a.product.id,text:a.product.sku}),a.manufacturer&&jQuery("#"+g.id).select2("data",{id:a.manufacturer.id,text:a.manufacturer.name}));return this}});