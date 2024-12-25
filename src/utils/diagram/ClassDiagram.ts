import { EdgePath, EdgesPath } from '../unfold/unfoldUtils';
import {
    Point,
    Points,
    getDeltaPoints,
    getSummPointsWithCoeffs,
    getSummPoints,
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

        const ratio = this._radRatio;
        const pathRadius = this._pathRadius;

        let arcs: string[] = [];
        for (let i = 0; i < pathLength; ++i) {
            const edgeData = path[i];
            const { edgeIndex } = edgeData;
            const lPoint = this._lPoints[edgeIndex];
            const deltaPoints = this._getCirclePerpAt(lPoint);

            // Координаты начала куска арки
            const pathPoint = getSummPointsWithCoeffs(this._getCenter(), deltaPoints, 1, 1 + ratio);

            // Если мы в начале или конце пути, следует отрисовать окончание арки
            if (i === 0 || i === pathLength - 1) {
                const pocketArcs = edgeData.hasPocket
                    ? this._getPocketArcs(edgeData, i === 0)
                    : this._getNotPocketArcs(edgeData, i === 0, pathPoint);
                arcs = arcs.concat(pocketArcs);
            }
            // Если конец пути, завершаем цикл
            if (i === pathLength - 1) {
                break;
            }

            // Иначе высчитываем следующую точку и формируем настройки арки
            const nextEdgeData = path[i + 1];
            const nextEdgeIndex = nextEdgeData.edgeIndex;
            const nextPoint = this._lPoints[nextEdgeIndex] as Point;
            const nextDelta = this._getCirclePerpAt(nextPoint);

            const nextPath = getSummPointsWithCoeffs(this._getCenter(), nextDelta, 1, 1 + ratio);
            arcs.push(
                `M${pathPoint[0]} ${pathPoint[1]} A${pathRadius} ${pathRadius}
                 0 0 0 ${nextPath[0]} ${nextPath[1]}`,
            );
        }

        return arcs;
    }

    // Рассчитать массив строк для отрисовки конца K-линии при наличии кармана
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

    // Рассчитать массив строк для отрисовки конца K-линии при отсутствии кармана
    protected _getNotPocketArcs(edgeData: EdgePath, isStart: boolean, pathPoint: Point): string[] {
        const { edgeIndex } = edgeData;
        const lPoint = this._lPoints[edgeIndex];

        return [`M${lPoint[0]} ${lPoint[1]} L ${pathPoint[0]} ${pathPoint[1]}`];
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
