var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{_getTitleRowData:function(){return{description:"Description",name:"Name",contactName:"Contact Name",email:"Email",contactNo:"Contact Number"}},_getEditPanel:function(b){var c={me:this};jQuery.fancybox({width:"95%",height:"95%",autoScale:!1,autoDimensions:!1,fitToView:!1,autoSize:!1,type:"iframe",href:"/supplier/"+(b.id?b.id:"new")+".html?blanklayout=1"});return c.newDiv},_getResultRow:function(b,c){var a={me:this};a.tag=!0===a.isTitle?"th":"td";a.isTitle=
c||!1;a.row=(new Element("tr",{"class":!0===a.isTitle?"":"btn-hide-row"})).store("data",b).insert({bottom:(new Element(a.tag,{"class":"name col-xs-2"})).update(b.name)}).insert({bottom:(new Element(a.tag,{"class":"description"})).update(b.description)}).insert({bottom:(new Element(a.tag,{"class":"contactName col-xs-2"})).update(b.contactName)}).insert({bottom:(new Element(a.tag,{"class":"contactNo col-xs-2"})).update(b.contactNo)}).insert({bottom:(new Element(a.tag,{"class":"email col-xs-2"})).update(b.email)}).insert({bottom:1!=
jQuery("#storeId").attr("value")?"":(new Element(a.tag,{"class":"text-right btns col-xs-1"})).update(!0===a.isTitle?"":(new Element("span",{"class":"btn-group btn-group-xs"})).insert({bottom:(new Element("span",{"class":"btn btn-default",title:"Edit"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-pencil"})}).observe("click",function(){a.me._getEditPanel(b)})}).insert({bottom:(new Element("span",{"class":"btn btn-danger",title:"Delete"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",
function(){if(!confirm("Are you sure you want to delete this item?"))return!1;a.me._deleteItem(b)})}))});1!=jQuery("#storeId").attr("value")&&jQuery("#addBtn").hide();return a.row}});