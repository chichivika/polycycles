import React, { ReactElement, RefObject } from 'react';
import './DrawWrapperStyle.scss';
import { Translation } from 'react-i18next';
import DownloadIcon from '@mui/icons-material/Download';
import PopperInfo from '../../base/popperInfo/PopperInfo';
import IconButton from '../../base/iconButton/IconButton';

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
    showDownload?: boolean;
    disabledDownload?: boolean;
    downloadFileName?: string;
};
type MyState = {};
class DrawWrapper extends React.Component<MyProps, MyState> {
    render() {
        const { children } = this.props;
        const drawCntRef = React.createRef<HTMLDivElement>();

        return (
            <div className='draw-graph-wrapper'>
                <div className='draw-header'>
                    {this._renderLabel()}
                    {this._renderInfo()}
                    {this._renderDownloadIcon(drawCntRef)}
                </div>
                <div ref={drawCntRef}>{children}</div>
            </div>
        );
    }

    _renderDownloadIcon(drawCntRef: RefObject<HTMLDivElement>) {
        const { showDownload, disabledDownload } = this.props;
        if (!showDownload) {
            return null;
        }
        return (
            <IconButton
                disabled={!!disabledDownload}
                onClick={() => this._downloadImage(drawCntRef)}
            >
                <DownloadIcon />
            </IconButton>
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

    _downloadImage(drawCntRef: RefObject<HTMLDivElement>) {
        const svgCnt = drawCntRef?.current;
        if (!svgCnt) {
            return;
        }

        const svgImage = svgCnt.querySelector('svg');
        if (svgImage === null) {
            return;
        }

        const link = document.createElement('a');
        const { downloadFileName } = this.props;
        link.download = `${downloadFileName || 'image'}.svg`;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgImage);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.click();
    }
}

export default DrawWrapper;
