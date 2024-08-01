export const nEqualPrecision = 1e-6;

export function numsAreAlmostEqual(nNum1: number, nNum2: number){
    if(Math.abs(nNum1 - nNum2)<nEqualPrecision){
        return true;
    }
    return false;
}
export function productNumsFromTo(aNums:number[], nFrom: number, nTo: number, aExcept?: number[]){
 
    let nProduct = 1;
    for (let i = nFrom; i <= nTo; ++i) {
        if(aExcept instanceof Array && aExcept.includes(i)){continue;}
        nProduct *= aNums[i];
    }

    return nProduct;
}