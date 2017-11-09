let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";

handle_request = ((data, callback) => {
    let response = {};
    try {
        console.log(data.username);
        if(data.username!==null || data.username!==undefined) {
            console.log(data.path);
            let jsonObj = [];
            let i = 0;
            mongo.connect(mongoURL, function () {
                let group = mongo.collection("group");
                group.find({},{groupname:1,owner:1,creationtime:1,members:1,_id:1}).toArray(function(err,results){
                    console.log(results);
                    if(err){
                        throw err;
                    }
                    if(results.length>0) {
                        for (i = 0; i < results.length; i++) {
                            let tempObj = {};
                            if (results[i].owner === data.username) {

                                console.log(results[i].path);
                                tempObj["groupid"] = results[i]._id;
                                tempObj["groupname"] = results[i].groupname;
                                tempObj["owner"] = results[i].owner;
                                tempObj["ctime"] = results[i].creationtime;
                                jsonObj.push(tempObj);
                            }
                            else {
                                if(results[i].members!==null && results[i].members!==undefined){
                                    console.log(results[i].members);
                                    for(j=0;j<results[i].members.length;j++) {
                                        if (results[i].members[j].username === data.username) {
                                            tempObj["groupid"] = results[i]._id;
                                            tempObj["groupname"] = results[i].groupname;
                                            tempObj["access"] = results[i].members[j].access;
                                            tempObj["groupowner"] = results[i].owner;
                                            tempObj["ctime"] = results[i].creationtime;
                                            jsonObj.push(tempObj);
                                        }
                                    }
                                }
                            }
                        }
                        console.log(jsonObj);

                        response.status = 201;
                        response.data = jsonObj;
                        callback(null, response);

                    }
                    else {
                        response.status = 204;
                        response.message = "User is not member of any group";
                        callback(null, response);
                    }
                });
            });
        }
        else{
            response.status = 203;
            response.message = "Session Expired. Please Login Again";
            callback(null, response);
        }
    }
    catch (e){
        console.log(e);
        response.status = 301;
        response.message = "Error while fetching groups";
        callback(e, response);
    }
});

exports.handle_request = handle_request;

