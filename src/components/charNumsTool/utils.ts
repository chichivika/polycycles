export type CharNumsChangeEvent = {
    value: string,
    i: number
};
export type CharNumsChangeFunction = (oParam: CharNumsChangeEvent) => void;
export type CharNumInputState = {
    value: string,
    error: boolean
};