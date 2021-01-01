const organizacja_wydarzen = require('../db_apis/organizacja_wydarzen.js');

async function get(req, res, next){
    try{
        const context = {};
        context.pracownik = parseInt(req.query.pracownik, 10);
        context.wydarzenie = parseInt(req.query.wydarzenie, 10);
        const rows = await organizacja_wydarzen.find(context);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
}

module.exports.get = get;