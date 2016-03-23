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
