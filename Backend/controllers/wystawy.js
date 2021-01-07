const wystawy = require("../db_apis/wystawy.js");

async function get(req, res, next) {
  try {
    const context = {};
    context.id = parseInt(req.query.id, 10);
    context.dom_kultury = parseInt(req.query.dom_kultury, 10);
    const rows = await wystawy.find(context);
    if (req.query.id) {
      if (rows.length === 1) {
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

function getWystawaFromRec(req) {
  const wystawa = {
    typ_wystawy: req.body.typ_wystawy,
    imie_wystawiajacego: req.body.imie_wystawiajacego,
    nazwisko_wystawiajacego: req.body.nazwisko_wystawiajacego,
    temat: req.body.temat,
    opis: req.body.opis ? req.body.opis : null,
    data: req.body.data,
    czas_trwania: req.body.czas_trwania,
    id_domu_kultury: req.body.id_domu_kultury,
    id_sali: req.body.id_sali,
  };

  return wystawa;
}

async function post(req, res, next) {
  try {
    let wystawa = getWystawaFromRec(req);
    if (
      wystawa.typ_wystawy &&
      wystawa.imie_wystawiajacego &&
      wystawa.nazwisko_wystawiajacego &&
      wystawa.temat &&
      wystawa.data &&
      wystawa.czas_trwania &&
      wystawa.id_domu_kultury &&
      wystawa.id_sali
    ) {
      const wystawa_id = await wystawy.create(wystawa);
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
    let wystawa = getWystawaFromRec(req);
 
    wystawa.id_wydarzenia = parseInt(req.query.id, 10);
 
    wystawa = await wystawy.update(wystawa);
 
    if (wystawa !== null) {
      res.status(200).json(wystawa);
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
