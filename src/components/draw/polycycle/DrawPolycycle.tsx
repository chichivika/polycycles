import React from "react";

type MyProps = {
    charNums: number[],
    isMonodromic: boolean,
    isFormError: boolean
};
type MyState = {

}
class DrawPolycycle extends React.Component<MyProps, MyState> {
    size: number = 300;
    paddingTop: number;
    textPadding:number;
    constructor(oProps: MyProps) {
        super(oProps);
        this.paddingTop = this.size * 0.2;
        this.textPadding = this.size * 0.1;
    }
    render() {
        if (this.props.isFormError) {
            return this._renderEmpty();
        }

        return (
            <svg className='draw-polycycle'
                width={this.size}
                height={this.size}>
                {this._renderPolycycle()}
                {this._renderCharNums()}
            </svg>
        );
    }
    _renderEmpty() {
        return (
            <svg className='draw-polycycle'
                width={this.size}
                height={this.size}>
                {this._renderPolycycle()}
                <rect className="draw-form-error-lid"
                    width={this.size}
                    height={this.size} />
            </svg>
        );
    }
    _renderCharNums() {
        let aNums = this.props.charNums;

        return aNums.map((nNum, i) => {
            let oPos = this._getCharNumTextPosition(i);
            return (
                <text key={i} x={oPos.x} y={oPos.y}>
                    {String(nNum)}
                </text>
            );
        });
    }
    _getCharNumTextPosition(i: number) {
        switch (i) {
            case 0:
                return {
                    x: this.size - 60,
                    y: this.size - 10
                };
            case 1:
                return  {
                    x:30,
                    y: this.size - 10
                };
            default:
                return  {
                    x: this.size/2 - 10,
                    y: 22
                };
        }
    }
    _renderPolycycle() {
        return (
            <image href={this._getImgSrc()}
                x={this.paddingTop / 2}
                y={this.paddingTop / 2}
                width={this.size - this.paddingTop}
                height={this.size - this.paddingTop} />
        );
    }
    _getImgSrc() {
        if (this.props.isMonodromic) {
            return './img/monodromial-polycycle.svg';
        }
        return './img/non-monodromial-polycycle.svg';
    }
}

export default DrawPolycycle;