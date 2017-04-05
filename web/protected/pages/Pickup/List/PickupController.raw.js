/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new CRUDPageJs(), {
  _openinFB: true
  ,manufactures: []
  ,suppliers: []
  ,productCategories: []
  /**
   * Getting the title row data
   */
  ,_getTitleRowData: function() {
    return {'sku': 'SKU', 'name': 'Product Name', 'supplier': 'Supplier','poNumber': 'PO Number' , 'unitPrice': 'Unit Price(Ex)', 'qty': 'Qty', 'poDate': 'PO Date', 'eta': 'ETA'};
  }
  /**
   * Load the manufacturers
   */
  ,_loadManufactures: function(manufactures) {
    this.manufactures = manufactures;
    var tmp = {};
    tmp.me = this;
    tmp.selectionBox = $(tmp.me.searchDivId).down('[search_field="pro.manufacturerIds"]');
    tmp.me.manufactures.each(function(option) {
      tmp.selectionBox.insert({'bottom': new Element('option',{'value': option.id}).update(option.name) });
    });
    return this;
  }
  /**
   * Load the suppliers
   */
  ,_loadSuppliers: function(suppliers) {
    this.suppliers = suppliers;
    var tmp = {};
    tmp.me = this;
    tmp.selectionBox = $(tmp.me.searchDivId).down('[search_field="pro.supplierIds"]');
    tmp.me.suppliers.each(function(option) {
      tmp.selectionBox.insert({'bottom': new Element('option',{'value': option.id}).update(option.name) });
    });
    return this;
  }
  /**
   * Load thecategories
   */
  ,_loadCategories: function(categories) {
    this.categories = categories;
    var tmp = {};
    tmp.me = this;
    tmp.selectionBox = $(tmp.me.searchDivId).down('[search_field="pro.productCategoryIds"]');
    tmp.me.categories.sort(function(a, b){
      return a.namePath > b.namePath;
    }).each(function(option) {
      tmp.selectionBox.insert({'bottom': new Element('option',{'value': option.id}).update(option.namePath) });
    });
    return this;
  }
  /**
   * initiating the chosen input
   */
  ,_loadChosen: function () {
    jQuery(".chosen").select2({
        minimumResultsForSearch: Infinity
    });
    return this;
  }
  /**
   * Binding the search key
   */
  ,_bindSearchKey: function() {
    var tmp = {}
    tmp.me = this;
    $$('#searchBtn').first()
      .observe('click', function(event) {
        if(!$$('#showSearch').first().checked)
          $$('#showSearch').first().click();
        else
          tmp.me.getSearchCriteria().getResults(true, tmp.me._pagination.pageSize);
      });
    
    $('searchDiv').getElementsBySelector('[search_field]').each(function(item) {
      item.observe('keydown', function(event) {
        tmp.me.keydown(event, function() {
          $(tmp.me.searchDivId).down('#searchBtn').click();
        });
      })
    });
  
    return this;
  }
  ,_loadDatePicker: function () {
    $$('.datepicker').each(function(item){
      new Prado.WebUI.TDatePicker({'ID': item, 'InputMode':"TextBox",'Format':"dd/MM/yyyy",'FirstDayOfWeek':1,'CalendarStyle':"default",'FromYear':2009,'UpToYear':2024,'PositionMode':"Bottom", "ClassName": 'datepicker-layer-fixer'});
    });
    return this;
  }
  /**
   * get selected
   */
  ,_getSelection: function() {
    var tmp = {}
    tmp.me = this;
    tmp.customers = [];
    
    tmp.itemList = $('item-list');
    tmp.itemList.getElementsBySelector('.btn-hide-row.item_row').each(function(row){
      tmp.checked = row.down('input.customer-selected[type="checkbox"]').checked;
      tmp.customerId = row.readAttribute('item_id');
      if(tmp.checked === true && jQuery.isNumeric(tmp.customerId) === true)
        tmp.customers.push(row.retrieve('data'));
    });
    
    $('total-selected-count').update(tmp.customers.length);
    return tmp.customers;
  }
  /**
   * get result row for data given
   */
  ,_getResultRow: function(row, isTitle) {
    var tmp = {};
    tmp.me = this;
    tmp.tag = (isTitle === true ? 'th' : 'td');
    tmp.isTitle = (isTitle || false);
    tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? 'item_top_row' : 'btn-hide-row item_row') + (row.active == 0 ? ' danger' : ''), 'item_id': (tmp.isTitle === true ? '' : row.id)}).store('data', row)
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'sku col-xs-1'}).update(row.sku)
        :new Element(tmp.tag, {'class': 'sku col-xs-1', 'item': 'sku'}).update(row.product.sku)     
        .observe('click', function(){
        })    
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'name col-xs-4 truncate'}).update(row.name)
        :new Element(tmp.tag, {'class': 'name col-xs-4 truncate', 'item': 'name'}).update(row.product.name)   
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'supplier col-xs-2 truncate'}).update(row.supplier)
          :new Element(tmp.tag, {'class': 'supplier col-xs-2 truncate', 'item': 'supplier'}).update(row.po.supplier.name)   
      })
      
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'ponumber col-xs-1 truncate'}).update(row.poNumber)
        :new Element(tmp.tag, {'class': 'ponumber col-xs-1 truncate', 'item': 'po'}).update(row.po.purchaseOrderNo)
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'unitprice col-xs-1 truncate'}).update(row.unitPrice)
          :new Element(tmp.tag, {'class': 'unitprice col-xs-1 truncate', 'item': 'unitprice'}).update(row.item.unitPrice)
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'qty col-xs-1 truncate'}).update(row.qty)
          :new Element(tmp.tag, {'class': 'qty col-xs-1 truncate', 'item': 'unitprice'}).update(row.item.qty)
      })
      .insert({'bottom': new Element(tmp.tag, {'style': 'position:relative; left: -60px','class': 'col-xs-1'})
        .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'eta col-xs-1 truncate'}).update(row.eta)
            : new Element('input', {'class': 'datepicker', 'item': 'eta_'+row.id, 'value': moment(row.eta).format('DD/MM/YYYY')})
        })
      })
      .insert({'bottom': tmp.isTitle === true ? new Element(tmp.tag, {'class': 'podate col-xs-1 truncate'}).update(row.poDate)
          :new Element(tmp.tag, {'class': 'podate col-xs-1 truncate', 'item': 'unitprice'}).update(row.item.created)
      }); 
    return tmp.row;
  }
  ,_getSaveBtn: function(data) {
    var tmp = {};
    tmp.me = this;
    tmp.saveDiv = new Element('div', {'class': 'row'})
        .insert({'bottom': new Element('span', {'id': 'saveBtn', 'class': 'btn btn-primary pull-right col-sm-4', 'data-loading-text': 'saving ...'}).update('Save')
          .observe('click', function() {
            tmp.me.saveEta(this, data);
          })
        });
    
    return tmp.saveDiv;
  }
  ,saveEta: function(btn, productEta) {
    var tmp = {};
    tmp.me = this;
    
    for (var n = productEta.length; n--;) {
      productEta[n].eta = jQuery('[item=eta_'+productEta[n].id).val();
    }
    tmp.me.postAjax(tmp.me.getCallbackId('saveEta'), {'productEta': productEta}, {
      'onSuccess': function(sender, param) {
        try{
          tmp.result = tmp.me.getResp(param, false, true);
          if(!tmp.result || !tmp.result.item)
            return;
          tmp.me.showModalBox('Success', 'Save Successfully!', false);
        } catch (e) {
          tmp.me.showModalBox('ERROR', e, true);
        }
      }
    })
    return tmp.me;
  }
  ,_getNextPageBtn: function() {
    var tmp = {}
    tmp.me = this;
    return new Element('tfoot')
      .insert({'bottom': new Element('tr')
        .insert({'bottom': new Element('td', {'colspan': '8', 'class': 'text-center'})
          .insert({'bottom': new Element('span', {'class': 'btn btn-primary', 'data-loading-text':"Fetching more results ..."}).update('Show More')
            .observe('click', function() {
              tmp.me._pagination.pageNo = tmp.me._pagination.pageNo*1 + 1;
              jQuery(this).button('loading');
              tmp.me.getResults();
            })
          })
        })
      });
  }
});