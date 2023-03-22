import * as THREE from 'three';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

  // REAL SCENE & CAM
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 40;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#170312');

  // RENDER TARGET SCENE & CAM
  const rtWidth = 512;
  const rtHeight = 512;
  const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
  const rtFov = 75;
  const rtAspect = rtWidth / rtHeight;
  const rtNear = 0.1;
  const rtFar = 25;
  const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera.position.z = 15;
  const rtScene = new THREE.Scene();
  rtScene.background = new THREE.Color('#ffc266');

  // CUBE
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const cubeGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  // CONE GEOMETRY
  const coneRadius = 1;  // ui: radius
  const conrHeight = 3;  // ui: height
  const coneRadialSegments = 4;  // ui: radialSegments
  const coneGeometry = new THREE.ConeGeometry( coneRadius, conrHeight, coneRadialSegments );

 
  // DODECAHEDRON
  const dodecahedronRadius = 2;  // ui: radius
  const dodecahedronGeometry = new THREE.DodecahedronGeometry( dodecahedronRadius);
  // RING
  const innerRadius = 4;  // ui: innerRadius
  const outerRadius = 7;  // ui: outerRadius
  const thetaSegments = 18;  // ui: thetaSegments
  const phiSegments = 2;  // ui: phiSegments
  //const thetaStart = Math.PI * 0.25;  // ui: thetaStart
  const thetaStart = Math.PI * 1;  // ui: thetaStart
  const thetaLength = Math.PI * 1;  // ui: thetaLength
  const ringGeometry = new THREE.RingGeometry(	innerRadius, outerRadius,	thetaSegments, phiSegments, thetaStart, thetaLength );

  // ADD LIGHT TO MAIN SCENE
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // ADD LIGHT TO RENDER TARGET SCENE
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    rtScene.add(light);
  }

  // ADD RT CUBE TO MAIN SCENE
  const material = new THREE.MeshPhongMaterial({
    map: renderTarget.texture,
  });
  //const material0 = new THREE.MeshPhongMaterial(0x44aa88);
  const cube = new THREE.Mesh(cubeGeometry, material);
  scene.add(cube);

  function makeInstance(geometry, color, x, y) {
    const material = new THREE.MeshPhongMaterial({color});
   
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
   
    cube.position.x = x;
    cube.position.y = y;
   
    return cube;
  }
  function makeRTInstance(geometry, color, x, y) {
    const material = new THREE.MeshPhongMaterial({color});
   
    const cube = new THREE.Mesh(geometry, material);
    rtScene.add(cube);
   
    cube.position.x = x;
    cube.position.y = y;
   
    return cube;
  }

  const eyes = [
    //makeInstance(coneGeometry, 0x44aa88,  0, 5),
    //makeInstance(cylindergeometry, 0x8844aa, -5, 5),
    //makeInstance(dodecahedronGeometry, 0xaa8844,  5, 5),
    //makeInstance(dodecahedronGeometry, 0xaa8844,  -5, 5),
    makeRTInstance(dodecahedronGeometry, 0xaa8844,  5, 5),
    makeRTInstance(dodecahedronGeometry, 0xaa8844,  -5, 5),
  ];

  const face = [
    //makeInstance(coneGeometry, 0x44aa88,  0, 2),
    //makeInstance(ringGeometry, 0xc9243d,  0, -2),
    makeRTInstance(coneGeometry, 0x44aa88,  0, 2),
    makeRTInstance(ringGeometry, 0xc9243d,  0, -2),
  ]

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;  // convert time to seconds

    cube.rotation.x = time;
    cube.rotation.y = time;

    // cubes.forEach((cube, ndx) => {
    //   const speed = 1 + ndx * .1;
    //   const rot = time * speed;
    //   cube.rotation.x = rot;
    //   cube.rotation.y = rot;
    // });

    eyes.forEach((other, ndx) => {
      const speed = 3 + ndx * .1;
      const rot = time * speed;
      //other.rotation.x = rot;
      other.rotation.z = rot;
    });

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }


    renderer.setRenderTarget(renderTarget);
    renderer.render(rtScene, rtCamera);
    renderer.setRenderTarget(null);
   
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

/* global Split */

// This code is only related to handling the split.
// Our three.js code has not changed
Split(['#view', '#controls'], {  // eslint-disable-line new-cap
  sizes: [75, 25],
  minSize: 20,
  elementStyle: (dimension, size, gutterSize) => {
    return {
      'flex-basis': `calc(${size}% - ${gutterSize}px)`,
    };
  },
  gutterStyle: (dimension, gutterSize) => {
    return {
      'flex-basis': `${gutterSize}px`,
    };
  },
});

main();
