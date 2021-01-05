const database = require('../services/database.js');

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

    return result.rows;
}

module.exports.find = find;