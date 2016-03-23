(function (window,document) {
	"use strict";

		
	

	/* static property
	--------------------------------------------------------------------*/
	var winWidth	= window.innerWidth,
		winHeight	= window.innerHeight;

	var container 	= document.getElementById("container"),
		stats,
		camera 		= new THREE.PerspectiveCamera( 27, winWidth / winHeight, 1, 9000 ),
		scene 		= new THREE.Scene(),
		renderer,
		xGeometry,
		zGeometry,
		xMesh,
		zMesh,
		xMaterial,
		zMaterial;
	
	var yPoints		= [],
		xLines		= [],
		zLines		= [];
	
	var waveTime	= 0;
	
	
	
	
	/*　object dat.GUI用オブジェクト
	--------------------------------------------------------------------*/
	var GUI 	= new dat.GUI(),
		param 	= {
			meshX:0.1,
			meshRotateY:0.03,
			doMeshRotate:false,
			meshOpacity:1,
			cameraY:0,
			cameraZ:5000,
			fogLevel:0,
			waveHeight:180,
			waveOffset:1.9,
			waveSpd:0.05,
			bgColor	:"#111"
		};
	GUI.remember(param);
	GUI.add(param,'meshX',-2,2);
	GUI.add(param,'meshRotateY',-0.1,0.1);
	GUI.add(param,'doMeshRotate');
	GUI.add(param,'meshOpacity',0.01,1);
	GUI.add(param,'cameraY',-1000,1000);
	GUI.add(param,'cameraZ',0,5000);
	GUI.add(param,'fogLevel',0,130);
	GUI.add(param,'waveHeight',10,500);
	GUI.add(param,'waveOffset',0.1,5);
	GUI.add(param,'waveSpd',0.001,0.1);
	GUI.addColor(param,"bgColor");

	
	
	
	/*　object stats
	--------------------------------------------------------------------*/
	//statsオブジェクト生成
	stats = new Stats();
	var _statsElm = stats.domElement;
	_statsElm.setAttribute("style","position:absolute; bottom:0px; right:0px;");
	container.appendChild( stats.domElement );

	
	
	var GravityWaver = function(){
		this.geometry = new THREE.Geometry();
		this.vertices = this.geometry.vertices;
		this.materials = [];
		this.init();
		this.loop();
	},
		Member = GravityWaver.prototype;
	


	/* method
	--------------------------------------------------------------------*/
	Member.init = function() {

		//表示オブジェクト化、シーンへ追加
		zGeometry = new THREE.Geometry();
		xGeometry = new THREE.Geometry();
		var _size 	= 2000,
			_zSize 	= 3200,
			_step 	= 40,
			_zLen 	= _zSize*2/_step,
			_xCount = 0,
			_zCount = 0,
			_lCount = 0;
		
		//y軸
		for(var z=-_zSize; z<=_zSize; z+=_step){
			yPoints[_zCount] = []
			for(var x=-_size; x<=_size; x+=_step){
				yPoints[_zCount][_xCount] = (( noise.perlin2(x / 1000,z / 1000) * 200) * 100 | 0) / 100;
				
				var _v = new THREE.Vector3();
				_v.x = x;
				_v.y = yPoints[_zCount][_xCount];
				_v.z = z;
				this.vertices.push(_v);

				
				_xCount ++;
			}
			_xCount = 0;
			_zCount++;
		};
		
		//パーティクルの設定
		var _parameters = [
			[ [1	,1	,0.5],40 ],	
			[ [0.95	,1	,0.5],20 ],	
			[ [0.90	,1	,0.5],10 ],	
			[ [0.85	,1	,0.5],2 ],
			[ [0.80	,1	,0.5],1 ]
		],
			_sprite = THREE.ImageUtils.loadTexture( "common/images/texture-disc.svg" ),
			_particles;
		
		for(var i=0; i<_parameters.length; i++){
//			var _color 	= _parameters[i][0],
//				_size 	= _parameters[i][1];
//
			this.materials[i]	= new THREE.PointCloudMaterial({
				size:10,
				map:_sprite,
//				alphaTest:0.5,
				transparent:true
			});
			_particles 	= new THREE.PointCloud(this.geometry,this.materials[i]);
//			_particles.rotation.x = Math.random() * 6;
//			_particles.rotation.y = Math.random() * 6;
//			_particles.rotation.z = Math.random() * 6;
			scene.add(_particles);
		};

		//z軸
		_xCount = _zCount = 0;
		for(var z=-_zSize; z<=_zSize; z+=_step){
			var _y = yPoints[_zCount];
			for(var x=-_size; x<=_size; x+=_step){
				
				zGeometry.vertices.push( new THREE.Vector3(x,_y[_xCount],z) );
				zGeometry.vertices.push( new THREE.Vector3(x+_step,_y[_xCount+1],z) );
				_xCount ++;
				_lCount ++;
			}
			_xCount = 0;
			_zCount++;
		}
		
		//x軸
		_xCount = _zCount = _lCount = 0;
		for(var x=-_size; x<=_size; x+=_step){
			for(var z=-_zSize; z<=_zSize; z+=_step){
				var _next = _zCount+1;
				if(_next > _zLen) continue;
				
				xGeometry.vertices.push( new THREE.Vector3(x,yPoints[_zCount][_xCount],z) );
				xGeometry.vertices.push( new THREE.Vector3(x,yPoints[_next][_xCount],z+_step) );
				_zCount ++;
				_lCount ++;
			}
			_zCount = 0;
			_xCount++;
		}
		
		//シーンに追加
		scene.fog = new THREE.FogExp2(0x000000, param.fogLevel*0.00001);

		
		//レンダラー生成
//		renderer = new THREE.CanvasRenderer();
		renderer = new THREE.WebGLRenderer({ antialias:true,alpha:true});
		renderer.setPixelRatio( window.devicePixelRatio);
		renderer.setSize( winWidth, winHeight);
//		renderer.gammaInput = true;
//		renderer.gammaOutput = true;
		container.appendChild( renderer.domElement );
		
		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
	};
	
	Member.createColor = function(_rnd,_alpha,_plus){
		var rnd = _rnd || 255,
			plus = _plus || 0,
			r = ((Math.random()*rnd)>>0) + plus,
			g = ((Math.random()*rnd)>>0) + plus,
			b = ((Math.random()*rnd)>>0) + plus,
			a = _alpha || 1,
			rgba = "rgba("+r+", "+g+", "+b+","+a+")";
		return rgba;
	};

	/**
	 * ポイントのy座標を調整
	 */
	Member.changeYposition = function(){
		var _maxLen 	= (yPoints[0].length-1)*yPoints.length*2,
			_vCount 	= 0,
			_y			= yPoints,
			_yLen		= _y.length,
			_yChildLen 	= _y[0].length,
			_xGeo		= xGeometry,
			_zGeo 		= zGeometry,
			_zLine;
		
		//y軸
		for(var z=0; z<_yLen; z++){
			_zLine = _y[z];
			for(var x=0; x<_yChildLen; x++) _zLine[x] = (this.waveMotion(x,z,waveTime) * 10 | 0) / 10;
		};
		
		for(var z=0; z<_yLen; z++){
			_zLine = _y[z];
			for(var x=0; x<_yChildLen; x++) {
				this.vertices[_vCount].y = _zLine[x];
				_vCount++;
			}
		};
		
		this.geometry.verticesNeedUpdate = true;
		
		waveTime ++;
	};
	
	/**
	 * 波の動き
	 * @param   {number} x x座標
	 * @param   {number} y y座標
	 * @param   {number} t モーションの時間
	 *　@returns {number} 次のy座標
	 */
	Member.waveMotion = function (x, y, t) {
		var _height = param.waveHeight,
			_spd 	= 8,
			_offset = param.waveOffset,
			_time	= t * param.waveSpd;
		return Math.sin( ( x / 20 ) * _offset + ( _time / _spd ) ) * Math.cos( ( y / 20 ) * _offset + ( _time / _spd ) ) * _height;
	};

	/**
	 * リサイズ処理
	 */
	Member.onWindowResize = function() {
		winWidth	= window.innerWidth;
		winHeight	= window.innerHeight;
		camera.aspect = winWidth / winHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( winWidth, winHeight );
	};

	/**
	 * ループ処理
	 */
	Member.loop = function() {
		var _self = this;
		this.render();
		stats.update();
		window.requestAnimationFrame(this.loop.bind(_self));
	};
	
	/**
	 * レンダリング
	 */
	Member.render = function() {
		var _camera = camera,
			_xm		= xMesh,
			_zm		= zMesh;
		_camera.rotation.y = param.meshX;
//		xMaterial.opacity = zMaterial.opacity = param.meshOpacity;
//		if(param.doMeshRotate) _xm.rotation.y = _zm.rotation.y = (Date.now() * 0.001 * param.meshRotateY * 10000 | 0)/10000;
		_camera.position.y = param.cameraY;
		_camera.position.z = param.cameraZ;
		
		scene.fog = new THREE.FogExp2(param.bgColor, param.fogLevel*0.00001);

		this.changeYposition();
		renderer.setClearColor(param.bgColor,1);
		renderer.render( scene, _camera );
	};


	window.GravityWaver = GravityWaver;
}(window,document));

var Index = new GravityWaver();
