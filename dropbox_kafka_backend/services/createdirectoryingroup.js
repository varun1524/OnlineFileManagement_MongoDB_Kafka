let act = require('./activity');
let fs = require('fs');
let shell = require('shelljs');
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;
// let fse = require('fs-extra');
let filePath="";
let storage = require('./storage');

handle_request = ((data, callback) => {
    let response = {};
    try{
        console.log("in create directory");
        console.log(data);

        mongo.connect(mongoURL, function () {
            let group = mongo.collection("group");
            group.aggregate([
                {$match: {'_id': ObjectId(data.groupid)}},
                {$project: {
                    storage: {$filter: {
                        input: '$storage',
                        as: 'store',
                        cond: {$and:[{$eq: ['$$store.parentid', data.parentid]} ,{$eq:['$$store.name', data.directoryName] }]}}}
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
                        group.updateOne({_id:ObjectId(data.groupid)},{$push: {
                                storage:{
                                    _id : new ObjectId(),
                                    name : data.directoryName,
                                    parentid : data.parentid,
                                    type : "d",
                                    creationtime : new Date()
                                }}},
                            function (err, result) {
                                console.log(result.result.nModified);
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                if(result.result.nModified===1){
                                    response.status=201;
                                    response.message = "Directory added successfully";
                                }
                                else {
                                    response.status=301;
                                    response.message = "Failed to add directory in group";
                                }
                                callback(null, response);
                            });
                    }
                    else if(result[0].storage.length===1){
                        response.status=301;
                        response.message="Directory already exists";
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
                    group.updateOne(
                        {
                            _id:ObjectId(data.groupid)
                        },
                        {
                            $push:
                                {
                                    storage:{
                                        _id : new ObjectId(),
                                        name : data.directoryName,
                                        parentid : data.parentid,
                                        type : "d",
                                        creationtime : new Date()
                                    }
                                }
                        },
                        function (err, result) {
                            console.log(result.result.nModified);
                            if(err){
                                console.log(err);
                                throw err;
                            }
                            if(result.result.nModified===1){
                                response.status=201;
                                callback(null, response);
                            }
                            else {
                                response.status=301;
                                response.message = "Failed to add directory in group";
                                callback(null, response);
                            }
                        });
                }

            });
        });
    }
    catch (e)
    {
        console.log(e);
        response.status = 301;
        response.message = "Error while creating directory in group";
        callback(e, response);
    }
});

exports.handle_request = handle_request;