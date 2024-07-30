import React from "react";
import ClassSimplex from 'utils/simplexUtils';
import {Points} from "utils/drawUtils";
import { CanvasColors } from "utils/drawUtils";

type MyProps = {
    charNums: number[]
};

class DrawSimplex extends React.Component<MyProps, {}> {
    myCanvas = React.createRef<HTMLCanvasElement>();
    size: number = 300;
    paddingTop = 40;
    _simplexObject: ClassSimplex | null = null;

    render() {

        return (
            <canvas ref={this.myCanvas}
                className='draw-simplex'
                width={this.size}
                height={this.size} />
        );
    }
    componentDidMount() {
        let canvas = this.myCanvas.current as HTMLCanvasElement;
        let oCtx = canvas.getContext('2d');

        if (oCtx !== null) {
            this._update(oCtx);
        }
    }
    componentDidUpdate() {
        let canvas = this.myCanvas.current as HTMLCanvasElement;
        let oCtx = canvas.getContext('2d');

        if (oCtx !== null) {
            oCtx.clearRect(0, 0, this.size, this.size);
            this._update(oCtx);
        }
    }
    _update(oCtx: CanvasRenderingContext2D) {

        this._simplexObject = new ClassSimplex({
            size: this.size,
            paddingTop: this.paddingTop,
            charNums: this.props.charNums
        });

        this._drawTriangle(oCtx);
        this._drawTripleCyclesLine(oCtx);
    }
    _drawTriangle(oCtx: CanvasRenderingContext2D) {

        oCtx.lineWidth = 2;

        for(let i=0;i<3;++i){
            this._drawTriangleEdge(oCtx, i);
        }
        for(let i=0;i<3;++i){
            this._drawTriangleVertices(oCtx, i);
        }

    }
    _drawTriangleVertices(oCtx: CanvasRenderingContext2D, i: number) {
        let oSimplex = this._simplexObject;
        if(oSimplex === null) return;

        let aVerts = oSimplex.getVertices();
        if (oSimplex.checkVerticeInKSet(i)) {
                oCtx.beginPath();
                oCtx.fillStyle = CanvasColors.kSet;
                oCtx.arc(...aVerts[i], 5, 0, Math.PI * 2);
                oCtx.fill();
        }

        //==========================================
        oCtx.save();
        oCtx.font = "20px Verdana";
        oCtx.fillStyle = 'black';
        oCtx.translate(...aVerts[2]);
        oCtx.rotate(Math.PI/3);
        oCtx.fillText('z\u{2082}=0', (-aVerts[1][0]+aVerts[2][0])/2, -10);
        oCtx.restore();
        //==========================================
    }
    _drawTriangleEdge(oCtx: CanvasRenderingContext2D, i: number) {
        let oSimplex = this._simplexObject;
        if(oSimplex === null) return;

        oCtx.beginPath();

        let nFirst = (i + 1) % 3;
        let nSecond = (i + 2) % 3;
        let aVerts = oSimplex.getVertices();

        oCtx.strokeStyle = oSimplex.checkEdgeInKSet(i) ? CanvasColors.kSet : CanvasColors.simplex;

        oCtx.moveTo(...aVerts[nFirst]);
        oCtx.lineTo(...aVerts[nSecond]);
        oCtx.stroke();
    }
    _drawTripleCyclesLine(oCtx: CanvasRenderingContext2D) {
        
        let oSimplex = this._simplexObject;
        if(oSimplex === null) return;

        oCtx.beginPath();
        oCtx.strokeStyle = CanvasColors.tripleCycles;
        oCtx.lineWidth = 2;

        let aPoints: Points;
        try{
            aPoints = oSimplex.getTripleCycleLineSegment() as Points;
        }
        catch(sErr){
            return;
        }

        oCtx.moveTo(...aPoints[0]);
        oCtx.lineTo(...aPoints[1]);
        oCtx.stroke();
    }
}

export default DrawSimplex;