const database = require('../services/database.js');

const baseQuery = 
    `select
        sale.id_sali "id",
        sale.powierzchnia "powierzchnia",
        sale.numer_sali "numer_sali"
    from sale
    where 1=1
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.id){
        binds.id_sali = context.id;
        query+= `\nand sale.id_sali = :id_sali`;
    }

    if(context.dom_kultury){
        binds.id_domu_kultury = context.dom_kultury;
        query+= `\nand sale.id_domu_kultury = :id_domu_kultury `;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;