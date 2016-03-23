;(function($){
	
	var $fn = $.fn;
	
	/*jQuery Instance Funtion
	--------------------------------------------------------------------*/
	
	/**
	 * 要素の透明度を直接変更
	 * @param {Number} 透明度の数値
	 */
	$fn.opacity		=	function(a_alp){return this.css('opacity',a_alp);};
	

	/**
	 * 要素のクリッカブル機能をONに
	 */
	$fn.clickableOn	=	function(){
		var _self = this,
			_clickable	=	function(a_obj){
				var _obj = a_obj,
					_link = _obj.find("a");

				if(_link.length === 0) return false;

				var _href = _link.attr("href"),
					_target = _link.attr("target");
				
				_obj.on("click",function(){
					if(_target === "_blank") window.open().location = _href;
					else window.location = _href;
				}).css("cursor","pointer");
			};
		return (function () {
			var _len = _self.length;
			for(var i=0; i<_len; i++) _clickable(_self.eq(i));
			return _self;
		}());
	};
	
	
	/**
	 * 要素のクリッカブル機能をOFFに
	 */
	$fn.clickableOff	=	function(){
		var _self = this,
			_clickable	=	function(a_obj){
				var _obj = a_obj;
				if(_obj.find("a").length === 0) return false;
				_obj.off("click").css("cursor","default");
			};
		
		return (function () {
			var _len = _self.length;
			for(var i=0; i<_len; i++) _clickable(_self.eq(i));
			return _self;
		}());
	};

	
	/**
	 * スムーズスクロール
	 * @param {String} 要素のhref属性
	 */
	$fn.anchor = function(a_opts){
		var _self = this,
			_$tag	 = (isWebkitUA() === true) ? $("body"):$("html"),
			_href	 = this.attr("href"),
			_opts	 = a_opts || {},
			_target	 = _href === "#" || _href === "" ? 'html' : _href,
			_position= $(_target).offset().top,
			_func	 = _opts.callback || null,
			_spd	 = _opts.spd || 600,
			_ease	 = _opts.ease || "easeInOutQuad";
		_$tag.stop().animate({scrollTop:_position},_spd,_ease,_func);
		return _self;
	};
	

	
	
	
	/*jQuery Object Funtion
	--------------------------------------------------------------------*/
	
	/**
	 * CSSのプロパティがサポートされているかの判定
	 * @param   {String}  PROPERTY プロパティの名前
	 * @returns {Boolean} 正否値
	 */
	var cssSupport = function(PROPERTY){
		return typeof $('<div>').css(PROPERTY)==="string";
	};

	
	/**
	 * Webkitエンジンかを判定
	 * @returns {Boolean}
	 */
	var isWebkitUA = function(){
		var _ua = navigator.userAgent.toLowerCase(),
			_flg = false;
		if (_ua.indexOf('chrome') != -1 || _ua.indexOf('safari') != -1 || _ua.indexOf('opera') != -1) {
			_flg = true;
		}
		return _flg;
	};

	
	/**
	 * IE8以下か判定
	 * @returns {Boolean}
	 */
	var isIE8Under = function(){
		var _ua = navigator.userAgent.toLowerCase(),
			_flg = false;
		
		if(typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined"){
			_flg = true;
		}
		return _flg;
	};

	
	/**
	 * アコーディオン
	 * @param {Object} a_$btn アコーディオンの見出し部分のjQueryオブジェクト
	 * @param {Object} a_$body アコーディオンのボディ部分のjQueryオブジェクト
	 * @param {Object} a_param 内部設定のパラメーター{ spd:速度,ease:イージング,callback：　コールバック関数}
	 * @example obj.accordion($(".js-acd-btn"),$(".js-acd-body"),{spd:600,ease:"easeOutBack"});
	 */
	var accordion = function(a_$btn,a_$body,a_opts){
		var _$btn	 = a_$btn,
			_$body	 = a_$body,
			_$parent = _$btn.parent(),
			_clsName = "js-acd-open",
			_param	 = a_opts || {},
			_spd	 = _param.spd || 500,
			_ease	 = _param.ease || "easeOutExpo",
			_callback= _param.callback || null;

		//アニメーション
		var open = function(){
			_$body.stop().slideDown(_spd,_ease,_callback);
			_$parent.addClass(_clsName);
		};
		var close = function(){
			_$body.stop().slideUp(_spd,_ease,_callback);
			_$parent.removeClass(_clsName);
		};
		var judge = function(){
			if(_$parent.hasClass(_clsName) === true) close();
			else open();
		};

		//初期化
		_$body.hide().css("overflow","hidden");
		_$btn.css("cursor","pointer").on("click",judge);
	};


	/**
	 * IE8以下 jQuery HTML5_placeholder対応
	 */
	var placeholder = function(){
		if(isIE8Under() === false) return false;
		$('[placeholder]').each(function () {
			var input = $(this),
				placeholderText = input.attr('placeholder'),
				placeholderColor = 'GrayText',
				defaultColor = input.css('color');

			input.on({
				"focus":function(){
					if (input.val() === placeholderText) {
						input.val('').css('color', defaultColor);
					}
				},
				"blur":function(){
					if (input.val() === '') {
						input.val(placeholderText).css('color', placeholderColor);
					} else if (input.val() === placeholderText) {
						input.css('color', placeholderColor);
					}
				}
			}).parents('form').submit(function () {
				if (input.val() === placeholderText) {
					input.val('');
				}
			});
		});
	};


	/**
	 * IE8,7で透過処理を個別に対応
	 * @param {Object} obj 処理を行いたいjQueryオブジェクト
	 */
	var alphaImgLoader = function(obj){
		if(isIE8Under() === false) return false;
		var _img = obj,
			_prop = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + _img.attr('src') + '", sizingMethod="scale");'
		_img.css('filter',_prop);
	};


	/**
	 * IE8,7で透過処理を入れ子に対応
	 * @param {Object}  obj 処理を行いたい画像の親jQueryオブジェクト
	 */
	var alphaImgLoaderBlc = function(obj){
		if(isIE8Under() === false) return false;
		var _o = obj,
			_img;
		_o.each(function(){
			_img = $(this);
			if(_img.attr('src').indexOf('.png') === -1) return false;
			var _prop = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + _img.attr('src') + '", sizingMethod="scale");';
			_img.css('filter',_prop);
		})
	};


	
	
	/*jQuery Object Extend
	--------------------------------------------------------------------*/
	$.extend({
		cssSupport  		:function(a_str){return cssSupport(a_str)},
		isWebkitUA  		:function(){return isWebkitUA()},
		isIE8Under  		:function(){return isIE8Under()},
		accordion  			:function(a_btn,a_body,a_opts){return accordion(a_btn,a_body,a_opts)},
		placeholder 		:function(){return placeholder()},
		alphaImgLoader  	:function(){return alphaImgLoader()},
		alphaImgLoaderBlc	:function(){return alphaImgLoaderBlc()}
	});
	
	
})(jQuery);
;(function(window,document){
	"use strict";


	/**
	 * OS・UA・ページの情報を取得・操作する
	 * ・コンストラクタで情報を取得し、インスタンスの変数から参照する
	 * ・OS・UA・デバイス判定
	 * ・css読み込み・viewport表示変更
	 * @class UserInfo
	 * @constructor
	 * @example var obj = new UserInfo();
	 * if(obj.isMobile === true) return false;
	 */
	var USERINFO = function() {
		var _self = this;
		_self.checkUA();
		_self.checkDevice();
	};
	USERINFO.prototype = {

		/**
		 * 閲覧環境：OS
		 * @property {String} OS
		 */
		OS: "",

		/**
		 * 閲覧環境：ユーザーエージェント
		 * @property {String} UA
		 */
		UA: "",

		/**
		 * 閲覧環境：ieのバージョン
		 * @property {String} IEver
		 */
		IEver: "not IE",

		/**
		 * 閲覧環境：Flashプレーヤー判定
		 * Flashプレーヤーの有無を確認
		 * @property {Boolean} isFlash
		 */
		isFlash: false,

		/**
		 * 閲覧環境：モバイル判定
		 * 判定の範囲は随時更新する
		 * @property {Boolean} isMobile
		 */
		isMobile: false,

		/**
		 * 閲覧環境：デバイスの種類
		 * @property {String} device
		 */
		device: "pc",

		/**
		 * ページ情報：閲覧しているページのbody要素のid
		 * サイト毎で起点となる要素は変更する
		 * @property {String} id
		 */
		id: "",

		/**
		 * ページ情報：閲覧しているページのbody要素のclass
		 * サイト毎で起点となる要素は変更する
		 * @property {String} className
		 */
		className: "",

		/**
		 * ページ情報：URL内のクエリの有無
		 * @property {Boolean} hasQuery
		 */
		hasQuery: "",

		/**
		 * ページ情報：URL内のクエリの内容
		 * @property {String} urlQuery
		 */
		urlQuery: "",



		/**
		 * IDの取得（IEの場合はwrapperにIE追加）
		 * @method getID
		 */
		getID: function() {
			var _self = this,
				_bodys = document.getElementsByTagName("body")[0],
				_classStr = _self.UA;

			_self.id = _bodys.getAttribute('id');
			_self.className = _bodys.className;
		},

		/** 
		 * OSチェック
		 * @method checkOS
		 */
		checkOS: function() {
			if (navigator.platform.indexOf("Win") != -1) this.OS = "windows";
			else this.OS = "mac";
		},

		/**
		 * UserAgentチェック
		 * @method checkUA
		 */
		checkUA: function() {
			var _self = this,
				_d = document,
				_UA = "",
				_UAver = "",
				_wn = window.navigator,
				_wnUA = _wn.userAgent.toLowerCase(),
				_wnVer = _wn.appVersion.toLowerCase();

			//ブラウザ確認
			if (_wnUA.indexOf("msie") !== -1) {
				_UA = "ie";
				if (_wnVer.indexOf("msie 8.") !== -1) _UAver = 'ie8';
				else if (_wnVer.indexOf("msie 9.") !== -1) _UAver = "ie9";
				//				else if (_wnVer.indexOf("msie 7.") !== -1) _UAver = 'ie7';
				//				else if (_wnVer.indexOf("msie 6.") !== -1) _UAver = 'ie6';
				else _UAver = "ie10";
			} else if (_wnUA.indexOf('trident/7') !== -1) {
				_UA = "ie";
				_UAver = 'ie11';
			} else {
				if (_wnUA.indexOf("firefox") !== -1) _UA = "firefox";
				else _UA = "webkit";
			};

			if (_UAver === "ie8" || _UAver === "ie9") document.getElementsByTagName("html")[0].className = _UAver;

			//互換モード対応
			if (_d.documentMode === 8){
				_UAver = "ie8";
				document.getElementsByTagName("html")[0].className = "ie8";	
			}

			//値をプロパティに帰属させる
			_self.UA = _UA;
			_self.IEver = _UAver;
		},

		/**
		 * 閲覧環境：IE8以下判定
		 * @method checkIE8
		 */
		checkIE8: function(){
			var _flg = false;
			if(typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined") _flg = false;
			else if(this.checkIE8Under() === true) _flg = true;
			return _flg;
		},

		/**
		 * 閲覧環境：IE9判定
		 * @method checkIE9
		 */
		checkIE9: function(){
			var _self= this,
				_flg = false,
				_und = "undefined";
			if(_self.checkIE8Under() === true) _flg = false;
			else if(_self.checkIE9Under() === true) _flg = true;
			return _flg;
		},

		/**
		 * 閲覧環境：IE8以下判定
		 * @method checkIE8Under
		 */
		checkIE8Under: function(){
			var _flg = false,
				_und = "undefined";
			if(typeof window.addEventListener == _und && typeof document.getElementsByClassName == _und) _flg = true;
			return _flg;
		},

		/**
		 * 閲覧環境：IE9以下判定
		 * @method checkIE9Under
		 */
		checkIE9Under: function(){
			var _flg = false;
			if(document.uniqueID && typeof window.matchMedia == "undefined") _flg = true;
			return _flg;
		},

		/**
		 * PC・モバイル　デバイスチェック
		 * @method checkDevice
		 */
		checkDevice: function() {
			var _self = this,
				_device = "pc",
				_deviceUA = navigator.userAgent,
				_isMobile = false;

			if ((_deviceUA.indexOf('Android') > 0 && _deviceUA.indexOf('Mobile') == -1) || _deviceUA.indexOf('A1_07') > 0 || _deviceUA.indexOf('SC-01C') > 0 || _deviceUA.indexOf('iPad') > 0) {
				_isMobile = true;
				_device = "tablet";
			} else if ((_deviceUA.indexOf('iPhone') > 0 && _deviceUA.indexOf('iPad') == -1) || _deviceUA.indexOf('iPod') > 0 || (_deviceUA.indexOf('Android') > 0 && _deviceUA.indexOf('Mobile') > 0)) {
				_isMobile = true;
				_device = "sp";
			};

			_self.device = _device;
			_self.isMobile = _isMobile;
		},

		/**
		 * Flashプレーヤーの有無をチェック
		 * @method checkFlash
		 */
		checkFlash: function() {
			var _isFlashInstalled = function() {
				if (navigator.plugins["Shockwave Flash"]) {
					return true;
				}
				try {
					new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
					return true;
				} catch (e) {
					return false;
				}
			}();
			return _isFlashInstalled && !$.device("android") ? true : false;
		},

		/**
		 * クエリチェック
		 * @method checkURLQuery
		 */
		checkURLQuery: function() {
			var _self = this,
				_queryLen = location.search;
			if (_queryLen.length === 0) return false;
			_self.hasQuery = true;
			_self.urlQuery = _queryLen.substr(1).split("&").toString();
		}
	};


	window.UserInfo = USERINFO;
})(window, document);

;(function(window,document){
	

	/**
	 * 多用する処理をまとめたクラス  
	 * ・単純なアニメーション処理  
	 * ・HTML5対応処理  
	 * ・IE対応
	 * @class Library
	 * @constructor
	 * @example var obj = new Library();  
	 * obj.anchor("#header"); //アンカーリンク処理
	 */
	var LIBRARY = function(){},
		METHOD = LIBRARY.prototype;
	
	
	
	
	/*DOM Method
	--------------------------------------------------------------------*/

	/**
	 * 閲覧環境：IE8以下判定
	 * @method checkIE8
	 * @return {Boolean} ブラウザの判定
	 */
	METHOD.isIE8 = function(){
		var _flg = false;
		if(typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined") _flg = false;
		else if(this.isIE8Under() === true) _flg = true;
		return _flg;
	};

	
	/**
	 * 閲覧環境：IE9判定
	 * @method isIE9
	 * @return {Boolean} ブラウザの判定
	 */
	METHOD.isIE9 = function(){
		var _self= this,
			_flg = false,
			_und = "undefined";
		if(_self.isIE8Under() === true) _flg = false;
		else if(_self.isIE9Under() === true) _flg = true;
		return _flg;
	};
	

	/**
	 * 閲覧環境：IE8以下判定
	 * @method isIE8Under
	 * @return {Boolean} ブラウザの判定
	 */
	METHOD.isIE8Under = function(){
		var _flg = false,
			_und = "undefined";
		if(typeof window.addEventListener == _und && typeof document.getElementsByClassName == _und) _flg = true;
		return _flg;
	};

	
	/**
	 * 閲覧環境：IE9以下判定
	 * @method isIE9Under
	 * @return {Boolean} ブラウザの判定
	 */
	METHOD.isIE9Under = function(){
		var _flg = false;
		if(document.uniqueID && typeof window.matchMedia == "undefined") _flg = true;
		return _flg;
	};

	
	/**
	 * ウィンドウの幅を取得
	 * @method getWindowWidth
	 * @returns {Number} ウィンドウ幅
	 */
	METHOD.getWindowWidth = function(){
		var _width = window.innerWidth || document.body.clientWidth;
		return _width;
	};
	

	/**
	 * ウィンドウの高さを取得
	 * @method getWindowHeight
	 * @returns {Number} ウィンドウ高
	 */
	METHOD.getWindowHeight = function(){
		var _height = window.innerHeight || document.body.clientHeight;
		return _height;
	};
	
	
	/**
	 * ウィンドウの高さを取得
	 * @method getScrollTop
	 * @returns {Number} スクロール位置
	 */
	METHOD.getScrollTop = function(){
		var _y = document.body.scrollTop || document.documentElement.scrollTop;
		return _y;
	};

	
	/**
	 * 指定DOMのclassを追加
	 * @method addClass
	 * @param {DOM} DOM要素
	 * @param {String} クラス名
	 */
	METHOD.addClass = function(a_dom,a_cls){
		var _dom = a_dom,
			_cls = a_cls;
		if (_dom.classList) _dom.classList.add(_cls);
		else _dom.className += ' ' + _cls;
	};

	
	/**
	 * 指定DOMのclassを削除
	 * @method reomveClass
	 * @param {DOM} DOM要素
	 * @param {String} クラス名
	 */
	METHOD.reomveClass = function(a_dom,a_cls){
		var _dom = a_dom,
			_cls = a_cls;
		if (_dom.classList) _dom.classList.remove(_cls);
		else _dom.className = _dom.className.replace(new RegExp('(^|\\b)' + _cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	};
	
	
	/**
	 * 指定DOMが任意のclassを持つか判定
	 * @method hasClass
	 * @returns {Boolean} クラスを持っているか正否値
	 */
	METHOD.hasClass = function(a_dom,a_cls){
		var _dom = a_dom,
			_cls = a_cls,
			_flg = false;
		if (_dom.classList) _flg =  _dom.classList.contains(_cls);
		else _flg = new RegExp('(^| )' + _cls + '( |$)', 'gi').test(_dom.className);
		return _flg;
	};

	
	/**
	 * 年数表記を自動で現在の値に書き換える
	 * @method yearAdjust
	 * @param {String} id 年数を囲っているid
	 * @example obj.yearAdust();
	 */
	METHOD.yearAdjust = function(id){
		var _id = id || "nowYear",
			_now_year = new Date().getFullYear();
		document.getElementById(_id).innerHTML += _now_year;
	};

	
	
	
	

	
	window.Library = LIBRARY;
})(window, document);
