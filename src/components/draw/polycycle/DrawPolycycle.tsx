import React from 'react';

// =============================
// Схематичный рисунок полицикла
// =============================

type MyProps = {
    // Характеристические числа
    charNums: number[];
    // Монодромный ли полицикл
    isMonodromic: boolean;
    // Есть ли ошибке в полях ввода
    isFormError: boolean;
    // Размер картинки
    size: number;
};
type MyState = {};
class DrawPolycycle extends React.Component<MyProps, MyState> {
    // Отступ полицикла от края рисунка
    paddingLeft: number = 10;

    render() {
        const { isFormError, size } = this.props;
        // Если есть ошибки в полях ввода
        if (isFormError) {
            return this._renderEmpty();
        }

        return (
            <svg className='draw-graph draw-polycycle' width={size} height={size}>
                {this._renderPolycycle()}
                {this._renderCharNums()}
            </svg>
        );
    }

    // Отрисовка пустого компонента в случае ошибки
    _renderEmpty() {
        const { size } = this.props;
        return (
            <svg className='draw-graph draw-polycycle' width={size} height={size}>
                {this._renderPolycycle()}
                <rect className='draw-form-error-lid' width={size} height={size} />
            </svg>
        );
    }

    // Отрисовка надписей характеристических чисел
    _renderCharNums() {
        const { charNums } = this.props;

        return charNums.map((num, i) => {
            const { x, y, textAnchor, value } = this._getCharNumTextPosition(i, num);
            return (
                // eslint-disable-next-line react/no-array-index-key
                <text key={i} x={x} y={y} textAnchor={textAnchor}>
                    {value}
                </text>
            );
        });
    }

    // Получить настройки отображения характеристического числа на рисунке
    _getCharNumTextPosition(i: number, charNum: number) {
        const { size } = this.props;
        let numValue = String(charNum);
        let numValueLength = numValue.length;

        if (numValueLength > 4) {
            numValue = numValue.slice(0, 4);
            numValueLength = numValue.length;
            if (numValue.at(-1) === '.') {
                numValue = `${numValue}..`;
            } else {
                numValue = `${numValue}...`;
            }
        }

        switch (i) {
            case 0:
                return {
                    x: size - 65,
                    y: size - 90,
                    value: numValue,
                    textAnchor: 'end',
                };
            case 1:
                return {
                    x: 60,
                    y: size - 90,
                    value: numValue,
                    textAnchor: 'start',
                };
            default:
                return {
                    x: size / 2,
                    y: 45,
                    value: numValue,
                    textAnchor: 'middle',
                };
        }
    }

    // Отрисовка полицикла
    _renderPolycycle() {
        const { size } = this.props;
        const width = size - 2 * this.paddingLeft;
        const height = (3 * size) / 4;
        return (
            <image
                href={this._getImgSrc()}
                x={this.paddingLeft}
                y={(size - height) / 2}
                width={width}
                height={height}
            />
        );
    }

    // Получить путь к картинке полицикла
    _getImgSrc() {
        const { isMonodromic } = this.props;
        const publicUrl = process.env.PUBLIC_URL;
        if (isMonodromic) {
            return `${publicUrl}/img/monodromial-polycycle.svg`;
        }
        return `${publicUrl}/img/non-monodromial-polycycle.svg`;
    }
}

export default DrawPolycycle;
