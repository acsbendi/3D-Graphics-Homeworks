"use strict";
const DRAG_CONSTANT = 0.00134;
const GRAVITATIONAL_CONSTANT = 5000;
const GROUND_DISTANCE_EPSILON = 0.0001;

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

    this.onGround = true;
    this.falling = false;
    this.acceleration = new Vec3(0, 0, 0);
    this.speed = new Vec3(0, 0, 0);
    this.mass = 1;
    this.currentForce = new Vec3(0, 0, 0);
    this.totalTravelledDistance = new Vec3(0, 0, 0);
  }

  move(t, dt, keysPressed, gameObjects) {
    if(Math.abs(this.position.y - this.groundLevel) > GROUND_DISTANCE_EPSILON){
      this.onGround = false;
    }
    if(!this.onGround){
      this.applyForce(new Vec3(0, - dt * this.mass * GRAVITATIONAL_CONSTANT, 0));
    }

    this.lastTravelledDistance = this.speed.times(dt);
    this.totalTravelledDistance.add(this.lastTravelledDistance);
    this.position.add(this.lastTravelledDistance);
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

    if(this.onGround){
      let currentPositionOnRoad = new Vec2(this.position.x, this.position.z);
      if(!this.road.isOnRoad(currentPositionOnRoad)){
          this.onGround = false;
      }
    } else if(!this.falling && this.position.y < this.groundLevel){
      let currentPositionOnRoad = new Vec2(this.position.x, this.position.z);
      if(this.road.isOnRoad(currentPositionOnRoad)){
          this.onGround = true;
          this.position.y = this.groundLevel;
          this.speed.y = 0;
      }else{
        this.falling = true;
      }
    }
  }

  applyForce(force) {
    this.currentForce.add(force);
  }
}