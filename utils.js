function lerp(a, b, t) {
    return a + (b - a) * t;
}

function getIntersection(line1, line2) {
    const x1 = line1[0].x;
    const y1 = line1[0].y;
    const x2 = line1[1].x;
    const y2 = line1[1].y;
    const x3 = line2[0].x;
    const y3 = line2[0].y;
    const x4 = line2[1].x;
    const y4 = line2[1].y;

    const denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));

    if (denominator == 0) {
        return null;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -(((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3))) / denominator;

    if (t > 0 && t < 1 && u > 0) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1),
        };
    } else {
        return null;
    }
}