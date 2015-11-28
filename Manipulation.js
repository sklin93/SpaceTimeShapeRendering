function distortion(star, radius, spaceTimeWire,starDistortedNet,tester){
    if(tester == 0){
        maxVertices = spaceTimeWire.geometry.vertices.length;
        for (var vertexI = 0; vertexI < maxVertices; vertexI++) {
        var vertex = spaceTimeWire.geometry.vertices[vertexI];
        var distance = getDistance3d(star, vertex);
        vertex.z = - 1.0/(0.00000001*Math.pow(distance,3.3)+(1.0/radius));
        starDistortedNet.push(vertex.z);
        }
        spaceTimeWire.geometry.verticesNeedUpdate = true;
    }
}
function distortionBH(BHposition, radius, spaceTimeWire, starDistortedNet, tester){
    if(tester == 0){
        maxVertices = spaceTimeWire.geometry.vertices.length;
        for (var vertexI = 0; vertexI < maxVertices; vertexI++) {
            var vertex = spaceTimeWire.geometry.vertices[vertexI];
            var distance = getDistance2d(BHposition, vertex);
            if(distance < radius){
                var theta = myarctan(vertex.y - BHposition.y,vertex.x - BHposition.x);
                vertex.x = BHposition.x + radius*Math.cos(theta);
                vertex.y = BHposition.y + radius*Math.sin(theta);
            }
        }
        spaceTimeWire.geometry.verticesNeedUpdate = true;
    }
}
function distortion2(star, radius, geometry, starDistortedNet,earthDistortedNet){
    maxVertices = geometry.vertices.length;
    for (var vertexI = 0; vertexI < maxVertices; vertexI++) {
    var vertex = geometry.vertices[vertexI];
    var distance = getDistance3d(star, vertex);
    vertex.z = starDistortedNet[vertexI] - 1.0/(0.00005*Math.pow(distance,2)+(1.0/radius));
    earthDistortedNet.push(vertex.z);
    }
    geometry.verticesNeedUpdate = true;
}
function distortion3(star, radius, geometry, earthDistortedNet){
    maxVertices = geometry.vertices.length;
    for (var vertexI = 0; vertexI < maxVertices; vertexI++) {
    var vertex = geometry.vertices[vertexI];
    var distance = getDistance3d(star, vertex);
    vertex.z = earthDistortedNet[vertexI] - 1.0/(0.00005*Math.pow(distance,2)+(1.0/radius));
    }
    geometry.verticesNeedUpdate = true;
}
function createEarthMesh(geom) {
    var planetTexture = THREE.ImageUtils.loadTexture("img/Earth.png");
    var specularTexture = THREE.ImageUtils.loadTexture("img/EarthSpec.png");
    //var normalTexture = THREE.ImageUtils.loadTexture("img/EarthNormal.png");
    var bmap = THREE.ImageUtils.loadTexture("img/earthbump.png");
    var planetMaterial = new THREE.MeshPhongMaterial();
    //planetMaterial.specularMap = specularTexture;
    //planetMaterial.specular = new THREE.Color(0x4444aa);
    //planetMaterial.normalMap = normalTexture;
    planetMaterial.map = planetTexture;
    planetMaterial.bumpMap = bmap;
//  planetMaterial.shininess = 150;
    // create a multimaterial
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);
    return mesh;
}
function createMarsMesh(geom){
    var planetTexture = THREE.ImageUtils.loadTexture("img/Mars_2k-050104.png");
    //var normalTexture = THREE.ImageUtils.loadTexture("img/Mars-normalmap_2k.png");
    var bmap = THREE.ImageUtils.loadTexture("img/Mars2-Bump.jpg");
    var planetMaterial = new THREE.MeshPhongMaterial();
    //planetMaterial.normalMap = normalTexture;
    planetMaterial.map = planetTexture;
    planetMaterial.bumpMap = bmap;
//  planetMaterial.shininess = 150;
    // create a multimaterial
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);
    return mesh;
}
function createLavaMesh(geom) {
    var planetTexture = THREE.ImageUtils.loadTexture("img/lava_texture.jpg");
    var normalTexture = THREE.ImageUtils.loadTexture("img/lava_normal.jpg");
    var planetMaterial = new THREE.MeshPhongMaterial();
    planetMaterial.transparent = false;
    planetMaterial.normalMap = normalTexture;
    planetMaterial.map = planetTexture;
    planetMaterial.shininess = 500;
    planetMaterial.emissive = new THREE.Color(1,1,0.2);
    planetMaterial.emissiveMap = THREE.ImageUtils.loadTexture("img/lava_texture.jpg");
    planetMaterial.emissiveMap.wrapS = THREE.RepeatWrapping;
    planetMaterial.emissiveMap.wrapT = THREE.RepeatWrapping;
    planetMaterial.emissiveMap.repeat.set(4,4);
    // create a multimaterial
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);
    return mesh;
}
function planeMaterial(){
    var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x9999CC, wireframe: true, transparent: true } );  
    return wireframeMaterial;
}
function setCameraAnimation(animation, camera){
    camera.position.set(0,-300,300);
    animation.cameraControl = 0;
    animation.v = (animation.v === false);
    document.getElementById("traversing").value = 'Animation: '+(animation.v? 'ON':'OFF');
}
function insideTraversing(animation, camera){
    camera.position.set(0,-300,300);
    animation.cameraControl = 460;
    animation.v = (animation.v === false);
    document.getElementById("insideOnly").value = 'Head Inside: '+(animation.v? 'ON':'OFF');
}
function outsideCircling(animation, camera){
    camera.position.set(0,-300,300);
    animation.cameraControl = 0;
    animation.r = (animation.r === false);
    document.getElementById("outsideOnly").value = 'Loop Around: '+(animation.r? 'ON':'OFF');
}
function changeCameraPosition(camera, animation, klein, trackerHelper, LightC){

    var t = animation.cameraControl;
    var lookAtPos = new THREE.Vector3(trackerHelper.x, trackerHelper.y, trackerHelper.z);

    //fall
    if(t < 50){
        camera.position.x += 4;
        camera.position.y += 6;
        camera.position.z -= 5;
        camera.up.set(0,0,1);
    }
    //circle
    if(t >= 80 && t <= 360){
        var theta = (t-80)*0.005*Math.PI;
        camera.position.x = 400*Math.cos(theta)-200;
        camera.position.y = 400*Math.sin(theta);
    }
    //here: x: -323.60679774997897, y: -380.42260651806146, z: 50.00000000000046
    //heading towards klein
    if(t > 360 && t< 460){
        camera.lookAt(klein.position);
        camera.position.x += 7.236067;
        camera.position.y += 3.804226;
    }
    if(t == 446){
        camera.up.set(0,0,1);
    }
    if(t == 448){
        camera.up.set(0,1,0);
    }
    if(t == 450){
        camera.up.set(1,0,0);
    }
    if(t == 452){
        camera.up.set(0,0,1);
    }
    if(t == 454){
        camera.up.set(0,1,0);
    }
    if(t == 456){
        camera.up.set(1,0,0);
    }
    if(t == 458){
        camera.up.set(0,0,1);
    }
    if(t == 460){ //start position of traversing
        camera.position.x = 399.9999022500204;
        camera.position.y = -0.000006518062228177968;
        camera.position.z = 50.0000000000002;
        camera.up.set(0,1,0);
    }
    //start traversing
    if(t > 460 && t <= 500){
        camera.position.z -= 2;
        camera.position.x += 0.48;
    }
    if (t == 491){ // fix for re-loop
        camera.position.x = 414.3999022500203;
        camera.position.y = -0.000006518062197475936;
        camera.position.z = -9.99999999999984;
    }
    if(t > 500 && t <= 510){
        camera.position.z -= 1.5;
        camera.position.x += 0.4;
    }
    if(t > 510 && t <= 540){
        camera.position.z -= 2.1;
        camera.position.x += 0.4;
    }
    //interpolate -- decrease velocity
    if(t > 540 && t <= 550){
        var xOffset = 0.4 - 0.08 * (t-540);
        camera.position.x += xOffset;
        camera.position.z -= 2;
    }
    if(t > 550 && t <= 620){
        camera.position.x -= 0.7;
        camera.position.z -= 0.6;
    }
    if (t > 620 && t <= 650){
        camera.position.x -= 1;
    }
    //going up
    if (t > 650 && t <= 750){
        camera.position.z += 0.863;
    }
    if (t > 750 && t <= 815){
        camera.position.z += 0.89;
        camera.position.x += 0.3;
    }
    //turning down, fix position for re-loop
    if(t > 815 && t <= 830){
        camera.position.x += 2.5;
        camera.position.z += 0.9;
    }
    if(t == 830){
        console.log(camera.position);
    }

    if(t > 460 && animation.cameraLight){
        LightC.intensity = 1.5;
    }
    if(!animation.cameraLight){
        LightC.intensity = 0;
    }
    //tweak camera look at position
    if (t > 460 && t <= 550){
        trackerHelper.x = camera.position.x;
        trackerHelper.y = camera.position.y;
        trackerHelper.z = camera.position.z - 20;
        camera.lookAt(lookAtPos);
    }
    if (t > 550 && t <= 600){ //interpolate
        var xOffset = 0.1 * (t - 550);
        var zOffset = 20 - 0.4 * (t - 550);
        trackerHelper.x = camera.position.x - xOffset;
        trackerHelper.y = camera.position.y;
        trackerHelper.z = camera.position.z - zOffset;
        camera.lookAt(lookAtPos); 
    }
    if(t > 600 && t <= 650){
        var zOffset = 0.1 * (t - 600);
        var xOffset = 5 - 0.1 * (t - 600);
        trackerHelper.x = camera.position.x - xOffset;
        trackerHelper.y = camera.position.y;
        trackerHelper.z = camera.position.z + zOffset;
        camera.lookAt(lookAtPos);
    }
    if (t > 650 && t <= 815){
        trackerHelper.x = camera.position.x;
        trackerHelper.y = camera.position.y;
        trackerHelper.z = camera.position.z + 5;
        camera.lookAt(lookAtPos); 
    }
    if (t > 815 && t <= 830){ //turning down
        var zOffset = 5 - 0.6 * (t - 815); //-4
        var xOffset = 0.2 * (t - 815);
        trackerHelper.x = camera.position.x + xOffset;
        trackerHelper.y = camera.position.y;
        trackerHelper.z = camera.position.z + zOffset;
        camera.lookAt(lookAtPos);
    }
    if (t > 830){
        trackerHelper.x = camera.position.x + 3;
        trackerHelper.y = camera.position.y;
        trackerHelper.z = camera.position.z - 4;
        camera.lookAt(lookAtPos);
    }
}
function changeCameraPosition2(camera, animation){
    var t = animation.cameraControl;
    //fall
    if(t < 50){
        camera.position.x += 4;
        camera.position.y += 6;
        camera.position.z -= 5;
        camera.up.set(0,0,1);
    }
    //circle
    if(t >= 80 && t <= 480){
        var theta = (t-80)*0.005*Math.PI;
        camera.position.x = 400*Math.cos(theta)-200;
        camera.position.y = 400*Math.sin(theta);
    }

}
function collisionCheck(p1, r1, p2, r2){
    return (getDistance3d(p1, p2) < (r1 + r2))? true: false;
}