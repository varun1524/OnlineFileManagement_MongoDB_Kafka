import React, {Component} from 'react';
//import PropTypes from 'prop-types';

class Message extends Component {

    // static propTypes = {
    //     message: PropTypes.string.isRequired
    // };

    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-5 col-xs-5 col-lg-5 col-sm-5">
                    {this.props.message && ( //Just a change here
                        <div className="alert alert-warning" role="alert">
                            {this.props.message}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Message;