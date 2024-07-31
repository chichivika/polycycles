export function getClassName(sDefaultName:string, sName?: string): string {
    if (sName) {
        sDefaultName = sDefaultName.concat(` ${sName}`);
    }
    return sDefaultName;
}
export function productNumsFromTo(aNums:number[], nFrom: number, nTo: number, aExcept?: number[]){
 
    let nProduct = 1;
    for (let i = nFrom; i <= nTo; ++i) {
        if(aExcept instanceof Array && aExcept.includes(i)){continue;}
        nProduct *= aNums[i];
    }

    return nProduct;
}