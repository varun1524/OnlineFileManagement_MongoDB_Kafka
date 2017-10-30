let act = require('./activity');
let fs = require('fs');
// let shell = require('shelljs');
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
// let ObjectId = require('mongodb').ObjectID;

insertIntoStorage = ((callback, name, path, type, username) => {
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
});

doesExist = ((callback, name, path)=>{
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
});

exports.insertIntoStorage = insertIntoStorage;
exports.doesExist = doesExist;