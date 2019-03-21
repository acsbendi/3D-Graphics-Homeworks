class WheelOffsetConverter{

    constructor(originalOffset){
        this.originalOffset = originalOffset;
        this.offsetSquareSum = originalOffset.y * originalOffset.y + originalOffset.x * originalOffset.x;
        this.setOriginalAngle();
    }

    setOriginalAngle(){
        this.originalAngle = Math.atan(this.originalOffset.y/this.originalOffset.x);
        if(this.originalOffset.y < 0 && this.originalOffset.x > 0){
            this.originalAngle += 2 * Math.PI;
        } else if(this.originalOffset.y < 0 && this.originalOffset.x < 0){
            this.originalAngle += Math.PI;
        } else if(this.originalOffset.y > 0 && this.originalOffset.x < 0){
            this.originalAngle += Math.PI;
        }
    }

    getCurrentOffsets(parentOrientation){

        let currentAngle = this.originalAngle + parentOrientation;
        if(currentAngle < 0){
            currentAngle = 2 * Math.PI + currentAngle;
        }
        let currentTangent = Math.abs(Math.tan(currentAngle));
        let currentOffsetX = Math.sqrt(this.offsetSquareSum / (1 + currentTangent * currentTangent)); 
        let currentOffsetY = currentOffsetX * currentTangent;

        let currentAngleNormal = currentAngle / (2 * Math.PI);
        if(currentAngleNormal < 0){
            currentAngleNormal = 1 - currentAngleNormal;
        }
        if(currentAngleNormal > 0.25 && currentAngleNormal < 0.5){
            currentOffsetX *= -1;
        } else if(currentAngleNormal > 0.5 && currentAngleNormal < 0.75){
            currentOffsetX *= -1;
            currentOffsetY *= -1;
        } else if(currentAngleNormal > 0.75){
            currentOffsetY *= -1;
        }

        return new Vec2(currentOffsetX, currentOffsetY);
    }
}