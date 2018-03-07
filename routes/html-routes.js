// html-routes.js - this file offers a set of routes for sending users to the various html pages

// Dependencies
// =============================================================
var path = require("path");

// **********************
var express = require('express');
var authRoutes = require('./auth-routes.js');
var passportSetup = require('../config/passport-setup');

var app = express();
// **********************

// Routes
// =============================================================
module.exports = function(app) {

//set up view engine
app.set('view engine','ejs');

//set up routes
app.use('/auth',authRoutes);

//create home route
app.get('/', (req, res)=>{
	res.render('home');

});

};







