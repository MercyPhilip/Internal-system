var PageJs=new Class.create();PageJs.prototype=Object.extend(new BPCPageJs(),{_order:null,_orderStatuses:[],_paymentMethods:[],_payments:[],_orderItems:[],_resultDivId:"",_couriers:[],_editMode:{purchasing:false,warehouse:false,accounting:false,status:false},_commentsDiv:{pagination:{pageSize:5,pageNo:1},resultDivId:"comments_result_div",types:{purchasing:"",warehouse:""}},infoType_custName:1,infoType_custEmail:2,orderStatusIds:{warehouseCanEdit:[],purchaseCanEdit:[],canAddShipment:[]},setEditMode:function(b,d,a,c){this._editMode.purchasing=(b||false);this._editMode.warehouse=(d||false);this._editMode.accounting=(a||false);this._editMode.status=(c||false);return this},setCommentType:function(b,a){this._commentsDiv.types.purchasing=b;this._commentsDiv.types.warehouse=a;return this},setOrderStatusIds:function(b,a,c){this.orderStatusIds.purchaseCanEdit=b;this.orderStatusIds.warehouseCanEdit=a;this.orderStatusIds.canAddShipment=c;return this},setOrder:function(a,b,c){this._order=a;this._orderItems=b;this._orderStatuses=c;return this},setCourier:function(a){this._couriers=a;return this},setPaymentMethods:function(a){this._paymentMethods=a;return this},setPayments:function(a){this._payments=a;return this},_getAddressDiv:function(a,b){return new Element("div",{"class":"address-div"}).insert({bottom:new Element("strong").update(a)}).insert({bottom:new Element("dl",{"class":"dl-horizontal dl-condensed"}).insert({bottom:new Element("dt").update(new Element("span",{"class":"glyphicon glyphicon-user",title:"Customer Name"}))}).insert({bottom:new Element("dd").update(b.contactName)}).insert({bottom:new Element("dt").update(new Element("span",{"class":"glyphicon glyphicon-map-marker",title:"Address"}))}).insert({bottom:new Element("dd").insert({bottom:new Element("div").insert({bottom:new Element("div",{"class":"street inlineblock"}).update(b.street)}).insert({bottom:new Element("span",{"class":"city inlineblock"}).update(b.city+" ")}).insert({bottom:new Element("span",{"class":"region inlineblock"}).update(b.region+" ")}).insert({bottom:new Element("span",{"class":"postcode inlineblock"}).update(b.postCode)})})})})},_getfieldDiv:function(b,a){return new Element("dl",{"class":"dl-condensed"}).insert({bottom:new Element("dt").update(b)}).insert({bottom:new Element("dd").update(a)})},_getFormGroup:function(b,a){return new Element("div",{"class":"form-group"}).insert({bottom:new Element("label",{"class":"control-label"}).update(b)}).insert({bottom:a.addClassName("form-control")})},_collectData:function(b,c){var a={};a.me=this;a.data={};a.hasError=false;$$("["+b+"]").each(function(d){a.groupIndexName=(d.readAttribute(c)||null);a.fieldName=d.readAttribute(b);if(d.hasAttribute("required")&&$F(d).blank()){a.me._markFormGroupError(d,"This is requried");a.hasError=true}a.itemValue=d.readAttribute("type")!=="checkbox"?$F(d):$(d).checked;if(d.hasAttribute("validate_currency")||d.hasAttribute("validate_number")){if(a.me.getValueFromCurrency(a.itemValue).match(/^\d+(\.\d{1,2})?$/)===null){a.me._markFormGroupError(d,(d.hasAttribute("validate_currency")?d.readAttribute("validate_currency"):d.hasAttribute("validate_number")));a.hasErr=true}a.value=a.me.getValueFromCurrency(a.itemValue)}if(a.groupIndexName!==null&&a.groupIndexName!==undefined){if(!a.data[a.groupIndexName]){a.data[a.groupIndexName]={}}a.data[a.groupIndexName][a.fieldName]=a.itemValue}else{a.data[a.fieldName]=a.itemValue}});return(a.hasError===true?null:a.data)},_submitPaymentConfirmation:function(b){var a={};a.me=this;a.data=a.me._collectData("payment_field");if(a.data===null){return}a.me._signRandID(b);a.me.postAjax(a.me.getCallbackId("confirmPayment"),{payment:a.data,order:a.me._order},{onLoading:function(c,d){jQuery("#"+b.id).button("loading")},onSuccess:function(c,f){try{a.result=a.me.getResp(f,false,true);if(a.result&&a.result.item){alert("Saved Successfully!");window.location=document.URL}}catch(d){alert(d)}},onComplete:function(c,d){jQuery("#"+b.id).button("reset")}});return this},_getCommentsRow:function(a){return new Element("tr",{"class":"comments_row"}).store("data",a).insert({bottom:new Element("td",{"class":"created",width:"15%"}).update(new Element("small").update(a.created))}).insert({bottom:new Element("td",{"class":"creator",width:"15%"}).update(new Element("small").update(a.createdBy.person.fullname))}).insert({bottom:new Element("td",{"class":"type",width:"10%"}).update(new Element("small").update(a.type))}).insert({bottom:new Element("td",{"class":"comments",width:"auto"}).update(a.comments)})},_getComments:function(c,b){var a={};a.me=this;a.reset=(c||false);if(a.reset===true){$(a.me._commentsDiv.resultDivId).update("")}a.ajax=new Ajax.Request("/ajax/getComments",{method:"get",parameters:{entity:"Order",entityId:a.me._order.id,orderBy:{created:"desc"},pageNo:a.me._commentsDiv.pagination.pageNo,pageSize:a.me._commentsDiv.pagination.pageSize},onLoading:function(){if(b){jQuery("#"+b.id).button("loading")}},onSuccess:function(f){try{a.result=f.responseText.evalJSON()||{};if(a.reset===true){$(a.me._commentsDiv.resultDivId).update(a.me._getCommentsRow({type:"Type",createdBy:{person:{fullname:"WHO"}},created:"WHEN",comments:"COMMENTS"}).addClassName("header").wrap(new Element("thead")))}if(!a.result||!a.result.items){return}if($$(".new-page-btn-div").size()>0){$$(".new-page-btn-div").each(function(e){e.remove()})}a.tbody=$(a.me._commentsDiv.resultDivId).down("tbody");if(!a.tbody){$(a.me._commentsDiv.resultDivId).insert({bottom:a.tbody=new Element("tbody")})}a.result.items.each(function(e){a.tbody.insert({bottom:a.me._getCommentsRow(e)})});if(a.result.pageStats.pageNumber<a.result.pageStats.totalPages){a.tbody.insert({bottom:new Element("tr",{"class":"new-page-btn-div"}).insert({bottom:new Element("td",{colspan:4}).insert({bottom:new Element("span",{id:"comments_get_more_btn","class":"btn btn-primary","data-loading-text":"Getting More ..."}).update("Get More Comments").observe("click",function(){a.me._commentsDiv.pagination.pageNo=a.me._commentsDiv.pagination.pageNo*1+1;a.me._getComments(false,this)})})})})}}catch(d){$(a.me._commentsDiv.resultDivId).insert({bottom:a.me.getAlertBox("ERROR: ",d).addClassName("alert-danger")})}},onComplete:function(){if(b){jQuery("#"+b.id).button("reset")}}});return this},_addComments:function(b){var a={};a.me=this;a.commentsBox=$(b).up(".new_comments_wrapper").down("[new_comments=comments]");a.comments=$F(a.commentsBox);if(a.comments.blank()){return this}a.me.postAjax(a.me.getCallbackId("addComments"),{comments:a.comments,order:a.me._order},{onLoading:function(c,d){jQuery("#"+b.id).button("loading")},onSuccess:function(c,f){try{a.result=a.me.getResp(f,false,true);if(!a.result){return}a.tbody=$(a.me._commentsDiv.resultDivId).down("tbody");if(!a.tbody){$(a.me._commentsDiv.resultDivId).insert({bottom:a.tbody=new Element("tbody")})}a.tbody.insert({top:a.me._getCommentsRow(a.result)});a.commentsBox.setValue("")}catch(d){alert(d)}},onComplete:function(){jQuery("#"+b.id).button("reset")}});return this},_getEmptyCommentsDiv:function(){var a={};a.me=this;return new Element("div",{"class":"panel panel-default"}).insert({bottom:new Element("div",{"class":"panel-heading"}).update("Comments")}).insert({bottom:new Element("div",{"class":"table-responsive"}).insert({bottom:new Element("table",{id:a.me._commentsDiv.resultDivId,"class":"table table-hover table-condensed"})})}).insert({bottom:new Element("div",{"class":"panel-body new_comments_wrapper"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-2"}).update("<strong>New Comments:</strong>")}).insert({bottom:new Element("div",{"class":"col-xs-10"}).insert({bottom:new Element("div",{"class":"input-group"}).insert({bottom:new Element("input",{"class":"form-control",type:"text",new_comments:"comments",placeholder:"add more comments to this order"}).observe("keydown",function(b){a.me.keydown(b,function(){$(b.currentTarget).up(".new_comments_wrapper").down("[new_comments=btn]").click()})})}).insert({bottom:new Element("span",{"class":"input-group-btn"}).insert({bottom:new Element("span",{id:"add_new_comments_btn",new_comments:"btn","class":"btn btn-primary","data-loading-text":"saving..."}).update("add").observe("click",function(){a.me._addComments(this)})})})})})})})},_clearETA:function(b,c){var a={};a.me=this;if(!confirm("You are trying to mark a part as received/clearing the ETA?\n continue?")){return a.me}a.reason=prompt("The reason for clearing the ETA");if(a.reason===null){return a.me}a.me.postAjax(a.me.getCallbackId("clearETA"),{item_id:c.id,comments:a.reason},{onLoading:function(d,e){},onSuccess:function(d,g){try{a.result=a.me.getResp(g,false,true);if(!a.result){return}alert("ETA cleared Successfully!");window.location=document.URL}catch(f){alert(f)}},onComplete:function(d,e){}});return a.me},_getPurchasingEditCelPanel:function(a,c){var b={};b.me=this;c.insert({bottom:b.me._getfieldDiv("ETA:",b.etaBox=new Element("input",{"class":"form-control input-sm datepicker",type:"datetime",value:a.eta,update_order_item_purchase:"eta",order_item_id:a.id,required:true})).addClassName("no-stock-div dl-horizontal form-group")}).insert({bottom:b.me._getfieldDiv("Has Ordered?",new Element("input",{"class":"input-sm",type:"checkbox",update_order_item_purchase:"isOrdered",order_item_id:a.id,checked:a.isOrdered})).addClassName("no-stock-div dl-horizontal form-group")}).insert({bottom:b.me._getfieldDiv("Comments:",new Element("input",{"class":"form-control input-sm",type:"text",update_order_item_purchase:"comments",order_item_id:a.id,required:true})).addClassName("no-stock-div dl-horizontal form-group")});b.me._signRandID(b.etaBox);try{new Prado.WebUI.TDatePicker({ID:b.etaBox.id,InputMode:"TextBox",Format:"yyyy-MM-dd 17:00:00",FirstDayOfWeek:1,CalendarStyle:"default",FromYear:2009,UpToYear:2024,PositionMode:"Bottom"})}catch(d){}return b.me},_getPurchasingEditCell:function(a){var b={};b.me=this;b.hasStock=(a.eta===""?"":(a.eta==="0001-01-01 00:00:00"?true:false));b.isOrdered=(a.isOrdered===false?false:true);if(b.me._editMode.purchasing===false){return}b.editCellPanel=new Element("small",{"class":"update_order_item_purchase_div update_order_item_div"});b.editCellPanel.insert({bottom:b.me._getfieldDiv("Has Stock?",new Element("select",{"class":"form-control input-sm",update_order_item_purchase:"hasStock",required:true,order_item_id:a.id}).insert({bottom:new Element("option",{value:" "}).update("Not Checked")}).insert({bottom:new Element("option",{value:"1"}).update("Yes").writeAttribute("selected",b.hasStock===true)}).insert({bottom:new Element("option",{value:"0"}).update("No").writeAttribute("selected",b.hasStock===false)}).observe("change",function(){b.editPanel=$(this).up(".update_order_item_purchase_div");b.editPanel.getElementsBySelector(".no-stock-div").each(function(c){c.remove()});if($F(this)==="0"){b.me._getPurchasingEditCelPanel(a,b.editPanel)}})).addClassName("dl-horizontal form-group")});if(b.hasStock===false){b.me._getPurchasingEditCelPanel(a,b.editCellPanel)}return b.editCellPanel},_changeIsOrdered:function(c,a){var b={};b.me=this;b.isOrdered=$(c).checked;if(!confirm("You are going to change this order item to be: "+(b.isOrdered===true?"ORDERED":"NOT ORDERED"))){return false}b.me.postAjax(b.me.getCallbackId("changeIsOrdered"),{item_id:a.id,isOrdered:b.isOrdered},{onLoading:function(d,e){},onSuccess:function(d,g){try{b.result=b.me.getResp(g,false,true);if(!b.result){return}alert("IsOrdered flag changed Successfully!");window.location=document.URL}catch(f){alert(f)}},onComplete:function(d,e){}});return true},_getPurchasingCell:function(a){var b={};b.me=this;b.hasStock=(a.eta===""?"":(a.eta==="0001-01-01 00:00:00"?true:false));b.isOrdered=(a.isOrdered===false?false:true);if(b.me._editMode.purchasing===false||b.me.orderStatusIds.purchaseCanEdit.indexOf(b.me._order.status.id*1)<0){b.newDiv=new Element("small");if(b.hasStock===""){return b.newDiv.update("Not Checked")}b.newDiv.insert({bottom:new Element("span",{"class":b.hasStock?"text-success":"text-danger"}).insert({bottom:new Element("strong").update("hasStock? ")}).insert({bottom:new Element("span",{"class":"glyphicon "+(b.hasStock?"glyphicon-ok-circle":"glyphicon-remove-circle")})}).insert({bottom:new Element("a",{href:"javascript: void(0);","class":"text-muted pull-right popover-comments",title:"comments","comments-type":b.me._commentsDiv.types.purchasing,"comments-entity-id":a.id,"comments-entity":"OrderItem"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-comment"})})})});if(b.hasStock===false){b.newDiv.insert({bottom:new Element("span").update("&nbsp;&nbsp;")}).insert({bottom:new Element("span").insert({bottom:new Element("strong").update("ETA: ")}).insert({bottom:new Element("span").insert({bottom:new Element("small").update(a.eta+" ")}).insert({bottom:new Element("a",{href:"javascript: void(0);","class":"text-danger",title:"clear ETA"}).update(new Element("span",{"class":"glyphicon glyphicon-remove"})).observe("click",function(){b.me._clearETA(this,a)})})})}).insert({bottom:new Element("span").update("&nbsp;&nbsp;")}).insert({bottom:new Element("span").insert({bottom:new Element("strong").update("Is Ordered: ")}).insert({bottom:new Element("input",{type:"checkbox",checked:b.isOrdered}).observe("change",function(c){return b.me._changeIsOrdered(this,a)})})})}return b.newDiv}return b.me._getPurchasingEditCell(a)},_getWarehouseEditCell:function(a){var b={};b.me=this;b.isPicked=(a.isPicked===true);b.editCellPanel=new Element("small",{"class":"update_order_item_warehouse_div update_order_item_div"});b.editcommentsDiv=b.me._getfieldDiv("Comments:",new Element("input",{"class":"form-control input-sm",type:"text",update_order_item_warehouse:"comments",order_item_id:a.id,required:true})).addClassName("no-stock-div dl-horizontal form-group");b.editCellPanel.insert({bottom:b.me._getfieldDiv("Picked?",new Element("select",{"class":"form-control input-sm",update_order_item_warehouse:"isPicked",order_item_id:a.id}).insert({bottom:new Element("option",{value:"1"}).update("Yes").writeAttribute("selected",b.isPicked===true)}).insert({bottom:new Element("option",{value:"0"}).update("No").writeAttribute("selected",b.isPicked===false)}).observe("change",function(){b.editPanel=$(this).up(".update_order_item_warehouse_div");b.editPanel.getElementsBySelector(".no-stock-div").each(function(c){c.remove()});if($F(this)==="0"){b.editCellPanel.insert({bottom:b.editcommentsDiv})}})).addClassName("dl-horizontal form-group")});if(b.isPicked===false){b.editCellPanel.insert({bottom:b.editcommentsDiv})}return b.editCellPanel},_getWarehouseCell:function(a){var b={};b.me=this;if(b.me._editMode.warehouse===false||b.me.orderStatusIds.warehouseCanEdit.indexOf(b.me._order.status.id*1)<0){return new Element("small").insert({bottom:new Element("span",{"class":a.isPicked?"text-success":"text-danger"}).insert({bottom:new Element("strong").update("Picked? ")}).insert({bottom:new Element("span",{"class":"glyphicon "+(a.isPicked?"glyphicon-ok-circle":"glyphicon-remove-circle")})}).insert({bottom:new Element("a",{href:"javascript: void(0);","class":"text-muted pull-right popover-comments",title:"comments","comments-type":b.me._commentsDiv.types.warehouse,"comments-entity-id":a.id,"comments-entity":"OrderItem"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-comment"})})})})}return b.me._getWarehouseEditCell(a)},_getProductRow:function(b,a){var c={};c.me=this;c.isTitle=(a||false);c.tag=(c.isTitle===true?"th":"td");return new Element("tr",{"class":(c.isTitle===true?"":"productRow"),order_item_id:b.id}).store("data",b).insert({bottom:new Element(c.tag,{"class":"productName"}).update(b.product.name+(c.isTitle===true?"":"<small class='pull-right'><strong>SKU: </strong>"+b.product.sku+"</small>"))}).insert({bottom:new Element(c.tag,{"class":"uprice"}).update(c.isTitle===true?b.unitPrice:c.me.getCurrency(b.unitPrice))}).insert({bottom:new Element(c.tag,{"class":"qty"}).update(b.qtyOrdered)}).insert({bottom:new Element(c.tag,{"class":"tprice"}).update(c.isTitle===true?b.totalPrice:c.me.getCurrency(b.totalPrice))}).insert({bottom:new Element(c.tag,{"class":"purchasing"}).update(c.isTitle===true?"Purchasing":c.me._getPurchasingCell(b))}).insert({bottom:new Element(c.tag,{"class":"warehouse"}).update(c.isTitle===true?"Warehouse":c.me._getWarehouseCell(b))})},_updateOrderItems:function(d,a,e,b){var c={};c.me=this;c.notifyCustomer=(b||false);c.btn=$(d);c.me._signRandID(c.btn);c.me.postAjax(c.me.getCallbackId("updateOrder"),{items:a,order:c.me._order,"for":e,notifyCustomer:c.notifyCustomer},{onLoading:function(f,g){jQuery("#"+c.btn.id).button("loading")},onSuccess:function(f,h){try{c.result=c.me.getResp(h,false,true);if(!c.result){return}alert("Saved Successfully!");window.location=document.URL}catch(g){alert(g)}},onComplete:function(f,g){jQuery("#"+c.btn.id).button("reset")}});return c.me},_getPurchasingBtns:function(){var a={};a.me=this;if(a.me._editMode.purchasing===false||a.me.orderStatusIds.purchaseCanEdit.indexOf(a.me._order.status.id*1)<0){return}return new Element("div",{"class":"row"}).insert({bottom:new Element("span",{"class":"col-xs-7",title:"Notify Customer?"}).insert({bottom:new Element("label",{"for":"notify-customer-purchasing"}).update("Notify Cust.?")}).insert({bottom:a.notifyCustBox=new Element("input",{type:"checkbox",id:"notify-customer-purchasing",checked:true})})}).insert({bottom:new Element("span",{"class":"col-xs-5",title:"Notify Customer?"}).insert({bottom:new Element("span",{"class":"btn btn-primary","data-loading-text":"Saving..."}).update("submit").observe("click",function(){a.btn=this;a.me._signRandID(a.btn);a.data=a.me._collectData("update_order_item_purchase","order_item_id");if(a.data===null){return}a.me._updateOrderItems(a.btn,a.data,a.me._commentsDiv.types.purchasing,a.notifyCustBox.checked)})})})},_getWHBtns:function(){var a={};a.me=this;if(a.me._editMode.warehouse===false||a.me.orderStatusIds.warehouseCanEdit.indexOf(a.me._order.status.id*1)<0){return""}return new Element("div",{"class":"row"}).insert({bottom:new Element("span",{"class":"col-xs-7",title:"Notify Customer?"}).insert({bottom:new Element("label",{"for":"notify-customer-purchasing"}).update("Notify Cust.?")}).insert({bottom:a.notifyCustBox=new Element("input",{type:"checkbox",id:"notify-customer-purchasing",checked:true})})}).insert({bottom:new Element("span",{"class":"col-xs-5",title:"Notify Customer?"}).insert({bottom:new Element("span",{"class":"btn btn-primary","data-loading-text":"Saving..."}).update("submit").observe("click",function(){a.btn=this;a.data=a.me._collectData("update_order_item_warehouse","order_item_id");if(a.data===null){return}a.me._updateOrderItems(a.btn,a.data,a.me._commentsDiv.types.warehouse,a.notifyCustBox.checked)})})})},_getPartsTable:function(){var a={};a.me=this;a.productListDiv=new Element("table",{"class":"table table-hover table-condensed order_change_details_table"}).insert({bottom:a.me._getProductRow({product:{sku:"SKU",name:"Product Name"},unitPrice:"Unit Price",qtyOrdered:"Qty",totalPrice:"Total Price"},true).wrap(new Element("thead"))});a.productListDiv.insert({bottom:a.tbody=new Element("tbody")});a.me._orderItems.each(function(b){a.tbody.insert({bottom:a.me._getProductRow(b)})});a.tfoot=new Element("tfoot").update(a.me._getProductRow({product:{sku:"",name:""},unitPrice:"",qtyOrdered:"",totalPrice:""},true).addClassName("submitBtns"));a.tfoot.down(".purchasing").update(a.me._getPurchasingBtns());a.tfoot.down(".warehouse").update(a.me._getWHBtns());a.productListDiv.insert({bottom:a.tfoot});return new Element("div",{"class":"panel panel-default"}).insert({bottom:new Element("div",{"class":"panel-body table-responsive"}).insert({bottom:a.productListDiv})})},_signRandID:function(a){if(!a.id){a.id="input_"+String.fromCharCode(65+Math.floor(Math.random()*26))+Date.now()}return this},_markFormGroupError:function(a,c){var b={};b.me=this;if(a.up(".form-group")){a.up(".form-group").addClassName("has-error");b.me._signRandID(a);jQuery("#"+a.id).tooltip({trigger:"manual",placement:"auto",container:"body",placement:"bottom",html:true,title:c}).tooltip("show");$(a).observe("change",function(){a.up(".form-group").removeClassName("has-error");jQuery(this).tooltip("hide").tooltip("destroy").show()})}return b.me},_checkAndSubmitShippingOptions:function(b){var a={};a.me=this;a.shippingDiv=$(b).up(".save_shipping_panel");a.finalShippingDataArray=a.me._collectData("save_shipping");if(a.finalShippingDataArray===null){return}a.me.postAjax(a.me.getCallbackId("updateShippingInfo"),{shippingInfo:a.finalShippingDataArray,order:a.me._order},{onLoading:function(c,d){jQuery("#"+b.id).button("loading")},onSuccess:function(c,f){try{a.result=a.me.getResp(f,false,true);if(!a.result){return}alert("Saved Successfully!");window.location=document.URL}catch(d){$(b).up(".row").insert({bottom:a.me.getAlertBox("ERROR: ",d).addClassName("alert-danger col-xs-12")})}},onComplete:function(c,d){jQuery("#"+b.id).button("reset")}})},_getShippmentRow:function(){var a={};a.me=this;a.shipmentDiv=new Element("div",{"class":"panel panel-default"}).insert({bottom:new Element("div",{"class":"panel-heading"}).update("Shipment")});if(a.me._order.shippments.size()>0){a.shippingInfos=a.me._order.shippments;a.shipmentListDiv=new Element("small",{"class":"viewShipping list-group"});a.shippingInfos.each(function(b){a.shipmentListDiv.insert({bottom:new Element("div",{"class":"list-group-item"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:a.me._getfieldDiv("Date:",b.shippingDate).wrap(new Element("div",{"class":"col-xs-6 col-sm-2"}))}).insert({bottom:a.me._getfieldDiv("Est./Act.",a.me.getCurrency(b.estShippingCost)+" / "+a.me.getCurrency(b.actualShippingCost)).writeAttribute("title","Estimated Shipping Cost VS. Actual Shipping Cost").wrap(new Element("div",{"class":"col-xs-6 col-sm-2"}))}).insert({bottom:a.me._getfieldDiv("Receiver:",b.receiver).wrap(new Element("div",{"class":"col-xs-6 col-sm-2"}))}).insert({bottom:a.me._getfieldDiv("Contact No:",(b.contact)).wrap(new Element("div",{"class":"col-xs-6 col-sm-2"}))}).insert({bottom:a.me._getfieldDiv("Courier:",(b.courier.name)).wrap(new Element("div",{"class":"col-xs-3 col-sm-1"}))}).insert({bottom:a.me._getfieldDiv("Con. No:",b.conNoteNo).writeAttribute("title","Consignment Note Number").wrap(new Element("div",{"class":"col-xs-6 col-sm-2"}))}).insert({bottom:a.me._getfieldDiv("Cartons:",b.noOfCartons).writeAttribute("title","No Of Cartons Send On This Shipment").wrap(new Element("div",{"class":"col-xs-3 col-sm-1"}))}).insert({bottom:a.me._getfieldDiv("Shipping Address:","<small><em>"+b.address.full+"</em></small>").wrap(new Element("div",{"class":"col-xs-12 col-sm-6"}))}).insert({bottom:a.me._getfieldDiv("Delivery Instructions:",b.deliveryInstructions).wrap(new Element("div",{"class":"col-xs-12 col-xs-6"}))})})})});a.shipmentDiv.insert({bottom:a.shipmentListDiv})}if(a.me._editMode.warehouse===false||a.me.orderStatusIds.canAddShipment.indexOf(a.me._order.status.id*1)<0){return a.shipmentDiv}a.shipmentDivBody=new Element("div",{"class":"panel-body save_shipping_panel"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-2"}).insert({bottom:a.me._getFormGroup("Contact Name:",new Element("input",{type:"text",save_shipping:"contactName",required:true,"class":"input-sm",value:a.me._order.address.shipping.contactName}))})}).insert({bottom:new Element("div",{"class":"col-sm-2"}).insert({bottom:a.me._getFormGroup("Contact No:",new Element("input",{type:"tel",save_shipping:"contactNo",required:true,"class":"input-sm",value:a.me._order.address.shipping.contactNo}))})}).insert({bottom:new Element("div",{"class":"col-sm-2 bg-info"}).insert({bottom:a.me._getFormGroup("Courier:",a.me._getCourierList().writeAttribute("save_shipping","courierId").writeAttribute("required",true))})}).insert({bottom:new Element("div",{"class":"col-sm-2 bg-info"}).insert({bottom:a.me._getFormGroup("Carton(s):",new Element("input",{type:"number",required:true,save_shipping:"noOfCartons","class":"input-sm",validate_number:"Only accept whole number!"}).observe("change",function(){a.inputBox=this;a.inputValue=$F(a.inputBox).strip();if(a.inputValue.match(/^\d+?$/)===null){a.me._markFormGroupError(a.inputBox,"Only accept whole number!");return false}a.inputBox.value=a.inputValue}))})}).insert({bottom:new Element("div",{"class":"col-sm-2 bg-info"}).insert({bottom:a.me._getFormGroup("Con. No:",new Element("input",{type:"text",required:true,save_shipping:"conNoteNo","class":"input-sm"})).writeAttribute("title","The consignment number of this shipping")})}).insert({bottom:new Element("div",{"class":"col-sm-2 bg-info"}).insert({bottom:a.me._getFormGroup("Cost($)",new Element("input",{type:"text",required:true,save_shipping:"actualShippingCost","class":"input-sm",validate_currency:"Invalid currency provided"}).observe("change",function(){a.me._currencyInputChanged(this)})).writeAttribute("title","The actual cost of this shipping")})})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-4"}).insert({bottom:a.me._getFormGroup("Street:",new Element("input",{type:"text",required:true,save_shipping:"street","class":"input-sm",value:a.me._order.address.shipping.street}))})}).insert({bottom:new Element("div",{"class":"col-sm-2"}).insert({bottom:a.me._getFormGroup("City:",new Element("input",{type:"text",required:true,save_shipping:"city","class":"input-sm",value:a.me._order.address.shipping.city}))})}).insert({bottom:new Element("div",{"class":"col-sm-2"}).insert({bottom:a.me._getFormGroup("State:",new Element("input",{type:"text",required:true,save_shipping:"region","class":"input-sm",value:a.me._order.address.shipping.region}))})}).insert({bottom:new Element("div",{"class":"col-sm-2"}).insert({bottom:a.me._getFormGroup("Country:",new Element("input",{type:"text",required:true,save_shipping:"country","class":"input-sm",value:a.me._order.address.shipping.country}))})}).insert({bottom:new Element("div",{"class":"col-sm-2"}).insert({bottom:a.me._getFormGroup("Post Code:",new Element("input",{type:"text",required:true,save_shipping:"postCode","class":"input-sm",value:a.me._order.address.shipping.postCode}))})})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-8"}).insert({bottom:a.me._getFormGroup("Delivery Instruction:",new Element("textarea",{save_shipping:"deliveryInstructions","class":"input-sm",rows:2}))})}).insert({bottom:new Element("div",{"class":"col-sm-2"}).insert({bottom:a.me._getFormGroup("Notify Cust?",new Element("input",{type:"checkbox",save_shipping:"notifyCust","class":"input-sm",checked:true}))})}).insert({bottom:new Element("div",{"class":"col-sm-2"}).insert({bottom:a.me._getFormGroup("&nbsp;",new Element("span",{id:"shipping_save_btn","class":"btn btn-primary","data-loading-text":"Saving..."}).update("Save").observe("click",function(){a.me._checkAndSubmitShippingOptions(this)}))})})});a.shipmentDiv.down(".panel-heading").insert({after:a.shipmentDivBody});return a.shipmentDiv},_changeOrderStatus:function(b){var a={};a.me=this;a.msg="About to change the status of this order?\n Continue?";if(confirm(a.msg)){a.comments="";while(a.comments!==null&&a.comments.blank()){a.comments=window.prompt("Please Type in the reason for changing:")}if(a.comments===null){$(b).replace(a.me._getOrderStatus());return this}a.me.postAjax(a.me.getCallbackId("changeOrderStatus"),{order:a.me._order,orderStatusId:$F(b),comments:a.comments},{onLoading:function(c,d){$(b).disabled=true},onSuccess:function(c,f){try{a.result=a.me.getResp(f,false,true);alert("Saved Successfully!");window.location=document.URL}catch(d){alert(d);$(b).disabled=false;$(b).replace(a.me._getOrderStatus())}},onComplete:function(c,d){}});return this}$(b).replace(a.me._getOrderStatus());return this},_getOrderStatus:function(){var a={};a.me=this;if(a.me._editMode.status!==true){return a.me._order.status.name}a.selBox=new Element("select").observe("change",function(){a.me._changeOrderStatus(this)});a.me._orderStatuses.each(function(b){a.opt=new Element("option",{value:b.id}).update(b.name);if(b.id===a.me._order.status.id){a.opt.writeAttribute("selected",true)}a.selBox.insert({bottom:a.opt})});return a.selBox},_getAddressPanel:function(){var a={};a.me=this;a.custName=a.custEmail="n/a";if(a.me._order.infos&&a.me._order.infos!==null){if(a.me._order.infos[a.me.infoType_custName]&&a.me._order.infos[a.me.infoType_custName].length>0){a.custName=a.me._order.infos[a.me.infoType_custName][0].value}if(a.me._order.infos[a.me.infoType_custEmail]&&a.me._order.infos[a.me.infoType_custEmail].length>0){a.custEmail=a.me._order.infos[a.me.infoType_custEmail][0].value}}return new Element("div",{"class":"panel panel-default"}).insert({bottom:new Element("div",{"class":"panel-heading"}).insert({bottom:new Element("strong").update(a.me._order.orderNo)}).insert({bottom:new Element("span",{"class":"pull-right"}).update("Status: ").insert({bottom:a.me._getOrderStatus()})})}).insert({bottom:new Element("div",{"class":"panel-body"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-6"}).insert({bottom:new Element("strong").update("Customer: ")}).insert({bottom:a.custName})}).insert({bottom:new Element("div",{"class":"col-sm-6"}).insert({bottom:new Element("a",{href:"mailto:"+a.custEmail}).update(a.custEmail)})})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:a.me._getAddressDiv("Shipping Address: ",a.me._order.address.shipping).addClassName("col-xs-6")}).insert({bottom:a.me._getAddressDiv("Billing Address: ",a.me._order.address.billing).addClassName("col-xs-6")})})})},_getInfoPanel:function(){var a={};a.me=this;a.orderDate=new Date(a.me._order.orderDate.strip().replace(" ","T"));return new Element("div",{"class":"panel panel-default order-info-div"}).insert({bottom:new Element("div",{"class":"panel-heading text-right"}).insert({bottom:new Element("small").update("Order Date: ")}).insert({bottom:new Element("strong").update(a.orderDate.toLocaleDateString())})}).insert({bottom:new Element("div",{"class":"panel-body"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-4 text-right"}).update("<strong><small>Shipping:</small></strong>")}).insert({bottom:new Element("div",{"class":"col-xs-8"}).update("<em><small>"+a.me._order.infos[9][0].value+"</small></em>")})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-4 text-right"}).update("<strong><small>Mage Payment:</small></strong>")}).insert({bottom:new Element("div",{"class":"col-xs-8"}).update(a.me._order.infos[6][0].value)})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-4 text-right"}).update("<strong><small>Total Amount:</small></strong>")}).insert({bottom:new Element("div",{"class":"col-xs-8"}).update(a.me.getCurrency(a.me._order.totalAmount))})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-4 text-right"}).update("<strong><small>Total Paid:</small></strong>")}).insert({bottom:new Element("div",{"class":"col-xs-8"}).update(a.me.getCurrency(a.me._order.totalAmount))})}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-xs-4 text-right"}).update("<strong><small>Total Due:</small></strong>")}).insert({bottom:new Element("div",{"class":"col-xs-8"}).update(a.me.getCurrency(a.me._order.totalDue))})})})},_currencyInputChanged:function(a){var b={};b.me=this;if($F(a).blank()){return false}b.inputValue=b.me.getValueFromCurrency($F(a));if(b.inputValue.match(/^\d+(\.\d{1,2})?$/)===null){b.me._markFormGroupError(a,"Invalid currency format provided!");return false}$(a).value=b.me.getCurrency(b.inputValue);return true},_getPaymentRow:function(){var a={};a.me=this;a.paymentDiv=new Element("div",{"class":"panel panel-default payment_row_panel"}).insert({bottom:new Element("div",{"class":"panel-heading"}).update("Payments")});if(a.me._editMode.accounting===true){a.clearConfirmPanel=function(b,c){a.paymentDiv.getElementsBySelector(".after_select_method").each(function(d){d.remove()});if($F(c).blank()||a.me._currencyInputChanged(c)!==true){$(c).select();return}a.wrapperDiv=a.paymentDivBody.down(".row");a.wrapperDiv.insert({bottom:new Element("div",{"class":"after_select_method col-sm-4",title:"Notify Customer?"}).insert({bottom:a.me._getFormGroup("Notify Cust.?",new Element("input",{type:"checkbox","class":"input-sm",payment_field:"notifyCust",checked:true}))})});if(Math.abs(Math.abs(parseFloat(a.me.getValueFromCurrency($F(c))).toFixed(2))-Math.abs(parseFloat(a.me.getValueFromCurrency(a.me._order.totalAmount)).toFixed(2)))!==0){a.wrapperDiv.insert({bottom:new Element("div",{"class":"after_select_method col-sm-8"}).insert({bottom:a.me._getFormGroup("Comments:",a.commentsBox=new Element("input",{type:"text","class":"after_select_method input-sm",payment_field:"extraComments",required:true,placeholder:"The reason why the paidAmount is different to Total Amount Due: "+a.me.getCurrency(a.me._order.totalAmount)}))})});a.commentsBox.select()}a.wrapperDiv.insert({bottom:new Element("div",{"class":"after_select_method col-sm-4"}).insert({bottom:a.me._getFormGroup("&nbsp;",new Element("span",{"class":"btn btn-primary after_select_method","data-loading-text":"Saving..."}).update("Confirm").observe("click",function(){a.me._submitPaymentConfirmation(this)}))})})};a.paymentMethodSelBox=new Element("select",{"class":"input-sm",payment_field:"payment_method_id",required:true}).insert({bottom:new Element("option",{value:""}).update("")}).observe("change",function(){a.clearConfirmPanel(this,a.paymentDiv.down("[payment_field=paidAmount]"))});a.me._paymentMethods.each(function(b){a.paymentMethodSelBox.insert({bottom:new Element("option",{value:b.id}).update(b.name)})});a.paymentDivBody=new Element("div",{"class":"panel-body panel_row_confirm_panel"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-4"}).insert({bottom:a.me._getFormGroup("Method:",a.paymentMethodSelBox)})}).insert({bottom:new Element("div",{"class":"col-sm-4"}).insert({bottom:a.me._getFormGroup("Paid:",new Element("input",{type:"text",payment_field:"paidAmount","class":"input-sm",required:true,validate_currency:true}).observe("change",function(){a.clearConfirmPanel(a.paymentMethodSelBox,this)}))})})});a.paymentDiv.insert({bottom:a.paymentDivBody})}if(a.me._payments.size()>0){a.paymentDiv.insert({bottom:new Element("table",{"class":"table table-hover table-condensed"}).insert({bottom:new Element("thead").insert({bottom:new Element("th").update("Method")}).insert({bottom:new Element("th").update("value")}).insert({bottom:new Element("th").update("Confirmed By")}).insert({bottom:new Element("th").update("Confirmed @")}).insert({bottom:new Element("th").update("Comments")})}).insert({bottom:a.tbody=new Element("tbody")})});a.me._payments.each(function(b){a.tbody.insert({bottom:new Element("tr").insert({bottom:new Element("td").update(b.method.name)}).insert({bottom:new Element("td").update(a.me.getCurrency(b.value))}).insert({bottom:new Element("td").update(b.createdBy.person.fullname)}).insert({bottom:new Element("td").update(b.created)}).insert({bottom:new Element("td").insert({bottom:new Element("a",{href:"javascript: void(0);","class":"text-muted popover-comments",title:"comments","comments-entity-id":b.id,"comments-entity":"Payment"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-comment"})})})})})})}return a.paymentDiv},init:function(b){var a={};a.me=this;a.me._resultDivId=b;$(a.me._resultDivId).update(new Element("div").insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-sm-8"}).insert({bottom:a.me._getAddressPanel()})}).insert({bottom:new Element("div",{"class":"col-sm-4"}).insert({bottom:a.me._getInfoPanel()})})}).insert({bottom:a.me._getPartsTable()}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("div",{"class":"col-md-8"}).update(a.me._getShippmentRow())}).insert({bottom:new Element("div",{"class":"col-md-4"}).update(a.me._getPaymentRow())})}).insert({bottom:a.me._getEmptyCommentsDiv()}));return this},load:function(){var a={};a.me=this;a.me._getComments(true);$$(".datepicker").each(function(b){new Prado.WebUI.TDatePicker({ID:b.id,InputMode:"TextBox",Format:"yyyy-MM-dd 17:00:00",FirstDayOfWeek:1,CalendarStyle:"default",FromYear:2009,UpToYear:2024,PositionMode:"Bottom"})});jQuery(".popover-comments").click(function(){a.me._signRandID($(this));a.item=jQuery(this).removeAttr("title").addClass("visible-lg visible-md visible-sm visible-xs");if(!a.item.hasClass("popover-loaded")){jQuery.ajax({type:"GET",dataType:"json",url:"/ajax/getComments",data:{entity:a.item.attr("comments-entity"),entityId:a.item.attr("comments-entity-Id"),type:a.item.attr("comments-type")},success:function(b){a.newDiv="N/A";if(b.items&&b.items.length>0){a.newDiv='<div class="list-group">';jQuery.each(b.items,function(c,d){a.newDiv+='<div class="list-group-item">';a.newDiv+='<span class="badge">'+d.type+"</span>";a.newDiv+='<strong class="list-group-item-heading"><small>'+d.createdBy.person.fullname+"</small></strong>: ";a.newDiv+="<p><small><em> @ "+d.created+"</em></small><br /><small>"+d.comments+"</small></p>";a.newDiv+="</div>"});a.newDiv+="</div>"}a.item.popover({html:true,placement:"left",title:'<div class="row" style="min-width: 200px;"><div class="col-xs-10">Comments:</div><div class="col-xs-2"><a class="pull-right" href="javascript:void(0);" onclick="jQuery(\'#'+a.item.attr("id")+"').popover('hide');\"><strong>&times;</strong></a></div></div>",content:a.newDiv}).popover("show");a.item.addClass("popover-loaded")}})}});return a.me},_getCourierList:function(){var a={};a.me=this;a.courierSelect=new Element("select").insert({bottom:new Element("option",{value:""}).update("")});a.me._couriers.each(function(b){a.courierSelect.insert({bottom:new Element("option",{value:b.id}).update(b.name)})});return a.courierSelect}});