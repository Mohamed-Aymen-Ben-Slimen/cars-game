class Sensor {
    constructor({ car, rayCount = 10, rayLength = 100, raySpread = Math.PI / 1.05 }) {
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
            const angle = lerp(this.raySpread / 2, -this.raySpread / 2, i / (this.rayCount - 1));

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: start.x + Math.sin(this.car.angle + angle) * this.rayLength,
                y: start.y - Math.cos(this.car.angle + angle) * this.rayLength,
            };

            this.rays.push([start, end]);
        }
    }

    update(roadBorders) {
        this._castRays();

        this.readings = [];
        for (const ray of this.rays) {
            this.readings.push(this._getReading(ray, roadBorders));
        }
    }

    _getReading(ray, roadBorders) {
        let intersections = [];

        for (const border of roadBorders) {
            const intersection = getIntersection(ray, border);
            if (intersection) {
                intersections.push(intersection);
            }
        }

        if (intersections.length == 0) {
            return null;
        }

        const sortedIntersections = intersections.sort((a, b) => {
            const distanceA = getDistance(ray[0], a);
            const distanceB = getDistance(ray[0], b);
            return distanceA - distanceB;
        });

        return sortedIntersections[0];
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
            ctx.strokeStyle = 'grey';
            ctx.beginPath();
            ctx.setLineDash([20, 2]);
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(this.rays[rayIndex][1].x, this.rays[rayIndex][1].y);
            ctx.stroke();
        }
    }
}