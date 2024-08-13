import DrawSimplex from './DrawSimplex';

import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import {
    selectIsFormError,
    selectSimplexWidth,
    selectSimplexData
} from 'appRedux/drawSlice';

//=======================================
//Привязанный рисунок симплекса полицикла
//=======================================

const mapStateToProps = (oState: StateType) => {
    let oSimplexData = selectSimplexData(oState);
    return {
        isFormError: selectIsFormError(oState),
        size: selectSimplexWidth(),
        vertsInfo: oSimplexData.vertsInfo,
        verts: oSimplexData.verts,
        edgesInfo: oSimplexData.edgesInfo,
        kSetAreas: oSimplexData.kSetAreas,
        tripleSegment: oSimplexData.tripleSegment
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawSimplex);