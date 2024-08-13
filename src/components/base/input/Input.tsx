import UiInput from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material/TextField';

import { getClassName } from 'utils/appUtils';

import './InputStyle.scss';

//====================
//Текстовое поле ввода
//====================

function Input(oProps: TextFieldProps) {

    let sClassName = getClassName('app-input', oProps.className);

    let oAttr = Object.assign({}, oProps, {
        size: 'small',
        className: sClassName
    });

    return (
        <UiInput {...oAttr}
        />
    );
}

export default Input;