let assert = require('assert');
let request = require('request');
let login = require('../routes/login');
let http = require("http");

describe('Testing Server side of Dropbox', function() {

    it('should return the login if the url is correct', function(done) {
        http.get('http://localhost:3001/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should not return the home page if the url is wrong', function(done) {
        http.get('http://localhost:3001/abc', function(res) {
            assert.equal(404, res.statusCode);
            done();
        })
    });

    it('should login', function(done) {
        request.post('http://localhost:3001/login/doLogin', {
            form : {
                username : 'varun@yahoo.com',
                password : '12345',
                credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('should not login as incorrect username or password sent', function(done) {
        request.post('http://localhost:3001/login/doLogin', {
            form : {
                username : 'varun@yahoo.com',
                password : '1235',
                credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(301, response.statusCode);
            done();
        });
    });

    // it('should signup', function(done) {
    //     request.post('http://localhost:3001/signup/doSignUp', {
    //         form : {
    //             firstname: "test",
    //             lastname: "test",
    //             username : 'mocha2@yahoo.com',
    //             password : 'mocha',
    //             // credentials: true
    //         }
    //     }, function(error, response, body) {
    //         console.log(response.statusCode);
    //         assert.equal(201, response.statusCode);
    //         done();
    //     });
    // });

    it('should not signup as user already exists', function(done) {
        request.post('http://localhost:3001/signup/doSignUp', {
            form : {
                firstname: "test",
                lastname: "test",
                username : 'mocha1@yahoo.com',
                password : 'mocha',
                // credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(301, response.statusCode);
            done();
        });
    });

    it('should receive session does not exist status', function(done) {
        request.get('http://localhost:3001/login/getSession', {
            // form : {
            //     firstname: "test",
            //     lastname: "test",
            //     username : 'mocha1@yahoo.com',
            //     password : 'mocha',
            //     // credentials: true
            // }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(203, response.statusCode);
            done();
        });
    });

    it('session exists after logging in', function(done) {
        request.post('http://localhost:3001/login/doLogin', {
            form : {
                username : 'varun@yahoo.com',
                password : '12345',
                credentials: true
            }
        }, function(error, response, body) {
            if(response.statusCode===201){
                request.get('http://localhost:3001/login/getSession', {
                    credentials:true
                }, function(error, res, body) {
                    console.log("session status:"+res.statusCode);
                    assert.equal(201, res.statusCode);
                    done();
                });
            }
            else {
                console.log("failed");
                assert.fail("Failed to login");
                done();
            }

        });
    });

    it('fetches directory data of the logged in user', function(done) {
        request.post('http://localhost:3001/login/doLogin', {
            form : {
                username : 'varun@yahoo.com',
                password : '12345',
                credentials: true
            }
        }, function(error, response, body) {
            console.log(response.cookie);
            console.log(response.cookies);
            console.log(response.cookieName);
            if(response.statusCode===201){
                request.post('http://localhost:3001/users/getDirData', {
                    form : {
                        path : '',
                    },
                    credentials: true
                }, function(error, response, body) {
                    console.log(response.statusCode);
                    assert.equal(201, response.statusCode);
                    done();
                });
            }
            else {
                assert.fail("Failed to login");
                done();
            }
        });
    });
});