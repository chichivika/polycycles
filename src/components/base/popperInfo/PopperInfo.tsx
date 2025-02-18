import React, { ReactElement } from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Translation } from 'react-i18next';
import IconButton from '../iconButton/IconButton';
import './PopperInfoStyle.scss';
import { getClassName } from '../../../utils/appUtils';

// ===============================
// Иконка с подсказкой при нажатии
// ===============================

type MyProps = {
    // Путь к тексту подсказки в мультиязычной модели
    textKey?: string;
    // Дочерние компоненты (используются вместо текстовой подсказки)
    children?: ReactElement;
    icon?: ReactElement;
    className?: string;
};
type MyState = {
    // Открыто ли окно с подсказкой
    open: boolean;
    // Элемент, у которого появляется подсказка
    anchorEl: HTMLElement | null;
};
class PopperInfo extends React.Component<MyProps, MyState> {
    constructor(props: MyProps) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null,
        };
    }

    render() {
        const { open, anchorEl } = this.state;
        const { icon, className } = this.props;

        const infoIcon = (
            <IconButton size='small' onClick={this.onClick.bind(this)}>
                {icon || <HelpOutlineIcon />}
            </IconButton>
        );
        return (
            <ClickAwayListener onClickAway={this.onClosePopper.bind(this)}>
                <div className={getClassName('popper-info-cnt', className)}>
                    {infoIcon}
                    <Popper
                        className='popper-info'
                        placement='bottom-start'
                        open={open}
                        anchorEl={anchorEl}
                    >
                        {this._renderContent()}
                    </Popper>
                </div>
            </ClickAwayListener>
        );
    }

    // Отрисовка содержимого подсказки
    _renderContent() {
        const { children, textKey } = this.props;
        // Если есть дочерние элементы, то игнорируем свойство textKey
        if (children) {
            return children;
        }

        // Иначе проверяем textKey и отрисовываем текст
        if (typeof textKey === 'string') {
            const sKey = textKey as string;
            return <Translation>{(t) => <div>{t(sKey)}</div>}</Translation>;
        }

        return null;
    }

    // Обработчик события клика вне окна с подсказкой
    onClosePopper() {
        this.setState({
            open: false,
            anchorEl: null,
        });
    }

    // Обработчик события клика на иконке для вызова подсказки
    onClick(event: React.MouseEvent<HTMLElement>) {
        const { open } = this.state;
        this.setState({ anchorEl: event.currentTarget as HTMLElement });
        this.setState({
            open: !open,
        });
    }
}

export default PopperInfo;
