const http = require('http');
const express = require('express');
const morgan = require('morgan');
const serverConfig = require('../config/server.js');
const database = require('./database.js');
let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);
        app.use(morgan('combined'));
        app.get('/', async (req, res) => {
            const result = await database.simpleExecute('select user, systimestamp from dual');
            const user = result.rows[0].USER;
            const date = result.rows[0].SYSTIMESTAMP;
            res.send(`<h1>API Running on the port ${serverConfig.port}</h1><h5>DB user: ${user} <br> Date: ${date}</h5>`);
        });
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