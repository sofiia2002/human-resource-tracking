const database = require('../services/database.js');
const oracledb = require("oracledb");

const baseQuery = 
    `
    select
        uczestnicy_wydarzenia.id_uczestnika "id",
        uczestnicy_wydarzenia.imie "imie",
        uczestnicy_wydarzenia.nazwisko "nazwisko",
        uczestnicy_wydarzenia.telefon "telefon",
        uczestnicy_wydarzenia.email "email"
    from uczestnicy_wydarzenia
    join wydarzenia_uczestnicy
        on uczestnicy_wydarzenia.id_uczestnika=wydarzenia_uczestnicy.id_uczestnika
    where 1 = 1  
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.id){
        binds.id_uczestnika = context.id;
        query+= `\nand uczestnicy_wydarzenia.id_uczestnika = :id_uczestnika`;
    }

    if(context.wydarzenie){
        binds.id_wydarzenia = context.wydarzenie;
        query+= `\nand wydarzenia_uczestnicy.id_wydarzenia = :id_wydarzenia`;
    }

    const result = await database.simpleExecute(query, binds);

    const dataArr = result.rows.map(item=>{
        return [item.id,item]
    }); 

    const maparr = new Map(dataArr); 
    
    const filteredResult = [...maparr.values()];

    return filteredResult;
}

const createSql =
 `insert into uczestnicy_wydarzenia (
    id_uczestnika,
    imie,
    nazwisko,
    telefon,
    email,
    haslo
  ) values (
    (SELECT (MAX(id_uczestnika) + 1) FROM uczestnicy_wydarzenia),
    :imie,
    :nazwisko,
    :telefon,
    :email,
    :haslo
  )`;
 
async function create(data) {
  const dodanyUczestnik = Object.assign({}, data);

  const result = await database.simpleExecute(createSql, dodanyUczestnik);
 
  return dodanyUczestnik;
}

const deleteSql =
 `begin
 
    delete from uczestnicy_wydarzenia
    where id_uczestnika = :id_uczestnika;
 
    :rowcount := sql%rowcount;
 
  end;`
 
async function del(id) {
  const binds = {
    id_uczestnika: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  }
  const result = await database.simpleExecute(deleteSql, binds);
 
  return result.outBinds.rowcount === 1;
}

const updateSql =
 `update uczestnicy_wydarzenia
  set imie = :imie,
      telefon = :telefon,
      nazwisko = :nazwisko,
      email = :email,
      haslo = :haslo
  where id_uczestnika = :id_uczestnika`;
 
async function update(emp) {
  const uczestnik = Object.assign({}, emp);
  const result = await database.simpleExecute(updateSql, uczestnik);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return uczestnik;
  } else {
    return null;
  }
}
 
module.exports.update = update;
module.exports.delete = del;
module.exports.create = create;
module.exports.find = find;