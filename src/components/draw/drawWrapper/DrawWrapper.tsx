import React, { ReactElement } from 'react';
import './DrawWrapperStyle.scss';
import { Translation } from 'react-i18next';
import PopperInfo from '../../base/popperInfo/PopperInfo';

// ===================================================
// Обёртка с дополнительными инструментами для рисунка
// ===================================================

type MyProps = {
    // Дочерний компонент для обертки
    children: ReactElement;
    // Путь к названию рисунка в мультиязычной модели
    labelKey?: string;
    // Путь к пояснению для рисунка в мультиязычной модели
    // При наличии этого свойства игнорируется hoverKeys
    hoverKey?: string;
    // Массив путей к пояснению для рисунка в мультиязычной модели
    // Тексты конкатинируются.
    hoverKeys?: string[];
};
type MyState = {};
class DrawWrapper extends React.Component<MyProps, MyState> {
    render() {
        const { children } = this.props;
        return (
            <div className='draw-graph-wrapper'>
                <div className='draw-header'>
                    {this._renderLabel()}
                    {this._renderInfo()}
                </div>
                {children}
            </div>
        );
    }

    // Отрисовка элемента с пояснением к рисунку
    _renderInfo() {
        const { hoverKey, hoverKeys } = this.props;
        if (typeof hoverKey === 'string') {
            const key = hoverKey as string;
            return <PopperInfo textKey={key} />;
        }
        if (Array.isArray(hoverKeys)) {
            const keys = hoverKeys as string[];
            return (
                <PopperInfo>
                    <Translation>{(t) => <div>{keys.map((key) => t(key))}</div>}</Translation>
                </PopperInfo>
            );
        }
        return null;
    }

    // Отрисовка названия рисунка
    _renderLabel() {
        const { labelKey } = this.props;
        if (typeof labelKey === 'string') {
            const key = labelKey as string;
            return <Translation>{(t) => <div>{t(key)}</div>}</Translation>;
        }
        return null;
    }
}

export default DrawWrapper;
