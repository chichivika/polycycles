import React from 'react';
import { Translation } from 'react-i18next';
import { Point, getDeltaPoints } from '../../../utils/drawUtils';
import ClassDiagram from '../../../utils/diagram/ClassDiagram';
import { EdgesPath } from '../../../utils/unfold/unfoldUtils';
import './DiagramStyle.scss';
import { getNumsMul } from '../../../utils/jsUtils';
import svgColors, { fontFamily } from '../../../styles/svgStyles';

// ==================================
// Бифуркационная диаграмма полицикла
// ==================================

type MyProps = {
    // Характеристические числа
    charNums: number[];
    // Есть ли ошибки в полях ввода
    isFormError: boolean;
    // Размер рисунка (сторона квадрата)
    size: number;
    // Пусть K-линии вдоль сторон симплекса
    edgesPath: EdgesPath;
    // Является ли набор характеристических чисел типичным
    isTypicalCase: boolean;
};
type MyState = {};
class DrawDiagram extends React.Component<MyProps, MyState> {
    // Нужно ли рисовать K-линию внутри круга
    _isInnerPath: boolean = false;

    // Объект класса ClassDiagram
    _diagramObject: ClassDiagram | null = null;

    render() {
        const { size, edgesPath, isFormError, isTypicalCase } = this.props;
        // Если ширина рисунка еще не рассчитана,
        // ничего не рисуем
        if (size === 0) {
            return null;
        }

        // Если в полях ввода есть ошибка
        if (isFormError) {
            return this._renderEmpty();
        }
        // Если набор чисел нетипичный
        if (!isTypicalCase) {
            this._isInnerPath = false;
            this._diagramObject = new ClassDiagram({
                path: [],
                size,
                isInnerPath: this._isInnerPath,
            });
            return this._renderNotTypicalCase();
        }

        let path = edgesPath;
        if (path.length < 2) {
            this._isInnerPath = false;
            path = [];
        } else {
            this._isInnerPath = this._getIsInnerPath();
        }

        this._diagramObject = new ClassDiagram({
            path,
            size,
            isInnerPath: this._isInnerPath,
        });

        return (
            <svg className='draw-graph draw-diagram' width={size} height={size}>
                {this._renderCircle()}
                {this._renderEdgesPath()}
                {this._renderDotsAndTexts()}
            </svg>
        );
    }

    // Отрисовка ломаной K-линии
    _renderEdgesPath() {
        const diagram = this._diagramObject;
        if (diagram === null) {
            return;
        }

        const arcs = diagram.getPathArcs();

        return (
            <g className='draw-k-set' stroke={svgColors.drawKSet} strokeWidth={2} fill='none'>
                {DrawDiagram._renderArcs(arcs)}
            </g>
        );
    }

    // Нужно ли рисовать K-линия внутри круга
    _getIsInnerPath() {
        const { charNums } = this.props;
        return getNumsMul(charNums) < 1;
    }

    // Отрисовать участки путей
    static _renderArcs(arcs: string[]) {
        return arcs.map((arc, i) => {
            // eslint-disable-next-line react/no-array-index-key
            return <path key={i} d={arc} />;
        });
    }

    // Отрисовать основной круг диаграммы
    _renderCircle() {
        const diagram = this._diagramObject;
        if (diagram === null) {
            return;
        }

        return (
            <circle
                className='draw-diagram-circle'
                cx={diagram.cx}
                cy={diagram.cy}
                r={diagram.radius}
                stroke={svgColors.drawBase}
                strokeWidth={2}
                fill='none'
            />
        );
    }

    // Отрисовать точки на диаграмме и подписи к ним
    _renderDotsAndTexts() {
        return (
            <g>
                {this._renderAllLDots()}
                {this._renderSLTexts()}
            </g>
        );
    }

    // Отрисовать подписи для всех SL-точек
    _renderSLTexts() {
        const diagram = this._diagramObject;
        if (diagram === null) {
            return;
        }

        const dots = diagram.getSLPoints();
        return dots.map((dot, i) => this._renderSLText(dot, i));
    }

