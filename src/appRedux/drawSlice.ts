import { createSlice } from '@reduxjs/toolkit';
import {
    getDrawInitialState,
    initialDrawSettings,
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
        update: (state, action) => {
            Object.assign(state, action.payload);
        },
        // Обновить данные характеристического числа
        updateCharNumber: (state, action) => {
            const { charNums } = state;
            const updateObject = action.payload;
            const { i, charNumSetting } = updateObject;

            if (checkNumbersEqual(charNums[i], charNumSetting)) {
                return;
            }

            charNums.splice(i, 1, charNumSetting);
            state.charNums = charNums;
        },
    },
});

// Проверить равны ли данные по характеристическим числам
function checkNumbersEqual(currNumData: CharNumSettings, newNumData: CharNumSettings) {
    if (currNumData.value !== newNumData.value) {
        return false;
    }
    if (currNumData.error !== newNumData.error) {
        return false;
    }
    return true;
}

export const { update, updateCharNumber } = drawSlice.actions;
export type DrawState = ReturnType<typeof drawSlice.getInitialState>;
export default drawSlice.reducer;

// ========================== SELECTORS ====================================

// Получить числовой массив характеристических чисел
export function selectCharNumbers(drawState: DrawState) {
    const { charNums } = drawState;
    return charNums.map((charNumData) => +charNumData.value);
}
// Есть ли ошибки в полях ввода
export function selectIsFormError(drawState: DrawState) {
    const { charNums } = drawState;
    return charNums.some((charNumData) => !charNumberIsValid(charNumData.value));
}

// Отображена ли хотя бы одна ошибка в полях ввода
export function selectIsInputErrorState(drawState: DrawState) {
    const { charNums } = drawState;
    return charNums.some((charNumData) => charNumData.error);
}

// Получить данные характеристического числа по индексу
export function selectInputSetting(drawState: DrawState, i: number) {
    return drawState.charNums[i];
}

// Получить ширину рисунка "Полицикл"
export function selectPolycycleWidth() {
    return initialDrawSettings.polycycle.width;
}

// Получить ширину рисунка "Симплекс"
export function selectSimplexWidth() {
    return initialDrawSettings.simplex.width;
}

// Получить ширину рисунка "Развертка"
export function selectUnfoldWidth(drawState: DrawState) {
    const { drawCntWidth } = drawState;

    const widthRest = drawCntWidth - selectSimplexWidth() - selectPolycycleWidth() - 50;
    const size = widthRest / 2;

    return boundWidth(size, initialDrawSettings.unfold);
}

// Получить ширину рисунка "Диаграмма"
export function selectDiagramWidth(drawState: DrawState) {
    const { drawCntWidth } = drawState;

    const widthRest = drawCntWidth - selectSimplexWidth() - selectPolycycleWidth() - 50;
    const size = widthRest / 2;

    return boundWidth(size, initialDrawSettings.diagram);
}

// Получить инстанцию класса ClassSimplexBase
export function selectSimplexObject(drawState: DrawState) {
    const { drawCntWidth, isMonodromic } = drawState;
    if (drawCntWidth === 0) {
        return null;
    }

    const size = selectSimplexWidth();
    return new ClassSimplexBase({
        size,
        isMonodromic,
        paddingTop: size * 0.1,
        charNums: selectCharNumbers(drawState),
    });
}

// Получить данные для отрисовки картинки "Симплекс"
export function selectSimplexData(drawState: DrawState) {
    const simplexObject = selectSimplexObject(drawState);
    if (simplexObject === null) {
        return {
            vertsInfo: [],
            verts: [],
            edgesInfo: [],
            kSetAreas: [],
            tripleSegment: [],
        };
    }
    return {
        vertsInfo: simplexObject.getVertsInfo(),
        verts: simplexObject.getVertices(),
        edgesInfo: simplexObject.getEdgesInfo(),
        kSetAreas: simplexObject.getKSetAreas(),
        tripleSegment: simplexObject.getTripleCycleLineSegment(),
    };
}

// Получить инстанцию класса ClassUnfoldBase
export function selectUnfoldObject(drawState: DrawState) {
    const { drawCntWidth, isMonodromic } = drawState;
    if (drawCntWidth === 0) {
        return null;
    }
    const nSize = selectUnfoldWidth(drawState);
    return new ClassUnfoldBase({
        size: nSize,
        isMonodromic,
        paddingTop: nSize * 0.1,
        innerPadTop: 60,
        charNums: selectCharNumbers(drawState),
    });
}

// Получить вершины внешнего симплекса развертки
export function selectUnfoldOuterVerts(drawState: DrawState) {
    const unfoldObject = selectUnfoldObject(drawState);
    if (unfoldObject === null) {
        return [];
    }
    return unfoldObject.getOuterVerts();
}

// Получить массив внутренних линий развертки
export function selectUnfoldInnerLines(drawState: DrawState) {
    const unfoldObject = selectUnfoldObject(drawState);
    if (unfoldObject === null) {
        return [];
    }
    return unfoldObject.getInnerLines();
}

// Получить данные для отрисовки развертки
export function selectUnfoldSpecialInfo(drawState: DrawState) {
    const unfoldObject = selectUnfoldObject(drawState);
    if (unfoldObject === null) {
        return ClassUnfoldBase.getInitialSpecialInfo();
    }
    const oInfo = unfoldObject.getSpecialInfo();
    return oInfo;
}

// Являются ли характеристические числа типичными
export function selectIsTypicalCase(drawState: DrawState) {
    const unfoldObject = selectUnfoldObject(drawState);
    if (unfoldObject === null) {
        return true;
    }
    return unfoldObject.getIsTypicalCase();
}
