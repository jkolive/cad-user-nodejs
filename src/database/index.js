const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser: true , useFindAndModify: false });
mongoose.set('useCreateIndex', true);


module.exports = mongoose;