import {
    mapAllDescartToWindow,
    Points,
    Point,
    Segment,
    Segments,
    ProjectivePoint,
    getTripleLineIntersectSidePoint,
    getVectorLength,
    mapProjectiveToDescart,
    calcTriangleVertsBySizeAndPadding,
    getDeltaPoints,
    mapVertsToPolygonEdges,
} from '../drawUtils';
import { productNumsFromTo } from '../jsUtils';
import { numsAreDegenerated, numsMulIsUnit, numsAreAlmostEqual, getThirdIndex } from '../appUtils';
import {
    TrapezeInfo,
    AllTrapezesInfo,
    RombSegment,
    RombInfo,
    AllRombsInfo,
    SetInfo,
    EdgesPath,
    SpecialInfo,
    RombCoordinates,
} from './unfoldUtils';

// ========================================================
// Класс с методами для рассчета данных отрисовки развертки
// ========================================================

export type ClassParam = {
    // Размер рисунка
    size: number;
    // Отступ внешнего симплекса от верха
    paddingTop: number;
    // Отступ внутреннего симплекса от внешнего
    innerPadTop: number;
    // Характеристические числа
    charNums: number[];
    // Монодромный ли полицикл
    isMonodromic: boolean;
};

class ClassUnfoldBase {
    // Размер рисунка
    protected readonly _size: number;

    // Отступ внешнего симплекса от верха
    protected readonly _paddingTop: number;

    // Отступ внутреннего симплекса от внешнего
    protected readonly _innerPadding: number;

    // Характеристические числа
    protected readonly _charNums: number[];

    // Монодромный ли полицикл
    protected readonly _isMonodromic: boolean;

    // Равно ли произведение характеристических чисел единице
    protected _numsMulIsUnit: boolean | null = null;

    // Вырождены ли характеристические числа
    protected _numsAreDegenerated: boolean | null = null;

    // Координаты вершин внешнего симплекса
    protected readonly _outerVerts: Points;

    // Координаты вершин внутреннего симплекса
    protected readonly _innerVerts: Points;

    // Длина стороны ромбов, примыкающих к вершинам
    protected readonly _rombusSide: number;

    // Координаты боковых вершин ромбов
    protected readonly _rombusHips: Points[];

    constructor({ size, paddingTop, charNums, innerPadTop, isMonodromic }: ClassParam) {
        this._size = size;
        this._paddingTop = paddingTop;
        this._innerPadding = innerPadTop;
        this._charNums = charNums;
        this._isMonodromic = isMonodromic;

        const outerVerts = calcTriangleVertsBySizeAndPadding(this._size, this._paddingTop);
        this._outerVerts = outerVerts.window;

        this._rombusSide = (2 / Math.sqrt(3)) * this._innerPadding;

        const innerVerts = this._findInnerVerts(outerVerts.descart);
        this._innerVerts = innerVerts.window;

        const rombusHips = this._findRombusHips(outerVerts.descart, innerVerts.descart);
        this._rombusHips = rombusHips.window;
    }

    // ============================= PUBLIC =============================

    // Получить координаты вершин внешнего симплекса
    public getOuterVerts() {
        return this._outerVerts;
    }

    // Получить координаты вершин внутреннего симплекса
    public getInnerVerts() {
        return this._innerVerts;
    }

    // Получить координаты сегментов внутри внешнего симплекса
    public getInnerLines(): Segments {
        const rombHips = this._rombusHips;

        return [
            [rombHips[0][0], rombHips[1][1]],
            [rombHips[1][0], rombHips[2][1]],
            [rombHips[2][0], rombHips[0][1]],
        ];
    }

    // Определить, равно ли произведение характеристических чисел единице
    public getNumsMulIsUnit(): boolean {
        if (typeof this._numsMulIsUnit === 'boolean') {
            return this._numsMulIsUnit;
        }

        const nums = this._charNums;
        this._numsMulIsUnit = numsMulIsUnit(nums);
        return this._numsMulIsUnit;
    }

