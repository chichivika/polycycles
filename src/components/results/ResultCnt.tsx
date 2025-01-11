import React from 'react';

// =======================================
// Контейнер для вывода результата
// =======================================

type MyProps = {
    label: string;
    text: string;
};
type MyState = {};
class ResultCnt extends React.Component<MyProps, MyState> {
    render() {
        const { label, text } = this.props;
        return (
            <div className='result-cnt'>
                <span className='result-label'>{label}:</span>
                <span className='result-text'>{text}</span>
            </div>
        );
    }
}

export default ResultCnt;
