const VERTICAL_OFFSET = -3.5;
const MAX_STEERING_ORIENTATION = 0.5;
const ROLLING_MULTIPLIER = 0.005;

class Wheel extends GameObject {
    constructor(gl, material, offset, parentPosition, parentOrientation, steerable) {
        const mesh = new MultiMesh(gl, "media/chevy/wheel.json", [material]);
        super(mesh);

        this.steerable = steerable;
        this.rotation = 0;
        this.offsetConverter = new OffsetConverter(offset);
        this.update(parentPosition, parentOrientation);
    }

    updateModelMatrix(){ 
        this.modelMatrix.set().
          scale(this.scale).
          rotate(this.rotation, 1, 0, 0).
          rotate(this.orientation, 0, 1, 0).
          translate(this.position);
    }

    update(parentPosition, parentOrientation, speed){
        if(!this.steerable){
            this.orientation = parentOrientation;
        } else {
            this.parentOrientation = parentOrientation;
        }

        if(speed){
            this.rotation += (Math.sin(parentOrientation) * speed.x + Math.cos(parentOrientation) * speed.z) * ROLLING_MULTIPLIER;
        }

        let currentOffset = this.offsetConverter.getCurrentOffset(-parentOrientation);
        this.position.set(parentPosition.plus(currentOffset.x, VERTICAL_OFFSET, currentOffset.y));
    }

    steer(dt, left){
        if(left && this.orientation < this.parentOrientation + MAX_STEERING_ORIENTATION){
            this.orientation += dt;
        } else if(this.orientation > this.parentOrientation - MAX_STEERING_ORIENTATION) {
            this.orientation -= dt;
        }
    }

    parentOrientationReset(newParentOrientation){
        this.orientation = newParentOrientation + (this.orientation - this.parentOrientation);
    }

}