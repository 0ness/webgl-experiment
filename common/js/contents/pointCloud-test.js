;(function(window, document) {
	"use strict";


	
	
	/*Property
	--------------------------------------------------------------------*/
	var INF0	= new UserInfo(),
		LIB		= new Planet();
	
	

	
	/*Constructor
	--------------------------------------------------------------------*/
	/**
	 * @object Canvas
	 */
	var CANVAS = function(){
		var _self = this;
		_self.elm 	= document.getElementById("myCanvas");
		_self.resize();		
		_self.init();
	},
		_CANVAS = CANVAS.prototype;
	
	
	//status property
	_CANVAS.width 		= 0;
	_CANVAS.height 		= 0;
	_CANVAS.mouseX 		= 0;
	_CANVAS.mouseY 		= 0;
	_CANVAS.centerX 	= 0;
	_CANVAS.centerY 	= 0;
	
	//fill property
	_CANVAS.fogColor	= 0x000000;
	_CANVAS.bgColor		= new THREE.Color( 0x000000 );
	_CANVAS.bgAlpha	 	= 0.5;

	//particle propety
	_CANVAS.elm 		= null;
	_CANVAS.ctx 		= null;
	_CANVAS.ary			= [];
	_CANVAS.length 		= 10; 
	_CANVAS.PI 			= (Math.PI/180)*360;
	
	//object property
	_CANVAS.container	= null;
	_CANVAS.camera		= null;
	_CANVAS.scene		= new THREE.Scene();
	_CANVAS.renderer	= new THREE.WebGLRenderer();
	_CANVAS.particles	= null;
	_CANVAS.geometry	= null;
	_CANVAS.materials	= [];
	
	//camera property
	_CANVAS.fov			= 60;
	_CANVAS.aspect 		= 0;
	_CANVAS.near		= 1;
	_CANVAS.far			= 10000;
	_CANVAS.cameraPoint	= {x:0,y:0,z:500}
	
	//calc property
	_CANVAS.angleX 		= 0;
	_CANVAS.angleY 		= 0;
	_CANVAS.radiisX 	= 180;
	_CANVAS.radiisY 	= 180;
	_CANVAS.spd 		= 0.1;
	_CANVAS.pi 			= 3.141592653589793 / 180;
	_CANVAS.loopFPS 	= 1000 / 60 >> 0;
	_CANVAS.noiseRange 	= 0;
	_CANVAS.noiseSeed 	= 0;

	
	
	/**
	* 座標取得：マウスポインタ座標取得
	* @method getMousePoint
	* @param{Event} ターゲットイベント
	*/
	_CANVAS.getMousePoint = function(e){
		var _p = {x:0,y:0},
			doc = document.body;
		if(e){
			_p.x = e.pageX;
			_p.y = e.pageY;
		}else{
			var ev = event;
			_p.x = ev.x + doc.scrollLeft;
			_p.y = ev.y + doc.scrollTop;
		}
		return _p;
	};



	
	/*Init
	--------------------------------------------------------------------*/
	_CANVAS.init = function() {
		var _self = this,
			_particles,
			_particlelen = 100;
		
		//オブジェクト作成
		_self.container = _self.elm;
		_self.camera 	= new THREE.PerspectiveCamera(75,_self.width / _self.height,1,3000);
		_self.scene.fog = new THREE.FogExp2(_self.bgColor,0.0011);
		_self.geometry 	= new THREE.Geometry();
		_self.camera.position.x = 500;
		_self.camera.position.z = -500;
		
		//パーティクル作成
		for(var i = 0; i<_particlelen; i++){
			var _vertex = new THREE.Vector3();
			_vertex.x = Math.random() * 2000 - 1000;
			_vertex.y = Math.random() * 2000 - 1000;
			_vertex.z = Math.random() * 2000 - 1000;
			_self.geometry.vertices.push(_vertex);
		};
		
		//パーティクル　パラメータ設定
		var _parameters = [
			[ [1	,1	,0.5],40 ],	
			[ [0.95	,1	,0.5],20 ],	
			[ [0.90	,1	,0.5],10 ],	
			[ [0.85	,1	,0.5],2 ],
			[ [0.80	,1	,0.5],1 ]
		],
			_sprite = THREE.ImageUtils.loadTexture( "common/images/texture-disc.svg" ),
			_paramLen = _parameters.length;
		
		for(var i=0; i<_paramLen; i++){
			var _color 	= _parameters[i][0],
				_size 	= _parameters[i][1];
			
			_self.materials[i]	= new THREE.PointCloudMaterial({
				size:_size,
				map:_sprite,
				alphaTest:0.5,
				transparent:true
			});
			_particles 	= new THREE.PointCloud(_self.geometry,_self.materials[i]);
			_particles.rotation.x = Math.random() * 6;
			_particles.rotation.y = Math.random() * 6;
			_particles.rotation.z = Math.random() * 6;
			_self.scene.add(_particles);
		};
		
		//レンダラー設定
		_self.renderer.setPixelRatio(window.devicePixelRatio);
		_self.renderer.setSize(_self.width,_self.height);
		_self.renderer.setClearColor(_self.bgColor,_self.bgAlpha);
		
		_self.container.appendChild(_self.renderer.domElement);
		
		//イベント
//		document.addEventListener("mousemove",function(e){
//			_self.onDocumentMouseMove(e);
//		},false);
		window.addEventListener("resize",function(){
			_self.resize();	
		});
		_self.loop();
	};

	
	
	
	/*Member Method
	--------------------------------------------------------------------*/
	/**
	 * アニメーションループ
	 */
	_CANVAS.loop = function(){
		var _self 		= this,
			_camera 	= _self.camera,
			_position 	= _camera.position,
			_downForce 	= 0.05,
//			_time = Date.now() * 0.00005,
//			_sceneChildLen = _self.scene.children.length,
			_pi = _self.pi,
			_spd = _self.spd,
			_rx = _self.angleX * _pi,
			_ry = _self.angleY * _pi,
			_gx = (_self.radiisX * Math.cos(_rx)),
			_gy = (_self.radiisY * Math.sin(_ry));

		//マウス座標に追従
//		_position.x += (_self.mouseX - _position.x) * _downForce;
//		_position.y += ( - _self.mouseY - _position.y) * _downForce;
//		_camera.lookAt( _self.scene.position );
		
		//自動回転
		_position.x += (((_gx - _position.x) * _downForce)*100>>0)/100;
		_position.z += (((_gy - _position.z) * _downForce)*100>>0)/100;
		_self.angleX += _spd;
		_self.angleY += _spd;
		_camera.lookAt(_self.scene.position);

		//レンダリング
		_self.renderer.render(_self.scene,_camera);
		window.requestAnimationFrame(_self.loop.bind(_self));
	};
	
	/**
	 * マウスイベント
	 * @param {Object} e eventオブジェクト
	 */
	_CANVAS.onDocumentMouseMove = function(e){
		var _self = this,
			_mousePoint = _self.getMousePoint(e);
		_self.mouseX = _mousePoint.x;
		_self.mouseY = _mousePoint.y;
	};
	
	/**
	 * リサイズイベント
	 */
	_CANVAS.resize = function(){
		var _self = this,
			_winW = LIB.getWindowWidth(),
			_winH = LIB.getWindowHeight();
		
		_self.width = _winW;
		_self.height = _winH;
		_self.renderer.setSize(_winW,_winH);
	};
	
	



	window.INDEX = CANVAS;
	
	
})(window, document);


var Index = new INDEX();
