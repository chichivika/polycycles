import React from 'react';
import DrawPolycycle from './polycycle/ConnectedDrawPolycycle';
import DrawSimplex from './simplex/ConnectedDrawSimplex';
import Unfold from './unfold/ConnectedUnfold';

import './DrawCntStyle.scss';

class DrawCnt extends React.Component<{}, {}>{
    render() {
        return (
            <div className='draw-container'>
                <DrawPolycycle/>
                <DrawSimplex/>
                <Unfold/>
            </div>
        )
    }
}

export default DrawCnt;