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

        return charNums.map((nNum, i) => {
            const oPos = this._getCharNumTextPosition(i, nNum);
            return (
                // eslint-disable-next-line react/no-array-index-key
                <text key={i} x={oPos.x} y={oPos.y}>
                    {oPos.value}
                </text>
            );
        });
    }

    // Получить настройки отображения характеристического числа на рисунке
    _getCharNumTextPosition(i: number, nNum: number) {
        const { size } = this.props;
        let sNum = String(nNum);
        let nLength = sNum.length;
        let nDots = 0;
        if (nLength > 4) {
            sNum = sNum.slice(0, 4);
            nLength = sNum.length;
            nDots = 1;
            if (sNum.at(-1) === '.') {
                sNum = `${sNum}..`;
            } else {
                sNum = `${sNum}...`;
            }
        }

        switch (i) {
            case 0:
                return {
                    x: size - 80 - nLength * 5 - nDots * 5,
                    y: size - 90,
                    value: sNum,
                };
            case 1:
                return {
                    x: 65,
                    y: size - 90,
                    value: sNum,
                };
            default:
                return {
                    x: size / 2 - nLength * 5 - nDots * 6,
                    y: 45,
                    value: sNum,
                };
        }
    }

    // Отрисовка полицикла
    _renderPolycycle() {
        const { size } = this.props;
        const nWindt = size - 2 * this.paddingLeft;
        const nHeight = (3 * size) / 4;
        return (
            <image
                href={this._getImgSrc()}
                x={this.paddingLeft}
                y={(size - nHeight) / 2}
                width={nWindt}
                height={nHeight}
            />
        );
    }

    // Получить путь к картинке полицикла
    _getImgSrc() {
        const { isMonodromic } = this.props;
        if (isMonodromic) {
            return './polycycles/img/monodromial-polycycle.svg';
        }
        return './polycycles/img/non-monodromial-polycycle.svg';
    }
}

export default DrawPolycycle;
