const warsztaty = require('../db_apis/warsztaty.js');

async function get(req, res, next){
    try{
        const context = {};
        context.id = parseInt(req.query.id, 10);
        context.dom_kultury = parseInt(req.query.dom_kultury, 10);
        const rows = await warsztaty.find(context);
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


function getWarsztatFromRec(req) {
    const warsztat = {
      temat: req.body.temat,
      imie_wykladowcy: req.body.imie_wykladowcy,
      nazwisko_wykladowcy: req.body.nazwisko_wykladowcy,
      email: req.body.email,
      telefon: req.body.telefon,
      data: req.body.data,
      czas_trwania: req.body.czas_trwania,
      id_domu_kultury: req.body.id_domu_kultury,
      id_sali: req.body.id_sali,
    };
  
    return warsztat;
}
  
async function post(req, res, next) {
    try {
      let warsztat = getWarsztatFromRec(req);
      if (
        warsztat.email &&
        warsztat.telefon &&
        warsztat.imie_wykladowcy &&
        warsztat.nazwisko_wykladowcy &&
        warsztat.temat &&
        warsztat.data &&
        warsztat.czas_trwania &&
        warsztat.id_domu_kultury &&
        warsztat.id_sali
      ) {
        const warsztat_id = await warsztaty.create(warsztat);
        res.status(201).end();
      } else {
          res.status(400).end();
      }
    } catch (err) {
      next(err);
    }
}

async function put(req, res, next) {
    try {
      let warsztat = getWarsztatFromRec(req);
   
      warsztat.id_wydarzenia = parseInt(req.query.id, 10);
   
      warsztat = await warsztaty.update(warsztat);
   
      if (warsztat !== null) {
        res.status(200).json(warsztat);
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
}
   
module.exports.put = put; 
module.exports.post = post;
module.exports.get = get;