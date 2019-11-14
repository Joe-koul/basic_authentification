var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser =require('cookie-parser');

app.set('view engine', 'pug');
app.set('views','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended :true}));
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "your secret key"}));

var Users= [];

//get method
app.get('/signup',(req,res)=>{
    res.render('signup');
});

//post method
app.post('/signup',(req,res)=>{
if(!req.body.uname || !req.body.pswd){
    res.status("400");
    res.send("Invalid details!");
}else{
    Users.filter(function(user){
        if(user.uname === req.body.uname){
            res.render('signup',{
                message: "User Already exist! Login or Choose another username "
                
            });
        }
    });
    var newUser = {uname : req.body.uname,pswd: req.body.pswd};
    Users.push(newUser);
    req.session.user =newUser;
    res.redirect('/protected_page');
}
});
function checkSignIn(req,res,next){
    if(req.session.user){
        next();
    }else{
        var err = new Error("Not Logged In!")
        console.log(req.session.user);
        next(err);  //Error, trying to access unauthorized page!
     }
  }
  app.get('/protected_page', checkSignIn, function(req, res){
     res.render('protected_page', {uname: req.session.user.uname})
  });
  
  app.get('/login', function(req, res){
     res.render('login');
  });
  
  app.post('/login', function(req, res){
     console.log(Users);
     if(!req.body.uname || !req.body.pswd){
        res.render('login', {message: "Please enter both username and password"});
     } else {
        Users.filter(function(user){
           if(user.uname === req.body.uname && user.pswd === req.body.pswd){
              req.session.user = user;
              res.redirect('/protected_page');
           }
        });
        res.render('login', {message: "Invalid credentials!"});
     }
  });
  
  app.get('/logout', function(req, res){
     req.session.destroy(function(){
        console.log("user logged out.")
     });
     res.redirect('/login');
  });
  
  app.use('/protected_page', function(err, req, res, next){
  console.log(err);
     //User should be authenticated! Redirect him to log in.
     res.redirect('/login');
  });

app.listen(3000);