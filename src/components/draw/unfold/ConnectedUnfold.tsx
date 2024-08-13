import Unfold from "./Unfold";

import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import {
    selectIsFormError,
    selectUnfoldWidth,
    selectUnfoldInnerLines,
    selectUnfoldOuterVerts,
    selectUnfoldSpecialInfo
} from 'appRedux/drawSlice';

//======================================
//Привязанный рисунок развертки полицикла
//======================================

const mapStateToProps = (oState: StateType) => {
    let oSpecialInfo = selectUnfoldSpecialInfo(oState);

    return {
        isFormError: selectIsFormError(oState),
        size: selectUnfoldWidth(oState),
        outerVerts: selectUnfoldOuterVerts(oState),
        innerLines: selectUnfoldInnerLines(oState),
        kSet: oSpecialInfo.kSet,
        tripleSet: oSpecialInfo.tripleSet
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Unfold);