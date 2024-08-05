import React from "react";
import DrawWrapper from './DrawWrapper';
import DrawPolycycle from '../polycycle/ConnectedDrawPolycycle';

import { connect } from 'react-redux';
import { StateType } from "appRedux/store";

type MyProps = {
    isMonodromic: boolean
};
type MyState = {

}
class PolycycleWrapper extends React.Component<MyProps, MyState> {
    render() {
        return (
            <DrawWrapper labelKey='drawInfo.polycycle.label'
                    hoverKeys={this._getHoverKeys()}
                >
                    <DrawPolycycle />
                </DrawWrapper>
        )
    }
    _getHoverKeys(){
        if(this.props.isMonodromic)
        {
            return ['drawInfo.polycycle.monodromic.hover', 'drawInfo.polycycle.hover'];
        }

        return ['drawInfo.polycycle.notMonodromic.hover', 'drawInfo.polycycle.hover'];
    }
}

const mapStateToProps = (oState: StateType) => ({
    isMonodromic: oState.draw.isMonodromic
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PolycycleWrapper);