import React from 'react';
import { connect } from 'react-redux';
import Checkbox from '../base/checkbox/Checkbox';
import { update as drawingUpdate } from '../../appRedux/drawSlice';
import { StateType } from '../../appRedux/store';
import { selectIsMonodromic } from '../../appRedux/drawSelectors';

import './IsMonodromicStyle.scss';

// =========================================
// Чекбокс для флага монодромности полицикла
// =========================================

type MyProps = {
    // Монодромный ли полицикл
    isMonodromic: boolean;
    // Обновление значения монодромности в глобальном хранилище
    dispatchUpdate: typeof drawingUpdate;
};
type MyState = {};
class Toolbar extends React.Component<MyProps, MyState> {
    render() {
        const { isMonodromic } = this.props;

        return (
            <div className='is-monodromic-wrapper'>
                <Checkbox
                    dataLabelKey='toolbar.isMonodromic'
                    className='is-monodromic-tool'
                    checked={isMonodromic}
                    onChange={this.onChange.bind(this)}
                />
            </div>
        );
    }

    // Обработчик события изменения флага в чекбоксе
    onChange() {
        const { dispatchUpdate, isMonodromic } = this.props;
        dispatchUpdate({
            isMonodromic: !isMonodromic,
        });
    }
}

const mapStateToProps = (state: StateType) => ({
    isMonodromic: selectIsMonodromic(state),
});

const mapDispatchToProps = { dispatchUpdate: drawingUpdate };

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
