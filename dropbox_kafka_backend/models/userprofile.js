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
        default: ""
    },
    work: {
        type: String,
        default: ""
    },
    education: {
        type: String,
        default: ""
    },
    contactinfo: {
        type: String,
        default: ""
    },
    lifeevents: {
        type: String,
        default: ""
    },
    music: {
        type: Boolean,
        default: true
    }
    ,
    sports: {
        type: Boolean,
        default: true
    }
    ,
    reading: {
        type: Boolean,
        default: true
    }
});

let UserProfile = mongoose.model('userprofile', userProfileSchema);

// make this available to our Node applications
module.exports = UserProfile;