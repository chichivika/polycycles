import CharNumsTool from 'components/charNumsTool/CharNumsTool';
import IsMonodromicTool from 'components/isMonodromicTool/IsMonodromicTool';

import './ToolbarStyle.scss';

//============================
//Панель с инструментами ввода
//============================

function Toolbar(){
    return (
        <div className="toolbar">
                <IsMonodromicTool/>
                <CharNumsTool/>
            </div>
    );
}

export default Toolbar;