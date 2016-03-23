!function(a){var b=a.fn;b.opacity=function(a){return this.css("opacity",a)},b.clickableOn=function(){var a=this,b=function(a){var b=a,c=b.find("a");if(0===c.length)return!1;var d=c.attr("href"),e=c.attr("target");b.on("click",function(){"_blank"===e?window.open().location=d:window.location=d}).css("cursor","pointer")};return function(){for(var c=a.length,d=0;c>d;d++)b(a.eq(d));return a}()},b.clickableOff=function(){var a=this,b=function(a){var b=a;return 0===b.find("a").length?!1:void b.off("click").css("cursor","default")};return function(){for(var c=a.length,d=0;c>d;d++)b(a.eq(d));return a}()},b.anchor=function(b){var c=this,e=a(d()===!0?"body":"html"),f=this.attr("href"),g=b||{},h="#"===f||""===f?"html":f,i=a(h).offset().top,j=g.callback||null,k=g.spd||600,l=g.ease||"easeInOutQuad";return e.stop().animate({scrollTop:i},k,l,j),c};var c=function(b){return"string"==typeof a("<div>").css(b)},d=function(){var a=navigator.userAgent.toLowerCase(),b=!1;return(-1!=a.indexOf("chrome")||-1!=a.indexOf("safari")||-1!=a.indexOf("opera"))&&(b=!0),b},e=function(){var a=(navigator.userAgent.toLowerCase(),!1);return"undefined"==typeof window.addEventListener&&"undefined"==typeof document.getElementsByClassName&&(a=!0),a},f=function(a,b,c){var d=a,e=b,f=d.parent(),g="js-acd-open",h=c||{},i=h.spd||500,j=h.ease||"easeOutExpo",k=h.callback||null,l=function(){e.stop().slideDown(i,j,k),f.addClass(g)},m=function(){e.stop().slideUp(i,j,k),f.removeClass(g)},n=function(){f.hasClass(g)===!0?m():l()};e.hide().css("overflow","hidden"),d.css("cursor","pointer").on("click",n)},g=function(){return e()===!1?!1:void a("[placeholder]").each(function(){var b=a(this),c=b.attr("placeholder"),d="GrayText",e=b.css("color");b.on({focus:function(){b.val()===c&&b.val("").css("color",e)},blur:function(){""===b.val()?b.val(c).css("color",d):b.val()===c&&b.css("color",d)}}).parents("form").submit(function(){b.val()===c&&b.val("")})})},h=function(a){if(e()===!1)return!1;var b=a,c='progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+b.attr("src")+'", sizingMethod="scale");';b.css("filter",c)},i=function(b){if(e()===!1)return!1;var c,d=b;d.each(function(){if(c=a(this),-1===c.attr("src").indexOf(".png"))return!1;var b='progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+c.attr("src")+'", sizingMethod="scale");';c.css("filter",b)})};a.extend({cssSupport:function(a){return c(a)},isWebkitUA:function(){return d()},isIE8Under:function(){return e()},accordion:function(a,b,c){return f(a,b,c)},placeholder:function(){return g()},alphaImgLoader:function(){return h()},alphaImgLoaderBlc:function(){return i()}})}(jQuery),function(a,b){"use strict";var c=function(){var a=this;a.checkUA(),a.checkDevice()};c.prototype={OS:"",UA:"",IEver:"not IE",isFlash:!1,isMobile:!1,device:"pc",id:"",className:"",hasQuery:"",urlQuery:"",getID:function(){{var a=this,c=b.getElementsByTagName("body")[0];a.UA}a.id=c.getAttribute("id"),a.className=c.className},checkOS:function(){this.OS=-1!=navigator.platform.indexOf("Win")?"windows":"mac"},checkUA:function(){var c=this,d=b,e="",f="",g=a.navigator,h=g.userAgent.toLowerCase(),i=g.appVersion.toLowerCase();-1!==h.indexOf("msie")?(e="ie",f=-1!==i.indexOf("msie 8.")?"ie8":-1!==i.indexOf("msie 9.")?"ie9":"ie10"):-1!==h.indexOf("trident/7")?(e="ie",f="ie11"):e=-1!==h.indexOf("firefox")?"firefox":"webkit",("ie8"===f||"ie9"===f)&&(b.getElementsByTagName("html")[0].className=f),8===d.documentMode&&(f="ie8",b.getElementsByTagName("html")[0].className="ie8"),c.UA=e,c.IEver=f},checkIE8:function(){var c=!1;return"undefined"==typeof a.addEventListener&&"undefined"==typeof b.querySelectorAll?c=!1:this.checkIE8Under()===!0&&(c=!0),c},checkIE9:function(){var a=this,b=!1;return a.checkIE8Under()===!0?b=!1:a.checkIE9Under()===!0&&(b=!0),b},checkIE8Under:function(){var c=!1,d="undefined";return typeof a.addEventListener==d&&typeof b.getElementsByClassName==d&&(c=!0),c},checkIE9Under:function(){var c=!1;return b.uniqueID&&"undefined"==typeof a.matchMedia&&(c=!0),c},checkDevice:function(){var a=this,b="pc",c=navigator.userAgent,d=!1;c.indexOf("Android")>0&&-1==c.indexOf("Mobile")||c.indexOf("A1_07")>0||c.indexOf("SC-01C")>0||c.indexOf("iPad")>0?(d=!0,b="tablet"):(c.indexOf("iPhone")>0&&-1==c.indexOf("iPad")||c.indexOf("iPod")>0||c.indexOf("Android")>0&&c.indexOf("Mobile")>0)&&(d=!0,b="sp"),a.device=b,a.isMobile=d},checkFlash:function(){var a=function(){if(navigator.plugins["Shockwave Flash"])return!0;try{return new ActiveXObject("ShockwaveFlash.ShockwaveFlash"),!0}catch(a){return!1}}();return a&&!$.device("android")?!0:!1},checkURLQuery:function(){var a=this,b=location.search;return 0===b.length?!1:(a.hasQuery=!0,void(a.urlQuery=b.substr(1).split("&").toString()))}},a.UserInfo=c}(window,document),function(a,b){var c=function(){},d=c.prototype;d.isIE8=function(){var c=!1;return"undefined"==typeof a.addEventListener&&"undefined"==typeof b.querySelectorAll?c=!1:this.isIE8Under()===!0&&(c=!0),c},d.isIE9=function(){var a=this,b=!1;return a.isIE8Under()===!0?b=!1:a.isIE9Under()===!0&&(b=!0),b},d.isIE8Under=function(){var c=!1,d="undefined";return typeof a.addEventListener==d&&typeof b.getElementsByClassName==d&&(c=!0),c},d.isIE9Under=function(){var c=!1;return b.uniqueID&&"undefined"==typeof a.matchMedia&&(c=!0),c},d.getWindowWidth=function(){var c=a.innerWidth||b.body.clientWidth;return c},d.getWindowHeight=function(){var c=a.innerHeight||b.body.clientHeight;return c},d.getScrollTop=function(){var a=b.body.scrollTop||b.documentElement.scrollTop;return a},d.addClass=function(a,b){var c=a,d=b;c.classList?c.classList.add(d):c.className+=" "+d},d.reomveClass=function(a,b){var c=a,d=b;c.classList?c.classList.remove(d):c.className=c.className.replace(new RegExp("(^|\\b)"+d.split(" ").join("|")+"(\\b|$)","gi")," ")},d.hasClass=function(a,b){var c=a,d=b,e=!1;return e=c.classList?c.classList.contains(d):new RegExp("(^| )"+d+"( |$)","gi").test(c.className)},d.yearAdjust=function(a){var c=a||"nowYear",d=(new Date).getFullYear();b.getElementById(c).innerHTML+=d},a.Library=c}(window,document);