let multer = require('multer');
// let glob = require('glob');
let act = require('./activity');
let fs = require('fs');
let shell = require('shelljs');
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
let ObjectId = require('mongodb').ObjectID;
// let fse = require('fs-extra');
let filePath="";
let st = require('./storage');
/*let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(filePath);
        if(req.session.username!==undefined) {
            cb(null, "./dropboxstorage/" + req.session.username + "/" + filePath);
        }
    },
    filename: function (req, file, cb) {
        try {
            let dirpath = "./dropboxstorage/" + req.session.username + "/" + filePath;
            let filename = file.originalname;
            console.log("IMP");
            st.doesExist(function (err, result) {
                console.log("Does Exist: " + result);
                if (!result) {
                    let username = req.session.username;
                    if (st.insertIntoStorage(function (err, result) {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                            if (result) {
                                console.log("File added in file system as well as database");
                                cb(null, filename);
                                // deleteIfNotAvailableInStore(filename, dirpath);
                            }
                            else {
                                console.log("Failed to add file into database");
                            }
                        }, file.originalname, dirpath, "f", username)) {
                        console.log("Successfully added " + file.originalname + " into database");
                    }
                    else {
                        console.log("Failed to add " + file.originalname + " into database");
                    }
                }
                else {
                    console.log("File already exists in database");
                }
            }, filename, dirpath, Date.toLocaleString());
        }
        catch (e){
            console.log(e);
        }
    }
});

let upload = multer({storage:storage}).any();*/

handle1 = ((data, callback) => {
    let response ={};
    try {
        console.log("In File Upload");
        // let count = 0;

        data.map((file)=>{

            console.log(file.path);
            // console.log(file.bytedata);
            // console.log(file.filedata);
            console.log(file.filename);
            console.log(file.size);
            console.log(file.path);
            console.log(file.username);

            let dirpath = "./dropboxstorage/" + file.username + "/" + file.path;
            console.log("IMP");
            st.doesExist(function (err, result) {
                console.log("Does Exist: " + result);
                if (!result) {
                    st.insertIntoStorage(function (err, result) {
                        console.log(result);
                        if(result) {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                            if (result) {
                                fs.writeFile(dirpath+file.filename, file.filedata, (err) => {
                                    if (err) throw err;
                                    console.log('The file has been saved!');
                                });

                                // console.log(file.filedata);

                               /* var fsfile = fs.createWriteStream(dirpath+file.filename);
                                fsfile.on('error', function(err) { /!* error handling *!/ });
                                // // file.filedata.map((v) => { fsfile.write(v.join(', ') + '\n'); });
                                for (let i=0;i<file.size;i++){
                                    fsfile.write(file.filedata[i]);
                                    // console.log(file.filedata[i]);
                                }
                                // file.filedata.map((v) => { fsfile.write(v)});
                                fsfile.end();*/

                                // fs.createWriteStream(dirpath+"test/"+file.fileName, data.filedata);
                                console.log("Successfully added " + file.filename + " into database");
                                response.status = 201;
                                response.message = "File successfully added";
                                callback(null, response);
                            }
                            else {
                                console.log("Failed to add file into database");
                            }
                        }
                        else {
                            console.log("Failed to add " + file.filename + " into database");
                        }
                    }, file.filename, dirpath, "f", file.username, file.filedata, file.size);
                }
                else {
                    console.log("File already exists in database");
                    response.status = 204;
                    response.message = "File already exist on given path";
                    callback(null, response);
                }
            }, file.filename, dirpath);

        });

    }
    catch (e){
        console.log(e);
        callback(e, response);
    }
});

// handle_request = ((data, callback) => {
//     let response ={};
//     try {
//         console.log("In File Upload");
//         // let count = 0;
//
//         console.log(data.fileName);
//         console.log(data.fileType);
//         response.status = 201;
//         response.username = data.username;
//
//         let dirpath = "./dropboxstorage/" + data.username + "/" + data.filePath;
//         console.log("IMP");
//         st.doesExist(function (err, result) {
//             console.log("Does Exist: " + result);
//             if (!result) {
//                 // fs.createWriteStream(dirpath+data.fileName, data.fileChunk);
//                 // require('http').createServer((req, res) => {
//                 //     var busBoy = require('busboy');
//                 //     var busboy = new busBoy();
//                 //     busboy.on('file',function () {
//                 //         data.file.pipe(fs.createWriteStream(dirpath+data.fileName));
//                 //     });
//                 // });
//
//                 // var blob = new Blob(data.fileChunk);
//                 // console.log(blob);
//                 if (st.insertIntoStorage(function (err, result) {
//                         if (err) {
//                             console.log(err);
//                             throw err;
//                         }
//                         if (result) {
//                             console.log("File added in file system as well as database");
//                             callback(null, response);
//                         }
//                         else {
//                             console.log("Failed to add file into database");
//                         }
//                     }, data.fileName, dirpath, "f", data.username, data.fileChunk)) {
//                     console.log("Successfully added " + data.fileName + " into database");
//                 }
//                 else {
//                     console.log("Failed to add " + data.fileName + " into database");
//                 }
//
//             }
//             else {
//                 console.log("File already exists in database");
//             }
//         }, data.fileName, dirpath);
//
//         callback(null, response);
//
//         /*data.map((file)=>{
//
//             console.log(file.path);
//             // console.log(file.bytedata);
//             console.log(file.filename);
//             console.log(file.mtime);
//             console.log(file.size);
//             console.log(file.path);
//             console.log(file.username);
//
//             let dirpath = "./dropboxstorage/" + file.username + "/" + file.path;
//             console.log("IMP");
//             st.doesExist(function (err, result) {
//                 console.log("Does Exist: " + result);
//                 if (!result) {
//                     if (st.insertIntoStorage(function (err, result) {
//                             if (err) {
//                                 console.log(err);
//                                 throw err;
//                             }
//                             if (result) {
//                                 console.log("File added in file system as well as database");
//
//                             }
//                             else {
//                                 console.log("Failed to add file into database");
//                             }
//                         }, file.filename, dirpath, "f", file.username, file.size, file.bytedata)) {
//                         console.log("Successfully added " + file.filename + " into database");
//                     }
//                     else {
//                         console.log("Failed to add " + file.filename + " into database");
//                     }
//                 }
//                 else {
//                     console.log("File already exists in database");
//                 }
//             }, file.filename, dirpath);
//
//         });*/
//
//         // console.log(JSON.stringify(data));
//         // console.log(data.request);
//         // upload(data, null, function (err) {
//         //     // console.log(req.body);
//         //     if (err) {
//         //         response.status = 301;
//         //         response.message = "Error while uploading files : " + err;
//         //         throw err;
//         //     } else {
//         //         console.log("File Successfully Uploaded");
//         //         response.status = 201;
//         //         response.message = "File Successfully Uploaded";
//         //         callback(null, response);
//         //     }
//         // });
//
//     }
//     catch (e){
//         console.log(e);
//         callback(e, response);
//     }
// });

exports.handle1 = handle1;