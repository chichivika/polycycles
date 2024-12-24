import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material';

import { setLanguage, getLanguage, getAllLanguages } from '../../locales/i18n';

import './HeaderStyle.scss';

// =========================================
// Инструмент для изменения языка приложения
// =========================================

type MyProps = {};
type MyState = {
    // Выбранный язык
    value: string;
};
class LangSelect extends React.Component<MyProps, MyState> {
    constructor(oProps: MyProps) {
        super(oProps);
        this.state = {
            value: getLanguage(),
        };
    }

    render() {
        const { value } = this.state;

        return (
            <Select value={value} className='lang-select' onChange={this.onValueChange.bind(this)}>
                {getAllLanguages().map((sKey) => {
                    return (
                        <MenuItem key={sKey} value={sKey}>
                            {sKey}
                        </MenuItem>
                    );
                })}
            </Select>
        );
    }

    // Обработчик события изменения выбора
    onValueChange(oEvent: SelectChangeEvent<string>) {
        const sNewValue = oEvent.target.value;
        this.setState({ value: sNewValue });
        setLanguage(sNewValue);
    }
}

export default LangSelect;
