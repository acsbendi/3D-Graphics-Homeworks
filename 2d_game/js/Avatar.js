class Avatar extends GameObject {
    constructor(gl, program, geometry) {
        let material = new Material(gl, program)
        material.colorTexture.set(new Texture2D(gl, 'media/avatar.png'))
        let mesh = new Mesh(geometry, material)
        super(mesh);

        this.position = new Vec3(-0.4, 0.3, 0);
        this.scale = new Vec3(0.1, 0.1, 0.1)
    }

    move(t, dt, keysPressed, gameObjects) {
        if ("A" in keysPressed && keysPressed["A"]) {
            this.position.sub(dt / 2);
            this.orientation = Math.PI / 2;
        }
        if ("S" in keysPressed && keysPressed["S"]) {
            this.position.sub(0, dt / 2);
            this.orientation = Math.PI;
        }
        if ("D" in keysPressed && keysPressed["D"]) {
            this.position.add(dt / 2);
            this.orientation = 1.5 * Math.PI;
        }
        if ("W" in keysPressed && keysPressed["W"]) {
            this.position.add(0, dt / 2);
            this.orientation = 0;
        }

        if ("A" in keysPressed && keysPressed["A"] && "S" in keysPressed && keysPressed["S"] &&
            "D" in keysPressed && keysPressed["D"]) {
            this.orientation = Math.PI;
        } else if ("A" in keysPressed && keysPressed["A"] && "S" in keysPressed && keysPressed["S"] &&
            "W" in keysPressed && keysPressed["W"]) {
            this.orientation = Math.PI / 2;
        } else if ("A" in keysPressed && keysPressed["A"] && "D" in keysPressed && keysPressed["D"] &&
            "W" in keysPressed && keysPressed["W"]) {
            this.orientation = 0;
        } else if ("D" in keysPressed && keysPressed["D"] && "S" in keysPressed && keysPressed["S"] &&
            "W" in keysPressed && keysPressed["W"]) {
            this.orientation = 1.5 * Math.PI;
        } else if ("D" in keysPressed && keysPressed["D"] && "S" in keysPressed && keysPressed["S"]) {
            this.orientation = 1.25 * Math.PI;
        } else if ("D" in keysPressed && keysPressed["D"] && "W" in keysPressed && keysPressed["W"]) {
            this.orientation = 1.75 * Math.PI;
        } else if ("A" in keysPressed && keysPressed["A"] && "W" in keysPressed && keysPressed["W"]) {
            this.orientation = 0.25 * Math.PI;
        } else if ("A" in keysPressed && keysPressed["A"] && "S" in keysPressed && keysPressed["S"]) {
            this.orientation = 0.75 * Math.PI;
        } else if ("A" in keysPressed && keysPressed["A"]) {
            this.orientation = Math.PI / 2;
        } else if ("S" in keysPressed && keysPressed["S"]) {
            this.orientation = Math.PI;
        } else if ("D" in keysPressed && keysPressed["D"]) {
            this.orientation = 1.5 * Math.PI;
        } else if ("W" in keysPressed && keysPressed["W"]) {
            this.orientation = 0;
        }

    }
}
