const MASS = 0.15;

class Ball extends MovableGameObject{

    constructor(gl, program, road, type){

        const material = new Material(gl, program);
        material.colorTexture.set(
          new Texture2D(gl, type.texturePath));
      
        const mesh = new MultiMesh(gl, type.meshDescriptorPath, [material]);

        super(mesh, road, type.groundLevel);

        this.mass = MASS;
        this.position.set(type.initialPosition.x, type.groundLevel, type.initialPosition.y);
        this.orientation = Math.PI / 2;
        this.scale = new Vec3(type.scale, type.scale, type.scale);
        this.speed = new Vec3(0, 0, -100);
    }

    updateModelMatrix(){ 
        this.modelMatrix.set().
          rotate(this.speed.length(), this.speed.cross(0, 1, 0)).
          scale(this.scale).
          rotate(this.orientation, 1, 0, 0).
          translate(this.position);
    }
}

Ball.TYPE_DATA = {
    BASKET: {
        texturePath: 'media/basketball/basketball.png',
        meshDescriptorPath: "media/basketball/basketball.json",
        groundLevel: -14.7, 
        scale: 0.35,
        initialPosition: new Vec2(-5.5, 80)
    }, 
    GOLF: {
        texturePath: 'media/golfball/golfball.jpg',
        meshDescriptorPath: "media/golfball/golfball.json",
        groundLevel: -17, 
        scale: 2,
        initialPosition: new Vec2(23, 160)
    },
    STONE: {
        texturePath: 'media/stoneball/stoneball.jpg',
        meshDescriptorPath: "media/stoneball/stoneball.json",
        groundLevel: -9.5, 
        scale: 12,
        initialPosition: new Vec2(-5.5, 200)
    }
}