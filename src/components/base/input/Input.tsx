import React from 'react';
import UiInput, { TextFieldProps } from '@mui/material/TextField';
import { getClassName } from '../../../utils/appUtils';

import './InputStyle.scss';

// ====================
// Текстовое поле ввода
// ====================

function Input(oProps: TextFieldProps) {
    const { className } = oProps;
    const sClassName = getClassName('app-input', className);

    const oAttr = { ...oProps, size: 'small', className: sClassName } as TextFieldProps;
    return <UiInput {...oAttr} />;
}

export default Input;
