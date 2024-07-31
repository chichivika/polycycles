import React from "react";
import createUnfoldObject from "utils/unfold/unfoldUtils";
import { renderPolygon, renderLines } from "utils/svgUtils";
import { Points } from "utils/drawUtils";

type MyProps = {
    charNums: number[],
    isMonodromic: boolean
};
type MyState = {

}
class Unfold extends React.Component<MyProps, MyState> {
    size: number = 400;
    innerPadding = 60;
    _unfoldObject: (ReturnType<typeof createUnfoldObject> | null) = null;
    render() {

        this._unfoldObject = createUnfoldObject({
            isMonodromic: this.props.isMonodromic,
            drawSetting: {
                size: this.size,
                paddingTop: this.size/10,
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
                {this._renderKLine()}
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
    _renderKLine(){
        let oUnfold = this._unfoldObject;
        if(oUnfold === null) return;

        let aLines = oUnfold.getKLineSegments() as Points[];
        return (
            <g key='k-line' stroke='blue' strokeWidth='2'>
                {renderLines(aLines)}
            </g>
        );
    }
}

export default Unfold;