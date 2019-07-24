let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
let renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

$('body').append(renderer.domElement);
let frame = 0;
let period = 120;
let currentC = 0;
let nextC = 1;
let material;
let geometry;
let sketch;

let render = () => {
    //update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

let update = () => {
    frame++;
    if(frame > period) {
        console.log("Shifting gears")
        frame = 0;
        currentC = nextC;
        nextC = (nextC + 1) % transitions.length;
    }
    console.log("interpolating", transitions[currentC], " to ", transitions[nextC], " with alpha ", frame/60); 
    newC = transitions[currentC].lerp(transitions[nextC], frame/60);
    material.uniforms.c.value = newC;
}

transitions = [
                new THREE.Vector2(-0.4, 0.6),
                new THREE.Vector2(0.285, 0),
                new THREE.Vector2(0.285, 0.01),
                new THREE.Vector2(0.45, 0.1428),
                new THREE.Vector2(-0.70176, -0.3842),
                new THREE.Vector2(-0.835, -0.2321),
                new THREE.Vector2(-0.8, 0.156),
                new THREE.Vector2(-0.7269, 0.1889),
                new THREE.Vector2(0, -0.8)
              ]



geometry = new THREE.PlaneBufferGeometry(2, 2, innerWidth, innerHeight);
let uniforms = {
	aspect: {
	    type: 'f',
	    value: innerWidth / innerHeight
	},
	c: {
	    type: 'v2',
	    value: new THREE.Vector2(0, 0)
	},
}
material = new THREE.ShaderMaterial({
transparent: true,
uniforms: uniforms,
vertexShader: $("#vs").text(),
fragmentShader: $("#fs").text(),
});

sketch = new THREE.Mesh(geometry, material);
scene.add(sketch);

render();

onresize = (e) => {
    renderer.setSize(innerWidth, innerHeight);
	geometry = new THREE.PlaneBufferGeometry(1,1,innerWidth, innerHeight);
    material.uniforms.aspect.value = innerWidth / innerHeight;
    console.log("Resize");
}


onmousemove = (e) => {
    material.uniforms.c.value = new THREE.Vector2((e.pageX - innerWidth / 2) * 2 / innerWidth, (innerHeight / 2 - e.pageY) * 2 / innerHeight);
}
