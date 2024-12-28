import { connect } from 'react-redux';
import DrawSimplex from './DrawSimplex';
import { StateType } from '../../../appRedux/store';
import { selectIsFormError, selectSimplexData } from '../../../appRedux/drawSelectors';
import { getSimplexWidth } from '../../../appRedux/storeUtils';

// =======================================
// Привязанный рисунок симплекса полицикла
// =======================================

const mapStateToProps = (state: StateType) => {
    const oSimplexData = selectSimplexData(state);
    return {
        isFormError: selectIsFormError(state),
        size: getSimplexWidth(),
        vertsInfo: oSimplexData.vertsInfo,
        verts: oSimplexData.verts,
        edgesInfo: oSimplexData.edgesInfo,
        kSetAreas: oSimplexData.kSetAreas,
        tripleSegment: oSimplexData.tripleSegment,
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawSimplex);
