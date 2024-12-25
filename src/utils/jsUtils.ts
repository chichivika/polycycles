// ================================================
// Методы без специальной логики приложения
// ================================================

// Произведение чисел от и до с возможностью исключения
export function productNumsFromTo(
    // Массив чисел для произведения
    nums: number[],
    // Индекс начала
    from: number,
    // Индекс окончания
    to: number,
    // Массив чисел, которые следует пропустить
    excepts?: number[],
) {
    let product = 1;
    for (let i = from; i <= to; ++i) {
        if (excepts instanceof Array && excepts.includes(i)) {
            continue;
        }
        product *= nums[i];
    }

    return product;
}

// Получить сумму чисел массива
export function getNumsSum(nums: number[]) {
    return nums.reduce((sum, num) => sum + num, 0);
}

// Получить произведение чисел массива
export function getNumsMul(nums: number[]) {
    return nums.reduce((mul, num) => mul * num, 1);
}
