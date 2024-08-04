import React from "react";
import { Point, Points, getDeltaPoints } from "utils/drawUtils";

import './DiagramStyle.scss';

type MyProps = {
    charNums: number[],
    isMonodromic: boolean,
    isFormError: boolean,
    size: number | null
};
type MyState = {

}
class DrawDiagram extends React.Component<MyProps, MyState> {
    size: number = 0;
    paddingLeft: number = 60;
    _radius: number = 0;
    render() {

        if (this.props.size === null) return null;

        this.size = this.props.size;
        this._radius = this.size / 3;

        if (this.props.isFormError) {
            return this._renderEmpty();
        }

        return (
            <svg className='draw-graph draw-diagram'
                width={this.size}
                height={this.size}>
                {this._renderCircle()}
                {this._renderDotsAndTexts()}
            </svg>
        );
    }
    _renderCircle() {
        return (
            <circle className='draw-diagram-circle'
                cx={this.size / 2}
                cy={this.size / 2}
                r={this._radius}>
            </circle>
        );
    }
    _renderDotsAndTexts() {
        return (
            <g>
               {this._renderAllLDots()}
               {this._renderSLTexts()}
            </g>
        );
    }
    _renderSLTexts(){
        let nX = this.size / 2;
        let nY = this.size / 2;
        let nR = this._radius;

        let aDots:Points = [
            [nX + nR * Math.sqrt(3) / 2, nY + nR / 2],
            [nX - nR * Math.sqrt(3) / 2, nY + nR / 2],
            [nX,nY-nR]
        ];
        return aDots.map((aDot, i) => this._renderSLText(aDot, i));
    }
    _renderSLText(aDot:Point, i:number){
        let nX = this.size / 2;
        let nY = this.size / 2;
        let aTangent = getDeltaPoints(aDot, [nX,nY]);

        let nLength = 32;
        let nHeight = 15;
        let nRatio = 0.25;

        return (
            <text className='draw-diagram-text draw-diagram-SL-text'
                    x={aDot[0]+aTangent[0]*nRatio-nLength/2}
                    y={aDot[1]+aTangent[1]*nRatio+nHeight/2}>
                    SL
                    <tspan baselineShift="sub">
                        {i+1}
                    </tspan>
                </text>
        );
    }
    _renderAllLDots(){
        let nX = this.size / 2;
        let nY = this.size / 2;
        let nR = this._radius;

        let aDots: Points = [
            [nX - nR * Math.sqrt(3) / 2, nY - nR / 2],
            [nX + nR * Math.sqrt(3) / 2, nY - nR / 2],
            [nX, nY + this._radius]
        ];

        return aDots.map((aDot, i) => this._renderLDot(aDot, i));
    }
    _renderLDot(aDot: Point, i: number) {
        let nF = (i + 1) % 3;
        let nS = (i + 2) % 3;
        if (nF > nS) {
            [nF, nS] = [nS, nF];
        }
        let sSubText = `${nF + 1},${nS + 1}`;

        let nX = this.size/2;
        let nY = this.size/2;
        let aTangent = getDeltaPoints(aDot, [nX,nY]);

        let nLength = 32;
        let nRatio = 0.25;
        let nHeight = 15;

        return (
            <g>
                <circle className='draw-diagram-dot'
                    cx={aDot[0]}
                    cy={aDot[1]}
                    r={5}>
                </circle>
                <text className='draw-diagram-text draw-diagram-L-text'
                    textLength={nLength}
                    x={aDot[0]+aTangent[0]*nRatio-nLength/2}
                    y={aDot[1]+aTangent[1]*nRatio+nHeight/2}>
                    L
                    <tspan baselineShift="sub">
                        {sSubText}
                    </tspan>
                </text>
            </g>
        );
    }
    _renderEmpty() {
        return (
            <svg className='draw-graph draw-polycycle'
                width={this.size}
                height={this.size}>
                <rect className="draw-form-error-lid"
                    width={this.size}
                    height={this.size} />
            </svg>
        );
    }
}

export default DrawDiagram;