const express = require('express');
const app = express();
const winston = require('winston');
const config = require('config');


require('./Startup/logging')();
require('./Startup/routes')(app);
require('./Startup/db')();
require('./Startup/config')();
require('./Startup/validation')();
require('./Startup/production')(app);


// const port = process.env.PORT || 3900;
const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
    winston.info(`Listeing on port ${port}...`)
);

module.exports = server;