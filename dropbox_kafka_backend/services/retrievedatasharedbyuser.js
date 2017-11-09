let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

handle_request = ((data, callback) => {
    let response = {};
    try {
        console.log(data.username);
        if(data.username!==null || data.username!==undefined) {
            // let clientPath = req.body.path;
            let username = data.username;
            // let dirpath;
            // if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
            //     dirpath = ("./dropboxstorage/" + req.session.username + "/" );
            // }
            // else {
            //     dirpath = ("./dropboxstorage/" + req.session.username + "/" + clientPath);
            // }
            // console.log(dirpath);
            //
            // let files = fs.readdirSync(dirpath);
            // console.log(files);
            let jsonObj = [];
            let i = 0;

            // dirpath=dirpath.replace("//","/");

            mongo.connect(mongoURL, function () {
                let storagecoll = mongo.collection("dropboxstorage");
                storagecoll.find({$and:[{ownerusername : username},{sharedstatus : true}]},{filedata:0}).toArray(function(err,results){
                    console.log(results);
                    if(err){
                        throw err;
                    }
                    else
                    {
                        if(results.length>0) {
                            for (i = 0; i < results.length; i++) {
                                let tempObj = {};
                                tempObj["id"] = results[i]._id;
                                tempObj["name"] = results[i].name;
                                tempObj["path"] = results[i].path;
                                tempObj["type"] = results[i].type;
                                tempObj["ctime"] = results[i].creationtime;
                                tempObj["size"] = results[i].size;
                                tempObj["starred"] = results[i].starred;
                                tempObj["sharedstatus"] = results[i].sharedstatus;
                                jsonObj.push(tempObj);
                            }
                            response.status=201;
                            response.message = "data retrieved successfully";
                            response.username = username;
                            response.data = jsonObj;
                            callback(null, response);
                        }
                        else {
                            response.status=204;
                            response.message = "User has not shared data with anyone";
                            callback(null, response);
                        }
                    }
                });
            });
        }
        else{
            response.status=203;
            response.message = "Session Expired. Please Login Again";
            callback(null, response);
        }
    }
    catch (e){
        console.log(e);
        response.status=301;
        response.message = "Failed to retrieve data shared with other users";
        callback(e, response);
    }
});

exports.handle_request = handle_request;
