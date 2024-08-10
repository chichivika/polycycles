import { createSlice } from '@reduxjs/toolkit';
import { getDrawInitialState, aInitialDrawSetting, boundWidth } from './storeUtils';
import { StateType } from './store';
import { charNumberIsValid } from 'utils/appUtils';
import ClassSimplexBase from "utils/simplex/ClassSimplexBase";
import ClassUnfoldBase from "utils/unfold/ClassUnfoldBase";

type CharNumSettings = {
    value: string,
    error: boolean
};

//Redux Toolkit's createSlice function lets you
//mutates the store data
const drawSlice = createSlice({
    name: 'draw',
    initialState: getDrawInitialState(),
    reducers: {
        update: (oState, oAction) => {
            Object.assign(oState, oAction.payload);
        },
        updateCharNumber:(oState, oAction) => {
            let oUpdate = oAction.payload;
            let aNums = oState.charNums;
            let nIndex = oUpdate.i;
            let oSettings = oUpdate.charNumSetting;

            if(checkNumbersEqual(aNums[nIndex], oSettings)){
                return;
            }

            aNums.splice(nIndex,1,oSettings);
            oState.charNums = aNums;
        }
    }
})
function checkNumbersEqual(oCurrNum: CharNumSettings, oNewNum: CharNumSettings){
    if(oCurrNum.value !== oNewNum.value){
        return false;
    }
    if(oCurrNum.error !== oNewNum.error){
        return false;
    }
    return true;
}
// selectors 
export function selectCharNumbers(oState: StateType){
    let aNums = oState.draw.charNums;
    return aNums.map(oNum=>+oNum.value); 
}
export function selectIsFormError(oState: StateType) {
    let aNums = oState.draw.charNums;
    for (let oNumSet of aNums) {
        if (!charNumberIsValid(oNumSet.value)) {
            return true;
        }
    }
    return false;
}
export function selectIsInputErrorState(oState: StateType) {
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
export function selectPolycycleWidth(){
    return aInitialDrawSetting.polycycle.width;
}
export function selectSimplexWidth(){
    return aInitialDrawSetting.simplex.width;
}
export function selectUnfoldWidth(oState: StateType){
    let nWidth = oState.draw.drawCntWidth;

    let nRest = nWidth - selectSimplexWidth() - selectPolycycleWidth() - 50;
    let nSize = nRest / 2;

    return boundWidth(nSize, aInitialDrawSetting.unfold);
}
export function selectDiagramWidth(oState: StateType){
    let nWidth = oState.draw.drawCntWidth;

    let nRest = nWidth - selectSimplexWidth() - selectPolycycleWidth() - 50;
    let nSize = nRest / 2;

    return boundWidth(nSize, aInitialDrawSetting.diagram);
}
export function selectSimplexObject(oState:StateType){
    let oDrawState = oState.draw;
    if(oDrawState.drawCntWidth === 0){
        return null;
    }
    let nSize = selectSimplexWidth();
    return new ClassSimplexBase({
        size: nSize,
        paddingTop: nSize*0.1,
        charNums: selectCharNumbers(oState),
        isMonodromic: oDrawState.isMonodromic
    });
}
export function selectSimplexData(oState:StateType){
    let oSimplexObject = selectSimplexObject(oState);
    if(oSimplexObject === null){
        return {
            vertsInfo: [],
            verts: [],
            edgesInfo: [],
            kSetAreas: [],
            tripleSegment: []
        };
    }
    return {
        vertsInfo: oSimplexObject.getVertsInfo(),
        verts: oSimplexObject.getVertices(),
        edgesInfo: oSimplexObject.getEdgesInfo(),
        kSetAreas: oSimplexObject.getKSetAreas(),
        tripleSegment: oSimplexObject.getTripleCycleLineSegment()
    };
}
export function selectUnfoldObject(oState:StateType){
    let oDrawState = oState.draw;
    if(oDrawState.drawCntWidth === 0){
        return null;
    }
    let nSize = selectUnfoldWidth(oState);
    return new ClassUnfoldBase({
        size: nSize,
        paddingTop: nSize * 0.1,
        innerPadTop: 60,
        charNums: selectCharNumbers(oState),
        isMonodromic: oDrawState.isMonodromic
    });
}
export function selectUnfoldOuterVerts(oState:StateType){
    let oUnfoldObject = selectUnfoldObject(oState);
    if(oUnfoldObject === null){
        return [];
    }
    return oUnfoldObject.getOuterVerts();
}
export function selectUnfoldInnerLines(oState:StateType){
    let oUnfoldObject = selectUnfoldObject(oState);
    if(oUnfoldObject === null){
        return [];
    }
    return oUnfoldObject.getInnerLines();
}
export function selectUnfoldSpecialInfo(oState:StateType){
    let oUnfoldObject = selectUnfoldObject(oState);
    if(oUnfoldObject === null){
        return ClassUnfoldBase.getInitialSpecialInfo();
    }
    let oInfo = oUnfoldObject.getSpecialInfo();
    return oInfo;
}
export function selectIsTypicalCase(oState:StateType){
    let oUnfoldObject = selectUnfoldObject(oState);
    if(oUnfoldObject === null){
        return true;
    }
    return oUnfoldObject.getIsTypicalCase();
}

export const { update, updateCharNumber } = drawSlice.actions;
export type DrawState = ReturnType<typeof drawSlice.getInitialState>
export default drawSlice.reducer;