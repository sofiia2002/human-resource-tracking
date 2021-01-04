const pracownicy = require('../db_apis/pracownicy.js');

async function get(req, res, next){
    try{
        const context = {};
        context.id = parseInt(req.query.id, 10);
        context.dom_kultury = parseInt(req.query.dom_kultury, 10);
        const rows = await pracownicy.find(context);
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
  
  
module.exports.login = login;
module.exports.get = get;
