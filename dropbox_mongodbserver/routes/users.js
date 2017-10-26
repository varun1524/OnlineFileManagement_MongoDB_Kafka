let express = require('express');
let router = express.Router();
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

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(filePath);
        if(req.session.username!==undefined) {
            cb(null, "./dropboxstorage/" + req.session.username + "/" + filePath);
        }
        else{
            res.status(203).send({"message" : "Session Expired. Login Again"});
        }
    },
    filename: function (req, file, cb) {
        let dirpath = "./dropboxstorage/" + req.session.username + "/" + filePath;
        let filename=file.originalname;
        console.log("IMP");
        doesExist(function (err, result) {
            console.log("Does Exist: "+result);
            if(!result){
                let username = req.session.username;
                if(insertIntoStorage(function (err, result) {
                        if(err){

                        }
                        if(result){
                            console.log("File added in file system as well as database");
                            cb(null, filename) ;
                            deleteIfNotAvailableInStore(filename, dirpath);
                        }
                        else {
                            console.log("Failed to add file into database");
                        }
                    } ,file.originalname, dirpath, "f", username)){
                    console.log("Successfully added "+file.originalname +" into database");
                }
                else {
                    console.log("Failed to add "+file.originalname +" into database");
                }
            }
            else {
                console.log("File already exists in database");
            }
        }, filename, dirpath, Date.toLocaleString());

    }
});

let upload = multer({storage:storage}).any();