    // Определить, вырождены ли характеристические числа
    public getNumsAreDegenerated(): boolean {
        if (typeof this._numsAreDegenerated === 'boolean') {
            return this._numsAreDegenerated;
        }

        const nums = this._charNums;
        this._numsAreDegenerated = numsAreDegenerated(nums);
        return this._numsAreDegenerated;
    }

    // Получить объект информации о K-множестве и о множестве
    // трехкратных циклов для отрисовки
    // Для краткости "специальная" информация
    public getSpecialInfo(): SpecialInfo {
        // Если все числа равны 1
        if (this.getNumsAreDegenerated()) {
            return this._getDegenSpecialInfo();
        }

        const info = ClassUnfoldBase.getInitialSpecialInfo();

        const kSetData = this._getKSetData();
        info.kSet.segments = kSetData.segments;
        info.kSet.areas = kSetData.areas;
        info.edgesPath = kSetData.edgesPath;

        info.tripleSet = this.getTripleLineInfo();

        return info;
    }

    // Проверить, является ли набор характеристических чисел типичным
    public getIsTypicalCase() {
        if (this.getNumsAreDegenerated()) {
            return false;
        }
        if (this.getNumsMulIsUnit()) {
            return false;
        }
        for (let i = 0; i < 3; ++i) {
            if (this._checkRombIsDegen(i) || this._checkTrapezeDegen(i)) {
                return false;
            }
        }
        return true;
    }

    // ================================= PROTECTED =================================

    // Рассчитать координаты боковых сторон ромбов
    // Сначала левый бок, затем правый (если смотреть на ромб из центра)
    protected _findRombusHips(descOuters: Points, descInners: Points) {
        const rombSide = this._rombusSide;
        const descartPoints = [
            [
                [descOuters[0][0] - rombSide / 2, descInners[0][1]],
                [descOuters[0][0] - rombSide, descOuters[0][1]],
            ],
            [
                [descOuters[1][0] + rombSide, descOuters[1][1]],
                [descOuters[1][0] + rombSide / 2, descInners[1][1]],
            ],
            [
                [descOuters[2][0] - rombSide / 2, descOuters[2][1] - this._innerPadding],
                [descOuters[2][0] + rombSide / 2, descOuters[2][1] - this._innerPadding],
            ],
        ];

        return {
            descart: descartPoints,
            window: descartPoints.map((point) =>
                mapAllDescartToWindow(point as Points, this._size),
            ),
        };
    }

    // Рассчитать координаты вершин внутреннего симплекса
    protected _findInnerVerts(descOuters: Points) {
        const rombSide = this._rombusSide;
        const descInners = [
            [descOuters[0][0] - (rombSide * 3) / 2, descOuters[0][1] + this._innerPadding],
            [descOuters[1][0] + (rombSide * 3) / 2, descOuters[1][1] + this._innerPadding],
            [descOuters[2][0], descOuters[2][1] - 2 * this._innerPadding],
        ] as Points;

        return {
            descart: descInners,
            window: mapAllDescartToWindow(descInners, this._size),
        };
    }

    // Проверить, является ли ромб вырожденным
    protected _checkRombIsDegen(i: number) {
        const nums = this._charNums;
        return numsAreAlmostEqual(nums[i], 1);
    }

    // Проверить внешнюю сторону ромба на принадлежность K-множеству
    // Вернуть точку на этой стороне для отрисовки в случае успешной проверки
    // Иначе вернуть null
    protected _checkRombSideInKSet(
        // Индекс ромба
        rombIndex: number,
        // 0 - левая сторона, 1 - правая сторона
        sideIndex: number,
    ): Point | null {
        const rightIndex = (rombIndex + 1) % 3;
        const leftIndex = (rombIndex + 2) % 3;

        const trapezeIndex = sideIndex === 0 ? leftIndex : rightIndex;

        const points = this._getKTriplePoints(trapezeIndex, [rightIndex, leftIndex]);
        if (!ClassUnfoldBase._checkTripleIsOrdered(points)) {
            return null;
        }

        const outerVert = this._outerVerts[rombIndex];
        const rombHip = this._rombusHips[rombIndex][sideIndex];

        const deltaVect = getDeltaPoints(outerVert, rombHip);
        const ratio = ClassUnfoldBase._getPointsRatio(points);

        return [outerVert[0] + ratio * deltaVect[0], outerVert[1] + ratio * deltaVect[1]];
    }

