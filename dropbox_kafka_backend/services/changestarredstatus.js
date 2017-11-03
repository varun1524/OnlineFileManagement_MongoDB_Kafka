let act = require('./activity');
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;
// let fse = require('fs-extra');
let filePath="";


handle_request((data, callback) => {
    let response = {};
    try {
        if(data.username!==undefined || data.username!==null || data.username!=="") {
            let username = data.username;
            let itemid = data.id;
            let changeStatusTo=data.changeStatusTo;
            let findquery = {
                _id : ObjectId(itemid)
            };
            let updatequery = {
                $set:{starred : data.changeStatusTo}
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
                            console.log("Activity added : "+results2);
                            response.status=201;
                            response.message="Starred status updated successfully";
                            callback(null, response);
                        }, username, activityType, itemid);

                    }
                    else {
                        console.log("Failed to update Starred status in dropboxstorage");
                        response.status=301;
                        response.message="Failed to change Starred status to "+data.changeStatusTo;
                        callback(null, response);
                    }
                });
            });
        }
        else {
            response.status=203;
            response.message="Session Expired. Login again";
            callback(null, response);
        }
    }
    catch (e){
        console.log(e);
        response.status=301;
        response.message="Error while changing starred status";
        callback(e, response);
    }
});

exports.handle_request = handle_request;

