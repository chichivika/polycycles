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

const mapStateToProps = (oState: StateType) => {
    return {
        charNums: selectCharNumbers(oState.draw),
        isMonodromic: oState.draw.isMonodromic,
        isFormError: selectIsFormError(oState.draw),
        size: selectPolycycleWidth(),
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawPolycycle);
