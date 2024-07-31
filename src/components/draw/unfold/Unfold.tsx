import React from "react";
import createUnfoldObject from "utils/unfold/unfoldUtils";
import { renderPolygon, renderLines } from "utils/svgUtils";

type MyProps = {
    charNums: number[],
    isMonodromic: boolean
};
type MyState = {

}
class Unfold extends React.Component<MyProps, MyState> {
    size: number = 400;
    paddingTop = 40;
    innerPadding = 60;
    _unfoldObject: (ReturnType<typeof createUnfoldObject> | null) = null;
    render() {

        this._unfoldObject = createUnfoldObject({
            isMonodromic: this.props.isMonodromic,
            drawSetting: {
                size: this.size,
                paddingTop: this.paddingTop,
                innerPadTop: this.innerPadding,
                charNums: this.props.charNums
            }
        });

        return (
            <svg className='draw-simplex'
                width={this.size}
                height={this.size}>
                {this._renderOuterTriangle()}
                {this._renderInnerLines()}
            </svg>
        );
    }
    _renderOuterTriangle(){
        let oUnfold = this._unfoldObject;
        if(oUnfold === null) return;

        let aVerts = oUnfold.getOuterVerts();
        return (
            <g key='outer-triangle' stroke='black' strokeWidth='2'>
                {renderPolygon(aVerts)}
            </g>
        );
    }
    _renderInnerLines(){
        let oUnfold = this._unfoldObject;
        if(oUnfold === null) return;

        let aLines = oUnfold.getInnerLines();
        return (
            <g key='inner-triangle' stroke='black' strokeWidth='2'>
                {renderLines(aLines)}
            </g>
        );
    }
}

export default Unfold;