import React from 'react';
import DrawSimplex2 from './simplex/ConnectedDrawSimplex';

import './DrawCntStyle.scss';

class DrawCnt extends React.Component<{}, {}>{
    render() {
        return (
            <div className='draw-container'>
                <DrawSimplex2/>
            </div>
        )
    }
}

export default DrawCnt;