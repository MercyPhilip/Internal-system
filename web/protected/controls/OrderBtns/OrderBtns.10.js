var OrderBtnsJs=new Class.create;OrderBtnsJs.PRINT_TYPE={HTML:0,PDF:1,POS:2};
OrderBtnsJs.prototype={SEND_EMAIL_CALLBACK_ID:"",_pageJs:null,initialize:function(b,a){this._pageJs=b;this._order=a},openOrderPrintPage:function(b,a){var c,d,e,f;c=this;d=b||0;e=a||!1;f=d==OrderBtnsJs.PRINT_TYPE.POS?window.open("/printpos/order/"+c._order.id+".html?pdf="+parseInt(d),c._order.status.name+" Order "+c._order.orderNo,"width=303, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no"):window.open("/print/order/"+c._order.id+".html?pdf="+parseInt(d),
c._order.status.name+" Order "+c._order.orderNo,"width=1300, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no");f.onload=function(){f.document.title=c._order.status.name+" Order "+c._order.orderNo;f.focus();!0!==e&&f.print()};return c},openDocketPrintPage:function(b){var a,c;a=this;c=window.open("/printdocket/order/"+a._order.id+".html?pdf="+parseInt(b||0),a._order.status.name+" Order "+a._order.orderNo,"width=1300, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no");
c.onload=function(){c.document.title=a._order.status.name+" Order "+a._order.orderNo;c.focus();c.print()};return a},_sendEmail:function(b){var a,c,d,e;a=this;c=$(b).up(".confirm-div");c.getElementsBySelector(".msg").each(function(a){a.remove()});d=a._pageJs._collectFormData(c,"confirm-email");if(null!==d)return d.orderId=a._order.id,a._pageJs.postAjax(OrderBtnsJs.SEND_EMAIL_CALLBACK_ID,d,{onLoading:function(){a._signRandID(b);jQuery("#"+b.id).button("loading")},onSuccess:function(b,d){try{(e=a._pageJs.getResp(d,
!1,!0))&&e.item&&(c.update('<h4 class="text-success">Email Successfully added into the Message Queue. Will be sent within a minute</h4>'),setTimeout(function(){a._pageJs.hideModalBox()},2E3))}catch(g){c.insert({top:(new Element("h4",{"class":"msg"})).update((new Element("span",{"class":"label label-danger"})).update(g))})}},onComplete:function(){jQuery("#"+b.id).button("reset")}}),a},_getFormGroup:function(b,a){return(new Element("div",{"class":"form-group"})).insert({bottom:(new Element("label",
{"class":"control-label"})).update(b)}).insert({bottom:a.addClassName("form-control")})},_showEmailPanel:function(b){var a;a=this;b=(new Element("div",{"class":"confirm-div"})).insert({bottom:(new Element("div")).insert({bottom:a._getFormGroup("Do you want to send an email to this address:",new Element("input",{value:a._order.customer.email,"confirm-email":"emailAddress",required:!0,placeholder:"The email to send to. WIll NOT update the customer's email with this."}))})}).insert({bottom:(new Element("div")).insert({bottom:a._getFormGroup(1==
jQuery("#storeId").attr("value")?"Reply to address (default is sales@budgetpc.com.au):":"Reply to address (default is sales.heatherton@budgetpc.com.au):",new Element("input",{value:1==jQuery("#storeId").attr("value")?"sales@budgetpc.com.au":"sales.heatherton@budgetpc.com.au","confirm-email":"replyEmailAddress",required:!0,placeholder:"The email address that you want the customer to reply to."}))})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("em")).insert({bottom:(new Element("small")).update("The above email will be used to send the email to. WIll NOT update the customer's email with this.")})})}).insert({bottom:(new Element("div")).insert({bottom:a._getFormGroup("Something you want to say:",
new Element("textarea",{"confirm-email":"emailBody"}))})}).insert({bottom:(new Element("div",{"class":"text-right"})).insert({bottom:(new Element("span",{"class":"btn btn-default pull-left"})).update("CANCEL").observe("click",function(){a._pageJs.hideModalBox()})}).insert({bottom:(new Element("span",{"class":"btn btn-primary","data-loading-text":"Sending ..."})).update("Yes, send this "+a._order.type+" to this email address").observe("click",function(){a._sendEmail(this)})})});a._pageJs.showModalBox("<strong>Confirm Email Address:</strong>",
b);return a},getBtnsDiv:function(){var b;b=this;return(new Element("div",{"class":"order-btns-div"})).insert({bottom:(new Element("div",{"class":"btn-group btn-group-xs visible-xs visible-md visible-sm visible-lg"})).insert({bottom:(new Element("span",{"class":"btn btn-info"})).insert({bottom:(new Element("span",{"class":"hidden-xs hidden-sm"})).update("Print ")}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-print"})}).observe("click",function(){b.openOrderPrintPage(OrderBtnsJs.PRINT_TYPE.PDF)})}).insert({bottom:(new Element("span",
{"class":"btn btn-info dropdown-toggle","data-toggle":"dropdown","aria-expanded":"false"})).insert({bottom:new Element("span",{"class":"caret"})})}).insert({bottom:(new Element("ul",{"class":"dropdown-menu",role:"menu"})).insert({bottom:(new Element("li")).insert({bottom:(new Element("a",{href:"javascript: void(0);"})).insert({bottom:(new Element("span")).update("Print PDF ")}).insert({bottom:new Element("span",{"class":"fa fa-file-pdf-o"})}).observe("click",function(){b.openOrderPrintPage(OrderBtnsJs.PRINT_TYPE.PDF)})})}).insert({bottom:(new Element("li")).insert({bottom:(new Element("a",
{href:"javascript: void(0);"})).insert({bottom:(new Element("span")).update("Print HTML")}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-print"})}).observe("click",function(){b.openOrderPrintPage(OrderBtnsJs.PRINT_TYPE.HTML)})})}).insert({bottom:(new Element("li")).insert({bottom:(new Element("a",{href:"javascript: void(0);"})).insert({bottom:(new Element("span")).update("View HTML")}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-list-alt"})}).observe("click",
function(){b.openOrderPrintPage(OrderBtnsJs.PRINT_TYPE.HTML,!0)})})}).insert({bottom:new Element("li",{"class":"divider"})}).insert({bottom:(new Element("li")).insert({bottom:(new Element("a",{href:"javascript: void(0);"})).insert({bottom:(new Element("span")).update("Print Delivery Docket ")}).insert({bottom:new Element("span",{"class":"fa fa-file-pdf-o"})}).observe("click",function(){b.openDocketPrintPage(OrderBtnsJs.PRINT_TYPE.PDF)})})}).insert({bottom:(new Element("li")).insert({bottom:(new Element("a",
{href:"javascript: void(0);"})).insert({bottom:(new Element("span")).update("Print Delivery Docket ")}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-list-alt"})}).observe("click",function(){b.openDocketPrintPage(OrderBtnsJs.PRINT_TYPE.HTML)})})})})}).insert({bottom:(new Element("div",{"class":"btn-group btn-group-xs visible-xs visible-md visible-sm visible-lg"})).setStyle("margin-left: 3px;").insert({bottom:(new Element("span",{"class":"btn btn-success"})).insert({bottom:(new Element("span",
{"class":"hidden-xs hidden-sm"})).update("POS ")}).insert({bottom:new Element("span",{"class":"fa fa-print"})}).observe("click",function(){b.openOrderPrintPage(OrderBtnsJs.PRINT_TYPE.POS)})})}).insert({bottom:(new Element("div",{"class":"btn-group btn-group-xs visible-xs visible-md visible-sm visible-lg"})).setStyle("margin-left: 3px;").insert({bottom:(new Element("span",{"class":"btn btn-primary"})).insert({bottom:(new Element("span",{"class":"hidden-xs hidden-sm"})).update("Email ")}).insert({bottom:new Element("span",
{"class":"fa fa-envelope"})}).observe("click",function(){b._showEmailPanel(this)})})}).insert({bottom:(new Element("div",{"class":"btn-group btn-group-xs visible-xs visible-md visible-sm visible-lg"})).setStyle("margin-left: 3px;").insert({bottom:(new Element("a",{"class":"btn btn-warning",href:"/order/new.html?cloneorderid="+b._order.id,target:"_BLANK"})).update("Clone")})})}};