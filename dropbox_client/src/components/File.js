import React, {Component} from 'react';
import * as API from '../api/API';
import ShowData from './ShowData';
// import '../../node_modules/elemental/less/elemental.less';
// import { Button, Alert, Spinner, Modal, ModalBody, ModalFooter, ModalHeader } from 'elemental'

class File extends Component {

    // static propTypes = {
    //     message: PropTypes.string.isRequired,
    //     title: PropTypes.string.isRequired,
    //     visible: PropTypes.bool
    // };
    constructor(){
        super();
        this.state = {
            message : "",
            dirpath : "",
            dirData : [],
            // modelIsOpen : true
        };

        // this.fetchSelectedDirectoryData = this.fetchSelectedDirectoryData.bind(this);
    }

    handleDelete = ((item)=>{
        let itemid = {
            id : item.id
        };
        API.deleteContent(itemid).then((response)=>{
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
        });
    });

    handleStarred = ((item) => {
        // console.log(item);
        let data={
            id:"",
            changeStatusTo:""
        };
        data.id = item.id;
        data.changeStatusTo = !(item.starred);
        console.log(data);
        API.changeStarredStatus(data).then((response)=>{
            if(response.status===201){
                console.log(data);
                let msg="";
                if(item.starred){
                    msg= "Removed from Favourite";
                }
                else {
                    msg= "Added to Favourite";
                }
                this.setState({
                    message: msg
                });
                this.fetchDirectoryData();
            }
            else if(response.status===203){
                this.setState({
                    message: "Session Expired. Login again."
                });
                this.props.handlePageChange("/");
            }
            else if(response.status===301){
                this.setState({
                    message: "Error while changing Favourite status"
                });
            }
        });
    });

