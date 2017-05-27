var PaymentListPanelJs=new Class.create;PaymentListPanelJs.prototype={_pageJs:null,_order:null,_creditNote:null,_canEdit:!1,_panelHTMLID:"",_showNotifyCustBox:!0,initialize:function(a,b,c,d,e){this._pageJs=a,this._panelHTMLID="PaymentListPanelJs_"+String.fromCharCode(65+Math.floor(26*Math.random()))+Date.now(),this._order=b,this._creditNote=c,this._showNotifyCustBox=!1!==e,this._canEdit=d||this._canEdit},setAfterAddFunc:function(a){var b={};return b.me=this,b.me._afterAddFunc=a,b.me},setAfterDeleteFunc:function(a){var b={};return b.me=this,b.me._afterDeleteFunc=a,b.me},getPaymentListPanel:function(){var a={};return a.me=this,a.newDiv=new Element("div",{class:"panel panel-default",id:a.me._panelHTMLID}).store("PaymentListPanelJs",a.me).insert({bottom:new Element("div",{class:"panel-heading"}).update("Payments: ")}).insert({bottom:new Element("div",{class:"panel-body"}).update(a.me._pageJs.getLoadingImg())}),a.newDiv},_deletePayment:function(a,b){var c={};if(c.me=this,c.confirmPanel=$(a).up(".deletion-confirm"),c.confirmPanel.getElementsBySelector(".msg").each(function(a){a.remove()}),c.data=c.me._pageJs._collectFormData(c.confirmPanel,"deletion-confirm"),null!==c.data)return c.data.paymentId=b.id,c.againstEntity=null,c.me._order&&c.me._order.id&&(c.againstEntity={entity:"Order",entityId:c.me._order.id}),c.me._pageJs.postAjax(c.me._paymentListPanelJs.callbackIds.delPayment,{payment:c.data,againstEntity:c.againstEntity},{onLoading:function(){c.me._signRandID(a),jQuery("#"+a.id).button("loading")},onSuccess:function(b,d){try{if(c.result=c.me._pageJs.getResp(d,!1,!0),!c.result||!c.result.item)return;c.paymentRow=$(c.me._panelHTMLID).down(".payment-item[payment-id="+c.result.item.id+"]"),c.paymentRow&&c.paymentRow.remove(),c.confirmPanel.update('<h4 class="text-success">Payment delete successfully.</h4>'),c.confirmPanel.up(".modal-content").down(".modal-header").update('<strong class="text-success">Success</strong>'),"function"==typeof c.me._afterDeleteFunc&&c.me._afterDeleteFunc(c.result.item)}catch(b){$(a).insert({before:c.me._pageJs.getAlertBox("Error",b).addClassName("alert-danger").addClassName("msg")})}},onComplete:function(){jQuery("#"+a.id).button("reset")}}),c.me},_showComments:function(a){var b={};return b.me=this,b.item=$(a),b.me._pageJs._signRandID(a),b.item.hasClassName("popover-loaded")||jQuery.ajax({type:"GET",dataType:"json",url:"/ajax/getComments",data:{entity:b.item.readAttribute("comments-entity"),entityId:b.item.readAttribute("comments-entity-Id"),type:"",storeId:jQuery("#storeId").attr("value"),userId:jQuery("#userId").attr("value")},success:function(c){b.newDiv="N/A",c.resultData&&c.resultData.items&&c.resultData.items.length>0&&(b.newDiv='<div class="list-group">',jQuery.each(c.resultData.items,function(a,c){b.newDiv+='<div class="list-group-item">',b.newDiv+='<span class="badge">'+c.type+"</span>",b.newDiv+='<strong class="list-group-item-heading"><small>'+c.createdBy.person.fullname+"</small></strong>: ",b.newDiv+="<p><small><em> @ "+b.me._pageJs.loadUTCTime(c.created).toLocaleString()+"</em></small><br /><small>"+c.comments+"</small></p>",b.newDiv+="</div>"}),b.newDiv+="</div>"),jQuery("#"+a.id).popover({html:!0,placement:"left",title:'<div class="row" style="min-width: 200px;"><div class="col-xs-10">Comments:</div><div class="col-xs-2"><a class="pull-right" href="javascript:void(0);" onclick="jQuery(\'#'+b.item.readAttribute("id")+"').popover('hide');\"><strong>&times;</strong></a></div></div>",content:b.newDiv}).popover("show"),b.item.addClassName("popover-loaded")}}),b.me},_getPaymentRow:function(a,b){var c={};return c.me=this,c.isTitle=!0===b,c.tag=!0===c.isTitle?"th":"td",c.newDiv=new Element("tr",{class:"item "+c.isTitle===!0?"":"payment-item"}).store("data",a).insert({bottom:new Element(c.tag).update(!0===c.isTitle?"Date":moment(c.me._pageJs.loadUTCTime(a.paymentDate)).format("DD/MMM/YY"))}).insert({bottom:new Element(c.tag).update(!0===c.isTitle?"Method":a.method.name)}).insert({bottom:new Element(c.tag).update(!0===c.isTitle?"Value":c.me._pageJs.getCurrency(a.value))}).insert({bottom:new Element(c.tag).update(!0===c.isTitle?"Created":a.createdBy.person.fullname+" @ "+moment(c.me._pageJs.loadUTCTime(a.created)).format("DD/MM/YY h:mm a"))}).insert({bottom:new Element(c.tag).update(!0===c.isTitle?"Comments":new Element("a",{href:"javascript: void(0);",class:"text-muted visible-lg visible-md visible-sm visible-xs",title:"comments","comments-entity-id":a.id,"comments-entity":"Payment"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-comment"})}).observe("click",function(){c.me._showComments(this)}))}).insert({bottom:new Element(c.tag).update(!0===c.isTitle?"":!0!==c.me._canEdit?"":new Element("a",{href:"javascript: void(0);",class:"text-danger",title:"Delete this payment"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-remove"})}).observe("click",function(){c.newConfirmDiv=new Element("div",{class:"deletion-confirm"}).insert({bottom:new Element("h4").update("You are about to delete a payment with a value: "+c.me._pageJs.getCurrency(a.value)+" from Method: "+a.method.name)}).insert({bottom:new Element("div",{class:"form-group"}).insert({bottom:new Element("label").update('If you want to continue, please provide a reason/comments below and click <strong class="text-danger">"YES, Delete It"</strong> below:')}).insert({bottom:c.deleteMsgBox=new Element("input",{class:"form-control",placeholder:"The reason of deleting this payment","deletion-confirm":"reason",required:!0})})}).insert({bottom:new Element("span",{class:"btn btn-danger","data-loading-text":'<i class="fa fa-refresh fa-spin"></i>'}).update("YES, Delete It").observe("click",function(){c.me._deletePayment(this,a)})}).insert({bottom:new Element("span",{class:"btn btn-default pull-right"}).update("NO, Cancel Deletion").observe("click",function(){c.me._pageJs.hideModalBox()})}),c.me._pageJs.showModalBox("Deleting a Payment?",c.newConfirmDiv),$(c.deleteMsgBox).focus()}))}),a.id&&c.newDiv.writeAttribute("payment-id",a.id),c.newDiv},_getFormGroup:function(a,b){return new Element("div",{class:"form-group"}).insert({bottom:a}).insert({bottom:b})},clearNewPaymentRow:function(){var a={};return a.me=this,$(a.me._panelHTMLID).down(".new-payment-row").replace(a.me._getCreatePaymentRow()),a.me},_submitPayment:function(a){var b={};return b.me=this,b.exceedFlag=0,b.newPaymentDiv=$(a).up(".new-payment-div"),b.newPaymentDiv.getElementsBySelector(".msg").each(function(a){a.remove()}),b.data=b.me._pageJs._collectFormData(b.newPaymentDiv,"payment_field"),null===b.data?b.me:(b.paymentDateBox=b.newPaymentDiv.down('[payment_field="paymentDate"]'),b.paymentDateBox&&(b.me._pageJs._signRandID(b.paymentDateBox),b.data.paymentDate=jQuery("#"+b.paymentDateBox.id).data("DateTimePicker").date().utc().format()),b.againstEntity=null,b.me._order&&b.me._order.id?b.againstEntity={entity:"Order",entityId:b.me._order.id}:b.me._creditNote&&b.me._creditNote.id&&(b.againstEntity={entity:"CreditNote",entityId:b.me._creditNote.id}),parseFloat(b.me._order.totalPaid)+parseFloat(b.data.paidAmount.slice(1))>parseFloat(b.me._order.totalAmount)?confirm("The total paid amount is greater than total amount.\n Would you like to continue?")&&(b.exceedFlag=1):b.exceedFlag=1,null!==b.againstEntity&&1==b.exceedFlag&&b.me._pageJs.postAjax(b.me._paymentListPanelJs.callbackIds.addPayment,{payment:b.data,againstEntity:b.againstEntity},{onLoading:function(c,d){b.me._pageJs._signRandID(a),jQuery("#"+a.id).button("loading")},onSuccess:function(a,c){try{if(b.result=b.me._pageJs.getResp(c,!1,!0),!b.result||!b.result.item)return;b.newPaymentDiv.insert({top:b.me._pageJs.getAlertBox("Success: ","Payment saved successfully!").addClassName("alert-success").addClassName("msg")}),$(b.me._panelHTMLID).down(".payment-list").insert({top:b.me._getPaymentRow(b.result.item)}),b.me.clearNewPaymentRow(),"function"==typeof b.me._afterAddFunc&&b.me._afterAddFunc(b.result.item)}catch(a){b.newPaymentDiv.insert({top:b.me._pageJs.getAlertBox("",a).addClassName("alert-danger").addClassName("msg")})}},onComplete:function(b,c){jQuery("#"+a.id).button("reset")}}),b.me)},_currencyInputChanged:function(a){var b={};return b.me=this,!$F(a).blank()&&(b.inputValue=b.me._pageJs.getValueFromCurrency($F(a)),null===b.inputValue.match(/^(-)?\d+(\.\d{1,4})?$/)?(b.me._pageJs._markFormGroupError(a,"Invalid currency format provided!"),!1):($(a).value=b.me._pageJs.getCurrency(b.inputValue),!0))},_clearCreatePaymentRow:function(a,b){var c={};return c.me=this,c.paymentDiv=a.up(".new-payment-div"),c.paymentDiv.getElementsBySelector(".after_select_method").each(function(a){a.remove()}),$F(b).blank()||!0!==c.me._currencyInputChanged(b)?void $(b).select():(c.paymentDiv.insert({bottom:!0!==c.me._showNotifyCustBox?"":new Element("div",{class:"after_select_method  col-sm-3",title:"Notify Customer?"}).insert({bottom:c.me._getFormGroup(new Element("label",{class:"control-label"}).update("Notify Cust.?"),new Element("div",{class:"text-center"}).update(new Element("input",{type:"checkbox",class:"input-sm",payment_field:"notifyCust",checked:!0})))})}).insert({bottom:new Element("div",{class:"after_select_method control-label col-sm-6"}).insert({bottom:c.me._getFormGroup(new Element("label",{class:"control-label"}).update("Comments:"),c.commentsBox=new Element("input",{type:"text",class:"after_select_method input-sm form-control",payment_field:"extraComments",required:!0,placeholder:"Some Comments"}).observe("keydown",function(a){c.me._pageJs.keydown(a,function(){c.paymentDiv.down(".add-btn").click()})}))})}).insert({bottom:new Element("div",{class:"after_select_method control-label col-sm-3"}).insert({bottom:c.me._getFormGroup("&nbsp;",new Element("span",{class:"btn btn-primary form-control add-btn","data-loading-text":'<i class="fa fa-refresh fa-spin"></i>'}).update("Save").observe("click",function(){c.me._submitPayment(this)}))})}),c.commentsBox.select(),c.me)},_getCreatePaymentRow:function(){var a={};return a.me=this,!0!==a.me._canEdit?null:(a.newDiv=new Element("tr",{class:"new-payment-row"}).insert({bottom:new Element("td",{colspan:4}).insert({bottom:new Element("div",{class:"new-payment-div"}).insert({bottom:new Element("div",{class:"col-sm-3"}).update(a.me._getFormGroup(new Element("label",{class:"control-label"}).update("Date: "),new Element("input",{class:"input-sm form-control",payment_field:"paymentDate",required:!0})))}).insert({bottom:new Element("div",{class:"col-sm-5"}).update(a.me._getFormGroup(new Element("label",{class:"control-label"}).update("Method: "),a.paymentMethodSelBox=new Element("select",{class:"input-sm form-control",payment_field:"payment_method_id",required:!0}).insert({bottom:new Element("option",{value:""}).update("Payment Method:")}).observe("change",function(){a.me._clearCreatePaymentRow(this,a.newDiv.down("[payment_field=paidAmount]"))})))}).insert({bottom:new Element("div",{class:"col-sm-4"}).update(a.me._getFormGroup(new Element("label",{class:"control-label"}).update("Amt.: "),new Element("input",{type:"text",payment_field:"paidAmount",class:"input-sm form-control",required:!0,validate_currency:!0,placeholder:"The paid amount"}).observe("change",function(){a.me._clearCreatePaymentRow(a.newDiv.down("[payment_field=payment_method_id]"),this)})))})})}),a.me.paymentMethods.each(function(b){a.paymentMethodSelBox.insert({bottom:new Element("option",{value:b.id}).update(b.name)})}),a.newDiv)},_showPayments:function(a,b){var c={};c.me=this,c.pageNo=a||1,b&&c.me._pageJs._signRandID(b),c.data=null,c.me._order&&c.me._order.id?c.data={entity:"Order",entityId:c.me._order.id,userId:jQuery("#userId").attr("value")}:c.me._creditNote&&c.me._creditNote.id&&(c.data={entity:"CreditNote",entityId:c.me._creditNote.id,userId:jQuery("#userId").attr("value")}),null!==c.data&&(c.data.pagination={pageNo:c.pageNo},c.loadingImg=c.me._pageJs.getLoadingImg(),c.me._pageJs.postAjax(PaymentListPanelJs.callbackIds.getPayments,c.data,{onLoading:function(){1===c.pageNo&&(c.panelBody=$(c.me._panelHTMLID).down(".panel-body"),c.panelBody?c.panelBody.update(c.loadingImg):$(c.me._panelHTMLID).insert({bottom:new ELement("div",{class:"panel-body"}).update(c.loadingImg)})),b&&jQuery("#"+b.id).button("loading")},onSuccess:function(a,d){try{if(c.result=c.me._pageJs.getResp(d,!1,!0),!c.result||!c.result.items)return;c.panelBody=$(c.me._panelHTMLID).down(".panel-body"),c.panelBody&&c.panelBody.remove(),c.thead=$(c.me._panelHTMLID).down("thead"),c.listPanel=$(c.me._panelHTMLID).down(".payment-list"),c.listPanel&&c.thead||$(c.me._panelHTMLID).insert({bottom:new Element("table",{class:"table table-hover table-condensed"}).insert({bottom:c.thead=new Element("thead").update(c.me._getPaymentRow({},!0))}).insert({bottom:c.listPanel=new Element("tbody",{class:"payment-list"})})}),1===c.pageNo&&c.result.paymentMethods&&(c.me.paymentMethods=c.result.paymentMethods,c.thead.insert({top:c.newRow=c.me._getCreatePaymentRow()}),c.newRow&&(c.paymentDateBox=c.newRow.down('[payment_field="paymentDate"]'),c.paymentDateBox&&(c.me._pageJs._signRandID(c.paymentDateBox),jQuery("#"+c.paymentDateBox.id).datetimepicker({format:"DD/MM/YYYY"}),jQuery("#"+c.paymentDateBox.id).data("DateTimePicker").date(new Date)))),c.result.items.each(function(a){c.listPanel.insert({bottom:c.me._getPaymentRow(a)})}),c.result.pagination&&c.result.pagination.pageNumber<c.result.pagination.totalPages&&c.listPanel.insert({bottom:new Element("tr",{class:"get-more-btn-wrapper"}).update(new Element("td",{colspan:4}).update(new Element("div",{class:"btn btn-primary"}).update("Show More Payments").observe("click",function(){c.me._showPayments(1*c.pageNo+1,b)})))})}catch(a){c.panelBody=$(c.me._panelHTMLID).down(".panel-body"),c.panelBody?c.panelBody.update(c.me._pageJs.getAlertBox("Error: ",a).addClassName("alert-danger")):c.me._pageJs.showModalBox('<strong class="text-danger">Error</strong>',a)}},onComplete:function(){c.loadingImg.remove(),b&&jQuery("#"+b.id).button("reset")}}))},load:function(){var a={};return a.me=this,$(a.me._panelHTMLID)&&a.me._showPayments(),a.me._paymentListPanelJs=PaymentListPanelJs,a.me}};