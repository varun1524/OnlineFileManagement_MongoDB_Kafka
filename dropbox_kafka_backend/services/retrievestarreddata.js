let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";

handle2 = ((data, callback) =>{
    let res = {};
    try {
        console.log(data.username);
        if(data.username!==null || data.username!==undefined) {
            let username = data.username;
            let clientPath = data.path;
            let dirpath;
            if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
                dirpath = ("./dropboxstorage/" + username + "/" );
            }
            else {
                dirpath = ("./dropboxstorage/" + data.username + "/" + clientPath);
            }
            console.log(dirpath);

            let jsonObj = [];
            let i = 0;

            mongo.connect(mongoURL, function () {
                let storagecoll = mongo.collection("dropboxstorage");
                storagecoll.find({$and:[{ownerusername:username},{starred:true}]},{filedata:0}).toArray(function (err, results) {
                    if(err){
                        throw err;
                    }
                    else
                    {
                        if(results.length>0) {
                            for (i = 0; i < results.length; i++) {
                                let tempObj = {};
                                console.log(results[i].path);
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
                            res.status = 201;
                            res.username = username;
                            res.data = jsonObj;
                            res.message = "Starred Data received";
                            callback(null, res);
                        }
                        else {
                            res.status = 204;
                            res.message = "No starred data present";
                            callback(null, res);
                        }
                    }
                });
            });
        }
        else{
            res.status = 203;
            res.message = "Session Expired";
            callback(null, res);
        }
    }
    catch (e){
        console.log(e);
        res.status = 301;
        res.message = "Error while receiving starred data: "+e;
        callback(e, res);
    }
});

exports.handle2 = handle2;
