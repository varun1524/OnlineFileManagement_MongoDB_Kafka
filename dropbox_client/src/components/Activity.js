import React, {Component} from 'react';
import favourite_empty from "../images/favourite_empty.png"
import favourite_filled from "../images/favourite_filled.png";
import ShowActivity from './ShowActivity';
import * as API from '../api/API';

class Activity extends Component{

    constructor(){
        super();
        this.state = {
            activityData: [],
            message: ""
        };
    }


    getShareStatus = ((status) => {
        if(status){
            return(
                <img src={favourite_filled} width="20" height="20" alt="Directory"/>
            )
        }
        else {
            return(
                <img src={favourite_empty} width="20" height="20" alt="Directory"/>
            )
        }
    });

    getActivityData = (()=>{
        API.getActivityData().then((response) =>{
            if(response.status===201){
                response.json().then((data)=>{
                    this.setState({
                        ...this.state,
                        activityData:data
                    });
                });
            }
            else if(response.status===203){
                console.log("Session Expired. Redirecting to Login");
                this.props.handlePageChange("/home/signup");
            }
            else if(response.status===301){
                console.log("Failed to fetch activity content");
                this.setState({
                    ...this.state,
                    activityData:[],
                    message:"Failed to fetch activity data"
                });
            }
        });
    });

    componentWillMount(){
        this.getActivityData();
    }

    render(){

        return(
            <div className="container-fluid">
                <div className="col-lg-9 col-xs-9 col-md-9 col-sm-9">
                    <div className="row">
                    </div>
                    <div className="row">
                        <div className="row">
                        </div>
                        <div className="row" id="example">
                            <div className="table table-responsive ">
                                <table className="table table-responsive text-justify ">
                                    <thead>
                                    <tr>
                                        <th>Activity</th>
                                    </tr>
                                    </thead>
                                    {
                                        this.state.activityData.map((item, index) => {
                                            return(<ShowActivity
                                                key={index}
                                                item={item}
                                            />)
                                        })
                                    }
                                </table>
                            </div>
                            {/*<input type="button" value="Get Directory Data" onClick={()=>this.getDirectoryData()}/>*/}
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-xs-2 col-md-2 col-sm-2 right">
                    <div className="container-fluid right">
                        <div className="row">
                            {this.state.message && ( //Just a change here
                                <div className="alert alert-info" >
                                    {this.state.message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Activity;