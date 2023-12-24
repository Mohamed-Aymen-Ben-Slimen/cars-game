const canvas = document.getElementById('canvas');
canvas.width = 400;

const ctx = canvas.getContext('2d');

const road = new Road({ x: canvas.width / 2, width: canvas.width, laneCount: 3 });

const car = new Car({ x: road.getLineCenter(1), y: 0, width: 30, height: 50, controlActive: true });

const traffic = [
    new Car({ x: road.getLineCenter(0), y: -60, width: 30, height: 50, maxSpeed: 2, color: "blue" }),
    new Car({ x: road.getLineCenter(1), y: -80, width: 30, height: 50, maxSpeed: 2.2, color: "blue" }),
    new Car({ x: road.getLineCenter(2), y: -70, width: 30, height: 50, maxSpeed: 2.4, color: "blue" }),
    new Car({ x: road.getLineCenter(0), y: -120, width: 30, height: 50, maxSpeed: 2, color: "blue" }),
    new Car({ x: road.getLineCenter(1), y: -90, width: 30, height: 50, maxSpeed: 2, color: "blue" }),
    new Car({ x: road.getLineCenter(2), y: -190, width: 30, height: 50, maxSpeed: 2.1, color: "blue" }),
]

function animate() {

    for (const car of traffic) {
        car.update({ roadBorders: road.borders });
    }

    car.update({ roadBorders: road.borders, traffic });

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height - 100);

    road.draw(ctx);

    for (const car of traffic) {
        car.draw(ctx);
    }

    car.draw(ctx);

    ctx.restore()
    requestAnimationFrame(animate);
}

animate();