import React from "react";
import { Point, Points, getDeltaPoints } from "utils/drawUtils";
import ClassDiagram from "utils/diagram/ClassDiagram";
import { EdgesPath } from "utils/unfold/unfoldUtils";
import { Translation } from "react-i18next";

import './DiagramStyle.scss';
import { getNumsMul } from "utils/jsUtils";

//==================================
//Бифуркационная диаграмма полицикла
//==================================

type MyProps = {
    //Характеристические числа
    charNums: number[],
    //Монодромный ли полицикл
    isMonodromic: boolean,
    //Есть ли ошибки в полях ввода
    isFormError: boolean,
    //Размер рисунка (сторона квадрата)
    size: number,
    //Пусть K-линии вдоль сторон симплекса
    edgesPath: EdgesPath,
    //Является ли набор характеристических чисел типичным
    isTypicalCase: boolean
};
type MyState = {

}
class DrawDiagram extends React.Component<MyProps, MyState> {
    //Отступ диаграммы от края
    paddingLeft: number = 60;
    //Радиус круга
    _radius: number = 0;
    //Массив координат L-точек (лунок)
    _lPoints: Points = [];
    //Нужно ли рисовать K-линию внутри круга
    _isInnerPath: boolean = false;
    //Объект класса ClassDiagram
    _diagramObject: ClassDiagram | null = null;

    render() {

        //Если ширина рисунка еще не рассчитана,
        //ничего не рисуем
        if (this.props.size === 0) return null;

        //Если в полях ввода есть ошибка
        if (this.props.isFormError) {
            return this._renderEmpty();
        }
        //Если набор чисел нетипичный
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
    //Отрисовка ломаной K-линии
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
    //Нужно ли рисовать K-линия внутри круга
    _getIsInnerPath() {
        let aNums = this.props.charNums;
        let nMul = getNumsMul(aNums);
        return (nMul < 1);
    }
    //Отрисовать участки путей
    _renderArcs(aArcs: string[]) {
        return aArcs.map((sArc, i) => {
            return <path key={i} d={sArc} />
        });
    }
    //Отрисовать основной круг диаграммы
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
    //Отрисовать точки на диаграмме и подписи к ним
    _renderDotsAndTexts() {
        return (
            <g>
                {this._renderAllLDots()}
                {this._renderSLTexts()}
            </g>
        );
    }
    //Отрисовать подписи для всех SL-точек
    _renderSLTexts() {
        let oDiagram = this._diagramObject;
        if (oDiagram === null) return;

        let aDots = oDiagram.getSLPoints();
        return aDots.map((aDot, i) => this._renderSLText(aDot, i));
    }
    //Отрисовать подпись для одной SL-точки
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
    //Отрисовать подписи для всех L-точек
    _renderAllLDots() {
        let oDiagram = this._diagramObject;
        if (oDiagram === null) return;

        let aDots = oDiagram.getLPoints();
        return aDots.map((aDot, i) => this._renderLDot(aDot, i));
    }
    //Отрисовать L-точку с подписью
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
    //Отрисовать пустой вариант компонента
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
    //Отрисовать подпись в случае нетипичности
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
    //Отрисовать нетипичный вариант компонента
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