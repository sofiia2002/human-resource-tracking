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

function getEmployeeFromRec(req) {
    const wydarzenie = {
        id_uczestnika: req.body.id_uczestnika,
        id_wydarzenia: req.body.id_wydarzenia
    };
   
    return wydarzenie;
  }
   
async function post(req, res, next) {
    try {
      let dodaneWydarzenie = getEmployeeFromRec(req);
      dodaneWydarzenie = await wydarzenia_uczestnika.create(dodaneWydarzenie);
   
      res.status(201).json(dodaneWydarzenie);
    } catch (err) {
      next(err);
    }
}

async function del(req, res, next) {
    try {
        let wyrzuconeWydarzenie = getEmployeeFromRec(req);
        const success = await wydarzenia_uczestnika.delete(wyrzuconeWydarzenie);
   
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
}
   
module.exports.delete = del;
module.exports.post = post;
module.exports.get = get;