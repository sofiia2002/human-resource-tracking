const pracownicy = require("../db_apis/pracownicy.js");

async function get(req, res, next) {
  try {
    const context = {};
    context.id = parseInt(req.query.id, 10);
    context.dom_kultury = parseInt(req.query.dom_kultury, 10);
    const rows = await pracownicy.find(context);
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

function getEmployeesFromRec(req) {
  const employee = {
    imie: req.body.imie,
    nazwisko: req.body.nazwisko,
    haslo: req.body.haslo,
  };

  return employee;
}

async function login(req, res, next) {
  try {
    let employee = getEmployeesFromRec(req);

    if (employee.imie && employee.nazwisko && employee.haslo) {
      employee = await pracownicy.login(employee);

      if (employee !== null) {
        res.status(200).json(employee);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(400).end();
    }
  } catch (err) {
    next(err);
  }
}

function getPracownikFromRec(req) {
  const pracownik = {
    nazwisko: req.body.nazwisko,
    imie: req.body.imie,
    haslo: req.body.haslo,
    pesel: req.body.pesel || null,
    data_urodzenia: req.body.data_urodzenia,
    telefon: req.body.telefon,
    plec: req.body.plec, 
    id_stanowiska: req.body.id_stanowiska,
    id_adresu: req.body.id_adresu, 
    miasto: req.body.miasto,
    ulica: req.body.ulica,
    nr_lokalu: req.body.nr_lokalu,
    id_poczty: req.body.id_poczty, 
    kod_poczty: req.body.kod_poczty,
    poczta: req.body.poczta
  };

  return pracownik;
}

async function put(req, res, next) {
  try {
    let pracownik = getPracownikFromRec(req);
 
    pracownik.id_pracownika = parseInt(req.query.id, 10);
 
    pracownik = await pracownicy.update(pracownik);
 
    if (pracownik !== null) {
      res.status(200).json(pracownik);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;
module.exports.login = login;
module.exports.get = get;
