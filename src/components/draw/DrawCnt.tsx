import React from 'react';
import { connect } from 'react-redux';
import { update } from '../../appRedux/drawSlice';
import { selectIsTypicalCase, selectIsFormError } from '../../appRedux/drawSelectors';
import PolycycleWrapper from './drawWrapper/PolycycleWrapper';
import DrawSimplex from './simplex/ConnectedDrawSimplex';
import DrawUnfold from './unfold/ConnectedUnfold';
import Diagram from './diagram/ConnectedDiagram';
import DrawWrapper from './drawWrapper/DrawWrapper';
import { StateType } from '../../appRedux/store';

import './DrawCntStyle.scss';

// =====================
// Контейнер с рисунками
// =====================

type MyState = {};
type MyProps = {
    // Ширина окна
    windowWidth: number | null;
    // Обновление глобального хранилища
    dispatchUpdate: typeof update;
    isTypicalCase: boolean;
    isFormError: boolean;
};

class DrawCnt extends React.Component<MyProps, MyState> {
    // Ссылка на объемлющий контейнер
    _refContainer = React.createRef<HTMLDivElement>();

    render() {
        const { isTypicalCase, isFormError } = this.props;
        return (
            <div ref={this._refContainer} className='draw-container'>
                <PolycycleWrapper />

                <DrawWrapper
                    labelKey='drawInfo.simplex.label'
                    hoverKey='drawInfo.simplex.hover'
                    showDownload
                    downloadFileName='Simplex'
                    disabledDownload={isFormError}
                >
                    <DrawSimplex />
                </DrawWrapper>

                <DrawWrapper
                    labelKey='drawInfo.unfold.label'
                    hoverKey='drawInfo.unfold.hover'
                    showDownload
                    downloadFileName='Unfold'
                    disabledDownload={isFormError}
                >
                    <DrawUnfold />
                </DrawWrapper>

                <DrawWrapper
                    labelKey='drawInfo.diagram.label'
                    hoverKey='drawInfo.diagram.hover'
                    showDownload
                    disabledDownload={isFormError || !isTypicalCase}
                    downloadFileName='Diagram'
                >
                    <Diagram />
                </DrawWrapper>
            </div>
        );
    }

    componentDidMount(): void {
        this._resize();
    }

    componentDidUpdate(oPrevProps: Readonly<MyProps>): void {
        const { windowWidth } = this.props;

        if (oPrevProps.windowWidth !== windowWidth) {
            this._resize();
        }
    }

    // Обновить свойство ширины контейнера в глобальном хранилище
    _resize() {
        const cntRef = this._refContainer.current as HTMLDivElement;
        if (!cntRef) {
            return;
        }

        const width = cntRef.clientWidth;
        const { dispatchUpdate } = this.props;
        dispatchUpdate({
            drawCntWidth: width,
        });
    }
}

const mapStateToProps = (state: StateType) => {
    return {
        isTypicalCase: selectIsTypicalCase(state),
        isFormError: selectIsFormError(state),
    };
};
const mapDispatchToProps = {
    dispatchUpdate: update,
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawCnt);
