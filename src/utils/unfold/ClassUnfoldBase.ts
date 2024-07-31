import { mapAllDescartToWindow, Points, Point, ProjectivePoint } from 'utils/drawUtils';
import { mapProjectiveToDescartMonodromic, calcTriangleVertsBySizeAndPadding, getDeltaPoints } from 'utils/drawUtils';
import {productNumsFromTo} from 'utils/appUtils';

export type ClassParam = {
    size: number,
    paddingTop: number,
    innerPadTop: number,
    charNums: number[]
}
export type SegmentInfo = Point | null;
export type SegmentsInfo = SegmentInfo[];

class ClassUnfoldBase {
    size: number;
    paddingTop: number;
    innerPadding: number;
    charNums: number[];
    _outerVerts: Points;
    _innerVerts: Points;
    _rombusSide: number;
    _rombusHips: Points[];

    constructor({ size, paddingTop, charNums, innerPadTop }: ClassParam) {

        this.size = size;
        this.paddingTop = paddingTop;
        this.innerPadding = innerPadTop;
        this.charNums = charNums;

        let oOuterVerts = calcTriangleVertsBySizeAndPadding(this.size, this.paddingTop);
        this._outerVerts = oOuterVerts.window;

        this._rombusSide = (2 / Math.sqrt(3)) * this.innerPadding;

        let oInnerVerts = this.findInnerVerts(oOuterVerts.descart);
        this._innerVerts = oInnerVerts.window;

        let oRombusHips = this.findRombusHips(oOuterVerts.descart, oInnerVerts.descart);
        this._rombusHips = oRombusHips.window;
    }
    getOuterVerts() {
        return this._outerVerts;
    }
    getInnerVerts() {
        return this._innerVerts;
    }
    getInnerLines() {
        let aRombHips = this._rombusHips;

        return [
            [aRombHips[0][0], aRombHips[1][1]],
            [aRombHips[1][0], aRombHips[2][1]],
            [aRombHips[2][0], aRombHips[0][1]]
        ];
    }
    findInnerVerts(aDescOuters: Points) {
        let nRomSide = this._rombusSide;
        let aDescartInners = [
            [aDescOuters[0][0] - nRomSide * 3 / 2, aDescOuters[0][1] + this.innerPadding],
            [aDescOuters[1][0] + nRomSide * 3 / 2, aDescOuters[1][1] + this.innerPadding],
            [aDescOuters[2][0], aDescOuters[2][1] - 2 * this.innerPadding]
        ] as Points;

        return {
            descart: aDescartInners,
            window: mapAllDescartToWindow(aDescartInners, this.size)
        };
    }
    findRombusHips(aDescOuters: Points, aDescInners: Points) {
        let nRombSide = this._rombusSide;
        let aDesc = [
            [
                [aDescOuters[0][0] - nRombSide / 2, aDescInners[0][1]],
                [aDescOuters[0][0] - nRombSide, aDescOuters[0][1]]
            ],
            [
                [aDescOuters[1][0] + nRombSide, aDescOuters[1][1]],
                [aDescOuters[1][0] + nRombSide / 2, aDescInners[1][1]]
            ],
            [
                [aDescOuters[2][0] - nRombSide / 2, aDescOuters[2][1] - this.innerPadding],
                [aDescOuters[2][0] + nRombSide / 2, aDescOuters[2][1] - this.innerPadding]
            ]
        ];

        return {
            descart: aDesc,
            window: aDesc.map(aRombus => mapAllDescartToWindow(aRombus as Points, this.size))
        }
    }
    getKLineSegments() {
        return this._getAllTrapezesInfo().filter(aInfo => aInfo !== null);
    }
    _getAllTrapezesInfo() {
        return [0, 1, 2].map(i => this._getTrapezeInfo(i));
    }
    _getTrapezeInfo(i: number){
        let nRatio = this._getTrapezeRatio(i);

        if(nRatio === null){return null;}

        let oTrapezeVerts = this._getTrapezeCoordinates(i);
        let oROrt = getDeltaPoints(oTrapezeVerts.baseR, oTrapezeVerts.topR);
        let oLOrt = getDeltaPoints(oTrapezeVerts.baseL, oTrapezeVerts.topL);

        return [
            [oTrapezeVerts.baseR[0]+oROrt[0]*nRatio,oTrapezeVerts.baseR[1]+oROrt[1]*nRatio],
            [oTrapezeVerts.baseL[0]+oLOrt[0]*nRatio,oTrapezeVerts.baseL[1]+oLOrt[1]*nRatio]
        ];

    }
    _getTrapezeCoordinates(i: number){
        let aRombHips = this._rombusHips;
        let aInnerVerts = this._innerVerts;

        let nRIndex = (i+1)%3;
        let nLIndex = (i+2)%3;

        let aRightRomb = aRombHips[nRIndex];
        let aLeftRomb = aRombHips[nLIndex];

        return {
            baseR: aRightRomb[1],
            baseL: aLeftRomb[0],
            topR: aInnerVerts[nRIndex],
            topL: aInnerVerts[nLIndex]
        }
    }
    _getTrapezeRatio(i: number): number | null {
        let aNums = this.charNums;

        let fnMul = this._productNumsFromTo.bind(this);
        let aExcept = [i];

        let aPoints = [0,
            (1-fnMul(0,2, aExcept))/(fnMul(i,2,aExcept)*(aNums[i]-1)),
            fnMul(0,i,aExcept)
        ];

        if(aPoints[0] >= aPoints[1] || aPoints[1] >= aPoints[2]){
            return null;
        }

        return (aPoints[1]-aPoints[0])/(aPoints[2]-aPoints[0]);
    }
    _productNumsFromTo(nFrom: number, nTo: number, aExcept?: number[]) {
        return productNumsFromTo(this.charNums, nFrom, nTo, aExcept);
    }
    _mapProjectiveToDescart(aZets1: ProjectivePoint, aVerts: Points) {
        return mapProjectiveToDescartMonodromic(aZets1, aVerts);
    }
}
export default ClassUnfoldBase;