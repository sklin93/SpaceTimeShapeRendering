function initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    return stats;
}
function initRenderer(){
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    // renderer.shadowMapSoft = true;
    // renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.shadowMapType = THREE.BasicShadowMap;
    return renderer;
}
function getDistance2d(vertex1, vertex2) {
    var xfactor = vertex2.x - vertex1.x;
    var yfactor = vertex2.y - vertex1.y;
    return Math.sqrt( (xfactor*xfactor) + (yfactor*yfactor) );
}
function getDistance3d(vertex1, vertex2) {
    var xfactor = vertex2.x - vertex1.x;
    var yfactor = vertex2.y - vertex1.y;
    var zfactor = vertex2.z - vertex1.z;
    return Math.sqrt( (xfactor*xfactor) + (yfactor*yfactor) + (zfactor*zfactor) );
}
function myarctan(y,x){
    var result;
    if(x>0){
        result = Math.atan(y/x);
    }
    if(y>=0 && x<0){
        result = Math.PI + Math.atan(y/x);
    }
    if(y<0 && x<0){
        result = -Math.PI+ Math.atan(y/x);
    }
    if(y>0 && x==0){
        result = Math.PI/2;
    }
    if(y<0 && x==0){
        result = -Math.PI/2;
    }
    if(result<0){
        result += 2*Math.PI;
    }
    return result;
}
function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
