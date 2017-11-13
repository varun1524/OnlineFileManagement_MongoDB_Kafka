var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;



/**
 * Mongo DB Connection Pool
 */
/*exports.connect = function(url, callback){
    try{
        MongoClient.connect(url, {
                poolSize:10
        },function(err, _db){
            if (err) { console.log(err);}
            db = _db;
            connected = true;
            console.log(connected +" is connected?");
            callback(db);
        });
    }
    catch (e){
        console.log(e);
    }
};*/

/*
 *  Simple Connection
 */
exports.connect = function(url, callback){
    try{
        MongoClient.connect(url,function(err, _db){
            // if (err) { throw new Error('Could not connect: '+err); }
            if (err) { console.log(err) }
            db = _db;
            connected = true;
            console.log(connected +" is connected?");
            callback(db);
        });
    }
    catch(e){
        console.log(e);
    }
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    try{
        if (!connected) {
            throw new Error('Must connect to Mongo before calling "collection"');
        }
        return db.collection(name);
    }
    catch (e){
        console.log(e);
    }
};

//Implementation Of Own Connection Pooling

let availableConnections;
let totalConnections = 10;
// let url = url;
let inUseConnections = [];

createConnectionPool = (url, callback) => {
    console.log(url);
    let count = 0;
    availableConnections=[];
    for(let i=0;i<totalConnections;i++){
        // let newConnection;
        mongoconnect(url, function(db){
            // console.log(db);
            availableConnections[i]=db;
            count++;
            if(count===totalConnections){
                callback(true);
            }
        });
        console.log(availableConnections);
        console.log(availableConnections.length);
    }
};

mongoconnect = ((url, callback) => {
    MongoClient.connect(url, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        connected = true;
        // availableConnections.push(db);
        console.log("Connected is "+connected);
        callback(db);
    });
});

fetchConenction = ((callback) => {
    if(availableConnections.length>0){
        console.log(availableConnections.length);
        // console.log(availableConnections[0]);
        let db = availableConnections.pop();
        inUseConnections.push(db);
        // console.log(inUseConnections);
        console.log(inUseConnections.length);
        // console.log(db);
        callback(db);
    }
    else{
        console.log("No Available Connections");
        callback(null);
    }
});

exports.getConnection = ((url, callback) => {
    console.log(availableConnections);
    if(availableConnections===null || availableConnections===undefined) {
        createConnectionPool(url, function (result) {
            console.log("result of collection pool creation: "+result);
            if(result){
                console.log(availableConnections.length);
                if(availableConnections.length === totalConnections){
                    console.log("Here");
                    console.log(availableConnections.length);
                    console.log(availableConnections[0]);
                    let db = availableConnections.pop();
                    console.log(db);
                    callback(db)
                }
            }
            else {
                console.log("Error");
            }
        });

    }
    else {
        console.log(availableConnections.length);
        if(availableConnections.length > 0) {
            fetchConenction(function (db) {
                callback(db);
            });
        }
        else {
            setTimeout(function(){
                fetchConenction(function (db) {
                    callback(db);
                });
            }, 1000);
            // fetchConenction();
        }

    }

});

exports.releaseConnection = ((db) => {
    console.log("In Release Connection");
    console.log(inUseConnections.length);
    console.log(availableConnections.length);
    availableConnections.push(db);
    inUseConnections.splice(inUseConnections.indexOf(db),1);
    console.log(inUseConnections.length);
    console.log(availableConnections.length);
});

/* collection(name){
     if (!connected) {
         throw new Error('Must connect to Mongo before calling "collection"');
     }
     return db.collection(name);
 };*/
