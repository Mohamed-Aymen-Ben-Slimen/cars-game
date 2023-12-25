class Sensor {
    constructor({ car, rayCount = 7, rayLength = 100, raySpread = Math.PI / 1.05 }) {
        this.car = car;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.raySpread = raySpread;

        this.rays = [];
        this.readings = [];
    }

    _castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x -
                    Math.sin(rayAngle) * this.rayLength,
                y: this.car.y -
                    Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    update(roadBorders, traffic) {
        this._castRays();

        this.readings = [];
        for (const ray of this.rays) {
            this.readings.push(this._getReading(ray, roadBorders, traffic));
        }
    }

    _getReading(ray, roadBorders, traffic) {
        let intersections = [];

        for (const border of roadBorders) {
            const intersection = getIntersection(ray, border);
            if (intersection) {
                intersections.push(intersection);
            }
        }

        for (const trafficCar of traffic) {
            for (const pointIndex in trafficCar.polygon) {

                const line = [trafficCar.polygon[pointIndex], trafficCar.polygon[(pointIndex + 1) % trafficCar.polygon.length]];

                const intersection = getIntersection(ray, line);
                if (intersection) {
                    intersections.push(intersection);
                }
            }

        }

        if (intersections.length == 0) {
            return null;
        }

        const minOffset = Math.min(...intersections.map(intersection => intersection.offset));
        const minIntersection = intersections.find(intersection => intersection.offset == minOffset);

        return minIntersection;
    }

    draw(ctx) {

        for (const rayIndex in this.rays) {

            const start = this.rays[rayIndex][0];
            const end = this.readings[rayIndex] || this.rays[rayIndex][1];

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.beginPath();
            ctx.setLineDash([20, 2]);
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.setLineDash([20, 2]);
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(this.rays[rayIndex][1].x, this.rays[rayIndex][1].y);
            ctx.stroke();
        }
    }
}