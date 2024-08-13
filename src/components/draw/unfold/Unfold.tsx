import React from "react";
import { renderPolygon, renderClosedPath, renderLines } from "utils/svgUtils";
import { Points,Segments } from "utils/drawUtils";
import { SetInfo } from "utils/unfold/unfoldUtils";

import './UnfoldStyle.scss';

//===========================
//Рисунок развертки полицикла
//===========================

type MyProps = {
    //Есть ли ошибка в полях ввода
    isFormError: boolean,
    //Размер рисунка
    size: number,
    //Координаты внешних вершин симплекса
    outerVerts: Points,
    //Сегменты линий внутри внешнего симплекса
    innerLines: Segments,
    //Информация о K-множестве
    kSet: SetInfo,
    //Информация о множестве трехкратных циклов
    tripleSet: SetInfo

};
type MyState = {

}
class Unfold extends React.Component<MyProps, MyState> {
    render() {
        //Если размер  рисунка еще не установлен,
        //ничего не рисуем
        if (this.props.size === 0) return null;

        //Если в полях ввода имеется ошибка
        if (this.props.isFormError) {
            return this._renderEmpty();
        }

        let sClassName = this._getSVGClassName();
        return (
            <svg className={sClassName}
                width={this.props.size}
                height={this.props.size}>
                {this._renderAreas()}
                {this._renderOuterTriangle()}
                {this._renderInnerLines()}
                {this._renderSpecialLines()}
            </svg>
        );
    }
    //Получить имя стилевого класса для рисунка
    _getSVGClassName() {
       return 'draw-graph draw-unfold';
    }
    //Отрисовать пустой вариант компонента
    _renderEmpty() {
        let sClassName = this._getSVGClassName();
        sClassName = sClassName.concat(' draw-form-error');
        return (
            <svg className={sClassName}
                width={this.props.size}
                height={this.props.size}>
                {this._renderOuterTriangle()}
                {this._renderInnerLines()}
                <rect className='draw-form-error-lid'
                    width={this.props.size}
                    height={this.props.size} />
            </svg>
        );
    }
    //Отрисовать внешний симплекс
    _renderOuterTriangle() {
        let aVerts = this.props.outerVerts;
        return (
            <g key='outer-triangle'>
                {renderClosedPath(aVerts)}
            </g>
        );
    }
    //Отрисовать сегменты линий внутри внешнего симплекса
    _renderInnerLines() {
        let aLines = this.props.innerLines;
        return (
            <g key='inner-triangle'>
                {renderLines(aLines)}
            </g>
        );
    }
    //Отрисовать закрашенные области
    _renderAreas() {
        let aKAreas = this.props.kSet.areas;
        let aKPolygons = aKAreas.map(aPolygon => renderPolygon(aPolygon))
        let aTripleAreas = this.props.tripleSet.areas;
        let aTriplePolygons = aTripleAreas.map(aPolygon => renderPolygon(aPolygon));

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
    //Отрисовать сегменты линий специальных множеств
    _renderSpecialLines() {
        let aKSegments = this.props.kSet.segments;
        let aTripleSegments = this.props.tripleSet.segments;
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