import React, {Component} from 'react';
import * as API from '../api/API';


class EditProfile extends Component{

    constructor(){
        super();
        this.state = {
            overview: "",
            work: "",
            education: "",
            contactinfo: "",
            lifeevent: "",
            music:false,
            reading:false,
            sports:false
        };
    }

    handleSubmitProfileChange = (()=> {
        console.log(this.state);
        API.changeProfile(this.state).then((response) => {
            if(response.status===201){
                console.log("Added successfully");
                this.props.handlePageChange("/user/profile");
            }
            else  if(response.status===203){
                this.props.handlePageChange("/home/login");
            }
            else  if(response.status===301){
                console.log("Error while adding profile data")
            }
        });
    });

    componentWillMount(){
    }

    render(){
        return(
            <div className="container-fluid">
                <div>
                    <form className="form-horizontal">
                        <div className="col-lg-offset-8 col-md-offset-8 col-sm-offset-8 col-sm-1 col-md-1 col-lg-1">
                            <input type="button" id="btnoverviewedit" value="Cancel" className="btn btn-link"
                                   onClick={(()=>{
                                       this.props.handlePageChange("/user/profile");
                                   })}
                            />
                        </div>
                        <div className="form-group">
                            <div className="col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                <div className="form-group">
                                    <label className="text-justify h3">Edit Profile</label><hr/>
                                </div>

                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="form-horizontal form-control-static">Overview:</label>
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-5 ">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtoverview"
                                        required
                                        onChange={(event) => {
                                            this.setState({
                                                ...this.state,
                                                overview: event.target.value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="form-horizontal form-control-static">Work:</label>
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtwork"
                                        onChange={(event) => {
                                            this.setState({
                                                ...this.state,
                                                work: event.target.value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="form-horizontal form-control-static">Education:</label>
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txteducation"
                                        onChange={(event) => {
                                            this.setState({
                                                ...this.state,
                                                education: event.target.value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="form-horizontal form-control-static">Contact:</label>
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtcontact"
                                        onChange={(event) => {
                                            this.setState({
                                                ...this.state,
                                                contactinfo: event.target.value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="form-horizontal form-control-static">Life Events:</label>
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="txtlifeevents"
                                        onChange={(event) => {
                                            this.setState({
                                                ...this.state,
                                                lifeevent: event.target.value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="form-horizontal form-control-static">Interests:</label>
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-5">
                                    <div className="row checkbox">
                                        <input
                                            type="checkbox"
                                            id="cbmusic"
                                            value="Music"
                                            onChange={(event) => {
                                                this.setState({
                                                    ...this.state,
                                                    music: event.target.checked
                                                })
                                            }}
                                        />Music
                                    </div>

                                    <div className="row checkbox">
                                        <input
                                            type="checkbox"
                                            id="cbreading"
                                            value="Music"
                                            onChange={(event) => {
                                                this.setState({
                                                    ...this.state,
                                                    reading: event.target.checked
                                                })
                                            }}
                                        />Reading
                                    </div>

                                    <div className="row checkbox">
                                        <input
                                            type="checkbox"
                                            id="cbsports"
                                            value="Music"
                                            onChange={(event) => {
                                                this.setState({
                                                    ...this.state,
                                                    sports: event.target.checked
                                                })
                                            }}
                                        />Sports
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="button" className="btn btn-primary" value="Save" onClick={(()=>{this.handleSubmitProfileChange()})}/>
                        </div>
                    </form>
                </div>



                {/*<label>Interest</label><hr/>*/}
                {/*<div className="form-group">*/}
                {/*<input type="checkbox" name="interest" value="Music" />Music*/}
                {/*<input type="checkbox" value="Sports" name="interest"/>Sports*/}
                {/*<input type="checkbox" value="Reading" name="interest"/>Reading*/}
                {/*</div><br/>*/}
            </div>
        );
    }
}


export default EditProfile;