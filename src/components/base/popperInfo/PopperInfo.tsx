import React, {ReactElement} from "react";

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Popper from '@mui/material/Popper';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { Translation } from 'react-i18next';
import './PopperInfoStyle.scss'

//===============================
//Иконка с подсказкой при нажатии
//===============================

type MyProps = {
    //Путь к тексту подсказки в мультиязычной модели
    textKey?: string,
    //Дочерние компоненты (используются вместо текстовой подсказки)
    children?: ReactElement
};
type MyState = {
    //Открыто ли окно с подсказкой
    open: boolean,
    //Элемент, у которого появляется подсказка
    anchorEl: HTMLElement | null
}
class PopperInfo extends React.Component<MyProps, MyState> {
    constructor(oProps: MyProps) {
        super(oProps);
        this.state = {
            open: false,
            anchorEl: null
        };
    }
    render() {
        let oIcon = (
            <IconButton className='popper-info-icon'
                size='small'
                onClick={this.onClick.bind(this)}
            >
                <HelpOutlineIcon />
            </IconButton>
        );
        return (
            <ClickAwayListener onClickAway={this.onClosePopper.bind(this)}>
                <div className='popper-info-cnt'>
                    {oIcon}
                    <Popper className='popper-info'
                        placement='bottom-start'
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}>
                        {this._renderContent()}
                    </Popper>
                </div>
            </ClickAwayListener>
        )
    }
    //Отрисовка содержимого подсказки
    _renderContent() {
        //Если есть дочерние элементы, то игнорируем свойство textKey
        if(this.props.children){
            let aChildren = this.props.children as ReactElement;
            return aChildren;
        }
        //Иначе проверяем textKey и отрисовываем текст
        if (typeof this.props.textKey === 'string') {
            let sKey = this.props.textKey as string;
            return (
                <Translation>
                    {
                        (t) => <div>{t(sKey)}</div>
                    }
                </Translation>
            );
        }
        
        return null;
    }
    //Обработчик события клика вне окна с подсказкой
    onClosePopper() {
        this.setState({
            open: false,
            anchorEl: null
        });
    }
    //Обработчик события клика на иконке для вызова подсказки
    onClick(oEvent: React.MouseEvent<HTMLElement>) {
        this.setState({ anchorEl: oEvent.currentTarget as HTMLElement });
        this.setState({
            open: !this.state.open
        });
    }
}

export default PopperInfo;