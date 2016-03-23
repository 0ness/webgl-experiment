function FixedAnchor(elmID) {
	"use strict";
	this.init(elmID);
};
FixedAnchor.prototype = {
	
	$win:$(window),
	$doc:$(document.getElementById("wrapper")),
	$btn:null,
	
	winH:0,
	borderH:0,
	scrY:0,
	className:"js-fixedAnchor",
	classNameStatic:"js-fixedAnchor-static",
	nowFlg:false,
	oldFlg:false,
	
	init:function(elmID){
		var _t = this;
		_t.btn = document.getElementById( elmID);
		_t.btn.className = "js-fixedAnchor";
		_t.$btn = $(_t.btn);

		//イベント指定
		_t.$win.on({"scroll":function(){_t.scrollCheck();}});
		_t.$btn.on("click", function(e) {
			e.preventDefault();
			_t.anchor(_t.$btn);
		});
		
		_t.sizeCheck();
	},
	
	//高さ確認
	sizeCheck:function() {
		var _t = this;
		_t.$winH = _t.$win.height();
		_t.borderH = (_t.$doc.height() - _t.$winH) - 40;
	},

	scrollCheck:function(){
		var _t = this,
			_win = _t.$win,
			_cls,
			_scrY;
		
		_t.scrY = _win.scrollTop();
		_scrY = _t.scrY;

		//位置のフラグ
		if (_scrY > 500) _t.nowFlg = true;
		else _t.nowFlg = false;

		//フッターとの位置調整
		_cls = (_scrY >= _t.borderH) ? _t.classNameStatic : _t.className;
		_t.btn.className = _cls;

		//表示の切り替え
		if (_t.nowFlg === _t.oldFlg) return false;
		if (_t.nowFlg === true) _t.$btn.fadeTo(200, 1, "linear");
		else _t.$btn.fadeTo(200, 0, "linear");
		_t.oldFlg = _t.nowFlg;
	},
	
	/**
	 * jQuery アンカーアニメーション（jQueryオブジェクト）
	 * @param {String} URL
	 */
	anchor:function(href,callback){
//		var _$tag = (this.pageUA === "webkit") ? $("body"):$("html"),
//			_href = href,
//			_target = $(_href === "#" || _href === "" ? 'html' : _href),
//			_position = _target.offset().top,
//			_func = callback || null;
//
//		_$tag.stop().animate({scrollTop:_position}, 600, 'easeInOutQuad',_func);
	}
};


var test = new FixedAnchor("testBox");

