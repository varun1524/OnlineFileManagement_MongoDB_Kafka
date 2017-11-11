import React, {Component} from 'react';
import Delete from "../images/Delete.png";

class ShowGroupMembers extends Component{

    constructor(){
        super();
        this.state = {
            hover: false,
        };
    }

    showdeleteoptionforadmin = ((item, access)=>{
        if(access==="admin" && item.access!=="admin"){
            return(
                <button className="btn btn-link" onClick={()=>{this.props.handleDeleteMember(item)}}>
                    <img src={Delete} alt="delete" width="15" height="15"/>
                </button>
            )
        }
    });

    render(){

        const {item} = this.props;
        console.log(item);

        return(
            <tbody>
            <tr>

                <td className="text-justify">
                    {item.firstname+"  "}{item.lastname}
                </td>
                <td>
                    {item.username}
                </td>
                <td>
                    {item.access}
                </td>

                    {this.showdeleteoptionforadmin(item, this.props.access)}
            </tr>
            </tbody>
        );
    }
}


export default ShowGroupMembers;