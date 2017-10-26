var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoURL = "mongodb://localhost:27017/dropbox";
mongoose.connect(mongoURL);

// create a schema
let userProfileSchema = new Schema({

    _id: {
      type: String,
      require:true
    },
    overview: {
        type: String,
        required: true
    },
    work: {
        type: String,
        require: true
    },
    education: {
        type: String,
        required: true
    },
    contactinfo: {
        type: String,
        required: true
    },
    lifeevents: {
        type: String,
        required: true
    },
    music: {
        type: Boolean,
        required: true
    }
    ,
    sports: {
        type: Boolean,
        required: true
    }
    ,
    reading: {
        type: Boolean,
        required: true
    }
});

let UserProfile = mongoose.model('Users', userProfileSchema);

// make this available to our Node applications
module.exports = UserProfile;