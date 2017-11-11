let shell = require('shelljs');
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;


handle_request = ((data, callback) => {
    let response = {};
    try {
        console.log(data.username);
        if(data.username!==null || data.username!==undefined) {
            let username = data.username;
            console.log(data);
            let item = data.id;

            mongo.connect(mongoURL, function () {
                let content = {
                    _id : ObjectId(item),
                    ownerusername : username
                };

                let storagecollection = mongo.collection("dropboxstorage");
                storagecollection.find({$and:[{_id : content._id},{ownerusername : username}]}).toArray(function (err, results){
                    console.log(results);
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    if(results.length===1) {
                        let deleteContent = {
                            path : results[0].path,
                        };
                        console.log(deleteContent);
                        storagecollection.deleteOne({$and:[{_id : content._id},{ownerusername : username},{path : deleteContent.path}]},
                            function (err, results1) {
                                console.log(results1.result.n);
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                if(results1.deletedCount === 1){
                                    if(results[0].type==="d") {
                                        storagecollection.deleteMany({$and:[{ownerusername:username},{path: {$regex: deleteContent.path+ results[0].name +"/.*"}}]},
                                            function (err, results2) {
                                                console.log(results2.result.n);
                                                console.log(results2.deletedCount);
                                                if(err){
                                                    console.log("Failed to remove data inside the directory");
                                                    throw err;
                                                }
                                                if (results2.result.n >= 0) {
                                                    response.status=201;
                                                    response.message="Deleted Successfully";
                                                    callback(null, response);
                                                }
                                                else {
                                                    response.status=301;
                                                    response.message="Delete Unsuccessful";
                                                    callback(null, response);
                                                }
                                            });
                                    }
                                    else if(results[0].type==="f"){
                                        response.status=201;
                                        response.message="Deleted Successfully";
                                        callback(null, response);
                                    }
                                }
                                else {
                                    console.log("Error while deletion");
                                }
                            });
                    }
                    else {
                        response.status=301;
                        response.message="Unrecognized Error. Selected item not available on server";
                        callback(null, response);
                    }
                });
            });
        }
    }
    catch (e){
        console.log(e);
        response.status=301;
        response.message="Error while deleting content from server";
        callback(e, response);
    }
});

/*deleteFromFileSystem = ((callback, name, path) => {
    let deleteResult=false;
    let err=null;
    try{
        // console.log("Delete here: "+name+"   "+path);
        console.log(path+name);
        // if(exist){
        shell.rm("-r",path+name);
        if(!fs.existsSync(path+name)){
            console.log("Deletion Done");
            deleteResult=true;
        }
        // }
    }
    catch(e) {
        err=e;
        console.log(e);
        throw e;
    }
    finally {
        callback(err, deleteResult);
    }
});*/

exports.handle_request = handle_request;
