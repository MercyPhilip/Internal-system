var StaticsPageJs=new Class.create;StaticsPageJs.prototype=Object.extend(new BPCPageJs,{_htmlIds:{resultDivId:""},_searchCriterias:{},setHTMLIDs:function(a){return this._htmlIds.resultDivId=a,this},_drawChart:function(a){var b={};return b.me=this,b.divId="#"+b.me.getHTMLID("resultDivId"),jQuery(b.divId).highcharts(a),jQuery(b.divId).highcharts().setSize(608,300),b.me},_getData:function(){var a={};return a.me=this,a.me.postAjax(a.me.getCallbackId("getData"),a.me._searchCriterias,{onLoading:function(){$(a.me.getHTMLID("resultDivId")).update(a.me.getLoadingImg())},onSuccess:function(b,c){try{if(a.result=a.me.getResp(c,!1,!0),!a.result)throw"Syste Error: No result came back!";a.me._drawChart(a.result)}catch(b){$(a.me.getHTMLID("resultDivId")).update(a.me.getAlertBox("ERROR:",b).addClassName("alert-danger"))}}}),a.me},load:function(a){return this._searchCriterias=a,this._getData()}});