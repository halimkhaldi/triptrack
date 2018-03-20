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
var Activity=db.Activity;
var Post=db.Post
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
  Trip.findOne({user_id:req.user._id,date_end:null},function(err,found){
    if(found){
  ssn.trip=found;
}
  });

  ssn.lat = req.body.lat;
  ssn.lng = req.body.lng;
  res.cookie('lat',ssn.lat);
  res.cookie('lng',ssn.lng);
  res.status(200).json('ok');
}
});

app.get('/user', function(req, res) {
  var trips=[];
  if(!req.user) {
    res.redirect('/');
  } else {
    Trip.find({user_id:req.user._id},function(err,all){
    res.render('profile',{user:req.user,trips:all});
    });

  }
});

// app.get('/users/:id', function(req, res) {
//   db.User.findOne({_id: req.params.id}, function(err, user) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.status(200).json(user);
//     }
//   })
// });

app.get('/trip', function (req, res) {
  if(!req.user) {
    res.redirect('/');
  } else {
    res.render('trip',{ssn:ssn});
  }
});
app.post('/trip',function(req,res){
  if(req.user && !ssn.trip ){
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
    name:req.body.name,
    description:req.body.description,
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

}else{
  res.redirect('/');
}
});
app.post('/trip/post',function(req,res){
  if(req.user && ssn.trip ){

  uploads(req,res,function(err){

  if (err) {
    console.log('this is an error'+ err);
    res.status(400).json({message:err});

  }else {
    console.log('bbbbb');
    Activity.findOne({place_id:req.body.place_id},function(err,found){

      if(!found){

        Activity.create({
          place_id:req.body.place_id,
          lat:req.body.lat,
          lng:req.body.lng,
          street:req.body.street,
          city:req.body.city,
          state:req.body.state,
          zip_code:req.body.zip_code,
          name:req.body.place_name

        },function(err1,created){
          if(created){
            var images=[];
            let files = req.files;
            files.forEach(function(val){
          myBucket.upload(val.path, { public: true });
          images.push(`https://storage.googleapis.com/${BUCKET_NAME}/${val.filename}`);
          });
          Post.create({
            user_id:req.user,
            location_id:created,
            title:req.body.name,
            description:req.body.description,
            images:images,
            trip_id:ssn.trip
          },function(err2,posted){
            if(posted){
              res.status(200).json('ok')
            }
            else{
              res.status(400).json(err2);

            }
          });

          }
        });
      }else{
        var images=[];
        let files = req.files;
        files.forEach(function(val){
      myBucket.upload(val.path, { public: true });
      images.push(`https://storage.googleapis.com/${BUCKET_NAME}/${val.filename}`);
      });
      Post.create({
        user_id:req.user,
        location_id:found,
        title:req.body.name,
        description:req.body.description,
        images:images,
        trip_id:ssn.trip
      },function(err2,posted){
        if(posted){
          res.status(200).json('ok')
        }
        else{
          res.status(400).json(err2);

        }
      });



      }
    });

  }
});
}
});

app.put('/trip',function(req,res){
  if(req.user && ssn.trip ){
  uploads(req,res,function(err){
    console.log(req.body);
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
  Trip.findOne({_id:ssn.trip},function(err,trip){
  trip.description_end=req.body.description;
  trip.lat_end=req.body.lat;
  trip.lng_end=req.body.lng;
  trip.image_end=images;
  trip.date_end=Date();
  trip.save(function(err,saved){
    if(saved){
      ssn.trip=null;
    res.status(200).json('okay');
    }
    else{
      res.status(400);
    }
  });
});
  }
});
}

});
app.get('/search', function (req, res) {
  if(!req.user) {
    res.redirect('/');
  } else {
    res.render('search');
  }
});
app.post('/search',function(req,res){
  console.log('here');
  console.log(req);
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
