var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoURL = "mongodb://localhost:27017/dropbox";
mongoose.connect(mongoURL);

// create a schema
let userSchema = new Schema({

    _id: {
      type: String,
      require:true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        required: true
    },
    hashpassword: {
        type: String,
        required: true
    }
});

let User = mongoose.model('Users', userSchema);

// make this available to our Node applications
module.exports = User;