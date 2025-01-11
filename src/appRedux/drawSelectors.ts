import { createSelector } from '@reduxjs/toolkit';
import { StateType } from './store';
import { charNumberIsValid } from '../utils/appUtils';
import { initialDrawSettings, boundWidth, getPolycycleWidth, getSimplexWidth } from './storeUtils';
import ClassSimplexBase from '../utils/simplex/ClassSimplexBase';
import ClassUnfoldBase from '../utils/unfold/ClassUnfoldBase';
import { getTripleLineIntersectSidePoint } from '../utils/drawUtils';

// Получить узел состояния с данными по картинкам
function selectDrawState(state: StateType) {
    return state.draw;
}

// Получить ширину контейнера с картинками
const selectDrawCntWidth = createSelector([selectDrawState], (drawState) => drawState.drawCntWidth);

// Получить флаг монодромности полицикла
export function selectIsMonodromic(state: StateType) {
    const drawState = selectDrawState(state);
    return drawState.isMonodromic;
}

// Получить массив данных характеристических чисел
const selectCharNumsData = createSelector([selectDrawState], (drawState) => drawState.charNumsData);

// Получить числовой массив характеристических чисел
export const selectCharNumbers = createSelector([selectCharNumsData], (charNumsData) =>
    charNumsData.map((charNumData) => +charNumData.value),
);

// Есть ли ошибки в полях ввода
export const selectIsFormError = createSelector([selectCharNumsData], (charNumsData) =>
    charNumsData.some((charNumData) => !charNumberIsValid(charNumData.value)),
);

// Отображена ли хотя бы одна ошибка в полях ввода
export const selectIsInputErrorState = createSelector([selectCharNumsData], (charNumsData) =>
    charNumsData.some((charNumData) => charNumData.error),
);

// Получить данные характеристического числа по индексу
export function selectInputSetting(state: StateType, i: number) {
    const charNumsData = selectCharNumsData(state);
    return charNumsData[i];
}

// Получить ширину рисунка "Развертка"
export function selectUnfoldWidth(state: StateType) {
    const drawCntWidth = selectDrawCntWidth(state);
    const widthRest = drawCntWidth - getSimplexWidth() - getPolycycleWidth() - 50;
    const size = widthRest / 2;

    return boundWidth(size, initialDrawSettings.unfold);
}

// Получить ширину рисунка "Диаграмма"
export function selectDiagramWidth(state: StateType) {
    const drawCntWidth = selectDrawCntWidth(state);

    const widthRest = drawCntWidth - getSimplexWidth() - getPolycycleWidth() - 50;
    const size = widthRest / 2;

    return boundWidth(size, initialDrawSettings.diagram);
}

// Получить инстанцию класса ClassSimplexBase
export const selectSimplexObject = createSelector(
    [selectDrawCntWidth, selectIsMonodromic, selectCharNumbers],
    (drawCntWidth, isMonodromic, charNums) => {
        if (drawCntWidth === 0) {
            return null;
        }

        const size = getSimplexWidth();
        return new ClassSimplexBase({
            size,
            isMonodromic,
            charNums,
            paddingTop: size * 0.1,
        });
    },
);

// Получить данные для отрисовки картинки "Симплекс"
export const selectSimplexData = createSelector([selectSimplexObject], (simplexObject) => {
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
});

// Получить инстанцию класса ClassUnfoldBase
export const selectUnfoldObject = createSelector(
    [selectDrawCntWidth, selectUnfoldWidth, selectIsMonodromic, selectCharNumbers],
    (drawCntWidth, size, isMonodromic, charNums) => {
        if (drawCntWidth === 0) {
            return null;
        }

        return new ClassUnfoldBase({
            size,
            isMonodromic,
            charNums,
            paddingTop: size * 0.1,
            innerPadTop: 60,
        });
    },
);

// Получить вершины внешнего симплекса развертки
export const selectUnfoldOuterVerts = createSelector([selectUnfoldObject], (unfoldObject) => {
    if (unfoldObject === null) {
        return [];
    }
    return unfoldObject.getOuterVerts();
});

// Получить массив внутренних линий развертки
export const selectUnfoldInnerLines = createSelector([selectUnfoldObject], (unfoldObject) => {
    if (unfoldObject === null) {
        return [];
    }
    return unfoldObject.getInnerLines();
});

// Получить данные для отрисовки развертки
export const selectUnfoldSpecialInfo = createSelector([selectUnfoldObject], (unfoldObject) => {
    if (unfoldObject === null) {
        return ClassUnfoldBase.getInitialSpecialInfo();
    }
    const oInfo = unfoldObject.getSpecialInfo();
    return oInfo;
});

// Являются ли характеристические числа типичными
export const selectIsTypicalCase = createSelector([selectUnfoldObject], (unfoldObject) => {
    if (unfoldObject === null) {
        return true;
    }
    return unfoldObject.getIsTypicalCase();
});

export type PolycycleResult = {
    isKSetEmpty: boolean;
    intersectionCount: number;
} | null;
export const selectResults = createSelector(
    [selectSimplexObject, selectCharNumbers, selectIsMonodromic],
    (simplexObject, charNumber, isMonodromic): PolycycleResult => {
        if (simplexObject === null) {
            return null;
        }
        const kSetAreas = simplexObject.getKSetAreas();

        if (kSetAreas.length) {
            return null;
        }

        let intersectionCount = 0;
        const verts = simplexObject.getVertices();
        const edgesInfo = simplexObject.getEdgesInfo();
        let kSetEdgesCount = 0;

        edgesInfo.forEach((edgeData, sideIndex) => {
            if (!edgeData.inKSet) {
                return;
            }

            kSetEdgesCount += 1;
            const intersection = getTripleLineIntersectSidePoint(
                sideIndex,
                verts,
                charNumber,
                isMonodromic,
            );
            if (intersection !== null) {
                intersectionCount += 1;
            }
        });

        return {
            isKSetEmpty: kSetEdgesCount === 0,
            intersectionCount,
        };
    },
);
