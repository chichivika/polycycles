import { connect } from 'react-redux';
import Unfold from './Unfold';
import { StateType } from '../../../appRedux/store';
import {
    selectIsFormError,
    selectUnfoldWidth,
    selectUnfoldInnerLines,
    selectUnfoldOuterVerts,
    selectUnfoldSpecialInfo,
} from '../../../appRedux/drawSlice';

// ======================================
// Привязанный рисунок развертки полицикла
// ======================================

const mapStateToProps = (oState: StateType) => {
    const { draw: drawState } = oState;
    const oSpecialInfo = selectUnfoldSpecialInfo(drawState);

    return {
        isFormError: selectIsFormError(drawState),
        size: selectUnfoldWidth(drawState),
        outerVerts: selectUnfoldOuterVerts(drawState),
        innerLines: selectUnfoldInnerLines(drawState),
        kSet: oSpecialInfo.kSet,
        tripleSet: oSpecialInfo.tripleSet,
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Unfold);
