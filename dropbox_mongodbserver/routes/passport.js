var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var act = require("./activity");
var bcrypt = require("bcrypt");

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {
        try {
            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('users');

                coll.findOne({username: username}, function(err, result){
                    console.log(result);
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    if(result!==null && result!==undefined) {
                        if (bcrypt.compareSync(password, result.hashpassword)) {
                            act.insertIntoActivity(function (err, activityInserted) {
                                if (err) {
                                    console.log(err);
                                    done(err, 301, "Login Successful. Failed to add user activity");
                                }
                                console.log(activityInserted);
                                if (activityInserted) {
                                    done(err, 201, "Login Successful. Login Activity Added");
                                }
                                else {
                                    done(err, 301, "Login Successful. Failed to add Activity");
                                }
                            }, username, "login");
                        }
                        else {
                            done(err, 301, "Incorrect Password");
                        }
                    }
                    else {
                        done(err, 301, "Username does not exist. Please signup");
                    }
                });
            });
        }
        catch (e){
            done(e,{});
        }
    }));
};


