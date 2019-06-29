const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

module.exports = mongoose;