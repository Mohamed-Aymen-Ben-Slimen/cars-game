const N = 1;

const carCanvas = document.getElementById('car-canvas');
carCanvas.width = window.innerWidth / 3;

const networkCanvas = document.getElementById('network-canvas');
networkCanvas.width = 2 * window.innerWidth / 3;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road({ x: carCanvas.width / 2, width: carCanvas.width, laneCount: 3 });

const cars = generateCars(N);

const traffic = [
    new Car({ x: road.getLineCenter(0), y: -60, width: 30, height: 50, maxSpeed: 2, color: "blue" }),
    new Car({ x: road.getLineCenter(2), y: -190, width: 30, height: 50, maxSpeed: 2.2, color: "blue" }),
    new Car({ x: road.getLineCenter(2), y: -250, width: 30, height: 50, maxSpeed: 2.2, color: "blue" }),
    new Car({ x: road.getLineCenter(1), y: -380, width: 30, height: 50, maxSpeed: 2.2, color: "blue" }),
    new Car({ x: road.getLineCenter(0), y: -380, width: 30, height: 50, maxSpeed: 2.2, color: "blue" }),
]

let bestCar = cars[0];

if (localStorage.getItem('bestCar')) {
    const bestCarJSON = localStorage.getItem('bestCar');
    const brain = JSON.parse(bestCarJSON);

    cars[0].brain = brain;
    for (let i = 1; i < cars.length; i++) {

        const mutatedBrain = NeuralNetwork.mutate(brain, 0.3);
        cars[i].brain = mutatedBrain;

        if (_.isEqual(mutatedBrain, brain)) {
            console.log("same brain");
        }
    }
}

function generateCars(numberOfCars) {
    const cars = [];
    for (let i = 0; i < numberOfCars; i++) {
        const lane = 1;
        const speed = 3;
        cars.push(new Car({ x: road.getLineCenter(lane), y: 0, width: 30, height: 50, maxSpeed: speed, color: "black", controlActive: true, useBrain: true }));
    }
    return cars;
}

function saveBestCar() {
    const bestCarJSON = JSON.stringify(bestCar.brain);
    localStorage.setItem('bestCar', bestCarJSON);
}

function discardBestCar() {
    localStorage.removeItem('bestCar');
}

function animate(time) {

    for (const car of traffic) {
        car.update({ roadBorders: road.borders });
    }


    for (const car of cars) {
        car.update({ roadBorders: road.borders, traffic: traffic });
    }

    // The car that went the furthest
    bestCar = cars.find(car => Math.min(...cars.map(car => car.y)) == car.y);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height - 100);

    road.draw(carCtx);

    for (const car of traffic) {
        car.draw(carCtx);
    }

    carCtx.globalAlpha = 0.4;
    for (const car of cars) {
        car.draw(carCtx);
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);


    carCtx.restore()

    networkCtx.lineDashOffset = -time / 52;

    NNVisualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}

animate();