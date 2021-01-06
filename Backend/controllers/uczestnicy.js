const uczestnicy = require("../db_apis/uczestnicy.js");

async function get(req, res, next) {
  try {
    const context = {};
    context.id = parseInt(req.query.id, 10);
    context.wydarzenie = parseInt(req.query.wydarzenie, 10);
    const rows = await uczestnicy.find(context);
    if (req.query.id) {
      if (rows.length !== 0) {
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

function getUczestnikFromRec(req) {
  const uczestnik = {
    imie: req.body.imie,
    nazwisko: req.body.nazwisko,
    telefon: req.body.telefon,
    email: req.body.email,
    haslo: req.body.haslo,
  };

  return uczestnik;
}

async function post(req, res, next) {
  try {
    let dodanyUczestnik = getUczestnikFromRec(req);
    dodanyUczestnik = await uczestnicy.create(dodanyUczestnik);

    res.status(201).json(dodanyUczestnik);
  } catch (err) {
    next(err);
  }
}

async function del(req, res, next) {
  try {
    const id = parseInt(req.query.id, 10);

    const success = await uczestnicy.delete(id);

    if (success) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

async function put(req, res, next) {
  try {
    let uczestnik = getUczestnikFromRec(req);

    uczestnik.id_uczestnika = parseInt(req.query.id, 10);

    uczestnik = await uczestnicy.update(uczestnik);

    if (uczestnik !== null) {
      res.status(200).json(uczestnik);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;
module.exports.delete = del;
module.exports.post = post;
module.exports.get = get;
