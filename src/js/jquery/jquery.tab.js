function $tabs(a_obj,a_obj02){
	"use strict";
	var _self = this,
		_tabElm = _self.tabElm,
		_tabFunc = _self.tabFunc;
	_tabElm[0] = a_obj.elm;
	_tabElm[1] = a_obj02.elm;
	_tabFunc[0] = a_obj.func;
	_tabFunc[1] = a_obj02.func;
	_self.init();
};
$tabs.prototype = {
	tabElm:[],
	tabFunc:[],
	currentNumber:0,
	
	init:function(){
		var _self = this,
			_tabElm = _self.tabElm;
		
		for(var i=0; i<2; i++){
			(function (_num) {
				_tabElm[i].on("click",function(){_self.change(_num)});
			}(i));
		}
	},
	change:function(a_num){
		var _self = this,
			_number = a_num,
			_current = _self.currentNumber,
			_tabFunc = _self.tabFunc;

		if(_current === _number) return false;
		_tabFunc[_number]();
		_self.currentNumber = _number;
	}
}

var tab01 = {
	elm:$("#tab01"),
	func:function(){
		$("#body02").stop().fadeOut(300,function(){
			$("#body01").stop().fadeIn(300);
		});
	}
};
var tab02 = {
	elm:$("#tab02"),
	func:function(){
		$("#body01").stop().fadeOut(300,function(){
			$("#body02").stop().fadeIn(300);
		});
	}
}

var tabBox = new $tabs(tab01,tab02);




