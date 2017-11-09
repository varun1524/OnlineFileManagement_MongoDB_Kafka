let act = require('./activity');
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;


handle_request = ((data, callback) => {
    let response = {};
    try {
        if(data.username!==undefined) {
            let recUserArr = data.userdata;
            let itemid = data.itemid;
            console.log(recUserArr);
            console.log(itemid);
            let message = [];
            let username = data.username;

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
                                            console.log("Shared details added in collection:"+results2.insertedCount);
                                            if (err) {
                                                console.log("Error: " + err);
                                                message.push({user : "Error while inserting data into database"});
                                                throw err;
                                            }
                                            else if (results2.insertedCount === 1) {
                                                let storagecoll = mongo.collection("dropboxstorage");
                                                storagecoll.updateOne({_id:ObjectId(itemid)}, {$set:{sharedstatus : true}}, function (err, results3) {
                                                    console.log("Shared Status updated:" + results3.result.nModified);
                                                    if (err) {
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
                                                                response.status = 201;
                                                                response.message = message;
                                                                response.username = username;
                                                                callback(null, response);
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
            response.status = 203;
            response.message = "Session Expired. Login again";
            callback(null, response);
        }
    }
    catch (e){
        console.log(e);
        response.status = 301;
        response.message = "Error while sharing data";
        callback(e, response);
    }
});

exports.handle_request = handle_request;
