import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SignUp from "./SignUp";

class Login extends Component{

    state = {
        username:"",
        password:""
    };

    componentWillMount(){
        this.setState({
            ...this.state,
            username:"",
            password:""
        });

        // this.props.doesSessionExist("");
    }

    render(){
        return(
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-offset-3 col-md-offset-3 col-lg-offset-3 col-sm-10 col-md-10 col-lg-10 col-xs-10">
                        <div className="panel panel-primary">
                            <div className="panel-body">
                                <div className="panel-heading">
                                    <Link to={'/home/signup'} component={SignUp}>Sign Up</Link>
                                </div>
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <div className="col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="inputUsername"
                                                id="inputUsername"
                                                placeholder="Email Id"
                                                required
                                                onChange={(event) => {
                                                    this.setState({
                                                        ...this.state,
                                                        username: event.target.value
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="inputPassword"
                                                id="inputPassword"
                                                placeholder="Password"
                                                required
                                                onChange={(event) => {
                                                    this.setState({
                                                        ...this.state,
                                                        password: event.target.value
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3">
                                            <input type="button" className="btn btn-primary col-sm-8 col-md-8 col-lg-8"
                                                    onClick={()=>this.props.handleLogin(this.state)} value="Login"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Login;
