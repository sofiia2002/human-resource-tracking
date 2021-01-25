const login_uczestnicy = require('../db_apis/login_uczestnicy.js');

function getStudentsFromRec(req) {
  const student = {
    email: req.body.email,
    haslo: req.body.haslo,
  };

  return student;
}

async function post(req, res, next) {
  try {
    let student = getStudentsFromRec(req);

    if (student.email && student.haslo) {
      student = await login_uczestnicy.login(student);

      if (student !== null) {
        res.status(200).json(student);
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


module.exports.post = post;