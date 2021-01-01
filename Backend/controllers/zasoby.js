const zasoby = require('../db_apis/zasoby.js');

async function get(req, res, next){
    try{
        const context = {};
        context.id = parseInt(req.query.id, 10);
        context.kategoria = parseInt(req.query.kategoria, 10);
        const rows = await zasoby.find(context);
        if (req.query.id) {
            if (rows.length === 1){
                res.status(200).json(rows[0]);
            } else {
                res.status(404).end();
            } 
        } else {
            res.status(200).json(rows);
        }
    } catch (err) {
        next(err);
    }
}

module.exports.get = get;