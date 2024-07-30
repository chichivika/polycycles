import { Points, ProjectivePoint } from './drawUtils';
import { mapAllDescartToWindow, mapProjectiveToDescart } from './drawUtils';

type ClassParam = {
    size: number,
    paddingTop: number,
    charNums: number[]
}

class SimplexUtils {
    size: number;
    paddingTop: number;
    charNums: number[];
    _descartVerts: Points;
    _vertices: Points;

    constructor({ size, paddingTop, charNums }: ClassParam) {

        this.size = size;
        this.paddingTop = paddingTop;
        this.charNums = charNums;
        
        let oVerts = this._findTriangleVerticies();
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

        if ((aNums[nFirst] * aNums[i] - 1) * (aNums[nSecond] * aNums[i] - 1) < 0 ||
            (aNums[i] - 1) * (aNums[nFirst] * aNums[nSecond] * aNums[i] - 1) < 0) {
            return true;
        }
        return false;
    }
    checkEdgeInKSet(i: number) {
        let nFirst = (i + 1) % 3;
        let nSecond = (i + 2) % 3;
        let aNums = this.charNums;

        if ((aNums[nFirst] * aNums[nSecond] - 1) * (aNums[nFirst] * aNums[nSecond] * aNums[i] - 1) < 0) {
            return true;
        }
        return false;
    }
    getTripleCycleLineSegment() {
        let aNums = this.charNums;
        let aVerts = this._vertices;

        //In projective coordinates
        let aZets: ProjectivePoint[] = [];
        if(aNums[0] !== aNums[2]){
            aZets.push([aNums[2] - 1, 0, 1 - aNums[0]]);
        }
        if(aNums[1] !== aNums[2]){
            aZets.push([0, aNums[2] - 1, 1 - aNums[1]]);
        }
        if(aZets.length < 2){
            aZets.push([aNums[2] - 1, aNums[2] - 1, 2 - aNums[0] - aNums[1]]);
        }
        let [aZets1, aZets2] = aZets;

        let aPoint1 = mapProjectiveToDescart(aZets1, aVerts);
        let aPoint2 = mapProjectiveToDescart(aZets2, aVerts);
        if (aPoint1[0] === aPoint2[0]) {
            return [
                [aPoint1[0],0],
                [aPoint1[0], this.size]
            ];
        }

        let nTangent = (aPoint2[1] - aPoint1[1]) / (aPoint2[0] - aPoint1[0]);
        let fnLine = (x: number) => aPoint1[1] + nTangent * (x - aPoint1[0]);

        let aWindowPoint1 = [0, fnLine(0)];
        let aWindowPoint2 = [this.size, fnLine(this.size)];

        return [aWindowPoint1, aWindowPoint2];
    }
    _findTriangleVerticies() {
        let nSize = this.size;
        let nVertPad = this.paddingTop;

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
            window:  mapAllDescartToWindow(aDescVerts, nSize)
        };
    }
}

export default SimplexUtils;