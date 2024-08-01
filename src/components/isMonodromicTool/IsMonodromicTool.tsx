import React from 'react';
import Checkbox from 'components/base/checkbox/Checkbox';

import { update as drawingUpdate } from 'appRedux/drawSlice';
import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';

import './IsMonodromicStyle.scss';

type MyProps = {
    dispatchUpdate: typeof drawingUpdate,
    isMonodromic: boolean
};
type MyState = {
    
}
class Toolbar extends React.Component<MyProps, MyState> {
    render() {
        return (
            <div className='is-monodromic-wrapper'>
                <Checkbox dataLabelKey='toolbar.isMonodromic'
                    className='is-monodromic-tool'
                    checked={this.props.isMonodromic}
                    onChange={this.onChange.bind(this)}
                />
                {/* <img src={this._getIconSrc()} 
                alt='monodromial_polycycle' 
                height='30px' 
                width='30px' /> */}
            </div>
        )
    }
    onChange(oEvent: React.ChangeEvent<HTMLInputElement>) {
        this.props.dispatchUpdate({
            isMonodromic: !this.props.isMonodromic
        });
    }
    _getIconSrc() {
        if (this.props.isMonodromic) {
            return './img/is-monodromic-icon.svg';
        }
        return './img/not-monodromic-icon.svg';
    }
}

//Connected Component
const mapStateToProps = (oState: StateType) => ({
    isMonodromic: oState.draw.isMonodromic
});

const mapDispatchToProps = { dispatchUpdate: drawingUpdate };

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);