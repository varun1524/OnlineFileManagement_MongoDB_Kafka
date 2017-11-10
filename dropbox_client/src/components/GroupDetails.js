import React, {Component} from 'react';
import * as API from '../api/API';
import ShowGroupStorage from './ShowGroupStorage';
import ShowGroupMembers from "./ShowGroupMembers";

class GroupDetails extends Component {

    // static propTypes = {
    //     message: PropTypes.string.isRequired,
    //     title: PropTypes.string.isRequired,
    //     visible: PropTypes.bool
    // };

    constructor(){
        super();
        this.state = {
            message : "",
            groupid : "",
            groupstoragedata : [],
            groupmembers : [],
            dirpath : "",
            parentid : "",
            useraccess : ""
        };

        // this.fetchSelectedDirectoryData = this.fetchSelectedDirectoryData.bind(this);
    }

    fetchGroupMembers = (()=>{
        API.getGroupMembers({groupid:this.state.groupid}).then((response)=>{
            console.log(response.status);
            if(response.status===201){
                response.json().then((data)=>{
                    console.log(data);
                    this.setState({
                        ...this.state,
                        groupmembers : data
                    });
                });
            }
            else if(response.status===203){
                console.log("Session Expired");
                this.props.handlePageChange("/");
            }
            else if(response.status===301){
                this.setState({
                    ...this.state,
                    message : "Error while fetching Group Members"
                });
            }
        });
    });

    handleDeleteData = ((item)=>{
        let data = {
            itemid : item.id,
            groupid : this.state.groupid
        };
        API.deletecontentfromgroup(data).then((response)=>{
           console.log(response.status);
           if(response.status===201){
               this.setState({
                   ...this.state,
                   message:"Data Removed Successfully"
               });
               // this.fetchSelectedDirectoryData({id:this.state.parentid});
           }
           else if(response.status===301){
                this.setState({
                    ...this.state,
                    message:"Failed to remove selected data"
                });
                // this.fetchSelectedDirectoryData({id:this.state.parentid});
           }
        });
        /*API.deleteContentFromGroup(itemid).then((response)=>{
            if(response.status===201){
                this.setState({
                    ...this.state,
                    message:"Deleted Successfuly"
                });
                this.fetchDirectoryData();
            }
            else if(response.status===203){
                this.setState({
                    ...this.state,
                    message:"Session Expired. Sent to Login Screen"
                });
                this.props.handlePageChange("/home/login");
            }
            else if(response.status===301){
                this.setState({
                    ...this.state,
                    message:"Delete Unsuccessful"
                });
            }
        });*/
    });

    handleDeleteMember = ((member)=>{
        console.log(member);
        API.deleteMember({
            groupid:this.state.groupid,
            member:member.username}
        ).then((response)=>{
            console.log(response.status);
            if(response.status===201){

                    response.json().then((msg)=>{
                        this.setState({
                            ...this.state,
                            message:msg.message
                        });
                    });
                    this.fetchGroupMembers();
            }
            else if(response.status===301){
                response.json().then((msg)=>{
                    this.setState({
                        ...this.state,
                        message:msg.message
                    });
                });
                response.json().then((msg)=>{
                    console.log(msg);
                });
            }
            else {
                console.log("error");
            }
        })
    });

    fetchGroupAccessDetails = (()=>{
        API.fetchGroupAccessDetails({"groupid":this.state.groupid}).then((response)=>{
            console.log(response);
            if(response.status===201){
                response.json().then((data)=>{
                    console.log(data);
                    this.setState({
                        ...this.state,
                        useraccess : data.access
                    });
                });
            }
        });
    });

    handleFileUpload = ((event) => {
        //Data Transfer with Byte Array

        let component = this;

        let groupid = this.state.groupid;
        let parentid = this.state.parentid;


        let fileArray = event.target.files;
        let fileReader;
        let fileUploadData = {
            group : {
                groupid: groupid,
                parentid: parentid
            },
            files : []
        };

        console.log(fileArray);
        Array.from(fileArray).map((file)=>{
            fileReader = new FileReader();
            let temp = {};
            console.log(file);

            fileReader.readAsBinaryString(file);

            fileReader.onload = function()  {
                // console.log(this.result);
                let arrayBuffer = this.result;
                // console.log(arrayBuffer);

                temp["filedata"] = arrayBuffer;
                temp["filename"] = file.name;
                temp["size"] = file.size;
                temp["filetype"] = file.type;
                /*temp["groupid"] = groupid;
                temp["parentid"] = parentid;*/
                fileUploadData.files.push(temp);

                if(fileUploadData.files.length === fileArray.length){
                    console.log(fileUploadData);
                    API.uploadFileInGroup(fileUploadData)
                        .then((response) => {
                            if (response.status === 201) {
                                response.json().then((msg)=>{
                                    console.log(msg.message);
                                    component.setState({
                                        ...component.state,
                                        message : msg.message
                                    });
                                });
                                component.fetchSelectedDirectoryData({id : component.state.parentid},false);
                                console.log("File uploaded successfully");
                            }
                            else if(response.status === 203){
                                component.setState({
                                    ...component.state,
                                    message : "Session Expired. Redirecting to Login Page"
                                });
                                console.log("Session Timed Out");
                                component.props.handlePageChange("/home/signup");
                            }
                            else {
                                component.setState({
                                    ...component.state,
                                    message : "File Upload Failed"
                                });
                            }
                        });

                }


                // console.log(arrayData);

                // console.log(arrayBuffer);
                // console.log(arrayBuffer.byteLength);

                // binaryString = String.fromCharCode.apply(null, array);
                // console.log(binaryString);

                // var blob = new Blob([arrayData]);
                // console.log(blob);
                // var link = document.createElement('a');
                // link.href = window.URL.createObjectURL(blob);
                //
                // link.download = file.name;
                // link.click();
            };
        });
    });

