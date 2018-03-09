var express = require('express')
var app = express()
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').load()
var exphbs = require('express-handlebars')
 
var PORT = process.env.PORT || 3000;
 
//For BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
 
 
// For Passport
app.use(session({
    secret: 'bodhi the dog',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
 
 
//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs',
}));
app.set('view engine', '.hbs');
 
 
 
app.get('/', function(req, res) {
 
    res.send('home');
 
});
 
//Models
var db = require("./app/models");
 
//Routes
 
var authRoute = require('./app/routes/auth.js')(app,passport);
 
 
//load passport strategies
require('./app/config/passport/passport.js')(passport, db.user);
 
 
//Sync Database
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});