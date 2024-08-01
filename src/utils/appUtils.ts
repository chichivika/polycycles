import { numsAreAlmostEqual } from "./jsUtils";

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