import './AppStyle.scss';
import Header from '../header/Header';
import Toolbar from '../toolbar/Toolbar';
import DrawInfo from 'components/draw/DrawInfo';
import DrawCnt from 'components/draw/DrawCnt';

function App() {

  return (
    <div className="App">
      <Header />
      <Toolbar/>
      <DrawInfo/>
      <DrawCnt/>
    </div>
  );
}

export default App;
