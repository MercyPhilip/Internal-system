var PageJs=new Class.create
PageJs.prototype=Object.extend(new CRUDPageJs,{_getTitleRowData:function(){return{totalAmount:"PO Amount Inc. GST",totalReceivedValue:"Bill Amount Inc. GST",totalPaid:"Total Paid",purchaseOrderNo:"PO Number",supplier:{name:"Supplier"},status:"Status",supplierRefNo:"PO Ref.",orderDate:"Order Date",active:"Active"}},_loadChosen:function(){return jQuery(".chosen").chosen({disable_search_threshold:10,no_results_text:"Oops, nothing found!",width:"95%"}),jQuery('.chosen-container input[type="text"]').keydown(function(e){(13==e.which||13==e.keyCode)&&(e.preventDefault(),$("searchPanel").down("#searchBtn").click())}),this},_bindSearchKey:function(){var e={}
return e.me=this,$$("#searchBtn").first().observe("click",function(){$$("#showSearch").first().checked?e.me.getSearchCriteria().getResults(!0,e.me._pagination.pageSize):$$("#showSearch").first().click()}),e.selectEl=new Element("input",{"class":"select2 form-control","data-placeholder":"the Name of Supplier",search_field:"po.supplierIds"}).insert({bottom:new Element("option").update("")}),$(e.me.searchDivId).down('[search_field="po.supplierIds"]').replace(e.selectEl),jQuery('.select2[search_field="po.supplierIds"]').select2({allowClear:!0,hidden:!0,multiple:!0,ajax:{url:"/ajax/getSuppliers",dataType:"json",delay:10,data:function(e){return{searchTxt:e}},results:function(t){return e.result=[],t.resultData.items.each(function(t){e.result.push({id:t.id,text:t.name,data:t})}),{results:e.result}},cache:!0},formatResult:function(e){return e?"<div value="+e.data.id+">"+e.data.name+"</div >":""},escapeMarkup:function(e){return e},minimumInputLength:1}),e.selectEl=new Element("select",{"class":"select2 form-control",multiple:!0,"data-placeholder":"the Status of PO",search_field:"po.status"}),e.me._status.each(function(t){e.selectEl.insert({bottom:new Element("option",{value:t}).update(t)})}),$(e.me.searchDivId).down('[search_field="po.status"]').replace(e.selectEl),jQuery('.select2[search_field="po.status"]').select2({allowClear:!0,hidden:!0}),$("searchDiv").getElementsBySelector("[search_field]").each(function(t){t.observe("keydown",function(t){e.me.keydown(t,function(){$(e.me.searchDivId).down("#searchBtn").click()})})}),this},_loadDataPicker:function(){return $$(".datepicker").each(function(e){new Prado.WebUI.TDatePicker({ID:e,InputMode:"TextBox",Format:"yyyy-MM-dd 00:00:00",FirstDayOfWeek:1,CalendarStyle:"default",FromYear:2009,UpToYear:2024,PositionMode:"Bottom",ClassName:"datepicker-layer-fixer"})}),this},getResults:function(e,t){var n={}
n.me=this,n.reset=e||!1,n.resultDiv=$(n.me.resultDivId),n.reset===!0&&(n.me._pagination.pageNo=1),n.me._pagination.pageSize=t||n.me._pagination.pageSize,n.me.postAjax(n.me.getCallbackId("getItems"),{pagination:n.me._pagination,searchCriteria:n.me._searchCriteria},{onLoading:function(){jQuery("#"+n.me.searchDivId+" #searchBtn").button("loading"),n.reset===!0&&n.resultDiv.update(new Element("tr").update(new Element("td").update(n.me.getLoadingImg())))},onSuccess:function(e,t){try{if(n.result=n.me.getResp(t,!1,!0),!n.result)return
$(n.me.totalNoOfItemsId).update(n.result.pageStats.totalRows),n.reset===!0&&n.resultDiv.update(n.me._getResultRow(n.me._getTitleRowData(),!0).wrap(new Element("thead"))),n.resultDiv.getElementsBySelector(".paginWrapper").each(function(e){e.remove()}),n.tbody=$(n.resultDiv).down("tbody"),n.tbody||$(n.resultDiv).insert({bottom:n.tbody=new Element("tbody")}),n.result.items.each(function(e){e.item.totalProdcutCount=e.totalProdcutCount,e=e.item,n.tbody.insert({bottom:n.me._getResultRow(e).addClassName("item_row").writeAttribute("item_id",e.id)})}),n.result.pageStats.pageNumber<n.result.pageStats.totalPages&&n.resultDiv.insert({bottom:n.me._getNextPageBtn().addClassName("paginWrapper")})}catch(a){n.resultDiv.insert({bottom:n.me.getAlertBox("Error",a).addClassName("alert-danger")})}},onComplete:function(){jQuery("#"+n.me.searchDivId+" #searchBtn").button("reset")}})},_deactivateItem:function(e){var t={}
t.me=this,t.row=$$('[item_id="'+e.id+'"]').first(),t.me.postAjax(t.me.getCallbackId("deactivateItems"),{item_id:e.id},{onLoading:function(){t.row&&t.row.hide(),t.me.hideModalBox()},onSuccess:function(e,n){try{if(t.row.toggleClassName("danger"),t.result=t.me.getResp(n,!1,!0),!t.result.item)throw"errror"
t.row.replace(t.me._getResultRow(t.result.item,!1))}catch(a){t.me.showModalBox('<span class="text-danger">ERROR</span>',a,!0)}},onComplete:function(){t.row&&t.row.show()}})},_shoConfirmDel:function(e){var t={}
return t.me=this,t.confirmDiv=new Element("div").insert({bottom:new Element("strong").update("You are about to delete a Purchase Order: "+e.purchaseOrderNo)}).insert({bottom:new Element("strong").update("After confirming deletion:")}).insert({bottom:new Element("ul").insert({bottom:new Element("li").update(" - All received item will be deleted, and stock will be reverted from StockOnHand to StockOnPO.")}).insert({bottom:new Element("li").update(" - This PO will be dactivated.")})}).insert({bottom:new Element("div").update(new Element("strong").update("Are you sure you want to continue?"))}).insert({bottom:new Element("div").insert({bottom:new Element("span",{"class":"btn btn-danger"}).update("YES, deactivate it").observe("click",function(){t.me._deactivateItem(e)})}).insert({bottom:new Element("span",{"class":"btn btn-default pull-right"}).update("NO, cancel this").observe("click",function(){t.me.hideModalBox()})})}),t.me.showModalBox('<strong class="text-warning">Confirm</strong>',t.confirmDiv),t.me},_getResultRow:function(e,t){var n={}
return n.me=this,n.tag=n.isTitle===!0?"th":"td",n.isTitle=t||!1,n.invoiceNoDiv=new Element("div"),t||e.supplierInvoices.each(function(e){n.invoiceNoDiv.insert({bottom:new Element("div").update(e)})}),n.row=new Element("tr",{"class":(n.isTitle===!0?"item_top_row":"btn-hide-row item_row po_item")+(0==e.active?" danger":""),item_id:n.isTitle===!0?"":e.id}).store("data",e).insert({bottom:new Element(n.tag,{"class":"purchaseOrderNo col-xs-1"}).update(n.isTitle?e.purchaseOrderNo:new Element("a",{href:"/purchase/"+e.id+".html",target:"_BLANK"}).update(e.purchaseOrderNo))}).insert({bottom:new Element(n.tag,{"class":" col-xs-1"}).update(n.me.loadUTCTime(e.orderDate).toLocaleString())}).insert({bottom:new Element(n.tag,{"class":" col-xs-1"}).update(e.supplier.name?e.supplier.name:"")}).insert({bottom:new Element(n.tag,{"class":" col-xs-1"}).update(n.isTitle?"Invoice No(s)":e.totalPaid?n.invoiceNoDiv:"")}).insert({bottom:new Element(n.tag,{"class":" col-xs-1"}).update(e.supplierRefNo?e.supplierRefNo:"")}).insert({bottom:new Element(n.tag,{"class":" col-xs-1"}).update(n.isTitle?"Products Count":new Element("a",{href:"/serialnumbers.html?purchaseorderid="+e.id,target:"_BLANK"}).insert({bottom:new Element("abbr",{title:"Received Product Count on this PO"}).update(e.totalReceivedCount)}).insert({bottom:new Element("span").update(" / ")}).insert({bottom:new Element("abbr",{title:"Total Product Count on this PO"}).update(e.totalProductCount)}))}).insert({bottom:new Element(n.tag,{"class":" col-xs-1"}).update(n.isTitle?"ETA":e.eta?n.me.loadUTCTime(e.eta).toDateString():"")}).insert({bottom:new Element(n.tag,{"class":" col-xs-1"}).update(n.isTitle?e.totalAmount:n.me.getCurrency(e.totalAmount))}).insert({bottom:new Element(n.tag,{"class":" col-xs-1"}).update(n.isTitle?e.totalReceivedValue:n.me.getCurrency(1.1*e.totalReceivedValue))}).insert({bottom:new Element(n.tag,{"class":" col-xs-1"}).update(n.isTitle?"Total Paid":e.totalPaid?n.me.getCurrency(e.totalPaid):"")}).insert({bottom:new Element(n.tag,{"class":" col-xs-1",order_status:e.status}).update(e.status)}).insert({bottom:n.btns=new Element(n.tag,{"class":"col-xs-1 text-right"})}),n.isTitle!==!0&&n.btns.insert({bottom:new Element("div",{"class":"btn-group"}).insert({bottom:!e.id||"ORDERED"!==e.status&&"RECEIVING"!==e.status||e.active!==!0?"":new Element("a",{"class":"btn btn-success btn-xs",href:"/receiving/"+e.id+".html",target:"_BLANK",title:"Receiving Items"}).update("Receiving")}).insert({bottom:new Element("a",{"class":"btn btn-default btn-xs",title:"Edit",href:"/purchase/"+e.id+".html",target:"_BLANK"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-pencil"})})}).insert({bottom:new Element("span",{"class":"btn btn-danger btn-xs",title:"Delete"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){n.me._shoConfirmDel(e)})})}),n.row}})