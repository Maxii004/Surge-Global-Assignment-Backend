const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const user = require('../Routes/userRoutes');
const userAuthentication = require('../Routes/userAuthentications');

const error = require('../Middleware/error');

module.exports = function(app){
    app.use(express.json());
    app.use('/api/user', cors(), user);
    app.use('/api/user/login', cors(), userAuthentication);
    app.use(error);
}