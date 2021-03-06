var exports = module.exports = {}
var db = require("../models");

// ====================================
//        ROUTES TO RENDER VIEWS
// ====================================


  // user sign in/landing page
  exports.signin = function(req, res) {
      res.render('signin');
  }


  // user sign up
  exports.signup = function(req, res) {
      res.render('signup');
  }


  // renders user-specific dashboard
  exports.dashboard = function(req, res) {
    var reqUser = req.session.passport.user;
    var hbsObject = {};
    // queries db for all products
    db.Product.findAll({}).then(function(data) {
      // console.log('\n*****\n', data[0]['dataValues'].item_name)
      hbsObject.product = [];
      for (i = 0; i < data.length; i++) {
        var newProduct = {
          id: data[i]['dataValues'].id,
          name: data[i]['dataValues'].item_name,
          photoUrl: data[i]['dataValues'].photo_url
        }
        hbsObject.product.push(newProduct)
      }
      // console.log(hbsObject.product)
    });
    // queries db for all user items where userID is reqUser
    db.Useritem.findAll({
      where: {
        userId: reqUser
      }
    }).then(function(data) {
        hbsObject.useritem = [];
        for (i = 0; i < data.length; i++) {
          var newUserItem  = {
            id: data[i]['dataValues'].id,
            name: data[i]['dataValues'].name
          }
          hbsObject.useritem.push(newUserItem)
        }
    })
    // // queries db for all user items where userID is not reqUser
    db.Useritem.findAll({
      where: {
        userId: {
        $not:reqUser
        }
      }
    }).then(function(data) {
      hbsObject.communityitem = [];
        for (i = 0; i < data.length; i++) {
          var newCommunityItem  = {
            id: data[i]['dataValues'].id,
            name: data[i]['dataValues'].name,
            userId: data[i]['dataValues'].userId
          }
          hbsObject.communityitem.push(newCommunityItem)
        }
        console.log('\n**** community item\n', hbsObject.communityitem)
      res.render('dashboard', hbsObject)
    })
  }


  // renders forum page
  exports.forum = function(req, res) {
    var reqUser = req.session.passport.user;
    var hbsObject = {}
    db.Post.findAll({}).then(function(data){
      hbsObject.post = [];
      for(i = 0; i < data.length; i++) {
        var newPost = {
          postTitle: data[i]['dataValues'].title,
          postBody: data[i]['dataValues'].body
        }
        hbsObject.post.push(newPost)
      }
      res.render('forum', hbsObject);
    })
  }


  // ends the user's session
  exports.logout = function(req, res) {
      req.session.destroy(function(err) {
          res.redirect('/');
      });
  }


// ====================================
//            API ROUTES
// ====================================


  // adds a user item to the database
  exports.addUserItem = function(req, res) {
        var reqUser = req.session.passport.user;
        var reqProduct = req.body.product_id;
        var reqName = req.body.product_name;

        db.Useritem.create({
          ProductId: reqProduct,
          userId: reqUser,
          name: reqName
          }).then(function(data)  {
            console.log('New user item added')
          });
  }


  // removes a user item from the database
  exports.removeUserItem = function(req, res){
    var reqId = req.body.id
    db.Useritem.destroy({
      where: {
        id: reqId
      }
    }).then(function() {
      console.log('Successfully deleted entry')
    })
  }


  // creates a post in the database
  exports.createPost = function(req, res) {
    var reqUser = req.session.passport.user;
    console.log('\n**** user:',reqUser, '\n***', req.body)
    db.Post.create({
        title: req.body.userTitle,
        body: req.body.userBody,
        userId: reqUser
    }).then(function(data){
      console.log('New post added!')
    })
  }
