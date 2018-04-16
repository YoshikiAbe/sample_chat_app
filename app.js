"use strict";

var http = require('http');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Message = require('./schema/Message');
var bodyparser = require('body-parser');

var app = express();

mongoose.connect('mongodb://localhost:1111/chatapp', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("successfully connected to MongoDB");
  }
});

app.use(bodyparser());

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');

app.get("/", function(req, res, next) {
  Message.find({}, function(err, msgs) {
    if(err) throw err;
    return res.render('index', {messages: msgs});
  });
});

app.get("/update", function(req, res, next) {
  return res.render('update');
});

app.post("/update", function(req, res, next) {
  console.dir(req.body)
  var newMessage = new Message({
    username: req.body.username,
    message: req.body.message
  });
  newMessage.save((err) => {
    if(err) throw err;
    return res.redirect("/");
  });
});

var server = http.createServer(app);
server.listen('3000');