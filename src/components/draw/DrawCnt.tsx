import React from 'react';
import PolycycleWrapper from './drawWrapper/PolycycleWrapper';
import DrawSimplex from './simplex/ConnectedDrawSimplex';
import DrawUnfold from './unfold/ConnectedUnfold';
import Diagram from './diagram/ConnectedDiagram';
import DrawWrapper from './drawWrapper/DrawWrapper';

import './DrawCntStyle.scss';

type MyState = {
    polycycle: DrawFixedParams,
    simplex: DrawFixedParams,
    unfold: DrawParams,
    diagram: DrawParams
}
type MyProps = {
    windowWidth: number | null
};

type DrawParams = {
    width: number | null
}
type DrawFixedParams = {
    width: number
}
type Setting = {
    minWidth: number,
    maxWidth: number
}
const oDrawSettings = {
    unfold: {
        minWidth: 300,
        maxWidth: 500
    },
    diagram: {
        minWidth: 300,
        maxWidth: 500
    }
}
const oInitialState = {
    polycycle: { width: 300 },
    simplex: { width: 300 },
    unfold: {
        width: null
    },
    diagram: {
        width: null
    }
};

class DrawCnt extends React.Component<MyProps, MyState> {
    _refContainer = React.createRef<HTMLDivElement>();
    constructor(oProps: MyProps) {
        super(oProps);
        this.state = { ...oInitialState };
    }
    render() {
        return (
            <div ref={this._refContainer}
                className='draw-container'>
                    
                <PolycycleWrapper/>

                <DrawWrapper labelKey='drawInfo.simplex.label'
                    hoverKey='drawInfo.simplex.hover'
                >
                    <DrawSimplex />
                </DrawWrapper>

                <DrawWrapper labelKey='drawInfo.unfold.label'
                    hoverKey='drawInfo.unfold.hover'
                >
                    <DrawUnfold size={this.state.unfold.width} />
                </DrawWrapper>

                <DrawWrapper labelKey='drawInfo.diagram.label'
                    hoverKey='drawInfo.diagram.hover'
                >
                    <Diagram size={this.state.diagram.width} />
                </DrawWrapper>
            </div>
        )
    }
    componentDidMount(): void {
        this._resize();
    }
    componentDidUpdate(oPrevProps: Readonly<MyProps>): void {
        if (oPrevProps.windowWidth !== this.props.windowWidth) {
            this._resize();
        }
    }
    _resize() {
        let oCont = this._refContainer.current as HTMLDivElement;
        if (!oCont) return;

        let oState = this.state;
        let nWidth = oCont.clientWidth;
        let nRest = nWidth - oState.polycycle.width - oState.simplex.width - 50;
        let nSize = nRest / 2;

        this.setState({
            unfold: { width: this._boundWidth(nSize, oDrawSettings.unfold) },
            diagram: { width: this._boundWidth(nSize, oDrawSettings.diagram) }
        });
    }
    _boundWidth(nWidth: number, oSetting: Setting) {
        if (!oSetting) { return nWidth; }
        if (nWidth < oSetting.minWidth) {
            return oSetting.minWidth;
        }
        if (nWidth > oSetting.maxWidth) {
            return oSetting.maxWidth;
        }
        return nWidth;
    }
}

export default DrawCnt;