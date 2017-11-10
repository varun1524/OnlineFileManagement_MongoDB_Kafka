let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;


handle_request = ((data, callback) => {
    let response = {};
    try {
        console.log(data.username);
        if(data.username!==null || data.username!==undefined) {

            mongo.connect(mongoURL, function () {

                let group = mongo.collection("group");
                group.aggregate([
                    {
                        $match:
                            {
                                '_id': ObjectId(data.groupid)
                            }
                    },
                    {
                        $project:
                            {
                                storage:
                                    {
                                        $filter:
                                            {
                                                input: '$storage',
                                                as: 'store',
                                                cond:
                                                    {
                                                        $eq: ['$$store._id', ObjectId(data.itemid)]
                                                    }
                                            }
                                    }
                            }
                    }
                ], function (err, result) {
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    console.log("result");
                    console.log(result[0].storage);
                    if(result[0].storage!==null && result[0].storage!==undefined) {
                        if(result[0].storage.length===1){
                            if(result[0].storage[0].type==="d"){
                                this.deletedirectory(data.itemid, data.groupid, group, function (result) {
                                    if(result){
                                        this.deletefile(data.itemid, data.groupid, group, function (result) {
                                            if(result){
                                                response.status = 201;
                                                response.message = "Directory Deleted Successfully";
                                                callback(null, response);
                                            }
                                            else {
                                                response.status = 301;
                                                response.message = "Directory Delete Failed";
                                                callback(null, response);
                                            }
                                        });
                                    }
                                    else {
                                        console.log(result);
                                        response.status = 301;
                                        response.message = "Directory Delete Failed";
                                        callback(null, response);
                                    }
                                });
                            }
                            else {
                                this.deletefile(data.itemid, data.groupid, group, function (result) {
                                    if(result){
                                        response.status = 201;
                                        response.message = "File Deleted Successfully";
                                        callback(null, response);
                                    }
                                    else {
                                        response.status = 301;
                                        response.message = "File Delete Failed";
                                        callback(null, response);
                                    }
                                })
                            }
                        }
                        else {
                            console.log(result[0].members.length);
                            response.status=301;
                            response.message="Unrecognized Issue";
                            callback(null, response);
                        }
                    }
                    else {
                        response.status=301;
                        response.message="Member is not part of the group";
                        callback(null, response);
                    }
                });
            });
        }
    }
    catch (e){
        console.log(e);
        response.status=301;
        response.message="Error while deleting group from server";
        callback(e, response);
    }
});


deletefile = ((fileid, groupid, group,callback)=>{
    group.updateOne(
        {
            _id:ObjectId(groupid)
        },
        {
            $pull:
                {
                    storage: {
                        _id: ObjectId(fileid)
                    }
                }
        }, function (err, result1) {
            if(err){
                console.log(err);
                throw err;
            }
            if(result1!==null && result1!==undefined){
                console.log("Deleted Content: "+result1.modifiedCount);
                if(result1.modifiedCount===1){
                    callback(true);
                }
                else {
                    callback(false);
                }
            }
            else {
                response.status=301;
                response.message = "Failed to remove user "+ result[0].members[0].username+" from group";
                callback(null,response);
            }
        });
});


deletedirectory = ((dirid, groupid, group, callback) => {
    console.log("Dir Id: " +dirid);

    console.log("Group Id: "+ groupid);
    group.aggregate([
        {
            $match:
                {
                    '_id': ObjectId(groupid)
                }
        },
        {
            $project:{
                storage:{
                    $filter:{
                        input:'$storage',
                        as : 'store',
                        cond: {$eq: ['$$store.parentid', dirid]},
                    },
                }
            }
        }
    ],function (err, result) {
        if(err){
            throw err;
        }
        console.log(result);
        // console.log(result[0].storage);
        if(result[0].storage!==null && result[0].storage!==undefined){
            console.log("Directory Contents: "+result[0].storage.length);
            if(result[0].storage.length>0){
                result[0].storage.map((item)=>{
                    console.log(item.name);
                    console.log(item._id);
                    if(item.type==="d"){
                        deletedirectory(item._id, groupid, group, function (result) {
                            if(result){
                                console.log(result);
                                deletefile(item._id, groupid, group, function (result) {
                                    callback(result);
                                });
                            }
                            else{
                                callback(false);
                            }
                        });
                    }
                    else{
                        this.deletefile(item._id, groupid, group, function (result) {
                            console.log(result);
                        })
                    }
                    if(result[0].storage[result[0].storage.length-1]._id===item._id){
                        callback(true);
                    }
                });
            }
            else {
                this.deletefile(dirid, groupid, group, function (result) {
                    callback(result);
                });
            }
        }
        else {
            callback(false);
        }
    });
});

exports.handle_request = handle_request;
