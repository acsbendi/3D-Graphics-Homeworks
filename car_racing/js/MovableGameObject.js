"use strict";
const DRAG_CONSTANT = 0.0334;
const FALL_FORCE_MULTIPLIER = 5000;

class MovableGameObject extends GameObject {
  constructor(mesh, road, groundLevel) {
    super(mesh);
    this.mesh = mesh;
    this.road = road;

    this.groundLevel = groundLevel;
    this.position = new Vec3(0, 0, 0);
    this.orientation = 0;
    this.scale = new Vec3(1, 1, 1);
    this.modelMatrix = new Mat4();

    this.onLand = true;
    this.falling = false;
    this.acceleration = new Vec3(0, 0, 0);
    this.speed = new Vec3(0, 0, 0);
    this.mass = 1;
    this.currentForce = new Vec3(0, 0, 0);
  }

  move(t, dt, keysPressed, gameObjects) {
    if(this.position.y != this.groundLevel){
      this.onLand = false;
    }
    if(!this.onLand){
      this.applyForce(new Vec3(0, - dt * FALL_FORCE_MULTIPLIER, 0));
    }

    this.position.add(this.speed.times(dt));
    this.speed.add(this.acceleration.times(dt));

    let dragForce = this.speed.times(this.speed).times(DRAG_CONSTANT);
    if (this.speed.x > 0)
      dragForce.storage[0] *= -1;
    if (this.speed.y > 0)
      dragForce.storage[1] *= -1;
    if (this.speed.z > 0)
      dragForce.storage[2] *= -1;
    this.applyForce(dragForce);
    this.acceleration = this.currentForce.over(this.mass);
    this.currentForce.set(0, 0, 0);

    if(this.onLand){
      let currentPositionOnRoad = new Vec2(this.position.x, this.position.z);
      if(!this.road.isOnRoad(currentPositionOnRoad)){
          this.onLand = false;
      }
    } else if(!this.falling && this.position.y < this.groundLevel){
      let currentPositionOnRoad = new Vec2(this.position.x, this.position.z);
      if(this.road.isOnRoad(currentPositionOnRoad)){
          this.onLand = true;
          this.position.y = this.groundLevel;
      }else{
        this.falling = true;
      }
    }
  };

  applyForce(force) {
    this.currentForce.add(force);
  }
}