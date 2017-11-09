let express = require('express');
let router = express.Router();
let kafka = require('./kafka/client');

router.post('/creategroup', function(req, res, next){
    try{
        if(req.session.username!==undefined){
            let data = req.body;
            data.username = req.session.username;
            console.log(data);
            kafka.make_request('creategroup_topic',data, function(err,results){
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
                        res.status(401).send({"message":"Failed to create new group"});
                    }
                }
            });
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

router.post('/getgroups', function(req, res, next){
    try{
        if(req.session.username!==undefined){
            let data = req.body;
            data.username = req.session.username;
            console.log(data);
            kafka.make_request('fetchgroups_topic',data, function(err,results){
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
                        res.status(201).send(results.data);
                    }
                    else if(results.status === 301){
                        res.status(301).send({"message":results.message});
                    }
                    else if(results.status === 401) {
                        res.status(401).send({"message":"Failed to fetch group details"});
                    }
                }
            });
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

router.post('/getgroupdata', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            req.body.username = req.session.username;
            console.log(req.body);
            kafka.make_request('retrievegroupdata_topic',req.body, function(err,results){
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
                    else if(results.status === 205){
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

router.post('/getgroupmembers', function (req, res, next) {
    try {
        console.log("In Get Group Members");
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            req.body.username = req.session.username;
            console.log(req.body);
            kafka.make_request('retrievegroupmembers_topic',req.body, function(err,results){
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
                        console.log(results.data);
                        res.status(results.status).send(results.data);
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
            let data = req.body;
            data.username = req.session.username;
            console.log(data);
            kafka.make_request('creatediringroup_topic', data, function(err,results){
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
                        res.status(401).send({"message":"Failed to create new Directory in group"});
                    }
                }
            });
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

router.post('/upload', function (req, res, next) {
    try {
        if(req.session.username!==undefined) {
            console.log("Upload");
            console.log(req.body);
            let data = req.body;
            data.group.username = req.session.username;

            let successrank;

            console.log(data.group);

            let response = [];

            data.files.map((file)=>{
                let tempdata = {
                    groupid : data.group.groupid,
                    parentid: data.group.parentid,
                    username: data.group.username,
                    filename: file.filename,
                    size : file.size,
                    filetype : file.filetype,
                    filedata : file.filedata
                };
                kafka.make_request('uploadingroup_topic', tempdata, function(err,results){
                    let temp = {
                        status:""
                    };
                    console.log('in result');
                    console.log(results);
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    else
                    {
                        console.log(results.status);
                        temp.status=results.status;
                    }
                    response.push(temp);

                    if(response.length===data.files.length){
                        console.log("response");
                        console.log(response);
                        let totalcount = data.files;
                        let uploadsuccess=0;
                        let uploadfailed=0;
                        let alreadyexist=0;
                        for(i=0;i<response.length;i++){
                            if(response[i].status===201){
                                uploadsuccess++;
                            }
                            else if(response[i].status===201){
                                uploadfailed++;
                            }
                            else if(response[i].status===201) {
                                alreadyexist++;
                            }
                        }
                        let message = "";
                        console.log("Successfully Uploaded: " + uploadsuccess);
                        console.log("Unsuccessful Upload: " + uploadfailed);
                        console.log("Already exist: " + alreadyexist);
                        if(uploadsuccess>0){
                            message = message + " " +uploadsuccess+" files uploaded. ";
                        }
                        if(uploadfailed>0){
                            message = message + " failed to upload " +uploadfailed+ " files uploaded. ";
                        }
                        if(alreadyexist>0){
                            message = message + " "+ alreadyexist + " files already exists. ";
                        }
                        res.status(201).send({"message":message});
                    }
                });
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

router.post('/addmember', function(req, res, next){
    try{
        if(req.session.username!==undefined){
            let data = req.body;
            data.username = req.session.username;
            console.log(data);

            data.userdata.map((id) => {
                if (id === data.username) {
                    data.userdata.splice(data.userdata.indexOf(data.username), 1);
                    return id;
                }
            });
            console.log(data);

            if(data.userdata.length>0){

                kafka.make_request('addmembersingroup_topic', data, function(err,results){
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
                            res.status(401).send({"message":"Failed to add new members in group"});
                        }
                    }
                });
            }
            else {
                res.status(301).send({"message":"Invalid user entry"});
            }
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

router.post('/fetchgroupaccessdetails', function(req, res, next){
    try{
        if(req.session.username!==undefined){
            let data = req.body;
            data.username = req.session.username;
            console.log(data);


            kafka.make_request('fetchusergroupaccess_topic', data, function(err,results){
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
                        console.log(results.access);
                        res.status(201).send({"access":results.access});
                    }
                    else if(results.status === 301){
                        res.status(301).send({"message":results.message});
                    }
                    else if(results.status === 401) {
                        res.status(401).send({"message":"Failed to add new members in group"});
                    }
                }
            });
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

module.exports = router;