import React from 'react';
import Input from 'components/base/input/Input';
import HelpIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import { selectInputSetting, updateCharNumber } from 'appRedux/drawSlice';
import { CharNumInputState } from './utils';
import { charNumberIsValid } from 'utils/appUtils';

//========================================
//Поле ввода для характеристического числа
//========================================

type OwnProps = {
    //Индекс поля ввода
    i: number
}
type MyProps = OwnProps & {
    //Монодромный ли полицикл
    isMonodromic: boolean,
    //Значение поля ввода
    value: string,
    //Показывать ли ошибку в поле ввода
    error: boolean,
    //Обновление характеристического числа в глобальном хранилище
    dispatchUpdateInput: typeof updateCharNumber
}
type MyState = {
    //Текущее значение поля ввода
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
        let oInput = this._renderInput();

        //В случае немонодромного полицикла, подсказываем,
        //какое из сёдел имеет противоположную ориентацию
        if (this.props.i !== 2 || this.props.isMonodromic) {
            return oInput;
        }

        return (
            <div className='char-num-input-wrapper'>
                {this._renderInputHelpInfo()}
                {oInput}
            </div>
        );
    }
    componentDidUpdate(oPrevProps: Readonly<MyProps>, oPrevState: Readonly<MyState>): void {
        if (oPrevProps.value !== this.props.value) {
            this.setState({
                value: this.props.value
            });
        }
    }
    //Отрисовка поля ввода
    _renderInput() {

        return (
            <Input value={this.state.value}
                autoComplete={'off'}
                error={this.props.error}
                onKeyUp={this.onKeyUp.bind(this)}
                onChange={this.onChange.bind(this)}
                onBlur={this.onBlur.bind(this)}
                onFocus={this.onFocus.bind(this)}
            />
        );
    }
    //Отрисовка подсказки у поля ввода
    _renderInputHelpInfo() {
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
    //Обработчик события отпускания клавиши
    onKeyUp(oEvent: React.KeyboardEvent) {
        switch (oEvent.code) {
            case 'Enter':
                this._checkValueAndUpdate(this.state.value);
                break;
            case 'ArrowUp':
                this._increaseValue();
                break;
            case 'ArrowDown':
                this._decreaseValue();
                break;
        }
    }
    //Обработчик события изменения значения в текстовом поле
    onChange(oEvent: React.ChangeEvent<HTMLInputElement>) {
        let sNewValue = oEvent.target.value;
        let sNumber = this._parseNumValue(sNewValue);
        this.setState({
            value: sNumber
        });
    }
    //Обработчик события потери фокуса в текстовом поле
    onBlur(oEvent: React.FocusEvent<HTMLInputElement>) {
        let sNumber = oEvent.target.value;

        this._checkValueAndUpdate(sNumber);
    }
    //Обработчик события фокусировки ан текстовом поле
    onFocus(oEvent: React.FocusEvent<HTMLInputElement>) {
        this._updateInputSetting({
            value: this.state.value,
            error: false
        });
    }
    //Увеличить значение характеристического числа
    _increaseValue(){
        let sValue = this.state.value;
        let nNewValue = Number(sValue) + 0.1;
        if(isNaN(nNewValue)){return;}

        this._checkValueAndUpdate(nNewValue.toFixed(1));
    }
    //Уменьшить значение характеристического числа
    _decreaseValue(){
        let sValue = this.state.value;
        let nNewValue = Number(sValue) - 0.1;
        if(isNaN(nNewValue) || nNewValue<=0){return;}

        this._checkValueAndUpdate(nNewValue.toFixed(1));
    }
    //Сформировать новые значения характеристического числа и необходимости показывать ошибку
    //для обновления в глобальном хранилище
    _checkValueAndUpdate(sNumber: string) {
        if (sNumber === '.') {
            this._updateInputSetting({
                value: '',
                error: true
            });
            return;
        }

        let nNumber = Number(sNumber);
        this._updateInputSetting({
            value: String(nNumber),
            error: !charNumberIsValid(sNumber)
        });
    }
    //Обновить данные по характеристическому числу в глобальном хранилище
    _updateInputSetting(oSetting: CharNumInputState) {
        this.props.dispatchUpdateInput({
            charNumSetting: oSetting,
            i: this.props.i
        });
    }
    //Преобразовать значение в текстовом поле при вводе
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
        value: oCharNumSetting.value
    };
};
const mapDispatchToProps = {
    dispatchUpdateInput: updateCharNumber
};

export default connect(mapStateToProps, mapDispatchToProps)(CharNumInput);