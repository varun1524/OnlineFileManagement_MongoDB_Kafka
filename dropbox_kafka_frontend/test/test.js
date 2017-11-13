let assert = require('assert');
let request = require('request');
let http = require("http");

describe('Testing Server side of Dropbox', function() {

    it('should return the login if the url is correct', function(done) {
        http.get('http://localhost:3001/', function(res) {
            console.log(res.statusCode);
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should return error if the url is incorrect', function(done) {
        http.get('http://localhost:3001/abc', function(res) {
            console.log(res.statusCode);
            assert.equal(404, res.statusCode);
            done();
        })
    });

    it('Fetches data shared with the user', function(done) {
        request.post('http://localhost:3001/users/fetchDataSharedWithUser', {
            form: {
                username: 'varun@yahoo.com',
            }
        }, function (error, response, body) {
            console.log(response.statusCode);
            console.log(body);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('Should Create A Group', function(done) {
        request.post('http://localhost:3001/group/creategroup', {
            form : {
                username : 'varun@yahoo.com',
                groupName : 'Test',
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            console.log(body);
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
            assert.equal(401, response.statusCode);
            done();
        });
    });

    it('Without login cannot fetching username from session', function(done) {
        request.get('http://localhost:3001/login/getSession', {

        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(203, response.statusCode);
            done();
        });
    });

    it('fetch groups in which user is owner or member', function(done) {
        request.post('http://localhost:3001/group/getgroups', {
            form : {
                username : 'varun@yahoo.com',
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            console.log(body);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('should not signup as user already exists', function(done) {
        request.post('http://localhost:3001/signup/doSignUp', {
            form : {
                firstname: "test",
                lastname: "test",
                username : 'mocha1@yahoo.com',
                password : 'mocha123',
                // credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(301, response.statusCode);
            done();
        });
    });

    it('Update User Profile', function(done) {
        request.post('http://localhost:3001/users/updateProfile', {
            form : {
                username:"varun@yahoo.com",
                overview: "Varun SHah",
                work: "Student",
                education: "SJSU",
                contactinfo: "3983279832",
                lifeevent: "CMPE 273",
                music:true,
                reading:true,
                sports:true
                // credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            console.log(response.body);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('signup up successfully', function(done) {
        request.post('http://localhost:3001/signup/doSignUp', {
            form : {
                firstname: "test",
                lastname: "test",
                username : 'mocha1@yahoo.com',
                password : 'mocha123',
                // credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(301, response.statusCode);
            done();
        });
    });

    it('should login as for given username and password sent', function(done) {
        request.post('http://localhost:3001/login/doLogin', {
            form : {
                username : 'varun@yahoo.com',
                password : 'ashnashah',
                credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('fetches directory data of the user', function(done) {
        request.post('http://localhost:3001/users/getDirData', {
            form : {
                path : '',
                username : 'varun@yahoo.com'
            },
            credentials: true
        }, function(error, response, body) {
            console.log(response.statusCode);
            console.log(body);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('fetches starred data of the user', function(done) {
        request.post('http://localhost:3001/users/getStarredData', {
            form : {
                // path : '',
                username : 'varun@yahoo.com'
            },
            credentials: true
        }, function(error, response, body) {
            console.log(body);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('fetches data of the user and Changes starred status of 1st received data', function(done) {
        request.post('http://localhost:3001/users/getDirData', {
            form : {
                path : '',
                username : 'varun@yahoo.com'
            }
        }, function(error, response, body) {
            let data = JSON.parse(body)[0];
            console.log(response.statusCode);
            let changestatus = false;
            console.log(data.starred);
            if(!data.starred){
                changestatus = false;
            }
            else {
                changestatus = true;
            }
            console.log(changestatus);
            if(response.statusCode===201) {
                request.post('http://localhost:3001/users/changestarredstatus', {
                    form: {
                        username: "varun@yahoo.com",
                        id:data.id,
                        changeStatusTo : changestatus
                    }
                }, function (error, response1, body1) {
                    console.log(body1);
                    assert.equal(201, response1.statusCode);
                    done();
                });
            }
            else {
                assert.fail("Could not retrieve data");
                done();
            }
        });
    });

    it('fetches latest activities of the user', function(done) {
        request.post('http://localhost:3001/users/getActivityData', {
            form : {
                username : 'varun@yahoo.com'
            },
            credentials:true
        }, function(error, response, body) {
            console.log(response.statusCode);
            console.log(body);
            assert.equal(201, response.statusCode);
            done();
        });

    });

    it('Creates Directory in root of user', function(done) {
        request.post('http://localhost:3001/users/createDir', {
            form : {
                username : 'varun@yahoo.com',
                path : "",
                directoryName : "Testing"
            },
        }, function(error, response, body) {
            console.log(response.statusCode);
            console.log(body);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('fetches directory data of the user and deletes first received data', function(done) {
        request.post('http://localhost:3001/users/getDirData', {
            form : {
                path : '',
                username : 'varun@yahoo.com'
            },
            credentials: true
        }, function(error, response, body) {
            console.log(response.statusCode);
            let data = (JSON.parse(body))[0];
            console.log(data.id);
            if(response.statusCode===201){
                request.post('http://localhost:3001/users/deleteContent', {
                    form:{
                        id:data.id,
                        username:"varun@yahoo.com"
                    }
                }, function (err, response1, body1) {
                    console.log(response1.statusCode);
                    console.log(body1);
                    assert.equal(201, response.statusCode);
                    done();
                });
            }
            else {
                assert.fail("Failed");
                done();
            }
        });
    });


});