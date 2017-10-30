let multer = require('multer');
// let glob = require('glob');
let act = require('./activity');
let fs = require('fs');
let shell = require('shelljs');
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;
// let fse = require('fs-extra');
let filePath="";
let st = require('./storage');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(filePath);
        if(req.session.username!==undefined) {
            cb(null, "./dropboxstorage/" + req.session.username + "/" + filePath);
        }
    },
    filename: function (req, file, cb) {
        try {
            let dirpath = "./dropboxstorage/" + req.session.username + "/" + filePath;
            let filename = file.originalname;
            console.log("IMP");
            st.doesExist(function (err, result) {
                console.log("Does Exist: " + result);
                if (!result) {
                    let username = req.session.username;
                    if (st.insertIntoStorage(function (err, result) {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                            if (result) {
                                console.log("File added in file system as well as database");
                                cb(null, filename);
                                // deleteIfNotAvailableInStore(filename, dirpath);
                            }
                            else {
                                console.log("Failed to add file into database");
                            }
                        }, file.originalname, dirpath, "f", username)) {
                        console.log("Successfully added " + file.originalname + " into database");
                    }
                    else {
                        console.log("Failed to add " + file.originalname + " into database");
                    }
                }
                else {
                    console.log("File already exists in database");
                }
            }, filename, dirpath, Date.toLocaleString());
        }
        catch (e){
            console.log(e);
        }
    }
});

let upload = multer({storage:storage}).any();

handle_request = ((data, callback) => {
    let response ={};
    try {
        console.log(data);
        console.log(JSON.stringify(data));
        // console.log(data.request);
        upload(data, null, function (err) {
            // console.log(req.body);
            if (err) {
                response.status = 301;
                response.message = "Error while uploading files : " + err;
                throw err;
            } else {
                console.log("File Successfully Uploaded");
                response.status = 201;
                response.message = "File Successfully Uploaded";
                callback(null, response);
            }
        });

    }
    catch (e){
        console.log(e);
        callback(e, response);
    }
});

exports.handle_request = handle_request;