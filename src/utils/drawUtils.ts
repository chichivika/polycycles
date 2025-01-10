import { numsAreZeros, numsAreAlmostEqual } from './appUtils';

// ===========================================================
// Методы для действий с точками, векторами, координатами
// Методы вычисления координат некоторых объектов для рисунков
// ===========================================================

// Координаты точки на плоскости
export type Point = [number, number];
export type Points = Point[];

// Отрезок (задается двумя точками)
export type Segment = [Point, Point];
export type Segments = Segment[];

// Проективные координаты (три числа)
export type ProjectivePoint = [number, number, number];
export type ProjectivePoints = ProjectivePoint[];

// Координаты точки в виде объекта
export type Coordinate = { x: number; y: number };
export type Coordinates = Coordinate[];

// Рассчитать длину вектора
export function getVectorLength(vector: Point) {
    return Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
}

// Рассчитать разницу векторов
export function getDeltaPoints(firstPoint: Point, secondPoint: Point): Point {
    return [secondPoint[0] - firstPoint[0], secondPoint[1] - firstPoint[1]];
}

// Рассчитать сумму векторов
export function getSummPoints(firstPoint: Point, secondPoint: Point): Point {
    return [secondPoint[0] + firstPoint[0], secondPoint[1] + firstPoint[1]];
}

// Рассчитать сумму векторов с коэффициентами
export function getSummPointsWithCoeffs(
    firstPoint: Point,
    secondPoint: Point,
    firstCoeff: number,
    secondCoeff: number,
): Point {
    return [
        firstCoeff * firstPoint[0] + secondCoeff * secondPoint[0],
        firstCoeff * firstPoint[1] + secondCoeff * secondPoint[1],
    ];
}

export function getLinesIntersection(
    firstPoint: Point,
    secondPoint: Point,
    firstVector: Point,
    secondVector: Point,
): Point | null {
    const vectorPoroduct = firstVector[1] * secondVector[0] - secondVector[1] * firstVector[0];
    if (vectorPoroduct < 0.000001 && vectorPoroduct > -0.000001) {
        return null;
    }
    const coeff =
        ((secondPoint[1] - firstPoint[1]) * firstVector[0] -
            (secondPoint[0] - firstPoint[0]) * firstVector[1]) /
        vectorPoroduct;
    return getSummPointsWithCoeffs(secondPoint, secondVector, 1, coeff);
}

// Рассчитать единичный вектор, сонаправленный с разницей двух векторов
export function getOrtDeltaPoints(firstPoint: Point, secondPoint: Point): Point {
    const delta = getDeltaPoints(firstPoint, secondPoint);
    const vectorLength = getVectorLength(delta);
    if (vectorLength === 0) {
        return [0, 0];
    }

    return [delta[0] / vectorLength, delta[1] / vectorLength];
}

export function getVectorPerpendicular(
    vector: Point,
    isPositiveOrientation: boolean = true,
): Point {
    const coeff = isPositiveOrientation ? 1 : -1;
    return [coeff * vector[1], -1 * coeff * vector[0]];
}

// Преобразовать вершины многоугольника в массив отрезков его сторон
export function mapVertsToPolygonEdges(verts: Points): Segments {
    const vertsCount = verts.length;
    if (vertsCount === 0) {
        return [];
    }
    if (vertsCount === 1) {
        const vert = verts[0] as Point;
        return [[vert, vert]];
    }
    const edges: Segments = [];
    for (let i = 0; i < vertsCount - 1; ++i) {
        edges.push([verts[i], verts[i + 1]]);
    }
    edges.push([verts[vertsCount - 1], verts[0]]);
    return edges;
}

// Преобразовать стандартные декартовы координаты точки в координаты окна
export function mapDescartToWindow(point: Point, size: number): Point {
    return [point[0], size - point[1]];
}

// Преобразовать массив стандартных декартовых координат точек в координаты окна
export function mapAllDescartToWindow(points: Points, size: number): Points {
    return points.map((point) => {
        return mapDescartToWindow(point, size);
    });
}

