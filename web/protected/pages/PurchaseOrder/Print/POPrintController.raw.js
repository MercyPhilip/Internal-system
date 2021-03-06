/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BPCPageJs(), {
	_pixels: 920
	,_noColumns: 6
	,genPage: function(table, pageNo, totalPages, rows) {
		var tmp = {};
		tmp.me = this;
		tmp.table = table.clone(true);
		tmp.thead = tmp.table.down('thead').clone(true);
		tmp.table.down('thead').remove();
		tmp.tfoot = tmp.table.down('tfoot').clone(true);
		tmp.table.down('tfoot').remove();
		if(pageNo != totalPages){
			tmp.margin = 'padding-bottom:' + (tmp.me._pixels - rows[rows.size() - 1]) + 'px'; 
		}else{
			tmp.margin = 'padding-bottom:' + 0 + 'px';
		}
		tmp.newPageDiv = new Element('div', {'class': 'print-page-wrap', 'style': 'margin: 0;'})
//			.update(tmp.table)
			.insert({'bottom': tmp.tbody = new Element('table', {'id' : 'main-table', 'class' : 'orderview'}) })
			.insert({'bottom': new Element('div', {'class': 'print-page-footer','style': tmp.margin}).update(tmp.tfoot.down('tr').wrap( new Element('table', {'class': 'orderview'}) ) ) 
				.insert({'bottom': new Element('div', {'class': 'page-no'}).update(pageNo + '/' + totalPages) }) });
//		tmp.tbody = tmp.table.down('tbody').clone(true);
//		tmp.thead.down('tr.header').remove();
		tmp.newPageDiv.insert({'top': new Element('div', {'class': 'print-page-header'}).update(
				new Element('table', {'class': 'orderview'}).update(tmp.thead.innerHTML)
		) });
//		tmp.tbody.insert({'bottom': tmp.tbody.down('tr.header')});
/*		if(rows[0].className.indexOf('addr_info') < 0){
//			header.addClass("header1");
			rows.unshift(header);
		}*/

		rows.each(function(tr) {
			if(tr.className){
				if(tr.className.indexOf('summary') < 0){
					tmp.tbody.insert({'bottom': tr});
				}
			}
		});
//		tmp.noColumns = rows[1].getElementsBySelector('td').size();
//		if(rows.size() < tmp.me._maxRowsPerPage) {
		if(rows[rows.size() - 1] < tmp.me._pixels){
			
//			for(tmp.j = tmp.me._maxRowsPerPage * 1 - rows.size(); tmp.j--;) {
			for(tmp.j = Math.floor((tmp.me._pixels - rows[rows.size() - 1]) / 34); tmp.j--;){
				
//				tmp.emptyTr = rows[2].clone(true).update('');
				tmp.emptyTr = new Element('tr', {'class' : 'itemRow'});
				for(tmp.i = tmp.me._noColumns; tmp.i--;) {
					tmp.emptyTr.insert({'bottom': new Element('td').update('&nbsp;')});
				}
				tmp.tbody.insert({'bottom': tmp.emptyTr});
			}
		}
		if(rows[rows.length - 2].className.indexOf('summary') > -1){
			rows[rows.length - 2].setStyle({borderTop: '2px black solid'});
			tmp.tbody.insert({'bottom': rows[rows.length - 2]});
		}
//		tmp.table.down('#tfoot').insert({'bottom': new Element('td', {'colspan': tmp.noColumns})
//			.setStyle('text-align: right')
//			.update('Page: ' + pageNo + ' / ' + totalPages)
//			.wrap(new Element('tr'))
//		});
		return tmp.newPageDiv;
	}
	,formatForPDF: function() {
		var tmp = {};
		tmp.me = this;
		tmp.mainTable = $('main-table').clone(true);
		tmp.pageTrs = [];
		tmp.pageRows = [];
		tmp.index = tmp.pixels = 0;
		tmp.mainTable.down('tbody').getElementsBySelector('tr').each(function(row) {
			tmp.lenName = row.getElementsBySelector('td.name').length > 0 ? row.getElementsBySelector('td.name')[0].innerHTML.length : 0;
			tmp.lenSupplier = row.getElementsBySelector('td.supplier').length > 0 ? row.getElementsBySelector('td.supplier')[0].innerHTML.length : 0;
			tmp.lenSku = row.getElementsBySelector('td.sku').length > 0 ? row.getElementsBySelector('td.sku')[0].innerHTML.length : 0;
			tmp.numName = Math.ceil(tmp.lenName / 45);
			tmp.numSupplier = Math.ceil(tmp.lenSupplier / 15);
			tmp.numSku = Math.ceil(tmp.lenSku / 11);
			if (tmp.numSku >= tmp.numName && tmp.numSku >= tmp.numSupplier){
				tmp.linepixels = 18.5 * tmp.numSku + 5 * 1;
			}else if(tmp.numSupplier >= tmp.numSku && tmp.numSupplier >= tmp.numName){
				tmp.linepixels = 18.5 * tmp.numSupplier + 5 * 1;
			}else{
				tmp.linepixels = 18.5 * tmp.numName + 5 * 1;
			}
			if(row.className.indexOf('comment') >= 0){
				tmp.linepixels = 40;
			}
			if(row.className.indexOf('summary') >= 0){
				tmp.linepixels = 220;
			}
			tmp.pixels = tmp.pixels * 1 + tmp.linepixels * 1;
//			if(tmp.index >= tmp.me._maxRowsPerPage) {
			if(tmp.pixels > tmp.me._pixels){
				tmp.pageRows.push(tmp.pixels - tmp.linepixels);
				tmp.pageTrs.push(tmp.pageRows.clone(true));
				tmp.pageRows = [];
				tmp.index = tmp.pixels = 0;
				tmp.pageRows.push(row);
				tmp.pixels = tmp.pixels * 1 + tmp.linepixels * 1;
			}else{
//			if(!row.down('.name').innerHTML.blank()) {
				tmp.pageRows.push(row);
				tmp.index = tmp.index * 1 + 1;
			}
/*			if(row.className.indexOf('header') > -1){
				tmp.header = row;
			}*/
		});
		if(tmp.pageRows.size() > 0) {
			tmp.pageRows.push(tmp.pixels);
			tmp.pageTrs.push(tmp.pageRows);
		}
		tmp.wrapper = $('main-table').up().update('');
		tmp.pageNo = 1;
		tmp.totalPages = tmp.pageTrs.size();
		tmp.pageTrs.each(function(pageRows) {
			tmp.wrapper.insert({'bottom': tmp.me.genPage(tmp.mainTable, tmp.pageNo++, tmp.totalPages, pageRows)});
		});


		return tmp.me;
	}
});