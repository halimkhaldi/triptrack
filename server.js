var express = require('express');
var app = express();
var db = require('./models/index.js');
var bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cookieParser = require('cookie-parser'),
    path = require('path'),//to extract extension
    multer = require('multer'); //multi-datatype parser




var ssn,
    cookies;
var User = db.User;
// session
app.use(session({
  secret: 'wdi_trip_log',
  resave: false,
  saveUninitialized: false
}));
// cookieParser
app.use(cookieParser());
// passport config
app.use(passport.initialize());
app.use(passport.session());

  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

// Configure app
app.set('views', __dirname + '/views');      // Views directory
app.use(express.static('public'));          // Static directory
app.use(bodyParser.urlencoded({ extended: true })); // req.body

// change engine
app.set("view engine", "ejs");
// methode overider
// app.use(methodOverride("_method"));
// Set CORS Headers
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  //storage, where we will keep out data
  const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage: storage,
    limits:{fileSize: 5*1024*1024},
  });//limits file size to uploads
  var uploads=upload.single('myImage');//this allows only one file 'myImage'
//basic root route
app.get('/',function(req,res){
  if(req.user){
    res.redirect('/home')
  }else{

res.render('login.ejs');
}
});
app.post('/signup',function(req,res){

  User.register(new User({username:req.body.username,first_name:req.body.first_name,last_name:req.body.last_name})
  ,req.body.password,function(err,newUser){
    if(err){
      res.status(400).json({'message':err});
      throw err;
    }else{

    passport.authenticate('local')(req, res, function(err1,ok) {
  if(err1){
  res.status(400).json({'message':err1.message});
}
  else{
    ssn = req.session;
    ssn.lat = req.body.lat;
    ssn.lng = req.body.lng;
    res.cookie('lat',ssn.lat);
    res.cookie('lng',ssn.lng);
    res.status(200).json('ok');
}
  });

}
});


});

app.get('/home',function(req,res){

  if(req.user){
  res.render("home", {user:req.user,ssn:ssn });
}else{
  res.redirect('/');
}

});
app.post('/login', passport.authenticate('local'),function (req,res) {
if(!req.user){
  res.status(400);
}else{
  ssn = req.session;
  ssn.lat = req.body.lat;
  ssn.lng = req.body.lng;
  res.cookie('lat',ssn.lat);
  res.cookie('lng',ssn.lng);
  res.status(200).json('ok');
}
});

app.get('/trip', function (req, res) {
  if(!req.user) {
    res.redirect('/');
  } else {
    res.render('trip');
  }
});
app.post('/trip',function(req,res,err){
  uploads(req,res,function(err){

if (err) {
    console.log('this is an error'+ err);

}else {
  console.log(req.file.filename);
  console.log('whats up');
}

  });


});



app.get('/logout', function (req, res) {
  console.log("BEFORE logout", JSON.stringify(req.user));
  req.logout();
  req.session.destroy();
  console.log("AFTER logout", JSON.stringify(req.user));
  res.redirect('/');
});

app.listen(process.env.PORT || 3000,function(err){

  if(err){
throw err
}
else{
  console.log('server running');
}
});
