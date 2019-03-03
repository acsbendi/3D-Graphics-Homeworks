class Boom extends GameObject {
    constructor(gl, program, geometry, position) {
        let material = new Material(gl, program);
        material.colorTexture.set(new Texture2D(gl, 'media/boom.png'));
        material.texOffset.set(0, 0);
        material.texScale.set(1/6, 1/6);
        let mesh = new Mesh(geometry, material);
        super(mesh);

        this.material = material;
        this.position = position;
        this.scale = new Vec3(0.1, 0.1, 0.1)
        this.currentTime = 0;
    }

    move(t, dt, keysPressed, gameObjects) {
        if(this.material.texOffset.y > 4/6 + 0.01 && this.material.texOffset.x > 3/6 + 0.01){
            gameObjects.splice(gameObjects.indexOf(this), 1);
            return null;
        }
        this.material.texOffset.add(1/6, 0);
        if(this.material.texOffset.x > 5/6 + 0.01){
            this.material.texOffset.storage[0] = 0;
            this.material.texOffset.add(0, 1/6);
        }
        return null;
    }

    handleCollisions(gameObjects){
        //Boom cannot collide
    }
}