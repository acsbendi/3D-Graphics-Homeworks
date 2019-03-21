const VERTICAL_OFFSET = -3.5;
const MAX_STEERING_ORIENTATION = 0.5;

class Wheel extends GameObject {
    constructor(gl, material, offset, parentPosition, parentOrientation, steerable) {
        const mesh = new MultiMesh(gl, "media/chevy/wheel.json", [material]);
        super(mesh);

        this.steerable = steerable;
        this.offsetConverter = new OffsetConverter(offset);
        this.update(parentPosition, parentOrientation);
    }

    update(parentPosition, parentOrientation){
        if(!this.steerable){
            this.orientation = parentOrientation;
        }else{
            this.parentOrientation = parentOrientation;
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