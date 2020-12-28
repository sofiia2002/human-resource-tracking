const http = require('http');
const express = require('express');
const morgan = require('morgan');
const serverConfig = require('../config/server.js');
let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);
        app.use(morgan('combined'));
        app.get('/', (req, res) => {
            res.end('Hello World!');
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
async function shutdown(e) {
    let err = e;
    console.log('Shutting down');
    try {
        console.log('Closing web server module');
        await webServer.close();
    } catch (e) {
        console.log('Encountered error', e);
        err = err || e;
    }
    console.log('Exiting process');
    if (err) {
        process.exit(1); // Non-zero failure code
    } else {
        process.exit(0);
    }
}
process.on('SIGTERM', () => {
    console.log('Received SIGTERM');
    shutdown();
});
process.on('SIGINT', () => {
    console.log('Received SIGINT');
    shutdown();
});
process.on('uncaughtException', err => {
    console.log('Uncaught exception');
    console.error(err);
    shutdown(err);
});

module.exports.close = close;
module.exports.initialize = initialize;