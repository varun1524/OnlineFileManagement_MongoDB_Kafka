import React, {Component} from 'react';

class ShowProfileData extends Component{

    constructor(){
        super();
        this.state = {
            hover: false,
        };
    }

    showInterest = ((item) => {
        let interest="";
        if(item.reading){
            interest = interest + "Reading "
        }
        if(item.sports){
            interest = interest + "Sports "
        }
        if(item.music){
            interest = interest + "Music "
        }
        return (interest);
    });

    render(){

        const {item} = this.props;
        console.log(item);
        return(
            <form className="form-horizontal">

                <div className="form-group">
                    <div className="col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                        <div className="form-group">
                            <label className="text-justify h3">Profile</label><hr/>
                        </div>
                        <div className="col-sm-3 col-md-3 col-lg-3">
                            <label className="form-horizontal form-control-static">Overview:</label>
                        </div>
                        <div className="col-sm-5 col-md-5 col-lg-5 ">
                            <input
                                type="text"
                                className="form-control"
                                id="txtoverview"
                                value={item.overview}
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
                                value={item.work}
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
                                value={item.education}
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
                                value={item.contactinfo}
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
                                value={item.lifeevents}
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
                            <input
                                type="text"
                                className="form-control"
                                id="txtlifeevents"
                                value={this.showInterest(item)}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}


export default ShowProfileData;