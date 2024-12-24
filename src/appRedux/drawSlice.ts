import { createSlice } from '@reduxjs/toolkit';
import {
    getDrawInitialState,
    aInitialDrawSetting,
    boundWidth,
    CharNumSettings,
} from './storeUtils';
import { charNumberIsValid } from '../utils/appUtils';
import ClassSimplexBase from '../utils/simplex/ClassSimplexBase';
import ClassUnfoldBase from '../utils/unfold/ClassUnfoldBase';

// Redux Toolkit's createSlice function lets you
// mutates the store data
const drawSlice = createSlice({
    name: 'draw',
    initialState: getDrawInitialState(),
    reducers: {
        update: (oState, oAction) => {
            Object.assign(oState, oAction.payload);
        },
        // Обновить данные характеристического числа
        updateCharNumber: (oState, oAction) => {
            const oUpdate = oAction.payload;
            const aNums = oState.charNums;
            const nIndex = oUpdate.i;
            const oSettings = oUpdate.charNumSetting;

            if (checkNumbersEqual(aNums[nIndex], oSettings)) {
                return;
            }

            aNums.splice(nIndex, 1, oSettings);
            oState.charNums = aNums;
        },
    },
});

// Проверить равны ли данные по характеристическим числам
function checkNumbersEqual(oCurrNum: CharNumSettings, oNewNum: CharNumSettings) {
    if (oCurrNum.value !== oNewNum.value) {
        return false;
    }
    if (oCurrNum.error !== oNewNum.error) {
        return false;
    }
    return true;
}

export const { update, updateCharNumber } = drawSlice.actions;
export type DrawState = ReturnType<typeof drawSlice.getInitialState>;
export default drawSlice.reducer;
// ========================== SELECTORS ====================================

// Получить числовой массив характеристических чисел
export function selectCharNumbers(oState: DrawState) {
    const aNums = oState.charNums;
    return aNums.map((oNum) => +oNum.value);
}
// Есть ли ошибки в полях ввода
export function selectIsFormError(oState: DrawState) {
    const aNums = oState.charNums;
    return aNums.some((oNumSet) => !charNumberIsValid(oNumSet.value));
}

// Отображена ли хотя бы одна ошибка в полях ввода
export function selectIsInputErrorState(oState: DrawState) {
    const aNums = oState.charNums;
    return aNums.some((oNumSet) => oNumSet.error);
}

// Получить данные характеристического числа по индексу
export function selectInputSetting(oState: DrawState, i: number) {
    return oState.charNums[i];
}

// Получить ширину рисунка "Полицикл"
export function selectPolycycleWidth() {
    return aInitialDrawSetting.polycycle.width;
}

// Получить ширину рисунка "Симплекс"
export function selectSimplexWidth() {
    return aInitialDrawSetting.simplex.width;
}

// Получить ширину рисунка "Развертка"
export function selectUnfoldWidth(oState: DrawState) {
    const nWidth = oState.drawCntWidth;

    const nRest = nWidth - selectSimplexWidth() - selectPolycycleWidth() - 50;
    const nSize = nRest / 2;

    return boundWidth(nSize, aInitialDrawSetting.unfold);
}

// Получить ширину рисунка "Диаграмма"
export function selectDiagramWidth(oState: DrawState) {
    const nWidth = oState.drawCntWidth;

    const nRest = nWidth - selectSimplexWidth() - selectPolycycleWidth() - 50;
    const nSize = nRest / 2;

    return boundWidth(nSize, aInitialDrawSetting.diagram);
}

// Получить инстанцию класса ClassSimplexBase
export function selectSimplexObject(oDrawState: DrawState) {
    if (oDrawState.drawCntWidth === 0) {
        return null;
    }
    const nSize = selectSimplexWidth();
    return new ClassSimplexBase({
        size: nSize,
        paddingTop: nSize * 0.1,
        charNums: selectCharNumbers(oDrawState),
        isMonodromic: oDrawState.isMonodromic,
    });
}

// Получить данные для отрисовки картинки "Симплекс"
export function selectSimplexData(oState: DrawState) {
    const oSimplexObject = selectSimplexObject(oState);
    if (oSimplexObject === null) {
        return {
            vertsInfo: [],
            verts: [],
            edgesInfo: [],
            kSetAreas: [],
            tripleSegment: [],
        };
    }
    return {
        vertsInfo: oSimplexObject.getVertsInfo(),
        verts: oSimplexObject.getVertices(),
        edgesInfo: oSimplexObject.getEdgesInfo(),
        kSetAreas: oSimplexObject.getKSetAreas(),
        tripleSegment: oSimplexObject.getTripleCycleLineSegment(),
    };
}

// Получить инстанцию класса ClassUnfoldBase
export function selectUnfoldObject(oDrawState: DrawState) {
    if (oDrawState.drawCntWidth === 0) {
        return null;
    }
    const nSize = selectUnfoldWidth(oDrawState);
    return new ClassUnfoldBase({
        size: nSize,
        paddingTop: nSize * 0.1,
        innerPadTop: 60,
        charNums: selectCharNumbers(oDrawState),
        isMonodromic: oDrawState.isMonodromic,
    });
}

// Получить вершины внешнего симплекса развертки
export function selectUnfoldOuterVerts(oState: DrawState) {
    const oUnfoldObject = selectUnfoldObject(oState);
    if (oUnfoldObject === null) {
        return [];
    }
    return oUnfoldObject.getOuterVerts();
}

// Получить массив внутренних линий развертки
export function selectUnfoldInnerLines(oState: DrawState) {
    const oUnfoldObject = selectUnfoldObject(oState);
    if (oUnfoldObject === null) {
        return [];
    }
    return oUnfoldObject.getInnerLines();
}

// Получить данные для отрисовки развертки
export function selectUnfoldSpecialInfo(oState: DrawState) {
    const oUnfoldObject = selectUnfoldObject(oState);
    if (oUnfoldObject === null) {
        return ClassUnfoldBase.getInitialSpecialInfo();
    }
    const oInfo = oUnfoldObject.getSpecialInfo();
    return oInfo;
}

// Являются ли характеристические числа типичными
export function selectIsTypicalCase(oState: DrawState) {
    const oUnfoldObject = selectUnfoldObject(oState);
    if (oUnfoldObject === null) {
        return true;
    }
    return oUnfoldObject.getIsTypicalCase();
}
