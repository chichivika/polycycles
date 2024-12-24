import { connect } from 'react-redux';
import DrawSimplex from './DrawSimplex';
import { StateType } from '../../../appRedux/store';
import {
    selectIsFormError,
    selectSimplexWidth,
    selectSimplexData,
} from '../../../appRedux/drawSlice';

// =======================================
// Привязанный рисунок симплекса полицикла
// =======================================

const mapStateToProps = (oState: StateType) => {
    const oSimplexData = selectSimplexData(oState.draw);
    return {
        isFormError: selectIsFormError(oState.draw),
        size: selectSimplexWidth(),
        vertsInfo: oSimplexData.vertsInfo,
        verts: oSimplexData.verts,
        edgesInfo: oSimplexData.edgesInfo,
        kSetAreas: oSimplexData.kSetAreas,
        tripleSegment: oSimplexData.tripleSegment,
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawSimplex);
