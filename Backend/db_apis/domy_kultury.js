const database = require('../services/database.js');

const baseQuery = 
    `select
        domy_kultury.id_domu_kultury "id",
        domy_kultury.telefon "phone",
        domy_kultury.godzina_otwarcia "opens",
        domy_kultury.godzina_zamkniecia "closes",
        adresy.miasto "city",
        adresy.ulica "street",
        adresy.nr_lokalu "apartment",
        poczty.kod_poczty "postal_code",
        poczty.poczta "postal_name"
    from domy_kultury  
    join adresy 
        on adresy.id_adresu=domy_kultury.nr_adresu
    join poczty
        on poczty.id_poczty=adresy.nr_poczty
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.id){
        binds.id_domu_kultury = context.id;
        query+= `\nwhere id_domu_kultury = :id_domu_kultury`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;