import { connect } from 'react-redux';
import DrawDiagram from './Diagram';
import { StateType } from '../../../appRedux/store';
import {
    selectCharNumbers,
    selectDiagramWidth,
    selectIsFormError,
    selectIsTypicalCase,
    selectUnfoldSpecialInfo,
} from '../../../appRedux/drawSlice';

// ==============================================
// Привязанная бифуркационная диаграмма полицикла
// ==============================================

const mapStateToProps = (oState: StateType) => {
    const { draw: drawState } = oState;
    const oSpecialInfo = selectUnfoldSpecialInfo(drawState);
    return {
        charNums: selectCharNumbers(drawState),
        isMonodromic: drawState.isMonodromic,
        isFormError: selectIsFormError(drawState),
        size: selectDiagramWidth(drawState),
        edgesPath: oSpecialInfo.edgesPath,
        isTypicalCase: selectIsTypicalCase(drawState),
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawDiagram);
