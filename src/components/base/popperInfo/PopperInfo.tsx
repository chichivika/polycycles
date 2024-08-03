import React from "react";

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Popper from '@mui/material/Popper';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { Translation } from 'react-i18next';
import './PopperInfoStyle.scss'

type MyProps = {
    textKey: string
};
type MyState = {
    open: boolean,
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
            <ClickAwayListener onClickAway={this.closePopper.bind(this)}>
                <div className='popper-info-cnt'>
                    {oIcon}
                    <Popper className='popper-info'
                        placement='bottom-start'
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}>
                        <Translation>
                            {
                                (t) => <div>{t(this.props.textKey)}</div>
                            }
                        </Translation>
                    </Popper>
                </div>
            </ClickAwayListener>
        )
    }
    closePopper() {
        this.setState({
            open: false,
            anchorEl: null
        });
    }
    onClick(oEvent: React.MouseEvent<HTMLElement>) {
        this.setState({ anchorEl: oEvent.currentTarget as HTMLElement });
        this.setState({
            open: !this.state.open
        });
    }
}

export default PopperInfo;