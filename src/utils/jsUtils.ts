//================================================
//Простые методы без специальной логики приложения
//================================================


//Произведение чисел от и до с возможностью исключения
export function productNumsFromTo(
    //Массив чисел для произведения
    aNums: number[],
    //Индекс начала
    nFrom: number,
    //Индекс окончания
    nTo: number,
    //Массив чисел, которые следует пропустить
    aExcept?: number[]) {

    let nProduct = 1;
    for (let i = nFrom; i <= nTo; ++i) {
        if (aExcept instanceof Array && aExcept.includes(i)) { continue; }
        nProduct *= aNums[i];
    }

    return nProduct;
}
//Получить сумму чисел массива
export function getNumsSum(aNums: number[]) {
    return aNums.reduce((nSum, nNum) => nSum + nNum, 0);
}
//Получить произведение чисел массива
export function getNumsMul(aNums: number[]) {
    return aNums.reduce((nMul, nNum) => nMul * nNum, 1);
}