/* GET users listing. */
router.post('/getDirData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            console.log("In get dir data");
            console.log(req.body.path);
            let clientPath = req.body.path;
            let dirpath;
            if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" );
            }
            else {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" + clientPath);
            }
            console.log(dirpath);

            // let files = fs.readdirSync(dirpath);
            // console.log(files);
            let jsonObj = [];
            let i = 0;
            dirpath=dirpath.replace("//","/");

            mongo.connect(mongoURL, function () {
                let itemPath = {
                    path : dirpath
                };
                let storagecoll = mongo.collection("dropboxstorage");
                storagecoll.find(itemPath).toArray(function(err,results){
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
                            // tempObj["mtime"] = results[i].modifiedtime;
                            tempObj["path"] = results[i].path;
                            tempObj["size"] = results[i].size;
                            tempObj["starred"] = results[i].starred;
                            tempObj["sharedstatus"] = results[i].sharedstatus;
                            jsonObj.push(tempObj);
                        }
                        res.status(201).send(jsonObj);
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/createDir', function(req, res, next){
    try{
        console.log("in create directory");
        console.log(req.session.username);
        console.log(req.body.directoryName);
        let receivedPath = req.body.dirpath;
        let receivedName = req.body.directoryName;
        if(req.session.username!==undefined){
            let username = req.session.username;
            let userDirpath = "./dropboxstorage/"+username+"/"+receivedPath;
            if(fs.existsSync(userDirpath)){
                let createDirpath = userDirpath + receivedName;
                console.log("Create Directory Path: "+createDirpath);
                console.log("Parent Directory Path: "+userDirpath);
                if(!fs.existsSync(createDirpath)) {
                    insertIntoStorage(function (err, result) {
                        if(err){
                            res.status(301).send({message: "Error while adding directory data into database"});
                        }
                        if(result){
                            fs.mkdir(createDirpath, null, function (err) {
                                console.log(err);
                                if (err) {
                                    throw ("failed to create directory" + err);
                                }
                                console.log("Directory Created Successfully");
                                res.status(201).send({message: "Directory Created Successfully"});
                            });
                        }
                        else {
                            res.status(301).send({message: "Error while adding directory data into database"});
                        }
                    },req.body.directoryName, userDirpath, "d", username);

                }
                else {
                    res.status(301).send({message: "Directory already exists"});
                }
            }
            else{
                throw "Error while creating directory";
            }
        }
        else{
            throw "Session Expired. Please login again.";
        }
    }
    catch (e)
    {
        console.log(e);
        res.status(301).json({message:e});
    }
});

router.post('/share', function (req, res, next) {
    try {
        if(req.session.username!==undefined) {
            let recUserArr = req.body.userdata;
            let itemid = req.body.itemid;
            console.log(recUserArr);
            console.log(itemid);
            let message = [];
            let username = req.session.username;

            mongo.connect(mongoURL, function () {
                let userscoll = mongo.collection("users");
                recUserArr.map((user) => {
                    if (username !== user) {
                        userscoll.find({username : user},{hashPassword: false }).toArray(function (err, results) {
                            console.log(results);
                            console.log("Fetched Records: " + results.length);
                            if (err) {
                                console.log(err);
                                message.push({user:"Error in sharing data."});
                            }
                            else if (results.length === 0) {
                                message.push({ user : "User does not have account in dropbox."});
                            }
                            else if(results.length===1){
                                let sharedetailscoll = mongo.collection("sharedetails");

                                sharedetailscoll.find({$and:[{_id : ObjectId(itemid)},{sharedwith : user}]}).toArray(function (err, results1) {
                                    console.log(results1);
                                    console.log("Fetched Records: "+results1.length);
                                    if(err){
                                        message.push({user:"data shared with user successfully"});
                                        console.log(err);
                                        throw err;
                                    }
                                    else if(results1.length === 1){
                                        console.log("User " + user + " already have access to shared item.");
                                        message.push({ user : "User already have access to shared item."});
                                    }
                                    else if(results1.length === 0){
                                        let insertQuery = {
                                            sharedwith : user,
                                            shareditemid : ObjectId(itemid)
                                        };

                                        sharedetailscoll.insertOne(insertQuery, function (err, results2) {
                                            console.log(results2.insertedCount);
                                            if (err) {
                                                console.log("Error: " + err);
                                                message.push({user : "Error while inserting data into database"});
                                                throw err;
                                            }
                                            else if (results2.insertedCount === 1) {
                                                let storagecoll = mongo.collection("dropboxstorage");
                                                storagecoll.updateOne({_id:ObjectId(itemid)}, {$set:{sharedstatus : true}}, function (err, results3) {
                                                    console.log(results3.result.nModified);
                                                    if (err) {
                                                        // res.status(301).send({"message": "Error while sharing data"});
                                                        console.log(err);
                                                        message.push({user:"Error while sharing data with this user successfully"});
                                                    }
                                                    else if (results3.result.nModified === 1) {
                                                        message.push({user:"data shared with user successfully"});
                                                        act.insertIntoActivity(function (err, results4) {
                                                            if(err){
                                                                console.log(err);
                                                            }
                                                            if (message.length===recUserArr.length) {
                                                                console.log(message);
                                                                res.status(201).send(message);
                                                            }
                                                            console.log("Activity added : " + results4)
                                                        }, username, "share", itemid);
                                                        console.log("Shared status updated to true successfully in dropboxstorage");
                                                    }
                                                    else {
                                                        message.push({user:"could not share data with this user"});
                                                        console.log("Failed to update Shared status in dropboxstorage");
                                                    }
                                                });
                                                dataInserted = true;
                                            }
                                            else {
                                                console.log("Error while inserting data into database");
                                            }
                                        }, insertQuery);
                                    }
                                });
                            }
                            console.log(message.length);
                            console.log(recUserArr.length);
                        });

                    }
                });

            });

        }
        else{
            res.status(203).json({"message":"Session Expired. Login again"})
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/changestarredstatus', function (req, res, next) {
    try {
        if(req.session.username!==undefined) {
            let username = req.session.username;
            console.log(JSON.stringify(req.body));
            let itemid = req.body.id;
            let changeStatusTo=req.body.changeStatusTo;
            let findquery = {
                _id : ObjectId(itemid)
            };
            let updatequery = {
                $set:{starred : req.body.changeStatusTo}
            };
            console.log(findquery);
            console.log(updatequery);

            mongo.connect(mongoURL, function () {
                let storagecoll = mongo.collection("dropboxstorage");
                storagecoll.updateOne(findquery,updatequery,function (err, results) {
                    // console.log(results);
                    console.log(results.result.nModified);
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    else if (results.result.nModified === 1) {
                        console.log("Shared status updated to true successfully in dropboxstorage");
                        let activityType;
                        if(changeStatusTo) {
                            activityType = "starred";
                        }
                        else {
                            activityType = "unstarred";
                        }
                        act.insertIntoActivity(function (err, results2) {
                            if(err){
                                console.log(err);
                            }
                            console.log("Activity added : "+results2)
                        }, username, activityType, itemid);
                        res.status(201).send({"message":"starred status updated successfully"});
                    }
                    else {
                        console.log("Failed to update Starred status in dropboxstorage");
                        res.status(301).json({"message": "Failed to Add in Starred"})
                    }
                });
            });
        }
        else {
            res.status(203).json({"message": "Session Expired. Login again"})
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/getStarredData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            let clientPath = req.body.path;
            let dirpath;
            if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" );
            }
            else {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" + clientPath);
            }
            console.log(dirpath);

            let files = fs.readdirSync(dirpath);
            console.log(files);
            let jsonObj = [];
            let i = 0;

            // dirpath=dirpath.replace("//","/");

            mongo.connect(mongoURL, function () {
                let storagecoll = mongo.collection("dropboxstorage");
                storagecoll.find({$and:[{ownerusername:username},{starred:true}]}).toArray(function (err, results) {
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
                            res.status(201).send(jsonObj);
                        }
                        else {
                            res.status(204).send({"message":"Directory is Empty"});
                        }
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/getDataSharedByUser', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            // let clientPath = req.body.path;
            let username = req.session.username;
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
                storagecoll.find({$and:[{ownerusername : username},{sharedstatus : true}]}).toArray(function(err,results){
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
                            res.status(201).send(jsonObj);
                        }
                        else {
                            res.status(204).send({"message":"Directory is Empty"});
                        }
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/fetchDataSharedWithUser', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            let clientPath = req.body.path;
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
                                storagecoll.find({_id : ObjectId(results[i].shareditemid)}).toArray(function(err,results1) {
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
                                            res.status(201).send(jsonObj);
                                        }

                                    }

                                });
                            }

                        }
                        else {
                            res.status(204).send({"message":"Directory is Empty"});
                        }
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/accessSelectedSharedData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            let clientPath = req.body.path;

            // dirpath=dirpath.replace("//","/");

            mongo.connect(mongoURL, function () {
                let sharedetailscoll = mongo.collection("sharedetails");
                sharedetailscoll.find({sharedwith : username}).toArray(function (err, results) {
                    if(err){
                        throw err;
                    }
                    if(results.length>0) {
                        let storagecoll = mongo.collection("dropboxstorage");
                        for (i = 0; i < results.length; i++) {
                            let tempObj = {};

                            storagecoll.find({_id : ObjectId(results[i].shareditemid)}).toArray(function (err, results1) {
                                console.log(results1);
                                if (err) {
                                    throw err;
                                }
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
                                    res.status(201).send(jsonObj);
                                }
                            })

                        }
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/accessSharedData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            console.log(req.body.item);
            let item = req.body.item;
            path=item.path + item.name + "/";
            console.log(path);

            mongo.connect(mongoURL, function () {
                let storagecoll = mongo.collection("dropboxstorage");
                storagecoll.find({path:path}).toArray(function (err, results) {
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
                        res.status(201).send(jsonObj);
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/removesharing', function (req, res, next) {
    try {
        if(req.session.username!==undefined){
            let id = req.body.itemid;
            console.log(id);
        }
        else{
            res.status(203).json({"message":"Session Expired. Login again"})
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/setdirPath', function (req, res, next) {
    try {
        if(req.session.username!==undefined){
            filePath = req.body.path;
            res.status(201).json({"message":"Path set for the directory"})
        }
        else{
            res.status(203).json({"message":"Session Expired. Login again"})
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/upload', function (req, res, next) {
    try {
        console.log(req.body);
        if(req.session.username!==undefined) {
            upload(req, res, function (err) {
                // console.log(req.body);
                if (err) {
                    res.status(301).send({"message:":"Error while uploading files"});
                } else {
                    console.log("File Successfully Uploaded");
                    res.status(201).send({"message": "File Successfully Uploaded"});
                }
            });
        }
        else {
            res.status(203).send({"message":"Session Expired. Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/getActivityData', function (req, res, next) {
    try {
        console.log("In fetching activity");
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;

            let jsonObj = [];

            mongo.connect(mongoURL, function () {
                let useractivitycoll = mongo.collection("useractivities");
                let storageactivitycoll = mongo.collection("storageactivities");
                useractivitycoll.find({$and:[{username:username},{activitytype:"signup"}]}).toArray(function (err, results) {
                    console.log(results);
                    if(err){
                        console.log("Error while fetting account creation data");
                    }
                    if(results.length===1) {
                        let tempObj={};
                        tempObj["activitytype"] = results[0].activitytype;
                        tempObj["activitytime"] = results[0].activitytime;
                        tempObj["username"] = results[0].username;
                        jsonObj.push(tempObj);

                        useractivitycoll.find({$and:[{username:username},{activitytype:"login"}]}).sort({activitytime:-1}).limit(4).toArray(function (err, results1) {
                            console.log(results1);
                            if(err){
                                console.log(err);
                                throw err;
                            }
                            else
                            {
                                if(results1.length>0) {
                                    for (i = 0; i < results1.length; i++) {
                                        let tempObj = {};
                                        tempObj["activitytype"] = results1[i].activitytype;
                                        tempObj["activitytime"] = results1[i].activitytime;
                                        jsonObj.push(tempObj);
                                    }

                                    storageactivitycoll.find({username:username}).sort({activitytime:-1}).limit(5).toArray(function (err, results2) {
                                        console.log(results2);
                                        if (err) {
                                            throw err;
                                        }
                                        if (results2.length > 0) {
                                            let count = 0;
                                            let storagecoll = mongo.collection("dropboxstorage");
                                            for (i = 0; i < results2.length; i++) {
                                                let tempObj = {};
                                                tempObj["activitytype"] = results2[i].activitytype;
                                                tempObj["activitytime"] = results2[i].activitytime;

                                                storagecoll.find({_id:ObjectId(results2[i].itemid)}).toArray(function (err, results3) {
                                                    console.log(results3);
                                                    if (err) {
                                                        console.log(err);
                                                        throw "Error while fetching file/folder name";
                                                    }
                                                    if(results3.length===1){
                                                        tempObj["name"] = results3[0].name;
                                                        tempObj["type"] = results3[0].type;
                                                        jsonObj.push(tempObj);
                                                        count++;
                                                        console.log("i:" + i);
                                                        if (count === results2.length) {
                                                            console.log(i + ":" + results2.length);
                                                            res.status(201).send(jsonObj);
                                                        }
                                                    }
                                                });
                                            }
                                            console.log(jsonObj);
                                        }
                                        else if (results2.length === 0) {
                                            res.status(201).send(jsonObj);
                                        }
                                    });
                                }
                                else {
                                    res.status(301).send({"message":"Unrecognized Error. No activity found"});
                                }
                            }
                        });
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : "Error while fetching activity data"});
    }
});

router.post('/changeProfile', function (req, res, next) {
    try {
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            console.log(username);
            let data = req.body;
            console.log(data);
            updateQuery= {
                $set : {
                    overview : data.overview,
                    education : data.education,
                    contactinfo : data.contactinfo,
                    lifeevents : data.lifeevent,
                    work : data.work,
                    music : data.music,
                    reading : data.reading,
                    sports : data.sports,
                }
            };

            mongo.connect(mongoURL, function () {
                mongo.collection("userprofile").updateOne({_id:username},updateQuery, function (err, results) {
                    console.log(results);
                    if (err) {
                        throw err;
                    }
                    if (results.result.nModified === 1) {
                        res.status(201).send({"message":"Profile updated successfully"});
                    }
                    else {
                        res.status(301).send({"message":"Failed to Update Profile"});
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : "Error while fetching activity data"});
    }
});

router.get('/getprofile', function (req, res, next) {
    console.log("Here O m");
    try {
        console.log("In fetching profile");
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            mongo.connect(mongoURL,function () {
                let profile = mongo.collection("userprofile");
                profile.find({_id:username}).toArray(function (err, results) {
                    console.log(results);
                    if (err) {
                        throw err;
                    }
                    if (results.length === 1) {
                        res.status(201).send(results);
                    }
                    else {
                        res.status(301).send({"message":"Failed to fetch Profile Data"});
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        console.log("error");
        res.status(301).send({"message" : "Error while fetching activity data"});
    }
});

router.post('/deleteContent', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            console.log(req.body);
            let item = req.body.id;

            mongo.connect(mongoURL, function () {
                let content = {
                    _id : ObjectId(item),
                    ownerusername : username
                };

                let storagecollection = mongo.collection("dropboxstorage");
                storagecollection.find({$and:[{_id : content._id},{ownerusername : username}]}).toArray(function (err, results){
                    console.log(results);
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    if(results.length===1) {
                        let deleteContent = {
                            path : results[0].path,
                        };
                        console.log(deleteContent);
                        storagecollection.deleteOne({$and:[{_id : content._id},{ownerusername : username},{path : deleteContent.path}]},
                            function (err, results1) {
                                console.log(results1.result.n);
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                if(results1.deletedCount === 1){
                                    if(results[0].type==="d") {
                                        storagecollection.deleteMany({$and:[{ownerusername:username},{path: {$regex: deleteContent.path+ results[0].name +"/.*"}}]},
                                            function (err, results2) {
                                                console.log(results2.result.n);
                                                console.log(results2.deletedCount);
                                                if(err){
                                                    console.log("Failed to remove data inside the directory");
                                                    throw err;
                                                }
                                                if (results2.result.n >= 0) {
                                                    deleteFromFileSystem(function (err, deleteResult) {
                                                        if (deleteResult) {
                                                            res.status(201).send({"message": "Deleted Successfully"});
                                                        }
                                                        else {
                                                            res.status(301).send({"message": "Deleted Unsuccessful"})
                                                        }
                                                    }, results[0].name, results[0].path);
                                                }
                                                else {
                                                    console.log("Failed to Remove");
                                                }
                                            });
                                        // let deleteQuery = "delete from dropboxstorage where path LIKE '" +
                                        //     results[0].path + results[0].name + "%'" +
                                        //     "AND ownerusername= '" + username + "';";
                                        // mysql.deleteData(function (err, results2) {
                                        //     console.log("Content Deleted Successfully");
                                        //     if (results2.affectedRows >= 0) {
                                        //         deleteFromFileSystem(function (err, deleteResult) {
                                        //             if (deleteResult) {
                                        //                 res.status(201).send({"message": "Deleted Successfully"});
                                        //             }
                                        //             else {
                                        //                 res.status(301).send({"message": "Deleted Unsuccessful"})
                                        //             }
                                        //         }, results[0].name, results[0].path);
                                        //     }
                                        //     else {
                                        //         console.log("Failed to Remove");
                                        //     }
                                        // }, deleteQuery);
                                    }
                                    else if(results[0].type==="f"){
                                        deleteFromFileSystem(function (err, deleteResult) {
                                            if (deleteResult) {
                                                res.status(201).send({"message": "Deleted Successfully"});
                                            }
                                            else {
                                                res.status(301).send({"message": "Deleted Unsuccessful"})
                                            }
                                        }, results[0].name, results[0].path);
                                    }
                                }
                                else {
                                    console.log("Error while deletion");
                                }
                            });
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                });
            });
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

function doesExist (callback, name, path){
    try {
        mongo.connect(mongoURL,function () {
            let exists=true;
            let storagecoll = mongo.collection("dropboxstorage");
            storagecoll.find({$and:[{name:name}, {path:path}]}).toArray(function (err, results) {
                console.log(results);
                if (err) {
                    console.log("Fetched Records: " + results.length);
                }
                if(results.length===0) {
                    console.log("Count: " + results.length);
                    exists=false;
                }
                callback(err, exists);
            });
        });
    }
    catch (err){
        console.log(err);
    }
}

function insertIntoStorage (callback, name, path, type, username){
    try{
        let ctime;
        // let mtime;
        let size;
        fs.stat((path), function (err, stats) {
            let dataInserted=false;
            if (err) {
                throw ("Error while fetching list of files/folders .Error: " + err)
            }
            ctime = stats["ctime"].toISOString().slice(0, 19).replace('T', ' ');
            size = stats["size"];

            let insertData = {
                name : name,
                type : type,
                path : path,
                creationtime : ctime,
                size : size,
                ownerusername : username,
                starred : false,
                sharedstatus : false,
            };

            mongo.connect(mongoURL, function () {
                let storagecoll = mongo.collection("dropboxstorage");
                storagecoll.insertOne(insertData, function (err, results) {
                    console.log(results.insertedId);
                    if (err) {
                        throw err;
                    }
                    else {
                        if (results.insertedCount === 1) {
                            console.log("data inserted successfully");
                            dataInserted = true;
                            storagecoll.findOne({_id:results.insertedId},function (err, results1) {
                                console.log(results1);
                                if(err){
                                    console.log(err);
                                }
                                if(results1!==null || results1!==undefined){
                                    act.insertIntoActivity(function (err, results2) {
                                        if(err){
                                            console.log(err);
                                        }
                                        console.log("Activity added : "+results2)
                                    }, username, "insert", results1._id, results1.creationtime );
                                }
                                else{
                                    console.log("does not contain the data")
                                }
                            });
                        }
                        else {
                            console.log("Error while inserting data into database");
                        }
                    }
                    callback(err, dataInserted)
                });
            });
        });
    }
    catch (e){
        console.log(e);
        return false;
    }
}

deleteIfNotAvailableInStore = ((filename, dirpath) => {});

deleteFromDatabase = ((name, path) => {
    try{
        console.log("Delete here: "+name+"   "+path);
    }
    catch(e) {
        throw e;
    }
});

deleteFromFileSystem = ((callback, name, path) => {
    let deleteResult=false;
    let err=null;
    try{
        // console.log("Delete here: "+name+"   "+path);
        console.log(path+name);
        // if(exist){
        shell.rm("-r",path+name);
        if(!fs.existsSync(path+name)){
            console.log("Deletion Done");
            deleteResult=true;
        }
        // }
    }
    catch(e) {
        err=e;
        console.log(e);
        throw e;
    }
    finally {
        callback(err, deleteResult);
    }
});

module.exports = router;
