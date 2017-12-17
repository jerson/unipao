// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      function localRequire(x) {
        return newRequire(localRequire.resolve(x));
      }

      localRequire.resolve = function (x) {
        return modules[name][1][x] || x;
      };

      var module = cache[name] = new newRequire.Module;
      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {

},{"./../images/cursor_landing.png":["f7c969700814c29c841a9529f870146b.png",44],"./../images/cursor_landing@2x.png":["7c30b1851ef825f2c561634e8eb6ea25.png",45],"./../images/social_icon_facebook.png":["03c7b3c49627ef90c878ace14a31c37f.png",46],"./../images/social_icon_facebook@2x.png":["d3c26d3a8eaf53922ce576cb6240296d.png",47],"./../images/social_icon_twitter.png":["e71cd6d61562bc7fb3f345fd1b6184e7.png",48],"./../images/social_icon_twitter@2x.png":["4e0045dd1f60fa456f30790a2e634b88.png",49],"./../images/social_icon_google.png":["15b24baf52846be8aec94fdc73794897.png",50],"./../images/social_icon_google@2x.png":["c8e2c1e8f364442d42b570af91af3742.png",51],"./../images/icon_offline.png":["6c551a73d115105140991f4b1fc4d707.png",52],"./../images/icon_offline@2x.png":["431d0812cb674a1c2e374827642e8edd.png",53],"./../images/screen_agenda.png":["608eaa5a2ecb257b6dfea64cfe683f97.png",54],"./../images/screen_agenda@2x.png":["54c4baabd1b5a76afa9fed72c290cb3b.png",55],"./../images/screen_news_list.png":["a5839311449aca32a21e32837eda21fb.png",56],"./../images/screen_news_list@2x.png":["52e26e0c52acd81aa8f1f586017fe401.png",57],"./../images/screen_ipad_schedule.png":["a173ccd358abea731c20837c90b94080.png",58],"./../images/screen_ipad_schedule@2x.png":["268ab4acd219845efb6e223288210122.png",59],"./../images/screen_ipad_assists.png":["080726d9447d51204c6e2c129224c014.png",60],"./../images/screen_ipad_assists@2x.png":["b0aeaa0d576a33d200599fda81c9d18a.png",61],"./../images/screen_login.png":["10c74e2d33e6acbb45899ac423531526.png",62],"./../images/screen_login@2x.png":["2eabb101b72a4478e48a3fc125288deb.png",63],"./../images/feature_icon_security.png":["ff65e54b00eb19bc18af39cf3ad39fec.png",64],"./../images/feature_icon_security@2x.png":["dc264fa9b89c0d206cbf2809b711c33a.png",65],"./../images/feature_icon_fast.png":["471288df5274232110ad2a08a825cb46.png",66],"./../images/feature_icon_fast@2x.png":["d5aadbc9a01cdcff190133bc9ed8189f.png",67],"./../images/feature_icon_offline.png":["af04ee5ed7dfd24b825b176d182120a0.png",68],"./../images/feature_icon_offline@2x.png":["0e8591173905b432a479d042b88307aa.png",69],"./../images/logo_footer.png":["28b55f7d061d52e5caa4981519604936.png",70],"./../images/logo_footer@2x.png":["e4a61cf98b2612b4132afbc80fb480d3.png",71],"./../images/logo.png":["236618dfcc6144b67460a498f67fb18b.png",72],"./../images/logo@2x.png":["a96f9bb75e92d0fd00225b0b2b99287e.png",73],"./../images/download_googleplay.png":["b21b80c617f379b19c4114d14f4ab4dc.png",74],"./../images/download_googleplay@2x.png":["f64eea62e55ca0708afefe2e0014601d.png",75],"./../images/download_appstore.png":["f0b0b3f778fbc63e458e31a661000338.png",76],"./../images/download_appstore@2x.png":["6f05ba135f846b94107348ade194436c.png",77],"./../images/download_windows.png":["827b7db4ce2b9c7fddd3a39ba8232021.png",78],"./../images/download_windows@2x.png":["ef174b5a0f941c53be7b13602a02f77d.png",79],"./../images/screen_intranet.png":["c19926cc67e19a266f4585bb87f9d351.png",80],"./../images/screen_intranet@2x.png":["ac6b276d7bfe6954ad5e8de078306d07.png",81]}],5:[function(require,module,exports) {
var global = (1,eval)("this");
var e=(0,eval)("this");!function(e,t){"function"==typeof define&&define.amd?define([],function(){return t(e)}):"object"==typeof exports?module.exports=t(e):e.SmoothScroll=t(e)}(void 0!==e?e:"undefined"!=typeof window?window:this,function(e){"use strict";var t="querySelector"in document&&"addEventListener"in e&&"requestAnimationFrame"in e&&"closest"in e.Element.prototype,n={ignore:"[data-scroll-ignore]",header:null,speed:500,offset:0,easing:"easeInOutCubic",customEasing:null,before:function(){},after:function(){}},o=function(){for(var e={},t=0,n=arguments.length;t<n;t++){!function(t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])}(arguments[t])}return e},a=function(e){"#"===e.charAt(0)&&(e=e.substr(1));for(var t,n=String(e),o=n.length,a=-1,r="",i=n.charCodeAt(0);++a<o;){if(0===(t=n.charCodeAt(a)))throw new InvalidCharacterError("Invalid character: the input contains U+0000.");r+=t>=1&&t<=31||127==t||0===a&&t>=48&&t<=57||1===a&&t>=48&&t<=57&&45===i?"\\"+t.toString(16)+" ":t>=128||45===t||95===t||t>=48&&t<=57||t>=65&&t<=90||t>=97&&t<=122?n.charAt(a):"\\"+n.charAt(a)}return"#"+r},r=function(t){return t?function(t){return parseInt(e.getComputedStyle(t).height,10)}(t)+t.offsetTop:0};return function(i,c){var u,s,l,d,f,h,m,g={};g.cancelScroll=function(){cancelAnimationFrame(m)},g.animateScroll=function(t,a,i){var c=o(u||n,i||{}),s="[object Number]"===Object.prototype.toString.call(t),l=s||!t.tagName?null:t;if(s||l){var h=e.pageYOffset;c.header&&!d&&(d=document.querySelector(c.header)),f||(f=r(d));var m,v,p,b=s?t:function(e,t,n){var o=0;if(e.offsetParent)do{o+=e.offsetTop,e=e.offsetParent}while(e);return o=Math.max(o-t-n,0)}(l,f,parseInt("function"==typeof c.offset?c.offset():c.offset,10)),y=b-h,S=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight),E=0,I=function(n,o){var r=e.pageYOffset;if(n==o||r==o||(h<o&&e.innerHeight+r)>=S)return g.cancelScroll(),function(t,n,o){o||(t.focus(),document.activeElement.id!==t.id&&(t.setAttribute("tabindex","-1"),t.focus(),t.style.outline="none"),e.scrollTo(0,n))}(t,o,s),c.after(t,a),m=null,!0},O=function(t){m||(m=t),v=(E+=t-m)/parseInt(c.speed,10),p=h+y*function(e,t){var n;return"easeInQuad"===e.easing&&(n=t*t),"easeOutQuad"===e.easing&&(n=t*(2-t)),"easeInOutQuad"===e.easing&&(n=t<.5?2*t*t:(4-2*t)*t-1),"easeInCubic"===e.easing&&(n=t*t*t),"easeOutCubic"===e.easing&&(n=--t*t*t+1),"easeInOutCubic"===e.easing&&(n=t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1),"easeInQuart"===e.easing&&(n=t*t*t*t),"easeOutQuart"===e.easing&&(n=1- --t*t*t*t),"easeInOutQuart"===e.easing&&(n=t<.5?8*t*t*t*t:1-8*--t*t*t*t),"easeInQuint"===e.easing&&(n=t*t*t*t*t),"easeOutQuint"===e.easing&&(n=1+--t*t*t*t*t),"easeInOutQuint"===e.easing&&(n=t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t),e.customEasing&&(n=e.customEasing(t)),n||t}(c,v=v>1?1:v),e.scrollTo(0,Math.floor(p)),I(p,b)||(e.requestAnimationFrame(O),m=t)};0===e.pageYOffset&&e.scrollTo(0,0),c.before(t,a),g.cancelScroll(),e.requestAnimationFrame(O)}};var v=function(e){s&&(s.id=s.getAttribute("data-scroll-id"),g.animateScroll(s,l),s=null,l=null)},p=function(t){if(!("matchMedia"in e&&e.matchMedia("(prefers-reduced-motion)").matches)&&0===t.button&&!t.metaKey&&!t.ctrlKey&&(l=t.target.closest(i))&&"a"===l.tagName.toLowerCase()&&!t.target.closest(u.ignore)&&l.hostname===e.location.hostname&&l.pathname===e.location.pathname&&/#/.test(l.href)){var n;try{n=a(decodeURIComponent(l.hash))}catch(e){n=a(l.hash)}if("#"===n){t.preventDefault();var o=(s=document.body).id?s.id:"smooth-scroll-top";return s.setAttribute("data-scroll-id",o),s.id="",void(e.location.hash.substring(1)===o?v():e.location.hash=o)}(s=document.querySelector(n))&&(s.setAttribute("data-scroll-id",s.id),s.id="",l.hash===e.location.hash&&(t.preventDefault(),v()))}},b=function(e){h||(h=setTimeout(function(){h=null,f=r(d)},66))};return g.destroy=function(){u&&(document.removeEventListener("click",p,!1),e.removeEventListener("resize",b,!1),g.cancelScroll(),u=null,s=null,l=null,d=null,f=null,h=null,m=null)},g.init=function(a){t&&(g.destroy(),u=o(n,a||{}),d=u.header?document.querySelector(u.header):null,f=r(d),document.addEventListener("click",p,!1),e.addEventListener("hashchange",v,!1),d&&e.addEventListener("resize",b,!1))},g.init(c),g}});
},{}],1:[function(require,module,exports) {
function e(e){return e&&e.__esModule?e:{default:e}}require("./styles/App.scss");var r=require("smooth-scroll"),s=e(r),u=new s.default('a[href*="#"]');
},{"./styles/App.scss":3,"smooth-scroll":5}]},{},[1])