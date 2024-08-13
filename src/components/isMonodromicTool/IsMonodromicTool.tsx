import React from 'react';
import Checkbox from 'components/base/checkbox/Checkbox';

import { update as drawingUpdate } from 'appRedux/drawSlice';
import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';

import './IsMonodromicStyle.scss';

//=========================================
//Чекбокс для флага монодромности полицикла
//=========================================

type MyProps = {
    //Монодромный ли полицикл
    isMonodromic: boolean,
    //Обновление значения монодромности в глобальном хранилище
    dispatchUpdate: typeof drawingUpdate
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
    //Обработчик события изменения флага в чекбоксе
    onChange(oEvent: React.ChangeEvent<HTMLInputElement>) {
        this.props.dispatchUpdate({
            isMonodromic: !this.props.isMonodromic
        });
    }
    //Отрисовка иконки с миниатюрой полицикла
    _getIconSrc() {
        if (this.props.isMonodromic) {
            return './img/is-monodromic-icon.svg';
        }
        return './img/not-monodromic-icon.svg';
    }
}

const mapStateToProps = (oState: StateType) => ({
    isMonodromic: oState.draw.isMonodromic
});

const mapDispatchToProps = { dispatchUpdate: drawingUpdate };

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);