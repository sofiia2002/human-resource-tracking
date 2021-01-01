const database = require('../services/database.js');

const baseQuery = 
    `select
        zasoby.id_zasobu "id",
        kategorie_zasobu.nazwa_kategorii "kategoria",
        zasoby.nazwa "nazwa",
        zasoby.producent "producent",
        zasoby.opis "opis"
    from zasoby
    join kategorie_zasobu
        on kategorie_zasobu.id_kategorii_zasobu=zasoby.id_kategorii_zasobu
    where 1 = 1    
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.kategoria){
        binds.id_kategorii_zasobu = context.kategoria;
        query+= `\nand zasoby.id_kategorii_zasobu = :id_kategorii_zasobu`;
    }

    if(context.id){
        binds.id_zasobu = context.id;
        query+= `\nand zasoby.id_zasobu = :id_zasobu`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;