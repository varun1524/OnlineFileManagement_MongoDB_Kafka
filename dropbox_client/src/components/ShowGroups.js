import React, {Component} from 'react';
import Delete from "../images/Delete.png";
import {Link} from 'react-router-dom';

class ShowGroups extends Component{

    showDelete = ((item)=> {
        if (item.owner !== undefined && item.owner!==null && item.owner!==""){
            return (
                <button className="btn btn-link" onClick={() => {
                    this.props.handleDeleteGroup(item)
                }}>
                    <img src={Delete} alt="delete" width="15" height="15"/>
                </button>
            )
        }
        else {
            return (<span></span>);
        }
    });

    render(){

        const {item} = this.props;

        console.log(item);
        return(
            <tbody>
            <tr>
                <td className="text-justify">
                    <div className="u-table-row">
                        {/*<input type="button" value={item.groupname} className="btn-link"
                               onClick={()=>{this.props.groupSelected(item)}}/>*/}
                        <Link
                            to={`/user/group/${item.groupid}`}
                            className="btn btn-link"
                            key={item.groupid}>
                            {item.groupname}
                        </Link>
                    </div>
                </td>
                <td>
                    { item.ctime.replace("T"," ").replace("Z","") }
                </td>
                <td>
                    {item.groupowner!==undefined && item.groupowner!==null && item.groupowner!=="" ? item.groupowner : item.owner }
                </td>
                <td>
                    {item.access!=="read" || item.access!=="read" ? "Admin" : item.access}
                </td>
                <td >
                    {this.showDelete(item)}

                </td>
            </tr>
            </tbody>
        );
    }
}


export default ShowGroups;