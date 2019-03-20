"use strict";
const Scene = function (gl) {
  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  this.gameObjects = [];
  this.backgroundVS = new Shader(gl, gl.VERTEX_SHADER, "background_vs.essl");
  this.backgroundFS = new Shader(gl, gl.FRAGMENT_SHADER, "background_fs.essl");
  this.backgroundProgram = new Program(gl, this.backgroundVS, this.backgroundFS);
  this.backgroundMaterial = new Material(gl, this.backgroundProgram);
  this.backgroundMaterial.envTexture.set(new TextureCube(gl, [
    "media/posx512.jpg",
    "media/negx512.jpg",
    "media/posy512.jpg",
    "media/negy512.jpg",
    "media/posz512.jpg",
    "media/negz512.jpg",]
  ));
  this.quadGeometry = new QuadGeometry(gl);
  this.backgroundMesh = new Mesh(this.quadGeometry, this.backgroundMaterial);
  const background = new GameObject(this.backgroundMesh);
  this.gameObjects.push(background);

  this.vsTrafo = new Shader(gl, gl.VERTEX_SHADER, "trafo_vs.essl");
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl");
  this.solidProgram = new Program(gl, this.vsTrafo, this.fsTextured);

  this.asteroidMaterial = new Material(gl, this.solidProgram);
  this.asteroidMaterial.colorTexture.set(
    new Texture2D(gl, 'media/asteroid.png'));

  this.landerMaterial = new Material(gl, this.solidProgram);
  this.landerMaterial.colorTexture.set(
    new Texture2D(gl, 'media/lander.png'));

  this.asteroidMesh = new MultiMesh(gl, "media/sphere.json", [this.asteroidMaterial]);
  this.landerMesh =  new MultiMesh(gl, "media/sphere.json", [this.landerMaterial]);

  for(let i=0; i<64; i++) {
    const asteroid = new GameObject(this.asteroidMesh);
    asteroid.position.setRandom({x:-30, y:-30}, {x:30, y:30});
    this.gameObjects.push(asteroid);
  }

  const lander = new GameObject(this.landerMesh);
  lander.position.set(-1, 1);
  this.gameObjects.push(lander);

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


