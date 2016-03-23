/**
 * y軸のスクロールに対して、イベントを展開する
 * @class ScrollFireDom
 * @constructor
 * @param {String}   strID   要素のID
 * @param {Function} varFunc 発火時の処理
 */
function ScrollFireDom(strID,varFunc){
	"use strict";
	var _t = this,
		_id = strID,
		_dom = document.getElementById(_id);
	_t.id = _id;
	_t.y = _dom.offsetTop;
	_t.func = varFunc;
};
ScrollFireDom.prototype = {
	id:"",
	y:0,
	func:null,
	threshold:300,
	isFired:false,

	/**
	 * y座標とスクロール値を比較してイベント発火
	 * @param   {Number}  y スクロール値
	 */
	fire:function(y){
		var _t = this;
		
		if(_t.isFired === true) return false;
		
		//差の絶対値で距離が近い場合にイベント発火
		var _abs = _t.y - y;
		_abs = _abs>0?_abs:-_abs;
		if(_abs > _t.threshold) return false;
		_t.isFired = true;
		_t.func();
	}
};



/**
 * スクロール値を取得しイベントを発火させる
 * @class ScrollFire
 * @constructor
 */
function ScrollFire(){
	"use strict";
	this.init();
};
ScrollFire.prototype = {
	
	/**
	  * 現在のスクロール値
	  * @property {Number} scrNum 
	 */
	scrNum:0,
	/**
	  * イベント格納用配列  
	  * ScrollFireDomから引き渡される関数を格納する
	  * @property {Array} events 
	 */
	events:null,
	
	/**
	  * 初期化
	  * @method init
	 */
	init:function(){
		var _t = this;
		_t.events = [];
	},
	
	/**
	 * イベントをインスタンスにセットする
	 * @method setEvent
	 * @param {String}   strID   ID名
	 * @param {Function} varFunc 変数定義されたイベント内容
	 */
	setEvent:function(strID,varFunc){
		var _dom = new ScrollFireDom(strID,varFunc);
		this.events.push(_dom);
	},

	/**
	 * ScrollFireDomオブジェクトの回転処理  
	 * スクロール値と各オブジェクトのイベント開始値を照合し、切り替え用の関数を実行
	 * @method checkEvents
	 */
	checkEvents:function(){
		var _t = this,
			_events = _t.events,
			_len = _events.length,
			_y	 = _t.checkScroll(),
			_obj = null;
				
		//ary内のTriggerDomオブジェクトの状態確認
		for(var i = 0; i < _len; i++) _events[i].fire(_y);
	},

	/**
	 * スクロール値の取得
	 * @method checkScroll
	 * @returns {Number} スクロール値
	 */
	checkScroll:function(){
		var _t = this;
		_t.scrNum = document.body.scrollTop || document.documentElement.scrollTop;
		return _t.scrNum;
	},
	
	/**
	 * イベントを解除する
	 * @param {String} id 解除するイベントのid
	 */
	eventRelease:function(id){
		var _t = this,
			_id = id,
			_events = _t.events,
			_len = _events.length;
		for(var i=0; i<_len; i++){
			if(_id === _events[i].id) _events[i].isFired = true;
		}
	}
};