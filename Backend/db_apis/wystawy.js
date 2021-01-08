const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery = 
    `select
        wystawy.id_wydarzenia "id",
        wystawy.typ_wystawy "typ_wystawy",
        wystawy.imie_wystawiajacego "imie_wystawiajacego",
        wystawy.nazwisko_wystawiajacego "nazwisko_wystawiajacego",
        wystawy.temat "temat",
        wystawy.opis "opis",
        wydarzenia.data_wydarzenia "data",
        wydarzenia.czas_trwania "czas_trwania",
        wydarzenia.id_domu_kultury "id_domu_kultury",
        sale.numer_sali "numer_sali"
    from wystawy 
    join wydarzenia  
        on wydarzenia.id_wydarzenia=wystawy.id_wydarzenia
    join sale 
        on sale.id_sali=wydarzenia.id_sali
    where 1 = 1    
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};
    

    if(context.dom_kultury){
        binds.id_domu_kultury = context.dom_kultury;
        query+= `\nand wydarzenia.id_domu_kultury = :id_domu_kultury`;
    }

    if(context.id){
        binds.id_wydarzenia = context.id;
        query+= `\nand wystawy.id_wydarzenia = :id_wydarzenia`;
    }


    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

const createWydarzenieSql =
`insert into wydarzenia (
    id_wydarzenia,
    typ_wydarzenia,
    data_wydarzenia,
    czas_trwania,
    id_domu_kultury,
    id_sali
 ) values (
    (SELECT (MAX(id_wydarzenia) + 1) FROM wydarzenia),
    :typ_wydarzenia,
    :data,
    :czas_trwania,
    :id_domu_kultury,
    :id_sali
 ) returning id_wydarzenia
 into :id_wydarzenia`;

const createWystawaSql =
 `insert into wystawy (
    id_wydarzenia,
    typ_wystawy,
    imie_wystawiajacego,
    nazwisko_wystawiajacego,
    temat,
    opis
  ) values (
    :id_wydarzenia,
    :typ_wystawy,
    :imie_wystawiajacego,
    :nazwisko_wystawiajacego,
    :temat,
    :opis
  )`;
 
async function create(wys) {
  const wydarzenie = {
    typ_wydarzenia: "wystawa",
    data: new Date(wys.data),
    czas_trwania: wys.czas_trwania,
    id_domu_kultury: wys.id_domu_kultury,
    id_sali: wys.id_sali,
  }

  wydarzenie.id_wydarzenia = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }

  const resultOne = await database.simpleExecute(createWydarzenieSql, wydarzenie);

  const wystawa = {
    id_wydarzenia: resultOne.outBinds.id_wydarzenia[0],
    typ_wystawy: wys.typ_wystawy,
    imie_wystawiajacego: wys.imie_wystawiajacego,
    nazwisko_wystawiajacego: wys.nazwisko_wystawiajacego,
    temat: wys.temat,
    opis: wys.opis ? wys.opis : null
  };

  const resultTwo = await database.simpleExecute(createWystawaSql, wystawa);

  return resultTwo;
}
 

const updateWydarzenieSql =
 `update wydarzenia
  set 
    data_wydarzenia = :data_wydarzenia,
    czas_trwania = :czas_trwania,
    id_domu_kultury = :id_domu_kultury,
    id_sali = :id_sali
  where id_wydarzenia = :id_wydarzenia`;

const updateWystawaSql =
 `update wystawy
  set 
    typ_wystawy = :typ_wystawy,
    imie_wystawiajacego = :imie_wystawiajacego,
    nazwisko_wystawiajacego = :nazwisko_wystawiajacego,
    temat = :temat,
    opis = :opis
  where id_wydarzenia = :id_wydarzenia`;
 
async function update(wys) {
  const wydarzenie = {
    id_wydarzenia: wys.id_wydarzenia,
    data_wydarzenia: new Date(wys.data),
    czas_trwania: wys.czas_trwania,
    id_domu_kultury: wys.id_domu_kultury,
    id_sali: wys.id_sali,
  }

  const wystawa = {
    id_wydarzenia: wys.id_wydarzenia,
    typ_wystawy: wys.typ_wystawy,
    imie_wystawiajacego: wys.imie_wystawiajacego,
    nazwisko_wystawiajacego: wys.nazwisko_wystawiajacego,
    temat: wys.temat,
    opis: wys.opis ? wys.opis : null
  };

  const resultOne = await database.simpleExecute(updateWydarzenieSql, wydarzenie);
 
  if (resultOne.rowsAffected && resultOne.rowsAffected === 1) {
    const resultTwo = await database.simpleExecute(updateWystawaSql, wystawa);

    if (resultTwo.rowsAffected && resultTwo.rowsAffected === 1) {
      return resultTwo;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

const deleteSql =
 `begin

    delete from wydarzenia_uczestnicy
    where id_wydarzenia = :id_wydarzenia;

    delete from pracownicy_wydarzenia
    where id_wydarzenia = :id_wydarzenia;

    delete from wystawy
    where id_wydarzenia = :id_wydarzenia;

    delete from wydarzenia
    where id_wydarzenia = :id_wydarzenia;
 
    :rowcount := sql%rowcount;
 
  end;`
 
async function del(id) {
  const binds = {
    id_wydarzenia: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  }
  const result = await database.simpleExecute(deleteSql, binds);
 
  return result.outBinds.rowcount === 1;
}
 
module.exports.delete = del;
module.exports.update = update;
module.exports.create = create;
module.exports.find = find;