const database = require('../services/database.js');

const loginSql = `
select
    id_uczestnika "id",
    nazwisko "nazwisko",
    imie "imie",
    telefon "telefon",
    email "email",
    haslo "haslo"
from uczestnicy_wydarzenia
where 1 = 1    
`;

async function login(stud) {
  let query = loginSql;
  const binds = {};

  binds.email = stud.email;
  query += `\nand email = :email`;

  binds.haslo = stud.haslo;
  query += `\nand haslo = :haslo`;

  const result = await database.simpleExecute(query, binds);

  if ((result.rows.length!==0)) {
    return result.rows;
  } else {
    return null;
  }
}

module.exports.login = login;
