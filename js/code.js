let container;
let camera;
let renderer;
let scene;
let prism;
const prismArr = [];
const nPrisms = 100;


const init = () => {

    container = document.querySelector( '#scene-container' );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 'darkolivegreen' );

    createCamera();
    createLights();
    createMeshes();
    createRenderer();

    // start the animation loop
    renderer.setAnimationLoop( () => {

        update();
        render();

    } );
}


const createCamera = () => {

    camera = new THREE.PerspectiveCamera( 50, container.clientWidth / container.clientHeight, 0.1, 200 );
    camera.position.z = 20;
}


const createLights = () => {

    const ambientLight = new THREE.HemisphereLight(
        0xddeeff, // bright sky color
        0x202020, // dim ground color
        5, // intensity
    );

    const light1 = new THREE.DirectionalLight( 0xff0000, 6 );
    light1.position.set( 5, 15, 5);
    
    scene.add( ambientLight, light1 );

}


const createMaterials = () => {

    const linematerial = new THREE.LineBasicMaterial( { color: 0xffffff } );

    return { linematerial };

}


const createGeometries = () => {

    const points = [];
    points.push( new THREE.Vector3( -5, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 7.5, 0 ) );
    points.push( new THREE.Vector3( 5, 0, 0 ) );
    points.push( new THREE.Vector3( 0, -7.5, 0 ) );
    points.push( new THREE.Vector3( -5, 0, 0 ) );
    const diamondX = new THREE.BufferGeometry().setFromPoints( points );
    const diamondY = diamondX.clone();
    diamondY.rotateY( Math.PI / 2 );

    const perimeter = [];
    perimeter.push( new THREE.Vector3( -5, 0, 0 ) );
    perimeter.push( new THREE.Vector3( 0, 0, -5 ) );
    perimeter.push( new THREE.Vector3( 5, 0, 0 ) );
    perimeter.push( new THREE.Vector3( 0, 0, 5 ) );
    perimeter.push( new THREE.Vector3( -5, 0, 0 ) );
    const border = new THREE.BufferGeometry().setFromPoints( perimeter );
    
    return { diamondX, diamondY, border };

}


const createMeshes = () => {

    const materials = createMaterials();
    const geometries = createGeometries();
    
    prism = new THREE.Group();
    scene.add( prism );

    let linediamondX = new THREE.Line( geometries.diamondX, materials.linematerial );
    let lineadiamondY = new THREE.Line( geometries.diamondY, materials.linematerial );
    let border = new THREE.Line( geometries.border, materials.linematerial );

    prism.add( linediamondX, lineadiamondY, border );
    prismArr.push( prism );

    for( let i = 1; i <= nPrisms; i++ ) {
        let temp = prism.clone();
        temp.rotation.y = (2 * Math.PI / nPrisms) * i;
        scene.add( temp );
        prismArr.push( temp );
    }

}


const createRenderer = () => {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
    container.appendChild( renderer.domElement );

}


const update = () => {
    
    prismArr.forEach( (p) => {
        p.rotation.x += 0.003;
        p.rotation.z += 0.006;
    });

}


const render = () => {
    renderer.render( scene, camera );
}


function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}
window.addEventListener( 'resize', onWindowResize );


init();