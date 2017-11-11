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
                group.findOneAndDelete({_id:ObjectId(data.groupid)}, function (err, result) {
                    console.log(result);
                    if(err){
                        throw err;
                    }
                    if(result.value!==null && result.value!==undefined ){
                        response.status=201;
                        response.groupname=result.value.groupname;
                        callback(null, response);
                    }
                    else {
                        response.status=301;
                        response.message="Failed to remove group";
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
