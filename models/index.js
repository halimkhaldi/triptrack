var mongoose = require('mongoose');
/*add you connection somewhere here*/
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/trip', {promiseLibrary: global.Promise});

/* adding model User to index.js */
module.exports.User = require('./User');
/* adding model Okay to index.js */
module.exports.Okay = require('./Okay');
