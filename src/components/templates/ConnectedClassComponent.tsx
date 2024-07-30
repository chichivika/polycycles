import React from "react";
import { connect } from 'react-redux';

//import './Style.scss';

type MyProps = {

};
type MyState = {

}
class MyComponent extends React.Component<MyProps, MyState> {
    render() {
        return (
            <div className="">

            </div>
        )
    }
}

const mapStateToProps = () => ({
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);