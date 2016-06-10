var express=require('express');
var http = require('http');
var app=express();
var port=process.env.PORT || 3000;

//var cookieParser=require('cookie-parser');
var session=require('express-session');
var bodyParser=require('body-parser');
var morgan=require('morgan');
var mongoose=require('mongoose');
var mongodb=require('mongodb');

var passport = require('passport');
var passportLocal = require('passport-local');
var flash    = require('connect-flash');
var MongoStore=require('connect-mongo')(session);


var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

require('./config/passport.js')(passport);

app.use(morgan('dev'));
//app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');

app.use(session({secret:'anystringoftext',
                saveUninitialized:true,
                resave:false
                }));


app.use(passport.initialize());
app.use(passport.initialize());  

app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app,passport);




require('./app/routes.js')(app, passport);

app.listen(3000);
console.log('Server running on localhost: port ' + port);


