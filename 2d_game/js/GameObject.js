const GameObject = function (mesh) {
    this.mesh = mesh;

    this.position = new Vec3(0, 0, 0);
    this.orientation = 0;
    this.scale = new Vec3(1, 1, 1);

    this.modelMatrix = new Mat4();
    this.acceleration = new Vec3(0, 0, 0);
    this.speed = new Vec3(0, 0, 0);
    this.mass = 1;
    this.dragConstant = 0.0634;
    this.currentForce = new Vec3(0, 0, 0);
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

    let dragForce = this.speed.times(this.speed).times(this.dragConstant);
    if (this.speed.x > 0)
        dragForce.storage[0] *= -1;
    if (this.speed.y > 0)
        dragForce.storage[1] *= -1;
    if (this.speed.z > 0)
        dragForce.storage[2] *= -1;
    this.applyForce(dragForce);
    this.acceleration = this.currentForce.over(this.mass);
    this.currentForce.set(0, 0, 0);

    return this.handleCollisions(gameObjects);
};

GameObject.prototype.applyForce = function (force) {
    this.currentForce.add(force);
}

GameObject.prototype.handleCollisions = function (gameObjects) {
    for (let gameObject of gameObjects) {
        if (gameObject != this && !(gameObject instanceof Avatar) && !(gameObject instanceof Boom)) {
            let minimumDistance = this.getRadius() + gameObject.getRadius();
            let currentDistance = this.getDistanceFrom(gameObject);
            if(minimumDistance > currentDistance){
                gameObjects.splice(gameObjects.indexOf(gameObject), 1);
                gameObjects.splice(gameObjects.indexOf(this), 1);
                let boomPosition = this.position.plus((gameObject.position.minus(this.position)).times(this.getRadius()));
                return boomPosition;
            }
        }
    }
    return null;
}

GameObject.prototype.getRadius = function () {
    return Math.max(this.scale.x, this.scale.y);
}

GameObject.prototype.getDistanceFrom = function (otherGameObject) {
    return Math.sqrt((this.position.x - otherGameObject.position.x) * (this.position.x - otherGameObject.position.x) +
        (this.position.y - otherGameObject.position.y) * (this.position.y - otherGameObject.position.y));
}