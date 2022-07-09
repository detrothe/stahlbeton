// Option 1: Import the entire three.js core library.
import * as THREE from 'three';

import {OrbitControls} from './OrbitControls.js';

import {nnodes, nelem, node, truss} from "./duennQ"
import {ymin,ymax,zmin,zmax} from "./systemlinien";

/*
export function main_3D() {
    const canvas = document.querySelector('#c3');
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 50;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 4;

    const scene = new THREE.Scene();

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    function render(time) {
        time *= 0.001;  // convert time to seconds

        cube.rotation.x = time;
        cube.rotation.y = time;

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}
*/

//let canvas
let scene = null


export function main_3D() {
    const canvas = document.getElementById('c3') as HTMLCanvasElement  //.querySelector('#c3');
    canvas.height = 300
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

    console.log("canvas",canvas.clientWidth, canvas.clientHeight)

    const fov = 50;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 50;
    //const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    const width = 100;
    const height = 100;
    console.log("ortho",-ymax,-ymin,-zmax,-zmin)
    const camera = new THREE.OrthographicCamera( -ymax,-ymin,-zmin,-zmax, -2000, 2000 );

    camera.position.z = 500;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    controls.update();

    scene = new THREE.Scene();

    {

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);


        const light1 = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add( light1 );
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({color});

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    makeInstance(geometry, 0x44aa88, 0);
    //makeInstance(geometry, 0x8844aa, -2);
    //makeInstance(geometry, 0xaa8844,  2);
    /*
        //create a blue LineBasicMaterial
        const material_line = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            linewidth: 10,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin: 'round' //ignored by WebGLRenderer
        });
        const points = [];
        points.push(new THREE.Vector3(-2, 0, 0));
        points.push(new THREE.Vector3(0, 2, 0));
        points.push(new THREE.Vector3(2, 0, 0));

        const geometry_line = new THREE.BufferGeometry().setFromPoints(points);

        const line = new THREE.Line(geometry_line, material_line);
        scene.add(line);

        console.log("scene length", scene.children.length)
        console.log("scene child", scene.children)

        while (scene.children.length > 1) {  // Licht soll bleiben
            removeObject3D(scene.children[scene.children.length - 1])
        }

        scene.add(line);
    */
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    let renderRequested = false;

    function render() {
        renderRequested = undefined;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            //camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        controls.update();
        renderer.render(scene, camera);
    }

    render();

    function requestRenderIfNotRequested() {
        if (!renderRequested) {
            renderRequested = true;
            requestAnimationFrame(render);
        }
    }

    controls.addEventListener('change', requestRenderIfNotRequested);
    window.addEventListener('resize', requestRenderIfNotRequested);
}

function removeObject3D(object: THREE.Mesh | THREE.Line) {
    if (!(object instanceof THREE.Object3D)) return false;
    // for better memory management and performance
    if (object.geometry) {
        object.geometry.dispose();
    }
    if (object.material) {
        if (object.material instanceof Array) {
            // for better memory management and performance
            object.material.forEach(material => material.dispose());
        } else {
            // for better memory management and performance
            object.material.dispose();
        }
    }
    if (object.parent) {
        object.parent.remove(object);
    }
    // the parent might be the scene or another Object3D, but it is sure to be removed this way
    return true;
}

export function add_element() {

    //create a blue LineBasicMaterial
    const material_line = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        linewidth: 10,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin: 'round' //ignored by WebGLRenderer
    });

    const points = [];
    points.push(new THREE.Vector3(-2, 0, 0));
    points.push(new THREE.Vector3(0, 2, 0));
    points.push(new THREE.Vector3(2, 0, 0));

    const geometry_line = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry_line, material_line);
    scene.add(line);


    window.dispatchEvent(new Event("resize"));

}

export function draw_elements() {

    let y1: number, y2: number, x1: number, x2: number

    while (scene.children.length > 2) {  // Licht soll bleiben
        removeObject3D(scene.children[scene.children.length - 1])
    }

    if ( scene !== null ) {

        //create a blue LineBasicMaterial
        const material_line = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            linewidth: 2
        });

        for ( let i=0; i<nelem;i++ ) {
            console.log("elem i=", i)
            // x1 = -node[truss[i].nod[0]].y
            // y1 = -node[truss[i].nod[0]].z
            // x2 = -node[truss[i].nod[1]].y
            // y2 = -node[truss[i].nod[1]].z
/*
            const points = [];
            points.push(new THREE.Vector3(x1, y1, 0));
            points.push(new THREE.Vector3(x2, y2, 0));

            const geometry_line = new THREE.BufferGeometry().setFromPoints(points);

            const line = new THREE.Line(geometry_line, material_line);
            scene.add(line);
*/

            const elemShape = new THREE.Shape();
            elemShape.moveTo( -truss[i].pts_y[0], -truss[i].pts_z[0] );
            elemShape.lineTo( -truss[i].pts_y[1], -truss[i].pts_z[1] );
            elemShape.lineTo( -truss[i].pts_y[2], -truss[i].pts_z[2] );
            elemShape.lineTo( -truss[i].pts_y[3], -truss[i].pts_z[3] );
            elemShape.lineTo( -truss[i].pts_y[0], -truss[i].pts_z[0] );


            const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 1, bevelThickness: 1 };

            const geometry = new THREE.ExtrudeGeometry( elemShape, extrudeSettings );

            const mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
            scene.add(mesh);

        }
/*
        const heartShape = new THREE.Shape();

        heartShape.moveTo( 25, 25 );
        heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
        heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
        heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
        heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
        heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
        heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );

        const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

        const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );

        const mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
        scene.add(mesh);

 */
        window.dispatchEvent(new Event("resize"));
    }

    //add_element();
}