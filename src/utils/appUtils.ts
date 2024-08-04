import { getNumsMul, numsAreAlmostEqual } from "./jsUtils";

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