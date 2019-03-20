const SCALE = 28;
const POSITION = new Vec3(-10, -30, 0);

class Road extends GameObject {
    constructor(gl, program) {
        let material = new Material(gl, program);
        material.colorTexture.set(
            new Texture2D(gl, 'media/road/road.jpg'));
        const roadMesh = new MultiMesh(gl, "media/road/road.json", [material]);
        
        super(roadMesh);

        this.scale = new Vec3(SCALE, SCALE, SCALE);
        this.position = POSITION;
    }
}