import React from 'react';
import DrawSimplex from './simplex1/ConnectedDrawSimplex1';
import DrawSimplex2 from './simplex2/ConnectedDrawSimplex2';

import './DrawCntStyle.scss';

class DrawCnt extends React.Component<{}, {}>{
    render() {
        return (
            <div className='draw-container'>
                <DrawSimplex />
                <DrawSimplex2/>
            </div>
        )
    }
}

export default DrawCnt;