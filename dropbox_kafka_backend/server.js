var connection =  new require('./kafka/Connection');
var login = require('./services/login');
let singup = require('./services/signup');
let createdir = require('./services/createdirectory');
let retrieveDirData = require('./services/retrievedirectorydata');
let retrieveStarredData = require('./services/retrievestarreddata');
let uploadFiles = require('./services/fileupload');
let downloadfile = require('./services/downloadfile');
let starred = require('./services/changestarredstatus');
let sharedata = require('./services/sharedata');
let sharedbyuser = require('./services/retrievedatasharedbyuser');
let sharedwithuser = require('./services/retrievedatasharedwithuser');
let navigateinshareddata = require('./services/navigateinshareddata');
let getprofiledata = require('./services/getprofile');
let updateprofile = require('./services/updateuserprofile');
let activity = require('./services/activity');
let deletecontent = require('./services/deletecontent');
let creatgroup = require('./services/creategroup');
let fetchgroups = require('./services/fetchgroups');
let creatediringroup = require('./services/createdirectoryingroup');
let retrievegroupdata = require('./services/retrievegroupdata');
let fileuploadingroup = require('./services/fileuploadingroup');
let addmembersingroup = require('./services/addmembersingroup');
let getgroupmembers = require('./services/retrievegroupmembers');
let getusergroupaccess = require('./services/fetchusergroupaccess');
// var consumer = connection.getConsumer();
let loginConsumer = connection.getConsumerObj("login_topic");
let signupConsumer = connection.getConsumerObj("signup_topic");
let createdirConsumer = connection.getConsumerObj("createdirectory_topic");
let uploadConsumer = connection.getConsumerObj("upload_topic");
let retrievedirectoryConsumer = connection.getConsumerObj("retrievedirectory_topic");
let downloadConsumer = connection.getConsumerObj("download_topic");
let changestarredstatusConsumer = connection.getConsumerObj("changestarredstatus_topic");
let retrievestarreddataConsumer= connection.getConsumerObj("retrievestarreddata_topic");
let sharedataConsumer = connection.getConsumerObj("share_topic");
let datasharedbyuserConsumer = connection.getConsumerObj("sharedbyuser_topic");
let datasharedwithuserConsumer = connection.getConsumerObj("sharedwithuser_topic");
let navigateinshareddConsumer = connection.getConsumerObj("navigateinshareddata_topic");
let getprofileConsumer = connection.getConsumerObj("getprofile_topic");
let updateprofileConsumer = connection.getConsumerObj("updateprofile_topic");
let activityConsumer = connection.getConsumerObj("activity_topic");
let deleteConsumer = connection.getConsumerObj("delete_topic");
let createGroupConsumer = connection.getConsumerObj("creategroup_topic");
let fetchGroupsConsumer = connection.getConsumerObj("fetchgroups_topic");
let creatediringroupConsumer = connection.getConsumerObj("creatediringroup_topic");
let retrievegroupdataConsumer = connection.getConsumerObj("retrievegroupdata_topic");
let uploadfileingroupConsumer = connection.getConsumerObj("uploadingroup_topic");
let addmembersingroupConsumer = connection.getConsumerObj("addmembersingroup_topic");
let getgroupmembersConsumer = connection.getConsumerObj("retrievegroupmembers_topic");
let getusergroupaccessConsumer = connection.getConsumerObj("fetchusergroupaccess_topic");



let producer = connection.getProducer();

