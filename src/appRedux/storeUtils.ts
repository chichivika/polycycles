export type FixedDrawSetting = {
    width: number
};
export type DrawSetting = {
    minWidth: number,
    maxWidth: number
};

export const aInitialCharNums = ['0.25', '2', '2.5'];
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