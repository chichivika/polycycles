import React from 'react';
import CharNumsTool from '../charNumsTool/CharNumsTool';
import IsMonodromicTool from '../isMonodromicTool/IsMonodromicTool';

import './ToolbarStyle.scss';

// ============================
// Панель с инструментами ввода
// ============================

function Toolbar() {
    return (
        <div className='toolbar'>
            <IsMonodromicTool />
            <CharNumsTool />
        </div>
    );
}

export default Toolbar;
