const http = require('http');
const express = require('express');
const morgan = require('morgan');
const serverConfig = require('../config/server.js');
const router = require('./router.js');
let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
        app.use(express.json({
            reviver: reviveJson
        }));
        httpServer = http.createServer(app);
        app.use(morgan('combined'));
        app.use('/api', router);
        httpServer.listen(serverConfig.port).on('listening', () => {
            console.log(`Web server listening on localhost:${serverConfig.port}`);
            resolve();
        }).on('error', err => {
            reject(err);
        });
    });
}

function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
 
function reviveJson(key, value) {
  if (typeof value === 'string' && iso8601RegExp.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
}

module.exports.close = close;
module.exports.initialize = initialize;

