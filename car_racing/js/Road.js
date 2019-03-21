const SCALE = 28;
const POSITION = new Vec3(-10, -30, 0);
const X_LANES = [
    {"MIN": SCALE * -0.32552699999999996, "MAX": SCALE * 1.6295000000000002},
    {"MIN": SCALE * 17.643250000000002, "MAX": SCALE * 19.7349},
    {"MIN": SCALE * 26.86435, "MAX": SCALE * 29.976300000000002}
];

const Y_LANES = [
    {"MIN": SCALE * -18.79875, "MAX": SCALE * -16.4379},
    {"MIN": SCALE * -0.7452595, "MAX": SCALE * 1.210848},
    {"MIN": SCALE * 9.920290000000001, "MAX": SCALE * 12.26605},
    {"MIN": SCALE * 17.020049999999998, "MAX": SCALE * 19.4676}
];

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

    isOnRoad(position){
        if(!this.isInBoundingRectangle(position))
            return false;

        let xOnLane = false;
        let yOnLane = false;
        for(let lane of X_LANES){
            if(position.x >= this.position.x + lane["MIN"] && position.x <= this.position.x + lane["MAX"]){
                xOnLane = true;
            }
        }
        for(let lane of Y_LANES){
            if(position.y >= this.position.z + lane["MIN"] && position.y <= this.position.z + lane["MAX"]){
                yOnLane = true;
            }
        }
        return xOnLane || yOnLane;
    }

    isInBoundingRectangle(position){
        return  position.x >= this.position.x + X_LANES[0]["MIN"] && position.x <= this.position.x + X_LANES[2]["MAX"] && 
                position.y >= this.position.z + Y_LANES[0]["MIN"] && position.y <= this.position.z + Y_LANES[3]["MAX"];
    }
}