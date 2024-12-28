import { connect } from 'react-redux';
import Unfold from './Unfold';
import { StateType } from '../../../appRedux/store';
import {
    selectIsFormError,
    selectUnfoldWidth,
    selectUnfoldInnerLines,
    selectUnfoldOuterVerts,
    selectUnfoldSpecialInfo,
} from '../../../appRedux/drawSelectors';

// ======================================
// Привязанный рисунок развертки полицикла
// ======================================

const mapStateToProps = (state: StateType) => {
    const specialInfo = selectUnfoldSpecialInfo(state);

    return {
        isFormError: selectIsFormError(state),
        size: selectUnfoldWidth(state),
        outerVerts: selectUnfoldOuterVerts(state),
        innerLines: selectUnfoldInnerLines(state),
        kSet: specialInfo.kSet,
        tripleSet: specialInfo.tripleSet,
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Unfold);
