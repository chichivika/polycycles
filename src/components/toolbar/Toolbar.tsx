import CharNumsTool from 'components/charNumsTool/CharNumsTool';
import IsMonodromicTool from 'components/isMonodromicTool/IsMonodromicTool';

import './ToolbarStyle.scss';

function Toolbar(){
    return (
        <div className="toolbar">
                <IsMonodromicTool/>
                <CharNumsTool/>
            </div>
    );
}

export default Toolbar;
// class Toolbar extends React.Component<MyProps, MyState> {
//     constructor(oProps: MyProps) {
//         super(oProps)
//         let oDrawState = oStore.getState().draw;
//         this.state = {
//             isMonodromic: oDrawState.isMonodromic,
//             charNums: oDrawState.charNums.map(sNum => {
//                 return {
//                     value: sNum,
//                     error: false
//                 };
//             })
//         };
//     }
//     render() {
//         return (
//             <div className="toolbar">
//                 <IsMonodromicTool/>
//                 <CharacterNumsTool isError={this._getIsError()}
//                     isMonodromic={this.state.isMonodromic}
//                     charNums={this.state.charNums}
//                     onChange={this.onCharNumChange.bind(this)}
//                     onBlur={this.onCharNumBlur.bind(this)}
//                     onFocus={this.onCharNumFocus.bind(this)}
//                 />
//             </div>
//         )
//     }
//     onDrawBtnClick() {
//         let bError = this._checkForm();
//         if (bError) { return; }

//         let oState = this.state;
//         this.props.dispatchUpdate({
//             isMonodromic: oState.isMonodromic,
//             charNums: oState.charNums.map(oNum => oNum.value)
//         });
//     }
//     onIsMonodromicChange(oEvent: React.ChangeEvent<HTMLInputElement>) {
//         this.setState({
//             isMonodromic: oEvent.target.checked
//         });
//     }
//     onCharNumBlur(oParam: CharNumsChangeEvent): void {
//         let sNumber = oParam.value;
//         if (!sNumber) { return; }
//         if (sNumber === '.') {
//             sNumber = '';
//             this._updateCharNumByIndex({
//                 value: sNumber
//             }, oParam.i);
//             return;
//         }
//         let sNewNumber = String(Number(sNumber));
//         if (sNumber !== sNewNumber) {
//             this._updateCharNumByIndex({
//                 value: sNewNumber
//             }, oParam.i);
//         }
//     }
//     onCharNumFocus(i: number): void {
//         let oCharNum = this.state.charNums[i];
//         if (!oCharNum.error) { return; }

//         this._updateCharNumByIndex({
//             value: oCharNum.value,
//             error: false
//         }, i);
//     }
//     _getIconSrc(){
//         if(this.state.isMonodromic){
//             return './img/is-monodromic-icon.svg';
//         }
//         return './img/not-monodromic-icon.svg';
//     }
//     _getIsError() {

//         let aNums = this.state.charNums;

//         for (let oCharNum of aNums) {
//             if (oCharNum.error) {
//                 return true;
//             }
//         }

//         return false;
//     }
//     _checkNumberIsValid(sValue: string) {
//         if (Number.isNaN(sValue) || Number(sValue) === 0) {
//             return false;
//         }
//         return true;
//     }
//     _checkForm(): boolean {
//         let oState = this.state;
//         let aNums = oState.charNums;
//         let bError = false;

//         for (let oCharNum of aNums) {
//             let sValue = oCharNum.value;
//             if (!this._checkNumberIsValid(sValue)) {
//                 oCharNum.error = true;
//                 bError = true;
//             }
//         }

//         if (bError) {
//             this.setState({
//                 charNums: [...aNums]
//             });
//         }
//         return bError;
//     }
//     _updateCharNumByIndex(oCharNum: CharNumInputState, i: number) {
//         let aNums = this.state.charNums;
//         aNums.splice(i, 1, {
//             value: oCharNum.value,
//             error: oCharNum.error || false
//         });
//         this.setState({ charNums: aNums });
//     }
// }

// //Connected Component
// const mapStateToProps = () => ({
// });

// const mapDispatchToProps = { dispatchUpdate: drawingUpdate };

// export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);