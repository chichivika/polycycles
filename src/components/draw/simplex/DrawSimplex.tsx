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
        const { kSetAreas } = this.props;
        return kSetAreas.map((kSetArea, iIndex) =>
            renderPolygon(
                kSetArea,
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
        const { verts } = this.props;
        return renderClosedPath(verts);
    }

    // Отрисовка подписи для одной стороны симплекса
    static _renderEdgeText(edgeInfo: SimplexEdgeInfo, i: number) {
        const verts = edgeInfo.points;

        let firstVert = verts[0];
        let secondVert = verts[1];
        if (i === 2) {
            [firstVert, secondVert] = [secondVert, firstVert];
        }

        const tangent = getDeltaPoints(firstVert, secondVert);
        const unionTangent = getOrtDeltaPoints(firstVert, secondVert);

        const ort = [unionTangent[1], -unionTangent[0]];

        const x = firstVert[0] + tangent[0] / 2 + 10 * ort[0] - 19 * unionTangent[0];
        const y = firstVert[1] + tangent[1] / 2 + 10 * ort[1] - 19 * unionTangent[1];

        let angle = 0;
        switch (i) {
            case 0:
                angle = -60;
                break;
            case 1:
                angle = 60;
                break;
            default:
                angle = 0;
        }

        return (
            <text
                key={i}
                x={x}
                y={y}
                fontSize='1.2rem'
                transform={`rotate(${angle} ${x}, ${y})`}
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
            <g key='edges'>{edgesInfo.map((edge, i) => DrawSimplex._drawTriangleEdge(edge, i))}</g>
        );
    }

    // Отрисовка всех вершин симплекса
    _renderVertices() {
        const { vertsInfo } = this.props;
        return (
            <g key='verts'>
                {vertsInfo.map((vert, i) => DrawSimplex._renderTriangleVert(vert, i))}
            </g>
        );
    }

    // Отрисовка сегмента прямой трехкратных циклов
    _renderTripleLine() {
        const { tripleSegment } = this.props;
        return renderLine(tripleSegment, { className: 'draw-triple-set' }, 'triple-line');
    }

    // Отрисовка одной вершины симплекса
    static _renderTriangleVert(vertInfo: SimplexVertInfo, i: number) {
        if (vertInfo.inKSet) {
            const { point } = vertInfo;
            return <circle key={i} cx={point[0]} cy={point[1]} r='5' fill='blue' />;
        }
        return null;
    }

    // Отрисовка одной стороны симплекса
    static _drawTriangleEdge(edgeInfo: SimplexEdgeInfo, i: number) {
        const verts = edgeInfo.points;
        const className = edgeInfo.inKSet ? 'draw-k-set' : 'draw-simplex';
        return renderLine(verts, { className }, `${i}`);
    }
}

export default DrawSimplex;
