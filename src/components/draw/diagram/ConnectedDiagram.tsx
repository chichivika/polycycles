import DrawDiagram from './Diagram';

import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import {
    selectCharNumbers,
    selectDiagramWidth,
    selectIsFormError,
    selectIsTypicalCase,
    selectUnfoldSpecialInfo
} from 'appRedux/drawSlice';


const mapStateToProps = (oState: StateType) => {
    let oSpecialInfo = selectUnfoldSpecialInfo(oState);
    return {
        charNums: selectCharNumbers(oState),
        isMonodromic: oState.draw.isMonodromic,
        isFormError: selectIsFormError(oState),
        size: selectDiagramWidth(oState),
        edgesPath: oSpecialInfo.edgesPath,
        isTypicalCase: selectIsTypicalCase(oState)
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawDiagram);