export type Point = [number, number];
export type Points = Point[];
export type ProjectivePoint = [number, number, number];

export const CanvasColors = {
    simplex: 'black',
    tripleCycles: '#00ae00',
    kSet: 'blue'
};
//Descart coordinates of a point to window coordinates
export function mapDescartToWindow(aPoint: Point, nSize: number): Point {
    return [aPoint[0], nSize - aPoint[1]];
}
//Descart coordinates of an array of points to window coordinates
export function mapAllDescartToWindow(aPoints: Points, nSize: number): Points {
    return aPoints.map((aPoint=>{
        return mapDescartToWindow(aPoint, nSize);
    }));
}
//Projective coordinates of a point to descart coordinates
export function mapProjectiveToDescart(aZets: ProjectivePoint, aVerts: Points): Point {

    let nSum = aZets.reduce((acc, item) => acc + item, 0);
    if (nSum === 0) {
        throw (new Error('drawUtils.mapProjectiveToDescart: zero summ of projective coordinates.'));
    }

    let nX = 0;
    let nY = 0;

    for (let i = 0; i < 3; ++i) {
        nX += aZets[i] * aVerts[i][0];
        nY += aZets[i] * aVerts[i][1];
    }

    return [nX / nSum, nY / nSum]
}