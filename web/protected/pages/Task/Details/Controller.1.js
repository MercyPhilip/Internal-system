var PageJs=new Class.create;
PageJs.prototype=Object.extend(new DetailsPageJs,{_preSetData:{},setTaskStatuses:function(a){this._statuses=a;return this},setPreSetData:function(a){this._preSetData=a;return this},refreshParentWindow:function(a){var b;window.parent&&(b=window.parent)&&b.pageJs&&b.pageJs.refreshTaskRow&&a&&b.pageJs.refreshTaskRow(a)},_preSubmit:function(a){var b,d,c,e;b=this;if(!$(a)||!$(a).hasClassName("save-btn"))return b;d={};b._item.id&&(d.id=b._item.id);$(a).up(".task-details-wrapper").getElementsBySelector("[save-panel]").each(function(a){c=a.readAttribute("save-panel");
a.hasClassName("datepicker")?(b._signRandID(a),e=jQuery("#"+a.id).data("DateTimePicker").date().utc().format()):(a.hasClassName("rich-text")&&(a.retrieve("editor").toggle(),a.retrieve("editor").toggle()),e=$F(a));d[c]=e});b.saveItem(a,d,function(a){b.refreshParentWindow(a.item);b.showModalBox('<strong class="text-success">Saved</strong>','<h4 class="text-success">Task ('+a.item.id+") has been saved successfully</h4>");a.url?window.location=a.url:window.parent&&window.parent.jQuery.fancybox&&window.parent.jQuery.fancybox.close&&
window.parent.jQuery.fancybox.close()});return b},_getItemDiv:function(){var a,b,d,c,e;a=this;b=(new Element("div",{"class":"task-details-wrapper"})).insert({bottom:(new Element("div",{"class":"text-center"})).insert({bottom:(new Element("h3")).update(a._item.id?"Editing Task :"+a._item.id:"Creating a new Task")})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-sm-3"})).insert({bottom:a.getFormGroup((new Element("label")).update("Customer: "),new Element("input",
{"class":"form-control select2","save-panel":"customerId",name:"customer",placeholder:"search a customer name here"}))})}).insert({bottom:(new Element("div",{"class":"col-sm-2"})).insert({bottom:a.getFormGroup((new Element("label")).update("Due Date: "),new Element("input",{"class":"form-control datepicker","save-panel":"dueDate",name:"dueDate",value:a._item.id?moment(a.loadUTCTime(a._item.dueDate)).format("DD/MM/YYYY hh:mm A"):""}))})}).insert({bottom:a._item.id?(new Element("div",{"class":"col-sm-1"})).insert({bottom:a.getFormGroup((new Element("label")).update("Status: "),
d=new Element("select",{"class":"form-control select2","save-panel":"statusId"}))}):""}).insert({bottom:(new Element("div",{"class":"col-sm-2"})).insert({bottom:a.getFormGroup((new Element("label")).update("Technician: "),new Element("input",{"class":"form-control select2","save-panel":"techId",placeholder:"search a tech name here"}))})}).insert({bottom:(new Element("div",{"class":a._item.id?"col-sm-4":"col-sm-5"})).insert({bottom:a.getFormGroup((new Element("label")).update("From Order: "),a._item.order&&
a._item.order.id?(new Element("a")).update(a._item.order.orderNo):new Element("input",{"class":"form-control select2","save-panel":"orderId",placeholder:"search a Order here"}))})})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-sm-12"})).insert({bottom:a.getFormGroup((new Element("label")).update("Instructions: "),(new Element("textarea",{"class":"form-control rich-text","save-panel":"instructions",rows:10,name:"instructions"})).update(a._item.id?a._item.instructions:
""))})})}).insert({bottom:(new Element("div")).insert({bottom:(new Element("div",{"class":"col-sm-12"})).insert({bottom:a._item.id?new Element("div",{"class":"comments-div"}):""})})}).insert({bottom:(new Element("div")).insert({bottom:c=(new Element("button",{type:"submit","class":"btn btn-primary col-sm-3 col-sm-offset-9 save-btn"})).update("save")})});a._signRandID(c);d&&a._statuses.each(function(b){e=(new Element("option",{value:b.id})).update(b.name);a._item.id&&b.id===a._item.status.id&&e.writeAttribute("selected",
!0);d.insert({bottom:e})});return b},_loadRichTextEditor:function(a){var b;this._signRandID(a);b=new TINY.editor.edit("editor",{id:a.id,width:"100%",height:180,cssclass:"tinyeditor",controlclass:"tinyeditor-control",rowclass:"tinyeditor-header",dividerclass:"tinyeditor-divider",controls:"bold italic underline strikethrough | subscript superscript | orderedlist unorderedlist | outdent indent | leftalign centeralign rightalign blockjustify | unformat | undo redo n font size style | image hr link unlink | print".split(" "),
footer:!0,fonts:["Verdana","Arial","Georgia","Trebuchet MS"],xhtml:!0,cssfile:"custom.css",bodyid:"editor",footerclass:"tinyeditor-footer",toggle:{text:"source",activetext:"wysiwyg",cssclass:"toggle"},resize:{cssclass:"resize"}});a.store("editor",b);return this},_formatOrderSelection:function(a){return'<div class="row order_item"><div class="col-xs-3">'+a.orderNo+'</div><div class="col-xs-2"><small>'+a.type+'</small></div><div class="col-xs-2" order_status="'+a.status.name+'"><small>'+a.status.name+
'</small></div><div class="col-xs-5"><small>'+(a.customer&&a.customer.name?a.customer.name:"")+"</small></div></div >"},_initCustomerSearchBox:function(){var a,b;a=jQuery('[save-panel="customerId"]').select2({minimumInputLength:3,multiple:!1,ajax:{delay:250,url:"/ajax/getAll",type:"POST",data:function(a){return{searchTxt:"name like ? and storeId = ?",searchParams:["%"+a+"%",jQuery("#storeId").attr("value")],entityName:"Customer",pageNo:1,userId:jQuery("#userId").attr("value")}},results:function(a,
c,e){b=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){b.push({id:a.id,text:a.name,data:a})});return{results:b}}},cache:!0,escapeMarkup:function(a){return a}});this._item.id&&this._item.customer&&this._item.customer.id?a.select2("data",{id:this._item.customer.id,text:this._item.customer.name,data:this._item.customer}):this._preSetData&&this._preSetData.customer&&this._preSetData.customer.id&&a.select2("data",{id:this._preSetData.customer.id,text:this._preSetData.customer.name,
data:this._preSetData.customer});return this},_initOrderSearchBox:function(){var a,b,d;a=this;b=jQuery('[save-panel="orderId"]').select2({minimumInputLength:3,multiple:!1,allowClear:!0,ajax:{delay:250,url:"/ajax/getAll",type:"POST",data:function(a){return{searchTxt:"orderNo like ? and storeId = ?",searchParams:["%"+a+"%",jQuery("#storeId").attr("value")],entityName:"Order",pageNo:1,userId:jQuery("#userId").attr("value")}},results:function(a,b,f){d=[];a.resultData&&a.resultData.items&&a.resultData.items.each(function(a){d.push({id:a.id,
text:a.orderNo,data:a})});return{results:d}}},cache:!0,formatResult:function(b){return b?a._formatOrderSelection(b.data):""},formatSelection:function(b){return b?a._formatOrderSelection(b.data):""},escapeMarkup:function(a){return a}});a._item.id&&a._item.fromEntity&&a._item.fromEntity.id&&"Order"===a._item.fromEntityName?b.select2("data",{id:a._item.fromEntity.id,text:a._item.fromEntity.orderNo,data:a._item.fromEntity}):a._preSetData&&a._preSetData.order&&a._preSetData.order.id&&b.select2("data",
{id:a._preSetData.order.id,text:a._preSetData.order.orderNo,data:a._preSetData.order});return a},_initTechSearchBox:function(){var a;jQuery('[save-panel="techId"]').select2({minimumInputLength:3,multiple:!1,allowClear:!0,hidden:!0,ajax:{delay:250,url:"/ajax/getAll",type:"POST",data:function(a){return{searchTxt:'personId in (select id from person p where concat(p.firstName, " ", p.lastName) like ? and storeId = ?)',searchParams:["%"+a+"%",jQuery("#storeId").attr("value")],entityName:"UserAccount",
pageNo:1}},results:function(b,d,c){a=[];b.resultData&&b.resultData.items&&b.resultData.items.each(function(b){a.push({id:b.id,text:b.person.fullname,data:b})});return{results:a}}},cache:!0,escapeMarkup:function(a){return a}});this._item.id&&this._item.technician&&this._item.technician.id&&jQuery('[save-panel="techId"]').select2("data",{id:this._item.technician.id,text:this._item.technician.person.fullname,data:this._item.technician});return this},_initFormValdation:function(a,b){var d,c;d=this;c=
jQuery("#"+d.getHTMLID("main-form"));c.formValidation({framework:"bootstrap",icon:{valid:"glyphicon glyphicon-ok",invalid:"glyphicon glyphicon-remove",validating:"glyphicon glyphicon-refresh"},excluded:":disabled",fields:{dueDate:{validators:{callback:{message:"The Due Date is required.",callback:function(a,b,c){return null!==jQuery(c).data("DateTimePicker").date()}}}},customer:{validators:{notEmpty:{message:"The customer is required."}}}}}).on("err.form.fv",function(a){a.preventDefault();c.data("formValidation").getSubmitButton()&&
c.data("formValidation").disableSubmitButtons(!1)}).on("success.form.fv",function(a){a.preventDefault();c.data("formValidation").getSubmitButton()&&c.data("formValidation").disableSubmitButtons(!1);d._preSubmit(c.data("formValidation").getSubmitButton().attr("id"))});c.find(".datepicker").on("dp.change dp.show",function(a){c.formValidation("revalidateField","dueDate")});c.find('[name="customer"]').change(function(a){c.formValidation("revalidateField","customer")});return d},load:function(){var a;
$(this.getHTMLID("itemDiv")).update(a=this._getItemDiv());jQuery(".datepicker").datetimepicker({format:"DD/MM/YYYY hh:mm A"});this._loadRichTextEditor(a.down('[save-panel="instructions"]'))._initTechSearchBox()._initOrderSearchBox()._initCustomerSearchBox()._initFormValdation();a.down(".comments-div")&&a.down(".comments-div").store("CommentsDivJs",(new CommentsDivJs(this,"Task",this._item.id))._setDisplayDivId(a.down(".comments-div")).render());return this}});