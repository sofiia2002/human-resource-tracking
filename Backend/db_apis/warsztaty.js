const database = require('../services/database.js');

const baseQuery = 
    `select
        warsztaty.id_wydarzenia "id",
        warsztaty.temat "temat",
        warsztaty.nazwisko_wykladowcy "nazwisko_wykladowcy",
        warsztaty.imie_wykladowcy "imie_wykladowcy",
        warsztaty.email "email",
        warsztaty.telefon "telefon",
        wydarzenia.data_wydarzenia "data",
        wydarzenia.czas_trwania "czas_trwania",
        wydarzenia.id_domu_kultury "id_domu_kultury",
        sale.numer_sali "numer_sali"
    from warsztaty
    join wydarzenia  
        on wydarzenia.id_wydarzenia=warsztaty.id_wydarzenia
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
        query+= `\nand warsztaty.id_wydarzenia = :id_wydarzenia`;
    }


    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;