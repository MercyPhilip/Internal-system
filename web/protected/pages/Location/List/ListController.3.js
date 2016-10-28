var PageJs=new Class.create;
PageJs.prototype=Object.extend(new CRUDPageJs,{_getTitleRowData:function(){return{description:"Description",name:"Name"}},_bindSearchKey:function(){var b;b=this;$("searchPanel").getElementsBySelector("[search_field]").each(function(c){c.observe("keydown",function(a){b.keydown(a,function(){$(b.searchDivId).down("#searchBtn").click()})})});return this},_getEditPanel:function(b){var c,a;c=this;return(new Element("tr",{"class":"save-item-panel info"})).store("data",b).insert({bottom:new Element("input",{type:"hidden",
"save-item-panel":"id",value:b.id?b.id:""})}).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:new Element("input",{required:!0,"class":"form-control",placeholder:"The name of the Location","save-item-panel":"name",value:b.name?b.name:""})})}).insert({bottom:(new Element("td",{"class":"form-group"})).insert({bottom:new Element("input",{"class":"form-control",placeholder:"Optional - The description of the Location","save-item-panel":"description",value:b.description?b.description:
""})})}).insert({bottom:(new Element("td",{"class":"text-right"})).insert({bottom:(new Element("span",{"class":"btn-group btn-group-sm"})).insert({bottom:(new Element("span",{"class":"btn btn-success",title:"Save"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok"})}).observe("click",function(){a=this;c._saveItem(a,$(a).up(".save-item-panel"),"save-item-panel")})}).insert({bottom:(new Element("span",{"class":"btn btn-danger",title:"Delete"})).insert({bottom:new Element("span",
{"class":"glyphicon glyphicon-remove"})}).observe("click",function(){b.id?$(this).up(".save-item-panel").replace(c._getResultRow(b).addClassName("item_row").writeAttribute("item_id",b.id)):$(this).up(".save-item-panel").remove()})})})})},_getResultRow:function(b,c){var a={me:this};a.tag=!0===a.isTitle?"th":"td";a.isTitle=c||!1;a.row=(new Element("tr",{"class":!0===a.isTitle?"":"btn-hide-row"})).store("data",b).insert({bottom:(new Element(a.tag,{"class":"name col-xs-2"})).update(b.name)}).insert({bottom:(new Element(a.tag,
{"class":"description"})).update(b.description)}).insert({bottom:(new Element(a.tag,{"class":"text-right col-xs-2"})).update(!0===a.isTitle?(new Element("span",{"class":"btn btn-primary btn-xs",title:"New"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-plus"})}).insert({bottom:" NEW"}).observe("click",function(){$(this).up("thead").insert({bottom:a.newEditEl=a.me._getEditPanel({})});a.newEditEl.down(".form-control[save-item-panel]").focus();a.newEditEl.down(".form-control[save-item-panel]").select();
a.newEditEl.getElementsBySelector(".form-control[save-item-panel]").each(function(b){b.observe("keydown",function(b){a.me.keydown(b,function(){a.newEditEl.down(".btn-success span").click()});return!1})})}):(new Element("span",{"class":"btn-group btn-group-xs"})).insert({bottom:(new Element("span",{"class":"btn btn-default",title:"Edit"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-pencil"})}).observe("click",function(){$(this).up(".item_row").replace(a.editEl=a.me._getEditPanel(b));
a.editEl.down(".form-control[save-item-panel]").focus();a.editEl.down(".form-control[save-item-panel]").select();a.editEl.getElementsBySelector(".form-control[save-item-panel]").each(function(b){b.observe("keydown",function(b){a.me.keydown(b,function(){a.editEl.down(".btn-success span").click()});return!1})})})}).insert({bottom:(new Element("span",{"class":"btn btn-danger",title:"Delete"})).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){if(!confirm("Are you sure you want to delete this item?"))return!1;
a.me._deleteItem(b)})}))});return a.row}});