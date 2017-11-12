var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

insertIntoActivity = ((callback ,username ,activitytype ,itemid ,activitytime) => {
    try{
        let dataInserted=false;

        if(activitytime===null || activitytime===undefined || activitytime==="") {
            activitytime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }

        if(itemid!==null && itemid!==undefined && itemid!=="") {
            let storageactivityData = {
                itemid : ObjectId(itemid),
                activitytype : activitytype,
                username : username,
                activitytime : activitytime
            };
            mongo.connect(mongoURL, function () {
                let storageactivity = mongo.collection("storageactivities");

                storageactivity.insertOne(storageactivityData, function (err, results) {
                    // console.log(results);
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (results.insertedCount === 1) {
                            console.log("activity added successfully");
                            dataInserted=true;
                        }
                        else {
                            console.log("Error while inserting data into database");
                        }
                    }
                    callback(err, dataInserted)
                });
            });
        }
        else {

            let useractivityData = {
                activitytype : activitytype,
                username : username,
                activitytime : activitytime
            };
            mongo.connect(mongoURL, function () {
                let useractivity = mongo.collection("useractivities");

                useractivity.insertOne(useractivityData, function (err, results) {
                    // console.log(results);
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (results.insertedCount === 1) {
                            console.log("activity added successfully");
                            dataInserted=true;
                        }
                        else {
                            console.log("Error while inserting data into database");
                        }
                    }
                    callback(err, dataInserted)
                });
            });
        }


    }
    catch (e){
        console.log(e);
    }
});

handle_request = ((data, callback)=>{
    let response = {};
    try {
        if(data.username!==null || data.username!==undefined) {
            let username = data.username;

            let jsonObj = [];

            mongo.connect(mongoURL, function () {
                let useractivitycoll = mongo.collection("useractivities");
                let storageactivitycoll = mongo.collection("storageactivities");
                useractivitycoll.find({$and:[{username:username},{activitytype:"signup"}]}).toArray(function (err, results) {
                    console.log(results);
                    if(err){
                        console.log("Error while fetting account creation data");
                        throw err;
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
                                    let tempObj = {};
                                    tempObj["activitytype"] = results1[0].activitytype;
                                    tempObj["activitytime"] = results1[0].activitytime;
                                    jsonObj.push(tempObj);

                                    storageactivitycoll.find({username:username},{filedata:0}).sort({activitytime:-1}).limit(5).toArray(function (err, results2) {
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

                                                storagecoll.find({_id:ObjectId(results2[i].itemid)},{filedata:0}).toArray(function (err, results3) {
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
                                                        console.log("count:" + count);
                                                        console.log("result 2 length: "+results2.length);
                                                        if (count === results2.length) {
                                                            console.log(i + ":" + results2.length);
                                                            response.status = 201;
                                                            response.data = jsonObj;
                                                            callback(null, response);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                        else if (results2.length === 0) {
                                            response.status = 201;
                                            response.data = jsonObj;
                                            callback(null, response);
                                        }
                                    });
                                }
                                else {
                                    response.status = 301;
                                    response.data = jsonObj;
                                    response.message = "Unrecognized Error. No activity found";
                                    callback(null, response);
                                }
                            }
                        });
                    }
                });
            });
        }
    }
    catch (e){
        console.log("error: ");
        console.log(e);
        response.status = 301;
        response.message = "Error while fetching user activity data";
        callback(e, response);
    }
});

exports.insertIntoActivity = insertIntoActivity;
exports.handle_request = handle_request;
