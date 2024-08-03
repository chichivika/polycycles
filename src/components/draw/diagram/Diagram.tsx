import React from "react";

type MyProps = {
    charNums: number[],
    isMonodromic: boolean,
    isFormError: boolean,
    size: number | null
};
type MyState = {

}
class DrawDiagram extends React.Component<MyProps, MyState> {
    size: number=0;
    paddingLeft:number = 60;
    render() {

        if(this.props.size === null)return null;

        this.size = this.props.size;
        if (this.props.isFormError) {
            return this._renderEmpty();
        }

        return (
            <svg className='draw-graph draw-polycycle'
                width={this.size}
                height={this.size}>
            </svg>
        );
    }
    _renderEmpty() {
        return (
            <svg className='draw-graph draw-polycycle'
                width={this.size}
                height={this.size}>
                <rect className="draw-form-error-lid"
                    width={this.size}
                    height={this.size} />
            </svg>
        );
    }
}

export default DrawDiagram;