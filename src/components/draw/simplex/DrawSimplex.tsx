import React from "react";
import {
    SimplexVertsInfo,
    SimplexEdgesInfo,
    SimplexKSetAreasInfo,
    SimplexTripleSegment,
    SimplexEdgeInfo,
    SimplexVertInfo
} from "utils/simplex/simplexUtils";
import { getDeltaPoints, getOrtDeltaPoints, Points } from "utils/drawUtils";
import { renderClosedPath, renderPolygon, renderLine } from "utils/svgUtils";

type MyProps = {
    isFormError: boolean,
    size: number,
    vertsInfo: SimplexVertsInfo,
    verts: Points,
    edgesInfo: SimplexEdgesInfo,
    kSetAreas: SimplexKSetAreasInfo,
    tripleSegment: SimplexTripleSegment
};

class DrawSimplex extends React.Component<MyProps, {}> {
    paddingTop = 30;

    render() {

        if (this.props.isFormError) {
            return this._renderEmpty();
        }

        return (
            <svg className='draw-graph draw-simplex'
                width={this.props.size}
                height={this.props.size} >
                {this._renderKSetArea()}
                {this._renderEdges()}
                {this._renderVertices()}
                {this._renderTripleLine()}
                {this._renderTexts()}
            </svg >
        );
    }
    _renderEmpty() {
        return (
            <svg className='draw-graph draw-simplex draw-form-error'
                width={this.props.size}
                height={this.props.size}
            >
                {this._renderSimpleTriangle()}
                {this._renderTexts()}
                <rect className='draw-form-error-lid'
                    width={this.props.size}
                    height={this.props.size} />
            </svg>
        );
    }
    _renderKSetArea() {
        let aAreas = this.props.kSetAreas;
        return aAreas.map(aArea => renderPolygon(aArea, {
            className: 'draw-k-area'
        }));
    }
    _renderTexts() {
        return (
            <g key='edge-texts' fontWeight='normal'>
                {this.props.edgesInfo.map((oInfo,i) => this._renderEdgeText(oInfo,i))}
            </g>
        );
    }
    _renderSimpleTriangle() {
        let aVerts = this.props.verts;
        return renderClosedPath(aVerts);
    }
    _renderEdgeText(oEdgeInfo: SimplexEdgeInfo,i: number) {
        let aVerts = oEdgeInfo.points;

        let aFVert = aVerts[0];
        let aSVert = aVerts[1];
        if(i === 2){
            [aFVert,aSVert] = [aSVert,aFVert];
        }

        let aTangent = getDeltaPoints(aFVert, aSVert);
        let aUnionTangent = getOrtDeltaPoints(aFVert, aSVert);

        let aOrt = [aUnionTangent[1], -aUnionTangent[0]];

        let nX = aFVert[0] + aTangent[0] / 2 + 10 * aOrt[0] - 19 * aUnionTangent[0];
        let nY = aFVert[1] + aTangent[1] / 2 + 10 * aOrt[1] - 19 * aUnionTangent[1];

        let nAngle = 0;
        switch (i) {
            case 0:
                nAngle = -60;
                break;
            case 1:
                nAngle = 60;
                break;
        }

        return (
            <text key={i} x={nX} y={nY}
                fontSize='1.2rem'
                transform={`rotate(${nAngle} ${nX}, ${nY})`}
                textLength={'38px'}
            >
                z<tspan baselineShift="sub"
                    fontSize='0.6rem'
                >{i + 1}</tspan>=0
            </text>
        );
    }
    _renderEdges() {
        return (
            <g key='edges'>
                {this.props.edgesInfo.map((oEdge, i) =>
                    this._drawTriangleEdge(oEdge, i)
                )}
            </g>
        );
    }
    _renderVertices() {
        return (
            <g key='verts'>
                {this.props.vertsInfo.map((oVert, i) => this._drawTriangleVert(oVert, i))}
            </g>
        );
    }
    _renderTripleLine() {
        return renderLine(this.props.tripleSegment,
            { className: 'draw-triple-set' },
            `triple-line`);
    }
    _drawTriangleVert(oVertInfo: SimplexVertInfo, i: number) {
        if (oVertInfo.inKSet) {
            let aPoint = oVertInfo.point;
            return (
                <circle key={i} cx={aPoint[0]} cy={aPoint[1]} r="5" fill='blue' />
            );
        }
        return null;
    }
    _drawTriangleEdge(oEdgeInfo: SimplexEdgeInfo, i: number) {
        let aVerts = oEdgeInfo.points;
        let sClassName = oEdgeInfo.inKSet ? 'draw-k-set' : 'draw-simplex';
        return renderLine(aVerts, { className: sClassName }, `${i}`);
    }
}

export default DrawSimplex;