// Преобразовать проективные координаты в декартовы координаты
export function mapProjectiveToDescart(
    // Проективные координаты
    zets: ProjectivePoint,
    // вершины симплекса в стандартных декартовых, либо в window-координатах
    verts: Points,
    // монодромный или нет
    isMonodromic: boolean,
): Point {
    if (isMonodromic) {
        return mapProjectiveToDescartMonodromic(zets, verts);
    }

    return mapProjectiveToDescartNotMonodromic(zets, verts);
}

// Преобразовать проективные координаты в декартовы координаты
// Монодромный случай
export function mapProjectiveToDescartMonodromic(zets: ProjectivePoint, verts: Points): Point {
    const sum = zets.reduce((acc, item) => acc + item, 0);
    if (sum === 0) {
        throw new Error('drawUtils.mapProjectiveToDescart: zero summ of projective coordinates.');
    }

    let x = 0;
    let y = 0;

    for (let i = 0; i < 3; ++i) {
        x += zets[i] * verts[i][0];
        y += zets[i] * verts[i][1];
    }

    return [x / sum, y / sum];
}

// Преобразовать проективные координаты в декартовы координаты
// Немонодромный случай
export function mapProjectiveToDescartNotMonodromic(zets: ProjectivePoint, verts: Points): Point {
    return mapProjectiveToDescartMonodromic([zets[0], zets[1], -zets[2]], verts);
}

// Рассчитать вершины симплекса в окне, учитывая вертикальный отступ от края
export function calcTriangleVertsBySizeAndPadding(size: number, vertPadding: number) {
    const height = size - 2 * vertPadding;
    const edgeSize = (2 / Math.sqrt(3)) * height;

    // in the standard Descartes coordinates
    const descVerts = [
        [size / 2 + edgeSize / 2, size - vertPadding - height],
        [size / 2 - edgeSize / 2, size - vertPadding - height],
        [size / 2, size - vertPadding],
    ] as Points;

    return {
        descart: descVerts,
        window: mapAllDescartToWindow(descVerts, size),
    };
}

// =========================== Triple Polycycle Set ===========================

// Прямая трехкратных предельных циклов в проективных координатах задается уравнением
// (lambda1-1)z1+(lambda2-1)z2+(lambda3-1)z3=0

// Найти точки пересечения прямой трехкратных предельных циклов
// со сторонами симплекса
export function getTripleLineIntersectSidePoint(
    // индекс стороны симплекса
    sideIndex: number,
    // вершины симплекса в window-координатах
    verts: Points,
    // характеристические числа
    nums: number[],
    // монодромный или нет
    isMonodromic: boolean,
): Point | null {
    const zets: ProjectivePoint = [0, 0, 0];
    const rightIndex = (sideIndex + 1) % 3;
    const leftIndex = (sideIndex + 2) % 3;

    zets[leftIndex] = nums[rightIndex] - 1;
    zets[rightIndex] = 1 - nums[leftIndex];

    // Если найденные точки не лежат в симплексе,
    // возаращаем null
    if (isMonodromic && !zetsAreInSimplex(zets)) {
        return null;
    }
    if (!isMonodromic) {
        const reverseZets = [zets[0], zets[1], -zets[2]] as ProjectivePoint;
        if (!zetsAreInSimplex(reverseZets)) {
            return null;
        }
    }

    // Иначе, переводим в декартовые и возвращаем
    return mapProjectiveToDescart(zets, verts, isMonodromic);

    // Проверка, лежат ли точки в симплексе z1>=0,z2>=0,z3>=0
    function zetsAreInSimplex(projectiveZets: ProjectivePoint) {
        if (numsAreZeros(projectiveZets)) {
            return false;
        }

        if (projectiveZets[leftIndex] * projectiveZets[rightIndex] < 0) {
            return false;
        }
        return true;
    }
}

