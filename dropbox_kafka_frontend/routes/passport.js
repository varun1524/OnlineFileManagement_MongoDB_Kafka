var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {
        try {
            /*mongo.connect(mongoURL, function(){
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
            });*/
            kafka.make_request('login_topic',{"service":"login","username":username,"password":password}, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    done(err,{});
                }
                else
                {
                    if(results.status === 201){
                        console.log("Received username: "+results.username);
                        console.log("Local username: "+ username);
                        done(null,{username:results.username,status:results.status});
                    }
                    else {
                        done(null,false);
                    }
                }
            });
        }
        catch (e){
            done(e,{});
        }
    }));
};


