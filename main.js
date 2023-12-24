const canvas = document.getElementById('canvas');
canvas.width = 400;

const ctx = canvas.getContext('2d');

const road = new Road({ x: canvas.width / 2, width: canvas.width, laneCount: 3 });

const car = new Car({ x: road.getLineCenter(1), y: 100, width: 30, height: 50 });
car.draw(ctx);

function animate() {
    car.update({ roadBorders: road.borders });

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height / 2);

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore()
    requestAnimationFrame(animate);
}

animate();