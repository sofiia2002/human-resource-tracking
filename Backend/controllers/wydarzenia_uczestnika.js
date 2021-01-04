const wydarzenia_uczestnika = require('../db_apis/wydarzenia_uczestnika.js');

async function get(req, res, next){
    try{
        const context = {};
        context.id = parseInt(req.params.id, 10);
        const rows = await wydarzenia_uczestnika.find(context);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
}

module.exports.get = get;