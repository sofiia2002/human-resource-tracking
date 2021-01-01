const database = require('../services/database.js');
const serverConfig = require('../config/server.js');

async function get(req, res, next){
    try{
        const result = await database.simpleExecute('select user, systimestamp from dual');
        const user = result.rows[0].USER;
        const date = result.rows[0].SYSTIMESTAMP;
        res.status(200).send(`<h1>API Running on the port ${serverConfig.port}</h1><h5>DB user: ${user} <br> Date: ${date}</h5>`);
    } catch (err) {
        next(err);
    }
}

module.exports.get = get;