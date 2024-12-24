import React from 'react';
import { renderPolygon, renderClosedPath, renderLines } from '../../../utils/svgUtils';
import { Points, Segments } from '../../../utils/drawUtils';
import { SetInfo } from '../../../utils/unfold/unfoldUtils';

import './UnfoldStyle.scss';

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
        // сли размер  рисунка еще не установлен,
        // ничего не рисуем
        if (size === 0) {
            return null;
        }

        // Если в полях ввода имеется ошибка
        if (isFormError) {
            return this._renderEmpty();
        }

        const sClassName = Unfold._getSVGClassName();
        return (
            <svg className={sClassName} width={size} height={size}>
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
        let sClassName = Unfold._getSVGClassName();
        sClassName = sClassName.concat(' draw-form-error');
        return (
            <svg className={sClassName} width={size} height={size}>
                {this._renderOuterTriangle()}
                {this._renderInnerLines()}
                <rect className='draw-form-error-lid' width={size} height={size} />
            </svg>
        );
    }

    // Отрисовать внешний симплекс
    _renderOuterTriangle() {
        const { outerVerts } = this.props;
        return <g key='outer-triangle'>{renderClosedPath(outerVerts)}</g>;
    }

    // Отрисовать сегменты линий внутри внешнего симплекса
    _renderInnerLines() {
        const { innerLines } = this.props;
        return <g key='inner-triangle'>{renderLines(innerLines)}</g>;
    }

    // Отрисовать закрашенные области
    _renderAreas() {
        const { kSet: oKSetData, tripleSet: oTripleSetData } = this.props;
        const { areas: aKAreas } = oKSetData;
        const aKPolygons = aKAreas.map((aPolygon) => renderPolygon(aPolygon));
        const { areas: aTripleAreas } = oTripleSetData;
        const aTriplePolygons = aTripleAreas.map((aPolygon) => renderPolygon(aPolygon));

        return (
            <g key='areas'>
                <g key='k-area' className='draw-k-area'>
                    {aKPolygons}
                </g>
                <g key='triple-area' className='draw-triple-area'>
                    {aTriplePolygons}
                </g>
            </g>
        );
    }

    // Отрисовать сегменты линий специальных множеств
    _renderSpecialLines() {
        const { kSet: oKSetData, tripleSet: oTripleSetData } = this.props;
        const { segments: aKSegments } = oKSetData;
        const { segments: aTripleSegments } = oTripleSetData;
        return (
            <g key='special-lines'>
                <g key='k-line' className='draw-k-set'>
                    {renderLines(aKSegments)}
                </g>
                <g key='triple-line' className='draw-triple-set'>
                    {renderLines(aTripleSegments)}
                </g>
            </g>
        );
    }
}

export default Unfold;
