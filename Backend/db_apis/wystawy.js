const database = require('../services/database.js');

const baseQuery = 
    `select
        id_wydarzenia "id",
        typ_wystawy "typ_wystawy",
        imie_wystawiajacego "imie_wystawiajacego",
        nazwisko_wystawiajacego "nazwisko_wystawiajacego",
        temat "temat",
        opis "opis"
    from wystawy
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