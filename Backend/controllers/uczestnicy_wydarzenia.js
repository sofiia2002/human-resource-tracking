const uczestnicy_wydarzenia = require('../db_apis/uczestnicy_wydarzenia.js');

async function get(req, res, next){
    try{
        const context = {};
        context.id = parseInt(req.params.id, 10);
        const rows = await uczestnicy_wydarzenia.find(context);
        if (req.params.id) {
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