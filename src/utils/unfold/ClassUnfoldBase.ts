import { mapAllDescartToWindow,Points, ProjectivePoint } from 'utils/drawUtils';
import { mapProjectiveToDescartMonodromic, calcTriangleVertsBySizeAndPadding } from 'utils/drawUtils';

export type ClassParam = {
    size: number,
    paddingTop: number,
    innerPadTop: number,
    charNums: number[]
}
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

        this._rombusSide = (2/Math.sqrt(3)) * this.innerPadding;

        let oInnerVerts = this.findInnerVerts(oOuterVerts.descart);
        this._innerVerts = oInnerVerts.window;

        let oRombusHips = this.findRombusHips(oOuterVerts.descart,oInnerVerts.descart);
        this._rombusHips = oRombusHips.window;
    }
    getOuterVerts() {
        return this._outerVerts;
    }
    getInnerVerts() {
        return this._innerVerts;
    }
    getInnerLines(){
        let aRombHips = this._rombusHips;

        return [
            [aRombHips[0][0],aRombHips[1][1]],
            [aRombHips[1][0],aRombHips[2][1]],
            [aRombHips[2][0],aRombHips[0][1]]
        ];
    }
    findInnerVerts(aDescOuters: Points){
        let nRomSide = this._rombusSide;
        let aDescartInners = [
            [aDescOuters[0][0]-nRomSide*3/2,aDescOuters[0][1]+this.innerPadding],
            [aDescOuters[1][0]+nRomSide*3/2,aDescOuters[1][1]+this.innerPadding],
            [aDescOuters[2][0],aDescOuters[2][1]-2*this.innerPadding]
        ] as Points;

        return {
            descart: aDescartInners,
            window: mapAllDescartToWindow(aDescartInners, this.size)
        };
    }
    findRombusHips(aDescOuters: Points,aDescInners: Points){
        let nRombSide = this._rombusSide;
        let aDesc = [
            [
                [aDescOuters[0][0] - nRombSide/2, aDescInners[0][1]],
                [aDescOuters[0][0] - nRombSide, aDescOuters[0][1]]
            ],
            [
                [aDescOuters[1][0] + nRombSide, aDescOuters[1][1]],
                [aDescOuters[1][0] + nRombSide/2, aDescInners[1][1]]
            ],
            [
                [aDescOuters[2][0] - nRombSide/2, aDescOuters[2][1] - this.innerPadding],
                [aDescOuters[2][0] + nRombSide/2, aDescOuters[2][1] - this.innerPadding]
            ]
        ];

        return {
            descart: aDesc,
            window: aDesc.map(aRombus=>mapAllDescartToWindow(aRombus as Points, this.size))
        }
    }
    _mapProjectiveToDescart(aZets1:ProjectivePoint, aVerts:Points){
        return mapProjectiveToDescartMonodromic(aZets1, aVerts);
    }
}
export default ClassUnfoldBase;