import React from 'react';
import Input from 'components/base/input/Input';
import HelpIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import { selectInputSetting, selectIsError } from 'appRedux/drawSlice';
import { updateCharNumber } from 'appRedux/drawSlice';
import { CharNumInputState } from './utils';

type OwnProps = {
    i: number
}
type MyProps = OwnProps & {
    isMonodromic: boolean,
    value: string,
    error: boolean,
    isFormError: boolean,
    dispatchUpdateInput: typeof updateCharNumber
}
type MyState = {
    value: string
};

class CharNumInput extends React.Component<MyProps, MyState> {
    constructor(oProps: MyProps) {
        super(oProps);

        this.state = {
            value: this.props.value
        };
    }
    render() {
        let oInput = this.renderInput();

        if (this.props.i !== 0 || this.props.isMonodromic) {
            return oInput;
        }

        return (
            <div className='char-num-input-wrapper'>
                {this.renderInputHelpInfo()}
                {oInput}
            </div>
        );
    }
    componentDidUpdate(oPrevProps: Readonly<MyProps>, oPrevState: Readonly<MyState>): void {
        if(oPrevProps.value !== this.props.value){
            this.setState({
                value: this.props.value
            });
        }
    }
    renderInput() {

        return (
            <Input value={this.state.value}
                error={this.props.error}
                onKeyUp={this.onKeyUp.bind(this)}
                onChange={this.onChange.bind(this)}
                onBlur={this.onBlur.bind(this)}
                onFocus={this.onFocus.bind(this)}
            />
        );
    }
    renderInputHelpInfo() {
        return (
            <Translation>
                {
                    (t, { i18n }) =>
                        <Tooltip title={t('toolbar.charNumInputInfo')}>
                            <HelpIcon className='char-num-input-help' />
                        </Tooltip>
                }
            </Translation>
        );
    }
    onKeyUp(oEvent: React.KeyboardEvent){
        if(oEvent.code !== 'Enter'){
            return;
        }
        this._checkValueAndUpdate(this.state.value);
    }
    onChange(oEvent: React.ChangeEvent<HTMLInputElement>) {
        let sNewValue = oEvent.target.value;
        let sNumber = this._parseNumValue(sNewValue);
        this.setState({
            value: sNumber
        });
    }
    onBlur(oEvent: React.FocusEvent<HTMLInputElement>) {
        let sNumber = oEvent.target.value;

        this._checkValueAndUpdate(sNumber);
    }
    onFocus() {
        this._updateInputSetting({
            value: this.state.value,
            error: false
        });
    }
    _checkValueAndUpdate(sNumber: string){
        if (sNumber === '.') {
            this._updateInputSetting({
                value: '',
                error: true
            });
            return;
        }

        let bError = false;
        let nNumber = Number(sNumber);
        if(nNumber === 0){
            bError = true;
        }
        this._updateInputSetting({
            value: String(nNumber),
            error: bError
        });
    }
    _updateInputSetting(oSetting: CharNumInputState){
        this.props.dispatchUpdateInput({
            charNumSetting: oSetting,
            i: this.props.i
        });
    }
    _parseNumValue(sNumber: string) {
        let sNewNumber = '';
        let bPoint = false;
        for (let sChar of sNumber) {
            if (sChar === '.') {
                if (bPoint) {
                    continue;
                }
                bPoint = true;
                sNewNumber = sNewNumber.concat(sChar);
                continue;
            }
            if (!sChar.match(/[0-9]/)) {
                continue;
            }
            sNewNumber = sNewNumber.concat(sChar);
        }
        return sNewNumber;
    }
}

const mapStateToProps = (oState: StateType, oProps: OwnProps) => {
    let oCharNumSetting = selectInputSetting(oState, oProps.i);
    return {
        isMonodromic: oState.draw.isMonodromic,
        error: oCharNumSetting.error,
        value: oCharNumSetting.value,
        isFormError: selectIsError(oState)
    };
};
const mapDispatchToProps = {
    dispatchUpdateInput: updateCharNumber
};

export default connect(mapStateToProps, mapDispatchToProps)(CharNumInput);