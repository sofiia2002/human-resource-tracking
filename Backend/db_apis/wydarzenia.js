const database = require('../services/database.js');

const baseQuery = 
    `select
        wydarzenia.id_wydarzenia "id",
        wydarzenia.typ_wydarzenia "typ",
        wydarzenia.data_wydarzenia "data",
        wydarzenia.czas_trwania "czas_trwania",
        sale.numer_sali "numer_sali"
    from wydarzenia  
    join sale 
        on sale.id_sali=wydarzenia.id_sali
    where 1 = 1    
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.dom_kultury){
        binds.id_domu_kultury = context.dom_kultury;
        query+= `\nand wydarzenia.id_domu_kultury = :id_domu_kultury`;
    }

    if(context.id){
        binds.id_wydarzenia = context.id;
        query+= `\nand wydarzenia.id_wydarzenia = :id_wydarzenia`;
    }

    if(context.typ_wydarzenia){
        binds.typ_wydarzenia = context.typ_wydarzenia;
        query+= `\nand wydarzenia.typ_wydarzenia = :typ_wydarzenia`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;