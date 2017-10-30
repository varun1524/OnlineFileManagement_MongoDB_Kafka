var connection =  new require('./kafka/Connection');
var login = require('./services/login');
let singup = require('./services/signup');
let createdir = require('./services/createdirectory');
let retrieveDirData = require('./services/retrieveDirectoryData');
let uploadFiles = require('./services/fileupload');

var topic_name = 'login_topic';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();

console.log('server is running');

consumer.on('message', function (message) {

    if(message.topic === "test"){
        console.log('message received');
        console.log(message);
        // console.log(JSON.parse(message.value));

        // console.log(JSON.stringify(message.value));
        // var data = JSON.parse(message.value);
        uploadFiles.handle_request(message.value, function (err, res) {
            console.log('after handle'+res);
            var payloads = [
                { topic: "response_topic",
                    messages:JSON.stringify({
                        // correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
                console.log(payloads);
            });
        });
    }
    else {


        console.log('message received');
        console.log(message);
        console.log(message.value);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        console.log(data);
        console.log(data.replyTo);
        //
        // uploadFiles.handle_request(data.data, function (err, res) {
        //     console.log('after handle'+res);
        //     var payloads = [
        //         { topic: data.replyTo,
        //             messages:JSON.stringify({
        //                 correlationId:data.correlationId,
        //                 data : {}
        //             }),
        //             partition : 0
        //         }
        //     ];
        //     producer.send(payloads, function(err, data){
        //         console.log(data);
        //         console.log(payloads);
        //     });
        // });

        switch (data.data.service) {
            case "signup":
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
                break;
            case "login":
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
                break;
            case "createdir":
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
                break;
            case "getDirData":
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
                break;
            case "uploadfiles":
                // uploadFiles.handle_request(data.data, function (err, res) {
                //     console.log('after handle'+res);
                //     var payloads = [
                //         { topic: data.replyTo,
                //             messages:JSON.stringify({
                //                 correlationId:data.correlationId,
                //                 data : res
                //             }),
                //             partition : 0
                //         }
                //     ];
                //     producer.send(payloads, function(err, data){
                //         console.log(data);
                //         console.log(payloads);
                //     });
                // });
                break;
        }
    }
});