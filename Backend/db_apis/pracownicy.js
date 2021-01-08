const database = require("../services/database.js");

const baseQuery = `select
        pracownicy.id_pracownika "id",
        pracownicy.nazwisko "nazwisko",
        pracownicy.imie "imie",
        pracownicy.pesel "pesel",
        pracownicy.data_urodzenia "data_urodzenia",
        pracownicy.telefon "telefon",
        pracownicy.plec "plec",
        stanowiska.id_stanowiska "id_stanowiska",
        stanowiska.nazwa "stanowisko",
        stanowiska.pensja "pensja",
        adresy.id_adresu "id_adresu",
        adresy.miasto "miasto",
        adresy.ulica "ulica",
        adresy.nr_lokalu "nr_lokalu",
        poczty.id_poczty "id_poczty",
        poczty.kod_poczty "kod_poczty",
        poczty.poczta "poczta"
    from pracownicy  
    join adresy 
        on adresy.id_adresu=pracownicy.nr_adresu
    join poczty
        on poczty.id_poczty=adresy.nr_poczty
    join stanowiska 
        on stanowiska.id_stanowiska = pracownicy.nr_stanowiska    
    where 1 = 1    
    `;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.dom_kultury) {
    binds.id_domu_kultury = context.dom_kultury;
    query += `\nand pracownicy.id_domu_kultury = :id_domu_kultury`;
  }

  if (context.id) {
    binds.id_pracownika = context.id;
    query += `\nand pracownicy.id_pracownika = :id_pracownika`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows;
}

async function login(employ) {
  let query = baseQuery;
  const binds = {};

  binds.imie = employ.imie;
  query += `\nand pracownicy.imie = :imie`;

  binds.nazwisko = employ.nazwisko;
  query += `\nand pracownicy.nazwisko = :nazwisko`;

  binds.haslo = employ.haslo;
  query += `\nand pracownicy.haslo = :haslo`;

  const result = await database.simpleExecute(query, binds);

  if (result.rows.length !== 0) {
    return result.rows;
  } else {
    return null;
  }
}

const updateAdresSql = `update adresy
  set 
    miasto = :miasto,
    ulica = :ulica,
    nr_lokalu = :nr_lokalu
  where id_adresu = :id_adresu`;

const updatePocztaSql = `update poczty
  set 
    kod_poczty = :kod_poczty,
    poczta = :poczta
  where id_poczty = :id_poczty`;

const updatePracownikSql = `update pracownicy
  set 
    nazwisko = :nazwisko,
    imie = :imie,
    haslo = :haslo,
    pesel = :pesel,
    data_urodzenia = :data_urodzenia,
    telefon = :telefon,
    plec = :plec,
    nr_stanowiska = :id_stanowiska
  where id_pracownika = :id_pracownika`;

async function update(prac) {
  const poczta = {
    kod_poczty: prac.kod_poczty,
    poczta: prac.poczta,
    id_poczty: prac.id_poczty,
  };

  const adres = {
    miasto: prac.miasto,
    ulica: prac.ulica,
    nr_lokalu: prac.nr_lokalu,
    id_adresu: prac.id_adresu,
  };

  const pracownik = {
    id_pracownika: prac.id_pracownika,
    nazwisko: prac.nazwisko,
    haslo: prac.haslo,
    imie: prac.imie,
    pesel: prac.pesel,
    data_urodzenia: new Date(prac.data_urodzenia),
    telefon: prac.telefon,
    plec: prac.plec,
    id_stanowiska: prac.id_stanowiska,
  };

  const resultOne = await database.simpleExecute(updatePocztaSql, poczta);

  if (resultOne.rowsAffected && resultOne.rowsAffected === 1) {
    const resultTwo = await database.simpleExecute(updateAdresSql, adres);

    if (resultTwo.rowsAffected && resultTwo.rowsAffected === 1) {
      const resultThree = await database.simpleExecute(
        updatePracownikSql,
        pracownik
      );

      if (resultThree.rowsAffected && resultThree.rowsAffected === 1) {
        return resultThree;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

module.exports.update = update;
module.exports.login = login;
module.exports.find = find;
