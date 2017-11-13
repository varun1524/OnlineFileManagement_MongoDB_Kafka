let express = require('express');
let router = express.Router();
let kafka = require('./kafka/client');

router.post('/getDirData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            req.body.username = req.session.username;
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

module.exports = router;