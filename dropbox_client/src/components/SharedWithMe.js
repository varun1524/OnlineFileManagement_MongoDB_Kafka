import React, {Component} from 'react';
import directoryIcon from "../images/directory.png";
import fileIcon from "../images/file.png";

class ShowData extends Component{

    constructor(){
        super();
        this.state = {
            hover: false,
        };
    }

    showItemType = ((type) => {
        if(type === "d"){
            // return "Directory";
            return (
                <img src={directoryIcon} width="20" height="20" alt="Directory"/>
            );
        }
        else if (type === "f") {
            return (<img src={fileIcon} width="20" height="20" alt="Directory"/>);
        }
    });

    render(){

        const {item} = this.props;

        return(
            <tbody>
            <tr>
                <td className="text-justify">
                    <div className="u-table-row">
                    {this.showItemType(item.type)}
                    <input type="button" value={ item.name.substr(0, 20) } className="btn-link" onClick={()=>{this.props.accessSharedData(item)}}/>
                    </div>
                </td>
                <td>
                    { item.ctime }
                </td>
                <td>
                    { item.size }
                </td>
            </tr>
            </tbody>
        );
    }
}


export default ShowData;