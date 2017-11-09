var fs = require('fs');
var act = require('./activity');
var bcrypt = require('bcrypt');

var UserProfile = require('../models/userprofile');
var User = require('../models/user');


handle_request = ((data, callback) => {
    let err=null;
    let response = {};
    try {
        console.log(data);
        var salt = bcrypt.genSaltSync(10);

        let user = new User({
            _id  : data.username,
            firstname : data.firstname,
            lastname : data.lastname,
            username : data.username,
            hashpassword : bcrypt.hashSync(data.password, salt)
        });

        console.log(user);

        // mongo.connect(mongoURL, function () {
        // var usercollection = mongo.collection('users');
        User.find({username:data.username}, function(err, result) {
            console.log(result);
            if(err){
                console.log("error:");
                console.log(err);
                throw err;
            }
            if(result.length>0) {
                console.log("User Exists");
                console.log(result[0]._id);
                response.status = 301;
                response.message = "Already Exist";
                callback(err,response);
            }
            else {
                user.save(function (err, result1) {
                    console.log("result");
                    console.log(result1);

                    if(err){
                        console.log(err);
                        throw err;
                    }

                    if (result1 !== null && result1 !== undefined) {
                        console.log("Sign up successful");
                        // let userprofilecollection = mongo.collection("userprofile");

                        let userprofile = new UserProfile({
                            _id  : data.username,
                            overview : "",
                            work: "",
                            education: "",
                            contactinfo: "",
                            lifeevents: "",
                            music: false,
                            sports: false,
                            reading: false,
                        });
                        userprofile.save(function (err, result2) {
                            console.log(result2);
                            if(err){
                                console.log(err);
                                throw "Error while adding data into userprofile table";
                            }
                            act.insertIntoActivity(function (err, activityInserted) {
                                if(err){
                                    console.log(err);
                                    response.status = 301;
                                    response.message = "Signup Successful. Failed to add user activity";
                                    callback(err,response);
                                }
                                console.log(activityInserted);
                                if(activityInserted){
                                    createUserDirectory(data.username);
                                    response.status = 201;
                                    response.username=data.username;
                                    response.message = "Signup Successful";
                                    callback(err,response);
                                }
                                else {
                                    User.deleteOne({_id: data.username},function (err, result3) {
                                        console.log(result3);
                                        userprofile.deleteOne({_id:data.username}, function (err, result4) {
                                            console.log(result4);
                                            //delete directory here
                                            response.status = 401;
                                            response.message = "Signup Failed";
                                            callback(err,response);
                                        })
                                    })

                                }
                            },data.username, "signup");
                        });
                    }
                    else {
                        response.status = 401;
                        response.message = "Signup Failed";
                        callback(err,response);
                    }
                });
            }
        });
    }
    catch (e){
        console.log(e);
        err = e;
        response.status = 401;
        response.message = "Signup Failed";
        callback(err,response);
    }
});

createUserDirectory = ((user) => {
    try {
        if(fs.existsSync('./dropboxstorage')){
            var userdirpath="./dropboxstorage/" + user;
            console.log(userdirpath);
            var userPath = fs.mkdir(userdirpath);
            console.log(userPath);
        }
        else{
            console.log("dropboxstorage does not exist");
        }
    }
    catch(e) {
        throw e;
    }
});

exports.handle_request = handle_request;
