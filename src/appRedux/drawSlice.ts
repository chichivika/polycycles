import { createSlice } from '@reduxjs/toolkit';
import { aInitialCharNums } from './storeUtils';
import { StateType } from './store';

//Redux Toolkit's createSlice function lets you
//mutates the store data
const drawSlice = createSlice({
    name: 'draw',
    initialState: {
        isMonodromic: true,
        charNums: aInitialCharNums.map(sNum => {
            return {
                value: sNum,
                error: false
            };
        })
    },
    reducers: {
        update: (oState, oAction) => {
            Object.assign(oState, oAction.payload);
        },
        updateCharNumber: (oState, oAction) => {
            let oUpdate = oAction.payload;
            let aNums = oState.charNums;
            aNums.splice(oUpdate.i,1,oUpdate.charNumSetting);
            oState.charNums = aNums;
        }
    }
})
// selectors 
export function selectCharNumbers(oState: StateType){
    let aNums = oState.draw.charNums;
    return aNums.map(oNum=>+oNum.value); 
}
export function selectIsError(oState: StateType) {
    let aNums = oState.draw.charNums;
    for (let oNumSet of aNums) {
        if (oNumSet.error) {
            return true;
        }
    }
    return false;
}
export function selectInputSetting(oState: StateType, i: number){
    return oState.draw.charNums[i];
}

export const { update, updateCharNumber } = drawSlice.actions;
export type DrawState = ReturnType<typeof drawSlice.getInitialState>
export default drawSlice.reducer;