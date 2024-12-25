import React from 'react';
import UiInput, { TextFieldProps } from '@mui/material/TextField';
import { getClassName } from '../../../utils/appUtils';

import './InputStyle.scss';

// ====================
// Текстовое поле ввода
// ====================

function Input(props: TextFieldProps) {
    const { className } = props;

    const inputAttrs = {
        ...props,
        size: 'small',
        className: getClassName('app-input', className),
    } as TextFieldProps;
    return <UiInput {...inputAttrs} />;
}

export default Input;
