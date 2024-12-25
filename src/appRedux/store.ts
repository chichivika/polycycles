import { configureStore, combineReducers } from '@reduxjs/toolkit';
import drawReducer from './drawSlice';

const rootReducer = combineReducers({
    draw: drawReducer,
});
const store = configureStore({
    reducer: rootReducer,
});

export default store;
export type StateType = ReturnType<typeof store.getState>;

export function getState() {
    return store.getState();
}
export function getDrawState() {
    return store.getState().draw;
}
