const WHEEL_COUNT = 4;
const WHEEL_OFFSETS = [
    new Vec3(-6.5, -3.5, -11.2),
    new Vec3(6.5, -3.5, -11.2),
    new Vec3(-6.5, -3.5, 14),
    new Vec3(6.5, -3.5, 14)
];
const INITIAL_POSITION = new Vec3(20, -14.8, -20);

class Car extends GameObject {
    constructor(gl, program) {
        let material = new Material(gl, program);
        material.colorTexture.set(
            new Texture2D(gl, 'media/chevy/chevy.png'));
        const chassisMesh = new MultiMesh(gl, "media/chevy/chassis.json", [material]);
        const wheelMesh = new MultiMesh(gl, "media/chevy/wheel.json", [material]);
        
        super();
        
        this.position = INITIAL_POSITION;
          
        this.chassis = new GameObject(chassisMesh);
        this.chassis.position.set(this.position);

        this.wheels = [];
        for(let i = 0; i < WHEEL_COUNT; ++i){
            const wheel = new GameObject(wheelMesh);
            wheel.position.set(this.position.plus(WHEEL_OFFSETS[i]));
            this.wheels.push(wheel);
        }
    }

    move(t, dt, keysPressed, gameObjects) {
        return super.move(t, dt, keysPressed, gameObjects);
    }

    draw(camera){
        this.chassis.draw(camera);
        for(let wheel of this.wheels){
            wheel.draw(camera);
        }
    }

}