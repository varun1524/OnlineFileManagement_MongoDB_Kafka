let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;
let storage = require('./storage');

handle_request = ((data, callback) => {
    let response = {};
    try{
        console.log("in create directory");
        console.log(data.username);
        console.log(data.directoryName);
        let receivedPath = data.dirpath;
        let receivedName = data.directoryName;
        let username = data.username;
        let userDirpath = "./dropboxstorage/"+username+"/"+receivedPath;
        mongo.connect(mongoURL, function () {
            let dropboxstorage = mongo.collection("dropboxstorage");
            dropboxstorage.find({$and:[{ownerusername:data.username},{path:userDirpath},{name:receivedName}]}).toArray(function (err, results) {
                console.log(results);
                if(err){
                    throw err;
                }
                if(results.length===0){
                    let createDirpath = userDirpath + receivedName;
                    console.log("Create Directory Path: "+createDirpath);
                    storage.insertIntoStorage(function (err, result) {
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        if(result){
                            console.log("Directory Created Successfully");
                            response.status = data.username;
                            response.status = 201;
                            response.message = "Directory Created Successfully";
                            callback(null, response);
                        }
                        else {
                            response.status = 301;
                            response.message = "Error while adding directory data into database";
                            callback(null, response);
                        }
                    },data.directoryName, userDirpath, "d", username);
                }
                else if(results.length>0){
                    response.status = 301;
                    response.message = "Directory already exists";
                    callback(null, response);
                }
                else{
                    throw "Error while creating directory";
                }
            });
        })
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