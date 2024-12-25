import React from 'react';
import UiButton, { ButtonProps } from '@mui/material/Button';
import { Translation } from 'react-i18next';
import i18n from '../../../locales/i18n';
import { getClassName } from '../../../utils/appUtils';
import './ButtonStyle.scss';

// ======
// Кнопка
// ======

type MyProps = ButtonProps & {
    // Путь к тексту в мультиязычной модели
    dataTextKey?: string;
};

function Button(props: MyProps) {
    const { dataTextKey, className, ...btnAttrs } = props;

    Object.assign(btnAttrs, {
        size: 'small',
        className: getClassName('app-btn', className),
        variant: 'contained',
    });

    return (
        <Translation>
            {(t) => <UiButton {...btnAttrs}>{renderText(t, dataTextKey)}</UiButton>}
        </Translation>
    );
}

// Отрисовка текста кнопки
function renderText(t: typeof i18n.t, dataTextKey?: string) {
    if (typeof dataTextKey === 'string') {
        return t(dataTextKey);
    }
    return null;
}

export default Button;
