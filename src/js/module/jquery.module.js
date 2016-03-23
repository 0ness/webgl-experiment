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