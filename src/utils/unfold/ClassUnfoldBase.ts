import { mapAllDescartToWindow, 
    Points, 
    Point, 
    Segment,
    Segments,
    ProjectivePoint } from 'utils/drawUtils';
import {
    mapProjectiveToDescart,
    calcTriangleVertsBySizeAndPadding,
    getDeltaPoints,
    mapVertsToPolygonEdges
} from 'utils/drawUtils';
import {
    productNumsFromTo,
    getNumsMul,
    numsAreAlmostEqual
} from 'utils/jsUtils';

export type ClassParam = {
    size: number,
    paddingTop: number,
    innerPadTop: number,
    charNums: number[],
    isMonodromic: boolean
}
export type SegmentInfo = Points | null;
export type SegmentsInfo = SegmentInfo[];
export type RombCoordinates = {
    bottom: Point,
    top: Point,
    rHip: Point,
    lHip: Point
}
type TrapezeInfo = Segments | null;
type AllTrapezesInfo = TrapezeInfo[];
type RombSegment = Segment | null;
type AllRombSegments = Segments;

class ClassUnfoldBase {
    //Размер рисунка
    size: number;
    //Отступ внешнего симплекса от верха
    paddingTop: number;
    //Отступ внутреннего симплекса от внешнего
    innerPadding: number;
    charNums: number[];
    isMonodromic: boolean;
    _numsMulIsUnit: boolean;
    _numsAreDegenerated: boolean;
    _outerVerts: Points;
    _innerVerts: Points;
    _rombusSide: number;
    _rombusHips: Points[];

