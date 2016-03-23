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
	_self.focus 		= _opt.cameraFocus || _self.focus;
	_self.isIE8 		= _opt.isIE8 || _self.isIE8;
	_self.isIE9 		= _opt.isIE9 || _self.isIE9;
	if(_self.isIE8 === true && _self.isIE9===true) _self.isIE89 = true;
	
	if(_self.isIE8 === true) return false;
    _self.init();
},
    _Particle = Particle.prototype;




/*SubClass Property
--------------------------------------------------------------------*/
_Particle.width = window.innerWidth;
_Particle.height = window.innerHeight;

_Particle.container = null;
_Particle.camera 	= null;
_Particle.scene 	= null;
_Particle.rendere 	= null;
_Particle.geometry 	= null;
_Particle.material 	= null;

_Particle.length 	= 300;
_Particle.focus 	= 100;
_Particle.alpha		= 1;
_Particle.color		= 0xffffff;
_Particle.cameraPoint	= {x:0,y:0,z:0}

_Particle.mouseX 	= 0;
_Particle.mouseY 	= 0;
_Particle.centerX 	= 0;
_Particle.centerY 	= 0;
_Particle.angleX 	= 0;
_Particle.angleY 	= 0;
_Particle.radiisX 	= 180;
_Particle.radiisY 	= 180;
_Particle.spd 		= 0.1;
_Particle.pi 		= 3.141592653589793 / 180;
_Particle.loopFPS 	= 1000 / 60 >> 0;

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
	_self.camera 	= new THREE.Camera(_cameraPoint.x, _cameraPoint.y, _cameraPoint.z);
    _self.scene 	= new THREE.Scene();
    _self.renderer 	= new THREE.CanvasRenderer();
    _self.geometry 	= new THREE.Geometry();

    //オブジェクトプロパティ設定
    _self.camera.focus = _self.focus;
    _self.renderer.setSize(_self.width, _self.height);
	
	var getRndHEX = function(_rnd){
		var cseed = ( Math.random()*_rnd ) >> 0;
		var cnum = ( cseed++ * 0x552433 ) % 0x1000000;
		return cnum;
	};

    //パーティクル作成
    for (var i = 0; i < _len; i++) {
		if(_self.color === "random") _color = getRndHEX(256);
        var _p = new THREE.Particle(new THREE.ColorFillMaterial(_color, _alpha)),
            _pos = _p.position;
        _p.size = Math.random() * 10 + 5;
        _pos.x = Math.random() * 2000 - 1000;
        _pos.y = Math.random() * 2000 - 1000;
        _pos.z = Math.random() * 2000 - 1000;
        _self.scene.add(_p);

        //			var _vertex = new THREE.Vector3();
        //			_vertex.x = Math.random() * 2000 - 1000;
        //			_vertex.y = Math.random() * 2000 - 1000;
        //			_vertex.z = Math.random() * 2000 - 1000;
        //			_self.geometry.vertices.push(_vertex);
    }

    //パーティクル生成
    //		_self.material = new THREE.PointCloudMaterial({
    //			size:35,
    //			sizeAttenuation:false,
    //			alphaTest:0.5,
    //			transparent:true
    //		});
    //		_self.material.color.setHSL(1,0.3,0.7);
    //		_particles = new THREE.PointCloud(_self.geometry,_self.material);
    //		_self.scene.add(_particles);


    _container.appendChild(_self.renderer.domElement);
    //		_doc.addEventListener('mousemove', function(e){ _self.onDocumentMouseMove(e);}, false);
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
 * ループアニメーション
 */
_Particle.loop = function() {
    var _self = this,
        _camera = _self.camera,
        _position = _camera.position,
        _scene = _self.scene,
        _pi = _self.pi,
        _spd = _self.spd,
        _rx = _self.angleX * _pi,
        _ry = _self.angleY * _pi,
        _gx = (_self.radiisX * Math.cos(_rx)) >> 0,
        _gy = (_self.radiisY * Math.sin(_ry)) >> 0,
        _downForce = 0.05;

    //	camera.position.x += (mouseX - camera.position.x) * .05;
    //	camera.position.y += (-mouseY - camera.position.y) * .05;

    _position.x += (((_gx - _position.x) * _downForce)*100>>0)/100;
    _position.z += (((_gy - _position.z) * _downForce)*100>>0)/100;
	
    _self.angleX += _spd;
    _self.angleY += _spd;

    _self.renderer.render(_scene, _camera);
    //	setTimeout(function(){
    //		_self.loop();
    //	}, _self.loopFPS);

    window.requestAnimationFrame(_self.loop.bind(_self));
}