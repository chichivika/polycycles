import UiButton from '@mui/material/Button';
import { ButtonProps } from '@mui/material/Button';

import { Translation } from 'react-i18next';
import { getClassName } from 'utils/appUtils';

import './ButtonStyle.scss';
import i18n from 'locales/i18n';

type MyProps = ButtonProps & {
    dataTextKey?: string
};

function Button(oProps: MyProps) {

    let {dataTextKey: sTextKey, ...oBtnAttr} = oProps;

    Object.assign(oBtnAttr, {
        size: 'small',
        className: getClassName('app-btn', oProps.className),
        variant: "contained"
    });

    return (
        <Translation>
            {
                (t) =>
                    <UiButton {...oBtnAttr}>{renderText(t,sTextKey)}</UiButton>
            }
        </Translation >
    );
}
function renderText(t: typeof i18n.t,sTextKey?: string){
    if(typeof sTextKey === 'string'){
        return t(sTextKey);
    }
    return null;
}

export default Button;