    //Converting Uploaded file to bytearray and sending
    handleFileUpload = ((event) => {
        //Data Transfer with Byte Array
        let path;
        if(this.state.dirpath.trim()!=="" || this.state.dirpath!==undefined || this.state.dirpath!==null){
            path = this.state.dirpath
        }
        else {
            path = "";
        }

        let component = this;

        let fileArray = event.target.files;
        let fileReader;
        let fileUploadData = [];

        console.log(fileArray);
        Array.from(fileArray).map((file)=>{
            fileReader = new FileReader();
            let temp = {};
            console.log(file);
            // var arrayBuffer = this.result,
            //     array = new Uint8Array(arrayBuffer),
            //     binaryString = String.fromCharCode.apply(null, array);

            // console.log(binaryString);

            fileReader.readAsBinaryString(file);

            fileReader.onload = function()  {
                console.log(this.result);
                var arrayBuffer = this.result;
                console.log(arrayBuffer);
                // var arrayData = new Uint8Array(arrayBuffer);
                // //
                // console.log(arrayData);
                // //
                // // var blob = new Blob([arrayData]);
                // // console.log(blob);
                // let binaryString = String.fromCharCode.apply(null, arrayData);
                // console.log(binaryString);
                // var base64 = String.fromCharCode.apply(null,arrayData);
                // console.log(base64);

                // binaryString = String.fromCharCode.apply(null, array);
                // console.log(arrayData.length);
                temp["filedata"] = arrayBuffer;
                // var blob = new Blob([arrayData]);
                // console.log(blob);
                // var link = document.createElement('a');
                // link.href = window.URL.createObjectURL(blob);
                // link.download = file.name;
                // link.click();
                // temp["filedatastring"] = this.result;
                // fs.writeFile(file.name, file.filedatastring);
                // fs.createWriteStream("test/"+file.name, this.result);
                // temp["file"] = blob;
                temp["filename"] = file.name;
                temp["size"] = file.size;
                temp["filetype"] = file.type;
                temp["path"] = path;
                fileUploadData.push(temp);

                if(fileUploadData.length === fileArray.length){
                    API.uploadFile(fileUploadData)
                        .then((status) => {
                            if (status === 201) {
                                component.setState({
                                    ...component.state,
                                    message : "File uploaded successfully"
                                });
                                component.fetchDirectoryData();
                                console.log("File uploaded successfully");
                            }
                            else if(status === 204){
                                component.setState({
                                    ...component.state,
                                    message : "File already exist on this path            "
                                });
                            }
                            else if(status === 203){
                                component.setState({
                                    ...component.state,
                                    message : "Session Expired. Redirecting to Login Page"
                                });
                                console.log("Session Timed Out");
                                component.props.handlePageChange("/home/signup");
                            }
                            else if(status === 301){
                                component.setState({
                                    ...component.state,
                                    message : "Failed to upload files"
                                });
                                console.log("Error while uploading file");
                            }
                            else {
                                console.log("File upload failed");
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

    /*handleFileUpload = (event) => {
        // const payload = new FormData();

        const payload = new FormData();
        let fileArray = event.target.files;
        Array.from(fileArray).map((file)=>{
            console.log(file);
            payload.append('mydata',file);
            return file;
        });

        let path;
        if(this.state.dirpath.trim()!=="" || this.state.dirpath!==undefined || this.state.dirpath!==null){
            path = {
                "path" : this.state.dirpath
            };
        }
        else {
            path = {
                "path" : ""
            };
        }
        API.sendDirectorayPath(path).then((response) => {
            if(response.status===201){
                API.uploadFile(payload)
                    .then((status) => {
                        if (status === 201) {
                            this.setState({
                                ...this.state,
                                message: "File uploaded successfully"
                            });
                            this.fetchDirectoryData();
                            console.log("File uploaded successfully");
                        }
                        else if(status === 203){
                            console.log("Session Timed Out");
                            this.props.handlePageChange("/home/signup");
                        }
                        else if(status === 301){
                            console.log("Error while uploading file");
                        }
                        else {
                            console.log("File upload failed");
                        }
                    });
            }
            else if(response.status === 203) {
                console.log("Session Expired");
                this.props.handlePageChange("/");
            }
        });





    };*/

    addDictionary = (()=> {

        let directoryName = prompt("Please enter directory name:", "New Folder");
        if (directoryName === null || directoryName === "") {
            console.log("User cancelled the prompt.");
        }
        else {
            if(directoryName.trim()!=='') {
                console.log("Directory Name: " + directoryName);
                let data = {
                    directoryName: directoryName,
                    dirpath: this.state.dirpath
                };
                console.log(data);
                API.createDirectory(data).then((response) => {
                    response.json().then((msg)=>{
                        console.log(msg);
                        if(response.status===201){
                            this.setState({
                                ...this.state,
                                message : msg.message
                            });
                            this.fetchDirectoryData();
                        }
                        else if(response.status === 301) {
                            this.setState({
                                ...this.state,
                                message : msg.message
                            })
                        }

                    });
                });
            }
            else {
                console.log("Directory Name is Empty");
            }
        }
    });

    redirectParentDirectory(){
        console.log(this.state.dirpath);
        if(this.state.dirpath.trim()!=="" || this.state.dirpath!==undefined || this.state.dirpath!==null){
            let splitPath = this.state.dirpath.trim().split("/");
            console.log(splitPath);
            let tempPath = "";
            if(splitPath.length>0) {
                splitPath.splice(splitPath.length - 2, 2);

                if(splitPath.length>0) {
                    for(let i=0; i<splitPath.length;i++){
                        tempPath=tempPath + splitPath[i] + "/";
                    }
                }
            }

            console.log(splitPath);

            this.setState({
                ...this.state,
                dirpath : tempPath
            });
            this.fetchDirectoryData("");
        }
        else {
            console.log("Already in Root Directory");
        }
    }

    fetchDirectoryData = (() => {
        this.setState((state) => {
            let path;
            let tempPath="";
            if(state.dirpath!==null || state.dirpath!== undefined) {
                tempPath = state.dirpath + "/";
            }
            else{
                tempPath = "";
            }
            path = {
                "path": tempPath
            };

            console.log(state.dirpath);

            API.getDirectoryData(path).then((response) => {
                if (response.status === 204) {
                    this.setState({
                        ...this.state,
                        dirData: [],
                        message: "Directory is Empty",
                    });
                    state.dirpath = state.dirpath + path.path;
                }
                else if(response.status === 201) {
                    response.json().then((data) => {
                        // let temp = state.dirpath + path.path;
                        this.setState({
                            ...this.state,
                            dirData: data,
                            message: "Directory Data Received",
                        });
                        state.dirpath = state.dirpath + path.path;
                    });
                }
                else if (response.status === 301) {
                    this.setState({
                        ...this.state,
                        message: "Error while loading directories"
                    });
                }
                else if (response.status === 203) {
                    this.setState({
                        ...this.state,
                        message: "Session Expired."
                    });
                    this.props.handlePageChange("/");
                }
                else {
                    console.log("Error");
                }
            });
        });
    });

    fetchSelectedDirectoryData = ((item) => {
        console.log(item);
        this.setState((state) => {
            let path={
                "path": state.dirpath + item.name +"/"
            };
            console.log(state.dirpath);

            if(item.type==="d") {
                state.dirpath = path.path;
                API.getDirectoryData(path).then((response) => {
                    if (response.status === 204) {
                        this.setState({
                            ...this.state,
                            dirData: [],
                            message: "Directory is Empty",
                        });
                    }
                    else {
                        response.json().then((data) => {
                            if (response.status === 201) {
                                console.log(data);
                                this.setState({
                                    ...this.state,
                                    dirData: data,
                                    message: "Directory Data Received",
                                });
                            }
                            // else if (response.status === 204) {
                            //     this.setState({
                            //         ...this.state,
                            //         dirData: data
                            //     });
                            //     console.log(data.message);
                            // }
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
                        });
                    }
                });
            }
            else if(item.type==="f"){
                console.log("You selected file");
                this.props.handleFileDownload(item);
            }
            console.log(state);
        });

    });

    showParentButton = (()=>{
        // if(this.state.dirpath!=="") {
        return(
            <input type="button" value=".."
                   className="btn btn-link btn-group-lg" onClick={() => {
                this.redirectParentDirectory()
            }}/>
        )
        // }
    });

    componentWillMount(){
        API.getSession().then((response)=>{
            if(response.status===201){
                console.log(this.props.path);
                if(this.props.path!=="") {
                    this.setState({
                        dirpath:this.props.path
                    });
                }
                this.fetchDirectoryData();
            }
            else if(response.status===203){
                this.props.handlePageChange("/");
            }
            else{
                console.log("Error");
            }
        });
    }

    componentDidMount(){
    }

    componentDidUpdate(){
    }

    componentWillUpdate(){
        // API.getSession().then((response)=>{
        //     if(response.status===201){
        //         this.fetchDirectoryData(this.state.dirpath);
        //     }
        //     else if(response.status===203){
        //         this.props.handlePageChange("/");
        //     }
        //     else{
        //         console.log("Error");
        //     }
        // });
    }

    shouldComponentUpdate(){
        return true;
    }

    render() {
        return (
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
                                        <th>Name</th>
                                        <th>Creation time</th>
                                    </tr>
                                    </thead>
                                    <tr>
                                        <td className="text-justify">
                                            { this.showParentButton()}
                                        </td>
                                    </tr>
                                    {
                                        this.state.dirData.map((item, index) => {
                                            return(<ShowData
                                                key={index}
                                                item={item}
                                                handleDelete = {this.handleDelete}
                                                handleShare = {this.props.handleShare}
                                                fetchSelectedDirectoryData = {this.fetchSelectedDirectoryData}
                                                handleStarred = {this.handleStarred}
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
                        <div className="row">
                            <button className="btn btn-primary" value="Add Directory" onClick={()=>this.addDictionary()}>
                                Add Directory
                            </button>
                            {/*<Modal isOpen={this.state.modalIsOpen} onCancel={this.toggleModal} backdropClosesModal>*/}
                            {/*<ModalHeader text="Lots of text to show scroll behavior" showCloseButton onClose={this.toggleModal} />*/}
                            {/*<ModalBody>[...]</ModalBody>*/}
                            {/*<ModalFooter>*/}
                            {/*<Button type="primary" onClick={this.toggleModal}>Close modal</Button>*/}
                            {/*<Button type="link-cancel" onClick={this.toggleModal}>Also closes modal</Button>*/}
                            {/*</ModalFooter>*/}
                            {/*</Modal>*/}
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
                </div>
            </div>
        );
    }
}

export default File;