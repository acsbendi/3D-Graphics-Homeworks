const GameObject = function(mesh) { 
    this.mesh = mesh;
  
    this.position = new Vec3(0, 0, 0); 
    this.orientation = 0; 
    this.scale = new Vec3(1, 1, 1); 
  
    this.modelMatrix = new Mat4(); 
};


GameObject.prototype.updateModelMatrix =
                              function(){
  this.modelMatrix.set();
  this.modelMatrix.rotate(this.orientation);
  this.modelMatrix.scale(this.scale);
  this.modelMatrix.translate(this.position);
};

GameObject.prototype.draw = function(camera){ 

    this.updateModelMatrix();

    Uniforms.trafo.modelViewProjMatrix.set(). 
    mul(this.modelMatrix).
    mul(camera.viewProjMatrix);
    //feladat: Uniforms.trafo.modelMatrix uniform beállítása
    Uniforms.trafo.modelMatrix.set(this.modelMatrix);
  
    this.mesh.draw(); 
};