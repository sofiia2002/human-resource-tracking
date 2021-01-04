const database = require('../services/database.js');

const baseQuery = 
    `select
        wystawy.id_wydarzenia "id",
        wystawy.typ_wystawy "typ_wystawy",
        wystawy.imie_wystawiajacego "imie_wystawiajacego",
        wystawy.nazwisko_wystawiajacego "nazwisko_wystawiajacego",
        wystawy.temat "temat",
        wystawy.opis "opis",
        wydarzenia.data_wydarzenia "data",
        wydarzenia.czas_trwania "czas_trwania",
        wydarzenie.id_domu_kultury "id_domu_kultury",
        sale.numer_sali "numer_sali"
    from wystawy 
    join wydarzenia  
        on wydarzenia.id_wydarzenia=wystawy.id_wydarzenia
    join sale 
        on sale.id_sali=wydarzenia.id_sali
    where 1 = 1    
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};
    

    if(context.dom_kultury){
        binds.id_domu_kultury = context.dom_kultury;
        query+= `\nand id_domu_kultury = :id_domu_kultury`;
    }

    if(context.id){
        binds.id_wydarzenia = context.id;
        query+= `\nand id_wydarzenia = :id_wydarzenia`;
    }


    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;