const database = require('../services/database.js');

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

module.exports.find = find;