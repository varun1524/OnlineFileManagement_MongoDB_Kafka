let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

handle_request = ((data, callback) => {
    let response = {
    };
    try{
        console.log(data);

        mongo.connect(mongoURL, function () {
            let group = mongo.collection("group");

            group.findOne({'_id': ObjectId(data.groupid)},{owner:1}, function (err, result) {
                console.log(result);
                if(err){
                    throw err;
                }
                if(result){
                    if(data.username===result.owner){
                        response.status=201;
                        response.access="admin";
                        callback(null, response);
                    }
                    else {
                        group.aggregate([
                            {
                                $match: {
                                    '_id': ObjectId(data.groupid)
                                }
                            },
                            {
                                $project: {
                                    members: {
                                        $filter:{
                                            input: '$members',
                                            as: 'member',
                                            cond: {$eq: ['$$member.username', data.username]}
                                        }
                                    }
                                }
                            }], function (err, result1) {
                            if(err){
                                console.log(err);
                                throw err;
                            }
                            console.log("result members");
                            console.log(result1[0].members);
                            if(result1[0].members!==null && result1[0].members!==undefined) {
                                response.status=201;
                                response.access=result1[0].members[0].access;
                                callback(null, response);
                            }
                            else {
                                response.status = 201;
                                response.message = "Group does not have any member other than admin";
                                callback(null, response);
                            }
                        });
                    }
                }
                else {
                    throw "Unrecognized Error.";
                }
            })
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