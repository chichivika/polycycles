import { configureStore, combineReducers } from '@reduxjs/toolkit';
import drawReducer from './drawSlice';

const rootReducer = combineReducers({
    draw: drawReducer,
});
const oStore = configureStore({
    reducer: rootReducer,
});

export default oStore;
export type StateType = ReturnType<typeof oStore.getState>;

export function getState() {
    return oStore.getState();
}
export function getDrawState() {
    return oStore.getState().draw;
}
