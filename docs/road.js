const INFINITE = 10 ** 5;

class Road {
    constructor({
        x, width, laneCount = 3
    }) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        this.top = -INFINITE;
        this.bottom = INFINITE;

        const topLeft = { x: this.left, y: this.top };
        const topRight = { x: this.right, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };
        const bottomRight = { x: this.right, y: this.bottom };
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ];
    }

    getLineCenter(lane) {
        const laneWidth = this.width / this.laneCount;
        const laneCenter = this.left + (laneWidth / 2) + lane * laneWidth;
        return laneCenter;
    }

    draw(ctx) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';

        for (let i = 1; i < this.laneCount; i++) {
            const x = lerp(this.left, this.right, i / this.laneCount);
            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }
}

