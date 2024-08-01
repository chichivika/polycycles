import React from "react";
import createSimplexObject from "utils/simplex/simplexUtils";
import { Points } from "utils/drawUtils";
import { CanvasColors } from "utils/drawUtils";
import { renderPolygon } from "utils/svgUtils";

type MyProps = {
    charNums: number[],
    isMonodromic: boolean,
    isFormError: boolean
};

class DrawSimplex extends React.Component<MyProps, {}> {
    size: number = 300;
    paddingTop = 30;
    _simplexObject: (ReturnType<typeof createSimplexObject> | null) = null;

    render() {

        this._simplexObject = createSimplexObject({
            isMonodromic: this.props.isMonodromic,
            drawSetting: {
                size: this.size,
                paddingTop: this.paddingTop,
                charNums: this.props.charNums
            }
        });
        if (this.props.isFormError) {
            return this._renderEmpty();
        }

        return (
            <svg className='draw-simplex'
                width={this.size}
                height={this.size}>
                {this.renderEdges()}
                {this.renderVertices()}
                {this.renderTripleLine()}
                {this.renderTexts()}
            </svg>
        );
    }
    _renderEmpty() {
        return (
            <svg className='draw-simplex draw-form-error'
                width={this.size}
                height={this.size}
                stroke={CanvasColors.simplex}
            >
                {this._renderSimpleTriangle()}
                {this.renderTexts()}
                <rect className='draw-form-error-lid'
                    width={this.size}
                    height={this.size} />
            </svg>
        );
    }
    renderTexts() {
        return <g key='edge-texts' fontWeight='normal' stroke='none'>
            {[0, 1, 2].map(i => this.renderEdgeText(i))}
        </g>;
    }
    _renderSimpleTriangle() {
        let oSimplex = this._simplexObject;
        if (oSimplex === null) return;

        let aVerts = oSimplex.getVertices();
        return renderPolygon(aVerts, { strokeWidth: '2' });
    }
    renderEdgeText(i: number) {
        let oSimplex = this._simplexObject;
        if (oSimplex === null) return;

        let aVerts = oSimplex.getVertices();
        let nFirst = (i + 1) % 3;
        let nSecond = (i + 2) % 3;

        if (i === 2) {
            [nFirst, nSecond] = [nSecond, nFirst];
        }

        let oFVert = aVerts[nFirst];
        let oSVert = aVerts[nSecond];

        let oTangent = [oSVert[0] - oFVert[0], oSVert[1] - oFVert[1]];
        let nTangentLength = Math.sqrt(oTangent[0] ** 2 + oTangent[1] ** 2);
        let oUnionTangent = [oTangent[0] / nTangentLength, oTangent[1] / nTangentLength];

        let oOrt = [oUnionTangent[1], -oUnionTangent[0]];

        let nX = oFVert[0] + oTangent[0] / 2 + 10 * oOrt[0] - 19 * oUnionTangent[0];
        let nY = oFVert[1] + oTangent[1] / 2 + 10 * oOrt[1] - 19 * oUnionTangent[1];

        let iAngle = 0;
        switch (i) {
            case 0:
                iAngle = -60;
                break;
            case 1:
                iAngle = 60;
                break;
            case 2:
                break
        }

        return (
            <text key={i} x={nX} y={nY}
                fontSize='1.2rem'
                transform={`rotate(${iAngle} ${nX}, ${nY})`}
                textLength={'38px'}
            >
                z<tspan baselineShift="sub"
                    fontSize='0.6rem'
                >{i + 1}</tspan>=0
            </text>
        );
    }
    renderEdges() {
        return (
            <g strokeWidth='2' key='edges'>
                {[0, 1, 2].map(i => this._drawTriangleEdge(i))}
            </g>
        );
    }
    renderVertices() {
        return (
            <g key='verts'>
                {[0, 1, 2].map(i => this._drawTriangleVertices(i))}
            </g>
        );
    }
    _drawTriangleVertices(i: number) {
        let oSimplex = this._simplexObject;
        if (oSimplex === null) return;

        let aVerts = oSimplex.getVertices();
        if (oSimplex.checkVerticeInKSet(i)) {
            return (
                <circle key={i} cx={aVerts[i][0]} cy={aVerts[i][1]} r="5" fill='blue' />
            );
        }
        return null;
    }
    _drawTriangleEdge(i: number) {
        let oSimplex = this._simplexObject;
        if (oSimplex === null) return;

        let nFirst = (i + 1) % 3;
        let nSecond = (i + 2) % 3;
        let aVerts = oSimplex.getVertices();
        let oFVert = aVerts[nFirst];
        let oSVert = aVerts[nSecond];

        let sStroke = oSimplex.checkEdgeInKSet(i) ? CanvasColors.kSet : CanvasColors.simplex;
        return (
            <line key={i}
                x1={oFVert[0]} y1={oFVert[1]}
                x2={oSVert[0]} y2={oSVert[1]}
                stroke={sStroke} />
        );
    }
    renderTripleLine() {
        let oSimplex = this._simplexObject;
        if (oSimplex === null) return;

        let aPoints: Points;
        try {
            aPoints = oSimplex.getTripleCycleLineSegment() as Points;
        }
        catch (sErr) {
            return null;
        }

        let oFVert = aPoints[0];
        let oSVert = aPoints[1];
        return (
            <line key='triple-line' x1={oFVert[0]} y1={oFVert[1]}
                x2={oSVert[0]} y2={oSVert[1]}
                stroke={CanvasColors.tripleCycles}
                strokeWidth={2} />
        );
    }
}

export default DrawSimplex;