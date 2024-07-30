import UiButton from '@mui/material/Button';
import { ButtonProps } from '@mui/material/Button';

import { Translation } from 'react-i18next';
import { getClassName } from 'utils/appUtils';

import './ButtonStyle.scss';

type MyProps = ButtonProps & {
    dataTextKey?: string
};

function Button(oProps: MyProps) {

    let sTextKey = oProps.dataTextKey ? oProps.dataTextKey : '';
    let oAttr = Object.assign({...oProps}, {
        size: 'small',
        className: getClassName('app-btn', oProps.className),
        variant: "contained"
    });
    delete oAttr['dataTextKey'];

    return (
        <Translation>
            {
                (t, { i18n }) =>
                    <UiButton {...oAttr}>{t(sTextKey)}</UiButton>
            }
        </Translation >
    );
}

export default Button;