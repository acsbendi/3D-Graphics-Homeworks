"use strict";
const Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.quadGeometry = new QuadGeometry(gl);

  this.material = new Material(gl, this.solidProgram);
  this.material2 = new Material(gl, this.solidProgram);

  this.material.colorTexture.set(
    new Texture2D(gl, 'media/asteroid.png'));
  this.material2.colorTexture.set(
    new Texture2D(gl, 'media/boom.png'));
  this.material.texOffset.set(0.1, 0.4);
  this.mesh = new Mesh(this.quadGeometry, this.material);
  this.mesh2 = new Mesh(this.quadGeometry, this.material2);

  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;

  this.modelMatrix = new Mat4();

  this.gameObjects = [];

  let gameObject1 = new GameObject(this.mesh);
  gameObject1.position = new Vec3(0,0.4,0);
  gameObject1.scale = new Vec3(0.1,0.1,0.1);
  gameObject1.move = function(t, dt,  keysPressed, gameObjects){
    this.orientation = t;
  };
  this.gameObjects.push(gameObject1);

  let gameObject2 = new GameObject(this.mesh);
  gameObject2.position = new Vec3(0.6,-0.7,0);
  gameObject2.scale = new Vec3(0.2,0.1,0.1);
  gameObject2.move = function(t, dt,  keysPressed, gameObjects){
    this.position.add(dt);
  };
  this.gameObjects.push(gameObject2);

  let gameObject3 = new GameObject(this.mesh2);
  gameObject3.position = new Vec3(0.4,0,0);
  gameObject3.scale = new Vec3(0.1,0.1,0.3);
  gameObject3.move = function(t, dt,  keysPressed, gameObjects){
    this.position.add(0, dt/2);
  };
  this.gameObjects.push(gameObject3);


  let gameObject4 = new GameObject(this.mesh2);
  gameObject4.position = new Vec3(-0.4,0.3,0);
  gameObject4.scale = new Vec3(0.1,0.1,0.3);
  gameObject4.move = function(t, dt,  keysPressed, gameObjects){
    if("A" in keysPressed && keysPressed["A"]){
      this.orientation += dt/2;
    }
  };
  this.gameObjects.push(gameObject4);

  this.camera = new OrthoCamera();
};

Scene.prototype.update = function(gl, keysPressed) {
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
  for(let gameObject of this.gameObjects){
    gameObject.move(t, dt,  keysPressed, this.gameObjects);
    gameObject.draw(this.camera);
  }
};


