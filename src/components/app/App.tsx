import React from 'react';
import './AppStyle.scss';
import Header from '../header/Header';
import Toolbar from '../toolbar/Toolbar';
import DrawCnt from 'components/draw/DrawCnt';

type MyProps = {

};
type MyState = {
  windowWidth: number | null
}
class App extends React.Component<MyProps, MyState> {
  constructor(oProps: MyProps){
    super(oProps);
    this.state = {
      windowWidth: null
    };
  }
    render() {
        return (
          <div className="App">
          <Header />
          <Toolbar/>
          <DrawCnt windowWidth={this.state.windowWidth}/>
        </div>
        )
    }
    componentDidMount(): void {
      window.addEventListener('resize', this.onResize.bind(this));
    }
    onResize(){
      this.setState({
        windowWidth: window.innerWidth
      });
    }
}

export default App;