    // Получить индексы смежных с тарпецией ромбов
    // Сначала индекс левого, затем правого, если смотреть из центра симплекса
    protected static _getTrapezeSideInds(i: number) {
        return [(i + 1) % 3, (i + 2) % 3];
    }

    // Получить координаты смежных с тарпецией боковых вершин ромбов
    protected _getTrapezeSideRombsHips(i: number) {
        const hips = this._rombusHips;
        const [leftIndex, rightIndex] = ClassUnfoldBase._getTrapezeSideInds(i);
        return [hips[leftIndex], hips[rightIndex]];
    }

    // Получить индексы смежных с ромбов трапеций
    // Сначала индекс левой затем правой, если смотреть из центра симплекса
    protected static _getRombSideInds(i: number) {
        return [(i + 1) % 3, (i + 2) % 3];
    }

    // получить координаты ромба по индексу
    protected _getRombCoordinates(i: number): RombCoordinates {
        const outerVerts = this._outerVerts;
        const innerVerts = this._innerVerts;
        const hips = this._rombusHips[i];

        // объект координат, если смотреть из центра симплекса
        return {
            // вершина
            top: outerVerts[i],
            // низ
            bottom: innerVerts[i],
            // правый бок
            rHip: hips[1],
            // левый бок
            lHip: hips[0],
        };
    }

    // Получить массив координат вершин ромба
    // Сначала top, далее против часовой стрелки
    protected _getRombVerts(i: number): Points {
        const coordinates = this._getRombCoordinates(i);

        return [coordinates.top, coordinates.lHip, coordinates.bottom, coordinates.rHip];
    }

    // Проверить, вырождена ли трапеция
    protected _checkTrapezeDegen(i: number) {
        const [firstIndex, secondIndex] = ClassUnfoldBase._getTrapezeSideInds(i);
        const nums = this._charNums;
        const nMul = nums[firstIndex] * nums[secondIndex];

        return numsAreAlmostEqual(nMul, 1);
    }

    // Получить объект координат трапеции по индексу
    protected _getTrapezeCoordinates(i: number) {
        const aInnerVerts = this._innerVerts;

        const [leftIndex, rightIndex] = ClassUnfoldBase._getTrapezeSideInds(i);
        const [aLeftRomb, aRightRomb] = this._getTrapezeSideRombsHips(i);

        // объект координат, если смотреть из центра симплекса
        return {
            // Правая вершина основания (большей стороны)
            baseR: aRightRomb[0],
            // Левая вершина основания
            baseL: aLeftRomb[1],
            // Правая вершина меньшей стороны
            topR: aInnerVerts[rightIndex],
            // Левая вершина меньшей стороны
            topL: aInnerVerts[leftIndex],
        };
    }

    // Получить массив координат вершин трапеции
    // Сначала baseL, затем против часовой стрелки
    protected _getTrapezeVerts(i: number) {
        const coordinates = this._getTrapezeCoordinates(i);

        return [coordinates.baseL, coordinates.topL, coordinates.topR, coordinates.baseR];
    }

    // Получить, в каком отношении K-линия должна резделить высоту трапеции
    protected _getTrapezeRatio(i: number): number | null {
        const points = this._getKTriplePoints(i, [i]);

        if (!ClassUnfoldBase._checkTripleIsOrdered(points)) {
            return null;
        }

        return ClassUnfoldBase._getPointsRatio(points);
    }

    // Получить отношения длин двух векторов
    protected static _getPointsRatio(points: number[]) {
        return (points[1] - points[0]) / (points[2] - points[0]);
    }

