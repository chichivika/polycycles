import UiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { CheckboxProps } from '@mui/material/Checkbox';

import { Translation } from 'react-i18next';
import { getClassName } from 'utils/appUtils';

import './CheckboxStyle.scss';

type MyProps = CheckboxProps & {
    dataLabelKey?: string
}

function Checkbox(oProps: MyProps) {

    let sClassName = getClassName('app-chbox', oProps.className);
    let sLabelKey = oProps.dataLabelKey;

    let oAttr = {...oProps,
        className: sClassName
    };
    delete oAttr['dataLabelKey'];
    oAttr.className = sClassName.concat('-chbox');

    let oCheckbox = (
        <UiCheckbox {...oAttr}
        />
    );
    if(sLabelKey === undefined){
        return oCheckbox;
    }
    else {
        return (
            <Translation>
                {
                    (t, { i18n }) => <FormControlLabel
                        className={sClassName}
                        control={oCheckbox}
                        label={t(String(sLabelKey))}
                        labelPlacement="start"
                    />
                }
            </Translation>
        );
    }
}

export default Checkbox;