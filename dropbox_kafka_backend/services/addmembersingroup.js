let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

handle_request = ((data, callback) => {
    let response = {};
    let message = [];
    try{
        console.log("in adding members");
        console.log(data);

        mongo.connect(mongoURL, function () {
            let users = mongo.collection("users");
            data.userdata.map((user)=>{
                users.find({_id : user},{_id: true }).toArray(function (err, results) {
                    console.log(results);
                    console.log("Fetched Records: " + results.length);
                    if (err) {
                        console.log(err);
                        message.push({user:"Error in sharing data."});
                    }
                    else if (results.length === 0) {
                        message.push({ user : "User does not have account in dropbox."});
                    }
                    else if(results.length===1) {
                        let group = mongo.collection("group");
                        group.aggregate([
                            {$match: {'_id': ObjectId(data.groupid)}},
                            {$project: {
                                members: {
                                    $filter: {
                                        input: '$members',
                                        as: 'members',
                                        cond: {$eq: ['$$members.username', user]}
                                    }}}}
                        ], function (err, result) {
                            if(err){
                                console.log(err);
                                throw err;
                            }
                            console.log("result");
                            console.log(result[0]);
                            if(result[0].members!==null){
                                if(result[0].members.length===0){
                                    group.updateOne({_id:ObjectId(data.groupid)},
                                        {$push: {
                                            members:{
                                                _id : new ObjectId(),
                                                username : user,
                                                access : "read",
                                            }}},
                                        function (err, result) {
                                            console.log(result.result.nModified);
                                            if(err){
                                                console.log(err);
                                                throw err;
                                            }
                                            if(result.result.nModified===1){
                                                response.status=201;
                                                response.message = "Member added Successfully";
                                            }
                                            else {
                                                response.status=301;
                                                response.message = "Failed to add member in group";
                                            }
                                            callback(null, response);
                                        });
                                }
                                else if(result[0].members.length===1){
                                    response.status=301;
                                    response.message="Member already exists";
                                    callback(null, response);
                                }
                                else {
                                    console.log(result[0].members.length);
                                    response.status=301;
                                    response.message="Unrecognized Issue";
                                    callback(null, response);
                                }
                            }
                            else {
                                group.updateOne({_id:ObjectId(data.groupid)},
                                    {$push: {
                                        members:{
                                            _id : new ObjectId(),
                                            username : user,
                                            access : "read",
                                        }}},
                                    function (err, result) {
                                        console.log(result.result.nModified);
                                        if(err){
                                            console.log(err);
                                            throw err;
                                        }
                                        if(result.result.nModified===1){
                                            response.status=201;
                                            response.message = "Member added Successfully";
                                        }
                                        else {
                                            response.status=301;
                                            response.message = "Failed to add member in group";
                                        }
                                        callback(null, response);
                                    });
                            }
                        });
                    }
                })
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