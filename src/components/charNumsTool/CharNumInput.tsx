import React from 'react';
import HelpIcon from '@mui/icons-material/InfoTwoTone';
import Tooltip from '@mui/material/Tooltip';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import Input from '../base/input/Input';
import { StateType } from '../../appRedux/store';
import { selectInputSetting, updateCharNumber } from '../../appRedux/drawSlice';
import { CharNumInputState } from './utils';
import { charNumberIsValid } from '../../utils/appUtils';

// ========================================
// Поле ввода для характеристического числа
// ========================================

type OwnProps = {
    // Индекс поля ввода
    i: number;
};
type MyProps = OwnProps & {
    // Монодромный ли полицикл
    isMonodromic: boolean;
    // Значение поля ввода
    value: string;
    // Показывать ли ошибку в поле ввода
    error: boolean;
    // Обновление характеристического числа в глобальном хранилище
    dispatchUpdateInput: typeof updateCharNumber;
};
type MyState = {
    // Текущее значение поля ввода
    value: string;
};

class CharNumInput extends React.Component<MyProps, MyState> {
    constructor(oProps: MyProps) {
        super(oProps);

        const { value } = this.props;
        this.state = {
            value,
        };
    }

    render() {
        const oInput = this._renderInput();
        const { i, isMonodromic } = this.props;

        // В случае немонодромного полицикла, подсказываем,
        // какое из сёдел имеет противоположную ориентацию
        if (i !== 2 || isMonodromic) {
            return oInput;
        }

        return (
            <div className='char-num-input-wrapper'>
                {CharNumInput._renderInputHelpInfo()}
                {oInput}
            </div>
        );
    }

    componentDidUpdate(oPrevProps: Readonly<MyProps>): void {
        const { value } = this.props;

        if (oPrevProps.value !== value) {
            this.setState({
                value,
            });
        }
    }

    // Отрисовка поля ввода
    _renderInput() {
        const { value } = this.state;
        const { error } = this.props;
        return (
            <Input
                value={value}
                autoComplete='off'
                error={error}
                onKeyUp={this.onKeyUp.bind(this)}
                onChange={this.onChange.bind(this)}
                onBlur={this.onBlur.bind(this)}
                onFocus={this.onFocus.bind(this)}
            />
        );
    }

    // Отрисовка подсказки у поля ввода
    static _renderInputHelpInfo() {
        return (
            <Translation>
                {(t) => (
                    <Tooltip title={t('toolbar.charNumInputInfo')}>
                        <HelpIcon className='char-num-input-help' />
                    </Tooltip>
                )}
            </Translation>
        );
    }

    // Обработчик события отпускания клавиши
    onKeyUp(oEvent: React.KeyboardEvent) {
        const { value } = this.state;
        switch (oEvent.code) {
            case 'Enter':
                this._checkValueAndUpdate(value);
                break;
            case 'ArrowUp':
                this._increaseValue();
                break;
            case 'ArrowDown':
                this._decreaseValue();
                break;
            default:
                break;
        }
    }

    // Обработчик события изменения значения в текстовом поле
    onChange(oEvent: React.ChangeEvent<HTMLInputElement>) {
        const { value: sNewValue } = oEvent.target;
        const sNumber = CharNumInput._parseNumValue(sNewValue);
        this.setState({
            value: sNumber,
        });
    }

    // Обработчик события потери фокуса в текстовом поле
    onBlur(oEvent: React.FocusEvent<HTMLInputElement>) {
        const { value: sNumber } = oEvent.target;

        this._checkValueAndUpdate(sNumber);
    }

    // Обработчик события фокусировки ан текстовом поле
    onFocus() {
        const { value } = this.state;
        this._updateInputSetting({
            value,
            error: false,
        });
    }

    // Увеличить значение характеристического числа
    _increaseValue() {
        const { value } = this.state;
        const nNewValue = Number(value) + 0.1;
        if (Number.isNaN(nNewValue)) {
            return;
        }

        this._checkValueAndUpdate(nNewValue.toFixed(1));
    }

    // Уменьшить значение характеристического числа
    _decreaseValue() {
        const { value } = this.state;
        const nNewValue = Number(value) - 0.1;
        if (Number.isNaN(nNewValue) || nNewValue <= 0) {
            return;
        }

        this._checkValueAndUpdate(nNewValue.toFixed(1));
    }

    // Сформировать новые значения характеристического числа и необходимости показывать ошибку
    // для обновления в глобальном хранилище
    _checkValueAndUpdate(sNumber: string) {
        if (sNumber === '.') {
            this._updateInputSetting({
                value: '',
                error: true,
            });
            return;
        }

        const nNumber = Number(sNumber);
        this._updateInputSetting({
            value: String(nNumber),
            error: !charNumberIsValid(sNumber),
        });
    }

    // Обновить данные по характеристическому числу в глобальном хранилище
    _updateInputSetting(oSetting: CharNumInputState) {
        const { i, dispatchUpdateInput } = this.props;

        dispatchUpdateInput({
            charNumSetting: oSetting,
            i,
        });
    }

    // Преобразовать значение в текстовом поле при вводе
    static _parseNumValue(sNumber: string) {
        let sNewNumber = '';
        let bPoint = false;

        // eslint-disable-next-line no-restricted-syntax
        for (const sChar of sNumber) {
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
    const oCharNumSetting = selectInputSetting(oState.draw, oProps.i);
    return {
        isMonodromic: oState.draw.isMonodromic,
        error: oCharNumSetting.error,
        value: oCharNumSetting.value,
    };
};
const mapDispatchToProps = {
    dispatchUpdateInput: updateCharNumber,
};

export default connect(mapStateToProps, mapDispatchToProps)(CharNumInput);
