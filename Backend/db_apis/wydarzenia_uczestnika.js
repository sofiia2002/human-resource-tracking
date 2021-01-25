const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery = 
    `select
        wydarzenia.id_wydarzenia "id",
        wydarzenia.typ_wydarzenia "typ",
        wydarzenia.id_domu_kultury "id_domu_kultury"
    from wydarzenia 
    join wydarzenia_uczestnicy  
        on wydarzenia.id_wydarzenia=wydarzenia_uczestnicy.id_wydarzenia   
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};
    
    binds.id_uczestnika = context.id;
    query+= `\nwhere wydarzenia_uczestnicy.id_uczestnika = :id_uczestnika`;

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

const createSql =
 `insert into wydarzenia_uczestnicy (
    id_uczestnika,
    id_wydarzenia
  ) values (
    :id_uczestnika,
    :id_wydarzenia
  )`;
 
async function create(data) {
  const dodaneWydarzenie = Object.assign({}, data);

  dodaneWydarzenie.id_uczestnika = parseInt(dodaneWydarzenie.id_uczestnika, 10);
  dodaneWydarzenie.id_wydarzenia = parseInt(dodaneWydarzenie.id_wydarzenia, 10);
 
  const result = await database.simpleExecute(createSql, dodaneWydarzenie);
 
  return dodaneWydarzenie;
}

const deleteSql =
 `begin
 
    delete from wydarzenia_uczestnicy
    where id_uczestnika = :id_uczestnika
    and id_wydarzenia = :id_wydarzenia;
 
    :rowcount := sql%rowcount;
 
  end;`
 
async function del(data) {
    const wyrzuconeWydarzenie = Object.assign({}, data);

    wyrzuconeWydarzenie.id_uczestnika = parseInt(wyrzuconeWydarzenie.id_uczestnika, 10);
    wyrzuconeWydarzenie.id_wydarzenia = parseInt(wyrzuconeWydarzenie.id_wydarzenia, 10);

    wyrzuconeWydarzenie.rowcount = {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER
    }
   
    const result = await database.simpleExecute(deleteSql, wyrzuconeWydarzenie);
    console.log(result.outBinds);
 
    return result.outBinds.rowcount === 1;
}
 
module.exports.delete = del;
module.exports.create = create;
module.exports.find = find;