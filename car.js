class Car {
    constructor(
        {
            x = 0,
            y = 0,
            width = 100,
            height = 100,
            maxSpeed = 3,
            controlActive = false,
            color = 'black',
            useBrain = false
        }
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.speed = 0;
        this.acceleration = 0.1;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        this.angle = 0;

        this.controls = new Controls(controlActive);
        this.useBrain = useBrain;

        if (controlActive) {
            this.sensor = new Sensor({ car: this });
            this.brain = new NeuralNetwork({
                inputCount: this.sensor.rayCount,
                outputCount: 4,
                hiddenLayerCount: 1,
                hiddenLayerNeuronCount: 4
            });
        }

        this.polygon = this._createPolygon();

        this.damaged = false;

    }

    update({ roadBorders, traffic = [] }) {
        if (!this.damaged) {
            this._move();
            this.polygon = this._createPolygon(roadBorders);
            this.damaged = this._assessDamage(roadBorders, traffic);
        }

        if (this.sensor) {
            this.sensor?.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(reading => reading ? 1 / reading.offset : 0);

            const outputs = NeuralNetwork.feedForward({ network: this.brain, inputs: offsets });

            if (this.useBrain) {
                this.controls.forward = outputs[0] > 0.5;
                this.controls.reverse = outputs[1] > 0.5;
                this.controls.left = outputs[2] > 0.5;
                this.controls.right = outputs[3] > 0.5;
            }
        }


    }

    _assessDamage(roadBorders, traffic) {
        for (const border of roadBorders) {
            if (isPolyIntersect(this.polygon, border)) {
                return true
            }
        }

        for (const trafficCar of traffic) {
            if (isPolyIntersect(this.polygon, trafficCar.polygon)) {
                return true
            }
        }

        return false
    }

    _createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
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
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }

        }

        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }

    _drawPolygon(ctx) {
        if (this.damaged) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let pointIndex = 1; pointIndex < this.polygon.length; pointIndex++) {
            const point = this.polygon[pointIndex];
            ctx.lineTo(point.x, point.y);
        }
        ctx.fill();
    }

    draw(ctx, drawSensors = false) {
        this._drawPolygon(ctx)
        if (drawSensors) {
            this.sensor?.draw(ctx);
        }
    }
}