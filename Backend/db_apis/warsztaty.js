const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery = 
    `select
        warsztaty.id_wydarzenia "id",
        warsztaty.temat "temat",
        warsztaty.nazwisko_wykladowcy "nazwisko_wykladowcy",
        warsztaty.imie_wykladowcy "imie_wykladowcy",
        warsztaty.email "email",
        warsztaty.telefon "telefon",
        wydarzenia.data_wydarzenia "data",
        wydarzenia.czas_trwania "czas_trwania",
        wydarzenia.id_domu_kultury "id_domu_kultury",
        sale.id_sali "id_sali",
        sale.numer_sali "numer_sali"
    from warsztaty
    join wydarzenia  
        on wydarzenia.id_wydarzenia=warsztaty.id_wydarzenia
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
        query+= `\nand warsztaty.id_wydarzenia = :id_wydarzenia`;
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

const createWarsztatSql =
 `insert into warsztaty (
    id_wydarzenia,
    imie_wykladowcy,
    nazwisko_wykladowcy,
    temat,
    email,
    telefon
  ) values (
    :id_wydarzenia,
    :imie_wykladowcy,
    :nazwisko_wykladowcy,
    :temat,
    :email,
    :telefon
  )`;
 
async function create(warsz) {
  const wydarzenie = {
    typ_wydarzenia: "warsztat",
    data: new Date(warsz.data),
    czas_trwania: warsz.czas_trwania,
    id_domu_kultury: warsz.id_domu_kultury,
    id_sali: warsz.id_sali,
  }

  wydarzenie.id_wydarzenia = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }

  const resultOne = await database.simpleExecute(createWydarzenieSql, wydarzenie);

  const warsztat = {
    id_wydarzenia: resultOne.outBinds.id_wydarzenia[0],
    imie_wykladowcy: warsz.imie_wykladowcy,
    nazwisko_wykladowcy: warsz.nazwisko_wykladowcy,
    email: warsz.email,
    telefon: warsz.telefon,
    temat: warsz.temat,
  };

  const resultTwo = await database.simpleExecute(createWarsztatSql, warsztat);

  return resultTwo;
}
 
const updateWydarzenieSql =
 `update wydarzenia
  set data_wydarzenia = :data_wydarzenia,
    typ_wydarzenia = :typ_wydarzenia,
    czas_trwania = :czas_trwania,
    id_domu_kultury = :id_domu_kultury,
    id_sali = :id_sali
  where id_wydarzenia = :id_wydarzenia`;

const updateWarsztatSql =
 `update warsztaty
  set imie_wykladowcy = :imie_wykladowcy,
    nazwisko_wykladowcy = :nazwisko_wykladowcy,
    temat = :temat,
    email = :email,
    telefon = :telefon
  where id_wydarzenia = :id_wydarzenia`;
 
async function update(warsz) {
  const wydarzenie = {
    id_wydarzenia: warsz.id_wydarzenia,
    typ_wydarzenia: "warsztat",
    data_wydarzenia: new Date(warsz.data),
    czas_trwania: warsz.czas_trwania,
    id_domu_kultury: warsz.id_domu_kultury,
    id_sali: warsz.id_sali,
  }

  const warsztat = {
    id_wydarzenia: warsz.id_wydarzenia,
    imie_wykladowcy: warsz.imie_wykladowcy,
    nazwisko_wykladowcy: warsz.nazwisko_wykladowcy,
    temat: warsz.temat,
    email: warsz.email,
    telefon: warsz.telefon
  };

  const resultOne = await database.simpleExecute(updateWydarzenieSql, wydarzenie);
 
  if (resultOne.rowsAffected && resultOne.rowsAffected === 1) {
    const resultTwo = await database.simpleExecute(updateWarsztatSql, warsztat);

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
    
    delete from warsztaty
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