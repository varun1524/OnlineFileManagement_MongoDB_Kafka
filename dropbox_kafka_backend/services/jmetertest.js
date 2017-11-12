let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";

handle_request=((data, callback)=> {
    let response = {};
    try {
        mongo.connect(mongoURL, function (db) {
            if(db){

                let usercollection = mongo.collection("users");
                usercollection.find({}).toArray(function(err,results){
                    console.log(results);
                    if(err){
                        console.log(err);
                    }
                    if(results.length>0) {
                        response.status=200;
                        response.data=results;
                        db.close();
                        callback(null, response);
                    }
                    else {
                        db.close();
                        response.status=400;
                        callback(null, response);
                    }
                });
            }
            else {
                console.log("Error");
                db.close();
                response.status=400;
                callback(null, response);
            }
        });
    }
    catch (e){
        console.log(e);
        response.status=400;
        callback(e, response);
    }
});

exports.handle_request = handle_request;
