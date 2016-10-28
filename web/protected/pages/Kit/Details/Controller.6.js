var PageJs=new Class.create;
PageJs.prototype=Object.extend(new DetailsPageJs,{_openinFB:!0,_preSetData:{},setPreSetData:function(a){this._preSetData=a;return this},_getValidatingDataFields:function(){return{"rowField[productId]":{validators:{notEmpty:{message:"Please select a product"},regexp:{regexp:/^\d+$/,message:"Please select a product"}}},"rowField[qty]":{validators:{notEmpty:{message:"Quantity is required"},integer:{message:"Quantity is not an integer"}}}}},setOpenInFancyBox:function(a){this._openinFB=a;return this},
_getUnitPrice:function(a){var b;b=0;a&&a.prices&&0<a.prices.size()&&a.prices.each(function(a){a.type&&1===parseInt(a.type.id)&&(b=a.price)});return b},_openURL:function(a){if(!0!==this._openinFB)return window.location=a,this;jQuery.fancybox({width:"95%",height:"95%",autoScale:!1,autoDimensions:!1,fitToView:!1,autoSize:!1,type:"iframe",href:a});return this},refreshParentWindow:function(a){var b;window.parent&&(b=window.parent)&&b.pageJs&&(b.pageJs.refreshTaskRow&&a.task?b.pageJs.refreshTaskRow(a.task):
b.pageJs.refreshResultRow&&b.pageJs.refreshResultRow(a))},_getSummary:function(){var a,b,c,d,e,f,g;a=this;b=0;c=[];$$(".item_data_row").each(function(g){d=g.retrieve("data");e=a.getValueFromCurrency(g.down(".unitCost").innerHTML);f=$F(g.down('[row-field="qty"]'));g.hasClassName("deactivated")||(b+=e*f);c.push({productId:d.product.id,unitCost:e,qty:f,id:d.id?d.id:"",active:!g.hasClassName("deactivated")})});g=1.1*b;return{totalIncGst:g,totalGST:1*g-1*b,totalExclGst:b,rowData:c}},_confirmDelRow:function(a){var b,
c,d,e,f,g,h,k;b=this;c=$(a).up(".item_row");if(!c)return b;d=c.retrieve("data");a=d.product.unitCost;e=$F(c.down('[row-field="qty"]'));a=(new Element("div")).insert({bottom:(new Element("div")).insert({bottom:(new Element("strong")).update("You are about to delete this selected row, with information:")}).insert({bottom:(new Element("ul")).insert({bottom:(new Element("li")).update("<strong>Product SKU: </strong>"+d.product.sku)}).insert({bottom:(new Element("li")).update("<strong>Product Name: </strong>"+
d.product.name)}).insert({bottom:(new Element("li")).update("<strong>Unit Price: </strong>"+b.getCurrency(b.getValueFromCurrency(a)))}).insert({bottom:(new Element("li")).update("<strong>Qty: </strong>"+e)}).insert({bottom:(new Element("li")).update("<strong>Total Price: </strong>"+b.getCurrency(e*a))})})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("strong")).update("Are you sure to continue?")})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",
{"class":"col-xs-6"})).update((new Element("div",{"class":"btn btn-default"})).update("No. Cancel").observe("click",function(){b.hideModalBox()}))}).insert({bottom:(new Element("div",{"class":"col-xs-6 text-right"})).update((new Element("div",{"class":"btn btn-danger"})).update("Yes. Delete it.").observe("click",function(){f=jQuery("#"+b.getHTMLID("main-form"));g=f.data("formValidation");h=b._getValidatingDataFields();g&&g.addField&&(c.getElementsBySelector(".need-validate").each(function(a){(k=a.readAttribute("form-option"))&&
!k.blank()&&h[k]&&g.removeField(a.name)}),g.resetForm());d.id?c.addClassName("deactivated").hide():c.remove();b._recalculateSummary().hideModalBox()}))})});b.showModalBox("<strong>Confirm Deletion</strong>",a);return b},_recalculateSummary:function(){var a;a=this._getSummary();jQuery('[summary="total-excl-gst"]').html(this.getCurrency(a.totalExclGst)).val(this.getCurrency(a.totalExclGst));jQuery('[summary="total-gst"]').html(this.getCurrency(a.totalGST)).val(this.getCurrency(a.totalGST));jQuery('[summary="total-inc-gst"]').html(this.getCurrency(a.totalIncGst)).val(this.getCurrency(a.totalIncGst));
return this},_getQtyCell:function(a,b){var c,d,e,f,g,h;c=this;d=a||1;return c.getFormGroup("",(new Element("input",{"class":"form-control input-sm input-row-field need-validate","row-field":"qty","form-option":"rowField[qty]",name:"rowField[qty]"+(void 0===b?"":b),placeholder:"Quanity",value:d})).observe("change",function(){e=this;f=$(e).up(".item_row");d=$F(this).replace(/\s*/g,"");null!==d.match(/^\d+?$/)&&($(e).setValue(parseInt(d)),jQuery("#"+c.getHTMLID("main-form")).formValidation("revalidateField",
e.name));f.down(".totalCost").update(c.getCurrency(d*c.getValueFromCurrency(f.down(".unitCost").innerHTML)));c._recalculateSummary()}).observe("keydown",function(a){g=$(this);c.keydown(a,function(){(h=g.up(".item_row").down(".row-field-save-btn"))&&h.click()})}))},_getProductRow:function(a,b,c){var d;d=this;a=!0===a?!0:!1;c=void 0===c?"":c;c=(new Element("div",{"class":"list-group-item item_row"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-8 product"})).update(!0===
a?(new Element("strong")).update("Product"):d._getProductDetailsDiv(b.product,!0))}).insert({bottom:(new Element("div",{"class":"col-xs-4 row-details"})).insert({bottom:(new Element("div",{"class":"col-xs-4 unitCost text-right"})).update(!0===a?(new Element("strong")).update("Unit Cost (excl. GST)"):d.getCurrency(b.unitCost))}).insert({bottom:(new Element("div",{"class":"col-xs-3 qty"})).update(!0===a?(new Element("strong")).update("Qty"):d._getQtyCell(b.qty,c))}).insert({bottom:(new Element("div",
{"class":"col-xs-3 totalCost text-right"})).update(!0===a?(new Element("strong")).update("Total Cost (excl. GST)"):d.getCurrency(b.unitCost*b.qty))}).insert({bottom:(new Element("div",{"class":"col-xs-2 btns text-right"})).update(!0===a?(new Element("strong")).update("&nbsp;"):b?(new Element("span",{"class":"btn btn-danger btn-xs row-del-btn"})).update(new Element("span",{"class":"glyphicon glyphicon-trash"})).observe("click",function(){b&&d._confirmDelRow(this)}):"")})})});b&&(c.store("data",b),
b.id&&c.writeAttribute("item_id",b.id));return c},_checkAddNewRow:function(a){var b,c,d,e,f;b=$(a).up(".item_row_new");c=jQuery("#"+this.getHTMLID("main-form")).data("formValidation");d=$(a).readAttribute("valid-target");jQuery.each(jQuery(".need-validate"),function(a,b){e=jQuery(b).attr("name");0<c.getFieldElements(e).length&&c.enableFieldValidators(e,jQuery(b).hasClass(d))});c.validate();!0===c.isValid()&&(a=b.down('[row-field="product-id"]'),this._signRandID(a),b=b.down('[row-field="qty"]'),f=
jQuery("#"+a.id).select2("data").data,this._addNewRow({product:f,unitCost:f.unitCost,qty:$F(b)}),c.resetForm(),jQuery("#"+a.id).select2("val",""),b.setValue(1),a.up(".product").down(".product-details").remove())},_inputRow:function(){var a,b;a=this;b=a._getProductRow(!0).addClassName("list-group-item-info item_row_new");b.down(".product").update(a.getFormGroup("",new Element("input",{"class":"form-control select2 input-sm product-search input-row-field need-validate","form-option":"rowField[productId]",
name:"rowField[productId]","row-field":"product-id",isKit:"0",placeholder:"Search a product",onSelectFunc:"_selectRowProduct"})));b.down(".unitCost").update(a.getCurrency(0));b.down(".qty").update(a._getQtyCell());b.down(".totalCost").update(a.getCurrency(0));b.down(".btns").update((new Element("span",{"class":"btn btn-primary btn-sm row-field-save-btn","valid-target":"input-row-field"})).update(new Element("i",{"class":"glyphicon glyphicon-floppy-saved"})).observe("click",function(){a._checkAddNewRow(this)}));
return b},_addNewRow:function(a){var b,c,d,e;b=$$(".kit-components-list").first().down(".item_row_footer");if(!b)return this;b.insert({before:a=this._getProductRow(!1,a,$$(".item_data_row").size()).addClassName("item_data_row")});this._recalculateSummary();a.getElementsBySelector(".input-row-field").each(function(a){a.removeClassName("input-row-field").addClassName("row-field")});c=jQuery("#"+this.getHTMLID("main-form")).data("formValidation");d=this._getValidatingDataFields();c&&c.addField&&a.getElementsBySelector(".need-validate").each(function(a){(e=
a.readAttribute("form-option"))&&!e.blank()&&d[e]&&c.addField(a.name,d[e])});return this},_save:function(a,b){var c,d,e;c=this;c.saveItem(a,b,function(a){a&&(c._item=a.item,d=(new Element("div")).insert({bottom:(new Element("h4")).update("Kit has been "+(a.createdFromNew?"created":"updated")+" successfully!")}),!0===a.createdFromNew&&d.insert({bottom:(new Element("div")).insert({bottom:(new Element("strong")).update("Do you want to create/clone another kit with same specs?")})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",
{"class":"btn btn-default"})).update("No").observe("click",function(){c.hideModalBox()})}).insert({bottom:(new Element("a",{"class":"btn btn-primary pull-right",href:"/kit/new.html?clonekitid="+c._item.id+("1"===c.getUrlParam("blanklayout")?"&blanklayout=1":"")})).update("Yes. Create Another One")})}),c.showModalBox('<strong class="text-success">Success</strong>',d,!1,null,{"hide.bs.modal":function(){a.url&&!a.url.blank()&&(window.location=a.url)}}),c.refreshParentWindow(a.item),a.printUrl&&!a.printUrl.blank()&&
(e=window.open(a.printUrl,"_BLANK","width=800"))&&e.focus())});return c},_preSave:function(a){var b,c,d,e,f,g,h,k,l,m;b=this;c=jQuery("#"+b.getHTMLID("main-form")).data("formValidation");d=$(a).readAttribute("valid-target");jQuery.each(jQuery(".need-validate"),function(a,b){e=jQuery(b).attr("name");0<c.getFieldElements(e).length&&c.enableFieldValidators(e,jQuery(b).hasClass(d))});c.validate();if(!0!==c.isValid())return b;f=b._item.product&&b._item.product.id?b._item.product.id:b._preSetData.cloneFromKit&&
b._preSetData.cloneFromKit.id?b._preSetData.cloneFromKit.product.id:$F($$('[save-panel="kit-product-id"]').first());if(f.blank())return b.showModalBox('<strong class="text-danger">Error:</strong>',(new Element("div")).update(b.getAlertBox("","You need to provide a product for the kit.").addClassName("alert-danger")).insert({bottom:(new Element("div",{"class":"row"})).update((new Element("span",{"class":"btn btn-primary col-xs-4 col-xs-offset-4"})).update("OK").observe("click",function(){b.hideModalBox()}))})),
b;g=b._getSummary();h=!1;g.rowData&&g.rowData.each(function(a){!0===a.active&&(h=!0)});if(!0!==h)return b.showModalBox('<strong class="text-danger">Error:</strong>',(new Element("div")).update(b.getAlertBox("","Required at least one component to build a kit.").addClassName("alert-danger")).insert({bottom:(new Element("div",{"class":"row"})).update((new Element("span",{"class":"btn btn-primary col-xs-4 col-xs-offset-4"})).update("OK").observe("click",function(){b.hideModalBox()}))})),b;k={items:g.rowData,
productId:f};(f=$$('[save-panel="task-id"]').first())&&!$F(f).blank()&&(k.taskId=$F(f));b._item&&b._item.id&&(k.id=b._item.id);(f=$$(".selected-kit-product-view")&&$$(".selected-kit-product-view").first()?$$(".selected-kit-product-view").first().retrieve("data"):null)&&f.id&&1*g.totalIncGst>1*b._getUnitPrice(f)?(g=(new Element("div",{"class":"confirm-div"})).insert({bottom:(new Element("div")).insert({bottom:(new Element("div")).insert({bottom:(new Element("h4")).update("You are about to build this kit with a Cost greater than the unit Price:")})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",
{"class":"col-md-4 text-right"})).update("<strong>Unit Cost inc GST for this KIT</strong>:")}).insert({bottom:(new Element("div",{"class":"col-md-8"})).update(b.getCurrency(b.getValueFromCurrency(g.totalIncGst)))})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-md-4 text-right"})).update("<strong>Unit Price inc GST for this KIT</strong>:")}).insert({bottom:(new Element("div",{"class":"col-md-8"})).update(b.getCurrency(b._getUnitPrice(f)))})}).insert({bottom:(new Element("h4")).update("Please Provide a reason to continue:")}).insert({bottom:(new Element("div")).insert({bottom:new Element("textarea",
{"class":"form-control","confirm-div":"reason",placeholder:"Some reason for sale under cost."})})}).insert({bottom:new Element("div",{"class":"msg"})})}),f=(new Element("div")).insert({bottom:(new Element("div",{"class":"col-md-6 text-left"})).insert({bottom:(new Element("div",{"class":"btn btn-default"})).update("No. Cancel").observe("click",function(){b.hideModalBox()})})}).insert({bottom:(new Element("div",{"class":"col-md-6 text-right"})).insert({bottom:(new Element("div",{"class":"btn btn-danger"})).update("Yes, Go Ahead").observe("click",
function(){l=$(this).up(".modal-content").down(".confirm-div");l.down(".msg").update("");m="";l.down('[confirm-div="reason"]')&&(m=$F(l.down('[confirm-div="reason"]')));m.blank()?l.down(".msg").update(b.getAlertBox("ERROR: ","some reason required to continue").addClassName("alert-danger")):(k.underCostReason=m,b._save(a,k))})})}),b.showModalBox('<strong class="text-danger">Warning</strong>',g,!1,f)):b._save(a,k);return b},_showKitDetails:function(){var a,b,c,d,e,f,g,h;a=this;b=$(a.getHTMLID("kitsDetailsDiv"));
if(!b)return a;c=(new Element("div",{"class":"list-group kit-components-list"})).insert({bottom:a._getProductRow(!0).addClassName("item_row_header list-group-item-success")}).insert({bottom:d=a._inputRow()}).insert({bottom:e=a._getProductRow(!0).addClassName("item_row_footer list-group-item-success")});e.down(".product").update("");e.down(".row-details").update((new Element("div")).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-8 text-right"})).update("<strong>Total Price(Exc. GST):</strong>")}).insert({bottom:(new Element("div",
{"class":"col-xs-2 text-right",summary:"total-excl-gst"})).update(a.getCurrency(0))})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-8 text-right"})).update("<strong>Total GST:</strong>")}).insert({bottom:(new Element("div",{"class":"col-xs-2 text-right",summary:"total-gst"})).update(a.getCurrency(0))})}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-8 text-right"})).update("<strong>Total Price(Inc. GST):</strong>")}).insert({bottom:(new Element("div",
{"class":"col-xs-2 text-right",summary:"total-inc-gst"})).update(a.getCurrency(0))})}));b.update((new Element("h4")).update("List of Parts Inside This Kit:")).insert({bottom:c}).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("span",{"class":"col-md-4 col-md-push-8"})).insert({bottom:(new Element("span",{"class":"btn btn-primary main-save-btn","valid-target":"row-field"})).update("Save").observe("click",function(){a._preSave(this)})})}).insert({bottom:(new Element("span",
{"class":"col-md-8 col-md-pull-4"})).insert({bottom:a._item.id?new Element("div",{"class":"comments-div"}):""})})});a._initProductSearch();d.hasClassName("form-v-loaded")||(b=jQuery("#"+a.getHTMLID("main-form")),f=b.data("formValidation"),g=a._getValidatingDataFields(),f&&f.addField&&d.getElementsBySelector(".need-validate").each(function(a){(h=a.readAttribute("form-option"))&&!h.blank()&&g[h]&&f.addField(a.name,g[h])}),d.addClassName("form-v-loaded"));return a},_getExtraInfoDiv:function(){var a;
a=this;return a._item.id?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-md-3"})).insert({bottom:a.getFormGroup((new Element("label")).update("Sold to Customer: "),(new Element("div",{"class":"form-control input-sm"})).update(a._item.soldToCustomer&&a._item.soldToCustomer.id?(new Element("a",{href:"javascript:void(0);"})).update(a._item.soldToCustomer.name).observe("click",function(){a._openURL("/customer/"+a._item.soldToCustomer.id+".html?blanklayout=1")}):""))})}).insert({bottom:a._item.soldDate?
(new Element("div",{"class":"col-md-2"})).insert({bottom:a.getFormGroup((new Element("label")).update("Sold Time: "),(new Element("div",{"class":"form-control input-sm"})).update("0001-01-01 00:00:00"===a._item.soldDate?"":(new Element("div")).update(moment(a.loadUTCTime(a._item.soldDate)).format("lll"))))}):""}).insert({bottom:(new Element("div",{"class":"col-md-4"})).insert({bottom:a.getFormGroup((new Element("label")).update("Sold on Order: "),(new Element("div",{"class":"form-control input-sm order_item"})).insert({bottom:a._item.soldOnOrder?
(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-md-3"})).insert({bottom:(new Element("a",{href:"javascript:void(0);"})).update(a._item.soldOnOrder.orderNo).observe("click",function(){a._openURL("/orderdetails/"+a._item.soldOnOrder.id+".html?blanklayout=1")})})}).insert({bottom:(new Element("div",{"class":"col-md-3",order_status:a._item.soldOnOrder.status.name})).update(a._item.soldOnOrder.status.name)}).insert({bottom:(new Element("div",{"class":"col-md-6 truncate",
title:a._item.soldOnOrder.customer.name})).update((new Element("a",{href:"javascript:void(0);"})).update(a._item.soldOnOrder.customer.name).observe("click",function(){a._openURL("/customer/"+a._item.soldOnOrder.customer.id+".html?blanklayout=1")}))}):""}))})}).insert({bottom:(new Element("div",{"class":"col-md-3"})).insert({bottom:a.getFormGroup((new Element("label")).update("Shipped Via: "),(new Element("div",{"class":"form-control input-sm"})).insert({bottom:a._item.shippment&&a._item.shippment.id?
(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-md-3 truncate",title:a._item.shippment.courier.name})).update(a._item.shippment.courier.name)}).insert({bottom:(new Element("div",{"class":"col-md-3 truncate",title:"Con. No.:"+a._item.shippment.conNoteNo})).update(a._item.shippment.conNoteNo)}).insert({bottom:(new Element("div",{"class":"col-md-6",title:"shipped on date"})).update(moment(a.loadUTCTime(a._item.shippment.shippingDate)).format("lll"))}):""}))})}):""},
_getItemDiv:function(){var a,b,c;a=this;b=(new Element("div",{"class":"save-panel"})).insert({bottom:(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-md-2"})).insert({bottom:a.getFormGroup((new Element("label")).update("For Task: "),new Element("input",{"class":"form-control select2 input-sm task-search","save-panel":"task-id",placeholder:"For Task."}))})}).insert({bottom:(new Element("div",{"class":"col-md-4 col-md-offset-2"})).insert({bottom:(new Element("h3",
{"class":"text-center"})).update(a._item.barcode&&!a._item.barcode.blank()?'Editing KIT: <img src="/asset/renderBarcode?text='+a._item.barcode+'" alt="'+a._item.barcode+'" title="'+a._item.barcode+'"/>':"Building New Kit")})}).insert({bottom:(new Element("div",{"class":"col-md-2 col-md-offset-2"})).insert({bottom:a._item&&a._item.id?(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-xs-6  text-right"})).insert({bottom:(new Element("a",{"class":"btn btn-sm btn-warning",
href:"/kit/new.html?clonekitid="+a._item.id+("1"===a.getUrlParam("blanklayout")?"&blanklayout=1":"")})).insert({bottom:(new Element("span")).update("Clone me")})})}).insert({bottom:(new Element("div",{"class":"col-xs-4"})).insert({bottom:(new Element("a",{"class":"btn btn-sm btn-primary"})).insert({bottom:new Element("i",{"class":"glyphicon glyphicon-print"})}).observe("click",function(){(c=window.open("/print/kit/"+a._item.id+".html?printlater=1","_blank","width=800"))&&c.focus()})})}):""})})}).insert({bottom:(new Element("div",
{"class":"row"})).insert({bottom:(new Element("div",{"class":"form-horizontal"})).insert({bottom:a.getFormGroup((new Element("label")).update(a._item.id?"Kit Product: ":"Building a kit as: ").addClassName("col-md-1 col-sm-2"),(new Element("div",{"class":"col-md-11 col-sm-10 rm-form-control kit-product-div"})).update(a._item.id||a._preSetData&&a._preSetData.cloneFromKit&&a._preSetData.cloneFromKit.id?"":new Element("input",{"class":"form-control select2 input-sm product-search","save-panel":"kit-product-id",
isKit:"1",onSelectFunc:"_selectKitProduct"})))})})}).insert({bottom:a._getExtraInfoDiv()}).insert({bottom:new Element("div",{id:a.getHTMLID("kitsDetailsDiv")})});b.getElementsBySelector(".rm-form-control").each(function(a){a.removeClassName("form-control").removeClassName("rm-form-control")});return b},_getProductDetailsDiv:function(a,b){var c,d,e,f;c=this;d=!0===b?!1:!0;e=new Element("div",{"class":"row"});if(!a||!a.id)return e;f=new Element("img",{"data-src":"holder.js/100%x64",src:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMzIiIHk9IjMyIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NjR4NjQ8L3RleHQ+PC9zdmc+"});
e.store("data",a).insert({bottom:(new Element("div",{"class":"col-xs-4 col-sm-3 col-md-2 col-lg-1"})).update(f)}).insert({bottom:(new Element("div",{"class":"col-xs-8 col-sm-9 col-md-10 col-lg-11"})).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-md-3 truncate"})).setStyle("max-width:none;").insert({bottom:(new Element("span",{"class":"btn btn-warning btn-xs",title:"SKU: "+a.sku})).update(a.sku).observe("click",function(){c._openURL("/product/"+a.id+".html?blanklayout=1")})})}).insert({bottom:(new Element("div",
{"class":"col-md-3"})).insert({bottom:(new Element("div",{"class":"col-xs-4 text-right"})).update("<strong>Brand</strong>:")}).insert({bottom:(new Element("div",{"class":"col-xs-8 truncate"})).update(a.manufacturer?a.manufacturer.name:"")})}).insert({bottom:(new Element("div",{"class":"col-md-6 truncate",title:a.name})).setStyle("max-width:none;").update((new Element("small")).update(a.name))}).insert({bottom:(new Element("small",{"class":"col-md-12"})).update("<em>"+a.shortDescription+"</em>")})}).insert({bottom:!0!==
d?"":(new Element("div",{"class":"row"})).insert({bottom:(new Element("div",{"class":"col-sm-3 col-md-2"})).insert({bottom:(new Element("div",{"class":"input-group input-group-sm"})).insert({bottom:(new Element("div",{"class":"input-group-addon"})).update("SOH:")}).insert({bottom:(new Element("div",{"class":"form-control"})).update(a.stockOnHand)})})}).insert({bottom:(new Element("div",{"class":"col-sm-4 col-md-3"})).insert({bottom:(new Element("div",{"class":"input-group input-group-sm"})).insert({bottom:(new Element("div",
{"class":"input-group-addon"})).update("Unit Price (inc GST):")}).insert({bottom:(new Element("div",{"class":"form-control"})).update(c.getCurrency(c._getUnitPrice(a)))})})})})});return e},_selectRowProduct:function(a){var b,c;b=$$(".item_row.item_row_new").first();if(!b)return this;(c=b.down(".product").down(".product-details"))||b.down(".product").insert({bottom:c=new Element("div",{"class":"product-details"})});c.update(this._getProductDetailsDiv(a,!0));b.down('[row-field="qty"]').setValue(1);
b.down(".totalCost").update(this.getCurrency(a.unitCost));b.down(".unitCost").update(this.getCurrency(a.unitCost));return this},_selectKitProduct:function(a){var b;b=$$(".kit-product-div").first();if(!b)return this;b.getElementsBySelector(".selected-kit-product-view").each(function(a){a.remove()});b.insert({bottom:this._getProductDetailsDiv(a).addClassName("selected-kit-product-view panel-body")});this._showKitDetails();return this},_initProductSearch:function(){var a,b,c,d,e;a=this;b=jQuery(".select2.product-search:not(.loaded)").addClass("loaded");
b.select2({placeholder:"Search a product",minimumInputLength:3,data:[],ajax:{url:"/ajax/getProducts",dataType:"json",quietMillis:250,data:function(a,c){return{entityName:"Product",searchTxt:a,isKit:b.attr("isKit"),pageNo:c,pageSize:30,userId:jQuery("#userId").attr("value")}},results:function(a,b){c=[];a.resultData.items.each(function(a){c.push({id:a.id,text:"["+a.sku+"] "+a.name,data:a})});return{results:c,more:30*b<a.resultData.pagination.totalRows}}},formatResult:function(b){return b?a._getProductDetailsDiv(b.data):
""},escapeMarkup:function(a){return a}});b.on("select2-selecting",function(b){d=$(b.target);e=d.readAttribute("onSelectFunc");if("function"===typeof a[e])a[e](b.object.data)});b.on("change",function(b){jQuery(b.target).hasClass("need-validate")&&jQuery("#"+a.getHTMLID("main-form")).formValidation("revalidateField",jQuery(b.target).attr("form-option"))});return a},_init:function(){return this},_formatTaskSelection:function(a){return a&&a.data?'<div class="row order_item item_row"><div class="col-xs-8">'+
a.data.id+'</div><div class="col-xs-4" order_status="'+a.data.status.name+'">'+a.data.status.name+"</div></div>":""},_initTaskSearch:function(){var a,b,c;a=this;b=jQuery(".select2.task-search:not(.loaded)").addClass("loaded");b.select2({minimumInputLength:1,allowClear:!0,data:[],ajax:{url:"/ajax/getAll",dataType:"json",quietMillis:250,data:function(a,b){return{entityName:"Task",searchTxt:"(id like :searchTxt and storeId = :storeId)",searchParams:{searchTxt:"%"+a+"%",storeId:jQuery("#storeId").attr("value")},
pageNo:b,pageSize:10,userId:jQuery("#userId").attr("value")}},results:function(a,b){c=[];a.resultData.items.each(function(a){c.push({id:a.id,text:a.id+" ["+a.status.name+"]",data:a})});return{results:c,more:10*b<a.resultData.pagination.totalRows}}},formatResult:function(b){return a._formatTaskSelection(b)},formatSelection:function(b){return a._formatTaskSelection(b)}});a._item.task&&a._item.task.id?b.select2("data",{id:a._item.task.id,text:a._item.task.id+" ["+a._item.task.status.name+"]",data:a._item.task}):
a._preSetData.task&&a._preSetData.task.id&&b.select2("data",{id:a._preSetData.task.id,text:a._preSetData.task.id+" ["+a._preSetData.task.status.name+"]",data:a._preSetData.task});return a},_initFormValidation:function(){var a;a=jQuery("#"+this.getHTMLID("main-form"));a.hasClass("form-v-loaded")||(a.bootstrapValidator({message:"This value is not valid",excluded:":disabled",feedbackIcons:{valid:"glyphicon glyphicon-ok",invalid:"glyphicon glyphicon-remove",validating:"glyphicon glyphicon-refresh"},fields:{}}).on("success.form.bv",
function(a){a.preventDefault()}).on("error.field.bv",function(a,c){c.bv.disableSubmitButtons(!1)}).on("success.field.bv",function(a,c){c.bv.disableSubmitButtons(!1)}),a.addClass("form-v-loaded"));return this},disableAll:function(){jQuery(".form-control").attr("disabled",!0);jQuery(".item_row_new").remove();jQuery(".row-del-btn").remove();jQuery(".main-save-btn").remove();return this},load:function(){var a={me:this};a.me._init();$(a.me.getHTMLID("itemDiv")).update(a.div=a.me._getItemDiv());a.me._initTaskSearch()._initProductSearch()._initFormValidation();
a.me._item.product&&a.me._item.product.id?(a.me._selectKitProduct(a.me._item.product),a.me._item.components&&0<a.me._item.components.size()&&a.me._item.components.each(function(b){a.me._addNewRow(b,a.newTable)})):a.me._preSetData.cloneFromKit&&a.me._preSetData.cloneFromKit.id&&(a.me._selectKitProduct(a.me._preSetData.cloneFromKit.product),a.me._preSetData.cloneFromKit.components&&0<a.me._preSetData.cloneFromKit.components.size()&&a.me._preSetData.cloneFromKit.components.each(function(b){delete b.id;
a.me._addNewRow(b,a.newTable)}));a.me._item&&a.me._item.id&&a.me._item.shippment&&a.me._item.shippment.id&&a.me.disableAll();a.div.down(".comments-div")&&a.div.down(".comments-div").store("CommentsDivJs",(new CommentsDivJs(a.me,"Kit",a.me._item.id))._setDisplayDivId(a.div.down(".comments-div")).render());return a.me}});