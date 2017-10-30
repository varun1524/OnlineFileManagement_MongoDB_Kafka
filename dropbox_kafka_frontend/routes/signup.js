express = require('express');
var kafka = require('./kafka/client');
var router = express.Router();

/* GET Sign Up Page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/doSignUp', function(req, res, next){
    try {
        req.body.service = "signup";
        console.log(req.body);
        kafka.make_request('login_topic',req.body, function(err,results){
            console.log('in result');
            console.log(results);
            if(err){
                console.log(err);
                throw err;
            }
            else
            {
                if(results.status === 201){
                    console.log("Received username: "+results.username);
                    console.log("Local username: "+ req.body.username);
                    res.status(201).send({"message":"Signup Successful"});
                }
                else if(results.status === 301){
                    res.status(301).send({"message":"User already Exist"});
                }
                else if(results.status === 401) {
                    res.status(401).send({"message":"Signup Failed"});
                }
            }
        });
    }
    catch (e){
        console.log(e);
        res.status(401).json({message: "Signup Failed"});
    }
});


module.exports = router;
