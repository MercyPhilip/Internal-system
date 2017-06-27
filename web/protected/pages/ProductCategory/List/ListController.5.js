var PageJs=new Class.create;PageJs.prototype=Object.extend(new CRUDPageJs,{_getTitleRowData:function(){return{description:"Description",name:"Name",mageId:"mageId",noOfChildren:null}},_bindSearchKey:function(){var e={};return e.me=this,$("searchPanel").getElementsBySelector("[search_field]").each(function(t){t.observe("keydown",function(t){e.me.keydown(t,function(){$("searchBtn").click()})})}),this},_saveItem:function(e,t,n){var i={};if(i.me=this,i.data=i.me._collectFormData(t,n),null!==i.data)return i.me.postAjax(i.me.getCallbackId("saveItem"),{item:i.data},{onLoading:function(){i.data.id&&t.addClassName("item_row").writeAttribute("item_id",i.data.id),t.hide()},onSuccess:function(e,n){try{if(i.result=i.me.getResp(n,!1,!0),!i.result||!i.result.item)return;i.tbody=$(i.me.resultDivId).down("tbody"),i.row=i.tbody.down(".item_row[item_id="+i.result.item.id+"]"),i.newRow=i.me._getResultRow(i.result.item).addClassName("item_row").writeAttribute("item_id",i.result.item.id),i.row?i.row.replace(i.newRow):i.result.parent&&i.result.parent.id&&(i.parentRow=i.tbody.down(".item_row[item_id="+i.result.parent.id+"]"))?i.tbody.down("[parentId="+i.result.parent.id+"]")?i.parentRow.insert({after:i.newRow}):i.parentRow.replace(i.me._getResultRow(i.result.parent).addClassName("item_row").writeAttribute("item_id",i.result.parent.id)):(i.tbody.insert({top:i.newRow}),t.remove(),$(i.me.totalNoOfItemsId).update(1*$(i.me.totalNoOfItemsId).innerHTML+1))}catch(e){i.me.showModalBox('<span class="text-danger">ERROR:</span>',e,!0),t.show()}}}),i.me},_getEditPanel:function(e){var t={};return t.me=this,t.newDiv=new Element("tr",{class:"save-item-panel info"}).store("data",e).insert({bottom:new Element("input",{type:"hidden","save-item-panel":"id",value:e.id?e.id:""})}).insert({bottom:new Element("input",{type:"hidden","save-item-panel":"parentId",value:e.parent&&e.parent.id?e.parent.id:""})}).insert({bottom:new Element("td",{class:"form-group"}).insert({bottom:new Element("input",{required:!0,class:"form-control",placeholder:"The name","save-item-panel":"name",value:e.name?e.name:""})})}).insert({bottom:new Element("td",{class:"form-group"}).insert({bottom:new Element("input",{class:"form-control",placeholder:"Optional - The description","save-item-panel":"description",value:e.description?e.description:""})})}).insert({bottom:new Element("td",{class:"text-right"}).insert({bottom:new Element("span",{class:"btn-group btn-group-sm"}).insert({bottom:new Element("span",{class:"btn btn-success",title:"Save"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-ok"})}).observe("click",function(){t.btn=this,t.me._saveItem(t.btn,$(t.btn).up(".save-item-panel"),"save-item-panel")})}).insert({bottom:new Element("span",{class:"btn btn-danger",title:"Delete"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-remove"})}).observe("click",function(){e.id?$(this).up(".save-item-panel").replace(t.me._getResultRow(e).addClassName("item_row").writeAttribute("item_id",e.id)):$(this).up(".save-item-panel").remove()})})})}),t.newDiv},_removeRowByParentId:function(e,t){var n={};return n.me=this,e.getElementsBySelector(".item_row[parentId="+t.id+"]").each(function(t){n.me._removeRowByParentId(e,t.retrieve("data")),t.remove()}),n.me},_getChildrenRows:function(e,t){var n={};return n.me=this,n.icon=$(e).down(".icon"),n.icon.hasClassName("glyphicon-minus-sign")?(n.icon.removeClassName("glyphicon-minus-sign").addClassName("glyphicon-plus-sign"),n.me._removeRowByParentId($(n.me.resultDivId).down("tbody"),t)):(n.icon.removeClassName("glyphicon-plus-sign").addClassName("glyphicon-minus-sign"),n.me.postAjax(n.me.getCallbackId("getItems"),{searchCriteria:{parentId:t.id},pagination:{pageNo:null,pageSize:n.me._pagination.pageSize}},{onLoading:function(){},onSuccess:function(t,i){try{if(n.result=n.me.getResp(i,!1,!0),!n.result||!n.result.items)return;n.row=$(e).up(".item_row"),n.result.items.each(function(e){n.row.insert({after:n.me._getResultRow(e).addClassName("item_row").writeAttribute("item_id",e.id)}),e.noOfChildren>0&&jQuery("[item_id="+e.id+"] .icon").removeClass("glyphicon-minus-sign").addClass("glyphicon-plus-sign")})}catch(e){n.me.showModalBox('<span class="text-danger">ERROR:</span>',e,!0)}}})),n.me},_getPreName:function(e){var t={};if(t.me=this,t.newDiv="",!e.position)return t.newDiv;for(t.levels=e.position.split("/").size(),t.newDiv=new Element("small"),t.i=1;t.i<t.levels;t.i=1*t.i+1)t.newDiv.insert({bottom:new Element("span",{class:"treegrid-indent"})});return e.noOfChildren>0?t.newDiv.insert({bottom:new Element("a",{href:"javascript: void(0);",class:"treegrid-explander"}).update(new Element("span",{class:"icon glyphicon glyphicon-minus-sign"})).observe("click",function(){t.me._getChildrenRows(this,e),t.btn=this})}):t.newDiv.insert({bottom:new Element("span",{class:"treegrid-explander"})}),t.newDiv},_deleteItem:function(e){var t={};return t.me=this,t.row=$(t.me.resultDivId).down("tbody").down(".item_row[item_id="+e.id+"]"),t.me.postAjax(t.me.getCallbackId("deleteItems"),{ids:[e.id]},{onLoading:function(){t.row&&t.row.hide()},onSuccess:function(e,n){try{if(t.result=t.me.getResp(n,!1,!0),!t.result||!t.result.parents)return;t.count=1*$(t.me.totalNoOfItemsId).innerHTML-1,$(t.me.totalNoOfItemsId).update(t.count<=0?0:t.count),t.row&&t.row.remove(),t.result.parents.each(function(e){t.parentRow=$(t.me.resultDivId).down("tbody").down(".item_row[item_id="+e.id+"]"),t.parentRow&&t.parentRow.replace(t.me._getResultRow(e).addClassName("item_row").writeAttribute("item_id",e.id))})}catch(e){t.me.showModalBox('<span class="text-danger">ERROR</span>',e,!0),t.row&&t.row.show()}}}),t.me},_getResultRow:function(e,t){var n={};return n.me=this,n.tag=!0===n.isTitle?"th":"td",n.isTitle=t||!1,n.btns=new Element("span",{class:"btn-group btn-group-xs"}).insert({bottom:new Element("span",{class:"btn btn-primary",title:"Add under this category"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-plus"})}).observe("click",function(){$(this).up(".item_row").insert({after:n.me._getEditPanel({parent:{id:e.id}})})})}).insert({bottom:new Element("span",{class:"btn btn-default",title:"Edit"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-pencil"})}).observe("click",function(){$(this).up(".item_row").replace(n.me._getEditPanel(e))})}),e.noOfChildren>0||n.btns.insert({bottom:new Element("span",{class:"btn btn-danger",title:"Delete"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-trash"})}).observe("click",function(){if(!confirm("Are you sure you want to delete this item?"))return!1;n.me._deleteItem(e)})}),n.row=new Element("tr",{class:!0===n.isTitle?"":"btn-hide-row"}).store("data",e).insert({bottom:new Element(n.tag,{class:"name col-xs-4"}).insert({bottom:n.me._getPreName(e)}).insert({bottom:" "+e.name})}).insert({bottom:new Element(n.tag,{class:"mageId"}).update(e.mageId)}).insert({bottom:new Element(n.tag,{class:"description"}).update(e.description)}).insert({bottom:1!=jQuery("#storeId").attr("value")?"":new Element(n.tag,{class:"text-right btns col-xs-2"}).update(!0===n.isTitle?new Element("span",{class:"btn btn-primary btn-xs",title:"New"}).insert({bottom:new Element("span",{class:"glyphicon glyphicon-plus"})}).insert({bottom:" NEW"}).observe("click",function(){$(this).up("thead").insert({bottom:n.me._getEditPanel({})})}):n.btns)}),e.parent&&e.parent.id&&n.row.writeAttribute("parentId",e.parent.id),n.row}});