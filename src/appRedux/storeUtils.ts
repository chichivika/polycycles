//==========================================
//Вспомогательные методы для работы со store
//==========================================

//Объект информации о введенном характеристическом числе
export type CharNumSettings = {
    //введенное значение
    value: string,
    //следует ли отображать ошибку в поле ввода
    error: boolean
};

//Настройки для рисунков фиксированного размера
export type FixedDrawSetting = {
    width: number
};
//Настройки для рисунков изменяющих размер
export type DrawSetting = {
    minWidth: number,
    maxWidth: number
};

//Начальное значение характеристических чисел
export const aInitialCharNums = ['0.25', '2', '2.5'];
//Объект настроек отображения для рисунков
export const aInitialDrawSetting = {
    polycycle: { width: 300 },
    simplex: { width: 300 },
    unfold: {
        minWidth: 300,
        maxWidth: 500
    },
    diagram: {
        minWidth: 300,
        maxWidth: 500
    }
};
//Получить начальный объект для хранилища store.draw
export function getDrawInitialState() {
    return (
        {
            isMonodromic: true,
            charNums: aInitialCharNums.map(sNum => {
                return {
                    value: sNum,
                    error: false
                };
            }),
            drawCntWidth: 0
        }
    );
};

//Ограничить ширину рисунка по его настройкам отображения
export function boundWidth(nWidth: number, oSetting: DrawSetting) {
    if (!oSetting) { return nWidth; }
    if (nWidth < oSetting.minWidth) {
        return oSetting.minWidth;
    }
    if (nWidth > oSetting.maxWidth) {
        return oSetting.maxWidth;
    }
    return nWidth;
}