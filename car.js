class Car {
    constructor(
        {
            x = 0,
            y = 0,
            width = 100,
            height = 100,
            maxSpeed = 3,
            controlActive = false
        }
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.1;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        this.angle = 0;

        this.controls = new Controls(controlActive);
        this.sensor = new Sensor({ car: this });
        this.polygon = this._createPolygon();

        this.damaged = false;
    }

    update({ roadBorders }) {
        if (!this.damaged) {
            this._move();
            this.polygon = this._createPolygon(roadBorders);
            this.damaged = this._assessDamage(roadBorders);
        }

        this.sensor.update(roadBorders);
    }

    _assessDamage(roadBorders) {
        for (const border of roadBorders) {
            if (polyIntersect(this.polygon, border)) {
                return true
            }
        }

        return false
    }

    _createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        // Bottom left corner
        points.push({
            x: this.x - Math.sin(Math.PI + - this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + -this.angle + alpha) * rad
        });
        // Top left corner
        points.push({
            x: this.x - Math.sin(-this.angle - alpha) * rad,
            y: this.y - Math.cos(-this.angle - alpha) * rad
        });
        // Top right corner
        points.push({
            x: this.x - Math.sin(-this.angle + alpha) * rad,
            y: this.y - Math.cos(-this.angle + alpha) * rad
        });
        // Bottom right corner
        points.push({
            x: this.x - Math.sin(Math.PI + -this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + -this.angle - alpha) * rad
        });

        return points;
    }

    _move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed) {
            this.speed = -this.maxSpeed;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;

            if (this.controls.left) {
                this.angle -= 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle += 0.03 * flip;
            }

        }

        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }

    _drawPolygon(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let pointIndex = 1; pointIndex < this.polygon.length; pointIndex++) {
            const point = this.polygon[pointIndex];
            ctx.lineTo(point.x, point.y);
        }
        ctx.fill();
    }

    draw(ctx) {
        if (this.damaged) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'black';
        }

        this._drawPolygon(ctx)
        this.sensor.draw(ctx);
    }
}