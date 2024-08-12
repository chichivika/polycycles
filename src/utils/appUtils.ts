
import { getNumsMul} from "./jsUtils";

//Константы и методы, использующие специальную логику приложения

//Точность для сравнения чисел
export const nEqualPrecision = 1e-6;

export function numsAreAlmostEqual(nNum1: number, nNum2: number){
    if(Math.abs(nNum1 - nNum2)<nEqualPrecision){
        return true;
    }
    return false;
}
export function getClassName(sDefaultName:string, sName?: string): string {
    if (sName) {
        sDefaultName = sDefaultName.concat(` ${sName}`);
    }
    return sDefaultName;
}

export function charNumberIsValid(sNumber:string){
    let nNumber = Number(sNumber);
    if(isNaN(nNumber) || numsAreAlmostEqual(nNumber,0)){
        return false;
    }
    return true;
}
export function numsAreDegenerated(aNums: number[]){
    for (let nNum of aNums) {
        if (!numsAreAlmostEqual(nNum, 1)) {
            return false;
        }
    }
    return true;
}
export function numsMulIsUnit(aNums: number[]){
    let nMul = getNumsMul(aNums);
    return numsAreAlmostEqual(nMul, 1);
}
//Проверка, равны ли все числа нулю
export function numsAreZeros(aNums: number[]){
    for(let i=0;i<aNums.length;++i){
        if(!numsAreAlmostEqual(aNums[i],0)){
            return false;
        }
    }
    return true;
}
export function getThirdIndex(i: number, j: number) {
    return Math.round((3 - i - j) % 3);
}