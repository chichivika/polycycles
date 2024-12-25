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

function Checkbox(props: MyProps) {
    const { dataLabelKey, className, ...oChBAttr } = props;

    const checkboxClassName = getClassName('app-chbox', className);
    Object.assign(oChBAttr, {
        className: checkboxClassName.concat('-chbox'),
    });

    const checkboxEl = <UiCheckbox {...oChBAttr} />;
    if (dataLabelKey === undefined) {
        return checkboxEl;
    }

    return (
        <Translation>
            {(t) => (
                <FormControlLabel
                    className={getClassName('app-chbox', checkboxClassName)}
                    control={checkboxEl}
                    label={t(String(dataLabelKey))}
                    labelPlacement='start'
                />
            )}
        </Translation>
    );
}

export default Checkbox;
