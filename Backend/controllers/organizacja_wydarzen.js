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

function getOrganizatorFromRec(req) {
    const organizacja_wydarzenia = {
      id_wydarzenia: req.body.id_wydarzenia,
      id_pracownika: req.body.id_pracownika
    };
  
    return organizacja_wydarzenia;
  }

async function post(req, res, next){
    try {
        let organizacja_wydarzenia = getOrganizatorFromRec(req);
        if (
          organizacja_wydarzenia.id_pracownika &&
          organizacja_wydarzenia.id_wydarzenia
        ) {
          const organizacja = await organizacja_wydarzen.create(organizacja_wydarzenia);
          res.status(201).end();
        } else {
            res.status(400).end();
        }
      } catch (err) {
        next(err);
      }
}

async function del(req, res, next){
    try{
        const context = {};
        context.pracownik = parseInt(req.query.pracownik, 10);
        context.wydarzenie = parseInt(req.query.wydarzenie, 10);
        const rows = await organizacja_wydarzen.delete(context);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
}

module.exports.delete = del;
module.exports.post = post;
module.exports.get = get;