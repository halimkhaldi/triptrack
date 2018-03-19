var express = require('express');
var app = express();
var db = require('./models/index.js');
var bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cookieParser = require('cookie-parser'),
    path = require('path'),//to extract extension
    multer = require('multer'),
    GoogleCloudStorage = require('@google-cloud/storage') //multi-datatype parser


    var storage = GoogleCloudStorage({
      projectId: 'apt-decorator-92202',
      keyFilename: 'aaaaaaaa-ff02e62467bd.json'
    });
    var BUCKET_NAME = 'trip_track';
var myBucket = storage.bucket(BUCKET_NAME);
var ssn,
    cookies;
var User = db.User;
var Trip = db.Trip;
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
  const local = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }//myImage +now +file extension
  });
  const upload = multer({
    storage: local,
    limits:{fileSize: 15*1024*1024},
  });//limits file size to uploads
  var uploads=upload.array('myImage',5);//this allows only one file 'myImage'
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
  console.log(ssn);
}else{
  res.redirect('/');

}

});
app.post('/login', passport.authenticate('local'),function (req,res) {
if(!req.user){
  res.status(400);
}else{

  ssn = req.session;
  Trip.findOne({user_id:req.user._id},function(err,found){
    if(found){
  ssn.trip=found._id;
}
  });

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
app.post('/trip',function(req,res){

  uploads(req,res,function(err){

if (err) {
    console.log('this is an error'+ err);
    res.status(400).json({message:err});

}else {
  var images=[];
  let files = req.files;
  files.forEach(function(val){
myBucket.upload(val.path, { public: true });
images.push(`https://storage.googleapis.com/${BUCKET_NAME}/${val.filename}`);
});

  Trip.create({
    user_id:req.user,
    date_start:Date(),
    lat_start:req.body.lat,
    lng_start:req.body.lng,
    image_start:images

  },function(err1,created){
    if(err1){
      console.log(err1)
    }else{
      ssn.trip=created._id;
      ssn.lat = created.lat_start;
      ssn.lng = created.lng_start;
      res.cookie('lat',ssn.lat);
      res.cookie('lng',ssn.lng);
      res.status(200).json('ok');
      console.log(created);

    }
  });

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
