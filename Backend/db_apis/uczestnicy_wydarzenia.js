const database = require('../services/database.js');

const baseQuery = 
    `
    select
        id_uczestnika "id",
        imie "imie",
        nazwisko "nazwisko",
        telefon "telefon",
        email "email"
    from uczestnicy_wydarzenia
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.id){
        binds.id_uczestnika = context.id;
        query+= `\nand id_uczestnika = :id_uczestnika`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;