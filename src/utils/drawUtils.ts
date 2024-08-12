import {numsAreZeros, numsAreAlmostEqual} from './appUtils';

export type Point = [number, number];
export type Points = Point[];
export type Segment = [Point, Point];
export type Segments = Segment[];
export type ProjectivePoint = [number, number, number];
export type ProjectivePoints = ProjectivePoint[];
export type Coordinate = { x: number, y: number };
export type Coordinates = Coordinate[];

//Рассчитать длину вектора
export function getVectorLength(aVector: Point) {
    return Math.sqrt(aVector[0] ** 2 + aVector[1] ** 2);
}
//Рассчитать разницу векторов
export function getDeltaPoints(aFPoint: Point, aSPoint: Point): Point {
    return [aSPoint[0] - aFPoint[0], aSPoint[1] - aFPoint[1]];
}
//Рассчитать сумму векторов
export function getSummPoints(aFPoint: Point, aSPoint: Point): Point {
    return [aSPoint[0] + aFPoint[0], aSPoint[1] + aFPoint[1]];
}
//Рассчитать сумму векторов с коэффициентами
export function getSummPointsWithCoeffs(aFPoint: Point, aSPoint: Point, nFCoeff:number, nSCoeff: number): Point {
    return [nFCoeff*aFPoint[0] + nSCoeff*aSPoint[0], nFCoeff*aFPoint[1]+nSCoeff*aSPoint[1]];
}
//Рассчитать единичный вектор, сонаправленный с разницей двух векторов
export function getOrtDeltaPoints(aFPoint: Point, aSPoint: Point): Point {
    let aDelta = getDeltaPoints(aFPoint, aSPoint);
    let nLength = getVectorLength(aDelta);
    if (nLength === 0) {
        return [0, 0];
    }

    return [aDelta[0] / nLength, aDelta[1] / nLength];
}
//Преобразовать вершины многоугольника в массив отрезков его сторон
export function mapVertsToPolygonEdges(aVerts: Points): Segments {
    let nL = aVerts.length;
    if (nL === 0) {
        return [];
    }
    if (nL === 1) {
        let aVert = aVerts[0] as Point;
        return [[aVert, aVert]];
    }
    let aEdges: Segments = [];
    for (let i = 0; i < nL - 1; ++i) {
        aEdges.push([aVerts[i], aVerts[i + 1]]);
    }
    aEdges.push([aVerts[nL - 1], aVerts[0]]);
    return aEdges;
}
//Преобразовать стандартные декартовы координаты точки в координаты окна
export function mapDescartToWindow(aPoint: Point, nSize: number): Point {
    return [aPoint[0], nSize - aPoint[1]];
}
//Преобразовать массив стандартных декартовых координат точек в координаты окна
export function mapAllDescartToWindow(aPoints: Points, nSize: number): Points {
    return aPoints.map((aPoint => {
        return mapDescartToWindow(aPoint, nSize);
    }));
}
//Преобразовать проективные координаты в декартовы координаты
export function mapProjectiveToDescart(
    //Проективные координаты
    aZets: ProjectivePoint, 
    //вершины симплекса в стандартных декартовых, либо в window-координатах
    aVerts: Points, 
    //монодромный или нет
    isMonodromic: boolean): Point {
    if (isMonodromic) {
        return mapProjectiveToDescartMonodromic(aZets, aVerts);
    }

    return mapProjectiveToDescartNotMonodromic(aZets, aVerts);
}
//Преобразовать проективные координаты в декартовы координаты
//Монодромный случай
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
//Преобразовать проективные координаты в декартовы координаты
//Немонодромный случай
export function mapProjectiveToDescartNotMonodromic(aZets: ProjectivePoint, aVerts: Points): Point {
    aZets = [aZets[0], aZets[1], -aZets[2]];
    return mapProjectiveToDescartMonodromic(aZets, aVerts);
}
//Рассчитать вершины симплекса в окне, учитывая вертикальный отступ от края
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
//=========================== Triple Polycycle Set ===========================

//Найти точки пересечения прямой со сторонами симплекса
export function getTripleLineIntersectSidePoint(
    //индекс стороны симплекса
    nSide: number,
    //вершины симплекса в window-координатах
    aVerts: Points,
    //характеристические числа
    aNums: number[],
    //монодромный или нет
    isMonodromic: boolean
): Point | null {

    let aZets: ProjectivePoint = [0, 0, 0];
    let nR = (nSide + 1) % 3;
    let nL = (nSide + 2) % 3;

    aZets[nL] = aNums[nR] - 1;
    aZets[nR] = 1 - aNums[nL];

    //Если найденные точки не лежат в симплексе,
    //возаращаем null
    if (isMonodromic && !zetsAreInSimplex(aZets)) {
        return null;
    }
    if(!isMonodromic){
        let aReverseZets = [aZets[0], aZets[1], -aZets[2]] as ProjectivePoint;
        if(!zetsAreInSimplex(aReverseZets)){
            return null;
        }
    }

    //Иначе, переводим в декартовые и возвращаем
    return mapProjectiveToDescart(aZets, aVerts, isMonodromic)

    //Проверка, лежат ли точки в симплексе z1>=0,z2>=0,z3>=0
    function zetsAreInSimplex(aZets: ProjectivePoint){
        if (numsAreZeros(aZets)) {
            return false;
        }
    
        if (aZets[nL]*aZets[nR]<0) {
            return false;
        }
        return true;
    }
}
//Поиск двух проективных точек на прямой 
//(lambda1-1)z1+(lambda2-1)z2+(lambda3-1)z3=0
export function getTripleLineProjectivePoints(aNums: number[], isMonodromic: boolean) {
    if (isMonodromic) {
        return getTripleLineMonodromic(aNums);
    }
    return getTripleLineNotMonodromic(aNums);
}
export function getTripleLineNotMonodromic(aNums: number[]): ProjectivePoints | null {

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
            [aNums[1] - 1, 1 - aNums[0], aNums[1] - aNums[0] - 1],
            [0, 0, 1]
        ]);
    }
    //Иначе если первый коэффициент не ноль
    if (!numsAreAlmostEqual(aNums[0], 1)) {
        return (
            [[0, 0, 1], [0, 1, 0]]
        );
    }
    //Здесь мы никогда не должны оказаться, но для красоты пусть возвращает null
    return null;

    //При условии, что третий коэффициент не ноль,
    //выбираем две точки на прямой, сумма координат которых не ноль
    function getZetsByThird(aNums: number[]): ProjectivePoints {
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
            [aNums[1] - 1, 1 - aNums[0], 1 - aNums[1] + aNums[0]],
            [0, 0, 1]
        ]);
    }
    //Иначе если первый коэффициент не ноль
    if (!numsAreAlmostEqual(aNums[0], 1)) {
        return (
            [[0, 0, 1], [0, 1, 0]]
        );
    }
    //Здесь мы никогда не должны оказаться, но для красоты пусть возвращает null
    return null;

    //При условии, что третий коэффициент не ноль,
    //выбираем две точки на прямой, сумма координат которых не ноль
    function getZetsByThird(aNums: number[]): ProjectivePoints {
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