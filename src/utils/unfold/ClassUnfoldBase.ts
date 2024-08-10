import {
    mapAllDescartToWindow,
    Points,
    Point,
    Segment,
    Segments,
    ProjectivePoint,
    getTripleLineIntersectSidePoint,
    getVectorLength
} from 'utils/drawUtils';
import {
    mapProjectiveToDescart,
    calcTriangleVertsBySizeAndPadding,
    getDeltaPoints,
    mapVertsToPolygonEdges
} from 'utils/drawUtils';
import {
    productNumsFromTo,
    numsAreAlmostEqual
} from 'utils/jsUtils';
import { numsAreDegenerated, numsMulIsUnit } from 'utils/appUtils';
import {
    TrapezeInfo, AllTrapezesInfo,
    RombSegment,
    RombInfo, AllRombsInfo,
    SetInfo,
    EdgesPath,
    SpecialInfo,
    RombCoordinates
} from './unfoldUtils';

export type ClassParam = {
    size: number,
    paddingTop: number,
    innerPadTop: number,
    charNums: number[],
    isMonodromic: boolean
}

class ClassUnfoldBase {
    //Размер рисунка
    protected readonly _size: number;
    //Отступ внешнего симплекса от верха
    protected readonly _paddingTop: number;
    //Отступ внутреннего симплекса от внешнего
    protected readonly _innerPadding: number;
    protected readonly _charNums: number[];
    protected readonly _isMonodromic: boolean;
    protected _numsMulIsUnit: boolean | null = null;
    protected _numsAreDegenerated: boolean | null = null;
    protected readonly _outerVerts: Points;
    protected readonly _innerVerts: Points;
    protected readonly _rombusSide: number;
    protected readonly _rombusHips: Points[];

    constructor({ size, paddingTop, charNums, innerPadTop, isMonodromic }: ClassParam) {

        this._size = size;
        this._paddingTop = paddingTop;
        this._innerPadding = innerPadTop;
        this._charNums = charNums;
        this._isMonodromic = isMonodromic;

        let oOuterVerts = calcTriangleVertsBySizeAndPadding(this._size, this._paddingTop);
        this._outerVerts = oOuterVerts.window;

        this._rombusSide = (2 / Math.sqrt(3)) * this._innerPadding;

        let oInnerVerts = this._findInnerVerts(oOuterVerts.descart);
        this._innerVerts = oInnerVerts.window;

        let oRombusHips = this._findRombusHips(oOuterVerts.descart, oInnerVerts.descart);
        this._rombusHips = oRombusHips.window;
    }
    //============================= Public =============================
    public getOuterVerts() {
        return this._outerVerts;
    }
    public getInnerVerts() {
        return this._innerVerts;
    }
    public getInnerLines(): Segments {
        let aRombHips = this._rombusHips;

        return [
            [aRombHips[0][0], aRombHips[1][1]],
            [aRombHips[1][0], aRombHips[2][1]],
            [aRombHips[2][0], aRombHips[0][1]]
        ];
    }
    public getNumsMulIsUnit(): boolean {
        if (typeof this._numsMulIsUnit === 'boolean') {
            return this._numsMulIsUnit;
        }

        let aNums = this._charNums;
        this._numsMulIsUnit = numsMulIsUnit(aNums);
        return this._numsMulIsUnit;
    }
    public getNumsAreDegenerated(): boolean {
        if (typeof this._numsAreDegenerated === 'boolean') {
            return this._numsAreDegenerated;
        }

        let aNums = this._charNums;
        this._numsAreDegenerated = numsAreDegenerated(aNums);
        return this._numsAreDegenerated;
    }
    public getSpecialInfo(): SpecialInfo {
        //Если все числа равны 1
        if (this.getNumsAreDegenerated()) {
            return this._getDegenSpecialInfo();
        }

        let oInfo = ClassUnfoldBase.getInitialSpecialInfo();

        let oKSetData = this._getKSetData();
        oInfo.kSet.segments = oKSetData.segments;
        oInfo.kSet.areas = oKSetData.areas;
        oInfo.edgesPath = oKSetData.edgesPath;

        oInfo.tripleSet = this.getTripleLineInfo();

        return oInfo;
    }
    public getIsTypicalCase() {
        if (this.getNumsAreDegenerated()) {
            return false;
        }
        if (this.getNumsMulIsUnit()) {
            return false;
        }
        for (let i = 0; i < 3; ++i) {
            if (this._checkRombIsDegen(i) || this._checkTrapezeDegen(i)) {
                return false;
            }
        }

        return true;
    }

