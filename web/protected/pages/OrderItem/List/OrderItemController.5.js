var PageJs=new Class.create();PageJs.prototype=Object.extend(new BPCPageJs(),{_resultDivId:"",_searchDivId:"",_pagination:{pageNo:1,pageSize:30},_searchCriteria:{},_bindSearchKey:function(){var a={};a.me=this;$(a.me._searchDivId).getElementsBySelector("[search_field]").each(function(b){b.observe("keydown",function(c){a.me.keydown(c,function(){$(a.me._searchDivId).down(".search_btn").click()})})});return this},init:function(b,a){this._resultDivId=b;this._searchDivId=a;this._bindSearchKey();return this},setSearchCriteria:function(b){var a={};a.me=this;$(a.me._searchDivId).getElementsBySelector("[search_field]").each(function(c){a.field=c.readAttribute("search_field");if(b[a.field]){$(c).setValue(b[a.field])}});return this},getSearchCriteria:function(){var a={};a.me=this;a.me._searchCriteria={};a.nothingTosearch=true;$(a.me._searchDivId).getElementsBySelector("[search_field]").each(function(b){a.me._searchCriteria[b.readAttribute("search_field")]=$F(b);if(($F(b) instanceof Array&&$F(b).size()>0)||(typeof $F(b)==="string"&&!$F(b).blank())){a.nothingTosearch=false}});if(a.nothingTosearch===true){a.me._searchCriteria=null}return this},_getResultRow:function(c,a){var b={};b.me=this;b.isTitle=(a||false);b.newDiv=new Element("tr",{"class":"item_row",item_id:c.id}).store("data",c).insert({bottom:new Element("td",{"class":"productname"}).update(c.product.name)}).insert({bottom:new Element("td",{"class":"productsku"}).update(c.product.sku)}).insert({bottom:new Element("td",{"class":"orderno"}).update(b.isTitle?c.order.orderNo:new Element("a",{href:"javascript: void(0);","class":"orderNolink"}).update(c.order.orderNo).observe("click",function(){jQuery.fancybox({width:"80%",height:"90%",autoScale:true,type:"iframe",href:"/orderdetails/"+c.order.id+".html",beforeClose:function(){if(!$$("iframe.fancybox-iframe")||!$$("iframe.fancybox-iframe").first().contentWindow||!$$("iframe.fancybox-iframe").first().contentWindow.pageJs){return}b.items=$$("iframe.fancybox-iframe").first().contentWindow.pageJs._orderItems;if(b.items&&b.items.size()>0){b.items.each(function(d){b.itemRow=$(b.me._resultDivId).down(".row[item_id="+c.id+"]");if(b.itemRow){b.itemRow.replace(b.me._getResultRow(d))}})}}})}))}).insert({bottom:new Element("td",{"class":"orderstatus",order_status:c.order.status.name}).update(c.order.status.name)}).insert({bottom:new Element("td",{"class":"qty"}).update(c.qtyOrdered)}).insert({bottom:new Element("td",{"class":"isordered"}).update(a===true?c.isOrdered:(c.isOrdered?new Element("span",{"class":"ticked inlineblock"}):""))}).insert({bottom:new Element("td",{"class":"eta"}).update(c.eta)}).insert({bottom:new Element("td",{"class":"comments"}).update(a===true?"":new Element("a",{href:"javascript: void(0);","class":"popovercomments visible-xs visible-sm visible-md visible-lg"}).update(new Element("span",{"class":"glyphicon glyphicon-comment"})).observe("click",function(d){jQuery(".popovercomments").not(this).popover("hide")}))});return b.newDiv},_getNextPageBtn:function(){var a={};a.me=this;return new Element("tr").insert({bottom:new Element("td",{colspan:"8","class":"text-center"}).insert({bottom:new Element("span",{"class":"btn btn-success searching_btn","data-loading-text":"Getting more ..."}).update("Show More").observe("click",function(){a.me._pagination.pageNo=a.me._pagination.pageNo*1+1;a.me.getResults()})})})},_getCommentsDiv:function(a){var b={};b.me=this;b.newDiv="";a.comments.each(function(c){b.newDiv+='<div class="list-group-item">';b.newDiv+='<span class="badge">'+c.type+"</span>";b.newDiv+='<strong class="list-group-item-heading"><small>'+c.createdBy.person.fullname+"</small></strong>: ";b.newDiv+="<p><small><em> @ "+c.created+"</em></small><br /><small>"+c.comments+"</small></p>";b.newDiv+="</div>"});return b.newDiv},getResults:function(c,a){var b={};b.me=this;if(b.me._searchCriteria===null||b.me._searchCriteria==={}){alert("Nothing to search!");return}if(c===true){$(b.me._resultDivId).update("");$(b.me._resultDivId).up(".panel").down(".total_no_of_items").update("0")}b.resultDiv=$(b.me._resultDivId).down("table.table > tbody");if(!b.resultDiv){$(b.me._resultDivId).update(new Element("table",{"class":"table"}).update(b.resultDiv=new Element("tbody")))}b.me.postAjax(b.me.getCallbackId("getOrderitems"),{searchCriteria:b.me._searchCriteria,pagination:b.me._pagination},{onLoading:function(d,e){jQuery(".searching_btn").button("loading")},onSuccess:function(d,g){try{b.result=b.me.getResp(g,false,true);if(!b.result||!b.result.items){return}b.resultDiv.getElementsBySelector(".paginWrapper").each(function(e){e.remove()});if(c===true){b.resultDiv.insert({before:b.me._getResultRow({order:{orderNo:"Order NO.",status:{name:"Order Status"}},product:{sku:"SKU",name:"Product"},qtyOrdered:"QTY",eta:"ETA",isOrdered:"Ordered?"},true).wrap(new Element("thead"))});$(b.me._resultDivId).up(".panel").down(".total_no_of_items").update(b.result.pageStats.totalRows)}b.result.items.each(function(e){b.resultDiv.insert({bottom:b.me._getResultRow(e)});jQuery(".popovercomments",jQuery(".item_row[item_id="+e.id+"]")).popover({container:"body",content:b.me._getCommentsDiv(e),html:true,placement:"left",title:"Comments:",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content list-group"></div></div>'})});if(b.result.pageStats.pageNumber<b.result.pageStats.totalPages){b.resultDiv.insert({bottom:b.me._getNextPageBtn().addClassName("paginWrapper")})}}catch(f){$(b.me._resultDivId).insert({bottom:b.me.getAlertBox("ERROR: ",f).addClassName("alert-danger").wrap(new Element("div",{"class":"panel-body"}))})}},onComplete:function(d,e){jQuery(".searching_btn").button("reset")}})}});