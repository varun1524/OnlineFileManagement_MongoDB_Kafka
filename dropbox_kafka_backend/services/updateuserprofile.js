let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
var UserProfile = require('../models/userprofile');

handle_request = ((data, callback) => {
    let response = {};
    try {
        if(data.username!==null || data.username!==undefined) {
            let username = data.username;
            console.log(username);
            let profiledata = data;
            console.log(profiledata);
            // let userprofile = {
            //     overview : profiledata.overview,
            //     education : profiledata.education,
            //     contactinfo : profiledata.contactinfo,
            //     lifeevents : profiledata.lifeevent,
            //     work : profiledata.work,
            //     music : profiledata.music,
            //     reading : profiledata.reading,
            //     sports : profiledata.sports,
            // };
            updateQuery= {
                $set : {
                    overview : profiledata.overview,
                    education : profiledata.education,
                    contactinfo : profiledata.contactinfo,
                    lifeevents : profiledata.lifeevent,
                    work : profiledata.work,
                    music : profiledata.music,
                    reading : profiledata.reading,
                    sports : profiledata.sports,
                }
            };

            mongo.connect(mongoURL, function () {
                UserProfile.findOneAndUpdate({_id:username},updateQuery, function (err, results) {
                    console.log(results);
                    if (err) {
                        throw err;
                    }
                    // if (results.result.nModified === 1) {
                    if (results !== null) {
                        console.log("profile updated successfully");
                        response.status = 201;
                        response.data = results;
                        response.message = "Profile updated successfully";
                        callback(null, response);
                    }
                    else {
                        response.status = 301;
                        response.message = "Failed to Update Profile";
                        callback(null, response);
                    }
                });
            });
        }
    }
    catch (e){
        console.log(e);
        response.status = 301;
        response.message = "Error while fetching activity data";
        callback(e, response);
    }
});

exports.handle_request = handle_request;