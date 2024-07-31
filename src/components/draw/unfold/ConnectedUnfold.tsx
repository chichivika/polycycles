import Unfold from "./Unfold";

import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import { selectCharNumbers } from 'appRedux/drawSlice';

const mapStateToProps = (oState: StateType) => ({
    charNums: selectCharNumbers(oState),
    isMonodromic: oState.draw.isMonodromic
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Unfold);