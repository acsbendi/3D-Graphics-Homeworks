const WHEEL_COUNT = 4;
const WHEEL_OFFSETS = [
    new Vec2(-6.5, -11.2),
    new Vec2(6.5, -11.2),
    new Vec2(-6.5, 14),
    new Vec2(6.5, 14)
];
const INITIAL_POSITION = new Vec3(20, -14.8, -20);
const FORCE_MULTIPLIER = 10000;
const STEERABILITY = 0.5;
const FALL_FORCE_MULTIPLIER = 10000;

class Car extends GameObject {
    
    constructor(gl, program, road) {
        let material = new Material(gl, program);
        material.colorTexture.set(
            new Texture2D(gl, 'media/chevy/chevy.png'));
        const chassisMesh = new MultiMesh(gl, "media/chevy/chassis.json", [material]);
        
        super();
        
        this.position = INITIAL_POSITION;
        this.orientation = 0;
        this.road = road;
        this.falling = false;
          
        this.chassis = new GameObject(chassisMesh);
        this.chassis.position.set(this.position);
        this.chassis.orientation = this.orientation;

        this.wheels = [];
        for(let i = 0; i < WHEEL_COUNT; ++i){
            const wheel = new Wheel(gl, material, WHEEL_OFFSETS[i], this.position, this.orientation);
            this.wheels.push(wheel);
        }
    }

    move(t, dt, keysPressed, gameObjects, camera) {
        if(this.falling){
            this.applyForce(new Vec3(0, - dt * FALL_FORCE_MULTIPLIER, 0));
            super.move(t, dt, keysPressed, gameObjects);
            return;
        }

        if ("A" in keysPressed && keysPressed["A"]) {
            this.orientation += dt * STEERABILITY;
        }
        if ("S" in keysPressed && keysPressed["S"]) {
            this.applyForce(new Vec3(-FORCE_MULTIPLIER * dt * Math.sin(this.orientation), 0, -FORCE_MULTIPLIER * dt * Math.cos(this.orientation)));
        }
        if ("D" in keysPressed && keysPressed["D"]) {
            this.orientation -= dt * STEERABILITY;
        }
        if ("W" in keysPressed && keysPressed["W"]) {
            this.applyForce(new Vec3(FORCE_MULTIPLIER * dt * Math.sin(this.orientation), 0, FORCE_MULTIPLIER * dt * Math.cos(this.orientation)));
        }
        if(this.orientation < 0){
            this.orientation = 2 * Math.PI - this.orientation;
        } else if(this.orientation > 2 * Math.PI){
            this.orientation -= 2 * Math.PI;
        }

        super.move(t, dt, keysPressed, gameObjects);
        if(!App.FREE_CAMERA_MODE){
            camera.update(this.position, this.orientation);
        }

        let currentPositionOnRoad = new Vec2(this.position.x, this.position.z);
        if(!this.road.isOnRoad(currentPositionOnRoad)){
            this.falling = true;
        }
    }

    draw(camera){
        this.chassis.orientation = this.orientation;
        this.chassis.position.set(this.position);
        this.chassis.draw(camera);
        for(let wheel of this.wheels){
            wheel.update(this.position, this.orientation);
            wheel.draw(camera);
        }
    }

}