// Поиск двух проективных точек на прямой трехкратных предельных циклов
export function getTripleLineProjectivePoints(nums: number[], isMonodromic: boolean) {
    if (isMonodromic) {
        return getTripleLineMonodromic(nums);
    }
    return getTripleLineNotMonodromic(nums);
}

// Поиск двух проективных точек на прямой трехкратных предельных циклов
// Немонодромный случай
export function getTripleLineNotMonodromic(nums: number[]): ProjectivePoints | null {
    // Если прямая не лежит в нужной карте, рисовать не надо
    if (numsAreAlmostEqual(nums[0], nums[1]) && numsAreAlmostEqual(nums[1], 2 - nums[2])) {
        return null;
    }

    // Ищем ненулевой коэффициент для построения двух точек
    // Если третий коэффициент не ноль
    if (!numsAreAlmostEqual(nums[2], 1)) {
        return getZetsByThird();
    }
    // Иначе если второй коэффициент не ноль
    if (!numsAreAlmostEqual(nums[1], 1)) {
        return [
            [nums[1] - 1, 1 - nums[0], nums[1] - nums[0] - 1],
            [0, 0, 1],
        ];
    }
    // Иначе если первый коэффициент не ноль
    if (!numsAreAlmostEqual(nums[0], 1)) {
        return [
            [0, 0, 1],
            [0, 1, 0],
        ];
    }
    // Здесь мы никогда не должны оказаться, но для красоты пусть возвращает null
    return null;

    // При условии, что третий коэффициент не ноль,
    // выбираем две точки на прямой, сумма координат которых не ноль
    function getZetsByThird(): ProjectivePoints {
        const zets: ProjectivePoint[] = [];
        if (!numsAreAlmostEqual(nums[0] + nums[2], 2)) {
            zets.push([nums[2] - 1, 0, 1 - nums[0]]);
        }
        if (!numsAreAlmostEqual(nums[1] + nums[2], 2)) {
            zets.push([0, nums[2] - 1, 1 - nums[1]]);
        }
        if (zets.length < 2) {
            zets.push([nums[2] - 1, nums[2] - 1, 2 - nums[0] - nums[1]]);
        }
        return zets;
    }
}

// Поиск двух проективных точек на прямой трехкратных предельных циклов
// Монодромный случай
export function getTripleLineMonodromic(nums: number[]): ProjectivePoints | null {
    // Если все числа равны, то прямая не лежит в нужной карте, рисовать не надо
    if (numsAreAlmostEqual(nums[0], nums[1]) && numsAreAlmostEqual(nums[1], nums[2])) {
        return null;
    }
    // Ищем ненулевой коэффициент для построения двух точек
    // Если третий коэффициент не ноль
    if (!numsAreAlmostEqual(nums[2], 1)) {
        return getZetsByThird();
    }
    // Иначе если второй коэффициент не ноль
    if (!numsAreAlmostEqual(nums[1], 1)) {
        return [
            [nums[1] - 1, 1 - nums[0], 1 - nums[1] + nums[0]],
            [0, 0, 1],
        ];
    }
    // Иначе если первый коэффициент не ноль
    if (!numsAreAlmostEqual(nums[0], 1)) {
        return [
            [0, 0, 1],
            [0, 1, 0],
        ];
    }
    // Здесь мы никогда не должны оказаться, но для красоты пусть возвращает null
    return null;

    // При условии, что третий коэффициент не ноль,
    // выбираем две точки на прямой, сумма координат которых не ноль
    function getZetsByThird(): ProjectivePoints {
        const zets: ProjectivePoint[] = [];
        if (!numsAreAlmostEqual(nums[0], nums[2])) {
            zets.push([nums[2] - 1, 0, 1 - nums[0]]);
        }
        if (!numsAreAlmostEqual(nums[1], nums[2])) {
            zets.push([0, nums[2] - 1, 1 - nums[1]]);
        }
        if (zets.length < 2) {
            zets.push([nums[2] - 1, nums[2] - 1, 2 - nums[0] - nums[1]]);
        }
        return zets;
    }
}
