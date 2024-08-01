import React from 'react';
import ShowRools from 'components/charNumsTool/ShowRools';
import CharNumInput from './CharNumInput';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { StateType } from 'appRedux/store';
import { selectIsInputErrorState } from 'appRedux/drawSlice';

type MyProps = {
    isError?: boolean
}

class CharacterNumsTool extends React.Component<MyProps, {}> {
    render() {
        return (
            <div className='char-nums-tool'>
                <ShowRools />
                {this.renderLabel()}
                <div className='char-nums-cnt'>
                    {this.renderInputs()}
                    {this.getHelpText()}
                </div>
            </div>
        )
    }
    renderLabel() {
        return (
            <Translation>
                {
                    (t, { i18n }) =>
                        <span className='label-for-character-numbers'>{t('toolbar.characterNumbers')}</span>
                }
            </Translation>
        );
    }
    renderInputs(){
        return (
            <div className='char-nums-inputs-cnt'>
                <CharNumInput i={0}/>
                <CharNumInput i={1}/>
                <CharNumInput i={2}/>
            </div>
        );
    }
    getHelpText() {
        if (!this.props.isError) {
            return null;
        }
    
        return (
            <div className='char-nums-help-text'>
                <Translation>
                    {
                        (t, { i18n }) =>
                            <span>{t('toolbar.charNumHelpText')}</span>
                    }
                </Translation>
            </div>
        );
    }
}

const mapStateToProps = (oState: StateType) => ({
    isError: selectIsInputErrorState(oState)
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CharacterNumsTool);