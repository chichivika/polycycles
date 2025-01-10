import React from 'react';
import HelpIcon from '@mui/icons-material/InfoTwoTone';
import { connect } from 'react-redux';
import Input from '../base/input/Input';
import { StateType } from '../../appRedux/store';
import { updateCharNumber } from '../../appRedux/drawSlice';
import { selectInputSetting, selectIsMonodromic } from '../../appRedux/drawSelectors';
import { CharNumInputState } from './utils';
import { charNumberIsValid } from '../../utils/appUtils';
import PopperInfo from '../base/popperInfo/PopperInfo';

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
    constructor(props: MyProps) {
        super(props);

        const { value } = this.props;
        this.state = {
            value,
        };
    }

    render() {
        const inputEl = this._renderInput();
        const { i, isMonodromic } = this.props;

        // В случае немонодромного полицикла, подсказываем,
        // какое из сёдел имеет противоположную ориентацию
        if (i !== 2 || isMonodromic) {
            return inputEl;
        }

        return (
            <div className='char-num-input-wrapper'>
                {CharNumInput._renderInputHelpInfo()}
                {inputEl}
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
            <PopperInfo
                className='char-num-input-help'
                textKey='toolbar.charNumInputInfo'
                icon={<HelpIcon />}
            />
        );
    }

    // Обработчик события отпускания клавиши
    onKeyUp(event: React.KeyboardEvent) {
        const { value } = this.state;
        switch (event.code) {
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
    onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value: newValue } = event.target;
        const newNumber = CharNumInput._parseNumValue(newValue);
        this.setState({
            value: newNumber,
        });
    }

    // Обработчик события потери фокуса в текстовом поле
    onBlur(event: React.FocusEvent<HTMLInputElement>) {
        const { value: newNumber } = event.target;

        this._checkValueAndUpdate(newNumber);
    }

    // Обработчик события фокусировки на текстовом поле
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
        const newValue = Number(value) + 0.1;
        if (Number.isNaN(newValue)) {
            return;
        }

        this._checkValueAndUpdate(newValue.toFixed(1));
    }

    // Уменьшить значение характеристического числа
    _decreaseValue() {
        const { value } = this.state;
        const newValue = Number(value) - 0.1;
        if (Number.isNaN(newValue) || newValue <= 0) {
            return;
        }

        this._checkValueAndUpdate(newValue.toFixed(1));
    }

    // Сформировать новые значения характеристического числа и необходимости показывать ошибку
    // для обновления в глобальном хранилище
    _checkValueAndUpdate(newValue: string) {
        if (newValue === '.') {
            this._updateInputSetting({
                value: '',
                error: true,
            });
            return;
        }

        const newNumber = Number(newValue);
        this._updateInputSetting({
            value: String(newNumber),
            error: !charNumberIsValid(newValue),
        });
    }

    // Обновить данные по характеристическому числу в глобальном хранилище
    _updateInputSetting(settings: CharNumInputState) {
        const { i, dispatchUpdateInput } = this.props;

        dispatchUpdateInput({
            i,
            charNumSetting: settings,
        });
    }

    // Преобразовать значение в текстовом поле при вводе
    static _parseNumValue(newValue: string) {
        let parsedNumber = '';
        let isFoundPoint = false;

        // eslint-disable-next-line no-restricted-syntax
        for (const char of newValue) {
            if (char === '.') {
                if (isFoundPoint) {
                    continue;
                }
                isFoundPoint = true;
                parsedNumber = parsedNumber.concat(char);
                continue;
            }
            if (!char.match(/[0-9]/)) {
                continue;
            }
            parsedNumber = parsedNumber.concat(char);
        }

        return parsedNumber;
    }
}

const mapStateToProps = (state: StateType, props: OwnProps) => {
    const charNumSettings = selectInputSetting(state, props.i);
    return {
        isMonodromic: selectIsMonodromic(state),
        error: charNumSettings.error,
        value: charNumSettings.value,
    };
};
const mapDispatchToProps = {
    dispatchUpdateInput: updateCharNumber,
};

export default connect(mapStateToProps, mapDispatchToProps)(CharNumInput);
