import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import ResultCnt from './ResultCnt';
import {
    selectIsTypicalCase,
    selectResults,
    selectIsFormError,
    PolycycleResult,
} from '../../appRedux/drawSelectors';
import { StateType } from '../../appRedux/store';

import './ResultsStyle.scss';

// ==================================================
// Основные результаты
// ==================================================

type MyProps = {
    isError: boolean;
    isTypicalCase: boolean;
    results: PolycycleResult;
};
type MyState = {};
class ResultsBar extends React.Component<MyProps, MyState> {
    render() {
        return <div className='results-bar'>{this._renderResultsList()}</div>;
    }

    _renderResultsList() {
        const { isError, isTypicalCase, results } = this.props;

        if (!isTypicalCase) {
            return (
                <Translation>
                    {(t) => (
                        <span className='results-bar-not-typical-text'>
                            {t('drawDiagram.notTypicalCase')}
                        </span>
                    )}
                </Translation>
            );
        }
        if (results === null || isError) {
            return null;
        }

        return [
            this._renderCyclesCount(),
            this._renderMultiplicityTwo(),
            this._renderMultiplicityThree(),
        ];
    }

    _renderCyclesCount() {
        const { results } = this.props;
        if (results === null) {
            return null;
        }

        const { isKSetEmpty, intersectionCount } = results;
        let count: number;
        if (isKSetEmpty) {
            count = 1;
        } else {
            count = intersectionCount === 0 ? 2 : 3;
        }

        return (
            <Translation key='count'>
                {(t) => (
                    <ResultCnt label={t('results.limitCyclesCount.label')} text={String(count)} />
                )}
            </Translation>
        );
    }

    _renderMultiplicityTwo() {
        const { results } = this.props;
        if (results === null) {
            return null;
        }

        const { isKSetEmpty } = results;
        const textKey = isKSetEmpty ? 'notExist' : 'exist';
        return (
            <Translation key='multiplicityTwo'>
                {(t) => (
                    <ResultCnt
                        label={t('results.limitCyclesMultiplicityTwo.label')}
                        text={t(`results.${textKey}`)}
                    />
                )}
            </Translation>
        );
    }

    _renderMultiplicityThree() {
        const { results } = this.props;
        if (results === null) {
            return null;
        }

        const { intersectionCount } = results;

        const textKey = intersectionCount > 0 ? 'exist' : 'notExist';
        const countText = intersectionCount > 0 ? ` (${intersectionCount})` : '';
        return (
            <Translation key='multiplicityThree'>
                {(t) => (
                    <ResultCnt
                        label={t('results.limitCyclesMultiplicityThree.label')}
                        text={`${t(`results.${textKey}`)}${countText}`}
                    />
                )}
            </Translation>
        );
    }
}

const mapStateToProps = (state: StateType) => {
    return {
        isTypicalCase: selectIsTypicalCase(state),
        results: selectResults(state),
        isError: selectIsFormError(state),
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ResultsBar);
