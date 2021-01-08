const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery = 
    `select
        pracownicy_wydarzenia.id_wydarzenia "id_wydarzenia",
        pracownicy_wydarzenia.id_pracownika "id_pracownika",
        pracownicy.imie "imie",
        pracownicy.nazwisko "nazwisko",
        pracownicy.telefon "telefon",
        wydarzenia.typ_wydarzenia "typ_wydarzenia",
        wydarzenia.data_wydarzenia "data_wydarzenia",
        wydarzenia.czas_trwania "czas_trwania",
        wydarzenia.id_sali "id_sali",
        sale.numer_sali "numer_sali",
        sale.powierzchnia "powierzchnia_sali"
    from pracownicy_wydarzenia
    join pracownicy
        on pracownicy.id_pracownika=pracownicy_wydarzenia.id_pracownika
    join wydarzenia
        on wydarzenia.id_wydarzenia=pracownicy_wydarzenia.id_wydarzenia
    join sale
        on sale.id_sali=wydarzenia.id_sali
    where 1 = 1    
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.pracownik){
        binds.id_pracownika = context.pracownik;
        query+= `\nand pracownicy_wydarzenia.id_pracownika = :id_pracownika`;
    }

    if(context.wydarzenie){
        binds.id_wydarzenia = context.wydarzenie;
        query+= `\nand pracownicy_wydarzenia.id_wydarzenia = :id_wydarzenia`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

const deleteSql =
 `begin

    delete from pracownicy_wydarzenia
    where id_wydarzenia = :id_wydarzenia
    and id_pracownika = :id_pracownika;
 
    :rowcount := sql%rowcount;
 
  end;`

async function del(context) {
    const binds = {
      id_wydarzenia: context.wydarzenie,
      id_pracownika: context.pracownik,
      rowcount: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER
      }
    }

    const result = await database.simpleExecute(deleteSql, binds);
   
    return result.outBinds.rowcount === 1;
}

const createSql =
 `insert into pracownicy_wydarzenia (
    id_wydarzenia,
    id_pracownika
  ) values (
    :id_wydarzenia,
    :id_pracownika
  )`;
 
async function create(data) {
    const pracownik_wydarzenia = {
        id_wydarzenia: data.id_wydarzenia,
        id_pracownika: data.id_pracownika,
    }
 
    const result = await database.simpleExecute(createSql, pracownik_wydarzenia);
 
    return result;
}
 

module.exports.delete = del;
module.exports.create = create;
module.exports.find = find;