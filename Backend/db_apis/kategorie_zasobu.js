const database = require('../services/database.js');

const baseQuery = 
    `select
        id_kategorii_zasobu "id",
        nazwa_kategorii "kategoria"
    from kategorie_zasobu
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.id){
        binds.id_kategorii_zasobu = context.id;
        query+= `\nwhere kategorie_zasobu.id_kategorii_zasobu = :id_kategorii_zasobu`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;