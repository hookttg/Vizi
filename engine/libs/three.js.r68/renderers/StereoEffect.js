/**
 * @author alteredq / http://alteredqualia.com/
 * @authod mrdoob / http://mrdoob.com/
 * @authod arodic / http://aleksandarrodic.com/
 */

THREE.StereoEffect = function ( renderer ) {

	// API

	this.separation = 3;

	// internals

	var _width, _height;

	var _position = new THREE.Vector3();
	var _quaternion = new THREE.Quaternion();
	var _scale = new THREE.Vector3();

	var _cameraL = new THREE.PerspectiveCamera();
	var _cameraR = new THREE.PerspectiveCamera();

	// initialization

	renderer.autoClear = false;

	this.setSize = function ( width, height ) {

		_width = width / 2;
		_height = height;

		renderer.setSize( width, height );

	};

	this.render = function ( scene, camera ) {

		var scenes, cameras;
		if (scene instanceof Array) {
			scenes = scene;
		}
		else {
			scenes = [ scene ];
		}

		if (camera instanceof Array) {
			cameras = camera;
		}
		else {
			cameras = [ camera ];
		}


		var i, len = scenes.length;
		for (i = 0; i < len; i++) {

			var scene = scenes[i];
			var camera = cameras[i];
			
			if (i == 0) {
			   	renderer.setClearColor( 0, 0 );
				renderer.autoClearColor = true;				
			}
			else {
			    renderer.setClearColor( 0, 1 );
				renderer.autoClearColor = false;				
			}

			scene.updateMatrix();
			scene.updateMatrixWorld();

			if (camera.matrixAutoUpdate) {
				camera.updateMatrix();
				camera.updateMatrixWorld();
			}

			scene.updateMatrixWorld();

			if ( camera.parent === undefined ) camera.updateMatrixWorld();
		
			camera.matrixWorld.decompose( _position, _quaternion, _scale );

			// left
	
			_cameraL.fov = camera.fov;
			_cameraL.aspect = 0.5 * camera.aspect;
			_cameraL.near = camera.near;
			_cameraL.far = camera.far;
			_cameraL.updateProjectionMatrix();
	
			_cameraL.position.copy( _position );
			_cameraL.quaternion.copy( _quaternion );
			_cameraL.translateX( - this.separation );
	
			// right
	
			_cameraR.near = camera.near;
			_cameraR.far = camera.far;
			_cameraR.projectionMatrix = _cameraL.projectionMatrix;
	
			_cameraR.position.copy( _position );
			_cameraR.quaternion.copy( _quaternion );
			_cameraR.translateX( this.separation );
	
			//
	
			renderer.setViewport( 0, 0, _width * 2, _height );
			// don't do this, defeats layering
			// renderer.clear();
	
			renderer.setViewport( 0, 0, _width, _height );
			renderer.render( scene, _cameraL );
	
			renderer.setViewport( _width, 0, _width, _height );
			renderer.render( scene, _cameraR );
		}
	};

};
