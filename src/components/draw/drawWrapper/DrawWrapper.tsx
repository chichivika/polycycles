import React, { ReactElement } from "react";
import './DrawWrapperStyle.scss';
import { Translation } from "react-i18next";
import PopperInfo from "components/base/popperInfo/PopperInfo";

type MyProps = {
    children: ReactElement,
    labelKey?: string,
    hoverKey?: string,
    hoverKeys?: string[]
};
type MyState = {

}
class DrawWrapper extends React.Component<MyProps, MyState> {
    render() {
        return (
            <div className='draw-graph-wrapper'>
                <div className='draw-header'>
                    {this._renderLabel()}
                    {this._renderInfo()}
                </div>
                {this.props.children}
            </div>
        )
    }
    _renderInfo() {
        if (typeof this.props.hoverKey === 'string') {
            let sKey = this.props.hoverKey as string;
            return (
                <PopperInfo textKey={sKey} />
            );
        }
        if (Array.isArray(this.props.hoverKeys)) {
            let aKeys = this.props.hoverKeys as string[];
            return (
                <PopperInfo>
                    <Translation>
                        {
                            (t) => <div>{aKeys.map(sKey => t(sKey))}</div>
                        }
                    </Translation>
                </PopperInfo>
            );
        }
        return null;
    }
    _renderLabel() {
        if (typeof this.props.labelKey === 'string') {
            let sKey = this.props.labelKey as string;
            return (
                <Translation>{
                    (t) => <div>{t(sKey)}</div>
                }
                </Translation>
            );
        }
        return null;
    }
}

export default DrawWrapper;