let act = require('./activity');
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";

handle_request = ((data, callback) => {
    let response = {};
    try{
        console.log("in create directory");
        console.log(data.username);
        console.log(data.groupName);
        let groupName = data.groupName;
        let username = data.username;
        let grpDirpath = "./dropboxstorage/" + groupName;

        mongo.connect(mongoURL, function () {
            let group = mongo.collection("group");
            group.find({$and:[{groupname:groupName},{owner:username}]}).toArray(function (err, results) {
                console.log(results.length);
                if(err){
                    console.log(err);
                    throw err;
                }
                if(results.length===0){
                    group.insertOne({groupname:groupName,owner:username,creationtime:new Date()}, function (err, result) {
                        console.log(result);
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        if(result.insertedCount===1){
                            /*act.insertIntoActivity(function (err, isactivityinserted) {
                                if(isactivityinserted) {*/
                                        response.status=201;
                                        response.data = result;
                                        response.message = "Group Created Successfully";
                                        callback(null, response);
                                // }
                                /*else {
                                    response.status = data.username;
                                    response.status = 301;
                                    response.message = "Group created. But failed to add as an activity";
                                    callback(null, response);
                                }
                            }, username ,"group", result.insertedId ,result.creationtime);*/
                        }
                        else {
                            response.status=301;
                            response.data=result;
                            response.message="Failed to Create group "+groupName;
                            callback(null, response);
                        }
                    });
                }
                else {
                    response.status = 301;
                    response.message = "Group Name already exists";
                    callback(null, response);
                }
            });
        });
    }
    catch (e)
    {
        console.log(e);
        response.status = 301;
        response.message = e;
        callback(e, response);
    }
});

exports.handle_request = handle_request;