const WHEEL_COUNT = 4;
const WHEEL_OFFSETS = [
    new Vec2(-6.5, -11.2),
    new Vec2(6.5, -11.2),
    new Vec2(-6.5, 14),
    new Vec2(6.5, 14)
];
const INITIAL_POSITION = new Vec3(20, -14.8, -20);
const SPEED = 30;
const STEERABILITY = 0.5;
const FALL_SPEED = 50;

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

    move(t, dt, keysPressed, gameObjects) {
        if(this.falling){
            this.position.sub(0, FALL_SPEED * dt, 0);
            return;
        }

        if ("A" in keysPressed && keysPressed["A"]) {
            this.orientation += dt * STEERABILITY;
        }
        if ("S" in keysPressed && keysPressed["S"]) {
            this.position.sub(SPEED * dt * Math.sin(this.orientation), 0, SPEED * dt * Math.cos(this.orientation));
        }
        if ("D" in keysPressed && keysPressed["D"]) {
            this.orientation -= dt * STEERABILITY;
        }
        if ("W" in keysPressed && keysPressed["W"]) {
            this.position.add(SPEED * dt * Math.sin(this.orientation), 0, SPEED *  dt * Math.cos(this.orientation));
        }    
        if(this.orientation < 0){
            this.orientation = 2 * Math.PI - this.orientation;
        } else if(this.orientation > 2 * Math.PI){
            this.orientation -= 2 * Math.PI;
        }

        let currentPositionOnRoad = new Vec2(this.position.x, this.position.z);
        if(!this.road.isOnRoad(currentPositionOnRoad)){
            this.falling = true;
        }
    }

    draw(camera){
        if(!App.FREE_CAMERA_MODE){
            camera.update(this.position, this.orientation);
        }
        this.chassis.orientation = this.orientation;
        this.chassis.position.set(this.position);
        this.chassis.draw(camera);
        for(let wheel of this.wheels){
            wheel.update(this.position, this.orientation);
            wheel.draw(camera);
        }
    }

}