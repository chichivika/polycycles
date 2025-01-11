import React from 'react';
import './HeaderStyle.scss';
import { Translation } from 'react-i18next';

import LangSelect from './LangSelect';

// ===================================
// Заглавная панель приложения
// ===================================

function Header() {
    return (
        <header className='header'>
            <Translation>
                {(t) => <div className='title'>{t('title').toUpperCase()}</div>}
            </Translation>
            <LangSelect />
        </header>
    );
}

export default Header;
