;(function(window, document) {
	"use strict";


	/**
	 * ブレークポイントの切替時に発火するイベント用クラス  
	 * PC用・SP用の関数を所持している
	 * @class BreakEvent
	 * @constracutor
	 * @param {Function} a_pcfunc PCレイアウト切替時に実行する関数
	 * @param {Function} a_spfunc SPレイアウト切替時に実行する関数
	 */
	function BreakEvent(a_pcfunc,a_spfunc){
		"use strict";
		var _self = this;
		_self.pcFunc = a_pcfunc;
		_self.spFunc = a_spfunc;
	};
	BreakEvent.prototype = {
		pcFunc:null,
		spFunc:null
	};




	/**
	 * ブレークポイントの切り替えを検知する  
	 * 対応数できるポイント数は１つ  
	 * それ以上は別クラスを作成して対応する
	 * @class BreakPointOne
	 * @constructor
	 * @param {Number}   a_border ブレークポイント幅
	 * @param {Function} a_pcFunc PC側に切り替わった際の関数
	 * @param {Function} a_spFunc SP側に切り替わった際の関数
	 * @example
	 * var BPO = new BreakPointOne(768,pcFunc,spFunc);  
	 * function pcFunc(){ pcレイアウト切替時の処理 };  
	 * function spFunc(){ spレイアウト切替時の処理 };
	 */
	function BreakPointOne(a_border) {
		"use strict";
		var _self = this;
		_self.border = a_border;
		_self.functions = [];
	};
	BreakPointOne.prototype = {
		/**
		 * ブレークポイントの境界値
		 * @property {Number} border
		 */
		border:null,
		/**
		 * ブレークポイント切替時の関数用オブジェクトを格納する
		 * @property  {Array} functions
		 */
		functions:null,
		/**
		 * 関数の総数
		 * @property  {Number} funcLengh
		 */
		funcLengh:0,
		/**
		 * 現在のページの状態がPCかSPかを判断する為の正否値  
		 * @property {Boolean} isSP
		 */
		isSP: null,
		/**
		 * 閲覧中のブラウザがIE8かを判断する為の正否値  
		 * @property {Boolean} isIE8
		 */
		isIE8:null,
		/**
		 * リサイズ関数をremoveするための関数ラッパー  
		 * @property {Function} resizeEvent
		 */
		resizeEvent:null,
		/**
		 * レイアウトを分岐させる為のクラスを追加するhtml要素 
		 * @property {Object} wrappers
		 */
		wrapper:false,

		/**
		 * 初期化  
		 * コンストラクタ時にリサイズイベントを設定する
		 * @method init
		 */
		init: function() {
			var _self = this,
				_win = window,
				_info = new PageInfo();

			//IE分岐処理
			_info.checkUA();
			_self.isIE8 = (_info.IEver === "ie8") ? true : false;

			if(_self.isIE8 === true) return false;

			/*eventHandlerを正確に実行するための処理
			resizeEventに処理を格納してからイベントハンドラを実行しないと、
			イベントがremoveされない
			不要な場合はラッパーせずそのままリサイズ時の処理をハンドラーに渡す
			*/

			//リサイズイベント処理 addEventListenerの有無でIE8と分岐
			if (_win.addEventListener) {
				_win.addEventListener("resize",function(){ _self.breakPointCheck(); },false);
			} else {
				_win.attachEvent('on' + "resize",function(){ _self.breakPointCheck(); });
			}

			_self.breakPointCheck();
		},

		/**
		 * リサイズイベントを破棄する
		 * @method reset
		 */
		reset: function() {
			var _self = this,
				_win = window;

			if (_win.removeEventListener)
				_win.removeEventListener("resize",_self.resizeEvent,false);
			else
				_win.detachEvent('on' + "resize", _self.resizeEvent);
		},

		/**
		 * リサイズ時にブレークポイントの状態を確認する  
		 * ウィンドウ幅とブレークポイント幅を確認し、  
		 * PC・SPの切り替わりが判定された場合、設定した関数を実行する
		 * @method breakPointCheck
		 */
		breakPointCheck: function() {
			var _self = this,
				_winW = window.innerWidth || document.documentElement.clientWidth,
				_breakpoint = _self.border,
				_isSP = _self.isSP,
				_isSP_now = false;

			//ブレークポイントとウィンドウ幅の差異を確認
			if (_breakpoint < _winW) _isSP_now = false;
			else _isSP_now = true;


			//判定後、ブレークポイントが切り替わった時点でコールバック関数処理
			if (_isSP === _isSP_now) return false;

			if (_isSP_now === true) _self.spFuncOperation();
			else _self.pcFuncOperation();

			_self.isSP = _isSP_now;
		},

		/**
		 * 各デバイス毎の関数を指定
		 * @param   {Function} a_pc PC用関数
		 * @param   {Function} a_sp SP用関数
		 */
		setFunc:function(a_pc,a_sp){
			var _self = this,
				_event = new BreakEvent(a_pc,a_sp);

			//IE8はPC用関数を返す
			if(_self.isIE8 === true){
				a_pc();
				return false;
			}

			if(_self.isSP === true) a_sp();
			else a_pc();

			_self.functions[_self.funcLengh] = _event;
			_self.funcLengh++;
		},

		/**
		 * 登録したPC用関数を呼び出す
		 */
		pcFuncOperation:function(){
			var _self = this,
				_func = _self.functions,
				_len = _self.funcLengh;

			for(var i = 0; i<_len; i++) _func[i].pcFunc();
		},

		/**
		 * 登録したSP用関数を呼び出す
		 */
		spFuncOperation:function(){
			var _self = this,
				_func = _self.functions,
				_len = _self.funcLengh;

			for(var i = 0; i<_len; i++) _func[i].spFunc();
		}
	};



	window.BreakPointOne = BreakPointOne;

})(window, document);


var BPO = new BreakPointOne(767);
if (window.addEventListener) window.addEventListener('load', function(){BPO.init();});
else window.attachEvent('onload', function() {BPO.init();});


