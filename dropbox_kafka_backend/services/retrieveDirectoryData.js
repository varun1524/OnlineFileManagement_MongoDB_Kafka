let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";

handle_request = ((data, callback) =>{
    let response = {};
    try {

        console.log(data.username);
        console.log("In get dir data");
        console.log(data.path);
        let clientPath = data.path;
        let dirpath;
        if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
            dirpath = ("./dropboxstorage/" + data.username + "/" );
        }
        else {
            dirpath = ("./dropboxstorage/" + data.username + "/" + clientPath);
        }
        console.log(dirpath);

        let jsonObj = [];
        let i = 0;
        dirpath=dirpath.replace("//","/");

        mongo.connect(mongoURL, function () {
            let itemPath = {
                path : dirpath
            };
            let storagecoll = mongo.collection("dropboxstorage");
            storagecoll.find(itemPath,{filedata:0}).toArray(function(err,results){
                console.log(results);
                if(err){
                    throw err;
                }
                if(results.length>0) {
                    for (i = 0; i < results.length; i++) {
                        let tempObj = {};
                        console.log(results[i].path);
                        tempObj["id"] = results[i]._id;
                        tempObj["name"] = results[i].name;
                        tempObj["type"] = results[i].type;
                        tempObj["ctime"] = results[i].creationtime;
                        tempObj["path"] = results[i].path;
                        tempObj["size"] = results[i].size;
                        tempObj["starred"] = results[i].starred;
                        tempObj["sharedstatus"] = results[i].sharedstatus;
                        jsonObj.push(tempObj);
                    }
                    response.status = 201;
                    response.username = data.username;
                    response.data = jsonObj;
                    callback(null, response);
                }
                else {
                    response.status = 204;
                    response.username = data.username;
                    response.message = "Directory is Empty";
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