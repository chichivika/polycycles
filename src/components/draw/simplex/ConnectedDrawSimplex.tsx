import DrawSimplex from './DrawSimplex';

import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import { selectCharNumbers } from 'appRedux/drawSlice';


const mapStateToProps = (oState: StateType) => {
    return {
        charNums: selectCharNumbers(oState),
        isMonodromic: oState.draw.isMonodromic
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawSimplex);