const GameObject = function (mesh) {
    this.mesh = mesh;

    this.position = new Vec3(0, 0, 0);
    this.orientation = 0;
    this.scale = new Vec3(1, 1, 1);

    this.modelMatrix = new Mat4();
    this.acceleration = new Vec3(0, 0, 0);
    this.speed = new Vec3(0, 0, 0);
    this.mass = 1;
    this.dragConstant = 0.634;
    this.currentForce = new Vec3(0,0,0);
};


GameObject.prototype.updateModelMatrix =
    function () {
        this.modelMatrix.set();
        this.modelMatrix.rotate(this.orientation);
        this.modelMatrix.scale(this.scale);
        this.modelMatrix.translate(this.position);
    };

GameObject.prototype.draw = function (camera) {

    this.updateModelMatrix();

    Uniforms.trafo.modelViewProjMatrix.set().
        mul(this.modelMatrix).
        mul(camera.viewProjMatrix);
    //feladat: Uniforms.trafo.modelMatrix uniform beállítása
    Uniforms.trafo.modelMatrix.set(this.modelMatrix);

    this.mesh.draw();
};

GameObject.prototype.move = function (t, dt, keysPressed, gameObjects) {
    this.position.add(this.speed.times(dt));
    this.speed.add(this.acceleration.times(dt));

    let drawForceDirection = new Vec3(this.speed.x > 0 ? -1 : 1, this.speed.y > 0 ? -1 : 1, this.speed.z > 0 ? -1 : 1);
    let dragForce = this.speed.times(this.speed).times(this.dragConstant).times(drawForceDirection);
    this.applyForce(dragForce);
    this.acceleration = this.currentForce.over(this.mass);
    this.currentForce.set(0,0,0);
};

GameObject.prototype.applyForce = function (force) {
    this.currentForce.add(force);
}