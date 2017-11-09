let express = require('express');
let router = express.Router();
/*Busboy = require('busboy');*/
var kafka = require('./kafka/client');

router.post('/getDirData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            req.body.username = req.session.username;
            req.body.service = "getDirData";
            console.log(req.body);
            kafka.make_request('retrievedirectory_topic',req.body, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Fetching Directory Data Failed"});
                    }
                }
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
        if(req.session.username!==undefined){
            req.body.username = req.session.username;
            req.body.service = "createdir";
            console.log(req.body);
            kafka.make_request('createdirectory_topic',req.body, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(201).send({"message":results.message});
                    }
                    else if(results.status === 301){
                        res.status(301).send({"message":results.message});
                    }
                    else if(results.status === 401) {
                        res.status(401).send({"message":"Failed to create new Directory"});
                    }
                }
            });
            /*console.log("in create directory");
            console.log(req.session.username);
            console.log(req.body.directoryName);
            let receivedPath = req.body.dirpath;
            let receivedName = req.body.directoryName;
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
            }*/
        }
        else{
            res.status(203).send({"message":"Session Expired. Please login again."});
        }
    }
    catch (e)
    {
        console.log(e);
        res.status(301).json({message:e});
    }
});

router.post('/changestarredstatus', function (req, res, next) {
    try {
        if(req.session.username!==undefined && req.session.username!==null) {

            console.log(req.body);
            let data = req.body;
            data.username = req.session.username;

            kafka.make_request('changestarredstatus_topic', data, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Fetching Directory Data Failed"});
                    }
                }
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
        try {
            if(req.session.username!==undefined && req.session.username!==null) {

                console.log(req.body);
                let data = req.body;
                data.username = req.session.username;

                kafka.make_request('retrievestarreddata_topic', data, function(err,results){
                    console.log('in result');
                    console.log(results);
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    else
                    {
                        if(results.status === 201){
                            console.log("Received username: "+results.username);
                            console.log("Local username: "+ req.body.username);
                            res.status(results.status).send(results.data);
                        }
                        else if(results.status === 204){
                            res.status(results.status).send(results.message);
                        }
                        else if(results.status === 301){
                            res.status(results.status).send(results.message);
                        }
                        else if(results.status === 401) {
                            res.status(results.status).send({"message":"Fetching Directory Data Failed"});
                        }
                    }
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
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/share', function (req, res, next) {
    try {
        if(req.session.username!==undefined && req.session.username!==null) {

            console.log(req.body);
            let data = req.body;
            data.username = req.session.username;

            kafka.make_request('share_topic', data, function(err,results){
                console.log('in result');
                results = JSON.stringify(results);
                console.log(results);

                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Failed to share data"});
                    }
                }
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

router.post('/getDataSharedByUser', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==undefined && req.session.username!==null) {

            console.log(req.body);
            let data = req.body;
            data.username = req.session.username;

            kafka.make_request('sharedbyuser_topic', data, function(err,results){
                console.log('in result');
                // results = JSON.stringify(results);
                console.log(results);

                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Failed to  share data"});
                    }
                }
            });
        }
        else {
            res.status(203).json({"message": "Session Expired. Login again"})
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
        if(req.session.username!==undefined && req.session.username!==null) {

            console.log(req.body);
            let data = req.body;
            data.username = req.session.username;

            kafka.make_request('sharedwithuser_topic', data, function(err,results){
                console.log('in result');
                // results = JSON.stringify(results);
                console.log(results);

                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Failed to receive share data"});
                    }
                }
            });
        }
        else {
            res.status(203).json({"message": "Session Expired. Login again"})
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
            /*let username = req.session.username;
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
            });*/
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
        if(req.session.username!==undefined && req.session.username!==null) {

            console.log(req.body);
            let data = req.body;
            data.username = req.session.username;

            kafka.make_request('navigateinshareddata_topic', data, function(err,results){
                console.log('in result');
                // results = JSON.stringify(results);
                console.log(results);

                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Failed to navigate in shared data"});
                    }
                }
            });
        }
        else {
            res.status(203).json({"message": "Session Expired. Login again"})
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
            /*let id = req.body.itemid;
            console.log(id);*/
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
        if(req.session.username!==undefined) {
            console.log("Upload");
            console.log(req.body);
            let data = req.body;
            data.username = req.session.username;

            // console.log(data);


            data.map((file)=>{
                file.username =  req.session.username;
            });


            kafka.make_request('upload_topic', data, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Fetching Directory Data Failed"});
                    }
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

router.post('/downloadfile', function (req, res, next) {
    try {
        if(req.session.username!==undefined) {
            console.log("Upload");
            let data = req.body;
            data.username = req.session.username;
            console.log(data);

            kafka.make_request('download_topic', data, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log(results);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Fetching Directory Data Failed"});
                    }
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
        if(req.session.username!==undefined) {
            let data = req.body;
            data.username = req.session.username;
            console.log(data);

            kafka.make_request('activity_topic', data, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Fetching Activity Data Failed"});
                    }
                }
            });
        }
        else {
            res.status(203).send({"message":"Session Expired. Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : "Error while fetching activity data"});
    }
});

router.post('/updateProfile', function (req, res, next) {
    try {
        if(req.session.username!==undefined) {
            let data = req.body;
            data.username = req.session.username;
            console.log(data);

            kafka.make_request('updateprofile_topic', data, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(results.data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Fetching Directory Data Failed"});
                    }
                }
            });
        }
        else {
            res.status(203).send({"message":"Session Expired. Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : "Error while fetching activity data"});
    }
});

router.post('/getprofile', function (req, res, next) {
    try {
        if(req.session.username!==undefined) {
            let data = req.body;
            data.username = req.session.username;
            console.log(data);

            kafka.make_request('getprofile_topic', data, function(err,results){
                console.log('in result');
                data = JSON.stringify(results.data);
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Fetching Directory Data Failed"});
                    }
                }
            });
        }
        else {
            res.status(203).send({"message":"Session Expired. Login Again"});
        }
    }
    catch (e){
        console.log(e);
        console.log("error");
        res.status(301).send({"message" : "Error while fetching User Profile"});
    }
});

router.post('/deleteContent', function (req, res, next) {
    try {
        if(req.session.username!==undefined) {
            let data = req.body;
            data.username = req.session.username;
            console.log(data);

            kafka.make_request('delete_topic', data, function(err,results){
                console.log('in result');
                data = JSON.stringify(results.data);
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ req.body.username);
                        res.status(results.status).send(data);
                    }
                    else if(results.status === 204){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 301){
                        res.status(results.status).send(results.message);
                    }
                    else if(results.status === 401) {
                        res.status(results.status).send({"message":"Failed to Delete data"});
                    }
                }
            });
        }
        else {
            res.status(203).send({"message":"Session Expired. Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

function doesExist (callback, name, path){
    try {
        /*mongo.connect(mongoURL,function () {
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
        });*/
    }
    catch (err){
        console.log(err);
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
    /*let deleteResult=false;
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
    }*/
});

module.exports = router;