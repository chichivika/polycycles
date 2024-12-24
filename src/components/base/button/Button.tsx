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

function Button(oProps: MyProps) {
    const { dataTextKey: sTextKey, ...oBtnAttr } = oProps;
    const { className } = oProps;

    Object.assign(oBtnAttr, {
        size: 'small',
        className: getClassName('app-btn', className),
        variant: 'contained',
    });

    return (
        <Translation>
            {(t) => <UiButton {...oBtnAttr}>{renderText(t, sTextKey)}</UiButton>}
        </Translation>
    );
}

// Отрисовка текста кнопки
function renderText(t: typeof i18n.t, sTextKey?: string) {
    if (typeof sTextKey === 'string') {
        return t(sTextKey);
    }
    return null;
}

export default Button;
