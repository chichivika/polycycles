import React from 'react';
import { connect } from 'react-redux';
import { StateType } from '../../../appRedux/store';
import DrawWrapper from './DrawWrapper';
import DrawPolycycle from '../polycycle/ConnectedDrawPolycycle';

// ==============================================================
// Обёртка с дополнительными инструментами для рисунка "Полицикл"
// ==============================================================

type MyProps = {
    // Монодромный ли полицикл
    isMonodromic: boolean;
};
type MyState = {};
class PolycycleWrapper extends React.Component<MyProps, MyState> {
    render() {
        return (
            <DrawWrapper labelKey='drawInfo.polycycle.label' hoverKeys={this._getHoverKeys()}>
                <DrawPolycycle />
            </DrawWrapper>
        );
    }

    // Получить массив путей в мультиязычной модели для пояснения к рисунку
    _getHoverKeys() {
        const { isMonodromic } = this.props;
        if (isMonodromic) {
            return ['drawInfo.polycycle.monodromic.hover', 'drawInfo.polycycle.hover'];
        }

        return ['drawInfo.polycycle.notMonodromic.hover', 'drawInfo.polycycle.hover'];
    }
}

const mapStateToProps = (state: StateType) => ({
    isMonodromic: state.draw.isMonodromic,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PolycycleWrapper);
