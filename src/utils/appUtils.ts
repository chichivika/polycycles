
import { getNumsMul } from "./jsUtils";

//==============================================================
//Константы и методы, использующие специальную логику приложения
//==============================================================

//Точность для сравнения чисел
export const nEqualPrecision = 1e-6;

//Сравнение двух чисел
export function numsAreAlmostEqual(nNum1: number, nNum2: number) {
    if (Math.abs(nNum1 - nNum2) < nEqualPrecision) {
        return true;
    }
    return false;
}
//Конкатенация имен изначального стилевого класса и опционного стилевого класса
export function getClassName(sDefaultName: string, sName?: string): string {
    if (sName) {
        sDefaultName = sDefaultName.concat(` ${sName}`);
    }
    return sDefaultName;
}
//Проверка, корректно ли характеристическое число
export function charNumberIsValid(sNumber: string) {
    let nNumber = Number(sNumber);
    if (isNaN(nNumber) || numsAreAlmostEqual(nNumber, 0)) {
        return false;
    }
    return true;
}
//Проверка, вырождены ли характеристические числа
//Т.е., равны ли они все единице
export function numsAreDegenerated(aNums: number[]) {
    for (let nNum of aNums) {
        if (!numsAreAlmostEqual(nNum, 1)) {
            return false;
        }
    }
    return true;
}
//Проверка, равно ли произведение чисел единице
export function numsMulIsUnit(aNums: number[]) {
    let nMul = getNumsMul(aNums);
    return numsAreAlmostEqual(nMul, 1);
}
//Проверка, равны ли все числа нулю
export function numsAreZeros(aNums: number[]) {
    for (let i = 0; i < aNums.length; ++i) {
        if (!numsAreAlmostEqual(aNums[i], 0)) {
            return false;
        }
    }
    return true;
}
//Получить третий остаток от деления на 3 по двум данным
//i и j предполагаются различными
export function getThirdIndex(i: number, j: number) {
    if (i === j) {
        throw new Error('getThirdIndex: equal input indexes');
    }
    return Math.round((3 - i - j) % 3);
}