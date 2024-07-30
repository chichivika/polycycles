import React from "react";

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Popper from '@mui/material/Popper';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { Translation } from 'react-i18next';
import i18n from "locales/i18n";
import './CharNumsStyle.scss';

type MyProps = {

};
type MyState = {
    open: boolean,
    anchorEl: HTMLElement | null
}
class ShowRools extends React.Component<MyProps, MyState> {
    constructor(oProps: MyProps) {
        super(oProps);
        this.state = {
            open: false,
            anchorEl: null
        };
    }
    render() {
        let oIcon = (
            <IconButton size='small'
                onClick={this.onClick.bind(this)}
            >
                <HelpOutlineIcon />
            </IconButton>
        );
        return (
            <ClickAwayListener onClickAway={this.closePopper.bind(this)}>
            <div className='char-nums-rools-icon'>
                {oIcon}
                <Popper className='char-nums-rools-popover'
                    placement='bottom-start'
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}>
                    {this.renderRoolDesc()}
                </Popper>
            </div>
            </ClickAwayListener>
        )
    }
    renderRoolDesc() {
        return (
            <Translation>
                {
                    (t, { i18n }) =>

                        <div className='char-nums-rools-cnt'>
                            <div>{t('charNumsTool.roolDesc')}</div>
                            <ul>
                                {this.renderList(t)}
                            </ul>
                        </div>

                }
            </Translation>
        );
    }
    renderList(t: typeof i18n.t) {
        let aList = t('charNumsTool.rools', { returnObjects: true }) as string[];

        return aList.map((sRool,i) => <li key={i}>{sRool}</li>);
    }
    closePopper(){
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

export default ShowRools;