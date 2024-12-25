import React from 'react';
import { renderPolygon, renderClosedPath, renderLines } from '../../../utils/svgUtils';
import { Points, Segments } from '../../../utils/drawUtils';
import { SetInfo } from '../../../utils/unfold/unfoldUtils';
import svgColors, { fillOpacity, strokeWidth } from '../../../styles/svgStyles';

// ===========================
// Рисунок развертки полицикла
// ===========================

type MyProps = {
    // Есть ли ошибка в полях ввода
    isFormError: boolean;
    // Размер рисунка
    size: number;
    // Координаты внешних вершин симплекса
    outerVerts: Points;
    // Сегменты линий внутри внешнего симплекса
    innerLines: Segments;
    // Информация о K-множестве
    kSet: SetInfo;
    // Информация о множестве трехкратных циклов
    tripleSet: SetInfo;
};
type MyState = {};
class Unfold extends React.Component<MyProps, MyState> {
    render() {
        const { size, isFormError } = this.props;
        // если размер  рисунка еще не установлен,
        // ничего не рисуем
        if (size === 0) {
            return null;
        }

        // Если в полях ввода имеется ошибка
        if (isFormError) {
            return this._renderEmpty();
        }

        const className = Unfold._getSVGClassName();
        return (
            <svg className={className} width={size} height={size}>
                {this._renderAreas()}
                {this._renderOuterTriangle()}
                {this._renderInnerLines()}
                {this._renderSpecialLines()}
            </svg>
        );
    }

    // Получить имя стилевого класса для рисунка
    static _getSVGClassName() {
        return 'draw-graph draw-unfold';
    }

    // Отрисовать пустой вариант компонента
    _renderEmpty() {
        const { size } = this.props;
        let className = Unfold._getSVGClassName();
        className = className.concat(' draw-form-error');
        return (
            <svg className={className} width={size} height={size}>
                {this._renderOuterTriangle()}
                {this._renderInnerLines()}
                <rect className='draw-form-error-lid' width={size} height={size} />
            </svg>
        );
    }

    // Отрисовать внешний симплекс
    _renderOuterTriangle() {
        const { outerVerts } = this.props;
        return (
            <g key='outer-triangle'>
                {renderClosedPath(outerVerts, { stroke: svgColors.drawBase, strokeWidth })}
            </g>
        );
    }

    // Отрисовать сегменты линий внутри внешнего симплекса
    _renderInnerLines() {
        const { innerLines } = this.props;
        return (
            <g key='inner-triangle'>
                {renderLines(innerLines, { stroke: svgColors.drawBase, strokeWidth })}
            </g>
        );
    }

    // Отрисовать закрашенные области
    _renderAreas() {
        const { kSet, tripleSet } = this.props;
        const { areas: kAreas } = kSet;
        const kPolygons = kAreas.map((polygon) =>
            renderPolygon(polygon, { fill: svgColors.drawKArea, fillOpacity }),
        );
        const { areas: tripleAreas } = tripleSet;
        const triplePolygons = tripleAreas.map((polygon) =>
            renderPolygon(polygon, { fill: svgColors.drawTripleArea, fillOpacity }),
        );

        return (
            <g key='areas'>
                <g key='k-area' className='draw-k-area'>
                    {kPolygons}
                </g>
                <g key='triple-area' className='draw-triple-area'>
                    {triplePolygons}
                </g>
            </g>
        );
    }

    // Отрисовать сегменты линий специальных множеств
    _renderSpecialLines() {
        const { kSet, tripleSet } = this.props;
        const { segments: kSegments } = kSet;
        const { segments: tripleSegments } = tripleSet;
        return (
            <g key='special-lines'>
                <g key='k-line' className='draw-k-set'>
                    {renderLines(kSegments, { stroke: svgColors.drawKSet, strokeWidth })}
                </g>
                <g key='triple-line' className='draw-triple-set'>
                    {renderLines(tripleSegments, {
                        stroke: svgColors.drawTripleSet,
                        strokeWidth,
                    })}
                </g>
            </g>
        );
    }
}

export default Unfold;
