import './AppStyle.scss';
import Header from '../header/Header';
import Toolbar from '../toolbar/Toolbar';
import DrawCnt from 'components/draw/DrawCnt';

function App() {

  return (
    <div className="App">
      <Header />
      <Toolbar/>
      <DrawCnt/>
    </div>
  );
}

export default App;