    // Получить специальную информацию в случае вырождения чисел
    protected _getDegenSpecialInfo(): SpecialInfo {
        const info = ClassUnfoldBase.getInitialSpecialInfo();
        info.kSet = {
            segments: this._getDegenKLineSegments(),
            areas: [this._outerVerts],
        };
        return info;
    }

    // Получить информацию о K-множестве для всех трапеций
    protected _getAllTrapezesInfo(): AllTrapezesInfo {
        return [0, 1, 2].map((i) => this._getTrapezeInfo(i));
    }

    // Получить информацию о K-множестве для одной трапеции
    protected _getTrapezeInfo(i: number): TrapezeInfo {
        // Если трапеция вырождена
        if (this._checkTrapezeDegen(i)) {
            return this._getDegenTrapezeInfo(i);
        }
        // Если произведение характеристических чисел равно единице
        if (this.getNumsMulIsUnit()) {
            const trapezeVerts = this._getTrapezeCoordinates(i);
            return [[trapezeVerts.topL, trapezeVerts.topR]];
        }

        // Иначе общий алгоритм
        const ratio = this._getTrapezeRatio(i);
        if (ratio === null) {
            return null;
        }

        const trapezeVerts = this._getTrapezeCoordinates(i);
        const rightOrt = getDeltaPoints(trapezeVerts.baseR, trapezeVerts.topR);
        const leftOrt = getDeltaPoints(trapezeVerts.baseL, trapezeVerts.topL);

        const segment = [
            [
                trapezeVerts.baseL[0] + leftOrt[0] * ratio,
                trapezeVerts.baseL[1] + leftOrt[1] * ratio,
            ],
            [
                trapezeVerts.baseR[0] + rightOrt[0] * ratio,
                trapezeVerts.baseR[1] + rightOrt[1] * ratio,
            ],
        ] as Segment;

        return [segment];
    }

    // Получить информацию о K-множестве для одной трапеции
    // в случае её вырождения
    protected _getDegenTrapezeInfo(i: number): Segments {
        const oTrapeze = this._getTrapezeCoordinates(i);
        const segments = [[oTrapeze.baseL, oTrapeze.baseR]] as Segments;

        if (!this.getNumsMulIsUnit()) {
            return segments;
        }

        const [iLInd, iRInd] = ClassUnfoldBase._getTrapezeSideInds(i);
        const oLRomb = this._getRombCoordinates(iLInd) as RombCoordinates;
        const oRRomb = this._getRombCoordinates(iRInd) as RombCoordinates;

        segments.push([oRRomb.lHip, oRRomb.bottom]);
        segments.push([oTrapeze.topR, oTrapeze.topL]);
        segments.push([oLRomb.bottom, oLRomb.rHip]);

        return segments;
    }

    // Получить информацию о K-множестве для всех ромбов
    protected _getAllRombusKInfo(trapezeInfo: AllTrapezesInfo): AllRombsInfo {
        const aAllInfo: AllRombsInfo = [];

        for (let i = 0; i < 3; ++i) {
            const info = this._getRombusKInfo(trapezeInfo, i);
            aAllInfo.push(info);
        }
        return aAllInfo;
    }

    // Получить пустую информацию о K-множестве для одного ромба
    protected static _getRombEmptyInfo(): RombInfo {
        return {
            middle: false,
            outerSides: [],
            segment: null,
        };
    }

    // Получить информацию о K-множестве для одного ромба
    protected _getRombusKInfo(trapezeInfo: AllTrapezesInfo, i: number): RombInfo {
        const info = ClassUnfoldBase._getRombEmptyInfo();

        if (this._checkRombIsDegen(i)) {
            info.segment = this._getDegenRombusKInfo(trapezeInfo, i);
            return info;
        }
        if (this.getNumsMulIsUnit()) {
            info.segment = this._getRombInfoWhileMulUnit(trapezeInfo, i);
            return info;
        }

        return this._getRombusBaseKInfo(trapezeInfo, i);
    }

