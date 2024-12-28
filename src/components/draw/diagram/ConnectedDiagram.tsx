import { connect } from 'react-redux';
import DrawDiagram from './Diagram';
import { StateType } from '../../../appRedux/store';
import {
    selectCharNumbers,
    selectDiagramWidth,
    selectIsFormError,
    selectIsTypicalCase,
    selectUnfoldSpecialInfo,
    selectIsMonodromic,
} from '../../../appRedux/drawSelectors';

// ==============================================
// Привязанная бифуркационная диаграмма полицикла
// ==============================================

const mapStateToProps = (state: StateType) => {
    const oSpecialInfo = selectUnfoldSpecialInfo(state);
    return {
        charNums: selectCharNumbers(state),
        isMonodromic: selectIsMonodromic(state),
        isFormError: selectIsFormError(state),
        size: selectDiagramWidth(state),
        edgesPath: oSpecialInfo.edgesPath,
        isTypicalCase: selectIsTypicalCase(state),
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawDiagram);
