let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

handle_request = ((data, callback) => {
    let response = {};
    try {
        console.log(data.username);
        if(data.username!==null || data.username!==undefined) {
            let username = data.username;
            let clientPath = data.path;
            // let dirpath;
            // if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
            //     dirpath = ("./dropboxstorage/" + req.session.username + "/" );
            // }
            // else {
            //     dirpath = ("./dropboxstorage/" + req.session.username + "/" + clientPath);
            // }
            // console.log(dirpath);

            // let files = fs.readdirSync(dirpath);
            // console.log(files);
            let jsonObj = [];
            let i = 0;

            mongo.connect(mongoURL, function () {
                let sharedetailscoll = mongo.collection("sharedetails");
                sharedetailscoll.find({sharedwith:username}).toArray(function (err, results) {
                    console.log(results);
                    if(err){
                        throw err;
                    }
                    else
                    {
                        if(results.length>0) {
                            let storagecoll = mongo.collection("dropboxstorage");
                            for (i = 0; i < results.length; i++) {
                                let tempObj = {};
                                storagecoll.find({_id : ObjectId(results[i].shareditemid)},{filedata:0}).toArray(function(err,results1) {
                                    console.log(results1);
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        for (j=0; j<results1.length;  j++ ) {
                                            // console.log(results[i].path);
                                            tempObj["id"] = results1[j]._id;
                                            tempObj["name"] = results1[j].name;
                                            tempObj["path"] = results1[j].path;
                                            tempObj["type"] = results1[j].type;
                                            tempObj["ctime"] = results1[j].creationtime;
                                            tempObj["size"] = results1[j].size;
                                            tempObj["starred"] = results[j].starred;
                                            tempObj["sharedstatus"] = results1[j].sharedstatus;
                                            jsonObj.push(tempObj);
                                        }
                                        if(results.length === jsonObj.length) {
                                            response.status = 201;
                                            response.data = jsonObj;
                                            response.message = "Data shared with User retrieved";
                                            callback(null, response);
                                        }

                                    }

                                });
                            }

                        }
                        else {
                            response.status = 204;
                            response.message = "Directory is Empty";
                            callback(null, response);
                        }
                    }
                });
            });
        }
        // }
        // else{
        //     res.status(203).send({"message":"Session Expired. Please Login Again"});
        // }
    }
    catch (e){
        console.log(e);
        response.status = 301;
        response.message = "Failed tor retrieve data shared with user";
        callback(e, response);
    }
});

exports.handle_request = handle_request;
