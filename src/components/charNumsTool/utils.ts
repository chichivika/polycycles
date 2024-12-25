export type CharNumsChangeEvent = {
    value: string;
    i: number;
};
export type CharNumsChangeFunction = (param: CharNumsChangeEvent) => void;
export type CharNumInputState = {
    value: string;
    error: boolean;
};
