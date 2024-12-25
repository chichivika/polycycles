import { getNumsMul } from './jsUtils';

// ==============================================================
// Константы и методы, использующие специальную логику приложения
// ==============================================================

// Точность для сравнения чисел
export const equalPrecision = 1e-6;

// Сравнение двух чисел
export function numsAreAlmostEqual(num1: number, num2: number) {
    if (Math.abs(num1 - num2) < equalPrecision) {
        return true;
    }
    return false;
}

// Конкатенация имен изначального стилевого класса и опционного стилевого класса
export function getClassName(defaultName: string, name?: string): string {
    if (name) {
        return `${defaultName} ${name}`;
    }
    return defaultName;
}

// Проверка, корректно ли характеристическое число
export function charNumberIsValid(numberValue: string) {
    const charNumber = Number(numberValue);
    if (Number.isNaN(charNumber) || numsAreAlmostEqual(charNumber, 0)) {
        return false;
    }
    return true;
}

// Проверка, вырождены ли характеристические числа
// Т.е., равны ли они все единице
export function numsAreDegenerated(nums: number[]) {
    return nums.every((charNum) => numsAreAlmostEqual(charNum, 1));
}

// Проверка, равно ли произведение чисел единице
export function numsMulIsUnit(nums: number[]) {
    const mul = getNumsMul(nums);
    return numsAreAlmostEqual(mul, 1);
}

// Проверка, равны ли все числа нулю
export function numsAreZeros(nums: number[]) {
    return nums.every((charNum) => numsAreAlmostEqual(charNum, 0));
}

// Получить третий остаток от деления на 3 по двум данным
// i и j предполагаются различными
export function getThirdIndex(i: number, j: number) {
    if (i === j) {
        throw new Error('getThirdIndex: equal input indexes');
    }
    return Math.round((3 - i - j) % 3);
}
