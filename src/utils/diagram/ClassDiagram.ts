/* eslint-disable @typescript-eslint/no-unused-vars */
import { EdgePath, EdgesPath } from '../unfold/unfoldUtils';
import {
    Point,
    Points,
    getDeltaPoints,
    getSummPointsWithCoeffs,
    getSummPoints,
    getVectorPerpendicular,
    getOrtDeltaPoints,
    getLinesIntersection,
} from '../drawUtils';

// =============================================
// Класс для построения бифуркационной диаграммы
// =============================================

type MyParam = {
    // Путь из рёбер симплекса, который проходит прямая из K-множества
    path: EdgesPath;
    // Размер рисунка
    size: number;
    // Следует ли рисовать K-линию внутри круга
    isInnerPath: boolean;
};

// Какую чать от радиуса круга следует прибавить/вычесть (isInnerPath=false/true),
// чтобы получить радиус K-линии
const radiusRatio = 1 / 4;
class ClassDiagram {
    // координата х центра круга
    public readonly cx: number;

    // координата y центра круга
    public readonly cy: number;

    // радиус круга
    public readonly radius: number;

    // Путь из рёбер симплекса, который проходит прямая из K-множества
    protected readonly _path: EdgesPath;

    // Следует ли рисовать K-линию внутри круга
    protected readonly _isInnerPath: boolean;

    // Размер рисунка
    protected readonly _size: number;

    // Какую чать от радиуса круга следует прибавить чтобы получить радиус K-линии
    // Положительна при isInnerPath = false, отрицательна при isInnerPath = true
    protected readonly _radRatio: number;

    // Радиус K-линии
    protected readonly _pathRadius: number;

    // Координаты L-точек (лунки) на круге
    protected readonly _lPoints: Points;

    constructor(param: MyParam) {
        const { path, size } = param;

        this._size = size;
        this.cx = size / 2;
        this.cy = size / 2;

        this.radius = size / 3;
        this._isInnerPath = param.isInnerPath;

        this._radRatio = this._getPathRadiusRatio();
        this._pathRadius = this.radius + this._radRatio * this.radius;
        this._lPoints = this._findLPoints();

        // Если ориентация пути отрицательна, переворачиваем массив
        // Таким образом, далее работаем только с положительной ориентацией
        const isPosOrientation = this._getIsPosOrientation(path);
        if (!isPosOrientation) {
            path.reverse();
        }
        this._path = path;
    }

    // =========================== PUBLIC =======================================
    // Получить координаты L-точек (лунок) на круге
    public getLPoints() {
        return this._lPoints;
    }

    // Получить координаты SL-точек (петель) на круге
    public getSLPoints() {
        return this._findSLPoints();
    }

    // Получить массив строк для отрисовки кусков K-линии
    public getPathArcs() {
        if (this._path.length < 2) {
            return [];
        }

        return this._findPathArcs();
    }

    // ============================= PROTECTED ==================================

    // Рассчитать массив строк для отрисовки кусков K-линии
    protected _findPathArcs() {
        const path = this._path;
        const pathLength = path.length;

        let arcs: string[] = [];
        for (let i = 0; i < pathLength; ++i) {
            const edgeData = path[i];
            if (i === 0) {
                arcs = arcs.concat(this._getStartPathArcs(edgeData));
                continue;
            }
            if (i === pathLength - 1) {
                arcs = arcs.concat(this._getEndPathArcs(edgeData));
                break;
            }
            arcs = arcs.concat(this._getMiddlePathArcs(edgeData));
        }

        return arcs;
    }

    protected _getStartPathArcs(edgeData: EdgePath) {
        if (edgeData.hasPocket) {
            return this._getEdgePathArcWithPocket(edgeData, true);
        }

        return this._getEdgePathArcWithoutPocket(edgeData, true);
    }

    protected _getEndPathArcs(edgeData: EdgePath) {
        if (edgeData.hasPocket) {
            return this._getEdgePathArcWithPocket(edgeData, false);
        }

        return this._getEdgePathArcWithoutPocket(edgeData, false);
    }