    // Получить информацию о K-множестве для одного ромба
    // в случае его вырождения
    protected _getDegenRombusKInfo(trapezeInfo: AllTrapezesInfo, i: number): RombSegment {
        const oRomb = this._getRombCoordinates(i);
        if (this.getNumsMulIsUnit()) {
            return [oRomb.top, oRomb.bottom];
        }

        const [leftIndex, rightIndex] = ClassUnfoldBase._getRombSideInds(i);
        const aRTrapeze = trapezeInfo[rightIndex];
        const aLTrapeze = trapezeInfo[leftIndex];

        if (aRTrapeze !== null) {
            const aSegment = aRTrapeze[0];
            return [oRomb.top, aSegment[0]];
        }
        if (aLTrapeze !== null) {
            const aSegment = aLTrapeze[0];
            return [oRomb.top, aSegment[1]];
        }

        return null;
    }

    // Получить информацию о K-множестве для одного ромба
    // в случае, когда произведение характеристических чисел равно единице
    protected _getRombInfoWhileMulUnit(trapezeInfo: AllTrapezesInfo, i: number): RombSegment {
        const innerVerts = this._innerVerts;

        const aLSegments = this._checkRombSideInKSet(i, 0);
        if (aLSegments !== null) {
            return [aLSegments, innerVerts[i]];
        }
        const aRSegments = this._checkRombSideInKSet(i, 1);
        if (aRSegments !== null) {
            return [aRSegments, innerVerts[i]];
        }
        return null;
    }

    // Получить информацию о K-множестве для одного ромба, стандартный алгоритм
    protected _getRombusBaseKInfo(trapezeInfo: AllTrapezesInfo, i: number): RombInfo {
        const info = ClassUnfoldBase._getRombEmptyInfo();

        // Ромб является промежуточным звеном пути K-линии
        info.middle = true;

        const [leftIndex, rightIndex] = ClassUnfoldBase._getRombSideInds(i);
        const verts: Points = [];

        // Проверяем, есть ли K-линия в смежных с ромбом трапециями
        const aRTrapeze = trapezeInfo[rightIndex] as TrapezeInfo;
        const aLTrapeze = trapezeInfo[leftIndex] as TrapezeInfo;

        if (aRTrapeze !== null) {
            const aFirstSegment = aRTrapeze[0];
            verts.push(aFirstSegment[0]);
        }
        if (aLTrapeze !== null) {
            const aFirstSegment = aLTrapeze[0];
            verts.push(aFirstSegment[1]);
        }
        // Если нашлось две точки, завершаем алгоритм
        if (verts.length === 2) {
            info.segment = verts as Segment;
            return info;
        }

        // Ромб является концом пути K-линии
        info.middle = false;

        // Иначе проверяем внешние стороны ромба на принадлежность K-множеству

        // Проверяем левую внешнюю сторону
        const aLSegment = this._checkRombSideInKSet(i, 0);
        if (aLSegment !== null) {
            info.outerSides.push(leftIndex);
            verts.push(aLSegment);
        }
        // Если нашлось две точки, завершаем алгоритм
        if (verts.length === 2) {
            info.segment = verts as Segment;
            return info;
        }

        // Проверяем правую внешнюю сторону
        const aRSegments = this._checkRombSideInKSet(i, 1);
        if (aRSegments !== null) {
            info.outerSides.push(rightIndex);
            verts.push(aRSegments);
        }
        // Если нашлось две точки, завершаем алгоритм
        if (verts.length === 2) {
            info.segment = verts as Segment;
            return info;
        }

        return info;
    }

    // Получить все вырожденные ромбы
    protected _getAllDegenRombs() {
        const aInds: number[] = [];
        [0, 1, 2].forEach((i) => {
            if (this._checkRombIsDegen(i)) {
                aInds.push(i);
            }
        });
        return aInds;
    }