    constructor({ size, paddingTop, charNums, innerPadTop, isMonodromic }: ClassParam) {

        this.size = size;
        this.paddingTop = paddingTop;
        this.innerPadding = innerPadTop;
        this.charNums = charNums;
        this.isMonodromic = isMonodromic;

        this._numsMulIsUnit = this._checkMulIsUnit();
        this._numsAreDegenerated = this._checkNumsAreDegenerated();

        let oOuterVerts = calcTriangleVertsBySizeAndPadding(this.size, this.paddingTop);
        this._outerVerts = oOuterVerts.window;

        this._rombusSide = (2 / Math.sqrt(3)) * this.innerPadding;

        let oInnerVerts = this._findInnerVerts(oOuterVerts.descart);
        this._innerVerts = oInnerVerts.window;

        let oRombusHips = this._findRombusHips(oOuterVerts.descart, oInnerVerts.descart);
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
    _findInnerVerts(aDescOuters: Points) {
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
    _findRombusHips(aDescOuters: Points, aDescInners: Points) {
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
    _getDegenKLineSegments(){
        let aOuters = this._outerVerts;

        let aSegments = mapVertsToPolygonEdges(aOuters) as Points[];
        aSegments = aSegments.concat(this.getInnerLines());
        return aSegments;
    }
    getKSetInfo():{segments: Segments, areasVerts: Points[]} {

        //Если все числа равны единице
        if(this._numsAreDegenerated){
            return {
                segments: this._getDegenKLineSegments() as Segments,
                areasVerts: [this._outerVerts]
            };
        }

        let aAllTrapezesInfo = this._getAllTrapezesInfo();
        let aRombusSegments = this._getAllRombusKSegments(aAllTrapezesInfo) as AllRombSegments;

        let aSegments: Segments = [];
        let aFillPolygons: Points[] = [];
        if(this._numsMulIsUnit){
            aFillPolygons.push(this._innerVerts);
        }

        aAllTrapezesInfo.forEach(aTrapezeInfo=>{
            if(aTrapezeInfo === null)return;
            if(aTrapezeInfo.length === 4){
                aFillPolygons.push(aTrapezeInfo.map(aInfo=>aInfo[0]));
            }
            aSegments = aSegments.concat(aTrapezeInfo);
        });

        return {
            segments: aSegments.concat(aRombusSegments),
            areasVerts: aFillPolygons
        }
    }
    getNumsMulIsUnit() {
        return this._numsMulIsUnit;
    }
    getNumsAreDegenerated() {
        return this._numsAreDegenerated;
    }
    _checkNumsAreDegenerated(){
        let aNums = this.charNums;
        for (let nNum of aNums) {
            if (!numsAreAlmostEqual(nNum, 1)) {
                return false;
            }
        }
        return true;
    }
    _checkMulIsUnit() {
        let aNums = this.charNums;
        let nMul = getNumsMul(aNums);
        if (numsAreAlmostEqual(nMul, 1)) {
            return true;
        }
        return false;
    }
    _getAllRombusKSegments(aTrapezeInfo: AllTrapezesInfo): AllRombSegments {
        let aSegments: AllRombSegments = [];

        for (let i = 0; i < 3; ++i) {
            let aSegment = this._getRombusKInfo(aTrapezeInfo, i);
            if (aSegment !== null) {
                aSegments.push(aSegment);
            }
        }

        return aSegments;
    }
    _getDegenRombusKInfo(aTrapezeInfo: AllTrapezesInfo, i: number): RombSegment {
        let oRomb = this._getRombCoordinates(i);
        if(this._numsMulIsUnit){
            return [oRomb.top, oRomb.bottom];
        }

        let [nLIndex, nRIndex] = this._getRombSideInds(i);
        let aRTrapeze = aTrapezeInfo[nRIndex];
        let aLTrapeze = aTrapezeInfo[nLIndex];

        if (aRTrapeze !== null) {
            let aSegment = aRTrapeze[0];
            return [oRomb.top, aSegment[0]];
        }
        if (aLTrapeze !== null) {
            let aSegment = aLTrapeze[0];
            return [oRomb.top, aSegment[1]];
        }

        return null;

    }
    _getRombInfoWhileMulUnit(aTrapezeInfo: AllTrapezesInfo, i: number): RombSegment{
        let aInners = this._innerVerts;

        let aLSegments = this._checkRombSideInKSet(i, 0);
        if (aLSegments !== null) {
            return [aLSegments, aInners[i]];
        }
        let aRSegments = this._checkRombSideInKSet(i, 1);
        if (aRSegments !== null) {
            return [aRSegments, aInners[i]];
        }
        return null;
    }
    _getRombusBaseKInfo(aTrapezeInfo: AllTrapezesInfo, i: number): RombSegment{
        let [nLIndex, nRIndex] = this._getRombSideInds(i);

        let aSegments: Points = [];
        let aRTrapeze = aTrapezeInfo[nRIndex] as TrapezeInfo;
        let aLTrapeze = aTrapezeInfo[nLIndex] as TrapezeInfo;

        if (aRTrapeze !== null) {
            let aFirstSegment = aRTrapeze[0];
            aSegments.push(aFirstSegment[0]);
        }
        if (aLTrapeze !== null) {
            let aFirstSegment = aLTrapeze[0];
            aSegments.push(aFirstSegment[1]);
        }
        if (aSegments.length === 2) {
            return aSegments as Segment;
        }

        let aLSegments = this._checkRombSideInKSet(i, 0);
        if (aLSegments !== null) {
            aSegments.push(aLSegments);
        }
        if (aSegments.length === 2) {
            return aSegments as Segment;
        }

        let aRSegments = this._checkRombSideInKSet(i, 1);
        if (aRSegments !== null) {
            aSegments.push(aRSegments);
        }

        if (aSegments.length === 2) {
            return aSegments as Segment;
        }

        return null;
    }
    _getRombusKInfo(aTrapezeInfo: AllTrapezesInfo, i: number): RombSegment {

        if (this._checkRombIsDegen(i)) {
            return this._getDegenRombusKInfo(aTrapezeInfo, i);
        }
        if(this._numsMulIsUnit){
            return this._getRombInfoWhileMulUnit(aTrapezeInfo, i);
        }

        return this._getRombusBaseKInfo(aTrapezeInfo, i);
    }
    _checkRombIsDegen(i: number) {
        let aNums = this.charNums;
        return numsAreAlmostEqual(aNums[i], 1);
    }
    _checkAnyRombSideInKSet(i: number): Point | null {
        let aLSegments = this._checkRombSideInKSet(i, 0);
        if (aLSegments !== null) {
            return aLSegments;
        }
        let aRSegments = this._checkRombSideInKSet(i, 1);
        if (aRSegments !== null) {
            return aRSegments;
        }
        return null;
    }
    _checkRombSideInKSet(nRombIndex: number, nSideIndex: number): (Point | null) {
        let nRIndex = (nRombIndex + 1) % 3;
        let nLIndex = (nRombIndex + 2) % 3;

        let nTrapezeIndex = nSideIndex === 0 ? nLIndex : nRIndex;

        let aPoints = this._getKTriplePoints(nTrapezeIndex, [nRIndex, nLIndex]);
        if (!this._checkTripleIsOrdered(aPoints)) {
            return null;
        }

        let aOuterVert = this._outerVerts[nRombIndex];
        let aRombHip = this._rombusHips[nRombIndex][nSideIndex];

        let aDeltaVect = getDeltaPoints(aOuterVert, aRombHip);
        let nRatio = this._getPointsRatio(aPoints);

        return [
            aOuterVert[0] + nRatio * aDeltaVect[0],
            aOuterVert[1] + nRatio * aDeltaVect[1]
        ];

    }
    _getAllTrapezesInfo(): AllTrapezesInfo {
        return [0, 1, 2].map(i => this._getTrapezeInfo(i));
    }
    _getTrapezeSideInds(i: number) {
        return [(i + 1) % 3, (i + 2) % 3];
    }
    _getTrapezeSideRombsHips(i: number) {
        let aHips = this._rombusHips;
        let [nL, nR] = this._getTrapezeSideInds(i);
        return [aHips[nL], aHips[nR]]
    }
    _getRombSideInds(i: number) {
        return [(i + 1) % 3, (i + 2) % 3];
    }
    _getDegenTrapezeInfo(i: number): Segments{
        let oTrapeze = this._getTrapezeCoordinates(i);
        let aSegments = [[oTrapeze.baseL, oTrapeze.baseR]] as Segments;
        
        if(!this._numsMulIsUnit){
            return aSegments;
        }

        let [iLInd, iRInd] = this._getTrapezeSideInds(i);
        let oLRomb = this._getRombCoordinates(iLInd) as RombCoordinates;
        let oRRomb = this._getRombCoordinates(iRInd) as RombCoordinates;

        aSegments.push([oRRomb.lHip, oRRomb.bottom]);
        aSegments.push([oTrapeze.topR, oTrapeze.topL]);
        aSegments.push([oLRomb.bottom, oLRomb.rHip]);

        return aSegments;

    }
    _getRombCoordinates(i: number): RombCoordinates{
        let aOuters = this._outerVerts;
        let aInners = this._innerVerts;
        let aHips = this._rombusHips[i];

        return {
            top: aOuters[i],
            bottom: aInners[i],
            rHip: aHips[1],
            lHip: aHips[0]
        };
    }
    _getTrapezeInfo(i: number): TrapezeInfo {

        if (this._checkTrapezeDegen(i)) {
            return this._getDegenTrapezeInfo(i);
        }
        if (this._numsMulIsUnit) {
            let oTrapezeVerts = this._getTrapezeCoordinates(i);
            return [[oTrapezeVerts.topL, oTrapezeVerts.topR]];
        }

        let nRatio = this._getTrapezeRatio(i);
        if (nRatio === null) { return null; }

        let oTrapezeVerts = this._getTrapezeCoordinates(i);
        let oROrt = getDeltaPoints(oTrapezeVerts.baseR, oTrapezeVerts.topR);
        let oLOrt = getDeltaPoints(oTrapezeVerts.baseL, oTrapezeVerts.topL);

        let aSegment = [
            [oTrapezeVerts.baseL[0] + oLOrt[0] * nRatio, oTrapezeVerts.baseL[1] + oLOrt[1] * nRatio],
            [oTrapezeVerts.baseR[0] + oROrt[0] * nRatio, oTrapezeVerts.baseR[1] + oROrt[1] * nRatio]
        ] as Segment;

        return [aSegment];

    }
    _checkTrapezeDegen(i: number) {
        let [nFIndex, nSIndex] = this._getTrapezeSideInds(i);
        let aNums = this.charNums;
        let nMul = aNums[nFIndex] * aNums[nSIndex];

        return numsAreAlmostEqual(nMul, 1);
    }
    _getTrapezeCoordinates(i: number) {
        let aInnerVerts = this._innerVerts;

        let [nLIndex, nRIndex] = this._getTrapezeSideInds(i);
        let [aLeftRomb, aRightRomb] = this._getTrapezeSideRombsHips(i);

        return {
            baseR: aRightRomb[0],
            baseL: aLeftRomb[1],
            topR: aInnerVerts[nRIndex],
            topL: aInnerVerts[nLIndex]
        }
    }
    _getTrapezeRatio(i: number): number | null {
        let aPoints = this._getKTriplePoints(i, [i]);

        if (!this._checkTripleIsOrdered(aPoints)) {
            return null;
        }

        return this._getPointsRatio(aPoints);
    }
    _getPointsRatio(aPoints: number[]) {
        return (aPoints[1] - aPoints[0]) / (aPoints[2] - aPoints[0]);
    }
    _checkTripleIsOrdered(aPoints: number[]) {
        if (aPoints[0] < aPoints[1] && aPoints[1] < aPoints[2]) {
            return true;
        }
        return false;
    }
    _getKTriplePoints(i: number, aExcept: number[]) {
        let fnMul = this._productNumsFromTo.bind(this);
        let aNums = this.charNums;

        return [0,
            (1 - fnMul(0, 2, aExcept)) / (fnMul(i, 2, aExcept) * (aNums[i] - 1)),
            fnMul(0, i, aExcept)
        ];
    }
    _productNumsFromTo(nFrom: number, nTo: number, aExcept?: number[]) {
        return productNumsFromTo(this.charNums, nFrom, nTo, aExcept);
    }
    _mapProjectiveToDescart(aZets1: ProjectivePoint, aVerts: Points) {
        return mapProjectiveToDescart(aZets1, aVerts, this.isMonodromic);
    }
}
export default ClassUnfoldBase;