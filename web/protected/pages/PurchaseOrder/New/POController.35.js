var POCreateJs=new Class.create;POCreateJs.prototype=Object.extend(new BPCPageJs,{_item:null,_searchTxtBox:null,_isCredit:!1,_purchaseOrderItems:[],setPaymentMethods:function(a){return this._paymentMethods=a,this},setShippingMethods:function(a){return this._shippingMethods=a,this},_getFormGroup:function(a,b){return new Element("div",{class:"form-group"}).insert({bottom:a?new Element("label",{class:"control-label"}).update(a):""}).insert({bottom:b.addClassName("form-control")})},_submitOrder:function(a){var b={};return b.me=this,b.loadingDiv=new Element("div",{class:"text-center",style:"margin-top: 100px;"}).insert({bottom:new Element("h4").update("Saving PO, please do NOT close the window")}).insert({bottom:new Element("span",{class:"fa fa-refresh fa-spin fa-5x"})}),b.me.postAjax(b.me.getCallbackId("saveOrder"),a,{onLoading:function(a,c){b.me.hideModalBox(),$(b.me.getHTMLID("itemDiv")).insert({after:b.loadingDiv}).hide()},onSuccess:function(a,c){try{if(b.result=b.me.getResp(c,!1,!0),!b.result||!b.result.item)return;b.me._item=b.result.item,b.me.refreshParentWindow(),b.newDiv=new Element("div").insert({bottom:new Element("h4").update("Yah! Saved Successfully.")}).insert({bottom:new Element("div").insert({bottom:new Element("span",{class:"btn btn-primary pull-right"}).update("Add Another PO").observe("click",function(){window.location=document.URL})}).insert({bottom:new Element("a",{class:"btn btn-info goto-details",href:"/purchase/"+b.result.item.id+".html"}).update("View the details")})}),b.me.showModalBox('<strong class="text-success">Success</strong>',b.newDiv,!1),jQuery("#"+b.me.modalId).on("hide.bs.modal",function(a){b.newDiv.down(".goto-details")&&b.newDiv.down(".goto-details").click()})}catch(a){b.me.showModalBox('<strong class="text-danger">Error:</strong>',a,!1),$(b.me.getHTMLID("itemDiv")).show(),b.loadingDiv.remove()}},onComplete:function(a,c){$(b.me.getHTMLID("itemDiv")).show(),b.loadingDiv.remove()}}),b.me},refreshParentWindow:function(){var a={};a.me=this,window.opener&&(a.parentWindow=window.opener,a.row=$(a.parentWindow.document.body).down("table#item-list tbody"),a.row&&(a.row=$(a.parentWindow.document.body).down("table#item-list tbody").insert({top:a.parentWindow.pageJs._getResultRow(a.me._item).addClassName("success")})))},_confirmSubmit:function(a){var b={};return b.me=this,b.submitData={},b.submitData.submitToSupplier=a===!0,b.data=b.me._collectFormData($(b.me.getHTMLID("itemDiv")),"save-order"),null===b.data?b.me:(b.submitData.items=[],$$(".order-item-row").each(function(a){b.item=a.retrieve("data"),b.item.totalPrice=b.item.totalPrice?b.me.getValueFromCurrency(b.item.totalPrice):"0",b.item.unitPrice=b.item.unitPrice?b.me.getValueFromCurrency(b.item.unitPrice):"0",b.submitData.items.push({productId:b.item.product.id,qtyOrdered:b.item.qtyOrdered,totalPrice:b.item.totalPrice,unitPrice:b.item.unitPrice,eta:b.item.eta})}),b.submitData.items.size()<=0?(b.me.showModalBox('<strong class="text-danger">Error</strong>',"At least one order item is needed!",!0),b.me):(b.submitData.supplier={},b.submitData.supplier.id=b.me._supplier.id,b.submitData.supplier.contactName=b.data.contactName?b.data.contactName:b.me._supplier.contactName,b.submitData.supplier.contactNo=b.data.contactNo?b.data.contactNo:b.me._supplier.contactNo,b.submitData.supplier.email=b.data.contactEmail?b.data.contactEmail:b.me._supplier.email,b.submitData.supplierRefNum=b.data.supplierRefNum,b.submitData.eta=b.data.ETA.strip(),b.submitData.comments=b.data.comments.strip(),b.submitData.shippingCost=b.data.shippingCost?b.me.getValueFromCurrency(b.data.shippingCost):0,b.submitData.handlingCost=b.data.handlingCost?b.me.getValueFromCurrency(b.data.handlingCost):0,b.submitData.totalPaymentDue=b.data.totalPaymentDue?b.me.getValueFromCurrency(b.data.totalPaymentDue):0,b.me._isCredit===!0&&(b.submitData.type="CREDIT",b.me._po&&jQuery.isNumeric(b.me._po.id)&&(b.submitData.po=b.me._po)),b.submitData.submitToSupplier===!0?(b.newDiv=new Element("div",{class:"confirm-div"}).insert({bottom:new Element("div").insert({bottom:b.me._getFormGroup("Do you want to send an email to this address:",new Element("input",{value:b.submitData.supplier.email,"confirm-po":"po_email",required:!0,placeholder:"The email to send to. WIll NOT update the supplier's email with this."}))})}).insert({bottom:new Element("div").insert({bottom:new Element("em").insert({bottom:new Element("small").update("The above email will be used to send the email to. WIll NOT update the supplier's email with this.")})})}).insert({bottom:new Element("div").insert({bottom:new Element("span",{class:"btn btn-primary pull-right"}).update("Yes, send the PO to this email address").observe("click",function(){return b.confirmEmailBox=$(this).up(".confirm-div").down('[confirm-po="po_email"]'),$F(b.confirmEmailBox).blank()?void b.me._markFormGroupError(b.confirmEmailBox,"Email Address Required Here"):/^.+@.+(\..)*$/.test($F(b.confirmEmailBox).strip())?(b.submitData.confirmEmail=$F(b.confirmEmailBox).strip(),void b.me._submitOrder(b.submitData)):void b.me._markFormGroupError(b.confirmEmailBox,"Please provide an valid email address")})}).insert({bottom:new Element("span",{class:"btn btn-info"}).update("No, push PO status but DO NOT send email").observe("click",function(){b.me._submitOrder(b.submitData)})})}),b.me.showModalBox('<strong class="text-info">Confirm</strong>',b.newDiv,!1)):b.me._submitOrder(b.submitData),b.me))},_saveBtns:function(){var a={};return a.me=this,a.newDiv=new Element("div").insert({bottom:new Element("span",{class:"btn btn-default"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-remove-sign"})}).insert({bottom:new Element("span").update(" cancel ")}).observe("click",function(){a.me.showModalBox('<strong class="text-danger">Cancelling the current order</strong>','<div>You are about to cancel this new order, all input data will be lost.</div><br /><div>Continue?</div><div><span class="btn btn-primary" onclick="window.location = document.URL;"><span class="glyphicon glyphicon-ok"></span> YES</span><span class="btn btn-default pull-right" data-dismiss="modal"><span aria-hidden="true"><span class="glyphicon glyphicon-remove-sign"></span> NO</span></span></div>',!0)})}).insert({bottom:new Element("span",{class:"btn-group pull-right visible-xs visible-sm visible-md visible-lg"}).insert({bottom:new Element("span",{class:"btn btn-primary"}).insert({bottom:new Element("span").update("save & submit")}).observe("click",function(){a.me._confirmSubmit(!0)})}).insert({bottom:new Element("span",{class:"btn btn-primary dropdown-toggle","data-toggle":"dropdown"}).insert({bottom:new Element("span",{class:"caret"})})}).insert({bottom:new Element("ul",{class:"dropdown-menu save-btn-dropdown-menu"}).insert({bottom:new Element("li").insert({bottom:new Element("a",{href:"javascript: void(0);"}).update("Save Only").observe("click",function(){a.me._confirmSubmit()})})})})}),a.newDiv},_getSupplierInfoPanel:function(){var a={};return a.me=this,a.supplier=a.me._supplier,a.newDiv=new Element("div",{class:"panel"}).addClassName(a.me._isCredit===!0?"panel-danger":"panel-info").insert({bottom:new Element("div",{class:"panel-heading"}).insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-sm-4"}).insert({bottom:new Element("strong",{class:"creatingFor"}).update("Creating "+(a.me._ifCredit===!0?"PO Credit":"PO")+" for: "+a.supplier.name+" ")}).insert({bottom:new Element("strong",{class:"creatingFor"}).update(a.me._po&&jQuery.isNumeric(a.me._po.id)?' for Purchase Order <a target="_blank" href="/purchase/'+a.me._po.id+'">'+a.me._po.purchaseOrderNo+"</a>":"")})}).insert({bottom:new Element("div",{class:"col-sm-8 text-right"}).insert({bottom:new Element("div",{class:"col-sm-8 text-right"}).insert({bottom:new Element("span").insert({bottom:new Element("strong",{style:"padding-left: 10px"}).update("ETA: ")}).insert({bottom:new Element("input",{style:"max-height:19px",class:"datepicker","save-order":"ETA",value:""})})})}).insert({bottom:new Element("div",{class:"col-sm-4"}).insert({bottom:new Element("strong").update("Total Due Inc GST: ")}).insert({bottom:new Element("span",{class:"badge total-payment-due"}).update(a.me.getCurrency(0))}).insert({bottom:new Element("input",{type:"hidden",class:"total-payment-due","save-order":"totalPaymentDue",value:a.me.getCurrency(0)})})})})})}).insert({bottom:new Element("div",{class:"panel-body"}).insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-sm-3"}).update(a.me._getFormGroup("Contact Name",new Element("input",{"save-order":"contactName",placeholder:"The name of the contact person",type:"text",value:a.supplier.contactName?a.supplier.contactName:""})))}).insert({bottom:new Element("div",{class:"col-sm-3"}).update(a.me._getFormGroup("Contact Number",new Element("input",{"save-order":"contactNo",placeholder:"The contact number of the sales person",value:a.supplier.contactNo?a.supplier.contactNo:""})))}).insert({bottom:new Element("div",{class:"col-sm-3"}).update(a.me._getFormGroup("Contact Email",new Element("input",{"save-order":"contactEmail",placeholder:"The email of the supplier",type:"email",value:a.supplier.email?a.supplier.email:""})))}).insert({bottom:new Element("div",{class:"col-sm-3"}).update(a.me._getFormGroup("PO Ref Num",new Element("input",{required:"required",placeholder:"The supplier invoice number / PO reference number","save-order":"supplierRefNum",type:"text",value:""})))})})}),a.newDiv},_loadDataPicker:function(){var a={};return a.me=this,$$(".datepicker").each(function(b){b.hasClassName("datepicked")||(a.me._signRandID(b),a.picker=new Prado.WebUI.TDatePicker({ID:b.id,InputMode:"TextBox",Format:"yyyy-MM-dd",FirstDayOfWeek:1,CalendarStyle:"default",FromYear:2009,UpToYear:2024,PositionMode:"Bottom",ClassName:"datepicker-layer-fixer"}),b.store("picker",a.picker))}),a.me},_getProductRow:function(a,b){var c={};return c.me=this,c.isTitle=b||!1,c.tag=c.isTitle===!0?"th":"td",c.row=new Element("tr",{class:c.isTitle===!0?"":"item_row order-item-row"}).store("data",a).insert({bottom:new Element(c.tag,{class:"productName"}).insert({bottom:a.product.name})}).insert({bottom:new Element(c.tag,{class:"uprice col-xs-1"}).insert({bottom:a.unitPrice}).observe("keydown",function(a){return c.txtBox=this,c.me.keydown(a,function(){$(c.txtBox).up(".item_row").down(".tprice input").value=c.me.getCurrency($(c.txtBox).down("input").value),$(c.txtBox).up(".item_row").down(".glyphicon.glyphicon-floppy-saved").click()}),!1})}).insert({bottom:new Element(c.tag,{class:"qty col-xs-1"}).insert({bottom:a.qtyOrdered}).observe("keydown",function(a){return c.txtBox=this,c.me.keydown(a,function(){$(c.txtBox).up(".item_row").down(".glyphicon.glyphicon-floppy-saved").click()}),!1})}).insert({bottom:new Element(c.tag,{class:"tprice col-xs-1"}).insert({bottom:a.totalPrice}).observe("keydown",function(a){return c.txtBox=this,c.me.keydown(a,function(){$(c.txtBox).up(".item_row").down(".glyphicon.glyphicon-floppy-saved").click()}),!1})}).insert({bottom:new Element(c.tag,{class:"eta col-xs-1"}).insert({bottom:a.eta}).observe("keydown",function(a){return c.txtBox=this,c.me.keydown(a,function(){$(c.txtBox).up(".item_row").down(".glyphicon.glyphicon-floppy-saved").click()}),!1})}).insert({bottom:new Element(c.tag,{class:"btns  col-xs-1"}).update(a.btns?a.btns:"")}),a.product.sku?c.row.insert({top:new Element(c.tag,{class:"productSku"}).update(a.product.sku)}):c.row.down(".productName").writeAttribute("colspan",2),c.row},_getSearchPrductResultRow:function(a,b){var c={};return c.me=this,c.defaultImgSrc="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMzIiIHk9IjMyIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NjR4NjQ8L3RleHQ+PC9zdmc+",c.newRow=new Element("a",{class:"list-group-item search-product-result-row",href:"javascript: void(0);"}).store("data",a).insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-xs-2"}).insert({bottom:new Element("div",{class:"thumbnail"}).insert({bottom:new Element("img",{"data-src":"holder.js/100%x64",alert:"Product Image",src:0===a.images.size()?c.defaultImgSrc:a.images[0].asset.url})})})}).insert({bottom:new Element("div",{class:"col-xs-10"}).insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("strong").update(a.name).insert({bottom:new Element("small",{class:"",style:"padding-left: 10px;"}).update("SKU: "+a.sku)})}).insert({bottom:new Element("small",{class:"btn btn-xs btn-info"}).insert({bottom:new Element("small",{class:"glyphicon glyphicon-new-window"})}).observe("click",function(a){Event.stop(a),$productId=$(this).up(".search-product-result-row").retrieve("data").id,$productId&&c.me._openProductDetailPage($productId)})}).insert({bottom:new Element("div").insert({bottom:new Element("small").update(a.shortDescription)})})}).insert({bottom:new Element("div",{class:"row",style:a.minProductPrice||a.lastSupplierPrice||a.minSupplierPrice?"height: 2px; background-color: brown;":"display:none"}).update("&nbsp;")}).insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("span",{class:"btn btn-link btn-xs",style:a.minProductPrice?"text-align: left":"display:none"}).update("Product Min: ").insert({bottom:new Element("strong").update(c.me.getCurrency(a.minProductPrice))}).writeAttribute("title","double click to open").observe("click",function(a){Event.stop(a)}).observe("dblclick",function(b){Event.stop(b),c.me._openPOPage(a.minProductPriceId)})}).insert({bottom:new Element("span",{class:"btn btn-link btn-xs",style:a.minSupplierPrice?"text-align: left":"display:none"}).update("Supplier Min: ").insert({bottom:new Element("strong").update(c.me.getCurrency(a.minSupplierPrice))}).writeAttribute("title","double click to open").observe("click",function(a){Event.stop(a)}).observe("dblclick",function(b){Event.stop(b),c.me._openPOPage(a.minSupplierPriceId)})}).insert({bottom:new Element("span",{class:"btn btn-link btn-xs",style:a.lastSupplierPrice?"text-align: left":"display:none"}).update("Supplier Last: ").insert({bottom:new Element("strong").update(c.me.getCurrency(a.lastSupplierPrice))}).writeAttribute("title","double click to open").observe("click",function(a){Event.stop(a)}).observe("dblclick",function(b){Event.stop(b),c.me._openPOPage(a.lastSupplierPriceId)})}).insert({bottom:new Element("span",{class:"btn btn-xs pull-right",title:"Stock on Hand"}).setStyle("text-align: left;").update("SoH: ").insert({bottom:new Element("strong").update(a.stockOnHand)})}).insert({bottom:new Element("span",{class:"btn btn-xs pull-right",title:"Stock on PO"}).setStyle("text-align: left;").update("SoPO: ").insert({bottom:new Element("strong").update(a.stockOnPO)})})})})}).observe("click",function(){c.inputRow=$(b).up(".new-order-item-input").store("product",a),b.up(".productName").writeAttribute("colspan",!1).update(a.sku).insert({bottom:new Element("small",{class:"btn btn-xs btn-info"}).insert({bottom:new Element("small",{class:"glyphicon glyphicon-new-window"})}).observe("click",function(b){Event.stop(b),$productId=a.id,$productId&&c.me._openProductDetailPage($productId)})}).insert({after:new Element("td").update(a.name).insert({bottom:new Element("a",{href:"javascript: void(0);",class:"text-danger pull-right",title:"click to change the product"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-remove"})}).observe("click",function(){c.newRow=c.me._getNewProductRow(),$(this).up(".new-order-item-input").replace(c.newRow),c.newRow.down("[new-order-item=product]").select()})})}),jQuery("#"+c.me.modalId).modal("hide"),c.inputRow.down("[new-order-item=totalPrice]").writeAttribute("value",c.me.getCurrency(a.minProductPrice)),c.inputRow.down("[new-order-item=qtyOrdered]").writeAttribute("value",1),c.inputRow.down("[new-order-item=unitPrice]").writeAttribute("value",c.me.getCurrency(a.minProductPrice)).select()}),c.newRow},_openPOPage:function(a){var b={};return b.me=this,b.newWindow=window.open("/purchase/"+a+".html","Product Details","width=1300, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no"),b.newWindow.focus(),b.me},_openNewProductPage:function(a){var b={};return b.me=this,b.newWindow=window.open("/product/new.html?btnidnewpo="+a,"New Product Page","width=1300, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no"),b.newWindow.onload=function(){b.newWindow.document.title="New Product Page",b.newWindow.focus()},b.me},_searchProduct:function(a,b,c){var d={};return d.me=this,d.btn=a,d.showMore=$(a).retrieve("showMore")===!0,d.pageNo=b||1,d.me._signRandID(d.btn),d.searchTxtBox=$(d.btn).up(".product-autocomplete")&&$(d.btn).up(".product-autocomplete").down(".search-txt")?$(d.btn).up(".product-autocomplete").down(".search-txt"):$($(d.btn).retrieve("searchBoxId")),d.searchTxt=$F(d.searchTxtBox),d.me.postAjax(d.me.getCallbackId("searchProduct"),{searchTxt:d.searchTxt,supplierID:d.me._supplier.id,pageNo:d.pageNo},{onLoading:function(){jQuery("#"+d.btn.id).button("loading")},onSuccess:function(b,e){d.showMore===!1?d.resultList=new Element("div",{class:"search-product-list"}):d.resultList=$(a).up(".search-product-list");try{if(d.result=d.me.getResp(e,!1,!0),!d.result||!d.result.items||0===d.result.items.size())throw new Element("span").insert({bottom:new Element("span").update("Nothing Found for: "+d.searchTxt)}).insert({bottom:1!=jQuery("#storeId").attr("value")?"":new Element("span",{class:"btn btn-success btn-xs pull-right"}).insert({bottom:new Element("i",{class:"fa fa-plus",title:"add new product"})}).observe("click",function(a){d.newProductBtn=$(this),d.me._signRandID(d.newProductBtn),d.me._openNewProductPage(d.newProductBtn.id)})});d.me._signRandID(d.searchTxtBox),d.me._searchTxtBox=d.searchTxtBox,d.result.items.each(function(a){d.resultList.insert({bottom:d.me._getSearchPrductResultRow(a,d.searchTxtBox)})}),"function"==typeof c&&c(),d.result.pagination.pageNumber<d.result.pagination.totalPages&&d.resultList.insert({bottom:new Element("a",{class:"item-group-item"}).insert({bottom:new Element("span",{class:"btn btn-primary","data-loading-text":"Getting more ..."}).update("Show Me More")}).observe("click",function(){d.newBtn=$(this),$(d.newBtn).store("searchBoxId",d.searchTxtBox.id),$(d.newBtn).store("showMore",!0),d.me._searchProduct(this,1*d.pageNo+1,function(){$(d.newBtn).remove()})})}),d.resultList.addClassName("list-group")}catch(a){d.resultList.update(d.me.getAlertBox("Error: ",a).addClassName("alert-danger"))}d.showMore===!1&&d.me.showModalBox("Products that has: "+d.searchTxt,d.resultList,!1)},onComplete:function(a,b){jQuery("#"+d.btn.id).button("reset")}}),d.me},_openProductDetailPage:function(a){var b={};return b.me=this,b.newWindow=window.open("/products/"+a+".html","Product Details","width=1920, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no"),b.newWindow.focus(),b.me},_getNewProductProductAutoComplete:function(){var a={};return a.me=this,a.skuAutoComplete=a.me._getFormGroup(null,new Element("div",{class:"input-group input-group-sm product-autocomplete"}).insert({bottom:new Element("input",{class:"form-control search-txt visible-xs visible-sm visible-md visible-lg","new-order-item":"product",required:"Required!",placeholder:"search SKU, NAME and any BARCODE for this product"}).observe("keydown",function(b){return a.txtBox=this,a.me.keydown(b,function(){$(a.txtBox).up(".product-autocomplete").down(".search-btn").click()}),a.me.keydown(b,function(){$(a.txtBox).up(".product-autocomplete").down(".search-btn").click()},null,9),!1}).observe("click",function(){$(this).select()})}).insert({bottom:new Element("span",{class:"input-group-btn"}).insert({bottom:new Element("span",{class:" btn btn-primary search-btn","data-loading-text":"searching..."}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-search"})}).observe("click",function(){a.me._searchProduct(this)})})})),a.skuAutoComplete.down(".input-group").removeClassName("form-control"),a.skuAutoComplete},_recalculateSummary:function(){var a={};return a.me=this,a.totalExGSTPrice=0,$$(".item_row.order-item-row").each(function(b){a.rowData=b.retrieve("data"),a.totalExGSTPrice=1*a.totalExGSTPrice+1*a.me.getValueFromCurrency(a.rowData.totalPrice)}),jQuery('[save-order-summary="totalExGST"]').val(a.me.getCurrency(a.totalExGSTPrice)).html(a.me.getCurrency(a.totalExGSTPrice)),a.totalGST=.1*a.totalExGSTPrice,jQuery('[save-order-summary="totalGST"]').val(a.me.getCurrency(a.totalGST)).html(a.me.getCurrency(a.totalGST)),a.totalIncGSTPrice=1*a.totalExGSTPrice+1*a.totalGST,jQuery('[save-order-summary="totalInGST"]').val(a.me.getCurrency(a.totalIncGSTPrice)).html(a.me.getCurrency(a.totalIncGSTPrice)),a.shippingCost=0,jQuery('[save-order-summary="shippingCost"]').length>0&&(a.shippingCost=a.me.getValueFromCurrency(jQuery('[save-order-summary="shippingCost"]').val())),a.handlingCost=0,jQuery('[save-order-summary="handlingCost"]').length>0&&(a.handlingCost=a.me.getValueFromCurrency(jQuery('[save-order-summary="handlingCost"]').val())),a.totalDue=1*a.totalIncGSTPrice+1*a.shippingCost+1*a.handlingCost,jQuery(".total-payment-due").val(a.me.getCurrency(a.totalDue)).html(a.me.getCurrency(a.totalDue)),a.me},_addNewProductRow:function(a,b){var c={};return c.me=this,c.currentRow=$(a).up(".new-order-item-input"),c.product="undefined"==typeof b?c.currentRow.retrieve("product"):b.product,c.product?(c.unitPriceBox=c.currentRow.down("[new-order-item=unitPrice]"),c.unitPrice="undefined"==typeof b?c.me.getValueFromCurrency($F(c.unitPriceBox)):b.unitPrice,jQuery.isNumeric(c.unitPrice)||null!==c.unitPrice.match(/^\d+(\.\d{1,2})?$/)?(c.qtyOrderedBox=c.currentRow.down("[new-order-item=qtyOrdered]"),c.qtyOrdered="undefined"==typeof b?c.me.getValueFromCurrency($F(c.qtyOrderedBox)):b.qty,null===c.qtyOrdered.match(/^(-)?\d+(\.\d{1,2})?$/)?void c.me._markFormGroupError(c.qtyOrderedBox,"Invalid value provided!"):(c.totalPrice=c.me.getValueFromCurrency(c.unitPrice)*c.qtyOrdered,c.etaBox=c.currentRow.down("[new-order-item=eta]"),c.eta="undefined"==typeof b?$F(c.etaBox):b.eta,""===c.eta?void c.me._markFormGroupError(c.etaBox,"Invalid value provided!"):(c.currentRow.getElementsBySelector(".form-group.has-error .form-control").each(function(a){$(a).retrieve("clearErrFunc")()}),c.data={id:b&&b.id?b.id:"",product:c.product,unitPrice:c.me.getCurrency(c.unitPrice),qtyOrdered:c.qtyOrdered,totalPrice:c.me.getCurrency(c.totalPrice),eta:c.eta,btns:new Element("span",{class:"pull-right"}).insert({bottom:new Element("span",{class:"btn btn-danger btn-xs"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-trash"})}).observe("click",function(){confirm("You remove this entry.\n\nContinue?")&&(c.row=$(this).up(".item_row"),c.me._recalculateSummary(),c.row.remove())})})},c.currentRow.insert({after:c.productRow=c.me._getProductRow(c.data).addClassName("btn-hide-row")}),c.me.setProductLink(c.productRow.down(".productSku"),c.product.id),c.newRow=c.me._getNewProductRow(),c.currentRow.replace(c.newRow),c.newRow.down("[new-order-item=product]").focus(),c.newRow.down("[new-order-item=product]").select(),c.me._recalculateSummary(c.totalPrice),c.me))):void c.me._markFormGroupError(c.unitPriceBox,"Invalid value provided!")):(c.productBox=c.currentRow.down("[new-order-item=product]"),void(c.currentRow.down("[new-order-item=product]")?c.me._markFormGroupError(c.productBox,"Select a product first!"):c.me.showModalBox("Product Needed","Select a product first!",!0)))},setProductLink:function(a,b){var c={};c.me=this,$(a).setStyle("text-decoration: underline; cursor: pointer;").writeAttribute("title","double click to open").observe("click",function(a){Event.stop(a)}).observe("dblclick",function(a){Event.stop(a),c.window=window.open("/product/"+b+".html","_blank"),c.window.focus()})},_getNewProductRow:function(){var a={};return a.me=this,a.skuAutoComplete=a.me._getNewProductProductAutoComplete(),a.data={product:{name:a.skuAutoComplete},unitPrice:a.me._getFormGroup(null,new Element("input",{class:"input-sm","new-order-item":"unitPrice",required:"Required!",value:a.me.getCurrency(0)}).observe("keyup",function(){a.row=$(this).up(".item_row"),a.unitPrice=a.me.getValueFromCurrency($F(this)),a.qty=$F(a.row.down("[new-order-item=qtyOrdered]")),$(a.row.down("[new-order-item=totalPrice]")).value=a.me.getCurrency(a.unitPrice*a.qty)}).observe("click",function(a){$(this).select()})),qtyOrdered:a.me._getFormGroup(null,new Element("input",{class:"input-sm",type:"number","new-order-item":"qtyOrdered",required:"Required!",value:"1"}).observe("keyup",function(){a.row=$(this).up(".item_row"),a.unitPrice=a.me.getValueFromCurrency($F(a.row.down("[new-order-item=unitPrice]"))),a.qty=$F(this),$(a.row.down("[new-order-item=totalPrice]")).value=a.me.getCurrency(a.unitPrice*a.qty)}).observe("click",function(a){$(this).select()})),totalPrice:a.me._getFormGroup(null,new Element("input",{class:"input-sm",disabled:!0,"new-order-item":"totalPrice",required:"Required!",value:a.me.getCurrency(0)}).observe("keyup",function(){a.row=$(this).up(".item_row"),a.totalPrice=a.me.getValueFromCurrency($F(this)),a.qty=$F(a.row.down("[new-order-item=qtyOrdered]")),$(a.row.down("[new-order-item=unitPrice]")).value=a.me.getCurrency(a.totalPrice/a.qty)}).observe("click",function(a){$(this).select()})),eta:a.me._getFormGroup(null,new Element("input",{id:"eta",class:"datepicker input-sm","new-order-item":"eta","save-order":"ETA",value:""}).observe("keyup",function(){a.row=$(this).up(".item_row"),a.eta=$F(this)}).observe("click",function(a){$(this).select()})),btns:new Element("span",{class:"btn-group btn-group-sm pull-right new-order-item-btn"}).insert({bottom:new Element("span",{class:"btn btn-primary"}).insert({bottom:new Element("span",{class:" glyphicon glyphicon-floppy-saved"})}).observe("click",function(){a.me._addNewProductRow(this),a.me._loadDataPicker()})}).insert({bottom:new Element("span",{class:"btn btn-default"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-floppy-remove"})}).observe("click",function(){confirm("You about to clear this entry. All input data for this entry will be lost.\n\nContinue?")&&(a.newRow=a.me._getNewProductRow(),a.currentRow=$(this).up(".new-order-item-input"),a.currentRow.getElementsBySelector(".form-group.has-error .form-control").each(function(a){$(a).retrieve("clearErrFunc")()}),a.currentRow.replace(a.newRow),a.newRow.down("[new-order-item=product]").focus(),a.newRow.down("[new-order-item=product]").select())})})},a.me._getProductRow(a.data,!1).addClassName("new-order-item-input").addClassName(a.me._isCredit===!0?"danger":"info").removeClassName("order-item-row")},_getPartsTable:function(){var a={};return a.me=this,a.productListDiv=new Element("table",{class:"table table-hover table-condensed order_change_details_table"}).insert({bottom:a.me._getProductRow({product:{sku:"SKU",name:"Description"},unitPrice:"Unit Price (Ex GST)",qtyOrdered:"Qty",totalPrice:"Total Price (Ex GST)",eta:"ETA"},!0).wrap(new Element("thead"))}),a.productListDiv.insert({bottom:a.tbody=new Element("tbody",{style:"border: 3px #ccc solid;"}).insert({bottom:a.me._getNewProductRow()})}),a.productListDiv.insert({bottom:a.tbody=new Element("tfoot").insert({bottom:new Element("tr").insert({bottom:new Element("td",{colspan:2,rowspan:6}).insert({bottom:a.me._getFormGroup("Comments:",new Element("textarea",{"save-order":"comments",rows:8}))})}).insert({bottom:new Element("td",{colspan:2,class:"text-right active"}).update(new Element("span").update("Total Excl. GST: "))}).insert({bottom:new Element("td",{"save-order-summary":"totalExGST",class:"active"}).update(a.me.getCurrency(0))})}).insert({bottom:new Element("tr").insert({bottom:new Element("td",{colspan:2,class:"text-right active",style:"border-bottom: 1px solid brown"}).update(new Element("span").update("Total GST: "))}).insert({bottom:new Element("td",{"save-order-summary":"totalGST",class:"active",style:"border-bottom: 1px solid brown"}).update(a.me.getCurrency(0))})}).insert({bottom:new Element("tr").insert({bottom:new Element("td",{colspan:2,class:"text-right active"}).update(new Element("strong").update("SubTotal Incl. GST: "))}).insert({bottom:new Element("td",{"save-order-summary":"totalInGST",class:"active"}).update(a.me.getCurrency(0))})}).insert({bottom:new Element("tr").insert({bottom:new Element("td",{colspan:2,class:"text-right active"}).update(new Element("span").update("Shipping Cost Incl. GST: "))}).insert({bottom:new Element("td",{class:"active"}).update(new Element("input",{"save-order":"shippingCost","save-order-summary":"shippingCost",placeholder:a.me.getCurrency(0)}).observe("change",function(){a.me._recalculateSummary()}))})}).insert({bottom:new Element("tr").insert({bottom:new Element("td",{colspan:2,class:"text-right active",style:"border-bottom: 1px solid brown"}).update(new Element("span").update("Handling Cost  Incl. GST: "))}).insert({bottom:new Element("td",{class:"active",style:"border-bottom: 1px solid brown"}).update(new Element("input",{"save-order":"handlingCost","save-order-summary":"handlingCost",placeholder:a.me.getCurrency(0)}).observe("change",function(){a.me._recalculateSummary()}))})}).insert({bottom:new Element("tr").insert({bottom:new Element("td",{colspan:2,class:"text-right active"}).update(new Element("h4").update("Total Due Inc GST: "))}).insert({bottom:new Element("td",{class:"active"}).update(new Element("h4",{"save-order-summary":"totalPaymentDue",class:"total-payment-due"}).update(a.me.getCurrency(0)))})})}),new Element("div",{class:"panel"}).addClassName(a.me._isCredit===!0?"panel-danger":"panel-info").insert({bottom:new Element("div",{class:"panel-body table-responsive"}).insert({bottom:a.productListDiv})})},_getViewOfPurchaseOrder:function(){var a={};return a.me=this,a.newDiv=new Element("div").insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-sm-12"}).update(a.me._getSupplierInfoPanel())})}).insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-sm-12"}).update(a.me._getPartsTable())})}).insert({bottom:new Element("div",{class:"row"}).insert({bottom:new Element("div",{class:"col-sm-12"}).update(a.me._saveBtns())})}),a.newDiv},selectSupplier:function(a){var b={};return b.me=this,b.me._supplier=a,b.newDiv=b.me._getViewOfPurchaseOrder(),$(b.me.getHTMLID("itemDiv")).update(b.newDiv),b.newDiv.down('input[save-order="contactName"]').focus(),b.newDiv.down('input[save-order="contactName"]').select(),b.me._loadDataPicker(),b.me},_getSupplierRow:function(a,b){var c={};return c.me=this,c.isTitle=b||!1,c.tag=c.isTitle===!0?"th":"td",c.newDiv=new Element("tr",{class:(c.isTitle===!0?"item_top_row":"btn-hide-row item_row")+(0==a.active?" danger":""),item_id:c.isTitle===!0?"":a.id}).store("data",a).insert({bottom:new Element(c.tag).insert({bottom:c.isTitle===!0?"&nbsp;":new Element("span",{class:"btn btn-primary btn-xs"}).update("select").observe("click",function(){c.me.selectSupplier(a)})})}).insert({bottom:new Element(c.tag).update(a.name)}).insert({bottom:new Element(c.tag).update(a.contactName)}).insert({bottom:new Element(c.tag).update(a.contactNo)}).insert({bottom:new Element(c.tag).update(a.description)}).insert({bottom:new Element(c.tag).insert({bottom:c.isTitle===!0?a.active:new Element("input",{type:"checkbox",disabled:!0,checked:a.active})})}),c.newDiv},_searchSupplier:function(a){var b={};return b.me=this,b.searchTxt=$F(a).strip(),b.searchPanel=$(a).up("#"+b.me.getHTMLID("searchPanel")),b.me.postAjax(b.me.getCallbackId("searchSupplier"),{searchTxt:b.searchTxt},{onLoading:function(){$(b.searchPanel).down(".list-div")&&$(b.searchPanel).down(".list-div").remove(),
$(b.searchPanel).insert({bottom:new Element("div",{class:"panel-body"}).update(b.me.getLoadingImg())})},onSuccess:function(a,c){$(b.searchPanel).down(".panel-body").remove();try{if(b.result=b.me.getResp(c,!1,!0),!b.result||!b.result.items)return;$(b.searchPanel).insert({bottom:new Element("small",{class:"table-responsive list-div"}).insert({bottom:new Element("table",{class:"table table-hover table-condensed"}).insert({bottom:new Element("thead").insert({bottom:b.me._getSupplierRow({name:"Supplier Name",contactName:"Contact Name",contactNo:"Contact Number",description:"Description",active:"Active?"},!0)})}).insert({bottom:b.listDiv=new Element("tbody")})})}),b.result.items.each(function(a){b.listDiv.insert({bottom:b.me._getSupplierRow(a)})})}catch(a){$(b.searchPanel).insert({bottom:new Element("div",{class:"panel-body"}).update(b.me.getAlertBox("ERROR",a).addClassName("alert-danger"))})}}}),b.me},_getSupplierListPanel:function(){var a={};return a.me=this,a.newDiv=new Element("div",{id:a.me.getHTMLID("searchPanel"),class:"panel search-panel"}).addClassName(a.me._isCredit===!0?"panel-danger":"panel-info").insert({bottom:new Element("div",{class:"panel-heading form-inline"}).insert({bottom:new Element("strong").update("Creating a new order for: ")}).insert({bottom:new Element("span",{class:"input-group col-sm-6"}).insert({bottom:new Element("input",{class:"form-control search-txt init-focus",placeholder:"Supplier name"}).observe("keydown",function(b){return a.txtBox=this,a.me.keydown(b,function(){void 0!=a.txtBox.up("#"+a.me.getHTMLID("searchPanel")).down(".item_row")&&1===a.txtBox.up("#"+a.me.getHTMLID("searchPanel")).down("tbody").getElementsBySelector(".item_row").length?a.txtBox.up("#"+a.me.getHTMLID("searchPanel")).down("tbody .item_row .btn").click():$(a.me.getHTMLID("searchPanel")).down(".search-btn").click()}),a.me.keydown(b,function(){void 0!=a.txtBox.up("#"+a.me.getHTMLID("searchPanel")).down(".item_row")&&1===a.txtBox.up("#"+a.me.getHTMLID("searchPanel")).down("tbody").getElementsBySelector(".item_row").length?a.txtBox.up("#"+a.me.getHTMLID("searchPanel")).down("tbody .item_row .btn").click():$(a.me.getHTMLID("searchPanel")).down(".search-btn").click()},null,9),!1})}).insert({bottom:new Element("span",{class:"input-group-btn search-btn"}).insert({bottom:new Element("span",{class:" btn btn-primary"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-search"})})}).observe("click",function(){a.btn=this,a.txtBox=$(a.me.getHTMLID("searchPanel")).down(".search-txt"),$F(a.txtBox).blank()?$(a.me.getHTMLID("searchPanel")).down(".table tbody")&&($(a.me.getHTMLID("searchPanel")).down(".table tbody").innerHTML=null):a.me._searchSupplier(a.txtBox)})})}).insert({bottom:new Element("span",{class:"btn btn-success pull-right btn-sm"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-plus"})}).insert({bottom:" ADD"}).observe("click",function(){jQuery.fancybox({width:"95%",height:"95%",autoScale:!1,autoDimensions:!1,fitToView:!1,autoSize:!1,type:"iframe",href:"/supplier/new.html?blanklayout=1",beforeClose:function(){a.supplier=$$("iframe.fancybox-iframe").first().contentWindow.pageJs._item,a.supplier.id&&a.me.selectSupplier(a.supplier)}})})})}),a.newDiv},init:function(a){var b={};return b.me=this,a?b.me.selectSupplier(a):$(b.me.getHTMLID("itemDiv")).update(b.me._getSupplierListPanel()),$$(".init-focus").size()>0&&$$(".init-focus").first().focus(),b.me}});