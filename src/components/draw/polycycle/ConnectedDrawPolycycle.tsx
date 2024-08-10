import DrawPolycycle from './DrawPolycycle';

import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import {
    selectCharNumbers,
    selectIsFormError,
    selectPolycycleWidth
} from 'appRedux/drawSlice';


const mapStateToProps = (oState: StateType) => {
    return {
        charNums: selectCharNumbers(oState),
        isMonodromic: oState.draw.isMonodromic,
        isFormError: selectIsFormError(oState),
        size: selectPolycycleWidth()
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawPolycycle);