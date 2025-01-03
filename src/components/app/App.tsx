import React from 'react';
import './AppStyle.scss';
import Header from '../header/Header';
import Toolbar from '../toolbar/Toolbar';
import DrawCnt from '../draw/DrawCnt';

// =============================
// Основной компонент приложения
// =============================

type MyProps = {};
type MyState = {
    // Ширина окна
    windowWidth: number | null;
};
class App extends React.Component<MyProps, MyState> {
    constructor(props: MyProps) {
        super(props);
        this.state = {
            windowWidth: null,
        };
    }

    render() {
        const { windowWidth } = this.state;
        return (
            <div className='App'>
                <Header />
                <Toolbar />
                <DrawCnt windowWidth={windowWidth} />
            </div>
        );
    }

    componentDidMount(): void {
        window.addEventListener('resize', this.onResize.bind(this));
    }

    // Обработчик события изменения ширины окна
    onResize() {
        this.setState({
            windowWidth: window.innerWidth,
        });
    }
}

export default App;
