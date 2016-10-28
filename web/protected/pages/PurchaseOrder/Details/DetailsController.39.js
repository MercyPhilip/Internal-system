var PageJs=new Class.create;
PageJs.prototype=Object.extend(new DetailsPageJs,{_supplier:null,_purchaseorder:{},_newDiv:null,setPreData:function(a){this._purchaseorder=a;this._supplier=a.supplier;return this},setStatusOptions:function(a){this._statusOptions=a;return this},setComment:function(a){this._comments=a;return this},setPurchaseOrderItems:function(a){this._purchaseOrderItems=a;return this},_getCommentsRow:function(a,b){return(new Element("tr",{"class":b?"comments_row header":"comments_row"})).store("data",a).insert({bottom:(new Element("td",
{"class":"created",width:"15%"})).update((new Element("small")).update(b?"Created":a.created))}).insert({bottom:(new Element("td",{"class":"creator",width:"15%"})).update((new Element("small")).update(b?"Who":a.createdBy.person.fullname))}).insert({bottom:(new Element("td",{"class":"type",width:"10%"})).update((new Element("small")).update(b?"Type":a.type))}).insert({bottom:(new Element("td",{"class":"comments",width:"auto"})).update(b?"":a.comments.replace(/\n/g,"<br />"))})},_openOrderPrintPage:function(){var a,
b;a=this;b=window.open("/print/purchase/"+a._purchaseorder.id+".html?pdf=1",a._purchaseorder.status+" PO "+a._purchaseorder.purchaseOrderNo,"width=1300, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no");b.onload=function(){b.document.title=a._purchaseorder.status+" Order "+a._purchaseorder.purchaseOrderNo;b.focus();b.print();b.close()};return a},_getItemDiv:function(){var a;a=this;a._newDiv=(new Element("div")).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",
{"class":"col-sm-6"})).update(a._getSupplierInfoPanel())}).insert({bottom:(new Element("div",{"class":"col-sm-6"})).update(a._getPaymentPanel())})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-12"})).update(a._getInvoiceNoPanel())})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-12"})).update(a._getPartsTable())})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",
{"class":"col-sm-12"})).update(a._getCommentsPanel())})});a._purchaseOrderItems.each(function(b){a._addNewProductRow(a._newDiv.down(".glyphicon.glyphicon-floppy-saved"),b)});a._newDiv.getElementsBySelector(".order-item-row").each(function(a){a.addClassName("order-item-row-old")});return a._newDiv},_getInvoiceNoPanel:function(){var a,b,c;a=this;b=(new Element("div",{"class":"well well-sm"})).insert({bottom:c=(new Element("ul",{"class":"list-inline"})).insert({bottom:(new Element("li")).update((new Element("strong")).update("Invoice Number(s): "))})});
a._purchaseorder.supplierInvoices.each(function(b){c.insert({bottom:(new Element("li")).update((new Element("a",{href:"/bills/"+a._purchaseorder.supplier.id+".html?invoiceNo="+b,target:"_BLANK"})).update(b))})});return b},_getSupplierInfoPanel:function(){var a,b;a=this._purchaseorder.supplier;b=this._purchaseorder;return(new Element("div",{"class":"panel panel-info"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).insert({bottom:(new Element("strong")).update("Editing PO "+b.purchaseOrderNo+
" for "+a.name+" ")}).insert({bottom:(new Element("div",{"class":"pull-right"})).insert({bottom:(new Element("strong",{style:"padding-left: 10px"})).update("ETA: ")}).insert({bottom:new Element("input",{style:"max-height:19px","class":"datepicker","save-order":"ETA",value:b.eta?b.eta:""})})}).insert({bottom:(new Element("div",{"class":"pull-right"})).insert({bottom:(new Element("strong")).update("Status: ")}).insert({bottom:this._getOrderStatus()})})}).insert({bottom:(new Element("div",{"class":"panel-body"})).insert({bottom:(new Element("div",
{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-3"})).update(this._getFormGroup("Contact Name",new Element("input",{"save-order":"contactName",type:"text",value:a.contactName?a.contactName:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-3"})).update(this._getFormGroup("Contact Number",new Element("input",{"save-order":"contactNo",type:"value",value:a.contactNo?a.contactNo:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-3"})).update(this._getFormGroup("Contact Email",
new Element("input",{"save-order":"contactEmail",type:"email",value:a.email?a.email:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-3"})).update(this._getFormGroup("PO Ref Num",new Element("input",{required:"required","save-order":"supplierRefNum",type:"text",value:b.supplierRefNo?b.supplierRefNo:""})))})})})},_loadDataPicker:function(){$$(".datepicker").each(function(a){new Prado.WebUI.TDatePicker({ID:a,InputMode:"TextBox",Format:"yyyy-MM-dd 00:00:00",FirstDayOfWeek:1,CalendarStyle:"default",
FromYear:2009,UpToYear:2024,PositionMode:"Bottom",ClassName:"datepicker-layer-fixer"})});return this},_getCommentsPanel:function(){var a,b,c,f;a=this;b=a._comments;c=(new Element("div",{"class":"panel panel-info"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).update("Comment History")}).insert({bottom:(new Element("div",{"class":"table-responsive"})).insert({bottom:(new Element("table",{id:"comments_result_div","class":"table table-hover table-condensed"})).insert({bottom:new Element("thead")}).insert({bottom:new Element("tbody")})})});
f=a._getCommentsRow("",!0);c.down("#comments_result_div thead").insert({bottom:f});b.each(function(b){""!==b.comments&&(f=a._getCommentsRow(b,!1),c.down("#comments_result_div tbody").insert({bottom:f}))});return c},_getOrderStatus:function(){var a,b;a=this;b=new Element("select",{"save-order":"status"});b.insert({bottom:(new Element("option")).update(a._purchaseorder.status)});a._statusOptions.each(function(c){a._purchaseorder.status!==c&&b.insert({bottom:(new Element("option")).update(c)})});return b},
_getPaymentPanel:function(){var a={me:this};a.supplier=a.me._supplier;a.totalShippingCost=a.me._purchaseorder.shippingCost?a.me._purchaseorder.shippingCost:0;a.totalHandlingCost=a.me._purchaseorder.handlingCost?a.me._purchaseorder.handlingCost:0;a.totalExcGST=a.me._purchaseorder.totalAmount?a.me._purchaseorder.totalAmount:0;a.totalPaidAmount=a.me._purchaseorder.totalPaid?a.me._purchaseorder.totalPaid:0;a.totalPaymentDue=1*a.totalExcGST+1*a.totalShippingCost+1*a.totalHandlingCost-1*a.totalPaidAmount;
a.shippingCostEl=(new Element("input",{"class":"text-right",id:"shipping_cost","save-order":"shippingCost",value:a.me._purchaseorder.shippingCost?a.me.getCurrency(a.me._purchaseorder.shippingCost):a.me.getCurrency(0)})).observe("keyup",function(){a.shippingCost=""===this.value?0:a.me.getValueFromCurrency(this.value);jQuery.isNumeric(a.shippingCost)&&(a.totalPaidAmount=1*a.me.getValueFromCurrency($$('[save-order="totalPaid"]').first().value),a.handlingCost=1*a.me.getValueFromCurrency($$('[save-order="handlingCost"]').first().value),
a.totalExcGST=1*a.me.getValueFromCurrency($(a.me.getHTMLID("totalPriceExcludeGST")).innerHTML),a.totalPaymentDue=1*a.totalIncGST+1*a.shippingCost+1*a.handlingCost-1*a.totalPaidAmount,$$(".total-payment-due").each(function(b){a.newEl=(new Element("strong",{"class":"label"})).update(a.me.getCurrency(a.totalPaymentDue)+" ");0<1*a.totalPaymentDue?a.newEl.addClassName("label-info").writeAttribute("title","Need to pay supplier").insert({bottom:new Element("span",{"class":" glyphicon glyphicon-import"})}):
0===1*a.totalPaymentDue?a.newEl.addClassName("label-success").insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok"})}):a.newEl.addClassName("label-danger").writeAttribute("title","Over paid to supplier").insert({bottom:new Element("span",{"class":" glyphicon glyphicon-export"})});b.update(a.newEl)}))}).observe("click",function(){$(this).select()});a.handlingCostEl=(new Element("input",{"class":"text-right",id:"handling_cost","save-order":"handlingCost",value:a.me._purchaseorder.handlingCost?
a.me.getCurrency(a.me._purchaseorder.handlingCost):a.me.getCurrency(0)})).observe("keyup",function(){a.handlingCost=""===this.value?0:a.me.getValueFromCurrency(this.value);jQuery.isNumeric(a.handlingCost)&&(a.totalPaidAmount=1*a.me.getValueFromCurrency($$('[save-order="totalPaid"]').first().value),a.shippingCost=1*a.me.getValueFromCurrency($$('[save-order="shippingCost"]').first().value),a.totalExcGST=1*a.me.getValueFromCurrency($(a.me.getHTMLID("totalPriceExcludeGST")).innerHTML),a.totalPaymentDue=
1*a.totalExcGST+1*a.shippingCost+1*a.handlingCost-1*a.totalPaidAmount,$$(".total-payment-due").each(function(b){a.newEl=(new Element("strong",{"class":"label"})).update(a.me.getCurrency(a.totalPaymentDue)+" ");0<1*a.totalPaymentDue?a.newEl.addClassName("label-info").writeAttribute("title","Need to pay supplier").insert({bottom:new Element("span",{"class":" glyphicon glyphicon-import"})}):0===1*a.totalPaymentDue?a.newEl.addClassName("label-success").insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok"})}):
a.newEl.addClassName("label-danger").writeAttribute("title","Over paid to supplier").insert({bottom:new Element("span",{"class":" glyphicon glyphicon-export"})});b.update(a.newEl)}))}).observe("click",function(){$(this).select()});a.totalAmountExGstEl=new Element("input",{"class":"text-right",disabled:"disabled","save-order":"totalAmount"});a.totalPaidEl=(new Element("input",{"class":"text-right",id:a.me.getHTMLID("totalPaidAmount"),"save-order":"totalPaid",value:a.me._purchaseorder.totalPaid?a.me.getCurrency(a.me._purchaseorder.totalPaid):
a.me.getCurrency(0)})).observe("keyup",function(){a.totalPaidAmount=""===this.value?0:a.me.getValueFromCurrency(this.value);jQuery.isNumeric(a.totalPaidAmount)&&(a.shippingCost=1*a.me.getValueFromCurrency($$('[save-order="shippingCost"]').first().value),a.handlingCost=1*a.me.getValueFromCurrency($$('[save-order="handlingCost"]').first().value),a.totalExcGST=1*a.me.getValueFromCurrency($(a.me.getHTMLID("totalPriceExcludeGST")).innerHTML),a.totalPaymentDue=1*a.totalExcGST+1*a.shippingCost+1*a.handlingCost-
1*a.totalPaidAmount,$$(".total-payment-due").each(function(b){a.newEl=(new Element("strong",{"class":"label"})).update(a.me.getCurrency(a.totalPaymentDue)+" ");0<1*a.totalPaymentDue?a.newEl.addClassName("label-info").writeAttribute("title","Need to pay supplier").insert({bottom:new Element("span",{"class":" glyphicon glyphicon-import"})}):0===1*a.totalPaymentDue?a.newEl.addClassName("label-success").insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok"})}):a.newEl.addClassName("label-danger").writeAttribute("title",
"Over paid to supplier").insert({bottom:new Element("span",{"class":" glyphicon glyphicon-export"})});b.update(a.newEl)}))}).observe("click",function(){$(this).select()});a.newDiv=(new Element("div",{"class":"panel panel-info",id:a.me.getHTMLID("paymentPanel")})).insert({bottom:(new Element("div",{"class":"panel-heading"})).insert({bottom:(new Element("strong")).update("Total Payment Due Exc. GST: ")}).insert({bottom:(new Element("span",{"class":"pull-right total-payment-due"})).update(a.me.getCurrency(a.totalPaymentDue))})}).insert({bottom:(new Element("div",
{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-md-6"})).insert({bottom:(new Element("div",{"class":"list-group-item"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-6 text-left form-group",style:"margin: 0px;"})).insert({bottom:(new Element("lable",{"class":"text-left active"})).update((new Element("span")).update("Total Ex GST"))})}).insert({bottom:(new Element("div",{"class":"col-xs-6 text-left form-group",style:"margin: 0px;"})).insert({bottom:a.totalAmountExGstEl.addClassName("form-control input-sm col-xs-6")})})})}).insert({bottom:(new Element("div",
{"class":"list-group-item"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-6 text-left form-group",style:"margin: 0px;"})).insert({bottom:(new Element("lable",{"class":"text-left active"})).update((new Element("span")).update("Total Paid"))})}).insert({bottom:(new Element("div",{"class":"col-xs-6 form-group",style:"margin: 0px;"})).insert({bottom:a.totalPaidEl.addClassName("form-control input-sm")})})})})}).insert({bottom:(new Element("div",
{"class":"col-md-6"})).insert({bottom:(new Element("div",{"class":"list-group-item"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-6 text-left form-group",style:"margin: 0px;"})).insert({bottom:(new Element("lable",{"class":"text-left active"})).update((new Element("span")).update("Shipping Cost"))})}).insert({bottom:(new Element("div",{"class":"col-xs-6 form-group",style:"margin: 0px;"})).insert({bottom:a.shippingCostEl.addClassName("form-control input-sm")})})})}).insert({bottom:(new Element("div",
{"class":"list-group-item"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-6 text-left form-group",style:"margin: 0px;"})).insert({bottom:(new Element("lable",{"class":"text-left active"})).update((new Element("span")).update("Handling Cost"))})}).insert({bottom:(new Element("div",{"class":"col-xs-6 form-group",style:"margin: 0px;"})).insert({bottom:a.handlingCostEl.addClassName("form-control input-sm")})})})})})});return a.newDiv},_getPartsTable:function(){var a;
a=(new Element("table",{"class":"table table-hover table-condensed order_change_details_table"})).insert({bottom:this._getProductRow({product:{sku:"SKU",name:"Description"},unitPrice:"Unit Price (Ex)",qtyOrdered:"Qty",totalPrice:"Total Price"},!0).wrap(new Element("thead"))});a.insert({bottom:(new Element("tbody",{style:"border: 3px #ccc solid;"})).insert({bottom:this._getNewProductRow()})});a.insert({bottom:(new Element("tfoot")).insert({bottom:(new Element("tr")).insert({bottom:(new Element("td",
{colspan:2,rowspan:4})).insert({bottom:this._getFormGroup("Comments:",(new Element("textarea",{"save-order":"comments",style:"height:33px"})).update(this._comment?this._comment:""))}).insert({bottom:(new Element("div",{colspan:2,"class":"active"})).update(this._saveBtns())})}).insert({bottom:(new Element("td",{colspan:2,"class":"text-right active"})).update((new Element("strong")).update("Total Excl. GST: "))}).insert({bottom:(new Element("td",{id:this.getHTMLID("totalPriceExcludeGST"),"class":"active"})).update(this.getCurrency(0))}).insert({bottom:(new Element("td",
{rowspan:4})).update("&nbsp;")})}).insert({bottom:(new Element("tr")).insert({bottom:(new Element("td",{colspan:2,"class":"text-right active"})).update((new Element("strong")).update("Total GST: "))}).insert({bottom:(new Element("td",{id:this.getHTMLID("totalPriceGST"),"class":"active"})).update(this.getCurrency(0))})}).insert({bottom:(new Element("tr")).insert({bottom:(new Element("td",{colspan:2,"class":"text-right active"})).update((new Element("strong")).update("Total Incl. GST: "))}).insert({bottom:(new Element("td",
{id:this.getHTMLID("totalPriceIncludeGST"),"class":"active"})).update(this.getCurrency(0))})})});return(new Element("div",{"class":"panel panel-info"})).insert({bottom:(new Element("div",{"class":"panel-body table-responsive"})).insert({bottom:a})})},_getProductRow:function(a,b){var c,f,d,e;c=this;f=b||!1;d=!0===f?"th":"td";f=(new Element("tr",{"class":!0===f?"":"item_row order-item-row","item-id":a.id?a.id:""})).store("data",a).insert({bottom:(new Element(d,{"class":"productName"})).insert({bottom:a.product.name})}).insert({bottom:(new Element(d,
{"class":"uprice col-xs-2"})).insert({bottom:a.unitPrice}).observe("keydown",function(a){e=this;c.keydown(a,function(){$(e).up(".item_row").down(".tprice input").value=c.getCurrency($(e).down("input").value);$(e).up(".item_row").down(".glyphicon.glyphicon-floppy-saved").click()});return!1})}).insert({bottom:(new Element(d,{"class":"qty col-xs-1"})).insert({bottom:a.receievedQty&&"NEW"!==c._purchaseorder.status?a.receievedQty+"/"+a.qtyOrdered:a.qtyOrdered}).observe("keydown",function(a){e=this;c.keydown(a,
function(){$(e).up(".item_row").down(".glyphicon.glyphicon-floppy-saved").click()});return!1})}).insert({bottom:(new Element(d,{"class":"tprice col-xs-1"})).insert({bottom:a.totalPrice}).observe("keydown",function(a){e=this;c.keydown(a,function(){$(e).up(".item_row").down(".glyphicon.glyphicon-floppy-saved").click()});return!1})}).insert({bottom:(new Element(d,{"class":"btns  col-xs-1"})).update(a.btns?a.btns:"")});a.product.sku?f.insert({top:(new Element(d,{"class":"productSku"})).update(a.product.sku)}):
f.down(".productName").writeAttribute("colspan",2);return f},_getNewProductRow:function(){var a,b,c,f,d,e,g,k;a=this;b={product:{name:a._getNewProductProductAutoComplete()},unitPrice:a._getFormGroup(null,(new Element("input",{"class":"input-sm","new-order-item":"unitPrice",required:"Required!",value:a.getCurrency(0)})).observe("keyup",function(){c=$(this).up(".item_row");f=a.getValueFromCurrency($F(this));d=$F(c.down("[new-order-item=qtyOrdered]"));$(c.down("[new-order-item=totalPrice]")).value=a.getCurrency(f*
d)}).observe("click",function(){$(this).select()})),qtyOrdered:a._getFormGroup(null,(new Element("input",{"class":"input-sm",type:"number","new-order-item":"qtyOrdered",required:"Required!",value:"1"})).observe("keyup",function(){c=$(this).up(".item_row");f=a.getValueFromCurrency($F(c.down("[new-order-item=unitPrice]")));d=$F(this);$(c.down("[new-order-item=totalPrice]")).value=a.getCurrency(f*d)}).observe("change",function(){c=$(this).up(".item_row");f=a.getValueFromCurrency($F(c.down("[new-order-item=unitPrice]")));
d=$F(this);$(c.down("[new-order-item=totalPrice]")).value=a.getCurrency(f*d)}).observe("click",function(){$(this).select()})),totalPrice:a._getFormGroup(null,(new Element("input",{"class":"input-sm",disabled:!0,"new-order-item":"totalPrice",required:"Required!",value:a.getCurrency(0)})).observe("keyup",function(){c=$(this).up(".item_row");e=a.getValueFromCurrency($F(this));d=$F(c.down("[new-order-item=qtyOrdered]"));$(c.down("[new-order-item=unitPrice]")).value=a.getCurrency(e/d)}).observe("click",
function(){$(this).select()})),btns:(new Element("span",{"class":"btn-group btn-group-sm pull-right"})).insert({bottom:(new Element("span",{"class":"btn btn-primary"})).insert({bottom:new Element("span",{"class":" glyphicon glyphicon-floppy-saved"})}).observe("click",function(){a._addNewProductRow(this)})}).insert({bottom:(new Element("span",{"class":"btn btn-default"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-floppy-remove"})}).observe("click",function(){confirm("You about to clear this entry. All input data for this entry will be lost.\n\nContinue?")&&
(g=a._getNewProductRow(),k=$(this).up(".new-order-item-input"),k.getElementsBySelector(".form-group.has-error .form-control").each(function(a){$(a).retrieve("clearErrFunc")()}),k.replace(g),g.down("[new-order-item=product]").focus())})})};return a._getProductRow(b,!1).addClassName("new-order-item-input info").removeClassName("order-item-row")},_getNewProductProductAutoComplete:function(){var a,b,c;a=this;b=a._getFormGroup(null,(new Element("div",{"class":"input-group input-group-sm product-autocomplete"})).insert({bottom:(new Element("input",
{"class":"form-control search-txt visible-xs visible-sm visible-md visible-lg","new-order-item":"product",required:"Required!",placeholder:"search SKU, NAME and any BARCODE for this product"})).observe("keydown",function(b){c=this;a.keydown(b,function(){$(c).up(".product-autocomplete").down(".search-btn").click()});a.keydown(b,function(){$(c).up(".product-autocomplete").down(".search-btn").click()},null,9);return!1}).observe("click",function(){$(this).select()})}).insert({bottom:(new Element("span",
{"class":"input-group-btn"})).insert({bottom:(new Element("span",{"class":" btn btn-primary search-btn","data-loading-text":"searching..."})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-search"})}).observe("click",function(){a._searchProduct(this)})})}));b.down(".input-group").removeClassName("form-control");return b},_recalculateSummary:function(a){var b,c,f,d,e,g,k,m,l,h;b=this;c=$(b.getHTMLID("totalPriceIncludeGST"))?$(b.getHTMLID("totalPriceIncludeGST")):b._newDiv.down("#"+
b.getHTMLID("totalPriceIncludeGST"));f=$(b.getHTMLID("totalPriceGST"))?$(b.getHTMLID("totalPriceGST")):b._newDiv.down("#"+b.getHTMLID("totalPriceGST"));d=$(b.getHTMLID("totalPriceExcludeGST"))?$(b.getHTMLID("totalPriceExcludeGST")):b._newDiv.down("#"+b.getHTMLID("totalPriceExcludeGST"));e=$("shipping_cost");g=$("handling_cost");k=(a=1*b.getValueFromCurrency(d.innerHTML)+1*a)?1.1*a:0;e=e?b.getValueFromCurrency($F(e)):b._purchaseorder.shippingCost;g=g?b.getValueFromCurrency($F(g)):b._purchaseorder.handlingCost;
m=a?1*k-1*a:0;c.update(b.getCurrency(k));f.update(b.getCurrency(m));d.update(b.getCurrency(a));c=$$(".pull-right.total-payment-due").first()?$(b.getHTMLID("totalPaidAmount"))?b.getValueFromCurrency($F(b.getHTMLID("totalPaidAmount"))):0:b._purchaseorder.totalPaid;l=1*a+1*e+1*g-1*c;$$(".total-payment-due").each(function(a){h=(new Element("strong",{"class":"label"})).update(b.getCurrency(l)+" ");0<1*l?h.addClassName("label-info").writeAttribute("title","Need to pay supplier").insert({bottom:new Element("span",
{"class":" glyphicon glyphicon-import"})}):0===1*l?h.addClassName("label-success").insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok"})}):h.addClassName("label-danger").writeAttribute("title","Over paid to supplier").insert({bottom:new Element("span",{"class":" glyphicon glyphicon-export"})});a.update(h)});$$(".pull-right.total-payment-due").first()||b._newDiv.getElementsBySelector(".total-payment-due").each(function(a){h=(new Element("strong",{"class":"label"})).update(b.getCurrency(l)+
" ");0<1*l?h.addClassName("label-info").writeAttribute("title","Need to pay supplier").insert({bottom:new Element("span",{"class":" glyphicon glyphicon-import"})}):0===1*l?h.addClassName("label-success").insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok"})}):h.addClassName("label-danger").writeAttribute("title","Over paid to supplier").insert({bottom:new Element("span",{"class":" glyphicon glyphicon-export"})});a.update(h)});$$("#"+b.getHTMLID("paymentPanel")).first()?$$("#"+b.getHTMLID("paymentPanel")).first().down('[save-order]="totalAmount"[disabled]="disabled"').value=
b.getCurrency(a):b._newDiv.down('[save-order]="totalAmount"[disabled]="disabled"').value=b.getCurrency(a);return b},_addNewProductRow:function(a,b){var c,f,d,e,g,k,m,l,h;c=this;f=$(a).up(".new-order-item-input");if(d="undefined"===typeof b?f.retrieve("product"):b.product)if(e=f.down("[new-order-item=unitPrice]"),g="undefined"===typeof b?c.getValueFromCurrency($F(e)):b.unitPrice,jQuery.isNumeric(g)||null!==g.match(/^\d+(\.\d{1,2})?$/))if(e=f.down("[new-order-item=qtyOrdered]"),k="undefined"===typeof b?
c.getValueFromCurrency($F(e)):b.qty,null===k.match(/^(-)?\d+(\.\d{1,2})?$/))c._markFormGroupError(e,"Invalid value provided!");else{m="undefined"===typeof b?"":b.receievedQty;l=f.down("[new-order-item=totalPrice]");e="undefined"===typeof b?c.getValueFromCurrency($F(l)):b.totalPrice;if(jQuery.isNumeric(e)||null!==e.match(/^\d+(\.\d{1,2})?$/))return f.getElementsBySelector(".form-group.has-error .form-control").each(function(a){$(a).retrieve("clearErrFunc")()}),g={id:b&&b.id?b.id:"",product:d,unitPrice:c.getCurrency(g),
qtyOrdered:k,receievedQty:m,totalPrice:c.getCurrency(e),btns:(new Element("span",{"class":"pull-right",style:"NEW"!==c._purchaseorder.status?"display:none":""})).insert({bottom:(new Element("span",{"class":"btn btn-danger btn-xs"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){confirm("You remove this entry.\n\nContinue?")&&(h=$(this).up(".item_row"),c._recalculateSummary(0-1*c.getValueFromCurrency(h.retrieve("data").totalPrice)),h.hasClassName("order-item-row-old")?
(h.addClassName("order-item-row-old-removed"),h.hide()):h.remove())})})},f.insert({after:g=c._getProductRow(g).addClassName("btn-hide-row")}),c.setProductLink(g.down(".productSku"),d.id),d=c._getNewProductRow(),f.replace(d),d.down("[new-order-item=product]").focus(),c._recalculateSummary(e),c;c._markFormGroupError(l,"Invalid value provided!")}else c._markFormGroupError(e,"Invalid value provided!");else d=f.down("[new-order-item=product]"),f.down("[new-order-item=product]")?c._markFormGroupError(d,
"Select a product first!"):c.showModalBox("Product Needed","Select a product first!",!0)},setProductLink:function(a,b){var c;$(a).setStyle("text-decoration: underline; cursor: pointer;").writeAttribute("title","double click to open").observe("click",function(a){Event.stop(a)}).observe("dblclick",function(a){Event.stop(a);c=window.open("/product/"+b+".html","_blank");c.focus()})},_searchProduct:function(a){var b,c,f,d,e;b=this;b._signRandID(a);c=$(a).up(".product-autocomplete").down(".search-txt");
f=$F(c);b.postAjax(b.getCallbackId("searchProduct"),{searchTxt:f,supplierID:b._supplier.id},{onLoading:function(){jQuery("#"+a.id).button("loading")},onSuccess:function(a,k){d=new Element("div",{style:"overflow: auto; max-height: 400px;"});try{e=b.getResp(k,!1,!0);if(!e||!e.items||0===e.items.size())throw"Nothing Found for: "+f;b._signRandID(c);e.items.each(function(a){d.insert({bottom:b._getSearchPrductResultRow(a,c)})});d.addClassName("list-group")}catch(m){d.update(b.getAlertBox("Error: ",m).addClassName("alert-danger"))}b.showModalBox("Products that has: "+
f,d,!1)},onComplete:function(b,c){jQuery("#"+a.id).button("reset")}});return b},_getSearchPrductResultRow:function(a,b){var c,f,d,e;c=this;return f=(new Element("a",{"class":"list-group-item",href:"javascript: void(0);"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-2"})).insert({bottom:(new Element("div",{"class":"thumbnail"})).insert({bottom:new Element("img",{"data-src":"holder.js/100%x64",alert:"Product Image",src:0===a.images.size()?
"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMzIiIHk9IjMyIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NjR4NjQ8L3RleHQ+PC9zdmc+":a.images[0].asset.url})})})}).insert({bottom:(new Element("div",{"class":"col-xs-10"})).insert({bottom:(new Element("div",
{"class":"row"})).insert({bottom:(new Element("strong")).update(a.name).insert({bottom:(new Element("small",{"class":"btn btn-xs btn-info"})).insert({bottom:new Element("small",{"class":"glyphicon glyphicon-new-window"})})}).observe("click",function(b){Event.stop(b);d=window.open("/product/"+a.id+".html","_blank");d.focus()}).insert({bottom:(new Element("small",{"class":"pull-right"})).update("SKU: "+a.sku)})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("small")).update(a.shortDescription)})})}).insert({bottom:(new Element("div",
{"class":"row",style:a.minProductPrice||a.lastSupplierPrice||a.minSupplierPrice?"height: 2px; background-color: brown;":"display:none"})).update("&nbsp;")}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("span",{"class":"btn btn-link btn-xs",style:a.minProductPrice?"text-align: left":"display:none"})).update("Product Min: ").insert({bottom:(new Element("strong")).update(c.getCurrency(a.minProductPrice))}).writeAttribute("title","double click to open").observe("click",
function(a){Event.stop(a)}).observe("dblclick",function(b){Event.stop(b);c._openPOPage(a.minProductPriceId)})}).insert({bottom:(new Element("span",{"class":"btn btn-link btn-xs",style:a.minSupplierPrice?"text-align: left":"display:none"})).update("Supplier Min: ").insert({bottom:(new Element("strong")).update(c.getCurrency(a.minSupplierPrice))}).writeAttribute("title","double click to open").observe("click",function(a){Event.stop(a)}).observe("dblclick",function(b){Event.stop(b);c._openPOPage(a.minSupplierPriceId)})}).insert({bottom:(new Element("span",
{"class":"btn btn-link btn-xs",style:a.lastSupplierPrice?"text-align: left":"display:none"})).update("Supplier Last: ").insert({bottom:(new Element("strong")).update(c.getCurrency(a.lastSupplierPrice))}).writeAttribute("title","double click to open").observe("click",function(a){Event.stop(a)}).observe("dblclick",function(b){Event.stop(b);c._openPOPage(a.lastSupplierPriceId)})}).insert({bottom:(new Element("span",{"class":"btn btn-xs pull-right",title:"Stock on Hand"})).setStyle("text-align: left;").update("SoH: ").insert({bottom:(new Element("strong")).update(a.stockOnHand)})}).insert({bottom:(new Element("span",
{"class":"btn btn-xs pull-right",title:"Stock on PO"})).setStyle("text-align: left;").update("SoPO: ").insert({bottom:(new Element("strong")).update(a.stockOnPO)})})})})}).observe("click",function(){e=$(b).up(".new-order-item-input").store("product",a);b.up(".productName").writeAttribute("colspan",!1).update(a.sku).setStyle("text-decoration: underline; cursor: pointer;").observe("click",function(b){Event.stop(b);d=window.open("/product/"+a.id+".html","_blank");d.focus()}).insert({after:(new Element("td")).update(a.name).insert({bottom:(new Element("a",
{href:"javascript: void(0);","class":"text-danger pull-right",title:"click to change the product"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-remove"})}).observe("click",function(){f=c._getNewProductRow();$(this).up(".new-order-item-input").replace(f);f.down("[new-order-item=product]").select()})})});jQuery("#"+c.modalId).modal("hide");e.down("[new-order-item=totalPrice]").value=c.getCurrency(a.minProductPrice);e.down("[new-order-item=qtyOrdered]").value=1;e.down("[new-order-item=unitPrice]").value=
c.getCurrency(a.minProductPrice);e.down("[new-order-item=unitPrice]").select()})},_saveBtns:function(){var a,b,c;a=this;b=(new Element("span",{"class":"btn-group pull-right"})).insert({bottom:(new Element("span",{"class":"btn btn-primary","data-loading-text":"saving..."})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok-circle"})}).insert({bottom:(new Element("span")).update(" save ")}).observe("click",function(){a._submitOrder($(this))})}).insert({bottom:(new Element("span",{"class":"NEW"===
a._purchaseorder.status?"btn btn-info":"hidden","data-loading-text":"saving..."})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-send"})}).insert({bottom:(new Element("span")).update(" submit ")}).observe("click",function(){c=new Element("select",{"save-order":"status"});c.insert({bottom:(new Element("option")).update("ORDERED")});a._statusOptions.each(function(b){"ORDERED"!==a._purchaseorder.status&&c.insert({bottom:(new Element("option")).update(b)})});$$('select[save-order="status"]').first().replace(c);
a._submitOrder($(this),!0)})}).insert({bottom:(new Element("span",{"class":"btn btn-success"})).insert({bottom:(new Element("span",{"class":""})).update("Print Order ")}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-print"})}).observe("click",function(){a._openOrderPrintPage()})}).insert({bottom:(new Element("span",{"class":"btn btn-default"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-remove-sign"})}).insert({bottom:(new Element("span")).update(" cancel ")}).observe("click",
function(){a.showModalBox('<strong class="text-danger">Cancelling the current order</strong>','<div>You are about to cancel this new order, all input data will be lost.</div><br /><div>Continue?</div><div><span class="btn btn-primary" onclick="window.location = document.URL;"><span class="glyphicon glyphicon-ok"></span> YES</span><span class="btn btn-default pull-right" data-dismiss="modal"><span aria-hidden="true"><span class="glyphicon glyphicon-remove-sign"></span> NO</span></span></div>',!0)})});
b=b.wrap(new Element("div"));b.insert({top:!a._purchaseorder.id||"ORDERED"!==a._purchaseorder.status&&"RECEIVING"!==a._purchaseorder.status||!0!==a._purchaseorder.active?"":(new Element("a",{"class":"btn btn-success pull-left",title:"Receiving Items",href:"/receiving/"+a._purchaseorder.id+".html"})).update("Receiving")});return b},_submitOrder:function(a,b){var c,f,d,e,g;c=this;f=!0===b?!0:!1;d=c._collectFormData($(c.getHTMLID("itemDiv")),"save-order");if(null===d)return c;d.items=[];$$(".order-item-row").each(function(a){e=
a.retrieve("data");d.items.push({id:e.id,productId:e.product.id,qtyOrdered:e.qtyOrdered,totalPrice:e.totalPrice?c.getValueFromCurrency(e.totalPrice):"",unitPrice:e.unitPrice?c.getValueFromCurrency(e.unitPrice):"",active:!a.hasClassName("order-item-row-old-removed")})});d.id=c._purchaseorder.id;d.supplierId=c._supplier.id;d.totalAmount=d.totalAmount?c.getValueFromCurrency($(c.getHTMLID("totalPriceIncludeGST")).innerHTML):"";d.totalPaid=d.totalPaid?c.getValueFromCurrency(d.totalPaid):"";d.handlingCost=
d.handlingCost?c.getValueFromCurrency(d.handlingCost):"";d.shippingCost=d.shippingCost?c.getValueFromCurrency(d.shippingCost):"";c._signRandID(a);d.isSubmit=f;c.postAjax(c.getCallbackId("saveOrder"),d,{onLoading:function(b,c){jQuery("#"+a.id).button("loading")},onSuccess:function(a,b){try{(g=c.getResp(b,!1,!0))&&g.item&&(c._item=g.item,c.refreshParentWindow(),c.showModalBox("Success","Saved successfully",!1),location.reload())}catch(l){c.showModalBox("Error!",l,!1)}},onComplete:function(b,c){jQuery("#"+
a.id).button("reset")}});return c},_openPOPage:function(a){window.open("/purchase/"+a+".html","width=1300, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no").focus();return this},refreshParentWindow:function(){var a,b;window.opener&&(a=window.opener,(b=$(a.document.body).down("#"+a.pageJs.resultDivId+" .item_row[item_id="+this._item.id+"]"))&&b.replace(a.pageJs._getResultRow(this._item)))},_getSummaryDiv:function(a){var b;b=(new Element("select",{"class":"",
"save-item":"status"})).insert({bottom:(new Element("option",{value:a.status})).update(a.status)});this._statusOptions.each(function(c){c!==a.status&&b.insert({bottom:(new Element("option",{value:c})).update(c)})});return(new Element("div",{"class":"panel panel-default purchaseorder-summary"})).insert({bottom:(new Element("div",{"class":"panel-heading"})).insert({bottom:(new Element("a",{href:"javascript: void(0);",title:"click to show/hide below"})).insert({bottom:(new Element("strong")).update(a.supplier.name?
"Editing: "+a.supplier.name+" - "+a.id:"Creating new purchase order: ")}).insert({bottom:(new Element("small",{"class":"pull-right"})).insert({bottom:(new Element("label",{"for":"showOnWeb_"+a.id})).update("Show on Web?")}).insert({bottom:new Element("input",{id:"showOnWeb_"+a.id,style:"margin-left:10px;","save-item":"sellOnWeb",type:"checkbox"})})})}).observe("click",function(){$(this).up(".panel").down(".panel-body").toggle()})}).insert({bottom:(new Element("div",{"class":"panel-body"})).insert({bottom:(new Element("div",
{"class":"row"})).insert({bottom:(new Element("strong",{"class":"col-sm-4 pull-left"})).update("Purchase Order Info")})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-1 purchaseOrderNo"})).update(this._getFormGroup("PO Number",new Element("input",{disabled:"disabled",type:"value",value:a.purchaseOrderNo?a.purchaseOrderNo:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-1 purchaseRefNo"})).update(this._getFormGroup("PO RefNumber",
new Element("input",{"save-item":"purchaseRefNo",type:"value",value:a.supplierRefNo?a.supplierRefNo:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-1 status"})).update(this._getFormGroup("Status",b))}).insert({bottom:(new Element("div",{"class":"col-sm-1 active"})).update(this._getFormGroup("Active?",new Element("input",{"save-item":"active",type:"checkbox",checked:a.active})))}).insert({bottom:(new Element("div",{"class":"col-sm-2 orderDate"})).update(this._getFormGroup("Ordered Date",
new Element("input",{"class":"datepicker","save-item":"orderDate",value:a.orderDate?a.orderDate:""})))})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("strong",{"class":"col-sm-4 pull-left"})).update("Supplier Info")})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-1 supplierName"})).update(this._getFormGroup("Name",new Element("input",{"save-item":"supplierName",type:"text",value:a.supplier.name?a.supplier.name:
""})))}).insert({bottom:(new Element("div",{"class":"col-sm-1 supplierId"})).update(this._getFormGroup("ID",new Element("input",{"save-item":"supplierId",type:"text",value:a.supplier.id?a.supplier.id:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-1 supplierMageId"})).update(this._getFormGroup("Mage ID",new Element("input",{"save-item":"supplierMageId",type:"value",value:a.supplier.mageId?a.supplier.mageId:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-1 supplierActive"})).update(this._getFormGroup("Active?",
new Element("input",{"save-item":"supplierActive",type:"checkbox",checked:a.supplier.active})))}).insert({bottom:(new Element("div",{"class":"col-sm-1 supplierContactName"})).update(this._getFormGroup("contactName",new Element("input",{"save-item":"supplierContactName",type:"text",value:a.supplierContact?a.supplierContact:""})))}).insert({bottom:(new Element("div",{"class":"col-sm-1 supplierContactNo"})).update(this._getFormGroup("Contact No",new Element("input",{"save-item":"supplierContactNo",type:"value",
value:a.supplierContactNumber?a.supplierContactNumber:""})))})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("strong",{"class":"col-sm-4 pull-left"})).update("Finance Info")})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-1 totalAmount"})).update(this._getFormGroup("Total Amount",new Element("input",{"save-item":"totalAmount",type:"value",value:a.totalAmount?a.totalAmount:""})))}).insert({bottom:(new Element("div",
{"class":"col-sm-1 totalPaid"})).update(this._getFormGroup("Total Paid",new Element("input",{style:a.totalAmount-a.totalPaid?"color: red":"","save-item":"totalPaid",type:"value",value:a.totalPaid?a.totalPaid:""})))})})})},_getFormGroup:function(a,b){return(new Element("div",{"class":"form-group"})).insert({bottom:a?(new Element("label",{"class":"control-label"})).update(a):""}).insert({bottom:b.addClassName("form-control")})},bindAllEventNObjects:function(){return this},load:function(){var a;a=this._getItemDiv();
$(this.getHTMLID("itemDiv")).update(a);"NEW"!==this._purchaseorder.status&&($$(".order_change_details_table").first().down(".new-order-item-input ").remove(),a=$$(".order_change_details_table").first().down("tr"),a.addClassName("info").setStyle({border:"3px solid #ccc"}));$(this.getHTMLID("itemDiv")).down('input[save-order="contactName"]').focus();$(this.getHTMLID("itemDiv")).down('input[save-order="contactName"]').select();if("RECEIVED"===this._purchaseorder.status||"CLOSED"===this._purchaseorder.status)$$("input").each(function(a){a.disabled=
!0}),$$("select").each(function(a){a.disabled=!0}),"CLOSED"!==this._purchaseorder.status&&($("total-paid-amount").disabled=!1,$$('select[save-order="status"]').each(function(a){a.disabled=!1}));return this}});