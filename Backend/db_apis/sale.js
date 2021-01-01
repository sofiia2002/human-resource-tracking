const database = require('../services/database.js');

const baseQuery = 
    `select
        sale.id_sali "id",
        sale.powierzchnia "powierzchnia",
        sale.numer_sali "numer_sali"
    from zasoby
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.id){
        binds.id_sali = context.id;
        query+= `\nwhere zasoby.id_sali = :id_sali`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;