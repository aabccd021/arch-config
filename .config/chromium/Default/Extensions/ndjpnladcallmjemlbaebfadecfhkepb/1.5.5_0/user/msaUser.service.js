!function(){"use strict";function e(e,r,t){this.type=t.USER_TYPE.MSA,this.getConfig=function(){var e={url:t.MSACONFIG.URL,params:{client_id:t.MSACONFIG.CLIENT_ID,client_secret:t.MSACONFIG.CLIENT_SECRET,redirect_uri:t.MSACONFIG.REDIRECT_URI},resource:t.ONEDRIVE.INSTANCE,loginUrl:t.MSACONFIG.INSTANCE+"?response_type=code&client_id="+t.MSACONFIG.CLIENT_ID+"&redirect_uri="+t.MSACONFIG.REDIRECT_URI+"&scope="+t.MSACONFIG.SCOPE,logoutUrl:t.MSACONFIG.LOGOUT_URI};return e},this.lookupUserInfo=function(e,i){var I={serviceInfo:{resource:t.LINKS.APP.ONEDRIVE}},c=r.get("$http"),n={method:"GET",url:t.MSACONFIG.USERINFO_URL,headers:{"X-UserType":t.USER_TYPE.MSA}};c(n).success(function(e){I.email=e.emails.account,I.cid=e.id,i(I)}).error(function(){i(I)})}}angular.module("app.user").service("msaUserService",["$log","$injector","constants",e])}();