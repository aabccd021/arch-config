importScripts("xWbrg.js");var nw="",ow,mw={"ÎȈȈ":function(a){a&&(Fv[So][Pn]=JSON.parse(a))},pushLineConfig:function(a){Fv[ut]=a[ut]?a[ut]:Fv[ut],Fv.LEGY_ENCRYPT_KEY=a.LEGY_ENCRYPT_KEY||Fv.LEGY_ENCRYPT_KEY,Fv[ap]=a[ap]||Fv[ap],Fv.B=a.B||Fv.B,Fv.A=a.A||Fv.A,Fv[mf]=a[mf]||Fv[mf],Fv[Ki]=a[Ki]||Fv[Ki],Fv[So]=a[So]||Fv[So]},close:function(){self.close()},"ŢÏŤ":function(a,b,c){c||(c="");try{var d=Qv.ǀḮĲٲḮṬǀŢlÌ(Fv[ap],b);Ja("ŢÏŤ"+c,d,a)}catch(e){fw.ٲȊǏ().iٲŤٱŤÏΪṪiḮ(e,"ŢÏŤ"+c)}},"ΪỊΙ":function(a,b,c,d){d||(d="");try{var e=Qv.ĲٱЇĲІÏĬĬٲŦ(Fv[ap],b,c.oid);Ja("ΪỊΙ"+d,e,a)}catch(f){fw.ٲȊǏ().iٲŤٱŤÏΪṪiḮ(f,"ΪỊΙ"+d)}},"ŦŦl":function(a,b,c){c||(c="");try{var d=Qv.ḮlǏٳĲĮЇiḬṮ(Fv[ap],b);Ja("ŦŦl"+c,d,a)}catch(e){fw.ٲȊǏ().iٲŤٱŤÏΪṪiḮ(e,"ŦŦl"+c)}},"ٲÍĲ":function(a,b,c){c||(c="");try{var d=Qv.ΪΪٲٳЇŦŤṪŦL(Fv[ap],b);Ja("ٲÍĲ"+c,d,a)}catch(e){fw.ٲȊǏ().iٲŤٱŤÏΪṪiḮ(e,"ٲÍĲ"+c)}},copyChatMessageContentT:function(a,b){b||(b="");try{var c=Qv.ĨĲȈḬĨṪlṰỊŦ(Fv[ap]);Ja("copyChatMessageContentT"+b,c,a)}catch(d){fw.ٲȊǏ().iٲŤٱŤÏΪṪiḮ(d,"copyChatMessageContentT"+b)}},"ỊΪḬ":function(){ow&&(null==nw&&(nw=!1),ow.abort())}};onmessage=function(a){if(a.data instanceof Object&&a.data.hasOwnProperty("method")&&a.data.hasOwnProperty("arguments")){var b=Array.prototype.slice.call(a.data.arguments);mw[a.data[at]].apply(self,b)}else Ia(a.data)};var reply=function(){if(arguments[dt]<1)throw new TypeError("reply - not enough arguments");postMessage({method:arguments[0],arguments:Array.prototype.slice.call(arguments,1)})}