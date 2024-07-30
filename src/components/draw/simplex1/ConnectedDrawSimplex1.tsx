import DrawSimplex from './DrawSimplex1';

import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import { selectCharNumbers } from 'appRedux/drawSlice';


const mapStateToProps = (oState: StateType) => {
    return {
        charNums: selectCharNumbers(oState)
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawSimplex);