var connection =  new require('./kafka/Connection');
var login = require('./services/login');
let singup = require('./services/signup');
let createdir = require('./services/createdirectory');
let retrieveDirData = require('./services/retrievedirectorydata');
let uploadFiles = require('./services/fileupload');
let downloadfile = require('./services/downloadfile');
var topic_name = 'login_topic';
var consumer = connection.getConsumer();
var producer = connection.getProducer();

console.log('server is running');

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
});