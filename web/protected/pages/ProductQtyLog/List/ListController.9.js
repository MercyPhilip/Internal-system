var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{_getTitleRowData:function(){return{stockOnHand:"Stock on Hand",stockOnHandVar:"stockOnHandVar",totalOnHandValue:"Total On Hand Value",totalOnHandValueVar:"totalOnHandValueVar",totalInPartsValue:"Total In PartsValue",totalInPartsValueVar:"totalInPartsValueVar",stockOnOrder:"Stock On Order",stockOnOrderVar:"stockOnOrderVar",stockOnPO:"Stock On PO",stockOnPOVar:"stockOnPOVar",stockInParts:"Stock In Parts",stockInPartsVar:"stockInPartsVar",stockInRMA:"Stock In RMA",
stockInRMAVar:"stockInRMAVar",comments:"Comments",type:"Type",created:"Date",totalRMAValue:"Total RMA Value",product:{name:"Product",sku:"sku"}}},setPreData:function(a,d,b){a=a||!1;d=d||!1;b=b||!1;!1!==a&&($("searchDiv").down('[search_field="pql.createdDate_from"]').value=a.replace(/["']/g,""));!1!==d&&($("searchDiv").down('[search_field="pql.createdDate_to"]').value=d.replace(/["']/g,""));!1!==b&&jQuery('.select2[search_field="pro.id"]').select2("data",{id:b.id,text:b.name,data:b},!0);(a||d||b)&&
$("searchPanel").down("#searchBtn").click();return this},_bindSearchKey:function(){var a,d,b;a=this;$$("#searchBtn").first().observe("click",function(c){a.getSearchCriteria().getResults(!0,a._pagination.pageSize)});$("searchDiv").getElementsBySelector("[search_field]").each(function(c){c.observe("keydown",function(c){a.keydown(c,function(){$("searchPanel").down("#searchBtn").click()})})});d=(new Element("input",{"class":"select2 form-control","data-placeholder":"search for a Products",search_field:"pro.id"})).insert({bottom:(new Element("option")).update("")});
$("searchDiv").down('[search_field="pro.id"]').replace(d);jQuery('.select2[search_field="pro.id"]').select2({allowClear:!0,hidden:!0,multiple:!1,ajax:{url:"/ajax/getProducts",dataType:"json",delay:10,data:function(a){return{searchTxt:a,pageNo:1,pageSize:10,userId:jQuery("#userId").attr("value")}},results:function(a){b=[];a.resultData.items.each(function(a){b.push({id:a.id,text:a.name,data:a})});return{results:b}},cache:!0},formatResult:function(a){return a?"<div value="+a.data.id+">"+a.data.name+
"</div >":""},escapeMarkup:function(a){return a},minimumInputLength:3});return this},_getEditPanel:function(a){var d,b;d=this;return(new Element("tr",{"class":"save-item-panel info"})).store("data",a).insert({bottom:new Element("input",{type:"hidden","save-item-panel":"id",value:a.id?a.id:""})}).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:new Element("input",{required:!0,"class":"form-control",placeholder:"The name of the Prefer Location Type","save-item-panel":"name",
value:a.name?a.name:""})})}).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:new Element("input",{"class":"form-control",placeholder:"Optional - The description of the Prefer Location Type","save-item-panel":"description",value:a.description?a.description:""})})}).insert({bottom:(new Element("td",{"class":"text-right"})).insert({bottom:(new Element("span",{"class":"btn-group btn-group-sm"})).insert({bottom:(new Element("span",{"class":"btn btn-success",title:"Save"})).insert({bottom:new Element("span",
{"class":"glyphicon glyphicon-ok"})}).observe("click",function(){b=this;d._saveItem(b,$(b).up(".save-item-panel"),"save-item-panel")})}).insert({bottom:(new Element("span",{"class":"btn btn-danger",title:"Delete"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-remove"})}).observe("click",function(){a.id?$(this).up(".save-item-panel").replace(d._getResultRow(a).addClassName("item_row").writeAttribute("item_id",a.id)):$(this).up(".save-item-panel").remove()})})})})},getTypeName:function(a){switch(a){case "P":return"Purchase";
case "S":return"Sales Order";case "AD":return"Stock Adjustment";case "SI":return"Internal Stock movement";case "Type":return a;default:return"Invalid type!"}},_loadDataPicker:function(){$$(".datepicker").each(function(a){new Prado.WebUI.TDatePicker({ID:a,InputMode:"TextBox",Format:"yyyy-MM-dd 00:00:00",FirstDayOfWeek:1,CalendarStyle:"default",FromYear:2009,UpToYear:2024,PositionMode:"Bottom",ClassName:"datepicker-layer-fixer"})});return this},getNumber:function(a){a=this.getValueFromCurrency(a);return 0<
a?"+"+a:a.toString()},_getResultRow:function(a,d){var b,c,e;b=a.id?"td":"th";c=d||!1;e="";a.order&&a.order.id?e=(new Element("a",{href:"/orderdetails/"+a.order.id+".html",target:"_BLANK"})).update(a.order.orderNo):a.purchaseOrder&&a.purchaseOrder.id&&(e=(new Element("a",{href:"/purchase/"+a.purchaseOrder.id+".html",target:"_BLANK"})).update(a.purchaseOrder.purchaseOrderNo));return(new Element("tr",{"class":!0===c?"":"btn-hide-row"})).store("data",a).insert({bottom:(new Element(b,{"class":"col-xs-1"})).update(!0===
c?a.created:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-3"})).insert({bottom:(new Element("abbr",{title:this.getTypeName(a.type)})).update(a.type)})}).insert({bottom:(new Element("div",{"class":"col-xs-9"})).insert({bottom:(new Element("small")).update(moment(this.loadUTCTime(a.created)).format("DD/MMM/YY h:mm a"))})}))}).insert({bottom:(new Element(b)).update(!0===c?"Product":(new Element("a",{href:"/product/"+a.product.id+".html",target:"_BLANK"})).update(a.product.name))}).insert({bottom:(new Element(b,
{"class":"col-xs-6"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-1"})).update(c?a.stockOnPO:a.stockOnPO+"("+this.getNumber(a.stockOnPOVar)+")")}).insert({bottom:(new Element("div",{"class":"col-xs-1"})).update(c?a.stockOnHand:a.stockOnHand+"("+this.getNumber(a.stockOnHandVar)+")")}).insert({bottom:(new Element("div",{"class":"col-xs-3"})).update(c?a.totalOnHandValue:this.getCurrency(a.totalOnHandValue)+"("+this.getNumber(this.getCurrency(a.totalOnHandValueVar))+
")")}).insert({bottom:(new Element("div",{"class":"col-xs-1"})).update(c?a.stockOnOrder:a.stockOnOrder+"("+this.getNumber(a.stockOnOrderVar)+")")}).insert({bottom:(new Element("div",{"class":"col-xs-1"})).update(c?a.stockInParts:a.stockInParts+"("+this.getNumber(a.stockInPartsVar)+")")}).insert({bottom:(new Element("div",{"class":"col-xs-2"})).update(c?a.totalInPartsValue:this.getCurrency(a.totalInPartsValue)+"("+this.getNumber(this.getCurrency(a.totalInPartsValueVar))+")")}).insert({bottom:(new Element("div",
{"class":"col-xs-1"})).update(c?a.stockInRMA:a.stockInRMA+"("+this.getNumber(a.stockInRMAVar)+")")}).insert({bottom:(new Element("div",{"class":"col-xs-2"})).update(c?a.totalRMAValue:this.getCurrency(a.totalRMAValue)+"("+this.getNumber(this.getCurrency(a.totalRMAValueVar))+")")})})}).insert({bottom:(new Element(b,{"class":"col-xs-2"})).update(a.comments+" ").insert({bottom:e})})}});