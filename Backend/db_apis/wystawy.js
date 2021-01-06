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

  const createWydarzenieSql =
  `insert into wydarzenia (
      id_wydarzenia,
      data,
      czas_trwania,
      id_domu_kultury,
      id_sali
   ) values (
     (SELECT (MAX(id_wydarzenia) + 1) FROM wydarzenia),
      :data,
      :czas_trwania,
      :id_domu_kultury,
      :id_sali
   ) returning id_wydarzenia
   into :id_wydarzenia`;
 
async function create(wys) {
  const wydarzenie = {
    data: new Date(Date.UTC(0, 0, 0, 0, 0, 0)),
    czas_trwania: wys.czas_trwania,
    id_domu_kultury: wys.id_domu_kultury,
    id_sali: wys.id_sali,
  }

  wydarzenie.id_wydarzenia = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  };

// wydarzenie.data = {
//   dir: oracledb.BIND_OUT,
//   type: oracledb.DATE
// };
  const resultOne = await database.simpleExecute(createWydarzenieSql, wydarzenie);

  const wystawa = {
    id_wydarzenia: resultOne.outBinds.id_wydarzenia[0],
    typ_wystawy: wys.typ_wystawy,
    imie_wystawiajacego: wys.imie_wystawiajacego,
    nazwisko_wystawiajacego: wys.nazwisko_wystawiajacego,
    temat: wys.temat,
    opis: wys.opis ? wys.opis : null
  };
  
  wystawa.id_wydarzenia = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  };

  const resultTwo = await database.simpleExecute(createWystawaSql, wystawa);

  console.log(resultTwo);

  return resultTwo;
}
 
module.exports.create = create;
module.exports.find = find;