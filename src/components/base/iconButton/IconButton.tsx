import React from 'react';
import UiIconButton, { IconButtonProps } from '@mui/material/IconButton';
import './IconButtonStyle.scss';

class IconButton extends React.Component<IconButtonProps> {
    render() {
        const { children, ...attrs } = this.props;
        return (
            <UiIconButton className='app-icon-button' size='small' {...attrs}>
                {children}
            </UiIconButton>
        );
    }
}

export default IconButton;
