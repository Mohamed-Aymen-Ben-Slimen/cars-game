function lerp(a, b, t) {
    return a + (b - a) * t;
}

function getIntersection(line1, line2) {
    const A = line1[0]
    const B = line1[1]
    const C = line2[0];
    const D = line2[1];

    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}

function getPolyIntersections(poly1, poly2) {
    const intersections = [];

    for (const pointPoly1Index in poly1) {
        for (const pointPoly2Index in poly2) {

            const poly1Line = [poly1[pointPoly1Index], poly1[(pointPoly1Index + 1) % poly1.length]]
            const poly2Line = [poly2[pointPoly2Index], poly2[(pointPoly2Index + 1) % poly2.length]]

            const intersection = getIntersection(poly1Line, poly2Line)
            if (intersection) {
                intersections.push(intersection);
            }
        }
    }

    return intersections;
}

function isPolyIntersect(poly1, poly2) {
    for (const pointPoly1Index in poly1) {
        for (const pointPoly2Index in poly2) {

            const poly1Line = [poly1[pointPoly1Index], poly1[(pointPoly1Index + 1) % poly1.length]]
            const poly2Line = [poly2[pointPoly2Index], poly2[(pointPoly2Index + 1) % poly2.length]]

            const intersection = getIntersection(poly1Line, poly2Line)
            if (intersection) {
                return true;
            }
        }
    }

    return false;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}