import React, {Component} from 'react';

class ShowActivity extends Component{

    constructor(){
        super();
        this.state = {
            hover: false,
        };
    }

    formatActivity=((item)=>{
        console.log(item);
        if(item.activitytype==="signup"){
            return(
                <div>
                    Created account on {item.activitytime.replace("T"," ").replace("Z","")}
                </div>
            )
        }
        else if(item.activitytype==="login"){
            return(
                <div>
                    Last time logged in on {item.activitytime.replace("T"," ").replace("Z","")}
                </div>
            )
        }
        else if(item.activitytype==="insert"){
            if(item.type==="f")
            {
                return(
                    <div>
                        Inserted File {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }
            else if(item.type==="d") {
                return(
                    <div>
                        Inserted Directory {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }

        }
        else if(item.activitytype==="starred"){
            if(item.type==="f")
            {
                return(
                    <div>
                        Starred File {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }
            else if(item.type==="d") {
                return(
                    <div>
                        Starred Directory {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }
        }
        else if(item.activitytype==="unstarred"){
            if(item.type==="f")
            {
                return(
                    <div>
                        Unstarred File {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }
            else if(item.type==="d") {
                return(
                    <div>
                        Unstarred Directory {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }
        }
        else if(item.activitytype==="share"){
            if(item.type==="f")
            {
                return(
                    <div>
                        Shared File {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }
            else if(item.type==="d") {
                return(
                    <div>
                        Shared Directory {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }
        }
        else if(item.activitytype==="unshared"){
            if(item.type==="f")
            {
                return(
                    <div>
                        Unshared File {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }
            else if(item.type==="d") {
                return(
                    <div>
                        Unshared Directory {item.name} on {item.activitytime.replace("T"," ").replace("Z","")}
                    </div>
                )
            }
        }
    });

    render(){

        const {item} = this.props;

        console.log(item);
        return(
            <tbody>
            <tr>

                <td className="text-justify">
                    {this.formatActivity(item)}
                    {/*{item.activitytype}*/}
                    {/*{item.activitytime}*/}
                    {/*{item.name}*/}
                </td>
                {/*{item.name && ( //Just a change here*/}
                    {/*<td className="text-justify">*/}
                        {/*{item.name}*/}
                    {/*</td>*/}
                {/*)}*/}
            </tr>
            </tbody>
        );
    }
}

export default ShowActivity;