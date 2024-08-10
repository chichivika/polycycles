import { EdgePath, EdgesPath } from "utils/unfold/unfoldUtils"
import { getSummPoints, Point, Points } from "utils/drawUtils";
import { getDeltaPoints, getSummPointsWithCoeffs } from "utils/drawUtils";

type MyParam = {
    path: EdgesPath,
    size: number,
    isInnerPath: boolean
};

const nRadiusRatio = 1 / 4;

class ClassDiagram {
    public readonly cx: number;
    public readonly cy: number;
    public readonly radius: number;

    protected readonly _path: EdgesPath;
    protected readonly _isInnerPath: boolean;
    protected readonly _size: number;
    protected readonly _radRatio: number;
    protected readonly _pathRadius: number;
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

        let aPath = oParam.path;
        let bPosOrientation = this._getIsPosOrientation(aPath);
        if (!bPosOrientation) {
            aPath = aPath.reverse();
        }
        this._path = aPath;
    }
    //=========================== PUBLIC =======================================
    public getLPoints() {
        return this._lPoints;
    }
    public getSLPoints() {
        return this._findSLPoints();
    }
    public getPathArcs() {
        if (this._path.length < 2) return [];

        return this._findPathArcs();
    }
    //============================= PROTECTED ==================================
    protected _findPathArcs() {
        let aPath = this._path;
        let nLength = aPath.length;

        let nRatio = this._radRatio;
        let nPathRadius = this._pathRadius;

        let aArcs: string[] = [];
        for (let i = 0; i < nLength; ++i) {

            let oEdgeData = aPath[i];
            let nEdgeIndex = oEdgeData.edgeIndex;
            let aLPoint = this._lPoints[nEdgeIndex];
            let aDelta = this._getCirclePerpAt(aLPoint);
        
            let aPathPoint = getSummPointsWithCoeffs(this._getCenter(), aDelta, 1, 1+nRatio);

            if (i === 0 || i === nLength - 1) {
                let aPocketArcs = oEdgeData.hasPocket ? 
                    this._getPocketArcs(oEdgeData, i===0) : this._getNotPocketArcs(oEdgeData, i===0, aPathPoint);
                aArcs = aArcs.concat(aPocketArcs);
            }
            if(i === nLength - 1) break;

            let oNextEdgeData = aPath[i + 1];
            let nNextEdgeIndex = oNextEdgeData.edgeIndex;
            let oNext = this._lPoints[nNextEdgeIndex] as Point;
            let aNextDelta = this._getCirclePerpAt(oNext);

            let oNextPath = getSummPointsWithCoeffs(this._getCenter(), aNextDelta, 1, 1+nRatio);

            aArcs.push(`M${aPathPoint[0]} ${aPathPoint[1]} A${nPathRadius} ${nPathRadius} 0 0 0 ${oNextPath[0]} ${oNextPath[1]}`);
        }

        return aArcs;
    }
    protected _getCenter():Point{
        return [this.cx,this.cy];
    }
    protected _getPocketArcs(oEdgeData: EdgePath, bStart: boolean): string[] {
        let nRatio = this._radRatio;
        let nEdgeIndex = oEdgeData.edgeIndex;
        let aLPoint = this._lPoints[nEdgeIndex];
        let aDelta = this._getCirclePerpAt(aLPoint);
        let aPathPoint = getSummPointsWithCoeffs(aLPoint, aDelta, 1, nRatio);

        let aArcs: string[] = [];
        let aVect = getDeltaPoints(aLPoint, aPathPoint);
        let bPosRotation = (bStart && this._isInnerPath) || (!bStart && !this._isInnerPath);
        let aRotated = this._rotateOnAngle(aVect, Math.PI*3/4, !bPosRotation);
        let nVectLength = nRatio*this.radius;
        let aCaspPoint = getSummPoints(aLPoint, aRotated);
        let bSweep = bPosRotation ? 0:1;
        aArcs.push(`M${aPathPoint[0]} ${aPathPoint[1]} A ${nVectLength} ${nVectLength} 0 0 ${bSweep} ${aCaspPoint[0]} ${aCaspPoint[1]}`);

        let aPerpVect = this._rotateOnAngle(aVect, Math.PI*(0.51), !bPosRotation);
        let aPerpPoint =  getSummPoints(aLPoint, aPerpVect);
        aArcs.push(`M ${aCaspPoint[0]} ${aCaspPoint[1]} Q ${aPerpPoint[0]} ${aPerpPoint[1]} ${aLPoint[0]} ${aLPoint[1]}`);
        return aArcs;
    }
    protected _getNotPocketArcs(oEdgeData: EdgePath, bStart: boolean, aPathPoint: Point): string[] {
        let nEdgeIndex = oEdgeData.edgeIndex;
        let aLPoint = this._lPoints[nEdgeIndex];

        return [`M${aLPoint[0]} ${aLPoint[1]} L ${aPathPoint[0]} ${aPathPoint[1]}`];
    }
    protected _rotateOnAngle(aPoint: Point, nAngle: number, bPos: boolean):Point{
        let nCos = Math.cos(nAngle);
        let nSin = Math.sin(nAngle);
        let nCoef = bPos? 1: -1;
        return [
            nCos*aPoint[0]-nCoef*nSin*aPoint[1],
            nCoef*nSin*aPoint[0]+nCos*aPoint[1]
        ];
    }
    protected _findSLPoints() {
        let nX = this.cx;
        let nY = this.cy;
        let nR = this.radius;

        let aDots: Points = [
            [nX + nR * Math.sqrt(3) / 2, nY + nR / 2],
            [nX - nR * Math.sqrt(3) / 2, nY + nR / 2],
            [nX, nY - nR]
        ];

        return aDots;
    }
    protected _findLPoints() {
        let nX = this.cx;
        let nY = this.cy;
        let nR = this.radius;

        let aDots: Points = [
            [nX - nR * Math.sqrt(3) / 2, nY - nR / 2],
            [nX + nR * Math.sqrt(3) / 2, nY - nR / 2],
            [nX, nY + nR]
        ];

        return aDots;
    }
    protected _getIsPosOrientation(aPath: EdgesPath) {
        if (aPath.length < 2) {
            return true;
        }
        let oEdgeData = aPath[0];
        let nEdgeIndex = oEdgeData.edgeIndex;
        let aLPoint = this._lPoints[nEdgeIndex];
        let aDelta = this._getCirclePerpAt(aLPoint);

        let oNextEdgeData = aPath[1];
        let nNextEdgeIndex = oNextEdgeData.edgeIndex;
        let oNext = this._lPoints[nNextEdgeIndex] as Point;
        let aNextDelta = this._getCirclePerpAt(oNext);

        return (aDelta[0] * aNextDelta[1] - aDelta[1] * aNextDelta[0] < 0);
    }
    protected _getPathRadiusRatio() {
        if (!this._isInnerPath) {
            return nRadiusRatio;
        }
        return -nRadiusRatio;
    }
    protected _getCirclePerpAt(aPoint: Point) {
        let nX = this.cx;
        let nY = this.cy;

        return getDeltaPoints([nX, nY], aPoint);
    }
}

export default ClassDiagram;