"use strict";
const Scene = function (gl) {
  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  this.gameObjects = [];

  this.vsTrafo = new Shader(gl, gl.VERTEX_SHADER, "trafo_vs.essl");
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl");
  this.solidProgram = new Program(gl, this.vsTrafo, this.fsTextured);

  this.treeMaterial = new Material(gl, this.solidProgram);
  this.treeMaterial.colorTexture.set(
    new Texture2D(gl, 'media/tree.png'));

  this.treeMesh = new MultiMesh(gl, "media/tree.json", [this.treeMaterial]);

  const tree = new GameObject(this.treeMesh);
  tree.position.set(40, -20, -40);
  this.gameObjects.push(tree);

  const road = new Road(gl, this.solidProgram);
  this.gameObjects.push(road);

  this.car = new Car(gl, this.solidProgram, road);
  this.gameObjects.push(this.car);

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

  // clear the screen
  gl.clearColor(0.6, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.car.move(timeAtThisFrame, dt, keysPressed, this.gameObjects, this.camera);
  this.camera.move(dt, keysPressed);
  for (let i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].draw(this.camera);
  }

};


