export type Point = [number, number];
export type Points = Point[];
export type ProjectivePoint = [number, number, number];
export type Coordinate = {x: number, y: number};
export type Coordinates = Coordinate[];

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
export function mapProjectiveToDescart(aZets: ProjectivePoint, aVerts: Points, isMonodromic: boolean): Point {
    if(isMonodromic){
        return mapProjectiveToDescartMonodromic(aZets, aVerts);
    }

    return mapProjectiveToDescartNotMonodromic(aZets, aVerts);
}
export function mapProjectiveToDescartMonodromic(aZets: ProjectivePoint, aVerts: Points): Point {

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
export function mapProjectiveToDescartNotMonodromic(aZets: ProjectivePoint, aVerts: Points): Point {
    aZets = [-aZets[0], aZets[1], aZets[2]];
    return mapProjectiveToDescartMonodromic(aZets, aVerts);
}
export function calcTriangleVertsBySizeAndPadding(nSize: number, nVertPad:number) {

    let nHeight = nSize - 2 * nVertPad;
    let nEdgeSize = (2 / Math.sqrt(3)) * nHeight;

    //in the standard Descartes coordinates
    let aDescVerts = [[
        nSize / 2 + nEdgeSize / 2,
        nSize - nVertPad - nHeight
    ], [
        nSize / 2 - nEdgeSize / 2,
        nSize - nVertPad - nHeight
    ], [
        nSize / 2,
        nSize - nVertPad
    ]] as Points;

    return {
        descart: aDescVerts,
        window:  mapAllDescartToWindow(aDescVerts, nSize)
    };
}
export function getVectorLength(aVector: Point){
    return Math.sqrt(aVector[0]**2+aVector[1]**2);
}
export function getDeltaPoints(aFPoint:Point, aSPoint:Point):Point{
    return [aSPoint[0]-aFPoint[0], aSPoint[1]-aFPoint[1]];
}
export function getOrtDeltaPoints(aFPoint:Point, aSPoint:Point):Point{
    let aDelta = getDeltaPoints(aFPoint,aSPoint);
    let nLength = getVectorLength(aDelta);
    if(nLength === 0){
        return [0,0];
    }

    return [aDelta[0]/nLength,aDelta[1]/nLength];
}