    addDictionary = (()=> {

        let directoryName = prompt("Please enter directory name:", "New Folder");
        if (directoryName === null || directoryName === "") {
            console.log("User cancelled the prompt.");
        }
        else {
            if(directoryName.trim()!=='') {
                console.log("Directory Name: " + directoryName);
                let data = {
                    directoryName : directoryName,
                    groupid : this.state.groupid,
                    parentid : (this.state.parentid === "" ? this.state.groupid : this.state.parentid)
                };
                console.log(data);
                API.createDirectoryInGroup(data).then((response) => {
                    console.log(response.status);
                    if(response.status===201){
                        response.json().then((msg)=>{
                            this.setState({
                                ...this.state,
                                message : msg.message
                            });
                            this.fetchSelectedDirectoryData({id:this.state.parentid});
                        });
                    }
                    else if(response.status === 301) {
                        response.json().then((msg)=>{
                            this.setState({
                                ...this.state,
                                message : msg.message
                            })
                        });
                    }
                    else if(response.status === 203) {
                        console.log("Session Expired");
                        this.props.handlePageChange("/");

                    }

                });
            }
            else {
                console.log("Directory Name is Empty");
            }
        }
    });

    addMembers = (()=>{
        let sharingData = prompt("Please enter email id of users separated by semicolon ';' ");
        if (sharingData === null) {
            console.log("User cancelled the prompt.");
        }
        else {
            sharingData = sharingData.trim();
            if(sharingData === "")
            {
                console.log("User cancelled the prompt.");
            }
            else {
                let memberids;
                memberids = sharingData.trim().split(";");
                let data = {
                    userdata:[],
                    groupid: this.state.groupid
                };
                memberids.every((id) => {
                    // let temp = {};
                    if (id === "") {
                        memberids.splice(memberids.indexOf(id), 1);
                        return id;
                    }
                    // temp["username"] = id;
                    data.userdata.push(id);
                    return id;
                });
                console.log(data);
                API.addMembersInGroup(data).then((response) => {
                    // console.log(response);
                    if(response.status === 201){
                        this.setState({
                            ...this.state,
                            message : "Member added successfully"
                        });
                        this.fetchGroupMembers();
                        response.json().then((message) => {
                            console.log(message);
                        });
                    }
                    else if (response.status === 203){
                        this.setState({
                            ...this.state,
                            message : "Session expired. Sending to login screen"
                        });
                        this.props.handlePageChange("/home/signup");
                    }
                    else if (response.status === 301){
                        response.json().then((message) => {
                            console.log(message);
                            this.setState({
                                ...this.state,
                                message : message.message
                            });
                        });
                    }
                });
            }
        }
        // }
    });

    fetchSelectedDirectoryData = ((item, gotoparent=false) => {
        console.log(item);
        console.log(gotoparent);

        this.setState({
            ...this.state,
            parentid : item.id
        });

        let data = {
            groupid : this.state.groupid,
            parentid : item.id,
            gotoparent : gotoparent
        };

        console.log(data);

        if(item.type==="f"){
            /*API.downloadFile({"fileid":item.id}).then((response)=>{
                console.log(response.status);

                if(response.status===201){
                    response.json().then((data)=> {
                        console.log(data);

                        var blob = new Blob([data.filedata]);

                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = data.name;
                        link.click();

                    });
                }
                else if(response.status===203){

                }
                else if(response.status===301){

                }
                // console.log(arrayData);

                // console.log(arrayBuffer);
                // console.log(arrayBuffer.byteLength);

                // binaryString = String.fromCharCode.apply(null, array);
                // console.log(binaryString);


            });*/
            console.log("You selected file");
        }
        else{
            API.getGroupData(data).then((response) => {
                if (response.status === 204) {
                    this.setState({
                        ...this.state,
                        groupstoragedata: [],
                        message: "Directory is Empty",
                    });
                }
                else if (response.status === 205) {
                    this.setState({
                        ...this.state,
                        groupstoragedata: [],
                        message: "Group is Empty",
                    });
                }
                else {
                    if (response.status === 201) {
                        response.json().then((data) => {
                            console.log(data);
                            this.setState({
                                ...this.state,
                                groupstoragedata: data.data,
                                parentid: data.parentid,
                                message: "Directory Data Received",
                            });
                        });
                    }
                    else if (response.status === 301) {
                        this.setState({
                            ...this.state,
                            message: "Error while loading directories"
                        });
                        console.log(data.message);
                    }
                    else if (response.status === 203) {
                        this.setState({
                            ...this.state,
                            message: data.message
                        });
                        console.log(data.message);
                        this.props.handlePageChange("/");
                    }
                    else {
                        console.log("Error");
                    }
                }
            });
        }
    });

