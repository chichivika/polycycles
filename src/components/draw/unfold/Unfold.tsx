import React from "react";
import createUnfoldObject from "utils/unfold/unfoldUtils";
import { renderPolygon, renderClosedPath, renderLines } from "utils/svgUtils";
import { Points } from "utils/drawUtils";

import './UnfoldStyle.scss';

type MyProps = {
    charNums: number[],
    isMonodromic: boolean,
    isFormError: boolean,
    size: number | null
};
type MyState = {

}
class Unfold extends React.Component<MyProps, MyState> {
    size: number = 400;
    innerPadding = 60;
    _unfoldObject: (ReturnType<typeof createUnfoldObject> | null) = null;
    render() {
        if (this.props.size === null) return null;

        this.size = this.props.size;
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
        let oTripleInfo = this._unfoldObject.getTripleLineInfo();
        return (
            <svg className={sClassName}
                width={this.size}
                height={this.size}>
                {this._renderAreas(oKSetInfo.areasVerts, oTripleInfo.areas)}
                {this._renderOuterTriangle()}
                {this._renderInnerLines()}
                {this._renderSpecialLines(oKSetInfo.segments, oTripleInfo.segments)}
            </svg>
        );
    }
    _getSVGClassName() {
        let sClassName = 'draw-graph draw-unfold';

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
    _renderAreas(aKVerts: Points[], aTripleVerts: Points[]) {
        let aKAreas = aKVerts.map(aPolygon => renderPolygon(aPolygon));
        let aTripleAreas = aTripleVerts.map(aPolygon => renderPolygon(aPolygon));
        return (
            <g key='areas'>
                <g key='k-area' className='draw-k-area'>
                    {aKAreas}
                </g>
                <g key='triple-area' className='draw-triple-area'>
                    {aTripleAreas}
                </g>
            </g>
        );
    }
    _renderSpecialLines(aKSegments: Points[], aTripleSegments: Points[]) {
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