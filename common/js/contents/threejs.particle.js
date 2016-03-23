/**
 * Three.js r9用　パーティクルクラス
 * @constanter
 * @param {Object} クラス設定用オブジェクト
 */
var Particle = function(a_opt) {
	var _self = this,
		_opt = a_opt;
	
	//パラメータ設定
	_self.container		= _opt.container || _self.container;
	_self.length 		= _opt.particleLength || _self.length;
	_self.spd 			= _opt.particleSpd 	|| _self.spd;
	_self.alpha 		= _opt.particleAlpha || _self.alpha;
	_self.color			= _opt.particleColor || _self.color;
	_self.cameraPoint	= _opt.cameraPoint 	|| _self.cameraPoint;
	_self.isIE8 		= _opt.isIE8 || _self.isIE8;
	_self.isIE9 		= _opt.isIE9 || _self.isIE9;
	if(_self.isIE8 === true && _self.isIE9===true) _self.isIE89 = true;
	
	if(_self.isIE8 === true) return false;
	
	_self.resize();
	_self.init();
},
    _Particle = Particle.prototype;




/*SubClass Property
--------------------------------------------------------------------*/
//status property
_Particle.width 	= 0;
_Particle.height 	= 0;
_Particle.mouseX 	= 0;
_Particle.mouseY 	= 0;
_Particle.centerX 	= 0;
_Particle.centerY 	= 0;

//object property
_Particle.container = null;
_Particle.camera 	= null;
_Particle.scene 	= null;
_Particle.rendere 	= null;
_Particle.geometry 	= null;
_Particle.material 	= null;

//camera property
_Particle.fov			= 60;
_Particle.aspect 		= 0;
_Particle.near			= 1;
_Particle.far			= 10000;
_Particle.cameraPoint	= {x:0,y:0,z:500}

//particle propety
_Particle.length 	= 300;
_Particle.alpha		= 1;
_Particle.color		= 0xffffff;

_Particle.angleX 	= 0;
_Particle.angleY 	= 0;
_Particle.radiisX 	= 180;
_Particle.radiisY 	= 180;
_Particle.spd 		= 0.1;
_Particle.pi 		= 3.141592653589793 / 180;
_Particle.loopFPS 	= 1000 / 60 >> 0;

//utility propetry
_Particle.isIE8		= false;
_Particle.isIE9		= false;
_Particle.isIE89	= false;




/*SubClass Method
--------------------------------------------------------------------*/
/**
 * 初期化
 */
_Particle.init = function() {
    var _self 		= this,
        _doc 		= document,
        _container	= _self.container,
        _len		= _self.length,
        _sprite,
        _particles,
		_alpha		= _self.alpha,
		_cameraPoint= _self.cameraPoint,
		_color		= _self.color;

    //各オブジェクト作成
//	_self.camera 	= new THREE.Camera(1,1,1);
	_self.camera 	= new THREE.PerspectiveCamera( _self.fov, _self.aspect, _self.near, _self.far );
    _self.scene 	= new THREE.Scene();
    _self.renderer 	= new THREE.WebGLRenderer();
    _self.geometry 	= new THREE.Geometry();

    //オブジェクトプロパティ設定
	_self.camera.position.set(_cameraPoint.x,_cameraPoint.y,_cameraPoint.z);
	_self.renderer.setPixelRatio(window.devicePixelRatio);
	_self.renderer.setSize(_self.width, _self.height);

	var getRndHEX = function(_rnd){
		var cseed = ( Math.random()*_rnd ) >> 0;
		var cnum = ( cseed++ * 0x552433 ) % 0x1000000;
		return cnum;
	};

    //パーティクル作成
    for (var i = 0; i < _len; i++) {
		if(_self.color === "random") _color = getRndHEX(256);
		
		var _x = (Math.random() * 2000 - 1000)>>0,
			_y = (Math.random() * 2000 - 1000)>>0,
			_z = (Math.random() * 2000 - 1000)>>0,
			_geometry 	= new THREE.BoxGeometry(10,10,10),
			_material	= new THREE.MeshBasicMaterial( {
				color: _color,
				sizeAttenuation: false
			}),
			_cube		= new THREE.Mesh( _geometry,_material);
		

//		_cube.rotation.x = Math.random()* 2 * _self.pi;
//		_cube.rotation.y = Math.random()* 2 * _self.pi;
		
//		_cube.matrixAutoUpdate = false;
//		_cube.updateMatrix();
		_cube.position.set(_x,_y,_z);
		_self.scene.add(_cube);
    }

    _container.appendChild(_self.renderer.domElement);
	_doc.addEventListener('mousemove', function(e){ _self.onDocumentMouseMove(e);}, false);
//		_doc.addEventListener('touchstart', function(e){ _self.onDocumentTouchStart(e);}, false);
//		_doc.addEventListener('touchmove', function(e){ _self.onDocumentTouchMove(e);}, false);
};

/**
 * マウスムーブ
 * @param {Object} event eventオブジェクト
 */
_Particle.onDocumentMouseMove = function(event) {
    var _self = this;
    _self.mouseX = event.clientX - _self.centerX;
    _self.mouseY = event.clientY - _self.centerY;
};

/**
 * タッチスタート
 * @param {Object} event eventオブジェクト
 */
_Particle.onDocumentTouchStart = function(event) {
    var _self = this;
    if (event.touches.length == 1) {
        event.preventDefault();
        _self.mouseX = event.touches[0].pageX - _self.centerX;
        _self.mouseY = event.touches[0].pageY - _self.centerY;
    }
};

/**
 * タッチムーブ
 * @param {Object} event eventオブジェクト
 */
_Particle.onDocumentTouchMove = function(event) {
    var _self = this;
    if (event.touches.length == 1) {
        event.preventDefault();
        _self.mouseX = event.touches[0].pageX - _self.centerX;
        _self.mouseY = event.touches[0].pageY - _self.centerY;
    }
};

/**
 * リサイズ
 */
_Particle.resize = function(){
	var _self = this,
		_w = window,
		_winW = _w.innerWidth,
		_winH = _w.innerHeight;
	_self.width = _winW;
	_self.height = _winH;
	_self.centerX = _winW>>0;
	_self.centerY = _winH>>0;
	_self.aspect = (_winW / _winH);
};

/**
 * ループアニメーション
 */
_Particle.loop = function() {
    var _self = this,
		_scene = _self.scene,
        _camera = _self.camera,
        _position = _camera.position,
        _pi = _self.pi,
        _spd = _self.spd,
        _rx = _self.angleX * _pi,
        _ry = _self.angleY * _pi,
        _gx = (_self.radiisX * Math.cos(_rx)) >> 0,
        _gy = (_self.radiisY * Math.sin(_ry)) >> 0,
        _downForce = 0.05;

	//マウス回転
	_position.x += (_self.mouseX - _position.x) * _downForce;
	_position.y += (-_self.mouseY - _position.y) * _downForce;
	_camera.lookAt(_scene.position);

	//自動回転
//	_position.x += (((_gx - _position.x) * _downForce)*100>>0)/100;
//	_position.z += (((_gy - _position.z) * _downForce)*100>>0)/100;
//    _self.angleX += _spd;
//    _self.angleY += _spd;

    _self.renderer.render(_scene, _camera);
    requestAnimationFrame(_self.loop.bind(_self));
}