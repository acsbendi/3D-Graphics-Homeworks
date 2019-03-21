const WHEEL_COUNT = 4;
const WHEEL_OFFSETS = [
    new Vec2(-6.9, -11.2),
    new Vec2(6.9, -11.2),
    new Vec2(-6.9, 14),
    new Vec2(6.9, 14)
];
const GROUND_LEVEL = -14.8;
const INITIAL_POSITION = new Vec3(20, GROUND_LEVEL, -20);
const FORCE_MULTIPLIER = 10000;
const STEERABILITY = 0.5;
const JUMP_FORCE = 15000;

class Car extends MovableGameObject {
    
    constructor(gl, program, road) {
        const material = new Material(gl, program);
        material.colorTexture.set(
            new Texture2D(gl, 'media/chevy/chevy.png'));
        const chassisMesh = new MultiMesh(gl, "media/chevy/chassis.json", [material]);
        
        super(undefined, road, GROUND_LEVEL);
        
        this.position = INITIAL_POSITION;
          
        this.chassis = new GameObject(chassisMesh);
        this.chassis.position.set(this.position);
        this.chassis.orientation = this.orientation;

        this.wheels = [];
        for(let i = 0; i < WHEEL_COUNT; ++i){
            const wheel = new Wheel(gl, material, WHEEL_OFFSETS[i], this.position, this.orientation, i >= 2);
            this.wheels.push(wheel);
        }
    }

    move(t, dt, keysPressed, gameObjects, camera) {
        if(this.falling){
            super.move(t, dt, keysPressed, gameObjects);
            return;
        }
        if (keysPressed.A) {
            this.orientation += dt * STEERABILITY;
            this.wheels[2].steer(dt, true);
            this.wheels[3].steer(dt, true);
        }
        if (keysPressed.S) {
            this.applyForce(new Vec3(-FORCE_MULTIPLIER * dt * Math.sin(this.orientation), 0, -FORCE_MULTIPLIER * dt * Math.cos(this.orientation)));
        }
        if (keysPressed.D) {
            this.orientation -= dt * STEERABILITY;
            this.wheels[2].steer(dt, false);
            this.wheels[3].steer(dt, false);
        }
        if (keysPressed.W) {
            this.applyForce(new Vec3(FORCE_MULTIPLIER * dt * Math.sin(this.orientation), 0, FORCE_MULTIPLIER * dt * Math.cos(this.orientation)));
        }
        if (this.onGround && keysPressed.SPACE) {
            this.applyForce(new Vec3(0, JUMP_FORCE, 0));
        }
        if(this.orientation < 0){
            this.orientation = 2 * Math.PI - this.orientation;
            this.wheels[2].parentOrientationReset(this.orientation);
            this.wheels[3].parentOrientationReset(this.orientation);
        } else if(this.orientation > 2 * Math.PI){
            this.orientation -= 2 * Math.PI;
            this.wheels[2].parentOrientationReset(this.orientation);
            this.wheels[3].parentOrientationReset(this.orientation);
        }

        super.move(t, dt, keysPressed, gameObjects);
        if(!App.FREE_CAMERA_MODE){
            camera.update(this.position, this.orientation);
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