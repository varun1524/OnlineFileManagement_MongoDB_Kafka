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

handle_request = ((data, callback) => {
    let response ={};
    try {
        console.log("In File Upload");
        // let count = 0;

        console.log(data);
        let groupid = data.groupid;
        let parentid = data.parentid;
        mongo.connect(mongoURL, function () {

            let group = mongo.collection("group");
            group.aggregate([
                {$match: {'_id': ObjectId(groupid)}},
                {$project: {
                    storage: {$filter: {
                        input: '$storage',
                        as: 'store',
                        cond: {$and:[{$eq: ['$$store.parentid', parentid]} ,{$eq:['$$store.name', data.filename]}]}}}
                }}
            ], function (err, result) {
                if(err){
                    console.log(err);
                    throw err;
                }
                console.log("result");
                console.log(result[0].storage);
                if(result[0].storage!==null){
                    if(result[0].storage.length===0){
                        this.pushInGroupStorage(group, data, function (result) {
                            if(result){
                                response.status=201;
                                response.message = "File added successfully";
                            }
                            else {
                                response.status=301;
                                response.message = "Failed to add File in group";
                            }
                            callback(null, response);
                        })
                    }
                    else if(result[0].storage.length===1){
                        response.status=204;
                        response.message="File already exists";
                        callback(null, response);
                    }
                    else {
                        console.log(result[0].storage.length);
                        response.status=301;
                        response.message="Unrecognized Issue";
                        callback(null, response);
                    }
                }
                else {
                    this.pushInGroupStorage(group, data, function (result) {
                        if(result){
                            response.status=201;
                            response.message = "File added successfully";
                        }
                        else {
                            response.status=301;
                            response.message = "Failed to add File in group";
                        }
                        callback(null, response);
                    })
                }
            });
        });
    }
    catch (e){
        console.log(e);
        callback(e, response);
    }
});

pushInGroupStorage = ((group, data, callback)=>{
    group.updateOne({_id:ObjectId(data.groupid)},{$push: {
            storage:{
                _id : new ObjectId(),
                name : data.filename,
                parentid : data.parentid,
                type : "f",
                filetype : data.filetype,
                filedata : data.filedata,
                creationtime : new Date()
            }}},
        function (err, result) {
            console.log(result.result.nModified);
            if(err){
                console.log(err);
                throw err;
            }
            if(result.result.nModified===1){
                callback(true);
            }
            else {
                callback(false);
            }
        });
});

exports.handle_request = handle_request;