    // Рассчитать массив строк для отрисовки куска K-линии при отсутствии кармана
    protected _getEdgePathArcWithoutPocket(edgeData: EdgePath, isStart: boolean) {
        const angle = Math.PI / 3;
        const fullCurveAngle = angle / 2;
        const controlAngle = fullCurveAngle / 2;

        const pathPoint = this._getPathPointByEdgeData(edgeData);
        const endPathPoint = this._rotatePointAroundCenter(pathPoint, angle, !isStart);
        const curveStart = this._lPoints[edgeData.edgeIndex];
        const curveEnd = this._rotatePointAroundCenter(pathPoint, fullCurveAngle, !isStart);

        const rotatedMiddle = this._rotatePointAroundCenter(curveStart, controlAngle, !isStart);
        const ortMiddle = getOrtDeltaPoints(this._getCenter(), rotatedMiddle);
        const curveMiddle = getSummPointsWithCoeffs(
            this._getCenter(),
            ortMiddle,
            1,
            this.radius * (1 + this._radRatio * 0.5),
        );

        const middleTangent = ClassDiagram._rotateOnAngle(
            ortMiddle,
            Math.PI / 6,
            this._isInnerPath === isStart,
        );
        const controlPoint1 = getLinesIntersection(
            curveStart,
            curveMiddle,
            getVectorPerpendicular(getDeltaPoints(this._getCenter(), curveStart)),
            middleTangent,
        );
        const controlPoint2 = getLinesIntersection(
            curveMiddle,
            curveEnd,
            middleTangent,
            getVectorPerpendicular(getDeltaPoints(this._getCenter(), curveEnd)),
        );

        if (controlPoint1 === null || controlPoint2 === null) {
            return this._getMiddlePathArcFromTo(pathPoint, endPathPoint);
        }

        const arcs: string[] = [];
        arcs.push(`M${curveStart[0]},${curveStart[1]} Q${controlPoint1[0]},${controlPoint1[1]}
            ${curveMiddle[0]}, ${curveMiddle[1]} Q${controlPoint2[0]},${controlPoint2[1]}
            ${curveEnd[0]} ${curveEnd[1]}`);
        if (isStart) {
            arcs.push(this._getMiddlePathArcFromTo(curveEnd, endPathPoint));
        } else {
            arcs.push(this._getMiddlePathArcFromTo(endPathPoint, curveEnd));
        }
        return arcs;
    }

    // Рассчитать массив строк для отрисовки куска K-линии при наличии кармана
    protected _getEdgePathArcWithPocket(edgeData: EdgePath, isStart: boolean) {
        let arcs: string[] = [];
        const pathPoint = this._getPathPointByEdgeData(edgeData);

        arcs = arcs.concat(this._getPocketArcs(edgeData, isStart));
        const endPathPoint = this._rotatePointAroundCenter(pathPoint, Math.PI / 3, !isStart);

        const middlePath: Points = [pathPoint, endPathPoint];
        if (!isStart) {
            middlePath.reverse();
        }
        arcs.push(this._getMiddlePathArcFromTo(middlePath[0], middlePath[1]));

        return arcs;
    }

    protected _getMiddlePathArcs(edgeData: EdgePath) {
        const centerPathPoint = this._getPathPointByEdgeData(edgeData);
        const leftPathPoint = this._rotatePointAroundCenter(centerPathPoint, Math.PI / 3, true);
        const rightPathPoint = this._rotatePointAroundCenter(centerPathPoint, Math.PI / 3, false);
        return this._getMiddlePathArcFromTo(leftPathPoint, rightPathPoint);
    }

    protected _getPathPointByEdgeData(edgeData: EdgePath) {
        const { edgeIndex } = edgeData;
        const lPoint = this._lPoints[edgeIndex];
        const deltaPoints = this._getCirclePerpAt(lPoint);

        return getSummPointsWithCoeffs(this._getCenter(), deltaPoints, 1, 1 + this._radRatio);
    }

    protected _getMiddlePathArcFromTo(startPoint: Point, endPoint: Point): string {
        const pathRadius = this._pathRadius;
        return `M${startPoint[0]} ${startPoint[1]} A${pathRadius} ${pathRadius}
                 0 0 0 ${endPoint[0]} ${endPoint[1]}`;
    }

