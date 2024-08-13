import React, { ReactElement } from "react";
import './DrawWrapperStyle.scss';
import { Translation } from "react-i18next";
import PopperInfo from "components/base/popperInfo/PopperInfo";

//===================================================
//Обёртка с дополнительными инструментами для рисунка
//===================================================

type MyProps = {
    //Дочерний компонент для обертки
    children: ReactElement,
    //Путь к названию рисунка в мультиязычной модели
    labelKey?: string,
    //Путь к пояснению для рисунка в мультиязычной модели
    //При наличии этого свойства игнорируется hoverKeys
    hoverKey?: string,
    //Массив путей к пояснению для рисунка в мультиязычной модели
    //Тексты конкатинируются.
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
    //Отрисовка элемента с пояснением к рисунку
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
    //Отрисовка названия рисунка
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