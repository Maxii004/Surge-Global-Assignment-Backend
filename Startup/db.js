const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){

    const databaseURL = config.get('db');
    mongoose.connect(databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => winston.info(`Connected to ${databaseURL}...`));
        
}