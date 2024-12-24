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
const nRadiusRatio = 1 / 4;
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

    constructor(oParam: MyParam) {
        this._size = oParam.size;
        this.cx = oParam.size / 2;
        this.cy = oParam.size / 2;

        this.radius = this._size / 3;
        this._isInnerPath = oParam.isInnerPath;

        this._radRatio = this._getPathRadiusRatio();
        this._pathRadius = this.radius + this._radRatio * this.radius;
        this._lPoints = this._findLPoints();

        const aPath = oParam.path;
        // Если ориентация пути отрицательна, переворачиваем массив
        // Таким образом, далее работаем только с положительной ориентацией
        const bPosOrientation = this._getIsPosOrientation(aPath);
        if (!bPosOrientation) {
            aPath.reverse();
        }
        this._path = aPath;
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
        const aPath = this._path;
        const nLength = aPath.length;

        const nRatio = this._radRatio;
        const nPathRadius = this._pathRadius;

        let aArcs: string[] = [];
        for (let i = 0; i < nLength; ++i) {
            const oEdgeData = aPath[i];
            const nEdgeIndex = oEdgeData.edgeIndex;
            const aLPoint = this._lPoints[nEdgeIndex];
            const aDelta = this._getCirclePerpAt(aLPoint);

            // Координаты начала куска арки
            const aPathPoint = getSummPointsWithCoeffs(this._getCenter(), aDelta, 1, 1 + nRatio);

            // Если мы в начале или конце пути, следует отрисовать окончание арки
            if (i === 0 || i === nLength - 1) {
                const aPocketArcs = oEdgeData.hasPocket
                    ? this._getPocketArcs(oEdgeData, i === 0)
                    : this._getNotPocketArcs(oEdgeData, i === 0, aPathPoint);
                aArcs = aArcs.concat(aPocketArcs);
            }
            // Если конец пути, завершаем цикл
            if (i === nLength - 1) {
                break;
            }

            // Иначе высчитываем следующую точку и формируем настройки арки
            const oNextEdgeData = aPath[i + 1];
            const nNextEdgeIndex = oNextEdgeData.edgeIndex;
            const oNext = this._lPoints[nNextEdgeIndex] as Point;
            const aNextDelta = this._getCirclePerpAt(oNext);

            const oNextPath = getSummPointsWithCoeffs(this._getCenter(), aNextDelta, 1, 1 + nRatio);
            aArcs.push(
                `M${aPathPoint[0]} ${aPathPoint[1]} A${nPathRadius} ${nPathRadius}
                 0 0 0 ${oNextPath[0]} ${oNextPath[1]}`,
            );
        }

        return aArcs;
    }

    // Рассчитать массив строк для отрисовки конца K-линии при наличии кармана
    protected _getPocketArcs(oEdgeData: EdgePath, bStart: boolean): string[] {
        const nRatio = this._radRatio;
        const nEdgeIndex = oEdgeData.edgeIndex;
        const aLPoint = this._lPoints[nEdgeIndex];
        const aDelta = this._getCirclePerpAt(aLPoint);
        const aPathPoint = getSummPointsWithCoeffs(aLPoint, aDelta, 1, nRatio);

        const aArcs: string[] = [];
        const aVect = getDeltaPoints(aLPoint, aPathPoint);
        const bPosRotation = (bStart && this._isInnerPath) || (!bStart && !this._isInnerPath);
        const aRotated = ClassDiagram._rotateOnAngle(aVect, (Math.PI * 3) / 4, !bPosRotation);
        const nVectLength = nRatio * this.radius;
        const aCaspPoint = getSummPoints(aLPoint, aRotated);
        const bSweep = bPosRotation ? 0 : 1;
        aArcs.push(
            `M${aPathPoint[0]} ${aPathPoint[1]} A ${nVectLength} ${nVectLength}
             0 0 ${bSweep} ${aCaspPoint[0]} ${aCaspPoint[1]}`,
        );

        const aPerpVect = ClassDiagram._rotateOnAngle(aVect, Math.PI * 0.51, !bPosRotation);
        const aPerpPoint = getSummPoints(aLPoint, aPerpVect);
        aArcs.push(
            `M ${aCaspPoint[0]} ${aCaspPoint[1]} Q ${aPerpPoint[0]} ${aPerpPoint[1]}
             ${aLPoint[0]} ${aLPoint[1]}`,
        );
        return aArcs;
    }

    // Рассчитать массив строк для отрисовки конца K-линии при отсутствии кармана
    protected _getNotPocketArcs(oEdgeData: EdgePath, bStart: boolean, aPathPoint: Point): string[] {
        const nEdgeIndex = oEdgeData.edgeIndex;
        const aLPoint = this._lPoints[nEdgeIndex];

        return [`M${aLPoint[0]} ${aLPoint[1]} L ${aPathPoint[0]} ${aPathPoint[1]}`];
    }

    // Получить координаты центра круга
    protected _getCenter(): Point {
        return [this.cx, this.cy];
    }

    // Повернуть вектор на заданный угол
    protected static _rotateOnAngle(
        // Координаты вектора
        aPoint: Point,
        // Угол поворота в радианах
        nAngle: number,
        // Поворачивать ли против часовой стрелки
        bPos: boolean,
    ): Point {
        const nCos = Math.cos(nAngle);
        const nSin = Math.sin(nAngle);
        const nCoef = bPos ? 1 : -1;
        return [
            nCos * aPoint[0] - nCoef * nSin * aPoint[1],
            nCoef * nSin * aPoint[0] + nCos * aPoint[1],
        ];
    }

    // Найти координаты SL-точек (петель) на круге
    protected _findSLPoints() {
        const nX = this.cx;
        const nY = this.cy;
        const nR = this.radius;

        const aDots: Points = [
            [nX + (nR * Math.sqrt(3)) / 2, nY + nR / 2],
            [nX - (nR * Math.sqrt(3)) / 2, nY + nR / 2],
            [nX, nY - nR],
        ];

        return aDots;
    }

    // Найти координаты L-точек (лунок) на круге
    protected _findLPoints() {
        const nX = this.cx;
        const nY = this.cy;
        const nR = this.radius;

        const aDots: Points = [
            [nX - (nR * Math.sqrt(3)) / 2, nY - nR / 2],
            [nX + (nR * Math.sqrt(3)) / 2, nY - nR / 2],
            [nX, nY + nR],
        ];

        return aDots;
    }

    // Проверить, является ли ориентация пути положительной
    protected _getIsPosOrientation(aPath: EdgesPath) {
        if (aPath.length < 2) {
            return true;
        }
        const oEdgeData = aPath[0];
        const nEdgeIndex = oEdgeData.edgeIndex;
        const aLPoint = this._lPoints[nEdgeIndex];
        const aDelta = this._getCirclePerpAt(aLPoint);

        const oNextEdgeData = aPath[1];
        const nNextEdgeIndex = oNextEdgeData.edgeIndex;
        const oNext = this._lPoints[nNextEdgeIndex] as Point;
        const aNextDelta = this._getCirclePerpAt(oNext);

        return aDelta[0] * aNextDelta[1] - aDelta[1] * aNextDelta[0] < 0;
    }

    // Получить часть круга, которую следует прибавить
    // для рассчета радиуса K-линии
    protected _getPathRadiusRatio() {
        if (!this._isInnerPath) {
            return nRadiusRatio;
        }
        return -nRadiusRatio;
    }

    // Получить перпендикуляр к кругу в заданной точке
    protected _getCirclePerpAt(aPoint: Point) {
        const nX = this.cx;
        const nY = this.cy;

        return getDeltaPoints([nX, nY], aPoint);
    }
}

export default ClassDiagram;
