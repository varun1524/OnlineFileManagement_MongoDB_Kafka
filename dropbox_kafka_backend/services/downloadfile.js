let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

handle_request = ((data, callback) =>{
    let response = {};
    try {

        console.log(data.username);
        console.log("In download file data");

        mongo.connect(mongoURL, function () {
            let storagecoll = mongo.collection("dropboxstorage");
            storagecoll.findOne({"_id":ObjectId(data.fileid)}, function(err,results){
                console.log(results);
                if(err){
                    throw err;
                }
                if(results!==null && results!== undefined) {
                    let tempObj = {};
                    console.log(results.path);
                    tempObj["id"] = results._id;
                    tempObj["name"] = results.name;
                    tempObj["type"] = results.type;
                    tempObj["ctime"] = results.creationtime;
                    tempObj["path"] = results.path;
                    tempObj["size"] = results.size;
                    tempObj["starred"] = results.starred;
                    tempObj["sharedstatus"] = results.sharedstatus;
                    tempObj["filedata"] = results.filedata;
                    response.status = 201;
                    response.username = data.username;
                    response.data = tempObj;
                    callback(null, response);
                }
                else {
                    response.status = 301;
                    response.username = data.username;
                    response.message = "Failed to download data";
                    callback(null, response);
                }
            });
        });

    }
    catch (e){
        console.log(e);
        response.status = 301;
        response.username = data.username;
        response.message = e;
        callback(null, response);
    }
});

exports.handle_request = handle_request;