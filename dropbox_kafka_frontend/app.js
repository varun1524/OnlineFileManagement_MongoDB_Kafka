var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var cors = require('cors');
require('./routes/passport')(passport);

var index = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
var group = require('./routes/group');

var mongoSessionURL = "mongodb://localhost:27017/dropbox";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '5mb'}));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false },{limit: '5mb'}));
// app.use(bodyParser.raw({limit: '5mb'}) );
app.use( bodyParser.text({
    type : 'application/json',
    limit: '5mb'
}) );
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSessions({
    secret: "session",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());

app.use('/', index);
app.use('/users', users);
app.use('/signup', signup);
app.use('/group', group);


app.post('/login/doLogout', function(req,res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(201).send();
});

app.post('/login/doLogin', function(req, res) {
    passport.authenticate('login', function(err, response) {
        if(err) {
            console.log(err);
            res.status(401).send();
        }
        if(response.status===201) {
            req.session.username = response.username;
            console.log(req.session.username);
            console.log("session initilized");
            return res.status(response.status).send(req.session);
        }
        else if(response.status===301){
            res.status(301).send({"message":response.message});
        }
        else {
            res.status(401).send({"message":"Login Failed"});
        }
    })(req, res);
});

app.get('/login/getSession', function(req, res) {
    try {
        console.log(req.session.username);
        if(req.session.username!==undefined) {
            res.status(201).send(req.session);
        }
        else {
            res.status(203).send({"message":"Session Expired. Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(401).json({message: "Error while getting Session"});
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
