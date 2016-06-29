var PageJs=new Class.create;
PageJs.prototype=Object.extend(new DetailsPageJs,{_manufacturers:[],_suppliers:[],_statuses:[],_btnIdNewPO:null,_priceTypes:[],_codeTypes:[],_locationTypes:[],_productTreeId:"product_category_tree",_imgPanelId:"images_panel",_readOnlyMode:!1,_accountingCodes:[],_selectTypeTxt:"Select One...",_getFormGroup:function(a,b){return(new Element("div",{"class":"form-group form-group-sm form-group-sm-label"})).insert({bottom:(new Element("label")).update(a)}).insert({bottom:b.addClassName("form-control")})},setPreData:function(a,
b,c,d,e,f,g,h){this._manufacturers=a;this._suppliers=b;this._statuses=c;this._priceTypes=d;this._codeTypes=e;this._locationTypes=f;if(this._btnIdNewPO=g||!1)this._btnIdNewPO=g.replace(/["']/g,"")||!1;this._accountingCodes=h;return this},_getSelBox:function(a,b){var c;c=new Element("select");a.each(function(a){c.insert({bottom:(new Element("option",{value:a.id,selected:b&&a.id===b?!0:!1})).update(a.name)})});return c},_getListPanelRow:function(a,b,c,d,e){var f,g,h,k;d=d||!1;f=!0===d?"th":"td";g=c.type.toLowerCase();
h=c.value.toLowerCase();k="NEW_"+String.fromCharCode(65+Math.floor(26*Math.random()))+Date.now();b=(new Element("tr")).insert({bottom:(new Element(f)).update(!0===d?c.type:this._getSelBox(b,a[g]&&a[g].id?a[g].id:"").addClassName("form-control input-sm ").writeAttribute("list-panel-row","typeId").writeAttribute("required",!0).writeAttribute("list-item",a.id?a.id:k).observe("change",function(a){"function"===typeof e&&e(a)}).wrap(new Element("div",{"class":"form-group"})))});a.id&&b.insert({bottom:(new Element("input",
{type:"hidden","class":"form-control","list-panel-row":"id",value:a.id})).writeAttribute("list-item",a.id?a.id:k)});c.start&&b.insert({bottom:(new Element(f)).update(!0===d?c.start:(new Element("input",{"class":"form-control input-sm datepicker","list-panel-row":"start",value:a.start?a.start:"",required:!0,disabled:a.type&&!a.type.needTime})).writeAttribute("list-item",a.id?a.id:k).wrap(new Element("div",{"class":"form-group"})))});c.end&&b.insert({bottom:(new Element(f)).update(!0===d?c.end:(new Element("input",
{"class":"form-control input-sm datepicker","list-panel-row":"end",value:a.end?a.end:"",required:!0,disabled:a.type&&!a.type.needTime})).writeAttribute("list-item",a.id?a.id:k).wrap(new Element("div",{"class":"form-group"})))});h=(new Element("div",{"class":"input-group input-group-sm"})).insert({bottom:(new Element("input",{type:"text","class":"form-control","list-panel-row":"value",required:!0,value:a[h]?a[h]:""})).writeAttribute("list-item",a.id?a.id:k)}).insert({bottom:(new Element("input",{type:"hidden",
"class":"form-control","list-panel-row":"active",value:"1"})).writeAttribute("list-item",a.id?a.id:k)}).insert({bottom:(new Element("span",{"class":"btn btn-danger input-group-addon"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){a.id?($(this).up(".input-group").down("[list-panel-row=active]").value="0",$(this).up(".input-group").down("[list-panel-row=value]").writeAttribute("required",!1),$(this).up(".list-panel-row").hide()):$(this).up(".list-panel-row").remove()})});
b.insert({bottom:(new Element(f)).update(!0===d?c.value:h.wrap(new Element("div",{"class":"form-group"})))});return b},_getListPanel:function(a,b,c,d,e){var f,g,h,k;f=this;a=(new Element("div",{"class":"panel panel-default"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).insert({bottom:(new Element("a",{"class":"toggle-btn",href:"javascript: void(0);",title:"click show/hide content below"})).insert({bottom:(new Element("strong")).update(a)}).observe("click",function(){$(this).up(".panel").down(".list-div").toggle()})}).insert({bottom:(new Element("span",
{"class":"btn btn-primary btn-xs pull-right",title:"New"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-plus"})}).insert({bottom:" NEW"}).observe("click",function(){g=$(this).up(".panel");h={};c.start&&(h.start="0001-01-01 00:00:00");c.end&&(h.end="9999-12-31 23:59:59");g.down(".table tbody").insert({bottom:f._getListPanelRow(h,d,c,!1,e).addClassName("list-panel-row").writeAttribute("item_id","")});g.down(".list-div").show();f._bindDatePicker()})})}).insert({bottom:(new Element("div",
{"class":"list-div table-responsive"})).insert({bottom:(new Element("table",{"class":"table table-condensed",style:"width : auto"})).insert({bottom:(new Element("thead")).update(f._getListPanelRow(c,d,c,!0,e))}).insert({bottom:k=new Element("tbody")})})});b&&b.each(function(a){k.insert({bottom:f._getListPanelRow(a,d,c,!1,e).addClassName("list-panel-row").writeAttribute("item_id",a.id)})});return a},_loadRichTextEditor:function(a){this._signRandID(a);jQuery("#"+a.id).summernote({height:90,airMode:!1});
return this},_getRichTextEditor:function(a,b){return(new Element("div",{"class":"summernote",save:a})).update(b?b:"")},_getFullDescriptionPanel:function(a){var b,c,d,e;b=this;c=a.id?(new Element("span",{"class":"btn btn-default btn-loadFullDesc"})).update("click to show the full description editor").observe("click",function(){d=$(this);a.fullDescriptionAsset||b._readOnlyMode?!a.fullDescriptionAsset&&b._readOnlyMode?(e=b._getRichTextEditor("fullDescription",""),$$(".fullDescriptionEl").first().replace((new Element("div",
{"class":"col-sm-12"})).update(b._getFormGroup("Full Description:",new Element("input",{type:"text",disabled:!0,value:""}))))):jQuery.ajax({type:"GET",url:a.fullDescriptionAsset.url,success:function(a){e=b._getRichTextEditor("fullDescription",a);b._readOnlyMode?$$(".fullDescriptionEl").first().replace((new Element("div",{"class":"col-sm-12"})).update(b._getFormGroup("Full Description:",new Element("input",{type:"text",disabled:!0,value:a?a:""})))):($(d).replace(e),b._loadRichTextEditor(e))}}):(e=
b._getRichTextEditor("fullDescription",""),$(d).replace(e),b._loadRichTextEditor(e))}):b._getRichTextEditor("fullDescription","");return b._getFormGroup("Full Description:",c)},_getcustomTabPanel:function(a){var b,c,d,e;b=this;c=a.id?(new Element("span",{"class":"btn btn-default btn-loadCustomTab"})).update("click to show the feature editor").observe("click",function(){d=$(this);a.customTabAsset||b._readOnlyMode?!a.customTabAsset&&b._readOnlyMode?(e=b._getRichTextEditor("customTab",""),$$(".customTabEl").first().replace((new Element("div",
{"class":"col-sm-12"})).update(b._getFormGroup("Feature:",new Element("input",{type:"text",disabled:!0,value:""}))))):jQuery.ajax({type:"GET",url:a.customTabAsset.url,success:function(a){e=b._getRichTextEditor("customTab",a);b._readOnlyMode?$$(".customTabEl").first().replace((new Element("div",{"class":"col-sm-12"})).update(b._getFormGroup("Feature:",new Element("input",{type:"text",disabled:!0,value:a?a:""})))):($(d).replace(e),b._loadRichTextEditor(e))}}):(e=b._getRichTextEditor("customTab",""),
$(d).replace(e),b._loadRichTextEditor(e))}):b._getRichTextEditor("customTab","");return b._getFormGroup("Feature:",c)},_getChildCategoryJson:function(a,b){var c,d;c=this;d={text:a.name,id:a.id};0<=b.indexOf(a.id)&&(d.checked=!0);a.children&&0<a.children.size()&&(d.children=[],a.children.each(function(a){d.children.push(c._getChildCategoryJson(a,b))}));return d},_initTree:function(a,b){var c,d,e;c=this;d=[];e=[];c._item.categories.each(function(a){e.push(a.id)});a.each(function(a){d.push(c._getChildCategoryJson(a,
e))});jQuery(b).tree({data:d});return c},_getCategories:function(a){var b,c,d;b=this;b.postAjax(b.getCallbackId("getCategories"),{},{onLoading:function(c,d){$(a).update(b.getLoadingImg())},onSuccess:function(e,f){try{(c=b.getResp(f,!1,!0))&&c.items&&(d=new Element("ul",{id:b._productTreeId,"data-options":"animate:true, checkbox:true, cascadeCheck:false"}),$(a).update((new Element("div",{"class":"easyui-panel"})).update(d)),b._signRandID(d),b._initTree(c.items,"#"+d.id),$(a).addClassName("loaded"))}catch(g){$(a).update(b.getAlertBox("Error:",
g).addClassName("alert-danger"))}}});return b},_getCategoryPanel:function(a){var b,c,d;b=this;return(new Element("div",{"class":"panel panel-default"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).insert({bottom:(new Element("a",{href:"javascript: void(0);"})).insert({bottom:(new Element("strong")).update("Categories: "+(b._item.categories?b._item.categories.size()+" Selected":""))})}).observe("click",function(){c=this;d=$(c).up(".panel").down(".panel-body");d.hasClassName("loaded")||
b._getCategories(d);d.toggle()})}).insert({bottom:new Element("div",{"class":"panel-body",style:"display: none"})})},_getSummaryDiv:function(a){var b,c;b=this;a=(new Element("div",{"class":"panel panel-default"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).insert({bottom:(new Element("a",{href:"javascript: void(0);",title:"click to show/hide below"})).insert({bottom:(new Element("strong")).update(a.name?"Editing: "+a.name:"Creating: ")}).observe("click",function(){$(this).up(".panel").down(".panel-body").toggle()})}).insert({bottom:(new Element("small",
{"class":"pull-right"})).insert({bottom:(new Element("label",{"for":"showOnWeb_"+a.id})).update("Show on Web?")}).insert({bottom:new Element("input",{id:"showOnWeb_"+a.id,"save-item":"sellOnWeb",type:"checkbox",checked:a.sellOnWeb})})})}).insert({bottom:(new Element("div",{"class":"panel-body"})).insert({bottom:(new Element("div",{"class":""})).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(b._getFormGroup("Name",new Element("input",{"save-item":"name",type:"text",required:!0,value:a.name?
a.name:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(b._getFormGroup("sku",c=new Element("input",{"save-item":"sku",type:"text",required:!0,value:a.sku?a.sku:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(b._getFormGroup("Status",b._getSelBox(b._statuses,a.status?a.status.id:null).writeAttribute("save-item","statusId").addClassName("chosen")))})}).insert({bottom:(new Element("div",{"class":""})).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(b._getFormGroup("Brand/Manf.",
b._getSelBox(b._manufacturers,a.manufacturer?a.manufacturer.id:null).writeAttribute("save-item","manufacturerId").addClassName("chosen")))}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(b._getFormGroup("Web As New Start:",new Element("input",{"class":"datepicker","save-item":"asNewFromDate",value:a.asNewFromDate?a.asNewFromDate:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).update(b._getFormGroup("Web As New End:",new Element("input",{"class":"datepicker","save-item":"asNewToDate",
value:a.asNewToDate?a.asNewToDate:""})))})}).insert({bottom:(new Element("div",{"class":""})).insert({bottom:(new Element("div",{"class":"col-sm-3"})).update(b._getFormGroup("Attribute Set Name:",new Element("input",{disabled:!0,type:"text",value:a.attributeSet?a.attributeSet.name:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-3"})).update(b._getFormGroup("Attribute Set Description:",new Element("input",{disabled:!0,type:"text",value:a.attributeSet?a.attributeSet.description:""})))}).insert({bottom:(new Element("div",
{"class":"col-sm-3"})).update(b._getFormGroup("Attribute Set ID:",new Element("input",{disabled:!0,type:"text",value:a.attributeSet?a.attributeSet.id:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-3"})).update(b._getFormGroup("Attribute Set Mage ID:",new Element("input",{disabled:!0,type:"text",value:a.attributeSet?a.attributeSet.mageId:""})))})}).insert({bottom:(new Element("div",{"class":""})).insert({bottom:(new Element("div",{"class":"col-sm-10"})).update(b._getFormGroup("Short Description:",
new Element("input",{"save-item":"shortDescription",type:"text",value:a.shortDescription?a.shortDescription:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-2"})).update(b._getFormGroup("Weight:",new Element("input",{"save-item":"weight",required:!0,type:"text",value:0<parseFloat(a.weight)?a.weight:""})))})}).insert({bottom:(new Element("div",{"class":""})).insert({bottom:(new Element("div",{"class":"col-sm-12 fullDescriptionEl"})).update(b._getFullDescriptionPanel(a))})}).insert({bottom:(new Element("div",
{"class":""})).insert({bottom:(new Element("div",{"class":"col-sm-12 customTabEl"})).update(b._getcustomTabPanel(a))})})});b._item.id&&!1!==jQuery.isNumeric(b._item.id)||c.observe("change",function(a){b._validateSKU($F(c),c)});return a},_validateSKU:function(a,b){var c,d,e,f,g;c=this;d=d||!1;c.postAjax(c.getCallbackId("validateSKU"),{sku:a},{onLoading:function(a,b){!1!==d&&d.writeAttribute("disabled",!0)},onSuccess:function(b,d){try{(e=c.getResp(d,!1,!0))&&e.item&&e.item.id&&!0===jQuery.isNumeric(e.item.id)&&
(f=e.item,g=(new Element("div",{"class":""})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-md-3"})).update("SKU")}).insert({bottom:(new Element("div",{"class":"col-md-9"})).insert({bottom:(new Element("a",{href:"/product/"+f.id+".html",target:"_BLANK"})).update(f.sku)})})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-md-3"})).update("Name")}).insert({bottom:(new Element("div",{"class":"col-md-9"})).update(f.name)})}),
c.showModalBox('<span class="text-warinig"><b>The SKU '+a+" already exist</b></span>",g))}catch(l){c.showModalBox("Error","<pre>"+l+"</pre>")}},onComplete:function(){!1!==d&&d.removeAttribute("disabled")}});return c},_loadFancyBox:function(a){var b;a.each(function(c){c.observe("click",function(){b=[];a.each(function(a){b.push({href:a.down("img").readAttribute("src")})});jQuery.fancybox(b,{prevEffect:"none",nextEffect:"none",helpers:{title:{type:"outside"},thumbs:{height:50}}})})});return this},_getImageThumb:function(a){var b,
c;b=a.data?a.data:a.path;b=(new Element("div",{"class":"col-xs-12 col-sm-6 col-md-4 thumbnail-holder btn-hide-row product-image",active:"1"})).store("data",a).insert({bottom:(new Element("a",{href:"javascript: void(0)","class":"thumbnail fancybox-thumb",ref:"product_thumbs"})).insert({bottom:new Element("img",{"data-src":"holder.js/100%x180",src:b})})}).insert({bottom:(new Element("span",{"class":"btns"})).insert({bottom:(new Element("small",{"class":"btn btn-danger btn-xs"})).insert({bottom:new Element("span",
{"class":"glyphicon glyphicon-trash"})})}).observe("click",function(){if(!confirm("Delete this image?"))return!1;c=$(this).up(".product-image");c.hasAttribute("asset-id")?c.remove():c.writeAttribute("active","0").hide()})});a.imageAssetId||b.writeAttribute("file-name",a.filename).writeAttribute("asset-id",a.imageAssetId);return b},_readImages:function(a,b){var c,d,e,f,g,h;c=this;d=a.target.files;for(e=0;f=d[e];e++)f.type.match("image.*")&&(g=new FileReader,g.onload=function(d){return function(e){h=
c._getImageThumb({data:e.target.result,filename:d.name});$(b).insert({bottom:h});a.target.value="";c._loadFancyBox($(c._imgPanelId).getElementsBySelector(".fancybox-thumb"))}}(f),g.readAsDataURL(f));return c},_getImagesPanel:function(a){var b,c,d,e,f,g;b=this;c=!(window.File&&window.FileReader&&window.FileList&&window.Blob);d=(new Element("div",{"class":"panel panel-default"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).insert({bottom:(new Element("a",{href:"javascript: void(0);",
title:"click to show/hide content below"})).insert({bottom:(new Element("strong")).update("Images: ")}).observe("click",function(){$(this).up(".panel").down(".panel-body").toggle()})}).insert({bottom:e=new Element("span",{"class":"pull-right new-btn-panel"})})}).insert({bottom:f=new Element("div",{id:b._imgPanelId,"class":"panel-body"})});a.images&&a.images.each(function(a){a.asset&&f.insert({bottom:b._getImageThumb({path:a.asset.url,filename:a.asset.filename,imageAssetId:a.asset.assetId})})});c?
e.update((new Element("span",{"class":"btn btn-danger btn-xs pull-right",title:"Your browser does NOT support this feature. Pls change browser and try again"})).insert({bottom:new Element("span",{"class":" glyphicon glyphicon-exclamation-sign"})}).insert({bottom:" Not Supported"})):e.insert({bottom:(new Element("span",{"class":"btn btn-primary btn-xs pull-right",title:"New"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-plus"})}).insert({bottom:" NEW"}).observe("click",function(){$(this).up(".new-btn-panel").down(".new-images-file").click()})}).insert({bottom:(new Element("input",
{"class":"new-images-file",type:"file",multiple:!0,style:"display: none"})).observe("change",function(a){g=$(this).up(".panel").down(".panel-body");b._readImages(a,g);g.show()})});return d},_submitSave:function(a){var b,c,d,e,f;b=this;c=b._collectFormData($(b.getHTMLID("itemDiv")),"save-item");if(null===c)return b;c.prices=b._collectFormData($(b.getHTMLID("itemDiv")).down(".prices-panel"),"list-panel-row","list-item");if(jQuery.isEmptyObject(c.prices))b.showModalBox("Notice",'<span class="text-warning">You <b>MUST</b> enter a valid <b>price</b>');
else{c.supplierCodes=b._collectFormData($(b.getHTMLID("itemDiv")).down(".suppliers-panel"),"list-panel-row","list-item");if(null===c.supplierCodes)return b;c.productCodes=b._collectFormData($(b.getHTMLID("itemDiv")).down(".codes-panel"),"list-panel-row","list-item");if(null===c.productCodes)return b;c.locations=b._collectFormData($(b.getHTMLID("itemDiv")).down(".locations-panel"),"list-panel-row","list-item");if(null===c.locations)return b;c.id=b._item.id;0<$$("[save=fullDescription]").size()&&(d=
$$("[save=fullDescription]").first())&&(c.fullDescription=jQuery("#"+d.id).summernote("code"));0<$$("[save=customTab]").size()&&(e=$$("[save=customTab]").first())&&(c.customTab=jQuery("#"+e.id).summernote("code"));if(0<jQuery("#"+b._productTreeId).length)for(c.categoryIds=[],d=jQuery("#"+b._productTreeId).tree("getChecked"),e=0;e<d.length;e++)c.categoryIds.push(d[e].id);c.images=[];d=$(b._imgPanelId);d.getElementsBySelector(".product-image").each(function(a){f=a.retrieve("data");f.imageAssetId=f.imageAssetId?
f.imageAssetId:"";f.active="1"===a.readAttribute("active");c.images.push(f)});if(!0!==b._validateAccountingCode(c.assetAccNo))b.showModalBox("Notice",'<span class="text-warning">You <b>MUST</b> enter a valid <b>Asset Account Number</b>');else if(!0!==b._validateAccountingCode(c.revenueAccNo))b.showModalBox("Notice",'<span class="text-warning">You <b>MUST</b> enter a valid <b>Revenue Account Number</b>');else if(!0!==b._validateAccountingCode(c.costAccNo))b.showModalBox("Notice",'<span class="text-warning">You <b>MUST</b> enter a valid <b>Cost Account Number</b>');
else return b.saveItem(a,c,function(a){if(!a.url)throw"System Error: no return product url";b._item=a.item;b.refreshParentWindow();b.showModalBox('<strong class="text-success">Saved Successfully!</strong>',"Saved Successfully!",!0);window.location=a.url}),b}},_validateAccountingCode:function(a){var b,c;b=a||!1;c=!1;this._accountingCodes.each(function(a){!1===c&&b===a.code&&(c=!0)});return c},_loadChosen:function(){var a,b,c,d;a=this;jQuery(".chosen").chosen({search_contains:!0,inherit_select_classes:!0,
no_results_text:"No code type found!",width:"100%"});jQuery('.chosen[save-item="assetAccNo"]').change(function(e){b=$(this).down('[value="'+$F($(this))+'"]').retrieve("data");c=$$('.chosen[save-item="revenueAccNo"]').first();d=$$('.chosen[save-item="costAccNo"]').first();$F($(this))!==a._selectTypeTxt&&(c.getElementsBySelector('option[selected="selected"]').each(function(a){a.removeAttribute("selected")}),c.down('option[description="'+b.description+'"]').writeAttribute("selected",!0),jQuery('.chosen[save-item="revenueAccNo"]').trigger("chosen:updated"),
d.getElementsBySelector('option[selected="selected"]').each(function(a){a.removeAttribute("selected")}),d.down('option[description="'+b.description+'"]').writeAttribute("selected",!0),jQuery('.chosen[save-item="costAccNo"]').trigger("chosen:updated"))});return this},_getAccCodeSelectEl:function(a){var b={me:this};switch(a){case "assetAccNo":b.type=1;break;case "revenueAccNo":b.type=4;break;case "costAccNo":b.type=5;break;default:b.showModelBox("Error","Invalid Account Code Type")}b.selectEl=(new Element("select",
{"class":"chosen","save-item":"type","data-placeholder":"Type"})).setStyle("z-index: 9999;").insert({bottom:(new Element("option",{value:b.me._selectTypeTxt})).update(b.me._selectTypeTxt)});b.me._signRandID(b.selectEl);b.me._accountingCodes.each(function(a){a.type==b.type&&(b.selectEl.insert({bottom:b.option=(new Element("option",{value:a.code,description:a.description})).store("data",a).update(a.description)}),a.code!==b.me._item.assetAccNo&&a.code!==b.me._item.revenueAccNo&&a.code!==b.me._item.costAccNo||
b.option.writeAttribute("selected",!0))});return b.selectEl},_getStockDev:function(a){var b;b=this;return(new Element("div",{"class":"panel panel-default"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).insert({bottom:(new Element("a",{href:"javascript: void(0);",title:"click to show/hide content below"})).insert({bottom:(new Element("strong")).update("Stock Info").insert({bottom:(new Element("span",{"class":"pull-right"})).update("Average Cost Ex GST: "+(0!=a.totalOnHandValue&&0!=
a.stockOnHand?b.getCurrency(a.totalOnHandValue/a.stockOnHand):"N/A"))})}).observe("click",function(){b.openInNewTab("/productqtylog.html?productid="+a.id)})}).insert({bottom:new Element("span",{"class":"pull-right new-btn-panel"})})}).insert({bottom:(new Element("div",{"class":"panel-body"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(b._getFormGroup("Stock On Hand",new Element("input",{"save-item":"stockOnHand",type:"value",
disabled:!0,value:a.stockOnHand?a.stockOnHand:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(b._getFormGroup("Stock On Hand Value",new Element("input",{"save-item":"totalOnHandValue",type:"value",disabled:!0,value:a.totalOnHandValue?b.getCurrency(a.totalOnHandValue):""})))})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(b._getFormGroup("Stock In Parts",new Element("input",{"save-item":"stockInParts",
type:"value",disabled:!0,value:a.stockInParts?a.stockInParts:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(b._getFormGroup("Stock In Parts Value",new Element("input",{"save-item":"totalOnHandValue",type:"value",disabled:!0,value:a.totalOnHandValue?b.getCurrency(a.totalOnHandValue):""})))})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(b._getFormGroup("Stock On Order",new Element("input",{"save-item":"stockOnOrder",
type:"value",disabled:!0,value:a.stockOnOrder?a.stockOnOrder:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(b._getFormGroup("Stock On PO",new Element("input",{"save-item":"stockOnPO",type:"value",disabled:!0,value:a.stockOnPO?a.stockOnPO:""})))})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(b._getFormGroup("Stock In RMA",new Element("input",{"save-item":"stockInRMA",type:"value",disabled:!0,value:a.stockInRMA?
a.stockInRMA:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(b._getFormGroup("Average Cost",new Element("input",{"save-item":"stockInRMA",type:"value",disabled:!0,value:0!=a.totalOnHandValue&&0!=a.stockOnHand?b.getCurrency(a.totalOnHandValue/a.stockOnHand):"N/A"})))})})})},_getAccInfoDiv:function(a){return(new Element("div",{"class":"panel panel-default"})).setStyle("overflow: unset !important;").insert({bottom:(new Element("div",{"class":"panel-heading"})).insert({bottom:(new Element("a",
{href:"javascript: void(0);",title:"click to show/hide content below"})).insert({bottom:(new Element("strong")).update("Accounting Info")}).observe("click",function(){$(this).up(".panel").down(".panel-body").toggle()})}).insert({bottom:new Element("span",{"class":"pull-right new-btn-panel"})})}).insert({bottom:(new Element("div",{"class":"panel-body"})).setStyle("overflow: unset !important;").insert({bottom:(new Element("div",{"class":"col-sm-4"})).insert({bottom:(new Element("div",{"class":"form-group form-group-sm"})).insert({bottom:(new Element("label")).update("Asset Account No.")}).insert({bottom:(new Element("div",
{"class":"form-control chosen-container"})).setStyle("padding: 0px; height: 100%;").insert({bottom:this._getAccCodeSelectEl("assetAccNo").writeAttribute("save-item","assetAccNo")})})})}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).insert({bottom:(new Element("div",{"class":"form-group form-group-sm"})).insert({bottom:(new Element("label")).update("Revenue Account No.")}).insert({bottom:(new Element("div",{"class":"form-control chosen-container"})).setStyle("padding: 0px; height: 100%;").insert({bottom:this._getAccCodeSelectEl("revenueAccNo").writeAttribute("save-item",
"revenueAccNo")})})})}).insert({bottom:(new Element("div",{"class":"col-sm-4"})).insert({bottom:(new Element("div",{"class":"form-group form-group-sm"})).insert({bottom:(new Element("label")).update("Cost Account No.")}).insert({bottom:(new Element("div",{"class":"form-control chosen-container"})).setStyle("padding: 0px; height: 100%;").insert({bottom:this._getAccCodeSelectEl("costAccNo").writeAttribute("save-item","costAccNo")})})})})})},_getItemDiv:function(){var a,b,c,d,e,f;a=this;return(new Element("div")).insert({bottom:(new Element("div",
{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-4"})).insert({bottom:a._getStockDev(a._item).wrap(new Element("div",{"class":"col-sm-12"}))}).insert({bottom:a._getImagesPanel(a._item)}).insert({bottom:a._getCategoryPanel(a._item)})}).insert({bottom:(new Element("div",{"class":"col-sm-8"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:a._getSummaryDiv(a._item).wrap(new Element("div",{"class":"col-sm-12"}))}).insert({bottom:a._getListPanel("Prices:",a._item.prices,
{type:"Type",value:"Price",start:"From",end:"To"},a._priceTypes,function(g){b=null;c=g.target;a._priceTypes.each(function(a){a.id===$F(c)&&(b=a)});d=$(c).up(".list-panel-row");e=d.down('[list-panel-row="start"]');f=d.down('[list-panel-row="end"]');null!==b&&!1===b.needTime?(e.writeAttribute("disabled",!0).writeAttribute("value","0001-01-01 00:00:00"),f.writeAttribute("disabled",!0).writeAttribute("value","9999-12-31 23:59:59"),d.down('[list-panel-row="value"]').select()):(f.writeAttribute("disabled",
!1).writeAttribute("value",""),e.writeAttribute("disabled",!1).writeAttribute("value","").select())}).wrap(new Element("div",{"class":"col-sm-12 prices-panel"}))}).insert({bottom:a._getAccInfoDiv(a._item).wrap(new Element("div",{"class":"col-sm-12"}))}).insert({bottom:a._getListPanel("Suppliers:",a._item.supplierCodes,{type:"Supplier",value:"Code"},a._suppliers).wrap(new Element("div",{"class":"col-sm-4 suppliers-panel"}))}).insert({bottom:a._getListPanel("Codes:",a._item.productCodes,{type:"Type",
value:"Code"},a._codeTypes).wrap(new Element("div",{"class":"col-sm-4 codes-panel"}))}).insert({bottom:a._getListPanel("Locations:",a._item.locations,{type:"Type",value:"value"},a._locationTypes).wrap(new Element("div",{"class":"col-sm-4 locations-panel"}))})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("span",{"class":"btn btn-primary pull-right col-sm-4","data-loading-text":"saving ..."})).update("Save").observe("click",function(){a._submitSave(this)})})})})})},
_bindDatePicker:function(){var a,b;a=this;$$(".datepicker").each(function(c){c.hasClassName("datepicked")||(a._signRandID(c),b=new Prado.WebUI.TDatePicker({ID:c.id,InputMode:"TextBox",Format:"yyyy-MM-dd 00:00:00",FirstDayOfWeek:1,CalendarStyle:"default",FromYear:2009,UpToYear:2024,PositionMode:"Bottom",ClassName:"datepicker-layer-fixer"}),c.store("picker",b))});return a},bindAllEventNObjects:function(){var a;a=this;a._bindDatePicker();$$(".summernote").each(function(b){a._loadRichTextEditor(b)});
return a},refreshParentWindow:function(){var a,b;if(window.opener){a=window.opener;if(b=$(a.document.body).down("#"+a.pageJs.resultDivId+" .product_item[product_id="+this._item.id+"]"))b.replace(a.pageJs._getResultRow(this._item)),b.hasClassName("success")&&b.addClassName("success");(b=$(a.document.body).down("#"+this._btnIdNewPO))&&a.pageJs&&a.pageJs.selectProduct&&a.pageJs.selectProduct(this._item,b)}},readOnlyMode:function(){this._readOnlyMode=!0;$$(".btn.btn-loadFullDesc").first().click();jQuery("input").prop("disabled",
!0);jQuery("select").prop("disabled",!0);jQuery(".btn").remove()}});