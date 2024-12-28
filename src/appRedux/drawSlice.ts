import { createSlice } from '@reduxjs/toolkit';
import { getDrawInitialState, CharNumSettings } from './storeUtils';

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
            const { charNumsData } = state;
            const updateObject = action.payload;
            const { i, charNumSetting } = updateObject;

            if (checkNumbersEqual(charNumsData[i], charNumSetting)) {
                return;
            }

            charNumsData.splice(i, 1, charNumSetting);
            state.charNumsData = charNumsData;
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
