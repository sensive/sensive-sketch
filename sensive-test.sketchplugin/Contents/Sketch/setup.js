var that=this;function __skpm_run(t,e){that.context=e;var n=function(t){var e={};function n(r){if(e[r])return e[r].exports;var u=e[r]={i:r,l:!1,exports:{}};return t[r].call(u.exports,u,u.exports,n),u.l=!0,u.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var u in t)n.d(r,u,function(e){return t[e]}.bind(null,u));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s="./src/setup.js")}({"./src/setup.js":
/*!**********************!*\
  !*** ./src/setup.js ***!
  \**********************/
/*! exports provided: setup */function(t,e,n){"use strict";n.r(e),n.d(e,"setup",function(){return o});var r=n(/*! sketch/ui */"sketch/ui"),u=n(/*! sketch/settings */"sketch/settings");function o(){u.setSettingForKey("userApplicationToken",r.getStringFromUser("Enter your Sensive token",u.settingForKey("userApplicationToken")))}},"sketch/settings":
/*!**********************************!*\
  !*** external "sketch/settings" ***!
  \**********************************/
/*! no static exports found */function(t,e){t.exports=require("sketch/settings")},"sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */function(t,e){t.exports=require("sketch/ui")}});"default"===t&&"function"==typeof n?n(e):n[t](e)}that.setup=__skpm_run.bind(this,"setup"),that.onRun=__skpm_run.bind(this,"default");