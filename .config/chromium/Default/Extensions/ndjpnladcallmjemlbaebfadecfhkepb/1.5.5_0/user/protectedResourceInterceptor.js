!function(){"use strict";function e(e,r,t,i){var n=t.get("userService"),s={request:function(t){var i=e.defer();if(Utilities.isUndefinedOrNull(t)||Utilities.isUndefinedOrNull(t.headers))return r.error(String.format("protectedResourceInterceptor.request: http request config is null or undefined")),i.resolve(t),i.promise;var s=t.headers["X-UserType"];if(Utilities.isUndefinedOrNull(s))return i.resolve(t),i.promise;var o=t.headers["X-Resource"];return delete t.headers["X-Resource"],delete t.headers["X-UserType"],n.acquireToken(s,t.url,o,function(e){Utilities.isUndefinedOrNull(e)||(t.headers.Authorization="Bearer "+e),i.resolve(t)}),i.promise},responseError:function(r){if(r&&401===r.status){if(Utilities.isNotUndefinedOrNull(r.config)&&(r.config.url===i.O365CONFIG.SHAREPOINT_URL||r.config.url===i.O365CONFIG.PHOTO_URL))return e.reject(r);n.clearToken()}return e.reject(r)}};return s}angular.module("app.user").factory("protectedResourceInterceptor",["$q","$log","$injector","constants",e])}();