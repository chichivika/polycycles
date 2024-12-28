import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import CharNumInput from './CharNumInput';
import { StateType } from '../../appRedux/store';
import { selectIsInputErrorState } from '../../appRedux/drawSelectors';
import './CharNumsStyle.scss';

// ==================================================
// Инструмент для ввода трех характеристических чисел
// ==================================================

type MyProps = {
    // Показывается ли ошибка в одном из полей ввода
    isError?: boolean;
};
class CharacterNumsTool extends React.Component<MyProps, {}> {
    render() {
        return (
            <div className='char-nums-tool'>
                {CharacterNumsTool._renderLabel()}
                <div className='char-nums-cnt'>
                    {CharacterNumsTool._renderInputs()}
                    {this._renderHelpText()}
                </div>
            </div>
        );
    }

    // Отрисовка названия инструмента
    static _renderLabel() {
        return (
            <Translation>
                {(t) => (
                    <span className='label-for-character-numbers'>
                        {t('toolbar.characterNumbers')}
                    </span>
                )}
            </Translation>
        );
    }

    // Отрисовка полей ввода
    static _renderInputs() {
        return (
            <div className='char-nums-inputs-cnt'>
                {[0, 1, 2].map((i) => (
                    <CharNumInput key={i} i={i} />
                ))}
            </div>
        );
    }

    // Отрисовка поясняющего текста об ошибке
    _renderHelpText() {
        const { isError } = this.props;
        if (!isError) {
            return null;
        }

        return (
            <div className='char-nums-help-text'>
                <Translation>{(t) => <span>{t('toolbar.charNumHelpText')}</span>}</Translation>
            </div>
        );
    }
}

const mapStateToProps = (state: StateType) => ({
    isError: selectIsInputErrorState(state),
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CharacterNumsTool);
