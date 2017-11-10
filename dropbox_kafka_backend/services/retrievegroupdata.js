let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

handle_request = ((data, callback) => {
    let response = {};
    try{
        console.log(data);

        let jsonObj={
            parentid:"",
            data:[]
        };
        mongo.connect(mongoURL, function () {
            let group = mongo.collection("group");
            if(!data.gotoparent){

                group.aggregate([
                    {$match: {'_id': ObjectId(data.groupid)}},
                    {$project: {
                        storage: {$filter: {
                            input: '$storage',
                            as: 'store',
                            cond: {$eq: ['$$store.parentid', data.parentid]}}}
                    }}
                ], function (err, result) {
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    console.log("result");
                    console.log(result);
                    if(result[0].storage!==null){
                        console.log(result[0].storage);
                        if(result[0].storage.length>0) {
                            let store = result[0].storage;
                            for (i = 0; i < store.length; i++) {
                                let tempObj = {};
                                tempObj["id"] = store[i]._id;
                                tempObj["name"] = store[i].name;
                                tempObj["type"] = store[i].type;
                                if(store[i].type==="f"){
                                    tempObj["filetype"] = store[i].filetype;
                                }
                                tempObj["ctime"] = store[i].creationtime;
                                jsonObj.data.push(tempObj);
                            }
                            jsonObj.parentid=data.parentid;
                            console.log(jsonObj);
                            response.status=201;
                            response.data=jsonObj;
                            callback(null,response);
                        }
                        else {
                            response.status=204;
                            response.message="Directory is Empty";
                            callback(null, response);
                        }
                    }
                    else {
                        response.status=205;
                        response.message="Group is Empty";
                        callback(null, response);
                    }
                });
            }
            else {
                group.aggregate([
                    {$match: {'_id': ObjectId(data.groupid)}},
                    {$project: {
                        storage: {$filter: {
                            input: '$storage',
                            as: 'store',
                            cond: {$eq: ['$$store._id', ObjectId(data.parentid)]}}}
                    }}
                ], function (err, result) {
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    console.log("result");
                    console.log(result[0].storage);
                    if(result[0].storage!==null && result[0].storage!==undefined){

                        if(result[0].storage.length===1){
                            let tempid = result[0].storage[0].parentid;
                            group.aggregate([
                                {$match: {'_id': ObjectId(data.groupid)}},
                                {$project: {
                                    storage: {$filter: {
                                        input: '$storage',
                                        as: 'store',
                                        cond: {$eq: ['$$store.parentid', tempid]}}}
                                }}
                            ], function (err, result) {
                                console.log("result after parent");
                                console.log(result[0].storage);
                                if(result[0].storage!==null){

                                    console.log(result[0].storage);
                                    if(result[0].storage.length>0) {
                                        let store = result[0].storage;
                                        for (i = 0; i < store.length; i++) {
                                            let tempObj = {};
                                            tempObj["id"] = store[i]._id;
                                            tempObj["name"] = store[i].name;
                                            tempObj["type"] = store[i].type;
                                            tempObj["ctime"] = store[i].creationtime;
                                            jsonObj.data.push(tempObj);
                                        }
                                        jsonObj.parentid=tempid;
                                        console.log("json");
                                        console.log(jsonObj);
                                        response.status=201;
                                        response.data=jsonObj;
                                        callback(null,response);
                                    }
                                    else {
                                        response.status=301;
                                        response.message="Error while navigating to parent directory";
                                        callback(null, response);
                                    }
                                }
                                else {
                                    response.status=205;
                                    response.message="Group is Empty";
                                    callback(null, response);
                                }
                            });
                        }
                        else {
                            console.log("unrecognized error");
                            response.message="Unrecognized Error";
                            response.status=301;
                            callback(null, response);
                        }
                    }
                    else {
                        response.message="Unrecognized Error";
                        response.status=301;
                        callback(null, response);
                    }
                });
            }
        });
    }
    catch (e)
    {
        console.log(e);
        response.status = 301;
        response.message = "Error while fetching data from group";
        callback(e, response);
    }
});

exports.handle_request = handle_request;