    // Произведение характеристических чисел от и до с исключением
    protected _productNumsFromTo(nFrom: number, nTo: number, aExcept?: number[]) {
        return productNumsFromTo(this._charNums, nFrom, nTo, aExcept);
    }

    // Преобразование проективных координат в декартовы
    protected _mapProjectiveToDescart(aZets1: ProjectivePoint, verts: Points) {
        return mapProjectiveToDescart(aZets1, verts, this._isMonodromic);
    }

    // Проверить, что тройка чисел упорядочена
    protected static _checkTripleIsOrdered(points: number[]) {
        if (points[0] < points[1] && points[1] < points[2]) {
            return true;
        }
        return false;
    }

    // Получить тройку чисел для проверки на принадлежность K-множеству
    protected _getKTriplePoints(i: number, excepts: number[]) {
        const multiplicate = this._productNumsFromTo.bind(this);
        const nums = this._charNums;

        return [
            0,
            (1 - multiplicate(0, 2, excepts)) / (multiplicate(i, 2, excepts) * (nums[i] - 1)),
            multiplicate(0, i, excepts),
        ];
    }

    // ============ Информация о множестве трехкратных циклов ================

    // Получить точки пересечения прямой трехкратных циклов с внутренним симплексом
    protected _getTripleLineIntersectSide(side: number) {
        return getTripleLineIntersectSidePoint(
            side,
            this._innerVerts,
            this._charNums,
            this._isMonodromic,
        );
    }

    // Получить Информацию о множестве трехкратных циклов в случае вырождения
    protected _getTripleInfoWhileDegen(degenInds: number[]) {
        const info: SetInfo = {
            segments: [],
            areas: [],
        };
        if (degenInds.length === 3) {
            return info;
        }
        const innerVerts = this._innerVerts;

        if (degenInds.length === 2) {
            const firstIndex = degenInds[0];
            const secondIndex = degenInds[1];

            const firstRombVerts = this._getRombVerts(firstIndex);
            const secondRombVerts = this._getRombVerts(secondIndex);
            const trapezeIndex = getThirdIndex(firstIndex, secondIndex);
            const trapezeVerts = this._getTrapezeVerts(trapezeIndex);

            info.areas.push(firstRombVerts, secondRombVerts, trapezeVerts);
            info.segments.push([innerVerts[firstIndex], innerVerts[secondIndex]]);
            return info;
        }

        const firstDegenIndex = degenInds[0];
        const rombVerts = this._getRombVerts(firstDegenIndex);
        const intersects = getTripleLineIntersectSidePoint(
            firstDegenIndex,
            this._innerVerts,
            this._charNums,
            this._isMonodromic,
        );
        if (intersects !== null) {
            info.segments.push([this._innerVerts[firstDegenIndex], intersects]);
            const trapeze = this._getTrapezeCoordinates(firstDegenIndex);
            const delta = getDeltaPoints(trapeze.topL, intersects);
            const side = getDeltaPoints(trapeze.topL, trapeze.topR);
            const ratio = getVectorLength(delta) / getVectorLength(side);
            const vect = getDeltaPoints(trapeze.baseL, trapeze.baseR);
            const trapezePoint = [
                trapeze.baseL[0] + ratio * vect[0],
                trapeze.baseL[1] + ratio * vect[1],
            ] as Point;
            info.segments.push([trapezePoint, intersects]);
            info.areas.push(rombVerts);
        }
        return info;
    }

