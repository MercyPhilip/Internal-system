var PageJs=new Class.create;
PageJs.prototype=Object.extend(new BPCPageJs,{_confirm_form_id:"confirm_form_id",bindBtns:function(){var c;c=this;$$(".gen-report-btn").each(function(d){$(d).observe("click",function(){c._showDateSelectPanel(this,d.readAttribute("data-type"))})});return c},_initFormValdation:function(c,d){var a,b,e;a=this;b=jQuery("#"+a._confirm_form_id);b.formValidation({framework:"bootstrap",icon:{valid:"glyphicon glyphicon-ok",invalid:"glyphicon glyphicon-remove",validating:"glyphicon glyphicon-refresh"},fields:{date_from:{validators:{callback:{message:"The from date is needed.",
callback:function(a,b,c){return null!==jQuery(c).data("DateTimePicker").date()}}}},date_to:{validators:{callback:{message:"The to date is needed.",callback:function(a,b,c){return null!==jQuery(c).data("DateTimePicker").date()}}}}}}).on("err.form.fv",function(a){b.data("formValidation").getSubmitButton()&&b.data("formValidation").disableSubmitButtons(!1)}).on("success.form.fv",function(f){f.preventDefault();b.data("formValidation").getSubmitButton()&&b.data("formValidation").disableSubmitButtons(!1);
e={};e.type=d;$(a._confirm_form_id).getElementsBySelector('[report_date="date_from"]').each(function(b){a._signRandID(b);e[b.readAttribute("report_date")]=jQuery("#"+b.id).data("DateTimePicker").date().startOf("day").utc().format()});$(a._confirm_form_id).getElementsBySelector('[report_date="date_to"]').each(function(b){a._signRandID(b);e[b.readAttribute("report_date")]=jQuery("#"+b.id).data("DateTimePicker").date().endOf("day").utc().format()});a.genReport(c,e)});b.find(".datepicker").on("dp.change dp.show",
function(a){b.formValidation("revalidateField","date_from");b.formValidation("revalidateField","date_to")});return a},_showDateSelectPanel:function(c,d){var a,b,e;a=this;a.type=d;b=(new Element("form",{"class":"confirm-div form-horizontal",id:a._confirm_form_id})).insert({bottom:(new Element("div",{"class":"form-group"})).insert({bottom:(new Element("label",{"class":"col-sm-2 control-label"})).update("Date From:")}).insert({bottom:(new Element("div",{"class":"col-sm-10"})).insert({bottom:new Element("input",
{"class":"form-control datepicker",placeholder:"The start of the date range",report_date:"date_from",name:"date_from"})})})}).insert({bottom:(new Element("div",{"class":"form-group"})).insert({bottom:(new Element("label",{"class":"col-sm-2 control-label"})).update("Date To:")}).insert({bottom:(new Element("div",{"class":"col-sm-10"})).insert({bottom:new Element("input",{"class":"form-control datepicker",placeholder:"The end of the date range",report_date:"date_to",name:"date_to"})})})}).insert({bottom:(new Element("div",
{"class":"text-right"})).insert({bottom:(new Element("span",{"class":"btn btn-default pull-left"})).update("CANCEL").observe("click",function(){a.hideModalBox()})}).insert({bottom:(new Element("button",{type:"submit","class":"btn btn-primary submit-btn","data-loading-text":"Generating ..."})).update("Generate The Report")})});a.showModalBox("<strong>Please provide the date range for: "+$(c).innerHTML+"</strong>",b,!1,null,{"shown.bs.modal":function(c){a._signRandID(b);jQuery("#"+b.id).find(".datepicker").datetimepicker({format:"DD/MM/YYYY",
viewMode:"days"});a._initFormValdation(b.down(".submit-btn"),a.type)},"hide.bs.modal":function(b){(e=jQuery("#"+a._confirm_form_id).data("formValidation"))&&e.destroy()}});return a},genReport:function(c,d){var a,b;a=this;a.postAjax(a.getCallbackId("genReportBtn"),d,{onLoading:function(){a._signRandID(c);jQuery("#"+c.id).button("loading")},onSuccess:function(c,d){try{(b=a.getResp(d,!1,!0))&&b.item&&b.item.id&&(window.open(b.item.url),window.focus(),a.hideModalBox())}catch(g){a.showModalBox('<strong class="text-danger">Error</strong>',
"<h4>"+g+"</h4>")}},onComplete:function(a,b){jQuery("#"+c.id).button("reset")}},6E4);return a}});