    //=================================================================================

    protected _getTripleLineIntersectSide(nSide: number) {
        return getTripleLineIntersectSidePoint(nSide, this._innerVerts, this._charNums, this._isMonodromic);
    }
    protected _getEdgePath(aAllTrapezesInfo: AllTrapezesInfo, aRombInfo: AllRombsInfo): EdgesPath {

        let stPath = new Set<number>();
        let aPockets: boolean[] = [false, false, false];


        for (let i = 0; i < 3; ++i) {
            let oInfo = aRombInfo[i];
            if (oInfo.segment === null) continue;

            let [nLIndex, nRIndex] = this._getRombSideInds(i);
            if (!oInfo.middle) {
                oInfo.outerSides.forEach(nSide => {
                    stPath.add(nSide);
                    if (aAllTrapezesInfo[nSide] !== null && this._getTripleLineIntersectSide(nSide) !== null) {
                        aPockets[nSide] = true;
                    }
                });
            }
            else {
                stPath.add(nLIndex);
                stPath.add(nRIndex);
            }
            if (aAllTrapezesInfo[nRIndex] === null) continue;
            stPath.add(nRIndex);
        }

        let aPaths: EdgesPath = Array.from(stPath).map(nSide => {
            return {
                edgeIndex: nSide,
                hasPocket: aPockets[nSide]
            }
        });
        return aPaths;
    }
    protected _getKSetData() {

        let aAllTrapezesInfo = this._getAllTrapezesInfo();
        let aRombInfo = this._getAllRombusKInfo(aAllTrapezesInfo);

        let aPath: EdgesPath = [];
        if (this.getIsTypicalCase()) {
            aPath = this._getEdgePath(aAllTrapezesInfo, aRombInfo);
        }

        let aRombSegments: Segments = [];
        aRombInfo.forEach(oInfo => {
            if (oInfo.segment === null) return;
            aRombSegments.push(oInfo.segment as Segment);
        });

        let aSegments: Segments = [];
        let aFillPolygons: Points[] = [];
        if (this.getNumsMulIsUnit()) {
            aFillPolygons.push(this._innerVerts);
        }

        aAllTrapezesInfo.forEach(aTrapezeInfo => {
            if (aTrapezeInfo === null) return;
            if (aTrapezeInfo.length === 4) {
                aFillPolygons.push(aTrapezeInfo.map(aInfo => aInfo[0]));
            }
            aSegments = aSegments.concat(aTrapezeInfo);
        });

        return {
            segments: aSegments.concat(aRombSegments),
            areas: aFillPolygons,
            edgesPath: aPath
        }
    }
    protected _getDegenSpecialInfo(): SpecialInfo {
        let oInfo = ClassUnfoldBase.getInitialSpecialInfo();
        oInfo.kSet = {
            segments: this._getDegenKLineSegments(),
            areas: [this._outerVerts]
        };
        return oInfo;
    }
    protected _getDegenKLineSegments(): Segments {
        let aOuters = this._outerVerts;

        let aSegments = mapVertsToPolygonEdges(aOuters);
        aSegments = aSegments.concat(this.getInnerLines());
        return aSegments;
    }
    protected _getAllTrapezesInfo(): AllTrapezesInfo {
        return [0, 1, 2].map(i => this._getTrapezeInfo(i));
    }
    protected _getTrapezeInfo(i: number): TrapezeInfo {

        if (this._checkTrapezeDegen(i)) {
            return this._getDegenTrapezeInfo(i);
        }
        if (this.getNumsMulIsUnit()) {
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
    protected _getDegenTrapezeInfo(i: number): Segments {
        let oTrapeze = this._getTrapezeCoordinates(i);
        let aSegments = [[oTrapeze.baseL, oTrapeze.baseR]] as Segments;

        if (!this.getNumsMulIsUnit()) {
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
    protected _getAllRombusKInfo(aTrapezeInfo: AllTrapezesInfo): AllRombsInfo {
        let aAllInfo: AllRombsInfo = [];

        for (let i = 0; i < 3; ++i) {
            let oInfo = this._getRombusKInfo(aTrapezeInfo, i);
            aAllInfo.push(oInfo);
        }
        return aAllInfo;
    }
    protected _getRombEmptyInfo(): RombInfo {
        return {
            middle: false,
            outerSides: [],
            segment: null
        };
    }
    protected _getRombusKInfo(aTrapezeInfo: AllTrapezesInfo, i: number): RombInfo {

        let oInfo = this._getRombEmptyInfo();

        if (this._checkRombIsDegen(i)) {
            oInfo.segment = this._getDegenRombusKInfo(aTrapezeInfo, i);
            return oInfo;
        }
        if (this.getNumsMulIsUnit()) {
            oInfo.segment = this._getRombInfoWhileMulUnit(aTrapezeInfo, i);
            return oInfo;
        }

        return this._getRombusBaseKInfo(aTrapezeInfo, i);
    }
    protected _getDegenRombusKInfo(aTrapezeInfo: AllTrapezesInfo, i: number): RombSegment {
        let oRomb = this._getRombCoordinates(i);
        if (this.getNumsMulIsUnit()) {
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
    protected _getRombInfoWhileMulUnit(aTrapezeInfo: AllTrapezesInfo, i: number): RombSegment {
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
    protected _getRombusBaseKInfo(aTrapezeInfo: AllTrapezesInfo, i: number): RombInfo {
        let oInfo = this._getRombEmptyInfo();
        oInfo.middle = true;

        let [nLIndex, nRIndex] = this._getRombSideInds(i);
        let aVerts: Points = [];

        let aRTrapeze = aTrapezeInfo[nRIndex] as TrapezeInfo;
        let aLTrapeze = aTrapezeInfo[nLIndex] as TrapezeInfo;

        if (aRTrapeze !== null) {
            let aFirstSegment = aRTrapeze[0];
            aVerts.push(aFirstSegment[0]);
        }
        if (aLTrapeze !== null) {
            let aFirstSegment = aLTrapeze[0];
            aVerts.push(aFirstSegment[1]);
        }
        if (aVerts.length === 2) {
            oInfo.segment = aVerts as Segment;
            return oInfo;
        }

        oInfo.middle = false;

        let aLSegment = this._checkRombSideInKSet(i, 0);
        if (aLSegment !== null) {
            oInfo.outerSides.push(nLIndex);
            aVerts.push(aLSegment);
        }
        if (aVerts.length === 2) {
            oInfo.segment = aVerts as Segment;
            return oInfo;
        }

        let aRSegments = this._checkRombSideInKSet(i, 1);
        if (aRSegments !== null) {
            oInfo.outerSides.push(nRIndex);
            aVerts.push(aRSegments);
        }

        if (aVerts.length === 2) {
            oInfo.segment = aVerts as Segment;
            return oInfo;
        }

        return oInfo;
    }
    protected getTripleLineInfo() {
        let oInfo: SetInfo = {
            segments: [],
            areas: []
        };

        let aDegenInds = this._getAllDegenRombs();
        if (aDegenInds.length > 0) {
            return this._getTripleInfoWhileDegen(aDegenInds);
        }

        let aIntersections: Points = [];
        let aTrapezeSegments: Segments = [];
        [0, 1, 2].forEach(i => {
            let aIntersect = getTripleLineIntersectSidePoint(i, this._innerVerts, this._charNums, this._isMonodromic);
            if (aIntersect !== null) {
                aIntersections.push(aIntersect);

                let aTrapeze = this._getTrapezeCoordinates(i);
                let aDelta = getDeltaPoints(aTrapeze.topL, aIntersect);
                let aSide = getDeltaPoints(aTrapeze.topL, aTrapeze.topR);
                let nRatio = getVectorLength(aDelta) / getVectorLength(aSide);
                let aVect = getDeltaPoints(aTrapeze.baseL, aTrapeze.baseR);
                let aPoint = [aTrapeze.baseL[0] + nRatio * aVect[0], aTrapeze.baseL[1] + nRatio * aVect[1]] as Point;
                aTrapezeSegments.push([aPoint, aIntersect]);

            }
        });
        if (aIntersections.length === 2) {
            oInfo.segments.push(aIntersections as Segment);
            oInfo.segments = oInfo.segments.concat(aTrapezeSegments);
        }

        return oInfo;
    }
    protected _findInnerVerts(aDescOuters: Points) {
        let nRomSide = this._rombusSide;
        let aDescartInners = [
            [aDescOuters[0][0] - nRomSide * 3 / 2, aDescOuters[0][1] + this._innerPadding],
            [aDescOuters[1][0] + nRomSide * 3 / 2, aDescOuters[1][1] + this._innerPadding],
            [aDescOuters[2][0], aDescOuters[2][1] - 2 * this._innerPadding]
        ] as Points;

        return {
            descart: aDescartInners,
            window: mapAllDescartToWindow(aDescartInners, this._size)
        };
    }
    protected _findRombusHips(aDescOuters: Points, aDescInners: Points) {
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
                [aDescOuters[2][0] - nRombSide / 2, aDescOuters[2][1] - this._innerPadding],
                [aDescOuters[2][0] + nRombSide / 2, aDescOuters[2][1] - this._innerPadding]
            ]
        ];

        return {
            descart: aDesc,
            window: aDesc.map(aRombus => mapAllDescartToWindow(aRombus as Points, this._size))
        }
    }
    protected _checkRombIsDegen(i: number) {
        let aNums = this._charNums;
        return numsAreAlmostEqual(aNums[i], 1);
    }
    protected _checkAnyRombSideInKSet(i: number): Point | null {
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
    protected _checkRombSideInKSet(nRombIndex: number, nSideIndex: number): (Point | null) {
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
    protected _getTrapezeSideInds(i: number) {
        return [(i + 1) % 3, (i + 2) % 3];
    }
    protected _getTrapezeSideRombsHips(i: number) {
        let aHips = this._rombusHips;
        let [nL, nR] = this._getTrapezeSideInds(i);
        return [aHips[nL], aHips[nR]]
    }
    protected _getRombSideInds(i: number) {
        return [(i + 1) % 3, (i + 2) % 3];
    }
    protected _getRombCoordinates(i: number): RombCoordinates {
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
    protected _getRombVerts(i: number): Points {
        let aOuters = this._outerVerts;
        let aInners = this._innerVerts;
        let aHips = this._rombusHips[i];

        return [aOuters[i], aHips[0], aInners[i], aHips[1]];
    }
    protected _checkTrapezeDegen(i: number) {
        let [nFIndex, nSIndex] = this._getTrapezeSideInds(i);
        let aNums = this._charNums;
        let nMul = aNums[nFIndex] * aNums[nSIndex];

        return numsAreAlmostEqual(nMul, 1);
    }
    protected _getTrapezeCoordinates(i: number) {
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
    protected _getTrapezeVerts(i: number) {
        let aInnerVerts = this._innerVerts;

        let [nLIndex, nRIndex] = this._getTrapezeSideInds(i);
        let [aLeftRomb, aRightRomb] = this._getTrapezeSideRombsHips(i);
        return [aLeftRomb[1], aRightRomb[0], aInnerVerts[nRIndex], aInnerVerts[nLIndex]];
    }
    protected _getTrapezeRatio(i: number): number | null {
        let aPoints = this._getKTriplePoints(i, [i]);

        if (!this._checkTripleIsOrdered(aPoints)) {
            return null;
        }

        return this._getPointsRatio(aPoints);
    }
    protected _getPointsRatio(aPoints: number[]) {
        return (aPoints[1] - aPoints[0]) / (aPoints[2] - aPoints[0]);
    }
    protected _checkTripleIsOrdered(aPoints: number[]) {
        if (aPoints[0] < aPoints[1] && aPoints[1] < aPoints[2]) {
            return true;
        }
        return false;
    }
    protected _getKTriplePoints(i: number, aExcept: number[]) {
        let fnMul = this._productNumsFromTo.bind(this);
        let aNums = this._charNums;

        return [0,
            (1 - fnMul(0, 2, aExcept)) / (fnMul(i, 2, aExcept) * (aNums[i] - 1)),
            fnMul(0, i, aExcept)
        ];
    }
    protected _productNumsFromTo(nFrom: number, nTo: number, aExcept?: number[]) {
        return productNumsFromTo(this._charNums, nFrom, nTo, aExcept);
    }
    protected _mapProjectiveToDescart(aZets1: ProjectivePoint, aVerts: Points) {
        return mapProjectiveToDescart(aZets1, aVerts, this._isMonodromic);
    }
    protected _getAllDegenRombs() {
        let aInds: number[] = [];
        [0, 1, 2].forEach(i => {
            if (this._checkRombIsDegen(i)) {
                aInds.push(i);
            }
        });
        return aInds;
    }
    protected _getThirdIndex(i: number, j: number) {
        return Math.round((3 - i - j) % 3);
    }
    protected _getTripleInfoWhileDegen(aDegenInds: number[]) {

        let oInfo: SetInfo = {
            segments: [],
            areas: []
        };
        if (aDegenInds.length === 3) {
            return oInfo;
        }
        let aInners = this._innerVerts;

        if (aDegenInds.length === 2) {
            let nFInd = aDegenInds[0];
            let nSInd = aDegenInds[1];

            let aFPoints = this._getRombVerts(nFInd);
            let aSPoints = this._getRombVerts(nSInd);
            let nTrapezeInd = this._getThirdIndex(nFInd, nSInd);
            let aTrapezeVerts = this._getTrapezeVerts(nTrapezeInd);

            oInfo.areas.push(aFPoints, aSPoints, aTrapezeVerts);
            oInfo.segments.push([aInners[nFInd], aInners[nSInd]]);
            return oInfo;
        }

        let nInd = aDegenInds[0];
        let aPoints = this._getRombVerts(nInd);
        let aIntersect = getTripleLineIntersectSidePoint(nInd, this._innerVerts, this._charNums, this._isMonodromic);
        if (aIntersect !== null) {
            oInfo.segments.push([this._innerVerts[nInd], aIntersect]);
            let aTrapeze = this._getTrapezeCoordinates(nInd);
            let aDelta = getDeltaPoints(aTrapeze.topL, aIntersect);
            let aSide = getDeltaPoints(aTrapeze.topL, aTrapeze.topR);
            let nRatio = getVectorLength(aDelta) / getVectorLength(aSide);
            let aVect = getDeltaPoints(aTrapeze.baseL, aTrapeze.baseR);
            let aPoint = [aTrapeze.baseL[0] + nRatio * aVect[0], aTrapeze.baseL[1] + nRatio * aVect[1]] as Point;
            oInfo.segments.push([aPoint, aIntersect]);
            oInfo.areas.push(aPoints);
        }
        return oInfo;
    }
    static getInitialSpecialInfo(): SpecialInfo {
        return {
            kSet: {
                segments: [],
                areas: []
            },
            tripleSet: {
                segments: [],
                areas: []
            },
            edgesPath: []
        };
    }
}
export default ClassUnfoldBase;