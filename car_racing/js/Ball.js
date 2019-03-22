const MASS = 0.15;

class Ball extends MovableGameObject{

    constructor(gl, program, road, type){

        const material = new Material(gl, program);
        material.colorTexture.set(
          new Texture2D(gl, type.texturePath));
      
        const mesh = new MultiMesh(gl, type.meshDescriptorPath, [material]);

        super(mesh, road, type.groundLevel);

        this.mass = MASS;
        this.radius = type.radius;
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

    
    checkCollision(position, boundingBoxVertex1, boundingBoxVertex2){
        let otherBoundingBoxXMax = Math.max(boundingBoxVertex1.x, boundingBoxVertex2.x);
        let otherBoundingBoxXMin = Math.min(boundingBoxVertex1.x, boundingBoxVertex2.x);

        if(this.position.x > position.x){
            var otherClosestX = position.x + otherBoundingBoxXMax;
            if(otherClosestX + this.radius < this.position.x){
                return false;
            }
        } else {
            var otherClosestX = position.x + otherBoundingBoxXMin;
            if(otherClosestX - this.radius > this.position.x){
                return false;
            }
        }

        let otherBoundingBoxYMax = Math.max(boundingBoxVertex1.y, boundingBoxVertex2.y);
        let otherBoundingBoxYMin = Math.min(boundingBoxVertex1.y, boundingBoxVertex2.y);

        if(this.position.z > position.z){
            var otherClosestY = position.z + otherBoundingBoxYMax;
            if(otherClosestY + this.radius < this.position.z){
                return false;
            }
        } else {
            var otherClosestY = position.z + otherBoundingBoxYMin;
            if(otherClosestY - this.radius > this.position.z){
                return false;
            }
        }

        return true;
    }
}

const BASKET_SCALE = 0.35;
const GOLF_SCALE = 2;
const STONE_SCALE = 12;

Ball.TYPE_DATA = {
    BASKET: {
        texturePath: 'media/basketball/basketball.png',
        meshDescriptorPath: "media/basketball/basketball.json",
        groundLevel: -14.7, 
        scale: BASKET_SCALE,
        initialPosition: new Vec2(-5.5, 80),
        radius: 19 * BASKET_SCALE
    }, 
    GOLF: {
        texturePath: 'media/golfball/golfball.jpg',
        meshDescriptorPath: "media/golfball/golfball.json",
        groundLevel: -17, 
        scale: GOLF_SCALE,
        initialPosition: new Vec2(23, 160),
        radius: 2.1176 * GOLF_SCALE
    },
    STONE: {
        texturePath: 'media/stoneball/stoneball.jpg',
        meshDescriptorPath: "media/stoneball/stoneball.json",
        groundLevel: -9.5, 
        scale: STONE_SCALE,
        initialPosition: new Vec2(-5.5, 200),
        radius: 1 * STONE_SCALE
    }
}