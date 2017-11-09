let UserProfile = require('../models/userprofile');

handle_request = ((data, callback) => {
    let response ={};
    console.log("Here O m");
    try {
        console.log("In fetching profile");
        if(data.username!==null || data.username!==undefined) {
            let username = data.username;
            // mongo.connect(mongoURL,function () {
            //     let profile = mongo.collection("userprofile");
                UserProfile.find({_id:username}, function (err, results) {
                    console.log(results);
                    if (err) {
                        throw err;
                    }
                    if (results.length === 1) {
                        response.status = 201;
                        response.username = username;
                        response.data = results[0];
                        callback(null, response);
                    }
                    else {
                        response.status = 301;
                        response.message = "Failed to fetch Profile Data";
                        callback(null, response);
                    }
                });
            // });
        }
    }
    catch (e){
        console.log(e);
        console.log("error");
        response.status = 301;
        response.message = "Error while fetching user profile data";
        callback(e, response);
    }
});

exports.handle_request = handle_request;