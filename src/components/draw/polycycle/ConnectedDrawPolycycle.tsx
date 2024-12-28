import { connect } from 'react-redux';
import DrawPolycycle from './DrawPolycycle';
import { StateType } from '../../../appRedux/store';
import {
    selectCharNumbers,
    selectIsFormError,
    selectIsMonodromic,
} from '../../../appRedux/drawSelectors';
import { getPolycycleWidth } from '../../../appRedux/storeUtils';

// =========================================
// Привязанный схематичный рисунок полицикла
// =========================================

const mapStateToProps = (state: StateType) => {
    return {
        charNums: selectCharNumbers(state),
        isMonodromic: selectIsMonodromic(state),
        isFormError: selectIsFormError(state),
        size: getPolycycleWidth(),
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawPolycycle);
