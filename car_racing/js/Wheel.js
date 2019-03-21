const VERTICAL_OFFSET = -3.5;

class Wheel extends GameObject {
    constructor(gl, material, offset, parentPosition, parentOrientation) {
        const mesh = new MultiMesh(gl, "media/chevy/wheel.json", [material]);
        super(mesh);

        this.offsetConverter = new OffsetConverter(offset);
        this.update(parentPosition, parentOrientation);
    }

    update(parentPosition, parentOrientation){
        this.orientation = parentOrientation;

        let currentOffset = this.offsetConverter.getCurrentOffset(-parentOrientation);
        this.position.set(parentPosition.plus(currentOffset.x, VERTICAL_OFFSET, currentOffset.y));
    }

}