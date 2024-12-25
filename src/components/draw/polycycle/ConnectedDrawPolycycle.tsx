import { connect } from 'react-redux';
import DrawPolycycle from './DrawPolycycle';
import { StateType } from '../../../appRedux/store';
import {
    selectCharNumbers,
    selectIsFormError,
    selectPolycycleWidth,
} from '../../../appRedux/drawSlice';

// =========================================
// Привязанный схематичный рисунок полицикла
// =========================================

const mapStateToProps = (state: StateType) => {
    const { draw: drawState } = state;
    return {
        charNums: selectCharNumbers(drawState),
        isMonodromic: drawState.isMonodromic,
        isFormError: selectIsFormError(drawState),
        size: selectPolycycleWidth(),
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawPolycycle);
