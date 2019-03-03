"use strict";
const Scene = function (gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.quadGeometry = new QuadGeometry(gl);

  this.material = new Material(gl, this.solidProgram);
  this.material2 = new Material(gl, this.solidProgram);

  this.material.colorTexture.set(
    new Texture2D(gl, 'media/asteroid.png'));
  this.material.texOffset.set(0.1, 0.4);
  this.mesh = new Mesh(this.quadGeometry, this.material);

  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  this.modelMatrix = new Mat4();

  this.gameObjects = [];

  for (let i = -2.3; i < 1.8; i += 0.22) {
    let gameObject = new GameObject(this.mesh);
    gameObject.position = new Vec3(i, 1.21, 0);
    gameObject.scale = new Vec3(0.1, 0.1, 0.1);
    gameObject.move = function (t, dt, keysPressed, gameObjects) {
      this.orientation = t;
      this.handleCollisions(gameObjects);
    };
    this.gameObjects.push(gameObject);
  }

  for (let i = 1; i > -0.7; i -= 0.22) {
    let gameObject = new GameObject(this.mesh);
    gameObject.position = new Vec3(-2.3, i, 0);
    gameObject.scale = new Vec3(0.1, 0.1, 0.1);
    gameObject.move = function (t, dt, keysPressed, gameObjects) {
      this.orientation = t;
      this.handleCollisions(gameObjects);
    };
    this.gameObjects.push(gameObject);
  }


  for (let i = -2.3; i < 2; i += 0.22) {
    let gameObject = new GameObject(this.mesh);
    gameObject.position = new Vec3(i, -0.76, 0);
    gameObject.scale = new Vec3(0.1, 0.1, 0.1);
    gameObject.move = function (t, dt, keysPressed, gameObjects) {
      this.orientation = t;
      this.handleCollisions(gameObjects);
    };
    this.gameObjects.push(gameObject);
  }

  let gameObject2 = new GameObject(this.mesh);
  gameObject2.position = new Vec3(0.6, -0.45, 0);
  gameObject2.scale = new Vec3(0.2, 0.1, 0.1);
  gameObject2.speed = new Vec3(1, 1, 0);
  this.gameObjects.push(gameObject2);

  this.avatar = new Avatar(gl, this.solidProgram, this.quadGeometry);
  this.gameObjects.push(this.avatar);

  this.camera = new OrthoCamera();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

Scene.prototype.update = function (gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  //Uniforms.trafo.modelMatrix.set(this.modelMatrix.translate(dt/6, dt%6, 0)); 

  // clear the screen
  gl.clearColor(0.3, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.solidProgram.commit();
  for (let gameObject of this.gameObjects) {
    gameObject.move(t, dt, keysPressed, this.gameObjects);
    gameObject.draw(this.camera);
  }
};

Scene.prototype.createNewBullet = function () {
  let bullet = new GameObject(this.mesh);
  bullet.position = new Vec3(this.avatar.position);
  bullet.mass = 0.1;
  bullet.scale = new Vec3(0.1, 0.1, 0.1);
  let speedX = Math.cos(this.avatar.orientation + Math.PI / 2);
  let speedY = Math.sin(this.avatar.orientation + Math.PI / 2);
  bullet.speed = new Vec3(speedX, speedY).times(10, 10);
  this.gameObjects.push(bullet);
};


