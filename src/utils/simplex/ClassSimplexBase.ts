import { Points, ProjectivePoint } from 'utils/drawUtils';
import {
    mapProjectiveToDescart,
    calcTriangleVertsBySizeAndPadding,
    getTripleLineProjectivePoints
} from 'utils/drawUtils';
import { getThirdIndex, numsMulIsUnit } from 'utils/appUtils';
import {
    SimplexEdgesInfo,
    SimplexVertsInfo,
    SimplexTripleSegment,
    SimplexKSetAreasInfo
} from './simplexUtils';

//========================================================
//Класс с методами для рассчета данных отрисовки симплекса
//========================================================

export type ClassParam = {
    //размер рисунка
    size: number,
    //Отступ симплекса от верхнего края рисунка
    paddingTop: number,
    //Характеристические числа
    charNums: number[],
    //Монодромный ли полицикл
    isMonodromic: boolean
}

class ClassSimplexBase {
    //размер рисунка
    protected readonly _size: number;
    //Отступ симплекса от верхнего края рисунка
    protected readonly _paddingTop: number;
    //Характеристические числа
    protected readonly _charNums: number[];
    //Монодромный ли полицикл
    protected readonly _isMonodromic: boolean;
    //Координаты вершин симплекса 
    //(по часовой стрелке, начиная с правой нижней)
    protected readonly _vertices: Points;

    constructor({ size, paddingTop, charNums, isMonodromic }: ClassParam) {

        this._size = size;
        this._paddingTop = paddingTop;
        this._charNums = charNums;
        this._isMonodromic = isMonodromic;

        let oVerts = calcTriangleVertsBySizeAndPadding(this._size, this._paddingTop);
        this._vertices = oVerts.window;
    }

    //===================== PUBLIC ===================================

    //Получить координаты вершин симплекса
    public getVertices(): Points {
        return this._vertices;
    }
    //Получить массив вершин симплекса с дополнительной информацией
    public getVertsInfo():SimplexVertsInfo {
        return this._vertices.map((aVert, i) => {
            return {
                point: aVert,
                inKSet: this.checkVerticeInKSet(i)
            }
        });
    }
    //Получить массив координат сторон симплекса с дополнительной информацией
    public getEdgesInfo(): SimplexEdgesInfo {
        let aVerts = this._vertices;
        let aInfo: SimplexEdgesInfo = [];

        aVerts.forEach((aVert, nInd) => {
            let nSecInd = (nInd + 1)%3;
            let nThirdInd = getThirdIndex(nInd, nSecInd)
            aInfo[nThirdInd] = ({
                points: [aVert, aVerts[nSecInd]],
                inKSet: this.checkEdgeInKSet(nThirdInd)
            });
        });
        return aInfo;
    }
    //Получить области K-множества
    public getKSetAreas(): SimplexKSetAreasInfo {
        if (numsMulIsUnit(this._charNums)) {
            return [this._vertices];
        }
        return [];
    }
    //Проверить, принадлежит ли вершина K-множеству
    public checkVerticeInKSet(i: number): boolean {
        let nFirst = (i + 1) % 3;
        let nSecond = (i + 2) % 3;
        let aNums = this._charNums;

        if ((aNums[nFirst] * aNums[i] - 1) * (aNums[nSecond] * aNums[i] - 1) <= 0 ||
            (aNums[i] - 1) * (aNums[nFirst] * aNums[nSecond] * aNums[i] - 1) <= 0) {
            return true;
        }
        return false;
    }
    //Проверить, принадлежит ли сторона K-множеству
    public checkEdgeInKSet(i: number):boolean {
        let nFirst = (i + 1) % 3;
        let nSecond = (i + 2) % 3;
        let aNums = this._charNums;

        if ((aNums[nFirst] * aNums[nSecond] - 1) * (aNums[nFirst] * aNums[nSecond] * aNums[i] - 1) <= 0) {
            return true;
        }
        return false;
    }
    //Получить две точки для построения прямой трехкратных циклов
    public getTripleCycleLineSegment(): SimplexTripleSegment {
        let aVerts = this._vertices;

        //In projective coordinates
        let aZets = this._getTripleLineProjectivePoints();
        if (aZets === null || aZets.length < 2) {
            return [];
        }

        let [aZets1, aZets2] = aZets;

        let aPoint1 = this._mapProjectiveToDescart(aZets1, aVerts);
        let aPoint2 = this._mapProjectiveToDescart(aZets2, aVerts);
        if (aPoint1[0] === aPoint2[0]) {
            return [
                [aPoint1[0], 0],
                [aPoint1[0], this._size]
            ];
        }

        let nTangent = (aPoint2[1] - aPoint1[1]) / (aPoint2[0] - aPoint1[0]);
        let fnLine = (x: number) => aPoint1[1] + nTangent * (x - aPoint1[0]);

        let aWindowPoint1 = [0, fnLine(0)];
        let aWindowPoint2 = [this._size, fnLine(this._size)];

        return [aWindowPoint1, aWindowPoint2] as Points;
    }

    //===================== PROTECTED ===================================

    //Рассчитать две точки на прямой трехкратных циклов в проективных координатах
    protected _getTripleLineProjectivePoints() {
        let aNums = this._charNums;
        return getTripleLineProjectivePoints(aNums, this._isMonodromic);
    }
    //Преобразовать проективные координаты в декартовы
    protected _mapProjectiveToDescart(aZets1: ProjectivePoint, aVerts: Points) {
        return mapProjectiveToDescart(aZets1, aVerts, this._isMonodromic);
    }
}
export default ClassSimplexBase;