// import connectionPooling from "./mongo";

let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
// let mongo = require(./mo)

handle_request=((data, callback)=> {
    let response = {};
    try {
        // let conn = new ConnectionPooling();
        // let conn1 = new mongo.ConnectionPooling(mongoURL);
        // console.log(conn);
        // console.log(conn1);
        console.log("From Jmeter");

        mongo.getConnection(mongoURL, function (db) {
            // console.log(db);
            if(db){
                db.collection("users").find({}).toArray(function(err,results){
                    console.log("In Connection");
                    console.log(results);
                    if(err){
                        console.log(err);
                    }
                    if(results){

                        if(results.length>0) {
                            response.status=200;
                            response.data=results;
                            // db.close();
                            mongo.releaseConnection(db);
                            callback(null, response);
                        }
                        else {
                            // db.close();
                            mongo.releaseConnection(db);
                            response.status=400;
                            callback(null, response);
                        }
                    }
                    else {
                        // db.close();
                        mongo.releaseConnection(db);
                        response.status=400;
                        callback(null, response);
                    }
                });
            }
            else {
                console.log("Error");
            }
        });


       /* mongo.connect(mongoURL, function (result) {
            if(result){
                result.collection("users").find({}).toArray(function(err,results){
                    console.log("In Connection");
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
                response.status=400;
                callback(null, response);
            }
        })*/
    }
    catch (e){
        console.log(e);
        response.status=400;
        callback(e, response);
    }
});

exports.handle_request = handle_request;
