importScripts("GnnEK.js");var nw="",ow,mw={"ỊIĨ":function(a){a&&(Fv[So][Pn]=JSON.parse(a))},pushLineConfig:function(a){Fv[ut]=a[ut]?a[ut]:Fv[ut],Fv.LEGY_ENCRYPT_KEY=a.LEGY_ENCRYPT_KEY||Fv.LEGY_ENCRYPT_KEY,Fv[ap]=a[ap]||Fv[ap],Fv.B=a.B||Fv.B,Fv.A=a.A||Fv.A,Fv[mf]=a[mf]||Fv[mf],Fv[Ki]=a[Ki]||Fv[Ki],Fv[So]=a[So]||Fv[So]},close:function(){self.close()},"ỊLṰ":function(a,b,c){c||(c="");try{var d=Qv.ỊǀĮǀٲŤḬÍŦĲ(Fv[ap],b);Ja("ỊLṰ"+c,d,a)}catch(e){fw.ǏĨȈ().ٱٳỈŢĲỊٱĬЇḮ(e,"ỊLṰ"+c)}},"ĲŦΙ":function(a,b,c,d){d||(d="");try{var e=Qv.ŦḬΙΪȈĲŦIṮĲ(Fv[ap],b,c.oid);Ja("ĲŦΙ"+d,e,a)}catch(f){fw.ǏĨȈ().ٱٳỈŢĲỊٱĬЇḮ(f,"ĲŦΙ"+d)}},"ṰȊṬ":function(a,b,c){c||(c="");try{var d=Qv.LŦŦĨٱÌỊŦٳṰ(Fv[ap],b);Ja("ṰȊṬ"+c,d,a)}catch(e){fw.ǏĨȈ().ٱٳỈŢĲỊٱĬЇḮ(e,"ṰȊṬ"+c)}},"ŢٳĨ":function(a,b,c){c||(c="");try{var d=Qv.ǀṰiḬṬǀILǀǏ(Fv[ap],b);Ja("ŢٳĨ"+c,d,a)}catch(e){fw.ǏĨȈ().ٱٳỈŢĲỊٱĬЇḮ(e,"ŢٳĨ"+c)}},copyChatMessageContentT:function(a,b){b||(b="");try{var c=Qv.ΙṪLLIÌṰḬÎÌ(Fv[ap]);Ja("copyChatMessageContentT"+b,c,a)}catch(d){fw.ǏĨȈ().ٱٳỈŢĲỊٱĬЇḮ(d,"copyChatMessageContentT"+b)}},"ÏŤЇ":function(){ow&&(null==nw&&(nw=!1),ow.abort())}};onmessage=function(a){if(a.data instanceof Object&&a.data.hasOwnProperty("method")&&a.data.hasOwnProperty("arguments")){var b=Array.prototype.slice.call(a.data.arguments);mw[a.data[at]].apply(self,b)}else Ia(a.data)};var reply=function(){if(arguments[dt]<1)throw new TypeError("reply - not enough arguments");postMessage({method:arguments[0],arguments:Array.prototype.slice.call(arguments,1)})}