var PageJs=new Class.create;PageJs.prototype=Object.extend(new BPCPageJs,{_htmlIds:{itemDiv:"",searchPanel:"",paymentPanel:"",supplierInfoPanel:"",partsTable:"",barcodeInput:""},_forceInvNo:!0,_purchaseOrder:null,setHTMLIDs:function(e,t,n,o,s,r){return this._htmlIds.itemDiv=e,this._htmlIds.searchPanel=t,this._htmlIds.paymentPanel=n,this._htmlIds.supplierInfoPanel=o,this._htmlIds.partsTable=s,this._htmlIds.barcodeInput=r,this},_getPOListPanel:function(){var e={};return e.me=this,e.newDiv=new Element("div",{id:e.me._htmlIds.searchPanel,"class":"panel panel-warning search-panel"}).insert({bottom:new Element("div",{"class":"panel-heading form-inline"}).insert({bottom:new Element("strong").update("Searching for PO: ")}).insert({bottom:new Element("span",{"class":"input-group col-sm-6"}).insert({bottom:new Element("input",{required:!0,"class":"form-control search-txt init-focus",placeholder:"any of PO number, Supplier, Supplier Ref Number ..."}).observe("keydown",function(t){return e.txtBox=this,e.me.keydown(t,function(){e.txtBox.hasClassName("search-finished")&&1===$(pageJs._htmlIds.searchPanel).getElementsBySelector(".item_row .btn").size()?$(pageJs._htmlIds.searchPanel).down(".item_row .btn").click():($(e.me._htmlIds.searchPanel).down(".search-btn").click(),e.txtBox.addClassName("search-finished"))},function(){$(e.txtBox).removeClassName("search-finished")}),!1})}).insert({bottom:new Element("span",{"class":"input-group-btn search-btn"}).insert({bottom:new Element("span",{"class":" btn btn-primary"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-search"})})}).observe("click",function(){e.btn=this,""!==$(e.me._htmlIds.searchPanel).down(".search-txt").value&&e.me._searchPO($(e.me._htmlIds.searchPanel).down(".search-txt"))})})}).insert({bottom:new Element("span",{"class":"btn btn-success pull-right btn-sm btn-danger"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-remove"})}).observe("click",function(){$(e.me._htmlIds.searchPanel).down(".search-txt").clear(),e.me._searchPO($(e.me._htmlIds.searchPanel).down(".search-txt"))})})}),e.newDiv},_searchPO:function(e){var t={};return t.me=this,t.searchTxt=$F(e).strip(),t.searchPanel=$(e).up("#"+t.me._htmlIds.searchPanel),t.me.postAjax(t.me.getCallbackId("searchPO"),{searchTxt:t.searchTxt},{onLoading:function(){$(t.searchPanel).down(".list-div")&&$(t.searchPanel).down(".list-div").remove(),$(t.searchPanel).insert({bottom:new Element("div",{"class":"panel-body"}).update(t.me.getLoadingImg())})},onSuccess:function(e,n){$(t.searchPanel).down(".panel-body").remove();try{if(t.result=t.me.getResp(n,!1,!0),!t.result||!t.result.items)return;$(t.searchPanel).insert({bottom:new Element("small",{"class":"table-responsive list-div"}).insert({bottom:new Element("table",{"class":"table table-hover table-condensed"}).insert({bottom:new Element("thead").insert({bottom:t.me._getPORow({purchaseOrderNo:"PO Number",supplier:{name:"Supplier"},supplierRefNo:"Supplier Ref",orderDate:"Order Date",totalAmount:"Total Amount",totalProductCount:"Total Prodcut Count",status:"Status",active:"Active?"},!0)})}).insert({bottom:t.listDiv=new Element("tbody")})})}),t.result.items.each(function(e){t.listDiv.insert({bottom:t.me._getPORow(e)})})}catch(o){$(t.searchPanel).insert({bottom:new Element("div",{"class":"panel-body"}).update(t.me.getAlertBox("ERROR",o).addClassName("alert-danger"))})}}}),t.me},_getPORow:function(e,t){var n={};return n.me=this,n.isTitle=t||!1,n.tag=n.isTitle===!0?"th":"td",n.newDiv=new Element("tr",{"class":(n.isTitle===!0?"item_top_row":"item_row")+(0==e.active?" danger":""),item_id:n.isTitle===!0?"":e.id}).insert({bottom:new Element(n.tag).insert({bottom:n.isTitle===!0?"&nbsp;":new Element("span",{"class":"btn btn-primary btn-xs"}).update("select").observe("click",function(){n.me.selectPO(e)})})}).insert({bottom:new Element(n.tag).update(e.purchaseOrderNo)}).insert({bottom:new Element(n.tag).update(e.supplier.name)}).insert({bottom:new Element(n.tag).update(e.supplierRefNo)}).insert({bottom:new Element(n.tag).update(e.orderDate)}).insert({bottom:new Element(n.tag).update(e.totalAmount)}).insert({bottom:new Element(n.tag).update(e.totalProductCount)}).insert({bottom:new Element(n.tag).update(e.status)}).insert({bottom:new Element(n.tag).insert({bottom:n.isTitle===!0?e.active:new Element("input",{type:"checkbox",disabled:!0,checked:e.active})})}),n.newDiv},selectPO:function(e){var t={};return t.me=this,t.me._purchaseOrder=e,t.newDiv=t.me._getViewOfPurchaseOrder(),$(t.me._htmlIds.itemDiv).update(t.newDiv).down("[new-order-item=product]").focus(),t.me._purchaseOrder.purchaseOrderItem.each(function(e){t.currentRow=$$(".new-order-item-input").first(),t.product={name:"",id:"",qty:0,barcode:""},t.data={product:t.product,btns:new Element("span",{"class":"pull-right"}).insert({bottom:new Element("span",{"class":"btn btn-danger btn-xs"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(e){Event.stop(e),confirm("You are about to remove this entry.\n\nContinue?")&&(t.row=$(this).up(".item_row"),t.row.remove())})})},t.currentRow.insert({after:t.lastRow=t.me._getProductRow(t.data,!1)}),t.product=e.product,t.product.purchaseOrderItem=e.purchaseOrderItem,t.me._selectProduct(t.product,t.lastRow)}),t.me},_getViewOfPurchaseOrder:function(){var e={};return e.me=this,e.purchaseOrder=e.me._purchaseOrder,e.totalAmount=e.purchaseOrder.totalAmount?e.purchaseOrder.totalAmount:0,e.newDiv=new Element("div").insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-9"}).update(e.me._getSupplierInfoPanel())}).insert({bottom:new Element("div",{"class":"col-sm-3"}).update(e.me._getPaymentPanel())})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-12"}).update(e.me._getPartsTable())})}).insert({bottom:new Element("div",{"class":"row"}).setStyle("padding: 0 15px").insert({bottom:new Element("div",{"class":"col-sm-1"}).insert({bottom:new Element("label",{"class":"control-label"}).update("Comment: ")})}).insert({bottom:new Element("div",{"class":"col-sm-8"}).insert({bottom:new Element("textarea",{"save-order":"comments",rows:4}).setStyle("width: 100%;")})}).insert({bottom:new Element("div",{"class":"col-sm-3"}).insert({bottom:new Element("div").insert({bottom:new Element("div",{"class":"row"}).setStyle("border-bottom: 1px #ccc solid; padding: 4px 0;").insert({bottom:new Element("div",{"class":"col-xs-8 text-right"}).update("<strong>Total Ordered Value(Inc):</strong>")}).insert({bottom:new Element("div",{"class":"col-xs-4"}).update(e.me.getCurrency(e.totalAmount))})}).insert({bottom:new Element("div",{"class":"row"}).setStyle("border-bottom: 1px #ccc solid; padding: 4px 0;").insert({bottom:new Element("div",{"class":"col-xs-8  text-right"}).update("<strong>Total Received Value(Ex):</strong>")}).insert({bottom:new Element("div",{"class":"col-xs-4",summary:"total-recieved-value-ex"}).update(e.me.getCurrency(e.purchaseOrder.totalReceivedValue))})}).insert({bottom:new Element("div",{"class":"row"}).setStyle("border-bottom: 1px #ccc solid; padding: 4px 0;").insert({bottom:new Element("div",{"class":"col-xs-8  text-right"}).update("<strong>Total Received Value(Inc):</strong>")}).insert({bottom:new Element("div",{"class":"col-xs-4",summary:"total-recieved-value"}).update(e.me.getCurrency(1.1*e.purchaseOrder.totalReceivedValue))})})}).insert({bottom:e.me._saveBtns().setStyle("padding: 4px 0;")})})}),e.newDiv},_getSupplierInfoPanel:function(){var e={};return e.me=this,e.purchaseOrder=e.me._purchaseOrder,e.supplier=e.purchaseOrder.supplier,e.newDiv=new Element("div",{"class":"panel panel-warning",id:e.me._htmlIds.supplierInfoPanel}).insert({bottom:new Element("div",{"class":"panel-heading"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-8"}).insert({bottom:new Element("span").update("Receiving items for PO: ").insert({bottom:new Element("strong").update(e.purchaseOrder.purchaseOrderNo+" ")})})}).insert({bottom:new Element("div",{"class":"col-xs-4 text-right"}).insert({bottom:new Element("span").update("Status: ")}).insert({bottom:new Element("strong").update(e.me._purchaseOrder.status)})})})}).insert({bottom:new Element("div",{"class":"panel-body",style:"padding: 0 10px"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-3"}).insert({bottom:new Element("strong").update("Supplier Name:")}).insert({bottom:new Element("div",{style:"padding: 2px 8px"}).update(e.supplier.name?e.supplier.name:"")})}).insert({bottom:new Element("div",{"class":"col-sm-3"}).insert({bottom:new Element("strong").update("Contact Name:")}).insert({bottom:new Element("div",{style:"padding: 2px 8px"}).update(e.purchaseOrder.supplierContact?e.purchaseOrder.supplierContact:e.supplier.contactName)})}).insert({bottom:new Element("div",{"class":"col-sm-3"}).insert({bottom:new Element("strong").update("Contact Number:")}).insert({bottom:new Element("div",{style:"padding: 2px 8px"}).update(e.purchaseOrder.supplierContactNumber?e.purchaseOrder.supplierContactNumber:e.supplier.supplierContactNumber)})}).insert({bottom:new Element("div",{"class":"col-sm-3"}).insert({bottom:new Element("strong").update("Contact Email:")}).insert({bottom:new Element("div",{style:"padding: 2px 8px"}).update(e.supplier.email)})})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-3"}).insert({bottom:new Element("strong").update("Order Date:")}).insert({bottom:new Element("div",{style:"padding: 2px 8px"}).update(e.me._purchaseOrder.orderDate?e.me.loadUTCTime(e.me._purchaseOrder.orderDate).toLocaleString():"")})}).insert({bottom:new Element("div",{"class":"col-sm-3"}).insert({bottom:new Element("strong").update("Supplier Ref Number:")}).insert({bottom:new Element("div",{style:"padding: 2px 8px"}).update(e.purchaseOrder.supplierRefNo)})})})}),e.newDiv},_getFormGroup:function(e,t){return new Element("div",{"class":"form-group"}).insert({bottom:e?new Element("label",{"class":"control-label"}).update(e):""}).insert({bottom:t.addClassName("form-control")})},_getPaymentPanel:function(){var e={};return e.me=this,e.purchaseOrder=e.me._purchaseOrder,e.supplier=e.purchaseOrder.supplier,e.shippingCostEl=new Element("input",{disabled:!0,"class":"text-right",value:e.purchaseOrder.shippingCost?e.purchaseOrder.shippingCost:0}),e.handlingCostEl=new Element("input",{disabled:!0,"class":"text-right",value:e.purchaseOrder.handlingCost?e.purchaseOrder.handlingCost:0}),e.totalAmountExGstEl=new Element("input",{disabled:!0,"class":"text-right",value:e.purchaseOrder.totalAmount?e.purchaseOrder.totalAmount:0}),e.totalPaidEl=new Element("input",{disabled:!0,"class":"text-right",value:e.purchaseOrder.totalPaid?e.purchaseOrder.totalPaid:0}),e.totalAmount=e.purchaseOrder.totalAmount?e.purchaseOrder.totalAmount:0,e.totalPaid=e.purchaseOrder.totalPaid?e.purchaseOrder.totalPaid:0,e.totalDue=1*e.totalAmount-1*e.totalPaid,e.newDiv=new Element("div",{"class":"panel panel-warning",id:e.me._htmlIds.paymentPanel}).insert({bottom:new Element("div",{"class":"panel-heading text-right"}).insert({bottom:new Element("div").insert({bottom:new Element("strong").update("Payment Due: ")}).insert({bottom:new Element("span",{"class":"badge"}).update(e.me.getCurrency(e.totalDue))})})}).insert({bottom:new Element("div",{"class":"panel-body",style:"padding: 0 10px"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-7 text-right"}).update(new Element("strong").update("Total Inc GST:"))}).insert({bottom:new Element("div",{"class":"col-xs-5"}).update(e.me.getCurrency(e.totalAmount))})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-7 text-right"}).update(new Element("strong").update("Total Paid:"))}).insert({bottom:new Element("div",{"class":"col-xs-5"}).update(e.me.getCurrency(e.totalPaid))})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-7 text-right"}).update(new Element("strong").update("Total Due:"))}).insert({bottom:new Element("div",{"class":"col-xs-5"}).update(e.me.getCurrency(e.totalDue))})})}),e.newDiv},_getPartsTable:function(){var e={};return e.me=this,e.productListDiv=new Element("div",{"class":"list-group",id:e.me._htmlIds.partsTable}).insert({bottom:e.newDiv=e.me._getProductRow({product:{sku:"SKU",name:"Product Name",qty:"Qty",EANcode:"EAN code",UPCcode:"UPC code",wareLocation:"Warehouse Location"}},!0)}),e.newDiv.setStyle({cursor:"pointer"}),e.newDiv.observe("dblclick",function(t){return e.allClosed=!0,$$(".row.product-content-row").each(function(t){t.visible()&&(e.allClosed=!1)}),$$(".row.product-content-row").each(e.allClosed?function(e){e.show()}:function(e){e.hide()}),!1}),e.productListDiv.insert({bottom:e.newDiv=e.me._getNewProductRow()}),new Element("div",{"class":"panel panel-warning"}).insert({bottom:e.productListDiv})},_getProductRow:function(e,t){var n={};return n.me=this,n.isTitle=t||!1,n.EANcodeEl=new Element("div",{"class":"form-group"}).insert({bottom:new Element("input",{"class":"form-control input-sm","save-item":"EANcode",placeholder:"EAN code",type:"text",value:e.product.codes&&e.product.codes.EAN?e.product.codes.EAN:""})}).observe("keydown",function(e){n.txtBox=$(this),n.me.keydown(e,function(){n.txtBox.up(".product-head-row").down('[save-item="UPCcode"]').select()})}).observe("change",function(e){n.txtBox=$(this),n.rowData=n.txtBox.up(".item_row.list-group-item").retrieve("data"),n.rowData.EANcode=$F(n.txtBox.down("[save-item]")),n.rowData.EANcode&&n.txtBox.up(".item_row.list-group-item").store("data",n.rowData)}).observe("click",function(e){Event.stop(e),$(this).select()}),n.UPCcodeEl=new Element("div",{"class":"form-group"}).insert({bottom:new Element("input",{"class":"form-control input-sm","save-item":"UPCcode",placeholder:"UPC code",type:"text",value:e.product.codes&&e.product.codes.UPC?e.product.codes.UPC:""})}).observe("keydown",function(e){n.txtBox=$(this),n.me.keydown(e,function(){n.txtBox.up(".item_row").down('[save-item="wareLocation"]').select()})}).observe("change",function(e){n.txtBox=$(this),n.rowData=n.txtBox.up(".item_row.list-group-item").retrieve("data"),n.rowData.UPCcode=$F(n.txtBox.down("[save-item]")),n.rowData.UPCcode&&n.txtBox.up(".item_row.list-group-item").store("data",n.rowData)}).observe("click",function(e){Event.stop(e),$(this).select()}),n.wareLocationEL=new Element("div",{"class":"form-group"}).insert({bottom:new Element("input",{"class":"form-control input-sm","save-item":"wareLocation",placeholder:"Warehouse Location",type:"text",value:e.product.locations&&e.product.warehouseLocation?e.product.warehouseLocation:""})}).observe("keydown",function(e){n.txtBox=$(this),n.me.keydown(e,function(){n.txtBox.up(".item_row").down('[scanned-item="serialNo"]').select()})}).observe("change",function(e){n.txtBox=$(this),n.rowData=n.txtBox.up(".item_row.list-group-item").retrieve("data"),n.rowData.warehouseLocation=$F(n.txtBox.down("[save-item]")),n.rowData.UPCcode&&n.txtBox.up(".item_row.list-group-item").store("data",n.rowData)}).observe("click",function(e){Event.stop(e),$(this).select()}),n.me._canReceive()!==!0&&(n.EANcodeEl.down("input[save-item=EANcode]").disabled=!0,n.UPCcodeEl.down("input[save-item=UPCcode]").disabled=!0,n.wareLocationEL.down("input[save-item=wareLocation]").disabled=!0,e.btns=""),n.row=new Element(n.isTitle===!0?"strong":"div",{"class":"item_row list-group-item"}).store("data",e.product).insert({bottom:n.infoRow=new Element("div",{"class":n.isTitle?"row btn-hide-row":"row btn-hide-row product-head-row"}).insert({bottom:new Element("span",{"class":" col-sm-2 productName"}).insert({bottom:e.product.name?e.product.name:e.product.barcode})}).insert({bottom:new Element("span",{"class":"col-sm-1"}).insert({bottom:new Element("span",{"class":"scannedQty"}).update(n.isTitle===!0?"Qty":e.product.id?e.product.purchaseOrderItem?e.product.purchaseOrderItem.receivedQty:0:"")}).insert({bottom:new Element("span",{"class":"orderedQty"}).update(e.product.purchaseOrderItem?"/"+e.product.purchaseOrderItem.qty:"")})}).insert({bottom:new Element("span",{"class":" col-sm-2 EANcode"}).update(e.product.id?n.EANcodeEl:e.product.EANcode)}).insert({bottom:new Element("span",{"class":" col-sm-2 UPCcode"}).update(e.product.id?n.UPCcodeEl:e.product.UPCcode)}).insert({bottom:new Element("span",{"class":" col-sm-2 wareLocation"}).update(e.product.id?n.wareLocationEL:e.product.wareLocation)}).insert({bottom:n.btns=new Element("span",{"class":"btns col-sm-1"}).update(e.btns?e.btns:"")})}),n.infoRow.insert({top:new Element("span",{"class":"col-sm-2 productSku"}).update(e.product.sku?e.product.sku:"")}),e.scanTable&&n.me._canReceive()===!0&&n.row.insert({bottom:new Element("div",{"class":"row product-content-row"}).insert({bottom:new Element("div",{"class":"col-sm-2"}).insert({bottom:new Element("span").insert({bottom:new Element("input",{type:"checkbox","class":"show-checkbox"})}).insert({bottom:new Element("label").update(" show input panel")})}).observe("click",function(){n.productRow=$(this).up(".row.product-content-row"),n.checkBox=n.productRow.down(".show-checkbox"),n.checkBox.checked=!n.checkBox.checked,n.productRow.down(".scanTable").toggle()})}).insert({bottom:new Element("div",{"class":"col-sm-10"}).update(e.scanTable.setStyle("display:none;"))})}),n.row},_getNewProductRow:function(){var e={};return e.me=this,e.skuAutoComplete=e.me._getNewProductProductAutoComplete(),e.data={product:{name:e.skuAutoComplete},btns:""},e.newRow=e.me._getProductRow(e.data,!1).addClassName("new-order-item-input list-group-item-warning").removeClassName("order-item-row btn-hide-row"),e.me._canReceive()!==!0&&e.newRow.hide(),e.newRow},_getNewProductProductAutoComplete:function(){var e={};return e.me=this,e.skuAutoComplete=e.me._getFormGroup(null,new Element("div",{"class":"input-group input-group-sm product-autocomplete"}).insert({bottom:new Element("input",{id:e.me._htmlIds.barcodeInput,"class":"form-control search-txt visible-xs visible-sm visible-md visible-lg","new-order-item":"product",required:"Required!",placeholder:"Enter BARCODE for products"}).observe("keydown",function(t){return e.txtBox=this,e.me.keydown(t,function(){$(e.txtBox).up(".product-autocomplete").down(".search-btn").click()}),e.me.keydown(t,function(){$(e.txtBox).up(".product-autocomplete").down(".search-btn").click()},null,9),!1})}).insert({bottom:new Element("span",{"class":"input-group-btn"}).insert({bottom:new Element("span",{"class":" btn btn-primary search-btn","data-loading-text":"searching..."}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-search"})}).observe("click",function(){e.me._searchProduct(this)})})})),e.skuAutoComplete.down(".input-group").removeClassName("form-control"),e.skuAutoComplete},_getScanTableROW:function(e,t){var n={};return n.me=this,n.tag=t===!0?"th":"td",n.newDiv=new Element("tr",{"class":t===!0?"":"scanned-item-row"}).store("data",e).insert({bottom:new Element(n.tag,{"class":"col-sm-1"}).update(e.qty?e.qty:"")}).insert({bottom:new Element(n.tag).update(e.serialNo?e.serialNo:"")}).insert({bottom:new Element(n.tag).update(e.unitPrice?e.unitPrice:"")}).insert({bottom:new Element(n.tag).update(e.invoiceNo?e.invoiceNo:"")}).insert({bottom:new Element(n.tag).update(e.comments?e.comments:"")}).insert({bottom:new Element(n.tag,{"class":"btns"}).update(e.btns?e.btns:"")}),n.newDiv},_updatetotalReceivedValue:function(){var e={};return e.me=this,e.totalScanedValue=e.me._purchaseOrder.totalReceivedValue,$$(".scanned-item-row").each(function(t){e.qtyBox=t.down('[scanned-item="qty"]'),e.unitPriceBox=t.down('[scanned-item="unitPrice"]'),!t.hasClassName("new-scan-row")&&e.qtyBox&&e.unitPriceBox&&(e.totalScanedValue=1*e.totalScanedValue+e.me.getValueFromCurrency($F(e.unitPriceBox))*$F(e.qtyBox))}),e.totalValueInc=1.1*e.totalScanedValue,jQuery('[summary="total-recieved-value-ex"]').html(e.me.getCurrency(e.totalScanedValue)).val(e.me.getCurrency(e.totalScanedValue)),jQuery('[summary="total-recieved-value"]').html(e.me.getCurrency(e.totalValueInc)).val(e.me.getCurrency(e.totalValueInc)),e.me},_getScanTable:function(e,t){var n={};return n.me=this,console.debug(t),n.table=new Element("table",{"class":"table scanTable"}).insert({bottom:new Element("thead").update(n.me._getScanTableROW({qty:"Qty",serialNo:"Serial No.",unitPrice:"Unit Price (Ex)",invoiceNo:"Inv. No.",comments:"Comments",btns:""},!0))}).insert({bottom:new Element("tbody").insert({bottom:n.me._getScanTableROW({qty:n.me._getFormGroup("",new Element("input",{"class":"form-control input-sm","scanned-item":"qty",type:"text",placeholder:"How many you received.",required:!0,value:1,validate_currency:"Invalid qty"}).observe("keyup",function(){n.serialNoBox=$(this).up(".scanned-item-row").down("[scanned-item=serialNo]"),$F(this)>1?n.serialNoBox.setValue("No S/N, as qty > 1").disabled=!0:n.serialNoBox.setValue("").disabled=!1}).observe("click",function(){$(this).select(),n.serialNoBox=$(this).up(".scanned-item-row").down("[scanned-item=serialNo]"),$F(this)>1?n.serialNoBox.setValue("No S/N, as qty > 1").disabled=!0:n.serialNoBox.setValue("").disabled=!1}).observe("keydown",function(e){n.qtyBox=$(this),n.serialNoBox=n.qtyBox.up(".scanned-item-row").down("[scanned-item=serialNo]"),n.unitPriceBox=n.qtyBox.up(".scanned-item-row").down("[scanned-item=unitPrice]"),n.me.keydown(e,function(){$F(n.qtyBox)>1?(n.serialNoBox.setValue("No S/N, as qty > 1").disabled=!0,n.unitPriceBox.focus(),n.unitPriceBox.select()):(n.serialNoBox.setValue("").disabled=!1,n.serialNoBox.focus(),n.serialNoBox.select())})})),serialNo:n.me._getFormGroup("",new Element("input",{"class":"form-control input-sm","scanned-item":"serialNo",type:"text",placeholder:"Serial Number:",required:!0})),unitPrice:n.me._getFormGroup("",new Element("input",{"class":"form-control input-sm","scanned-item":"unitPrice",type:"value",placeholder:"Unit Price:",validate_currency:"Invalid currency",value:e.purchaseOrderItem?n.me.getValueFromCurrency(n.me.getCurrency(e.purchaseOrderItem.unitPrice)):""})),invoiceNo:n.me._getFormGroup("",n.invoiceNoBox=new Element("input",{"class":"form-control","scanned-item":"invoiceNo",type:"text",placeholder:"Inv. No.:"})),comments:n.me._getFormGroup("",new Element("input",{"class":"form-control input-sm","scanned-item":"comments",type:"text",placeholder:"Comments:"})),btns:new Element("span",{"class":"btn-group btn-group-sm pull-right"}).insert({bottom:new Element("span",{"class":"scanned-item-save-btn btn btn-primary"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-floppy-saved"})}).observe("click",function(){n.currentRow=$(this).up(".scanned-item-row"),n.data=n.me._collectFormData(n.currentRow,"scanned-item"),null!==n.data&&(n.newRow=n.currentRow.clone(!0),n.newDeleteBtn=new Element("td").insert({bottom:new Element("span",{"class":"scanned-item-delte-btn btn btn-danger btn-xs pull-right"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(t){confirm("You are about to remove this entry.\n\nContinue?")&&($(this).up(".item_row").down(".product-head-row .scannedQty").innerHTML=1*$(this).up(".item_row").down(".product-head-row .scannedQty").innerHTML-1*n.data.qty,$(this).up(".item_row").down(".product-head-row .scannedQty").setStyle($(this).up(".item_row").down(".product-head-row .scannedQty").innerHTML>e.purchaseOrderItem.qty||!$(this).up(".item_row").down(".product-head-row .scannedQty").innerHTML?{color:"red"}:{color:"inherit"}),0==$(this).up(".item_row").down(".product-head-row .scannedQty").innerHTML&&$(this).up(".item_row").down(".product-head-row .scannedQty").setStyle({color:"red"}),$(this).up(".scanned-item-row").remove())})}),n.newRow.removeClassName("info").removeClassName("new-scan-row").addClassName("btn-hide-row"),n.newRow.down(".scanned-item-save-btn").remove(),n.newRow.down(".btns").replace(n.newDeleteBtn),n.newRow.down("input[scanned-item=qty]").disable(),n.newRow.down("input[scanned-item=serialNo]").disable(),n.newRow.down("input[scanned-item=unitPrice]").observe("click",function(){$(this).focus(),$(this).select()}).observe("keyup",function(){n.unitPriceBox=$(this),n.unitPriceBox.up(".scanned-item-row").hasClassName("new-scan-row")||n.me._updatetotalReceivedValue()}),n.currentRow.insert({after:n.newRow}),n.currentRow.down("input[scanned-item=comments]").clear(),n.currentRow.down("input[scanned-item=serialNo]").clear().disabled=!1,n.currentRow.down("input[scanned-item=qty]").value=1,n.currentRow.down("input[scanned-item=serialNo]").select(),$(this).up(".item_row").down(".scannedQty").innerHTML=1*this.up(".item_row").down(".scannedQty").innerHTML+1*n.data.qty,$(this).up(".item_row").down(".product-head-row .scannedQty").setStyle($(this).up(".item_row").down(".product-head-row .scannedQty").innerHTML>e.purchaseOrderItem.qty||!$(this).up(".item_row").down(".product-head-row .scannedQty").innerHTML?{color:"red"}:{color:"inherit"}),n.me._updatetotalReceivedValue())})}).insert({bottom:new Element("span",{"class":"scanned-item-delete-btn btn btn-default"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-floppy-remove"})}).observe("click",function(){confirm("You about to clear this entry. All input data for this entry will be lost.\n\nContinue?")&&(n.row=$(this).up(".scanned-item-row"),n.serialNoBox=n.row.down("input[scanned-item=serialNo]"),n.unitPriceBox=n.row.down("input[scanned-item=unitPrice]"),n.invoiceNoBox=n.row.down("input[scanned-item=invoiceNo]"),n.commentsBox=n.row.down("input[scanned-item=comments]"),n.serialNoBox.clear(),n.unitPriceBox.clear(),n.invoiceNoBox.clear(),n.commentsBox.clear(),n.serialNoBox.focus())})})}).addClassName("info")})}),n.me._forceInvNo&&n.invoiceNoBox.writeAttribute("required",!0),n.table},_searchProduct:function(e){var t={};return t.me=this,t.btn=e,t.me._signRandID(t.btn),t.searchTxtBox=$(t.btn).up(".product-autocomplete").down(".search-txt"),t.searchTxt=$F(t.searchTxtBox),t.searchTxt?(t.currentRow=$(e).up(".new-order-item-input"),t.product={name:"",id:"",qty:0,barcode:t.searchTxt},t.data={product:t.product,btns:new Element("span",{"class":"pull-right"}).insert({bottom:new Element("span",{"class":"btn btn-danger btn-xs"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(e){Event.stop(e),confirm("You are about to remove this entry.\n\nContinue?")&&(t.row=$(this).up(".item_row"),t.row.remove())})})},t.currentRow.insert({after:t.lastRow=t.me._getProductRow(t.data,!1)}),t.newRow=t.me._getNewProductRow(),t.currentRow.replace(t.newRow),t.newRow.down("[new-order-item=product]").focus(),t.inputBox=jQuery("#"+t.me._htmlIds.barcodeInput),t.me.postAjax(t.me.getCallbackId("searchProduct"),{searchTxt:t.searchTxt},{onLoading:function(){jQuery("#"+t.me._htmlIds.barcodeInput).button("loading")},onSuccess:function(e,n){t.resultList=new Element("div",{style:"overflow: auto; max-height: 400px;"});try{if(t.result=t.me.getResp(n,!1,!0),!t.result||!t.result.items||0===t.result.items.size())throw t.lastRow.down(".productSku").insert({bottom:new Element("strong",{"class":"text-danger"}).update("No Product Found!")}),t.lastRow.down(".productName").insert({top:new Element("span",{"class":""}).update("Barcode: ")}),"Nothing Found for: "+t.searchTxt;if(t.result.items.size()>1)return t.searchTxtBox=t.newRow.down(".search-txt"),t.resultList=new Element("div",{style:"overflow: auto; max-height: 400px;","class":"selectProductPanel"}),t.result.items.each(function(e){t.resultList.insert({bottom:t.me._getSearchPrductResultRow(e,t.searchTxtBox,t.lastRow,t.newRow)})}),t.resultList.addClassName("list-group"),t.me.showModalBox("Products that has: "+t.searchTxt,t.resultList,!1),t.me;t.data.product=t.result.items[0],t.me._selectProduct(t.data.product,t.lastRow,t.newRow)}catch(o){t.resultList.update(t.me.getAlertBox("Error: ",o).addClassName("alert-danger"))}},onComplete:function(e,n){jQuery("#"+t.me._htmlIds.barcodeInput).button("reset")}}),t.me):void 0},_selectProduct:function(e,t){var n={};return n.me=this,n.data=[],n.product=e,n.lastRow=t,n.btn=$("barcode_input"),n.me._signRandID(n.btn),n.data={product:n.product,btns:new Element("span",{"class":"pull-right"}).insert({bottom:new Element("span",{"class":"btn btn-danger btn-xs"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(e){Event.stop(e),confirm("You are about to remove this entry.\n\nContinue?")&&(n.row=$(this).up(".item_row"),n.row.remove())})}),qty:0},n.data.scanTable=n.me._getScanTable(n.data.product,n.data),n.lastRow.replace(n.newRow=n.me._getProductRow(n.data,!1)),n.me._checkProduct(n.product,n.newRow.down(".product-head-row")),n.newRow.down('[save-item="EANcode"]').select(),n.me._focusNext(n.newRow,"serialNo","unitPrice"),n.me._focusNext(n.newRow,"unitPrice","invoiceNo"),n.me._focusNext(n.newRow,"invoiceNo","comments"),n.serialNoBox=n.newRow.down("input[scanned-item=serialNo]"),n.serialNoBox&&(n.serialNoBox.observe("keydown",function(e){return n.me.keydown(e,function(){$F(n.serialNoBox).blank()||$F(n.unitPriceBox).blank()||$F(n.invoiceNoBox).blank()||n.newRow.down(".scanned-item-save-btn span").click()}),!1}),n.serialNoBox.up(".scanned-item-row").addClassName("new-scan-row")),n.unitPriceBox=n.newRow.down("input[scanned-item=unitPrice]"),n.unitPriceBox&&n.unitPriceBox.observe("keydown",function(e){return n.me.keydown(e,function(){$F(n.serialNoBox).blank()||$F(n.unitPriceBox).blank()||$F(n.invoiceNoBox).blank()||n.newRow.down(".scanned-item-save-btn span").click()}),!1}),n.invoiceNoBox=n.newRow.down("input[scanned-item=invoiceNo]"),n.invoiceNoBox&&n.invoiceNoBox.observe("keydown",function(e){return n.me.keydown(e,function(){$F(n.serialNoBox).blank()||$F(n.unitPriceBox).blank()||$F(n.invoiceNoBox).blank()||n.newRow.down(".scanned-item-save-btn span").click()}),!1}),n.commentsBox=n.newRow.down("input[scanned-item=comments]"),n.commentsBox&&n.commentsBox.observe("keydown",function(e){return n.me.keydown(e,function(){$F(n.serialNoBox).blank()||$F(n.unitPriceBox).blank()||$F(n.invoiceNoBox).blank()||n.newRow.down(".scanned-item-save-btn span").click()}),!1}),n.me._scanRowAutoSave(n.newRow),n.me},_scanRowAutoSave:function(e){var t={};return t.me=this,t.row=e,t.row.down('[scanned-item="comments"]')&&t.row.down('[scanned-item="comments"]').observe("keydown",function(e){return t.me.keydown(e,function(){t.row.down(".scanned-item-save-btn").click()}),!1}),t.me},_focusNext:function(e,t,n){var o={};return o.me=this,o.row=e,o.from=t,o.to=n,o.row.down('[scanned-item="'+o.from+'"]')&&o.row.down('[scanned-item="'+o.from+'"]').observe("keydown",function(e){return o.me.keydown(e,function(){o.row.down('[scanned-item="'+o.to+'"]').select()}),!1}),o.me},_checkProduct:function(e,t){var n={};n.me=pageJs,n.newRow=t,n.product=e,n.btn=$("barcode_input"),n.me._signRandID(n.btn),n.me.postAjax(n.me.getCallbackId("checkProduct"),{product:n.product,purchaseOrder:n.me._purchaseOrder},{onLoading:function(e,t){jQuery("#"+n.btn.id).button("loading")},onSuccess:function(e,t){try{n.result=n.me.getResp(t,!1,!0),0==n.result.count&&(n.newRow.down(".productSku").insert({bottom:new Element("strong",{style:"color:red"}).update("  (Not found in PO)")}),n.newRow.up(".item_row").addClassName("not-in-po"))}catch(o){n.me.showModalBox("Error!",o,!1)}},onComplete:function(e,t){jQuery("#"+n.btn.id).button("reset")}})},_canReceive:function(){var e={};return e.me=this,"RECEIVING"===e.me._purchaseOrder.status||"ORDERED"===e.me._purchaseOrder.status},_saveBtns:function(){var e={};return e.me=this,e.newDiv=new Element("span",{"class":"btn-group pull-right"}).insert({bottom:new Element("span",{"class":"btn btn-primary","data-loading-text":"saving..."}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok-circle"})}).insert({bottom:new Element("span").update(" save ")}).observe("click",function(){
e.me._submitOrder($(this))})}).insert({bottom:new Element("span",{"class":"btn btn-default"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-remove-sign"})}).insert({bottom:new Element("span").update(" cancel ")}).observe("click",function(){e.me.showModalBox('<strong class="text-danger">Cancelling this PO receiving</strong>','<div>You are about to cancel this receiving process, all input data will be lost.</div><br /><div>Continue?</div><div><span class="btn btn-primary" onclick="window.location = document.URL;"><span class="glyphicon glyphicon-ok"></span> YES</span><span class="btn btn-default pull-right" data-dismiss="modal"><span aria-hidden="true"><span class="glyphicon glyphicon-remove-sign"></span> NO</span></span></div>',!0)})}),e.newDiv},_getOutStandingOrderPanel:function(e){var t={};return t.me=this,t.newDiv=new Element("div").insert({bottom:new Element("div").update("There are outstanding orders that need these parts that you just recieved:")}).insert({bottom:new Element("table",{"class":"table table-hover table-condensed"}).insert({bottom:new Element("thead").insert({bottom:new Element("tr").insert({bottom:new Element("th").update("Product")}).insert({bottom:new Element("th").update("Received Qty")}).insert({bottom:new Element("th").update("Orders")})})}).insert({bottom:t.tbody=new Element("tbody")})}),e.each(function(e){t.orderRow=new Element("div",{"class":"row"}),e.outStandingOrders.each(function(e){t.orderRow.insert({bottom:new Element("div",{"class":"col-sm-3"}).insert({bottom:new Element("a",{href:"/orderdetails/"+e.id+".html",target:"_BLANK"}).update(e.orderNo)})})}),t.tbody.insert({bottom:new Element("tr").insert({bottom:new Element("td").update(e.product.sku)}).insert({bottom:new Element("td").update(e.recievedQty)}).insert({bottom:new Element("td").update(t.orderRow)})})}),t.newDiv},_submitOrder:function(e){var t={};return t.me=this,t.btn=e,t.data=t.me._collectFormData($(t.me._htmlIds.itemDiv),"save-order"),t.data.purchaseOrder=t.me._purchaseOrder,t.data.products={},t.data.products.matched=[],t.data.products.notMatched=[],$(t.me._htmlIds.partsTable).getElementsBySelector("div.item_row").each(function(e){e.hasClassName("new-order-item-input")||(""!==e.retrieve("data").id?(t.scanData=[],e.getElementsBySelector(".table.scanTable .scanned-item-row").each(function(e){e.hasClassName("new-scan-row")||t.scanData.push(t.me._collectFormData(e,"scanned-item"))}),t.data.products.matched.push({product:e.retrieve("data"),serial:t.scanData})):t.data.products.notMatched.push(e.retrieve("data")))}),null===t.data?t.me:t.data.products.matched.size()+t.data.products.notMatched.size()<=0?(t.me.showModalBox('<strong class="text-danger">Error</strong>',"At least one item is needed!",!0),t.me):(t.me._signRandID(t.btn),t.me.postAjax(t.me.getCallbackId("saveOrder"),t.data,{onLoading:function(e,n){jQuery("#"+t.btn.id).button("loading")},onSuccess:function(e,n){try{if(t.result=t.me.getResp(n,!1,!0),!t.result||!t.result.item||!t.result.outStandingOrders)return;t.newDiv=new Element("div").update("<strong>All items saved successfully! Bill(s) generated as following:</strong>").insert({bottom:t.billList=new Element("ul",{"class":"list-inline"})}),t.result.invoiceNos&&t.result.invoiceNos.size()>0&&t.result.invoiceNos.each(function(e){t.billList.insert({bottom:new Element("li").update(new Element("a",{"class":"btn btn-success",href:"/bills/"+t.result.item.supplier.id+".html&invoiceNo="+e,target:"_BLANK"}).update(e))})}),t.result.outStandingOrders.size()>0&&t.newDiv.insert({bottom:t.me._getOutStandingOrderPanel(t.result.outStandingOrders)}),t.me.showModalBox('<strong class="text-success">Success!</strong>',t.newDiv,!1,null,{"hide.bs.modal":function(){window.location=document.URL}}),t.me.refreshParentWindow(t.result.item)}catch(o){t.me.showModalBox("Error!",o,!1)}},onComplete:function(e,n){jQuery("#"+t.btn.id).button("reset")}}),t.me)},refreshParentWindow:function(e){var t={};t.me=this,window.opener&&(t.parentWindow=window.opener,t.row=$(t.parentWindow.document.body).down("#"+t.parentWindow.pageJs.resultDivId+" .item_row[item_id="+e.id+"]"),t.row&&t.row.replace(t.parentWindow.pageJs._getResultRow(e)))},_getSearchPrductResultRow:function(e,t,n,o){var s={};return s.me=this,s.lastRow=n,s.newRow=o,s.defaultImgSrc="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMzIiIHk9IjMyIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NjR4NjQ8L3RleHQ+PC9zdmc+",s.newRow=new Element("a",{"class":"list-group-item",href:"javascript: void(0);"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-2"}).insert({bottom:new Element("div",{"class":"thumbnail"}).insert({bottom:new Element("img",{"data-src":"holder.js/100%x64",alert:"Product Image",src:0===e.images.size()?s.defaultImgSrc:e.images[0].asset.url})})})}).insert({bottom:new Element("div",{"class":"col-xs-10"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("strong").update(e.name).insert({bottom:new Element("small",{"class":"",style:"padding-left: 10px;"}).update("SKU: "+e.sku)})}).insert({bottom:new Element("div").insert({bottom:new Element("small").update(e.shortDescription)})})})})}).observe("click",function(){s.inputRow=$(t).up(".new-order-item-input").store("product",e),s.me._selectProduct(e,s.lastRow,s.newRow),jQuery("#"+s.me.modalId).modal("hide"),$$('[scanned-item="serialNo"]').first().focus()}),s.newRow},init:function(e){var t={};t.me=this,e?t.me.selectPO(e):$(t.me._htmlIds.itemDiv).update(t.me._getPOListPanel()).down(".init-focus").focus()}});