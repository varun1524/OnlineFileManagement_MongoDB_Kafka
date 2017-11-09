let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;

handle_request = ((data, callback) => {
    let response = {
        status:"",
        data:[]
    };
    try{
        console.log(data);

        mongo.connect(mongoURL, function () {
            let group = mongo.collection("group");
            let users = mongo.collection("users");


            group.findOne({'_id': ObjectId(data.groupid)}, function (err, result2) {
                if (err) {
                    throw err;
                }
                if (result2) {

                    users.findOne({_id: result2.owner}, function (err, user) {
                        console.log(user);
                        if (user) {
                            response.data.push({
                                "username": user._id,
                                "firstname": user.firstname,
                                "lastname": user.lastname,
                                "access": "admin"
                            });

                            group.aggregate([
                                {
                                    $match: {
                                        '_id': ObjectId(data.groupid)
                                    }
                                },
                                {
                                    $project: {
                                        members: 1
                                    }
                                }], function (err, result) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                }
                                console.log("result members");
                                console.log(result[0].members);
                                if (result[0].members !== null && result[0].members !== undefined) {
                                    if (result[0].members.length > 0) {
                                        let count = 0;
                                        for (i = 0; i < result[0].members.length; i++) {
                                            let access = result[0].members[i].access;
                                            users.findOne({_id: result[0].members[i].username}, function (err, result1) {
                                                console.log(result1);
                                                if (err) {
                                                    console.log(err);
                                                    throw err;
                                                }
                                                if (result1) {
                                                    response.data.push({
                                                        "username": result1._id,
                                                        "firstname": result1.firstname,
                                                        "lastname": result1.lastname,
                                                        "access": access
                                                    })
                                                }
                                                else {
                                                    throw "Error while retrieving data from users table";
                                                }
                                                count++;
                                                if (count === result[0].members.length) {
                                                    console.log(i);
                                                    console.log(response);
                                                    response.status = 201;
                                                    callback(null, response);
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        response.status = 201;
                                        response.message = "Group does not have any member other than admin";
                                        callback(null, response);
                                    }
                                }
                                else {
                                    response.status = 201;
                                    response.message = "Group does not have any member other than admin";
                                    callback(null, response);
                                }

                            });
                        }
                        else {
                            throw "Unrecognized Error.";
                        }
                    });
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