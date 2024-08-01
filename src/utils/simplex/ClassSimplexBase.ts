import { Points, ProjectivePoint } from 'utils/drawUtils';
import {
    mapProjectiveToDescart,
    calcTriangleVertsBySizeAndPadding,
    getTripleLineProjectivePoints
} from 'utils/drawUtils';

export type ClassParam = {
    size: number,
    paddingTop: number,
    charNums: number[],
    isMonodromic: boolean
}

class ClassSimplexBase {
    size: number;
    paddingTop: number;
    charNums: number[];
    isMonodromic: boolean;
    _descartVerts: Points;
    _vertices: Points;

    constructor({ size, paddingTop, charNums, isMonodromic }: ClassParam) {

        this.size = size;
        this.paddingTop = paddingTop;
        this.charNums = charNums;
        this.isMonodromic = isMonodromic;

        let oVerts = calcTriangleVertsBySizeAndPadding(this.size, this.paddingTop);
        this._descartVerts = oVerts.descart;
        this._vertices = oVerts.window;
    }
    getVertices() {
        return this._vertices;
    }
    checkVerticeInKSet(i: number) {
        let nFirst = (i + 1) % 3;
        let nSecond = (i + 2) % 3;
        let aNums = this.charNums;

        if ((aNums[nFirst] * aNums[i] - 1) * (aNums[nSecond] * aNums[i] - 1) <= 0 ||
            (aNums[i] - 1) * (aNums[nFirst] * aNums[nSecond] * aNums[i] - 1) <= 0) {
            return true;
        }
        return false;
    }
    checkEdgeInKSet(i: number) {
        let nFirst = (i + 1) % 3;
        let nSecond = (i + 2) % 3;
        let aNums = this.charNums;

        if ((aNums[nFirst] * aNums[nSecond] - 1) * (aNums[nFirst] * aNums[nSecond] * aNums[i] - 1) <= 0) {
            return true;
        }
        return false;
    }
    getTripleCycleLineSegment() {
        let aVerts = this._vertices;

        //In projective coordinates
        let aZets = this._getTripleLineProjectivePoints();
        if (aZets ===null || aZets.length < 2) {
            return null;
        }

        let [aZets1, aZets2] = aZets;

        let aPoint1 = this._mapProjectiveToDescart(aZets1, aVerts);
        let aPoint2 = this._mapProjectiveToDescart(aZets2, aVerts);
        if (aPoint1[0] === aPoint2[0]) {
            return [
                [aPoint1[0], 0],
                [aPoint1[0], this.size]
            ];
        }

        let nTangent = (aPoint2[1] - aPoint1[1]) / (aPoint2[0] - aPoint1[0]);
        let fnLine = (x: number) => aPoint1[1] + nTangent * (x - aPoint1[0]);

        let aWindowPoint1 = [0, fnLine(0)];
        let aWindowPoint2 = [this.size, fnLine(this.size)];

        return [aWindowPoint1, aWindowPoint2];
    }
    _getTripleLineProjectivePoints() {
        let aNums = this.charNums;
        return getTripleLineProjectivePoints(aNums, this.isMonodromic);
    }
    _mapProjectiveToDescart(aZets1: ProjectivePoint, aVerts: Points) {
        return mapProjectiveToDescart(aZets1, aVerts, this.isMonodromic);
    }
}
export default ClassSimplexBase;