    // Получить информацию о линии трехкратных циклов
    protected getTripleLineInfo() {
        const info: SetInfo = {
            segments: [],
            areas: [],
        };

        const degenInds = this._getAllDegenRombs();
        if (degenInds.length > 0) {
            return this._getTripleInfoWhileDegen(degenInds);
        }

        const intersections: Points = [];
        const trapezeSegments: Segments = [];
        [0, 1, 2].forEach((i) => {
            const intersect = getTripleLineIntersectSidePoint(
                i,
                this._innerVerts,
                this._charNums,
                this._isMonodromic,
            );
            if (intersect !== null) {
                intersections.push(intersect);

                const trapeze = this._getTrapezeCoordinates(i);
                const delta = getDeltaPoints(trapeze.topL, intersect);
                const side = getDeltaPoints(trapeze.topL, trapeze.topR);
                const ratio = getVectorLength(delta) / getVectorLength(side);
                const vect = getDeltaPoints(trapeze.baseL, trapeze.baseR);
                const trapezePoint = [
                    trapeze.baseL[0] + ratio * vect[0],
                    trapeze.baseL[1] + ratio * vect[1],
                ] as Point;
                trapezeSegments.push([trapezePoint, intersect]);
            }
        });
        if (intersections.length === 2) {
            info.segments.push(intersections as Segment);
            info.segments = info.segments.concat(trapezeSegments);
        }

        return info;
    }

    // ==================== Информация о K-множестве ========================

    // Получить путь K-линии вдоль симплекса
    protected _getEdgePath(allTrapezesInfo: AllTrapezesInfo, rombInfo: AllRombsInfo): EdgesPath {
        const path = new Set<number>();
        const pockets: boolean[] = [false, false, false];

        for (let i = 0; i < 3; ++i) {
            const info = rombInfo[i];
            if (info.segment === null) {
                continue;
            }

            const [leftIndex, rightIndex] = ClassUnfoldBase._getRombSideInds(i);
            if (!info.middle) {
                info.outerSides.forEach((side) => {
                    path.add(side);
                    if (
                        allTrapezesInfo[side] !== null &&
                        this._getTripleLineIntersectSide(side) !== null
                    ) {
                        pockets[side] = true;
                    }
                });
            } else {
                path.add(leftIndex);
                path.add(rightIndex);
            }
            if (allTrapezesInfo[rightIndex] === null) {
                continue;
            }

            path.add(rightIndex);
        }

        const pathData: EdgesPath = Array.from(path).map((side) => {
            return {
                edgeIndex: side,
                hasPocket: pockets[side],
            };
        });
        return pathData;
    }

    // Получить все данные о K-множестве
    protected _getKSetData() {
        const allTrapezesInfo = this._getAllTrapezesInfo();
        const rombInfo = this._getAllRombusKInfo(allTrapezesInfo);

        let edgesPath: EdgesPath = [];
        if (this.getIsTypicalCase()) {
            edgesPath = this._getEdgePath(allTrapezesInfo, rombInfo);
        }

        const rombSegments: Segments = [];
        rombInfo.forEach((info) => {
            if (info.segment === null) {
                return;
            }
            rombSegments.push(info.segment as Segment);
        });

        let segments: Segments = [];
        const fillPolygons: Points[] = [];
        if (this.getNumsMulIsUnit()) {
            fillPolygons.push(this._innerVerts);
        }

        allTrapezesInfo.forEach((trapezeInfo: TrapezeInfo) => {
            if (trapezeInfo === null) {
                return;
            }
            if (trapezeInfo.length === 4) {
                fillPolygons.push(trapezeInfo.map((info: Segment) => info[0]));
            }
            segments = segments.concat(trapezeInfo);
        });

        return {
            // Путь вдоль ребер симплекса
            edgesPath,
            // Сегменты для отрисовки ломаной
            segments: segments.concat(rombSegments),
            // Области для закрашивания
            areas: fillPolygons,
        };
    }

    // Получить сегменты K-линии в случае вырождения
    protected _getDegenKLineSegments(): Segments {
        const outerVerts = this._outerVerts;

        let segments = mapVertsToPolygonEdges(outerVerts);
        segments = segments.concat(this.getInnerLines());
        return segments;
    }

    // Получить пустой объект информации о K-множестве
    // и множестве трехкратных циклов
    static getInitialSpecialInfo(): SpecialInfo {
        return {
            kSet: {
                segments: [],
                areas: [],
            },
            tripleSet: {
                segments: [],
                areas: [],
            },
            edgesPath: [],
        };
    }
}
export default ClassUnfoldBase;
