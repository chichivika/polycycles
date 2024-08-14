import React from 'react';
import CharNumInput from './CharNumInput';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import { selectIsInputErrorState } from 'appRedux/drawSlice';
import './CharNumsStyle.scss';

//==================================================
//Инструмент для ввода трех характеристических чисел
//==================================================

type MyProps = {
    //Показывается ли ошибка в одном из полей ввода
    isError?: boolean
}
class CharacterNumsTool extends React.Component<MyProps, {}> {
    render() {
        return (
            <div className='char-nums-tool'>
                {this._renderLabel()}
                <div className='char-nums-cnt'>
                    {this._renderInputs()}
                    {this._renderHelpText()}
                </div>
            </div>
        )
    }
    //Отрисовка названия инструмента
    _renderLabel() {
        return (
            <Translation>
                {
                    (t, { i18n }) =>
                        <span className='label-for-character-numbers'>{t('toolbar.characterNumbers')}</span>
                }
            </Translation>
        );
    }
    //Отрисовка полей ввода
    _renderInputs(){
        return (
            <div className='char-nums-inputs-cnt'>
                {[0,1,2].map(i=> <CharNumInput key={i} i={i}/> )}
            </div>
        );
    }
    //Отрисовка поясняющего текста об ошибке
    _renderHelpText() {
        if (!this.props.isError) {
            return null;
        }
    
        return (
            <div className='char-nums-help-text'>
                <Translation>
                    {
                        (t, { i18n }) =>
                            <span>{t('toolbar.charNumHelpText')}</span>
                    }
                </Translation>
            </div>
        );
    }
}

const mapStateToProps = (oState: StateType) => ({
    isError: selectIsInputErrorState(oState)
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CharacterNumsTool);