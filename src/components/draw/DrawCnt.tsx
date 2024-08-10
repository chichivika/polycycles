import React from 'react';
import PolycycleWrapper from './drawWrapper/PolycycleWrapper';
import DrawSimplex from './simplex/ConnectedDrawSimplex';
import DrawUnfold from './unfold/ConnectedUnfold';
import Diagram from './diagram/ConnectedDiagram';
import DrawWrapper from './drawWrapper/DrawWrapper';

import { connect } from 'react-redux';
import { update } from 'appRedux/drawSlice';
import './DrawCntStyle.scss';

type MyState = {}
type MyProps = {
    windowWidth: number | null,
    dispatchUpdate: typeof update
};

class DrawCnt extends React.Component<MyProps, MyState> {
    _refContainer = React.createRef<HTMLDivElement>();
    render() {
        return (
            <div ref={this._refContainer}
                className='draw-container'>
                    
                <PolycycleWrapper/>

                <DrawWrapper labelKey='drawInfo.simplex.label'
                    hoverKey='drawInfo.simplex.hover'
                >
                    <DrawSimplex/>
                </DrawWrapper>

                <DrawWrapper labelKey='drawInfo.unfold.label'
                    hoverKey='drawInfo.unfold.hover'
                >
                    <DrawUnfold/>
                </DrawWrapper>

                <DrawWrapper labelKey='drawInfo.diagram.label'
                    hoverKey='drawInfo.diagram.hover'
                >
                    <Diagram/>
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
        let nWidth = oCont.clientWidth;
        this.props.dispatchUpdate({
            drawCntWidth: nWidth
        });
    }
}

const mapStateToProps = () => ({
});
const mapDispatchToProps = {
    dispatchUpdate: update
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawCnt);