import React, {Component} from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import SignUp from './SignUp';
import * as API from '../api/API';
import Login from './Login';
import Message from './Message';
import User from './User';
import dropboxIcon from '../images/dropbox.png'

class MainPage extends Component {

    state={
        isLoggedIn:false,
        username:"",
        message:""
    };

    handleSignUp=((userdata)=>{
        console.log(userdata);

        API.doSignUp(userdata)
            .then((status) => {

                console.log(status);

                if (status === 201) {
                    this.setState({
                        ...this.state,
                        isLoggedIn: true,
                        message: "You have successfully signed up. Please login here",
                        username: userdata.username
                    });
                    this.handlePageChange("/home/login")
                } else if (status === 401) {
                    console.log("State");
                    this.setState({
                        ...this.state,
                        isLoggedIn: false,
                        message: "Error while adding userdata"
                    });
                    // this.props.history.push("/signup")
                }
                else if(status === 301){
                    this.setState({
                        ...this.state,
                        isLoggedIn: false,
                        message: "Email Id already exists. Try to sign up with another Email Id"
                    });
                    // this.props.history.push("/signup")
                }
                else
                {
                    this.setState({
                        ...this.state,
                        isLoggedIn: false,
                        message: "Error while signing up."
                    });
                }
            });
    });

    handleLogin=((loginData)=>{
        console.log(loginData);

        API.doLogin(loginData)
            .then((status) => {
                if(status===201){
                    this.setState({
                        ...this.state,
                        isLoggedIn: true,
                        message: ("Welcome to my App " + loginData.username),
                        username: loginData.username
                    });
                    sessionStorage.setItem('username',loginData.username);
                    this.handlePageChange("/user/home")
                }
                else if(status===301){
                    this.setState({
                        ...this.state,
                        isLoggedIn: false,
                        message: "username or password is invalid"
                    });
                    // this.props.history.push("/login")
                }
                else if(status===401){
                    this.setState({
                        ...this.state,
                        isLoggedIn: false,
                        message: "Error on server side while fetching data"
                    });
                    // this.props.history.push("/login")
                }
            });
    });

    handleLogout=(()=>{
        API.doLogout()
            .then((status) => {
                if(status===201){
                    sessionStorage.removeItem('username');
                    this.setState({
                        ...this.state,
                        isLoggedIn: false,
                        message: "User Logged out"
                    });
                    this.handlePageChange("/");
                }
                else if(status===401){
                    this.setState({
                        ...this.state,
                        isLoggedIn: true,
                        message: "Error on server side while fetching data"
                    });
                }
            });
    });

    handlePageChange=((page)=>{
        this.props.history.push(page);
    });

    doesSessionExist = (()=>{
        API.getSession().then((response) => {
           if(response.status === 201){
               response.json().then((data) => {
                    this.setState({
                        ...this.state,
                        isLoggedIn : true,
                        username : data.username
                    })
               });
               this.props.history.push("/user/home");
           }
           else if(response.status === 203) {
               this.setState({
                   ...this.state,
                   isLoggedIn : false,
                   username : ""
               });
               this.props.history.push("/home/signup");
           }
        });
    });

    render(){
        return(
            <div>
                <Switch>
                    <Route exact path="/" render={() =>(
                        <div>
                            {this.doesSessionExist()}
                        </div>
                    )}/>

                    <Route path="/home" render={() => (
                        <div>
                            <div className="container-fluid">
                                <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12">
                                    <div className="row">
                                        <div className= "col-lg-1 col-md-1 col-xs-1 col-sm-1">
                                            <img src={dropboxIcon} width="50" height="50" alt="DropBox"/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-7 col-xs-7 col-md-7 col-sm-7">
                                        </div>
                                        <div className="col-lg-5 col-xs-5 col-md-5 col-sm-5">
                                            <Switch>
                                                <Route path= "/home/signup" render={() => (
                                                    <div>
                                                        <SignUp
                                                            handleSignUp={this.handleSignUp}
                                                            handlePageChange={this.handlePageChange}
                                                        />
                                                        <Message message={this.state.message}/>
                                                    </div>
                                                )}/>
                                                <Route path="/home/login" render={() => (
                                                    <div>
                                                        <Login
                                                            handleLogin={this.handleLogin}
                                                            handlePageChange={this.handlePageChange}
                                                        />
                                                        <Message message={this.state.message}/>
                                                    </div>
                                                )}/>
                                            </Switch>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}/>
                    <Route path="/user" render={() => (
                        <div>
                            <User
                                username={this.state.username}
                                handleLogout={this.handleLogout}
                                handlePageChange={this.handlePageChange}
                                doesSessionExist={this.doesSessionExist}
                            />
                        </div>
                    )}/>
                </Switch>
            </div>
        )
    }
}

export default withRouter(MainPage);
