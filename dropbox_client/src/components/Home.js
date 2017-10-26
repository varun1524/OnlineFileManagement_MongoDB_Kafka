import React, {Component} from 'react';
import * as API from '../api/API';
import StarredData from './StarredData';
import SharedByMe from "./SharedByMe";
import SharedWithMe from './SharedWithMe';

class Home extends Component {

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
            starredData : [],
            sharedByMeData : [],
            sharedWithMeData : [],
            sharedWithMePath : ""
        };
    }

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
                response.json().then((data) => {
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

                    this.fetchStarredData();
                });
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

    redirectParentDirectory(){
        console.log(this.state.sharedWithMePath);
        if(this.state.sharedWithMePath.trim()!=="" || this.state.sharedWithMePath!==undefined || this.state.sharedWithMePath!==null){
            let splitPath = this.state.sharedWithMePath.trim().split("/");
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
                sharedWithMePath : tempPath
            });
            this.fetchDataSharedWithUser();
        }
        else {
            console.log("Already in Root Directory");
        }
    }

    fetchStarredData = (() => {
        this.setState((state) => {
            let tempPath="";
            if(state.dirpath!==null || state.dirpath!== undefined || state.dirpath!== "") {
                tempPath = state.dirpath + "/";
            }
            else{
                tempPath = "";
            }
            let path = {
                "path": tempPath
            };
            console.log(state.dirpath);

            API.fetchStarredData(path).then((response) => {
                if (response.status === 204) {
                    this.setState({
                        ...this.state,
                        starredData: [],
                        message: "Directory is Empty",
                    });
                    state.dirpath = state.dirpath + path.path;
                }
                else if(response.status === 201) {
                    response.json().then((data) => {
                        console.log(data);
                        this.setState({
                            ...this.state,
                            starredData: data,
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
                        message: "Session Expired. Login Again"
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
        if(item.type==="d") {
            API.getSession().then((response)=> {
                if(response.status===201){
                    response.json().then((data)=>{
                        let userpath = "./dropboxstorage/"+data.username+"/";
                        console.log(userpath);

                        let i = userpath.length;
                        console.log(i);
                        let path = item.path.substr(i,item.path.length) + item.name + "/";
                        console.log(path);
                        this.props.redirectToFile(path);
                    });
                }
                else if(response.status===203){
                    console.log("Session Expired");
                    this.props.handlePageChange("/");
                }
            });
        }

        // this.setState((state) => {
        //     let path={
        //         "path": item.path + item.name +"/"
        //     };
        //
        //     if(item.type==="d") {
        //         API.getStarredDirectoryData(path.path).then((response) => {
        //             if (response.status === 204) {
        //                 this.setState({
        //                     ...this.state,
        //                     starredData: [],
        //                     message: "Directory is Empty",
        //                 });
        //             }
        //             else {
        //                 response.json().then((data) => {
        //                     if (response.status === 201) {
        //                         console.log(data);
        //                         this.setState({
        //                             ...this.state,
        //                             starredData: data,
        //                             message: "Directory Data Received",
        //                         });
        //                     }
        //                     // else if (response.status === 204) {
        //                     //     this.setState({
        //                     //         ...this.state,
        //                     //         dirData: data
        //                     //     });
        //                     //     console.log(data.message);
        //                     // }
        //                     else if (response.status === 301) {
        //                         this.setState({
        //                             ...this.state,
        //                             message: "Error while loading directories"
        //                         });
        //                         console.log(data.message);
        //                     }
        //                     else if (response.status === 203) {
        //                         this.setState({
        //                             ...this.state,
        //                             message: data.message
        //                         });
        //                         console.log(data.message);
        //                         this.props.handlePageChange("/");
        //                     }
        //                     else {
        //                         console.log("Error");
        //                     }
        //                 });
        //             }
        //         });
        //     }
        //     else{
        //         console.log("You selected file");
        //     }
        //     console.log(state);
        // });

    });

    fetchDataSharedByUser = (()=>{
        this.setState((state) => {

            API.fetchDataSharedByUser().then((response) => {
                if (response.status === 204) {
                    this.setState({
                        ...this.state,
                        sharedByMeData: [],
                        message: "Directory is Empty",
                    });
                    // state.dirpath = state.dirpath + path.path;
                }
                else if(response.status === 201) {
                    response.json().then((data) => {
                        console.log(data);
                        this.setState({
                            ...this.state,
                            sharedByMeData: data,
                            message: "Directory Data Received",
                        });
                        // this.props.redirectToFile()
                        // state.dirpath = state.dirpath + path.path;
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
                        message: "Session Expired. Login Again"
                    });
                    this.props.handlePageChange("/");
                }
                else {
                    console.log("Error");
                }
            });
        });
    });

    fetchDataSharedWithUser = (()=>{
        API.fetchDataSharedWithUser().then((response) => {
            if (response.status === 204) {
                this.setState({
                    ...this.state,
                    sharedWithMeData: [],
                    message: "Directory is Empty",
                });
                // state.dirpath = state.dirpath + path.path;
            }
            else if(response.status === 201) {
                response.json().then((data) => {
                    console.log(data);
                    this.setState({
                        ...this.state,
                        sharedWithMeData: data,
                        message: "Directory Data Received",
                    });
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
                    message: "Session Expired. Login Again"
                });
                this.props.handlePageChange("/");
            }
            else {
                console.log("Error");
            }
        });
    });

//     fetchSelectedDataSharedWithUser =  (()=>{
//         this.setState((state) => {
//             let path = {
//                 "path" : this.state.sharedWithMePath
//             };
//             API.fetchSelectedDataSharedWithUser(path).then((response) => {
//                 if (response.status === 204) {
//                     this.setState({
//                         ...this.state,
//                         sharedWithMeData: [],
//                         message: "Directory is Empty",
//                     });
// // state.dirpath = state.dirpath + path.path;
//                 }
//                 else if(response.status === 201) {
//                     response.json().then((data) => {
//                         console.log(data);
//                         this.setState({
//                             ...this.state,
//                             sharedWithMeData: data,
//                             message: "Directory Data Received",
//                         });
//                         // this.props.redirectToFile()
//                         // state.dirpath = state.dirpath + path.path;
//                     });
//                 }
//                 else if (response.status === 301) {
//                     this.setState({
//                         ...this.state,
//                         message: "Error while loading directories"
//                     });
//                 }
//                 else if (response.status === 203) {
//                     this.setState({
//                         ...this.state,
//                         message: "Session Expired. Login Again"
//                     });
//                     this.props.handlePageChange("/");
//                 }
//                 else {
//                     console.log("Error");
//                 }
//             });
//         });
//     });

    showParentButton = (()=>{
        // if(this.state.dirpath!=="") {
        return(
            <input type="button" value="../.."
                   className="btn btn-link btn-group-lg" onClick={() => {
                this.redirectParentDirectory()
            }}/>
        )
        // }
    });

    accessSharedData = ((item)=>{

        if(item.type === "d") {
            let data = {
                item: item
            };
            API.accessSharedData(data).then((response) => {
                if (response.status === 201) {
                    response.json().then((data) => {
                        console.log(data);
                        this.setState({
                            ...this.state,
                            sharedWithMeData: data,
                            sharedWithMePath: data[0].path
                        })
                    });
                }
                else if (response.status === 204) {
                    this.setState({
                        ...this.state,
                        sharedWithMeData: [],
                        sharedWithMePath: "",
                    })
                }
                else if (response.status === 203) {
                    console.log("Session Expired. Login Again.");
                    this.props.handlePageChange("/");
                }
            });
        }
        else {
            console.log("select file");
        }
    });


    componentWillMount(){
        API.getSession().then((response)=>{
            if(response.status===201){
                this.fetchStarredData();
                this.fetchDataSharedByUser();
                this.fetchDataSharedWithUser();
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
        console.log("did");
    }

    componentDidUpdate(){
    }

    componentWillUpdate(){
        // this.fetchDirectoryData(this.state.dirpath);
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
                                    <tr className="h3">Starred</tr>
                                    <tr>
                                        <th>name</th>
                                        {/*<th>type</th>*/}
                                        {/*<th>ctime</th>*/}
                                        <th>mtime</th>
                                        <th>size</th>
                                    </tr>
                                    </thead>
                                    {/*<tr>*/}
                                    {/*<td className="text-justify">*/}
                                    {/*{this.showParentButton()}*/}
                                    {/*</td>*/}
                                    {/*</tr>*/}
                                    {
                                        this.state.starredData.map((item, index) => {
                                            return(<StarredData
                                                key={index}
                                                item={item}
                                                // handleDelete = {this.handleDelete}
                                                // handleShare = {this.handleShare}
                                                fetchSelectedDirectoryData = {this.fetchSelectedDirectoryData}
                                                handleStarred = {this.handleStarred}
                                            />)
                                        })
                                    }
                                </table>
                            </div>
                            {/*<input type="button" value="Get Directory Data" onClick={()=>this.getDirectoryData()}/>*/}
                        </div>
                        <div className="row" id="example">
                            <div className="table table-responsive ">
                                <table className="table table-responsive text-justify ">
                                    <thead>
                                    <tr className="h3">Shared by Me</tr>
                                    <tr>
                                        <th>name</th>
                                        {/*<th>type</th>*/}
                                        {/*<th>ctime</th>*/}
                                        <th>mtime</th>
                                        <th>size</th>
                                    </tr>
                                    {/*<tr>*/}
                                    {/*<td className="text-justify">*/}
                                    {/*{ this.showParentButton()}*/}
                                    {/*</td>*/}
                                    {/*</tr>*/}
                                    </thead>
                                    {
                                        this.state.sharedByMeData.map((item, index) => {
                                            return(<SharedByMe
                                                key={index}
                                                item={item}
                                                // handleDelete = {this.handleDelete}
                                                // handleShare = {this.handleShare}
                                                fetchSelectedDirectoryData = {this.fetchSelectedDirectoryData}
                                                handleShare = {this.props.handleShare}
                                            />)
                                        })
                                    }
                                </table>
                            </div>
                            {/*<input type="button" value="Get Directory Data" onClick={()=>this.getDirectoryData()}/>*/}
                        </div>
                        <div className="row" id="example">
                            <div className="table table-responsive ">
                                <table className="table table-responsive text-justify ">
                                    <thead>
                                    <tr className="h3">Shared With Me</tr>
                                    <tr>
                                        <th>name</th>
                                        {/*<th>type</th>*/}
                                        {/*<th>ctime</th>*/}
                                        <th>mtime</th>
                                        <th>size</th>
                                    </tr>
                                    </thead>
                                    <tr>
                                        <td className="text-justify">
                                            {this.showParentButton()}
                                        </td>
                                    </tr>
                                    {
                                        this.state.sharedWithMeData.map((item, index) => {
                                            return(<SharedWithMe
                                                key={index}
                                                item={item}
                                                accessSharedData = {this.accessSharedData}
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
                            {/*<Modal isOpen={this.state.modalIsOpen} onCancel={this.toggleModal} backdropClosesModal>*/}
                            {/*<ModalHeader text="Lots of text to show scroll behavior" showCloseButton onClose={this.toggleModal} />*/}
                            {/*<ModalBody>[...]</ModalBody>*/}
                            {/*<ModalFooter>*/}
                            {/*<Button type="primary" onClick={this.toggleModal}>Close modal</Button>*/}
                            {/*<Button type="link-cancel" onClick={this.toggleModal}>Also closes modal</Button>*/}
                            {/*</ModalFooter>*/}
                            {/*</Modal>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;