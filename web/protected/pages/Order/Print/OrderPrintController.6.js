var PageJs=new Class.create;PageJs.prototype=Object.extend(new BPCPageJs,{_maxRowsPerPage:9,_pixels:700,_noColumns:5,genPage:function(e,t,n,a){var s={};if(s.me=this,s.table=e.clone(!0),s.thead=s.table.down("thead").clone(!0),s.table.down("thead").remove(),s.tfoot=s.table.down("tfoot").clone(!0),s.table.down("tfoot").remove(),s.margin=t!=n?"padding-bottom:"+(s.me._pixels-a[a.size()-1])+"px":"padding-bottom:0px",s.newPageDiv=new Element("div",{class:"print-page-wrap",style:"margin: 0;"}).insert({bottom:s.tbody=new Element("table",{id:"main-table",class:"orderview"})}).insert({bottom:new Element("div",{class:"print-page-footer",style:s.margin}).update(s.tfoot.down("tr").wrap(new Element("table",{class:"orderview"}))).insert({bottom:new Element("div",{class:"page-no"}).update(t+"/"+n)})}),s.newPageDiv.insert({top:new Element("div",{class:"print-page-header"}).update(new Element("table",{class:"orderview"}).update(s.thead.innerHTML))}),a.each(function(e){e.className&&e.className.indexOf("summary")<0&&s.tbody.insert({bottom:e})}),a[a.size()-1]<s.me._pixels)for(s.j=Math.floor((s.me._pixels-a[a.size()-1])/34);s.j--;){for(s.emptyTr=new Element("tr",{class:"itemRow"}),s.i=s.me._noColumns;s.i--;)s.emptyTr.insert({bottom:new Element("td").update("&nbsp;")});s.tbody.insert({bottom:s.emptyTr})}return a[a.length-2].className.indexOf("summary")>-1&&s.tbody.insert({bottom:a[a.length-2]}),s.newPageDiv},formatForPDF:function(){var e={};return e.me=this,e.mainTable=$("main-table").clone(!0),e.pageTrs=[],e.pageRows=[],e.index=e.pixels=0,e.mainTable.down("tbody").getElementsBySelector("tr").each(function(t){e.lenName=t.getElementsBySelector("td.name").length>0?t.getElementsBySelector("td.name")[0].innerHTML.length:0,e.lenDesc=t.getElementsBySelector("td.desc").length>0?t.getElementsBySelector("td.desc")[0].innerHTML.length:0,e.numName=Math.ceil(e.lenName/22),e.numDesc=Math.ceil(e.lenDesc/48),e.numDesc>=e.numName?e.linepixels=17*e.numDesc+5:e.linepixels=17*e.numName+5,t.className.indexOf("summary")>=0&&(e.linepixels=170),t.className.indexOf("addr_info")>=0&&(e.linepixels=120),e.pixels=1*e.pixels+1*e.linepixels,e.pixels>e.me._pixels?(e.pageRows.push(e.pixels-e.linepixels),e.pageTrs.push(e.pageRows.clone(!0)),e.pageRows=[],e.index=e.pixels=0,e.pageRows.push(t),e.pixels=1*e.pixels+1*e.linepixels):(e.pageRows.push(t),e.index=1*e.index+1)}),e.pageRows.size()>0&&(e.pageRows.push(e.pixels),e.pageTrs.push(e.pageRows)),e.wrapper=$("main-table").up().update(""),e.pageNo=1,e.totalPages=e.pageTrs.size(),e.pageTrs.each(function(t){e.wrapper.insert({bottom:e.me.genPage(e.mainTable,e.pageNo++,e.totalPages,t)})}),e.me}});