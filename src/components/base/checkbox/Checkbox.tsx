import React from 'react';
import UiCheckbox, { CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Translation } from 'react-i18next';
import { getClassName } from '../../../utils/appUtils';

import './CheckboxStyle.scss';

// =======
// Чекбокс
// =======

type MyProps = CheckboxProps & {
    // Пусть в лэйблу в мультиязычной модели
    dataLabelKey?: string;
};

function Checkbox(oProps: MyProps) {
    const { dataLabelKey: sLabelKey, className: sClassName, ...oChBAttr } = oProps;

    const checkboxClassName = getClassName('app-chbox', sClassName);
    Object.assign(oChBAttr, {
        className: checkboxClassName.concat('-chbox'),
    });

    const oCheckbox = <UiCheckbox {...oChBAttr} />;
    if (sLabelKey === undefined) {
        return oCheckbox;
    }

    return (
        <Translation>
            {(t) => (
                <FormControlLabel
                    className={getClassName('app-chbox', checkboxClassName)}
                    control={oCheckbox}
                    label={t(String(sLabelKey))}
                    labelPlacement='start'
                />
            )}
        </Translation>
    );
}

export default Checkbox;
