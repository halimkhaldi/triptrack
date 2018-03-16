var mongoose = require('mongoose');
/*add you connection somewhere here*/
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/trip', {promiseLibrary: global.Promise});

