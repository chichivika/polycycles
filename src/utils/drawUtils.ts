import { numsAreAlmostEqual} from "./jsUtils";

export type Point = [number, number];
export type Points = Point[];
export type Segment = [Point, Point];
export type Segments = Segment[];
export type ProjectivePoint = [number, number, number];
export type ProjectivePoints = ProjectivePoint[];
export type Coordinate = { x: number, y: number };
export type Coordinates = Coordinate[];

export function mapVertsToPolygonEdges(aVerts: Points):Segments{
    let nL = aVerts.length;
    if(nL === 0 ){
        return [];
    }
    if(nL === 1 ){
        let aVert = aVerts[0] as Point;
        return [[aVert, aVert]];
    }
    let aEdges: Segments = [];
    for(let i=0;i<nL-1;++i){
        aEdges.push([aVerts[i], aVerts[i+1]]);
    }
    aEdges.push([aVerts[nL-1], aVerts[0]]);
    return aEdges;
}
//Descart coordinates of a point to window coordinates
export function mapDescartToWindow(aPoint: Point, nSize: number): Point {
    return [aPoint[0], nSize - aPoint[1]];
}
//Descart coordinates of an array of points to window coordinates
export function mapAllDescartToWindow(aPoints: Points, nSize: number): Points {
    return aPoints.map((aPoint => {
        return mapDescartToWindow(aPoint, nSize);
    }));
}
//Projective coordinates of a point to descart coordinates
export function mapProjectiveToDescart(aZets: ProjectivePoint, aVerts: Points, isMonodromic: boolean): Point {
    if (isMonodromic) {
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
    aZets = [aZets[0], aZets[1], -aZets[2]];
    return mapProjectiveToDescartMonodromic(aZets, aVerts);
}
export function calcTriangleVertsBySizeAndPadding(nSize: number, nVertPad: number) {

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
        window: mapAllDescartToWindow(aDescVerts, nSize)
    };
}
export function getVectorLength(aVector: Point) {
    return Math.sqrt(aVector[0] ** 2 + aVector[1] ** 2);
}
export function getDeltaPoints(aFPoint: Point, aSPoint: Point): Point {
    return [aSPoint[0] - aFPoint[0], aSPoint[1] - aFPoint[1]];
}
export function getOrtDeltaPoints(aFPoint: Point, aSPoint: Point): Point {
    let aDelta = getDeltaPoints(aFPoint, aSPoint);
    let nLength = getVectorLength(aDelta);
    if (nLength === 0) {
        return [0, 0];
    }

    return [aDelta[0] / nLength, aDelta[1] / nLength];
}
//Поиск двух проективных точек на прямой 
//(lambda1-1)z1+(lambda2-1)z2+(lambda3-1)z3=0
export function getTripleLineProjectivePoints(aNums: number[], isMonodromic: boolean) {
    if (isMonodromic) {
        return getTripleLineMonodromic(aNums);
    }
    return getTripleLineNotMonodromic(aNums);
}
export function getTripleLineNotMonodromic(aNums: number[]):ProjectivePoints | null {

    //Если прямая не лежит в нужной карте, рисовать не надо
    if (numsAreAlmostEqual(aNums[0], aNums[1]) && numsAreAlmostEqual(aNums[1], 2 - aNums[2])) {
        return null;
    }

    //Ищем ненулевой коэффициент для построения двух точек
    //Если третий коэффициент не ноль
    if (!numsAreAlmostEqual(aNums[2], 1)) {
        return getZetsByThird(aNums);
    }
    //Иначе если второй коэффициент не ноль
    if (!numsAreAlmostEqual(aNums[1], 1)) {
        return ([
            [aNums[1]-1, 1 - aNums[0], aNums[1]-aNums[0]-1],
            [0,0,1]
        ]);
    }
    //Иначе если первый коэффициент не ноль
    if (!numsAreAlmostEqual(aNums[0], 1)) {
        return (
            [[0,0,1], [0,1,0]]
        );
    }
    //Здесь мы никогда не должны оказаться, но для красоты пусть возвращает null
    return null;

    //При условии, что третий коэффициент не ноль,
    //выбираем две точки на прямой, сумма координат которых не ноль
    function getZetsByThird(aNums: number[]) :ProjectivePoints{
        let aZets: ProjectivePoint[] = [];
        if (!numsAreAlmostEqual(aNums[0] + aNums[2], 2)) {
            aZets.push([aNums[2] - 1, 0, 1 - aNums[0]]);
        }
        if (!numsAreAlmostEqual(aNums[1] + aNums[2], 2)) {
            aZets.push([0, aNums[2] - 1, 1 - aNums[1]]);
        }
        if (aZets.length < 2) {
            aZets.push([aNums[2] - 1, aNums[2] - 1, 2 - aNums[0] - aNums[1]]);
        }
        return aZets;
    }
}
export function getTripleLineMonodromic(aNums: number[]): ProjectivePoints | null {

    //Если все числа равны, то прямая не лежит в нужной карте, рисовать не надо
    if (numsAreAlmostEqual(aNums[0], aNums[1]) && numsAreAlmostEqual(aNums[1], aNums[2])) {
        return null;
    }
    //Ищем ненулевой коэффициент для построения двух точек
    //Если третий коэффициент не ноль
    if (!numsAreAlmostEqual(aNums[2], 1)) {
        return getZetsByThird(aNums);
    }
    //Иначе если второй коэффициент не ноль
    if (!numsAreAlmostEqual(aNums[1], 1)) {
        return ([
            [aNums[1]-1, 1 - aNums[0], 1-aNums[1]+aNums[0]],
            [0,0,1]
        ]);
    }
    //Иначе если первый коэффициент не ноль
    if (!numsAreAlmostEqual(aNums[0], 1)) {
        return (
            [[0,0,1], [0,1,0]]
        );
    }
    //Здесь мы никогда не должны оказаться, но для красоты пусть возвращает null
    return null;

    //При условии, что третий коэффициент не ноль,
    //выбираем две точки на прямой, сумма координат которых не ноль
    function getZetsByThird(aNums: number[]) :ProjectivePoints{
        let aZets: ProjectivePoint[] = [];
        if (!numsAreAlmostEqual(aNums[0], aNums[2])) {
            aZets.push([aNums[2] - 1, 0, 1 - aNums[0]]);
        }
        if (!numsAreAlmostEqual(aNums[1], aNums[2])) {
            aZets.push([0, aNums[2] - 1, 1 - aNums[1]]);
        }
        if (aZets.length < 2) {
            aZets.push([aNums[2] - 1, aNums[2] - 1, 2 - aNums[0] - aNums[1]]);
        }
        return aZets;
    }
}