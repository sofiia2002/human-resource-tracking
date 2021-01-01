const database = require('../services/database.js');

const baseQuery = 
    `select
        id_stanowiska "id",
        nazwa "nazwa",
        opis "opis",
        pensja "pensja"
    from stanowiska 
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.id){
        binds.id_stanowiska = context.id;
        query+= `\nwhere id_stanowiska = :id_stanowiska`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;