    showParentButton = (()=>{
        if(this.state.parentid!==this.state.groupid) {
            return(
                <input type="button" value=".."
                       className="btn btn-link btn-group-lg" onClick={() => {
                    this.fetchSelectedDirectoryData({id:this.state.parentid},true)
                }}/>
            )
        }
    });

    componentWillMount(){
        API.getSession().then((response)=>{
            if(response.status===201){
                let groupid = this.props.context.match.params.groupid;
                this.setState({
                    groupid : this.props.context.match.params.groupid
                });
                console.log(groupid);
                let item = {
                    id:groupid
                };
                this.fetchSelectedDirectoryData(item);
                this.fetchGroupMembers();
                this.fetchGroupAccessDetails();
            }
            else if(response.status===203){
                this.props.handlePageChange("/");
            }
            else{
                console.log("Error");
            }
        });
    }

    showAddMemberButton = (()=>{
        if(this.state.useraccess==="admin") {
            return (
                <input type="button" className="btn btn-primary pull-left" value="Add Member"
                       onClick={() => this.addMembers()}/>
            )
        }
    });

    showDataUpload = ((access)=>{
        console.log(access);
        if(access==="admin" || access==="write") {
            return (
                <div className="container-fluid right">
                    <div className="row">
                        {this.state.message && ( //Just a change here
                            <div className="alert alert-info">
                                {this.state.message}
                            </div>
                        )}
                    </div>
                    <div className="row">
                        <button className="btn btn-primary" value="Add Directory" onClick={() => this.addDictionary()}>
                            Add Directory
                        </button>
                    </div>
                    <div className="row">
                        <form>
                            <input
                                className="fileupload"
                                type="file"
                                name="mydata"
                                multiple="multiple"
                                onChange={this.handleFileUpload}
                            />
                        </form>
                    </div>
                </div>
            )
        }
        else {
            return(
                <div className="container-fluid right">
                    <label>Read Access</label>
                </div>
            )
        }
    });

    componentDidMount(){
    }

    componentDidUpdate(){
    }

    componentWillUpdate(){
    }


    render() {

        const groupid = this.props.context.match.params.groupid;
        console.log(this.props.groups);
        console.log(this.props.context);
        console.log(groupid);

        let group = {};

        this.props.groups.map((grp)=>{
            if(grp.groupid===groupid){
                group=grp;
            }
        });

        console.log(group);

        return (
            <div className="container-fluid">
                <div className="col-lg-9 col-xs-9 col-md-9 col-sm-9">
                    <div className="row">
                    </div>
                    <div className="row">
                        <div className="row">
                            <label>Group: {group.groupname}</label>
                        </div>
                        <div className="row" id="example">
                            <div className="table table-responsive ">


                                <table className="table table-responsive text-justify ">
                                    <thead>
                                    <tr>
                                        <th>name</th>
                                        <th>type</th>
                                        <th>ctime</th>
                                    </tr>
                                    </thead>
                                    <tr>
                                        <td className="text-justify">
                                            { this.showParentButton()}
                                        </td>
                                    </tr>
                                    {
                                        this.state.groupstoragedata.map((item, index) => {
                                            return(<ShowGroupStorage
                                                key={index}
                                                item={item}
                                                handleDeleteData = {this.handleDeleteData}
                                                access = {this.state.useraccess}
                                                fetchSelectedDirectoryData = {this.fetchSelectedDirectoryData}
                                            />)
                                        })
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="row">
                            <label>Members</label>
                        </div>
                        <div className="row" id="example">
                            <div className="table table-responsive ">
                                {this.showAddMemberButton()}

                                <table className="table table-responsive text-justify ">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Access</th>
                                    </tr>
                                    </thead>
                                    {
                                        this.state.groupmembers.map((item, index) => {
                                            return(<ShowGroupMembers
                                                key={index}
                                                item={item}
                                                handleDeleteMember = {this.handleDeleteMember}
                                                access = {this.state.useraccess}
                                            />)
                                        })
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2 col-xs-2 col-md-2 col-sm-2 right">
                    {this.showDataUpload(this.state.useraccess)}
                </div>
            </div>
        );
    }
}

export default GroupDetails;