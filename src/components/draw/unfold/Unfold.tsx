import React from "react";
import createUnfoldObject from "utils/unfold/unfoldUtils";
import { renderPolygon, renderClosedPath, renderLines } from "utils/svgUtils";
import { Points} from "utils/drawUtils";

import './UnfoldStyle.scss';

type MyProps = {
    charNums: number[],
    isMonodromic: boolean,
    isFormError: boolean
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
            size: this.size,
            paddingTop: this.size / 10,
            innerPadTop: this.innerPadding,
            charNums: this.props.charNums
        });
        if (this.props.isFormError) {
            return this._renderEmpty();
        }

        let sClassName = this._getSVGClassName();

        let oKSetInfo = this._unfoldObject.getKSetInfo();
        return (
            <svg className={sClassName}
                width={this.size}
                height={this.size}>
                {this._renderKAreas(oKSetInfo.areasVerts)}
                {this._renderOuterTriangle()}
                {this._renderInnerLines()}
                {this._renderKLine(oKSetInfo.segments)}
            </svg>
        );
    }
    _getSVGClassName() {
        let sClassName = 'draw-simplex draw-unfold';

        let oUnfold = this._unfoldObject;
        if (oUnfold === null) return sClassName;

        return sClassName;
    }
    _renderEmpty() {
        let sClassName = this._getSVGClassName();
        sClassName = sClassName.concat(' draw-form-error');
        return (
            <svg className={sClassName}
                width={this.size}
                height={this.size}>
                {this._renderOuterTriangle()}
                {this._renderInnerLines()}
                <rect className='draw-form-error-lid'
                    width={this.size}
                    height={this.size} />
            </svg>
        );
    }
    _renderOuterTriangle() {
        let oUnfold = this._unfoldObject;
        if (oUnfold === null) return;

        let aVerts = oUnfold.getOuterVerts();
        return (
            <g key='outer-triangle'>
                {renderClosedPath(aVerts)}
            </g>
        );
    }
    _renderInnerLines() {
        let oUnfold = this._unfoldObject;
        if (oUnfold === null) return;

        let aLines = oUnfold.getInnerLines();
        return (
            <g key='inner-triangle'>
                {renderLines(aLines)}
            </g>
        );
    }
    _renderKAreas(aPolygons: Points[]) {
        return aPolygons.map(aPolygon => {
            return (
                <g key='k-area' className='draw-k-area'>
                    {renderPolygon(aPolygon)}
                </g>
            );
        });
    }
    _renderKLine(aSegments: Points[]) {
        return (
            <g key='k-line' className='draw-k-set'>
                {renderLines(aSegments)}
            </g>
        );
    }
}

export default Unfold;