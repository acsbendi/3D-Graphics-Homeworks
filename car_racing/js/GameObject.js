"use strict"; 
const GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1); 

  this.modelMatrix = new Mat4(); 
};

GameObject.prototype.updateModelMatrix = function(){ 
  this.modelMatrix.set().
    scale(this.scale).
    rotate(this.orientation, 0, 1, 0).
    translate(this.position);
};

GameObject.prototype.draw = function(camera){ 
  this.updateModelMatrix();
  Uniforms.trafo.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  this.mesh.draw(); 
};
