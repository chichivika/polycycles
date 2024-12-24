import React from 'react';
import { connect } from 'react-redux';

// import './Style.scss';

// ==================================================
// Пустой шаблон для связанного классового компонента
// ==================================================

type MyProps = {};
type MyState = {};
class MyComponent extends React.Component<MyProps, MyState> {
    render() {
        return <div className='' />;
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
