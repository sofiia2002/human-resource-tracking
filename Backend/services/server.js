const http = require('http');
const express = require('express');
const morgan = require('morgan');
const serverConfig = require('../config/server.js');
const router = require('./router.js');
let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
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

module.exports.close = close;
module.exports.initialize = initialize;