let express = require('express');
let router = express.Router();
let kafka = require('./kafka/client');

router.get('/getUsers', function (req, res, next) {
    try {
        kafka.make_request("jmetertest_topic", null, function (err, result) {
           if(result.status===200){
               res.status(200).end();
           }
           else{
               res.status(400).end();
           }
        });
    }
    catch (e){
        console.log(e);
        res.status(400).send({"message" : e});
    }
});


module.exports = router;
