import UiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CheckboxProps } from '@mui/material/Checkbox';

import { Translation } from 'react-i18next';
import { getClassName } from 'utils/appUtils';

import './CheckboxStyle.scss';

//=======
//Чекбокс
//=======

type MyProps = CheckboxProps & {
    //Пусть в лэйблу в мультиязычной модели
    dataLabelKey?: string
}

function Checkbox(oProps: MyProps) {

    let {dataLabelKey: sLabelKey,
        className: sClassName,
         ...oChBAttr} = oProps;

    sClassName = getClassName('app-chbox', sClassName);
    Object.assign(oChBAttr, {
        className: sClassName.concat('-chbox')
    });

    let oCheckbox = (
        <UiCheckbox {...oChBAttr}
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