    // Отрисовка кармана
    protected _getPocketArcs(edgeData: EdgePath, isStart: boolean): string[] {
        const ratio = this._radRatio;
        const { edgeIndex } = edgeData;
        const lPoint = this._lPoints[edgeIndex];
        const delta = this._getCirclePerpAt(lPoint);
        const pathPoint = getSummPointsWithCoeffs(lPoint, delta, 1, ratio);

        const arcs: string[] = [];
        const vect = getDeltaPoints(lPoint, pathPoint);
        const isPosRotation = (isStart && this._isInnerPath) || (!isStart && !this._isInnerPath);
        const rotatedVector = ClassDiagram._rotateOnAngle(vect, (Math.PI * 3) / 4, !isPosRotation);
        const vectLength = ratio * this.radius;
        const caspPoint = getSummPoints(lPoint, rotatedVector);
        const isSweep = isPosRotation ? 0 : 1;
        arcs.push(
            `M${pathPoint[0]} ${pathPoint[1]} A ${vectLength} ${vectLength}
             0 0 ${isSweep} ${caspPoint[0]} ${caspPoint[1]}`,
        );

        const perpVect = ClassDiagram._rotateOnAngle(vect, Math.PI * 0.51, !isPosRotation);
        const perpPoint = getSummPoints(lPoint, perpVect);
        arcs.push(
            `M ${caspPoint[0]} ${caspPoint[1]} Q ${perpPoint[0]} ${perpPoint[1]}
             ${lPoint[0]} ${lPoint[1]}`,
        );
        return arcs;
    }

    // Получить координаты центра круга
    protected _getCenter(): Point {
        return [this.cx, this.cy];
    }

    // Повернуть вектор на заданный угол
    protected static _rotateOnAngle(
        // Координаты вектора
        vect: Point,
        // Угол поворота в радианах
        angle: number,
        // Поворачивать ли против часовой стрелки
        isPos: boolean,
    ): Point {
        const nCos = Math.cos(angle);
        const nSin = Math.sin(angle);
        const nCoef = isPos ? 1 : -1;
        return [nCos * vect[0] - nCoef * nSin * vect[1], nCoef * nSin * vect[0] + nCos * vect[1]];
    }

    // Повернуть вектор на заданный угол относительно центра диаграммы
    protected _rotatePointAroundCenter(
        // Координаты вектора
        vect: Point,
        // Угол поворота в радианах
        angle: number,
        // Поворачивать ли против часовой стрелки
        isPos: boolean,
    ): Point {
        const center = this._getCenter();
        const delta = getDeltaPoints(center, vect);
        const rotatedDelta = ClassDiagram._rotateOnAngle(delta, angle, isPos);
        return getSummPoints(center, rotatedDelta);
    }

    // Найти координаты SL-точек (петель) на круге
    protected _findSLPoints() {
        const { cx, cy, radius } = this;

        const dots: Points = [
            [cx + (radius * Math.sqrt(3)) / 2, cy + radius / 2],
            [cx - (radius * Math.sqrt(3)) / 2, cy + radius / 2],
            [cx, cy - radius],
        ];

        return dots;
    }

    // Найти координаты L-точек (лунок) на круге
    protected _findLPoints() {
        const { cx, cy, radius } = this;

        const dots: Points = [
            [cx - (radius * Math.sqrt(3)) / 2, cy - radius / 2],
            [cx + (radius * Math.sqrt(3)) / 2, cy - radius / 2],
            [cx, cy + radius],
        ];

        return dots;
    }

    // Проверить, является ли ориентация пути положительной
    protected _getIsPosOrientation(path: EdgesPath) {
        if (path.length < 2) {
            return true;
        }
        const edgeData = path[0];
        const { edgeIndex } = edgeData;
        const lPoint = this._lPoints[edgeIndex];
        const delta = this._getCirclePerpAt(lPoint);

        const nextEdgeData = path[1];
        const nextEdgeIndex = nextEdgeData.edgeIndex;
        const nextLPoint = this._lPoints[nextEdgeIndex] as Point;
        const nextDelta = this._getCirclePerpAt(nextLPoint);

        return delta[0] * nextDelta[1] - delta[1] * nextDelta[0] < 0;
    }

    // Получить часть круга, которую следует прибавить
    // для рассчета радиуса K-линии
    protected _getPathRadiusRatio() {
        if (!this._isInnerPath) {
            return radiusRatio;
        }
        return -radiusRatio;
    }

    // Получить перпендикуляр к кругу в заданной точке
    protected _getCirclePerpAt(point: Point) {
        const { cx, cy } = this;

        return getDeltaPoints([cx, cy], point);
    }
}

export default ClassDiagram;
