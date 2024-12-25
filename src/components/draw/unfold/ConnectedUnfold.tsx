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

const mapStateToProps = (state: StateType) => {
    const { draw: drawState } = state;
    const specialInfo = selectUnfoldSpecialInfo(drawState);

    return {
        isFormError: selectIsFormError(drawState),
        size: selectUnfoldWidth(drawState),
        outerVerts: selectUnfoldOuterVerts(drawState),
        innerLines: selectUnfoldInnerLines(drawState),
        kSet: specialInfo.kSet,
        tripleSet: specialInfo.tripleSet,
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Unfold);
