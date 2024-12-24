import React from 'react';
import {
    SimplexVertsInfo,
    SimplexEdgesInfo,
    SimplexKSetAreasInfo,
    SimplexTripleSegment,
    SimplexEdgeInfo,
    SimplexVertInfo,
} from '../../../utils/simplex/simplexUtils';
import { getDeltaPoints, getOrtDeltaPoints, Points } from '../../../utils/drawUtils';
import { renderClosedPath, renderPolygon, renderLine } from '../../../utils/svgUtils';

// ===========================
// Рисунок симплекса полицикла
// ===========================

type MyProps = {
    // Есть ли ошибка в полях ввода
    isFormError: boolean;
    // Размер рисунка
    size: number;
    // Массив вершин симплекса с дополнительной информацией
    vertsInfo: SimplexVertsInfo;
    // Массив координат вершин симплекса
    verts: Points;
    // Массив сторон симплекса с дополнительной информацией
    edgesInfo: SimplexEdgesInfo;
    // Области K-множества
    kSetAreas: SimplexKSetAreasInfo;
    // Сегмент прямой трехкратных циклов
    tripleSegment: SimplexTripleSegment;
};

class DrawSimplex extends React.Component<MyProps, {}> {
    render() {
        const { isFormError, size } = this.props;
        // Если в полях ввода есть ошибка
        if (isFormError) {
            return this._renderEmpty();
        }

        return (
            <svg className='draw-graph draw-simplex' width={size} height={size}>
                {this._renderKSetArea()}
                {this._renderEdges()}
                {this._renderVertices()}
                {this._renderTripleLine()}
                {this._renderTexts()}
            </svg>
        );
    }

    // Отрисовка пустого варианта при наличии ошибки
    _renderEmpty() {
        const { size } = this.props;
        return (
            <svg className='draw-graph draw-simplex draw-form-error' width={size} height={size}>
                {this._renderSimpleTriangle()}
                {this._renderTexts()}
                <rect className='draw-form-error-lid' width={size} height={size} />
            </svg>
        );
    }

    // Отрисовка областей K-множества
    _renderKSetArea() {
        const { kSetAreas: aAreas } = this.props;
        return aAreas.map((aArea, iIndex) =>
            renderPolygon(
                aArea,
                {
                    className: 'draw-k-area',
                },
                `${iIndex}`,
            ),
        );
    }

    // Отрисовка подписей для сторон
    _renderTexts() {
        const { edgesInfo } = this.props;
        return (
            <g key='edge-texts' fontWeight='normal'>
                {edgesInfo.map((oInfo, i) => DrawSimplex._renderEdgeText(oInfo, i))}
            </g>
        );
    }

    // Отрисовка симплекса без дополнительной информации
    _renderSimpleTriangle() {
        const { verts: aVerts } = this.props;
        return renderClosedPath(aVerts);
    }

    // Отрисовка подписи для одной стороны симплекса
    static _renderEdgeText(oEdgeInfo: SimplexEdgeInfo, i: number) {
        const aVerts = oEdgeInfo.points;

        let aFVert = aVerts[0];
        let aSVert = aVerts[1];
        if (i === 2) {
            [aFVert, aSVert] = [aSVert, aFVert];
        }

        const aTangent = getDeltaPoints(aFVert, aSVert);
        const aUnionTangent = getOrtDeltaPoints(aFVert, aSVert);

        const aOrt = [aUnionTangent[1], -aUnionTangent[0]];

        const nX = aFVert[0] + aTangent[0] / 2 + 10 * aOrt[0] - 19 * aUnionTangent[0];
        const nY = aFVert[1] + aTangent[1] / 2 + 10 * aOrt[1] - 19 * aUnionTangent[1];

        let nAngle = 0;
        switch (i) {
            case 0:
                nAngle = -60;
                break;
            case 1:
                nAngle = 60;
                break;
            default:
                nAngle = 0;
        }

        return (
            <text
                key={i}
                x={nX}
                y={nY}
                fontSize='1.2rem'
                transform={`rotate(${nAngle} ${nX}, ${nY})`}
                textLength='38px'
            >
                z
                <tspan baselineShift='sub' fontSize='0.6rem'>
                    {i + 1}
                </tspan>
                =0
            </text>
        );
    }

    // Отрисовка всех сторон симплекса
    _renderEdges() {
        const { edgesInfo } = this.props;
        return (
            <g key='edges'>
                {edgesInfo.map((oEdge, i) => DrawSimplex._drawTriangleEdge(oEdge, i))}
            </g>
        );
    }

    // Отрисовка всех вершин симплекса
    _renderVertices() {
        const { vertsInfo } = this.props;
        return (
            <g key='verts'>
                {vertsInfo.map((oVert, i) => DrawSimplex._renderTriangleVert(oVert, i))}
            </g>
        );
    }

    // Отрисовка сегмента прямой трехкратных циклов
    _renderTripleLine() {
        const { tripleSegment } = this.props;
        return renderLine(tripleSegment, { className: 'draw-triple-set' }, 'triple-line');
    }

    // Отрисовка одной вершины симплекса
    static _renderTriangleVert(oVertInfo: SimplexVertInfo, i: number) {
        if (oVertInfo.inKSet) {
            const aPoint = oVertInfo.point;
            return <circle key={i} cx={aPoint[0]} cy={aPoint[1]} r='5' fill='blue' />;
        }
        return null;
    }

    // Отрисовка одной стороны симплекса
    static _drawTriangleEdge(oEdgeInfo: SimplexEdgeInfo, i: number) {
        const aVerts = oEdgeInfo.points;
        const sClassName = oEdgeInfo.inKSet ? 'draw-k-set' : 'draw-simplex';
        return renderLine(aVerts, { className: sClassName }, `${i}`);
    }
}

export default DrawSimplex;
