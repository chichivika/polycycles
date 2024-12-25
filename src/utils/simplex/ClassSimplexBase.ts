import {
    Points,
    ProjectivePoint,
    mapProjectiveToDescart,
    calcTriangleVertsBySizeAndPadding,
    getTripleLineProjectivePoints,
} from '../drawUtils';
import { getThirdIndex, numsMulIsUnit } from '../appUtils';
import {
    SimplexEdgesInfo,
    SimplexVertsInfo,
    SimplexTripleSegment,
    SimplexKSetAreasInfo,
} from './simplexUtils';

// ========================================================
// Класс с методами для рассчета данных отрисовки симплекса
// ========================================================

export type ClassParam = {
    // размер рисунка
    size: number;
    // Отступ симплекса от верхнего края рисунка
    paddingTop: number;
    // Характеристические числа
    charNums: number[];
    // Монодромный ли полицикл
    isMonodromic: boolean;
};

class ClassSimplexBase {
    // размер рисунка
    protected readonly _size: number;

    // Отступ симплекса от верхнего края рисунка
    protected readonly _paddingTop: number;

    // Характеристические числа
    protected readonly _charNums: number[];

    // Монодромный ли полицикл
    protected readonly _isMonodromic: boolean;

    // Координаты вершин симплекса
    // (по часовой стрелке, начиная с правой нижней)
    protected readonly _vertices: Points;

    constructor({ size, paddingTop, charNums, isMonodromic }: ClassParam) {
        this._size = size;
        this._paddingTop = paddingTop;
        this._charNums = charNums;
        this._isMonodromic = isMonodromic;

        const verts = calcTriangleVertsBySizeAndPadding(this._size, this._paddingTop);
        this._vertices = verts.window;
    }

    // ===================== PUBLIC ===================================

    // Получить координаты вершин симплекса
    public getVertices(): Points {
        return this._vertices;
    }

    // Получить массив вершин симплекса с дополнительной информацией
    public getVertsInfo(): SimplexVertsInfo {
        return this._vertices.map((vert, i) => {
            return {
                point: vert,
                inKSet: this.checkVerticeInKSet(i),
            };
        });
    }

    // Получить массив координат сторон симплекса с дополнительной информацией
    public getEdgesInfo(): SimplexEdgesInfo {
        const verts = this._vertices;
        const info: SimplexEdgesInfo = [];

        verts.forEach((vert, nInd) => {
            const secondIndex = (nInd + 1) % 3;
            const thirdIndex = getThirdIndex(nInd, secondIndex);
            info[thirdIndex] = {
                points: [vert, verts[secondIndex]],
                inKSet: this.checkEdgeInKSet(thirdIndex),
            };
        });
        return info;
    }

    // Получить области K-множества
    public getKSetAreas(): SimplexKSetAreasInfo {
        if (numsMulIsUnit(this._charNums)) {
            return [this._vertices];
        }
        return [];
    }

    // Проверить, принадлежит ли вершина K-множеству
    public checkVerticeInKSet(i: number): boolean {
        const firstIndex = (i + 1) % 3;
        const secondIndex = (i + 2) % 3;
        const nums = this._charNums;

        if (
            (nums[firstIndex] * nums[i] - 1) * (nums[secondIndex] * nums[i] - 1) <= 0 ||
            (nums[i] - 1) * (nums[firstIndex] * nums[secondIndex] * nums[i] - 1) <= 0
        ) {
            return true;
        }
        return false;
    }

    // Проверить, принадлежит ли сторона K-множеству
    public checkEdgeInKSet(i: number): boolean {
        const firstIndex = (i + 1) % 3;
        const secondIndex = (i + 2) % 3;
        const nums = this._charNums;

        if (
            (nums[firstIndex] * nums[secondIndex] - 1) *
                (nums[firstIndex] * nums[secondIndex] * nums[i] - 1) <=
            0
        ) {
            return true;
        }
        return false;
    }

    // Получить две точки для построения прямой трехкратных циклов
    public getTripleCycleLineSegment(): SimplexTripleSegment {
        const verts = this._vertices;

        // In projective coordinates
        const zets = this._getTripleLineProjectivePoints();
        if (zets === null || zets.length < 2) {
            return [];
        }

        const [zets1, zets2] = zets;

        const point1 = this._mapProjectiveToDescart(zets1, verts);
        const point2 = this._mapProjectiveToDescart(zets2, verts);
        if (point1[0] === point2[0]) {
            return [
                [point1[0], 0],
                [point1[0], this._size],
            ];
        }

        const tangent = (point2[1] - point1[1]) / (point2[0] - point1[0]);
        const getSecondCoordinate = (x: number) => point1[1] + tangent * (x - point1[0]);

        const windowPoint1 = [0, getSecondCoordinate(0)];
        const windowPoint2 = [this._size, getSecondCoordinate(this._size)];

        return [windowPoint1, windowPoint2] as Points;
    }

    // ===================== PROTECTED ===================================

    // Рассчитать две точки на прямой трехкратных циклов в проективных координатах
    protected _getTripleLineProjectivePoints() {
        const nums = this._charNums;
        return getTripleLineProjectivePoints(nums, this._isMonodromic);
    }

    // Преобразовать проективные координаты в декартовы
    protected _mapProjectiveToDescart(zets1: ProjectivePoint, verts: Points) {
        return mapProjectiveToDescart(zets1, verts, this._isMonodromic);
    }
}
export default ClassSimplexBase;
