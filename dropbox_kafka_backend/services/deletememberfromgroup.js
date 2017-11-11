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
                                members:
                                    {
                                        $filter:
                                            {
                                                input: '$members',
                                                as: 'member',
                                                cond:
                                                    {
                                                        $eq: ['$$member.username', data.member]
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
                    console.log(result[0].members);
                    if(result[0].members!==null && result[0].members!==undefined){
                        if(result[0].members.length===1){
                            group.updateOne(
                                {
                                    _id:ObjectId(data.groupid)
                                },
                                {
                                    $pull:
                                        {
                                            members: {
                                                username: data.member
                                            }
                                        }
                                }, function (err, result1) {
                                    console.log("Pull Result");
                                    console.log(result1);
                                    if(err){
                                        console.log(err);
                                        throw err;
                                    }
                                    if(result1!==null && result1!==undefined){
                                        console.log(result1.modifiedCount);
                                        if(result1.modifiedCount===1){
                                            response.status=201;
                                            response.message = "User "+ result[0].members[0].username+" removed";
                                        }
                                        else {
                                            response.status=301;
                                            response.message = "Failed to remove user "+ result[0].members[0].username+" from group";
                                        }
                                    }
                                    else {
                                            response.status=301;
                                            response.message = "Failed to remove user "+ result[0].members[0].username+" from group";
                                    }
                                    callback(null,response);
                                });
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


exports.handle_request = handle_request;
