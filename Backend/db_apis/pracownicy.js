const database = require('../services/database.js');

const baseQuery = 
    `select
        pracownicy.id_pracownika "id",
        pracownicy.nazwisko "nazwisko",
        pracownicy.imie "imie",
        pracownicy.pesel "pesel",
        pracownicy.data_urodzenia "data_urodzenia",
        pracownicy.telefon "telefon",
        pracownicy.plec "plec",
        stanowiska.nazwa "stanowisko",
        stanowiska.pensja "pensja",
        adresy.miasto "city",
        adresy.ulica "street",
        adresy.nr_lokalu "apartment",
        poczty.kod_poczty "postal_code",
        poczty.poczta "postal_name"
    from pracownicy  
    join adresy 
        on adresy.id_adresu=pracownicy.nr_adresu
    join poczty
        on poczty.id_poczty=adresy.nr_poczty
    join stanowiska 
        on stanowiska.id_stanowiska = pracownicy.nr_stanowiska    
    where 1 = 1    
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.dom_kultury){
        binds.id_domu_kultury = context.dom_kultury;
        query+= `\nand pracownicy.id_domu_kultury = :id_domu_kultury`;
    }

    if(context.id){
        binds.id_pracownika = context.id;
        query+= `\nand pracownicy.id_pracownika = :id_pracownika`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;