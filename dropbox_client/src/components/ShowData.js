import React, {Component} from 'react';
import favourite_empty from "../images/favourite_empty.png"
import favourite_filled from "../images/favourite_filled.png";
import Delete from "../images/Delete.png";
import directoryIcon from "../images/directory.png";
import fileIcon from "../images/file.png";
import share from "../images/share.png"

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

    render(){

        const {item} = this.props;

        return(
            <tbody>
            <tr>

                <td className="text-justify">
                    <div className="u-table-row">
                        {this.showItemType(item.type)}
                        <input type="button" value={ item.name.substr(0, 20) } className="btn-link"
                               onClick={()=>{this.props.fetchSelectedDirectoryData(item)}}/>
                    </div>
                </td>
                <td>
                    { item.ctime }
                </td>
                <td>
                    { item.size }
                </td>
                <td >
                    <button className="btn btn-link" onClick={()=>{this.props.handleDelete(item)}}>
                        <img src={Delete} alt="delete" width="15" height="15"/>
                    </button>
                    <button className="btn btn-link" onClick={()=>{this.props.handleShare(item)}}>
                        <img src={share} alt="share" width="15" height="15"/>
                    </button>
                    <button className="btn btn-link" onClick={()=>{this.props.handleStarred(item)}}>
                        {this.getShareStatus(item.starred)}
                    </button>
                </td>
            </tr>
            </tbody>
        );
    }
}


export default ShowData;