// var mysql = require('./mysql');
// var router = express.Router();
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

function insertIntoActivity (callback ,username ,activitytype ,itemid ,activitytime){
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
            let storageactivity = mongo.collection("storageactivities");
            mongo.connect(mongoURL, function () {
                storageactivity.insertOne(storageactivityData, function (err, results) {
                    console.log(results);
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

            activitytime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let useractivityData = {
                activitytype : activitytype,
                username : username,
                activitytime : activitytime
            };
            let useractivity = mongo.collection("useractivities");
            mongo.connect(mongoURL, function () {
                useractivity.insertOne(useractivityData, function (err, results) {
                    console.log(results);
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
}

exports.insertIntoActivity = insertIntoActivity;
// module.exports = router;