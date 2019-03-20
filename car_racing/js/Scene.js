"use strict";
const Scene = function (gl) {
  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  this.gameObjects = [];

  this.vsTrafo = new Shader(gl, gl.VERTEX_SHADER, "trafo_vs.essl");
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl");
  this.solidProgram = new Program(gl, this.vsTrafo, this.fsTextured);

  this.carMaterial = new Material(gl, this.solidProgram);
  this.carMaterial.colorTexture.set(
    new Texture2D(gl, 'media/chevy/chevy.png'));

  this.treeMaterial = new Material(gl, this.solidProgram);
  this.treeMaterial.colorTexture.set(
    new Texture2D(gl, 'media/tree.png'));

  this.treeMesh =  new MultiMesh(gl, "media/tree.json", [this.treeMaterial]);
  this.carMesh =  new MultiMesh(gl, "media/chevy/chassis.json", [this.carMaterial]);
  this.wheelMesh =  new MultiMesh(gl, "media/chevy/wheel.json", [this.carMaterial]);

  const tree = new GameObject(this.treeMesh);
  tree.position.set(-1, 1);
  this.gameObjects.push(tree);
  
  const car = new GameObject(this.carMesh);
  car.position.set(-15, 2);
  this.gameObjects.push(car);

  const wheel = new GameObject(this.wheelMesh);
  wheel.position.set(-25, 2);
  this.gameObjects.push(wheel);

  this.camera = new PerspectiveCamera();

  gl.enable(gl.BLEND);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);
};

Scene.prototype.update = function (gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.camera.move(dt, keysPressed);

  // clear the screen
  gl.clearColor(0.6, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (let i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].draw(this.camera);
  }

};