try {
    uploadConsumer.on('message', function (message) {
        if (message.topic === "upload_topic") {
            console.log('message received');
            console.log(message);
            console.log(message.value);
            console.log(JSON.stringify(message.value));
            var data = JSON.parse(message.value);

            console.log(data.replyTo);

            uploadFiles.handle1(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: "response_topic",
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
            });
        }
    });

    signupConsumer.on('message', function (message) {
        if (message.topic === "signup_topic") {
            console.log('message received');
            console.log(message);
            console.log(message.value);
            console.log(JSON.stringify(message.value));
            var data = JSON.parse(message.value);

            console.log(data.replyTo);

            singup.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
                // return;
            });
        }
    });

    loginConsumer.on('message', function (message) {
        if (message.topic === "login_topic") {
            console.log('message received');
            console.log(message);
            console.log(message.value);
            console.log(JSON.stringify(message.value));
            var data = JSON.parse(message.value);

            console.log(data.replyTo);

            login.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
                // return;
            });
        }
    });

    createdirConsumer.on('message', function (message) {
        if (message.topic === "createdirectory_topic") {
            console.log('message received');
            console.log(message);
            console.log(message.value);
            console.log(JSON.stringify(message.value));
            var data = JSON.parse(message.value);

            console.log(data.replyTo);

            createdir.handle5(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
            });
        }
    });

    retrievedirectoryConsumer.on('message', function (message) {
        if (message.topic === "retrievedirectory_topic") {
            console.log('message received');
            console.log(message);
            console.log(message.value);
            console.log(JSON.stringify(message.value));
            var data = JSON.parse(message.value);

            console.log(data.replyTo);

            retrieveDirData.handle3(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
            });
        }
    });

    downloadConsumer.on('message', function (message) {
        if (message.topic === "download_topic") {
            console.log('message received');
            console.log(message);
            console.log(message.value);
            console.log(JSON.stringify(message.value));
            var data = JSON.parse(message.value);

            console.log(data.replyTo);

            downloadfile.handle(data.data, function (err, res) {

                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
            });
        }
    });

    changestarredstatusConsumer.on('message', function (message) {
        console.log('message received');


        if (message.topic === "changestarredstatus_topic") {
            console.log(message);
            console.log(message.value);
            console.log(JSON.stringify(message.value));
            var data = JSON.parse(message.value);

            console.log(data.replyTo);
            starred.handle4(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
            });
        }
    });

    retrievestarreddataConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);

        if (message.topic === "retrievestarreddata_topic") {
            retrieveStarredData.handle2(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
            });
        }
    });

    sharedataConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);

        if (message.topic === "share_topic") {
            sharedata.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
            });
        }
    });


    datasharedbyuserConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);

        if (message.topic === "sharedbyuser_topic") {
            sharedbyuser.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    // console.log(data);
                    console.log(payloads);
                });
            });
        }
    });

    datasharedwithuserConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);

        if (message.topic === "sharedwithuser_topic") {
            sharedwithuser.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    navigateinshareddConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "navigateinshareddata_topic") {
            navigateinshareddata.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    updateprofileConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "updateprofile_topic") {
            updateprofile.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    getprofileConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "getprofile_topic") {
            getprofiledata.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    activityConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "activity_topic") {
            activity.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    deleteConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "delete_topic") {
            deletecontent.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    createGroupConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "creategroup_topic") {
            creatgroup.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    fetchGroupsConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "fetchgroups_topic") {
            fetchgroups.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    creatediringroupConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "creatediringroup_topic") {
            creatediringroup.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    retrievegroupdataConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "retrievegroupdata_topic") {
            retrievegroupdata.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    uploadfileingroupConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "uploadingroup_topic") {
            fileuploadingroup.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    addmembersingroupConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "addmembersingroup_topic") {
            addmembersingroup.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    getgroupmembersConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "retrievegroupmembers_topic") {
            getgroupmembers.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });

    getusergroupaccessConsumer.on('message', function (message) {
        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data.replyTo);
        if (message.topic === "fetchusergroupaccess_topic") {
            getusergroupaccess.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(payloads);
                });
            });
        }
    });
}
catch (e){
    console.log(e)
}


/*
consumer.on('message', function (message) {

    try {

        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data);
        console.log(data.replyTo);

        if (message.topic === "upload_topic") {
            uploadFiles.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: "response_topic",
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                    console.log(payloads);
                });
            });
        }
        if (message.topic === "signup_topic") {
            singup.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                    console.log(payloads);
                });
                // return;
            });
        }
        if (message.topic === "login_topic") {
            login.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                    console.log(payloads);
                });
                // return;
            });
        }
        if (message.topic === "createdirectory_topic") {
            createdir.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                    console.log(payloads);
                });
            });
        }
        if (message.topic === "retrievedirectory_topic") {
            console.log("getDirData");
            retrieveDirData.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                    console.log(payloads);
                });
            });
        }
        if (message.topic === "download_topic"){
            downloadfile.handle_request(data.data, function (err, res) {
                console.log('after handle' + res);
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                    console.log(payloads);
                });
            });
        }
    }
    catch (e)
    {
        console.log(e);
    }
});*/
