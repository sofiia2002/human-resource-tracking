const database = require('../services/database.js');

const baseQuery = 
    `select
        wydarzenia.id_wydarzenia "id",
        wydarzenia.typ_wydarzenia "typ",
        wydarzenia.id_domu_kultury "id_domu_kultury"
    from wydarzenia 
    join wydarzenia_uczestnicy  
        on wydarzenia.id_wydarzenia=wydarzenia_uczestnicy.id_wydarzenia   
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};
    
    binds.id_uczestnika = context.id;
    query+= `\nwhere wydarzenia_uczestnicy.id_uczestnika = :id_uczestnika`;

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;