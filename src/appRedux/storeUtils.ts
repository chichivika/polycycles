// ==========================================
// Вспомогательные методы для работы со store
// ==========================================

// Объект информации о введенном характеристическом числе
export type CharNumSettings = {
    // введенное значение
    value: string;
    // следует ли отображать ошибку в поле ввода
    error: boolean;
};

// Настройки для рисунков фиксированного размера
export type FixedDrawSettings = {
    width: number;
};
// Настройки для рисунков изменяющих размер
export type DrawSettings = {
    minWidth: number;
    maxWidth: number;
};

// Начальное значение характеристических чисел
export const initialCharNums = ['0.25', '2', '2.5'];
// Объект настроек отображения для рисунков
export const initialDrawSettings = {
    polycycle: { width: 300 },
    simplex: { width: 300 },
    unfold: {
        minWidth: 300,
        maxWidth: 500,
    },
    diagram: {
        minWidth: 300,
        maxWidth: 500,
    },
};
// Получить начальный объект для хранилища store.draw
export function getDrawInitialState() {
    return {
        isMonodromic: true,
        charNums: initialCharNums.map((sNum) => {
            return {
                value: sNum,
                error: false,
            };
        }),
        drawCntWidth: 0,
    };
}

// Ограничить ширину рисунка по его настройкам отображения
export function boundWidth(width: number, settings: DrawSettings) {
    if (!settings) {
        return width;
    }
    if (width < settings.minWidth) {
        return settings.minWidth;
    }
    if (width > settings.maxWidth) {
        return settings.maxWidth;
    }
    return width;
}
