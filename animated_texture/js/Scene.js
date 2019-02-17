"use strict";
const EPSILON = 0.000001;
const Scene = function(gl) {
  this.vsTextureTrafo = new Shader(gl, gl.VERTEX_SHADER, "texture_trafo_vs.essl");
  this.fsTexture = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl");
  this.textureProgram = new Program(gl, this.vsTextureTrafo, this.fsTexture);
  this.quadGeometry = new QuadGeometry(gl);
  this.texture = new Texture2D(gl, "media/platformer_sprites_base.png");

  this.timeAtFirstFrame = new Date().getTime();
  this.timeAtLastFrame = this.timeAtFirstFrame;
  this.step = new Vec4(0.02, 0.02, 0.0, 0.0);

  this.modelMatrix = new Mat4();
  this.offset = new Vec2(0, 0.25);

  gl.enable(gl.BLEND);
  /*gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);*/
    gl.blendFunc(gl.SRC_COLOR, gl.DST_COLOR);
};

Scene.prototype.onUpPressed = function(){
  if(this.offset.y >= 0.125 - EPSILON){
    this.offset.sub(0, 0.125);
  }
};

Scene.prototype.onDownPressed = function(){
  if(this.offset.y <= 0.875 - EPSILON){
    this.offset.add(0, 0.125);
  }
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  const timeAtThisFrame = Math.floor(new Date().getMilliseconds()/100);
  if(timeAtThisFrame > this.timeAtLastFrame){
    if("RIGHT" in keysPressed && keysPressed.RIGHT){
      this.offset.add(0.125, 0);
      if(this.offset.x >= 1 - EPSILON){
        this.offset.x = 0;
      }
    } else if("LEFT" in keysPressed && keysPressed.LEFT){
      this.offset.sub(0.125, 0);
      if(this.offset.x <= 0 + EPSILON){
        this.offset.x = 1;
      }
    }
  }
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0.3, 0.5, 0.8, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.textureProgram.commit();
  this.texture.commit(
    gl, gl.getUniformLocation(
    this.textureProgram.glProgram, "colorTexture"), 0);
  this.offset.commit(gl,
    gl.getUniformLocation(this.textureProgram.glProgram, "offset"));
  
  this.quadGeometry.draw();
};

