let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

handle_request = ((data, callback) => {
    let response = {};
    try {
        console.log(data.username);
        if(data.username!==null || datausername!==undefined) {
            let username = data.username;
            console.log(data.item);
            let item = data.item;
            path=item.path + item.name + "/";
            console.log(path);

            mongo.connect(mongoURL, function () {
                let storagecoll = mongo.collection("dropboxstorage");
                storagecoll.find({path:path},{filedata:0}).toArray(function (err, results) {
                    console.log("result:");
                    console.log(results);
                    if(err){
                        throw err;
                    }
                    if(results.length>0) {
                        let jsonObj=[];
                        for (j = 0; j < results.length; j++) {
                            let tempObj = {};
                            tempObj["id"] = results[j]._id;
                            tempObj["name"] = results[j].name;
                            tempObj["path"] = results[j].path;
                            tempObj["type"] = results[j].type;
                            tempObj["ctime"] = results[j].creationtime;
                            tempObj["size"] = results[j].size;
                            tempObj["starred"] = results[j].starred;
                            tempObj["sharedstatus"] = results[j].sharedstatus;
                            jsonObj.push(tempObj);
                        }
                        response.status = 201;
                        response.data = jsonObj;
                        callback(null, response);
                    }
                    else {
                        response.status = 204;
                        response.data = "Directory is Empty";
                        callback(null, response);
                    }
                });
            });
        }
    }
    catch (e){
        console.log(e);
        response.status = 301;
        response.data = "Error while navigating in data shared with user";
        callback(e, response);
    }
});

exports.handle_request = handle_request;
