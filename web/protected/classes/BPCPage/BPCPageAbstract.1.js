var BPCPageJs=new Class.create();BPCPageJs.prototype={_ajaxRequest:null,callbackIds:{},initialize:function(){},setCallbackId:function(a,b){this.callbackIds[a]=b;return this},getCallbackId:function(a){if(this.callbackIds[a]===undefined||this.callbackIds[a]===null){throw"Callback ID is not set for:"+a}return this.callbackIds[a]},postAjax:function(d,c,e,b){var a={};a.me=this;a.me._ajaxRequest=new Prado.CallbackRequest(d,e);a.me._ajaxRequest.setCallbackParameter(c);a.timeout=(b||30000);if(a.timeout<30000){a.timeout=30000}a.me._ajaxRequest.setRequestTimeOut(a.timeout);a.me._ajaxRequest.dispatch();return a.me._ajaxRequest},abortAjax:function(){if(tmp.me._ajaxRequest!==null){tmp.me._ajaxRequest.abort()}},getResp:function(b,a,d){var c={};c.expectNonJSONResult=(a!==true?false:true);c.result=b;if(c.expectNonJSONResult===true){return c.result}if(!c.result||!c.result.isJSON()){return}c.result=c.result.evalJSON();if(c.result.errors.size()!==0){c.error="Error: \n\n"+c.result.errors.join("\n");if(d===true){throw c.error}else{return alert(c.error)}}return c.result.resultData},getCurrency:function(f,c,b,a,e){var d={};d.decimal=(isNaN(b=Math.abs(b))?2:b);d.dollar=(c==undefined?"$":c);d.decimalPoint=(a==undefined?".":a);d.thousandPoint=(e==undefined?",":e);d.sign=(f<0?"-":"");d.Int=parseInt(f=Math.abs(+f||0).toFixed(d.decimal))+"";d.j=(d.j=d.Int.length)>3?d.j%3:0;return d.dollar+d.sign+(d.j?d.Int.substr(0,d.j)+d.thousandPoint:"")+d.Int.substr(d.j).replace(/(\d{3})(?=\d)/g,"$1"+d.thousandPoint)+(d.decimal?d.decimalPoint+Math.abs(f-d.Int).toFixed(d.decimal).slice(2):"")},keydown:function(c,a,b){if(!((c.which&&c.which==13)||(c.keyCode&&c.keyCode==13))){if(typeof(b)==="function"){b()}return true}if(typeof(a)==="function"){a()}return false}};