import React from "react";
import { connect } from 'react-redux';
import {StateType} from 'appRedux/store';
import { Translation } from 'react-i18next';
import i18n from "locales/i18n";
import { selectCharNumbers } from "appRedux/drawSlice";

import './DrawCntStyle.scss';

type MyProps = {
    isMonodromic: boolean,
    charNums: number[]
};
type MyState = {

}
class DrawInfo extends React.Component<MyProps, MyState> {
    render() {
        return (
            <div className="draw-info">
                {this._renderInfo()}
            </div>
        )
    }
    _renderInfo(){
        return (
            <Translation>
                {
                    (t, { i18n }) =>
                        <span>{this._getText(t)}</span>
                }
            </Translation>
        );
    }
    _getText(t: (typeof i18n.t)){
        return `${t(this._getIsMonodromicKey())} ${t('drawInfo.charNums')} ${this._getNumsText()}.`;
    }
    _getIsMonodromicKey(){
        return this.props.isMonodromic ? 'drawInfo.isMonodromic' :  'drawInfo.notMonodromic';
    }
    _getNumsText(){
        return this.props.charNums.join(', ');
    }
}

const mapStateToProps = (oState:StateType) => {
    let oDrawState = oState.draw;
    return {
        isMonodromic: oDrawState.isMonodromic,
        charNums: selectCharNumbers(oState)
    }
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawInfo);