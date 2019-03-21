const WHEEL_COUNT = 4;
const WHEEL_OFFSETS = [
    new Vec2(-6.5, -11.2),
    new Vec2(6.5, -11.2),
    new Vec2(-6.5, 14),
    new Vec2(6.5, 14)
];
const CAMERA_OFFSET = new Vec3();
const INITIAL_POSITION = new Vec3(20, -14.8, -20);

class Car extends GameObject {
    constructor(gl, program) {
        let material = new Material(gl, program);
        material.colorTexture.set(
            new Texture2D(gl, 'media/chevy/chevy.png'));
        const chassisMesh = new MultiMesh(gl, "media/chevy/chassis.json", [material]);
        
        super();
        
        this.position = INITIAL_POSITION;
        this.orientation = 0;
          
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
        this.orientation += dt;
        while(this.orientation > 2 * Math.PI){
            this.orientation -= 2 * Math.PI;
        }
    }

    draw(camera){
        this.chassis.orientation = this.orientation;
        this.chassis.draw(camera);
        for(let wheel of this.wheels){
            wheel.update(this.position, this.orientation);
            wheel.draw(camera);
        }
    }

}