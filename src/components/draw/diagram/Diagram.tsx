import React from "react";
import { Point, Points, getDeltaPoints } from "utils/drawUtils";
import ClassDiagram from "utils/diagram/ClassDiagram";
import { EdgesPath } from "utils/unfold/unfoldUtils";
import { Translation } from "react-i18next";

import './DiagramStyle.scss';
import { getNumsMul } from "utils/jsUtils";

type MyProps = {
    charNums: number[],
    isMonodromic: boolean,
    isFormError: boolean,
    size: number,
    edgesPath: EdgesPath,
    isTypicalCase: boolean
};
type MyState = {

}
class DrawDiagram extends React.Component<MyProps, MyState> {
    paddingLeft: number = 60;
    _radius: number = 0;
    _lPoints: Points = [];
    _isInnerPath: boolean = false;
    _diagramObject: ClassDiagram | null = null;

    render() {

        if (this.props.size === 0) return null;

        if (this.props.isFormError) {
            return this._renderEmpty();
        }
        if(!this.props.isTypicalCase){
            this._isInnerPath = false;
            this._diagramObject = new ClassDiagram({
                path: [],
                size: this.props.size,
                isInnerPath: this._isInnerPath
            });
            return this._renderNotTypicalCase();
        }

        let aPath = this.props.edgesPath;
        if (aPath.length < 2) {
            this._isInnerPath = false;
            aPath = [];
        }
        else{
            this._isInnerPath = this._getIsInnerPath();
        }
        
        this._diagramObject = new ClassDiagram({
            path: aPath,
            size: this.props.size,
            isInnerPath: this._isInnerPath
        });

        return (
            <svg className='draw-graph draw-diagram'
                width={this.props.size}
                height={this.props.size}>
                {this._renderCircle()}
                {this._renderEdgesPath()}
                {this._renderDotsAndTexts()}
            </svg>
        );
    }
    _renderEdgesPath() {
        let oDiagram = this._diagramObject;
        if (oDiagram === null) return;

        let aArcs = oDiagram.getPathArcs();

        return (
            <g className="draw-k-set">
                {this._renderArcs(aArcs)}
            </g>
        );
    }
    _getIsInnerPath() {
        let aNums = this.props.charNums;
        let nMul = getNumsMul(aNums);
        return (nMul < 1);
    }
    _renderPocket(nEdge: number, bStart: boolean) {
        return '';
    }
    _renderArcs(aArcs: string[]) {
        return aArcs.map((sArc, i) => {
            return <path key={i} d={sArc} />
        });
    }
    _renderCircle() {
        let oDiagram = this._diagramObject;
        if (oDiagram === null) return;

        return (
            <circle className='draw-diagram-circle'
                cx={oDiagram.cx}
                cy={oDiagram.cy}
                r={oDiagram.radius}>
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
    _renderSLTexts() {
        let oDiagram = this._diagramObject;
        if (oDiagram === null) return;

        let aDots = oDiagram.getSLPoints();
        return aDots.map((aDot, i) => this._renderSLText(aDot, i));
    }
    _renderSLText(aDot: Point, i: number) {
        let oDiagram = this._diagramObject;
        if (oDiagram === null) return;

        let nX = oDiagram.cx;
        let nY = oDiagram.cy;
        let aTangent = getDeltaPoints(aDot, [nX, nY]);

        let nLength = 32;
        let nHeight = 15;
        let nRatio = 0.25;

        let nCoeff = this._isInnerPath ? -1 : 1;
        return (
            <text key={i}
                className='draw-diagram-text draw-diagram-SL-text'
                x={aDot[0] + nCoeff * aTangent[0] * nRatio - nLength / 2}
                y={aDot[1] + nCoeff * aTangent[1] * nRatio + nHeight / 2}>
                SL
                <tspan baselineShift="sub">
                    {i + 1}
                </tspan>
            </text>
        );
    }
    _renderAllLDots() {
        let oDiagram = this._diagramObject;
        if (oDiagram === null) return;

        let aDots = oDiagram.getLPoints();
        return aDots.map((aDot, i) => this._renderLDot(aDot, i));
    }
    _renderLDot(aDot: Point, i: number) {
        let oDiagram = this._diagramObject;
        if (oDiagram === null) return;

        let nF = (i + 1) % 3;
        let nS = (i + 2) % 3;
        if (nF > nS) {
            [nF, nS] = [nS, nF];
        }
        let sSubText = `${nF + 1},${nS + 1}`;

        let nX = oDiagram.cx;
        let nY = oDiagram.cy;
        let aTangent = getDeltaPoints(aDot, [nX, nY]);

        let nLength = 32;
        let nRatio = 0.25;
        let nHeight = 15;

        let nCoeff = this._isInnerPath ? -1 : 1;
        return (
            <g key={i}>
                <circle className='draw-diagram-dot'
                    cx={aDot[0]}
                    cy={aDot[1]}
                    r={5}>
                </circle>
                <text className='draw-diagram-text draw-diagram-L-text'
                    textLength={nLength}
                    x={aDot[0] + nCoeff * aTangent[0] * nRatio - nLength / 2}
                    y={aDot[1] + nCoeff * aTangent[1] * nRatio + nHeight / 2}>
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
            <svg className='draw-graph draw-diagram'
                width={this.props.size}
                height={this.props.size}>
                {this._renderCircle()}
                {this._renderDotsAndTexts()}
                <rect className="draw-form-error-lid"
                    width={this.props.size}
                    height={this.props.size} />
            </svg>
        );
    }
    _renderNotTypicalText() {

        return (
            <Translation>
                {
                    t => <text className='text-not-typical'
                        x={40}
                        y={40}>
                        {t('drawDiagram.notTypicalCase')}
                    </text>
                }
            </Translation>
        );
    }
    _renderNotTypicalCase() {
        return (
            <svg className='draw-graph draw-diagram draw-diagram-not-typical'
                width={this.props.size}
                height={this.props.size}>
                {this._renderCircle()}
                {this._renderDotsAndTexts()}
                {this._renderNotTypicalText()}
            </svg>
        );
    }
}

export default DrawDiagram;