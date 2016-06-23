var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{_getTitleRowData:function(){return{id:"ID",sku:"Sku",name:"Name",category:"Category",price:"Price",stock:"Stock Level",status:"Processing Status"}},_loadNewProductStatuses:function(a){this.productStatuses=a;var c;c=$(this.searchDivId).down('[search_field="pro.productStatusIds"]');this.productStatuses.each(function(a){c.insert({bottom:(new Element("option",{value:a.id})).update(a.name)})});return this},_loadCategories:function(a){this.categories=a;var c;
c=$(this.searchDivId).down('[search_field="pro.productCategoryIds"]');this.categories.sort(function(a,c){return a.namePath>c.namePath}).each(function(a){c.insert({bottom:(new Element("option",{value:a.id})).update(a.namePath)})});return this},_loadChosen:function(){jQuery(".select2").select2({minimumResultsForSearch:Infinity});return this},_bindSearchKey:function(){var a;a=this;$$("#searchBtn").first().observe("click",function(c){a.getSearchCriteria().getResults(!0,a._pagination.pageSize)});$("searchPanel").getElementsBySelector("[search_field]").each(function(c){c.observe("keydown",
function(b){a.keydown(b,function(){$(a.searchDivId).down("#searchBtn").click()})})});return this},_getEditPanel:function(a){var c,b,e,d,h;c=this;a.product&&a.product.categories&&a.product.categories.each(function(a){});b="";a.product&&a.product.prices&&a.product.prices.each(function(a){a.type&&1===parseInt(a.type.id)&&(b=a.price)});return e=(new Element("tr",{"class":"save-item-panel info"})).store("data",a).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:new Element("input",
{disabled:!0,"class":"form-control","save-item-panel":"id",value:a.id?a.id:""})})}).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:(new Element("div",{"class":"col-sm-12"})).insert({bottom:new Element("input",{required:!0,disabled:a.id?!0:!1,"class":"form-control input-sm ",placeholder:"The SKU","save-item-panel":"sku",value:a.product&&a.product.sku?a.product.sku:""})})})}).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:(new Element("div",{"class":"col-sm-12"})).insert({bottom:new Element("input",
{"class":"form-control input-sm ",placeholder:"The Name","save-item-panel":"name",value:a.product&&a.product.name?a.product.name:""})})})}).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:new Element("input",{"class":"chosen form-control input-sm",entityName:"ProductCategory",placeholder:"The Category","save-item-panel":"category",rowid:a.id?a.id:"",value:a.product&&a.product.categories?a.product.categories:""})})}).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:new Element("input",
{"class":"form-control",placeholder:"The Price",validate_currency:!0,"save-item-panel":"price",value:b?c._getCurrency(b):""})}).observe("change",function(){c._currencyInputChanged(e.down("[save-item-panel=price]"))})}).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:new Element("input",{"class":"chosen form-control input-sm",entityName:"ProductStatus",placeholder:"The Stock Level","save-item-panel":"stock",value:a.product&&a.product.status?a.product.status.name:""})})}).insert({bottom:(new Element("td",
{"class":"form-group"})).insert({bottom:new Element("input",{disabled:a.id?!1:!0,"class":"chosen form-control input-sm",entityName:"NewProductStatus",placeholder:"The Status","save-item-panel":"status",value:a.status&&a.status.name?a.status.name:""})})}).insert({bottom:(new Element("td",{"class":"text-right"})).insert({bottom:(new Element("span",{"class":"btn-group btn-group-sm"})).insert({bottom:(new Element("span",{"class":"btn btn-success",title:"Save"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok"})}).observe("click",
function(){d=this;(h=c._saveItem(d,$(d).up(".save-item-panel"),"save-item-panel"))&&jQuery(".tooltip")&&jQuery(".tooltip").remove()})}).insert({bottom:(new Element("span",{"class":"btn btn-danger",title:"Delete"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-remove"})}).observe("click",function(){a.id?$(this).up(".save-item-panel").replace(c._getResultRow(a).addClassName("item_row").writeAttribute("item_id",a.id)):$(this).up(".save-item-panel").remove();jQuery(".tooltip")&&jQuery(".tooltip").remove()})})})})},
_getResultRow:function(a,c){var b={me:this};b.tag=!0===b.isTitle?"th":"td";b.isTitle=c||!1;b.categories="";a.product&&a.product.categories&&a.product.categories.each(function(a){b.categories=""==b.categories?a.name:b.categories+","+a.name});b.price="";a.product&&a.product.prices&&a.product.prices.each(function(a){a.type&&1===parseInt(a.type.id)&&(b.price=a.price)});b.row=(new Element("tr",{"class":!0===b.isTitle?"":"btn-hide-row"})).store("data",a).insert({bottom:(new Element(b.tag,{"class":"name col-xs-1"})).update(a.id)}).insert({bottom:(new Element(b.tag,
{"class":"name col-xs-1"})).update(!0===b.isTitle?a.sku:a.product.sku)}).insert({bottom:(new Element(b.tag,{"class":"name col-xs-3"})).update(!0===b.isTitle?a.name:a.product.name)}).insert({bottom:(new Element(b.tag,{"class":"name col-xs-3"})).update(!0===b.isTitle?a.category:b.categories)}).insert({bottom:(new Element(b.tag,{"class":"name col-xs-1"})).update(!0===b.isTitle?a.price:b.me._getCurrency(b.price))}).insert({bottom:(new Element(b.tag,{"class":"name col-xs-1"})).update(!0===b.isTitle?a.stock:
a.product.status?a.product.status.name:"")}).insert({bottom:(new Element(b.tag,{"class":"name col-xs-1"})).update(!0===b.isTitle?a.status:a.status.name)}).insert({bottom:(new Element(b.tag,{"class":"text-right col-xs-1 "})).update(!0===b.isTitle?(new Element("span",{"class":"btn btn-primary btn-xs",title:"New"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-plus"})}).insert({bottom:" NEW"}).observe("click",function(){$(this).up("thead").insert({bottom:b.newEditEl=b.me._getEditPanel({})});
b.newEditEl.down(".form-control[save-item-panel]").focus();b.newEditEl.down(".form-control[save-item-panel]").select();b.newEditEl.getElementsBySelector(".form-control[save-item-panel]").each(function(a){a.observe("keydown",function(a){b.me.keydown(a,function(){b.newEditEl.down(".btn-success span").click()});return!1})});b.me._loadSelectOptions(null,b.newEditEl)}):(new Element("span",{"class":"btn-group btn-group-xs"})).insert({bottom:(new Element("span",{"class":"btn btn-default",title:"Edit"})).insert({bottom:new Element("span",
{"class":"glyphicon glyphicon-pencil"})}).observe("click",function(){$(this).up(".item_row").replace(b.editEl=b.me._getEditPanel(a));b.editEl.down(".form-control[save-item-panel]").focus();b.editEl.down(".form-control[save-item-panel]").select();b.editEl.getElementsBySelector(".form-control[save-item-panel]").each(function(a){a.observe("keydown",function(a){b.me.keydown(a,function(){b.editEl.down(".btn-success span").click()});return!1})});b.me._loadSelectOptions(a,b.editEl)})}).insert({bottom:(new Element("span",
{"class":"btn btn-danger",title:"Delete"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){if(!confirm("Are you sure you want to delete this item?"))return!1;b.me._deleteItem(a)})}).insert({bottom:(new Element("a",{"class":"btn btn-success",title:"Full Edit",href:"/product/"+a.product.id+".html",target:"_BLANK"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-edit"})})}))});return b.row},_deleteItem:function(a){var c,b,e,d;c=
this;b=$(c.resultDivId).down("tbody").down(".item_row[item_id="+a.id+"]");c.postAjax(c.getCallbackId("deleteItems"),{id:a.id},{onLoading:function(){b&&b.hide()},onSuccess:function(a,g){try{if(e=c.getResp(g,!1,!0))d=1*$(c.totalNoOfItemsId).innerHTML-1,$(c.totalNoOfItemsId).update(0>=d?0:d),b&&b.remove()}catch(f){c.showModalBox('<span class="text-danger">ERROR</span>',f,!0),b&&b.show()}}});return c},_getCurrency:function(a,c,b,e,d){var h,g,f;h=isNaN(b=Math.abs(b))?2:b;c=void 0==c?"$":c;e=void 0==e?
".":e;d=void 0==d?",":d;b=0>a?"-":"";g=parseInt(a=Math.abs(+a||0).toFixed(h))+"";f=3<(f=g.length)?f%3:0;return c+b+(f?g.substr(0,f)+d:"")+g.substr(f).replace(/(\d{3})(?=\d)/g,"$1"+d)+(h?e+Math.abs(a-g).toFixed(h).slice(2):"")},_getValueFromCurrency:function(a){return a?(a+"").replace(/\s*/g,"").replace(/\$/g,"").replace(/,/g,""):""},_markFormGroupError:function(a,c){var b={me:this};a.up(".form-group")&&(a.store("clearErrFunc",function(b){a.up(".form-group").removeClassName("has-error");jQuery("#"+
a.id).tooltip("hide").tooltip("destroy").show()}).up(".form-group").addClassName("has-error"),b.me._signRandID(a),jQuery("#"+a.id).tooltip({trigger:"manual",placement:"auto",container:"body",placement:"bottom",html:!0,title:c,content:c}).tooltip("show"),$(a).observe("change",function(){b.func=$(a).retrieve("clearErrFunc");"function"===typeof b.func&&b.func()}));return b.me},_currencyInputChanged:function(a){var c;if($F(a).blank())return!1;c=this._getValueFromCurrency($F(a));if(null===c.match(/^(-)?\d+(\.\d{1,4})?$/))return this._markFormGroupError(a,
"Invalid currency format provided!"),!1;$(a).value=this._getCurrency(c);return!0},_loadSelectOptions:function(a,c){var b,e,d,h,g=c.down('.chosen[save-item-panel="category"]'),f=c.down('.chosen[save-item-panel="status"]'),k=c.down('.chosen[save-item-panel="stock"]');this._signRandID(g);this._signRandID(f);this._signRandID(k);jQuery("#"+g.id).select2({multiple:!0,allowClear:!0,ajax:{url:"/ajax/getAll",dataType:"json",delay:10,type:"POST",data:function(a,b){return{searchTxt:"name like ?",searchParams:["%"+
a+"%"],entityName:"ProductCategory",pageNo:b}},results:function(a,c,d){b=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){b.push({id:a.id,text:a.name,data:a})});return{results:b,more:a.resultData&&a.resultData.pagination&&a.resultData.pagination.totalPages&&c<a.resultData.pagination.totalPages}},cache:!0},formatResult:function(a){return a?'<div class="row"><div class="col-xs-12">'+a.data.namePath+"</div></div>":""},formatSelection:function(a){if(!a)return"";e=a.text;return d=
(new Element("div")).update(e)},escapeMarkup:function(a){return a}});jQuery("#"+f.id).select2({multiple:!1,allowClear:!0,ajax:{url:"/ajax/getAll",dataType:"json",delay:10,type:"POST",data:function(a,b){return{searchTxt:"name like ?",searchParams:["%"+a+"%"],entityName:"NewProductStatus",pageNo:b}},results:function(a,c,d){b=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){b.push({id:a.id,text:a.name,data:a})});return{results:b,more:a.resultData&&a.resultData.pagination&&a.resultData.pagination.totalPages&&
c<a.resultData.pagination.totalPages}},cache:!0},formatResult:function(a){return a?'<div class="row"><div class="col-xs-12">'+a.data.name+"</div></div>":""},formatSelection:function(a){if(!a)return"";e=a.text;return d=(new Element("div")).update(e)},escapeMarkup:function(a){return a}});jQuery("#"+k.id).select2({multiple:!1,allowClear:!0,ajax:{url:"/ajax/getAll",dataType:"json",delay:10,type:"POST",data:function(a,b){return{searchTxt:"name like ? and id in (2,4,5,8)",searchParams:["%"+a+"%"],entityName:"ProductStatus",
pageNo:b}},results:function(a,c,d){b=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){b.push({id:a.id,text:a.name,data:a})});return{results:b,more:a.resultData&&a.resultData.pagination&&a.resultData.pagination.totalPages&&c<a.resultData.pagination.totalPages}},cache:!0},formatResult:function(a){return a?'<div class="row"><div class="col-xs-12">'+a.data.name+"</div></div>":""},formatSelection:function(a){if(!a)return"";e=a.text;return d=(new Element("div")).update(e)},escapeMarkup:function(a){return a}});
a&&(a.product&&a.product.categories&&(h=[],a.product.categories.each(function(a){h.push({id:a.id,text:a.name})}),jQuery("#"+g.id).select2("data",h)),a.status&&jQuery("#"+f.id).select2("data",{id:a.status.id,text:a.status.name}),a.product&&a.product.status&&jQuery("#"+k.id).select2("data",{id:a.product.status.id,text:a.product.status.name}));return this}});