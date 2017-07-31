/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BPCPageJs(), {
	id_wrapper: '' //the html id of the wrapper
	,_acceptableTypes: ['csv']
	,csvFileLineFormat: []
	,_fileReader: null
	,_uploadedData: {}
	,_importDataTypes: {}
	,_rowNo: null
	,_selectTypeTxt: 'Select a Import Type'

	,load: function(importDataTypes) {
		var tmp = {}
		tmp.me = this;
		tmp.me._rowNo = 1;
		tmp.me._importDataTypes = importDataTypes;

		$(tmp.me.getHTMLID('importerDiv')).update('test');

		if (window.File && window.FileReader && window.FileList && window.Blob) { //the browser supports file reading api
			tmp.me._fileReader = new FileReader();
			$(tmp.me.getHTMLID('importerDiv')).update( tmp.me._getFileUploadDiv() );
			tmp.me._loadChosen();
		} else {
			$(tmp.me.getHTMLID('importerDiv')).update(tmp.me.getAlertBox('Warning:', 'Your browser does NOT support this feature. pls change and try again').addClassName('alert-warning') );
		}
		return tmp.me;
	}
	/**
	 * Load the tierLevels
	 */
	,_loadTierLevels: function(tierLevels) {
		this.tierLevels = tierLevels;
		var tmp = {};
		tmp.me = this;
		return this;
	}
	/**
	 * create template csv file with header only
	 */
	,_genTemplate: function() {
		var tmp = {};
		tmp.me = this;
		if(tmp.me.type = tmp.me._getUploadType()) {
			tmp.data = [];
			tmp.data.push(tmp.me.csvFileLineFormat.join(', ') + "\n");
			tmp.now = new Date();
			tmp.fileName = tmp.me.type + '_' + tmp.now.getFullYear() + '_' + tmp.now.getMonth() + '_' + tmp.now.getDate() + '_' + tmp.now.getHours() + '_' + tmp.now.getMinutes() + '_' + tmp.now.getSeconds() + '.csv';
			tmp.blob = new Blob(tmp.data, {type: "text/csv;charset=utf-8"});
			saveAs(tmp.blob, tmp.fileName);
		}
		return tmp.me;
	}
	/**
	 * initiating the chosen input
	 */
	,_loadChosen: function () {
		jQuery(".chosen").chosen({
				search_contains: true,
				inherit_select_classes: true,
				no_results_text: "No code type found!",
				width: "250px"
		});
		return this;
	}
	/**
	 * upload csv file 
	 */
	,_getFileUploadDiv: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv =  new Element('div',  {'class': 'panel panel-default drop_file_div', 'title': 'You can drag files here!'})
			.insert({'bottom': new Element('div', {'class': 'panel-body'})
				.insert({'bottom': new Element('div', {'class': 'pull-right'})
					.insert({'bottom': tmp.dropdown = new Element('select', {'class': 'chosen', 'data-placeholder': 'Code Type: ' ,'id': tmp.me.getHTMLID('importDataTypesDropdownId')})
						.insert({'bottom': new Element('option', {'value': tmp.me._selectTypeTxt}).update(tmp.me._selectTypeTxt) })
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-default btn-xs', 'title': 'Download Template'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-download-alt'}) })
						.observe('click', function() {
							tmp.me._genTemplate();
						})
					})
				})
				.insert({'bottom': new Element('div', {'class': 'form-group center-block text-left', 'style': 'width: 50%'})
					.insert({'bottom': new Element('label').update('Drop you files here or select your file below:') })
					.insert({'bottom': tmp.inputFile = new Element('input', {'type': 'file', 'accept':'.csv', 'style': 'display: none;'})
						.observe('change', function(event) {
							tmp.me._readFiles(event.target.files);
						})
					})
					.insert({'bottom': new Element('div', {'class': 'clearfix'}) })
					.insert({'bottom': new Element('span', {'class': 'btn btn-success clearfix'})
						.update('Click to select your file')
						.observe('click', function(event) {
							if(tmp.me._getUploadType())
								tmp.inputFile.click();
						})
					})
					.insert({'bottom': new Element('div', {'class': 'clearfix'}) })
					.insert({'bottom': new Element('small').update('ONLY ACCEPT file formats: ' + tmp.me._acceptableTypes.join(', ')) })
				})
			})
			.observe('dragover', function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				evt.dataTransfer.dropEffect = 'copy';
			})
			.observe('drop', function(evt) {
				if(tmp.me._getUploadType()) {
					evt.stopPropagation();
					evt.preventDefault();
					tmp.me._readFiles(evt.dataTransfer.files);
				}
			})
		;
		$H(tmp.me._importDataTypes).each(function(item){
			tmp.dropdown.insert({'bottom': new Element('option', {'value': item.key})
				.store('data', item.key)
				.update(item.value)
			});
		});
		return tmp.newDiv;
	}
	/**
	 * check upload file type
	 */
	,_getUploadType: function() {
		var tmp = {};
		tmp.me = this;
		tmp.me.dropdown = $(tmp.me.getHTMLID('importDataTypesDropdownId'));
		tmp.me._importDataTypes = $F(tmp.me.dropdown);

		if(tmp.me._importDataTypes === tmp.me._selectTypeTxt) {
			tmp.me.showModalBox('Please select a import type first', 'Invalid inport type');
			return false;
		}
		switch(tmp.me._importDataTypes) {
			case 'new_product':
			case 'update_product':
				tmp.me.csvFileLineFormat = ['sku', 'name', 'feature','description', 'short_description', 'price', 'category','stock', 'brand', 'supplier', 'weight', 'attributeset', 'image'];
				tmp.me.tierLevels.each(function(tierLevel){
					tmp.me.csvFileLineFormat.push(tierLevel);
				}) 
				break;
			case 'update_srp':
				tmp.me.csvFileLineFormat = ['sku', 'srp'];
				break;
			case 'update_buyinprice':
				tmp.me.csvFileLineFormat = ['sku', 'buyinprice'];
				break;
			default:
				tmp.me.csvFileLineFormat = [];
		}
		return tmp.me._importDataTypes;
	}
	/**
	 * analyse the csv file
	 */
	,_parseCSV: function (str) {
		var arr = [];
		var quote = false;  // true means we're inside a quoted field

		// iterate over each character, keep track of current row and column (of the returned array)
		for (var row = col = c = 0; c < str.length; c++) {
			var cc = str[c], nc = str[c+1];        // current character, next character
			arr[row] = arr[row] || [];             // create a new row if necessary
			arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary
			// If the current character is a quotation mark, and we're inside a
			// quoted field, and the next character is also a quotation mark,
			// add a quotation mark to the current column and skip the next character
			if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  
			// If it's just one quotation mark, begin/end quoted field
			if (cc == '"') { quote = !quote; continue; }
			// If it's a comma and we're not in a quoted field, move on to the next column
			if (cc == ',' && !quote) { ++col; continue; }
			// If it's a newline and we're not in a quoted field, move on to the next
			// row and move to column 0 of that new row
			if (cc == '\n' && !quote) { ++row; col = 0; continue; }
			// Otherwise, append the current character to the current column
			arr[row][col] += cc;
		}
		return arr;
	}
	/**
	 * read csv file
	 */
	,_readFiles: function(files) {
		var tmp = {};
		tmp.me = this;
		tmp.me._uploadedData = {};
//		tmp.header = [];
		tmp.fileLists = new Element('div', {'class': 'list-group'});
		for(tmp.i = 0, tmp.file; tmp.file = files[tmp.i]; tmp.i++) {
			tmp.fileRow = new Element('div', {'class': 'row'}).update( new Element('div', {'class': 'col-lg-6 col-md-6'}).update(tmp.file.name) );
			if((tmp.extension = tmp.file.name.split('.').pop()) !== '' && tmp.me._acceptableTypes.indexOf(tmp.extension.toLowerCase()) > -1) {
				tmp.me._fileReader = new FileReader();
				tmp.me._fileReader.onload = function(event) {
					var arr = tmp.me._parseCSV(event.target.result);
					tmp.me._rowNo = 1; // reset rowNo for each file
					arr.each(function(line) {
						if(line !== null && line.length > 0) {
							tmp.cols = [];
							line.each(function(col) {
								col = col.trim();
								if(col !== null) {
									tmp.cols.push(col);
								}
							})
							tmp.key = tmp.cols.join(',');
							if((tmp.key.trim() != '') && (tmp.key !== tmp.me.csvFileLineFormat.join(','))) { //this is not the header line
								tmp.colArray = {};
							/*	tmp.me.csvFileLineFormat.each(function(item){
									if(item instanceof Array){
										item.each(function(i){
											tmp.header.push(i);
										})
									}else{
										tmp.header.push(item);
									}
								})
								tmp.me.csvFileLineFormat = tmp.header;*/
								for(tmp.j = 0; tmp.j < tmp.me.csvFileLineFormat.size(); tmp.j++) {
									tmp.colArray[tmp.me.csvFileLineFormat[tmp.j]] = tmp.cols[tmp.j];
								}
								tmp.colArray['index'] = tmp.me._rowNo++; // tmp.me._rowNo starts at 1
								tmp.me._uploadedData[tmp.key] = tmp.colArray;
							}
						}
					})
				}
				tmp.me._fileReader.readAsText(tmp.file);
				tmp.supported = true;
			} else {
				tmp.fileRow.insert({'bottom': new Element('div', {'class': 'col-lg-6 col-md-6'}).update(new Element('small').update('Not supported file extension: ' + tmp.extension) )})
				tmp.supported = false;
			}
			tmp.fileLists.insert({'bottom': new Element('div', {'class': 'list-group-item ' + (tmp.supported === true ? 'list-group-item-success' : 'list-group-item-danger')})
				.insert({'bottom': tmp.fileRow })
			});
		}
		$(tmp.me.getHTMLID('importerDiv')).update(
			new Element('div', {'class': 'panel panel-default'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'})
				.update('Files Selected:')
				.insert({'bottom': new Element('small', {'class': 'pull-right'}).update('ONLY ACCEPT file formats: ' + tmp.me._acceptableTypes.join(', ')) })
			})
			.insert({'bottom': tmp.fileLists })
			.insert({'bottom': new Element('div', {'class': 'panel-footer'})
				.insert({'bottom': new Element('span', {'class': 'btn btn-success'})
					.update('Start')
					.observe('click', function() {
						tmp.me._loadProductLineItems();
					})
				})
				.insert({'bottom': new Element('span', {'class': 'btn btn-warning pull-right'})
					.update('Cancel')
					.observe('click', function(){
						jQuery('.btn').attr('disabled','disabled');
						window.location = document.URL;
					})
				})
			})
		);
		return tmp.me;
	}
	/**
	 * Open detail page
	 */
	,_openDetailPage: function(path, id) {
		var tmp = {};
		tmp.me = this;
		tmp.newWindow = window.open(path, path + ' details', 'width=1300, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no');
		tmp.newWindow.focus();
		return tmp.me;
	}
	/**
	 * Getting a single row of the result table
	 */
	,_getProductLineItem: function(listGroupDiv, dataKeyIndex, dataKeys) {
		var tmp = {};
		tmp.me = this;
		tmp.data = tmp.me._uploadedData[dataKeys[dataKeyIndex]];
		tmp.newRow = new Element('tr', {'class': 'result_row info'});
		tmp.me.csvFileLineFormat.each(function(name){
			$H(tmp.data).each(function(item){
				if((item.key === name) && ((item.key != 'description') && (item.key != 'feature'))) {
					tmp.newRow.insert({'bottom': new Element('th', {'style': item.value ? '' : 'color:red;'})
						.insert({'bottom' : new Element('div', {'style' : 'max-width:100px;display:inline-block;word-break: break-all; word-wrap: break-word;'}).update(item.value ? item.value : 'Blank ' + name)})
					});
				}
			});
		});
		tmp.data.importDataTypes = tmp.me._importDataTypes;
		tmp.me.postAjax(tmp.me.getCallbackId('getAllCodeForProduct'), tmp.data, {
			'onLoading': function(sender, param) {
				listGroupDiv.insert({'bottom': tmp.newRow });
			}
			,'onSuccess': function (sender, param) {
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result || !tmp.result.item || !tmp.result.item.id) {
						tmp.newRow.update('');
						return;
					}
					tmp.newRow.removeClassName('info').addClassName('result-done').store('data', tmp.result.item)
						.insert({'bottom': new Element('td',{'colspan': 2})
							.insert({'bottom' : new Element('div', {'style' : 'max-width:100px;display:inline-block;word-break: break-all; word-wrap: break-word;'}).update('<strong>'+ (tmp.result.item.product ? 'CREATED':'UPDATED') + '</strong>')})
					});
					if(tmp.result.path) {
						tmp.newRow.down('div')
							.setStyle({
								'cursor': 'pointer',
								'text-decoration': 'underline'
							})
							.observe('click',function(){
								tmp.me._openDetailPage(tmp.result.path, tmp.result.item.id);
							});
					}
				}  catch (e) {
					tmp.newRow.removeClassName('info').addClassName('danger').store('data', tmp.data)
						.insert({'bottom': new Element('td',{'colspan': 2})
							.insert({'bottom' : new Element('div', {'style' : 'max-width:100px;display:inline-block;word-break: break-all; word-wrap: break-word;'}).update('<strong>ERROR:</strong>' + e)})
						});
					listGroupDiv.insert({'top': tmp.newRow });
				}
			}
			,'onComplete': function(sender, param) {
				try {
					tmp.nextDataKeyIndex = dataKeyIndex * 1 + 1;
					if(tmp.nextDataKeyIndex >= dataKeys.size()) { //this is the last row
						tmp.errRows = $(tmp.me.getHTMLID('importerDiv')).getElementsBySelector('.result_row.danger');
						listGroupDiv.up('.panel').removeClassName('panel-danger').addClassName(tmp.errRows.size() > 0 ? 'panel-warning' : 'panel-success').down('.panel-heading').update('')
							.insert({'bottom': new Element('panel-title').update((tmp.errRows.size() > 0 ? 'All provided rows have been proccessed, but with ' + tmp.errRows.size() + ' error(s)' : 'All provided rows have been proccessed successfully') ) })
							.insert({'bottom': new Element('span',{'class': 'btn-group btn-group-sm pull-right'})
								.insert({'bottom': new Element('span',{'class': 'btn btn-default'})
									.writeAttribute('title', 'Start Again')
									.update(new Element('span', {'class': 'glyphicon glyphicon-repeat'}))
									.observe('click', function() {
										window.location = document.URL;
									})
								})
							})
					} else {
						tmp.me._getProductLineItem(listGroupDiv, tmp.nextDataKeyIndex, dataKeys);
					}
				} catch (e) {
					alert(e);
				}
			}
		});
		return tmp.me;
	}
	/**
	 * Getting the result list table
	 */
	,_loadProductLineItems: function() {
		var tmp = {};
		tmp.me = this;
		tmp.keys = [];
		$H(tmp.me._uploadedData).each(function(data){
			tmp.keys.push(data.key);
		});
		//get header row
		tmp.theadRow = new Element('tr');
		tmp.me.csvFileLineFormat.each(function(item){
			if ((item != 'description') && (item != 'feature'))
				tmp.theadRow.insert({'bottom': new Element('th').update(item)})
		});

		$(tmp.me.getHTMLID('importerDiv')).update(
			new Element('div', {'class': 'price_search_result panel panel-danger table-responsive'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'})
				.update('Total of <strong>' + tmp.keys.size() + '</strong> unique row(s) received:')
				.insert({'bottom': new Element('strong',{'class': 'pull-right'}).update('please waiting for it to finish') })
			})
			.insert({'bottom': new Element('table', {'class': 'table table-striped', 'table-layout':'fixed'})
				.insert({'bottom': new Element('thead').update(tmp.theadRow) })
				.insert({'bottom': tmp.resultList = new Element('tbody') })
			})
		);
		if (tmp.keys.size() == 0)
		{
			tmp.resultList.up('.panel').removeClassName('panel-danger').addClassName('panel-success').down('.panel-heading').update('Total of <strong>' + tmp.keys.size() + '</strong> unique row(s) received:')
			.insert({'bottom': new Element('span',{'class': 'btn-group btn-group-sm pull-right'})
				.insert({'bottom': new Element('span',{'class': 'btn btn-default'})
					.writeAttribute('title', 'Start Again')
					.update(new Element('span', {'class': 'glyphicon glyphicon-repeat'}))
					.observe('click', function() {
						window.location = document.URL;
					})
				})
			});
			return tmp.me;
		}
		
		tmp.me._getProductLineItem(tmp.resultList, 0, tmp.keys);
		return tmp.me;
	}
});