    // Отрисовать подпись для одной SL-точки
    _renderSLText(dot: Point, i: number) {
        const diagram = this._diagramObject;
        if (diagram === null) {
            return;
        }

        const { cx, cy } = diagram;
        const tangent = getDeltaPoints(dot, [cx, cy]);

        const length = 32;
        const height = 15;
        const ratio = 0.25;

        const coeff = this._isInnerPath ? -1 : 1;
        return (
            <text
                key={i}
                className='draw-diagram-text draw-diagram-SL-text'
                color={svgColors.drawBase}
                fontSize='1.2rem'
                fontFamily={fontFamily}
                x={dot[0] + coeff * tangent[0] * ratio - length / 2}
                y={dot[1] + coeff * tangent[1] * ratio + height / 2}
            >
                SL
                <tspan baselineShift='sub' fontSize='0.8rem'>
                    {i + 1}
                </tspan>
            </text>
        );
    }

    // Отрисовать подписи для всех L-точек
    _renderAllLDots() {
        const diagram = this._diagramObject;
        if (diagram === null) {
            return;
        }

        const dots = diagram.getLPoints();
        return dots.map((dot, i) => this._renderLDot(dot, i));
    }

    // Отрисовать L-точку с подписью
    _renderLDot(dot: Point, i: number) {
        const diagram = this._diagramObject;
        if (diagram === null) {
            return;
        }

        let firstIndex = (i + 1) % 3;
        let secondIndex = (i + 2) % 3;
        if (firstIndex > secondIndex) {
            [firstIndex, secondIndex] = [secondIndex, firstIndex];
        }
        const subText = `${firstIndex + 1},${secondIndex + 1}`;

        const { cx, cy } = diagram;
        const tangent = getDeltaPoints(dot, [cx, cy]);

        const length = 32;
        const ratio = 0.25;
        const height = 15;

        const coeff = this._isInnerPath ? -1 : 1;
        return (
            <g key={i}>
                <circle
                    className='draw-diagram-dot'
                    cx={dot[0]}
                    cy={dot[1]}
                    r={5}
                    fill={svgColors.drawBase}
                    stroke='none'
                />
                <text
                    className='draw-diagram-text draw-diagram-L-text'
                    fontWeight='bold'
                    fontSize='1.2rem'
                    fontFamily={fontFamily}
                    textLength={length}
                    color={svgColors.drawBase}
                    x={dot[0] + coeff * tangent[0] * ratio - length / 2}
                    y={dot[1] + coeff * tangent[1] * ratio + height / 2}
                >
                    L
                    <tspan baselineShift='sub' fontSize='0.8rem'>
                        {subText}
                    </tspan>
                </text>
            </g>
        );
    }

    // Отрисовать пустой вариант компонента
    _renderEmpty() {
        const { size } = this.props;
        return (
            <svg className='draw-graph draw-diagram' width={size} height={size}>
                {this._renderCircle()}
                {this._renderDotsAndTexts()}
                <rect className='draw-form-error-lid' width={size} height={size} />
            </svg>
        );
    }

    // Отрисовать подпись в случае нетипичности
    static _renderNotTypicalText() {
        return (
            <Translation>
                {(t) => (
                    <text className='text-not-typical' x={40} y={40}>
                        {t('drawDiagram.notTypicalCase')}
                    </text>
                )}
            </Translation>
        );
    }

    // Отрисовать нетипичный вариант компонента
    _renderNotTypicalCase() {
        const { size } = this.props;
        return (
            <svg
                className='draw-graph draw-diagram draw-diagram-not-typical'
                width={size}
                height={size}
            >
                {this._renderCircle()}
                {this._renderDotsAndTexts()}
                {DrawDiagram._renderNotTypicalText()}
            </svg>
        );
    }
}

export default DrawDiagram;
