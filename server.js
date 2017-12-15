var pg = require('pg');
var Sequelize=require ('sequelize');
var app  = require('express')();// Express App include
var path = require('path');
var http = require('http').Server(app); // http server
var env = app.get('env') == 'development' ? 'dev' : app.get('env');
pg.defaults.ssl = process.env.DATABASE_URL != undefined;
var port = process.env.PORT || 4000;
var bodyParser = require("body-parser");// Body parser for fetch posted data
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); // Body parser use JSON data
app.use(cookieParser());
app.use(session({
    secret: 'Hard work',
    resave: true,
    saveUninitialized: true
}));  
var express = require('express');
var router = express.Router();


var sequelize = new Sequelize('postgres', 'postgres', 'Divya@1708', {
    host: 'localhost',
    port: 5434,
    dialect: 'postgres',
//     dialectOptions:{
//     ssl:true
// }
    // DATABASE_URL:'postgres://fnykiielutjcbx:25236de90eda0295f5f26480a2a5686ce817d6bc8f7b3e88ac0c9809367a42cd@ec2-54-235-90-107.compute-1.amazonaws.com:5432/ddoekvsmvbt4bm'
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user_profiles === req.body.email && req.session.pwd === req.body.pwd)
    return next();
  else
    return res.sendStatus(401);
};


// });
  app.get('/Get',function(req,res){
    
   var data = {
        "Data":""
    };
     sequelize.query("SELECT * FROM user_profiles", { type: sequelize.QueryTypes.SELECT})
  .then(function(user_profiles,err,rows,fields) {
    // We don't need spread here, since only the results will be returned for select queries
    //if(rows.length!=0){
    if(user_profiles){
    
           data["Data"] = user_profiles;
            // data["Data"] = rows;
            res.json({"err" : false, "message" : "success",data});
           // res.json(data);
        }
  });
});

app.post('/Post',function(req,res){
 console.log('Hi');
  console.log(req.body);

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var pwd = req.body.pwd;
    var confirmpwd = req.body.confirmpwd;
    var email =req.body.email;
    var phone =req.body.phone;

    var data = {
        "Data":""
    };
   
   //if(!!firstname && !!lastname && !!pwd && !!confirmPwd)
  if(!!firstname && !!lastname && !!pwd && !!confirmpwd && !!email && !!phone) 
    {
//sequelize.query("INSERT INTO user_profiles(firstname,lastname,pwd,confirmPwd) VALUES('" + firstname+ "','" + lastname+ "','" + pwd + "','" + confirmPwd+ "')",[firstname,lastname,pwd,confirmPwd],{type: sequelize.QueryTypes.INSERT}).then(function(user_profiles,err) {
  sequelize.query("INSERT INTO user_profiles (firstname,lastname,pwd,confirmpwd,email,phone) VALUES('" + firstname+ "','" + lastname+ "','" + pwd + "','" + confirmpwd+ "','" + email+ "','" + phone+ "')",[firstname,lastname,pwd,confirmpwd,email,phone],{type: sequelize.QueryTypes.INSERT}).then(function(user_profiles,err) {
    
 if(!!err){ 
 // if(!!err){
                data.Data = "Error Adding data";
            }else{
                //data["Data"] = 0;
                data["Data"] = "Bird Added Successfully";
            }
            res.json(data);
        });
   }
    else{
        data["Data"] = "Please provide all required data of bird";
        //res.json(404).data);
res.status(400).json(data);
    }
});
  // app.use('/api', router);
   app.listen(port);
console.log('Magic happens on port ' + port);
