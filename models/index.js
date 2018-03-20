var mongoose = require('mongoose');
/*add you connection somewhere here*/
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/trip', {promiseLibrary: global.Promise});

/* adding model User to index.js */
module.exports.User = require('./User');
/* adding model Trip to index.js */
module.exports.Trip = require('./Trip');
/* adding model Activity to index.js */
module.exports.Activity = require('./Activity');
/* adding model Post to index.js */
module.exports.Post = require('./Post');
