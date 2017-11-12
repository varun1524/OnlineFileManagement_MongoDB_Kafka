var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;


/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
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
};

/*exports.connect = function(url, callback){
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
};*/

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