const database = require('../services/database.js');

const baseQuery = 
    `select
        sala_zasoby_egzemplarze.id_sali "id_sali",
        sala_zasoby_egzemplarze.id_zasobu "id_zasobu_egz",
        zasoby_egzemplarze.data_kupna "data_kupna",
        zasoby.nazwa "nazwa_zasobu",
        zasoby.producent "producent_zasobu",
        zasoby.opis "opis_zasobu",
        kategorie_zasobu.nazwa_kategorii "kategoria_zasobu"
    from sala_zasoby_egzemplarze
    join zasoby_egzemplarze
        on zasoby_egzemplarze.id_zasobu_egz=sala_zasoby_egzemplarze.id_zasobu
    join zasoby
        on zasoby.id_zasobu=zasoby_egzemplarze.id_zasobu
    join kategorie_zasobu
        on kategorie_zasobu.id_kategorii_zasobu=zasoby.id_kategorii_zasobu
    where 1 = 1    
    `

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if(context.id){
        binds.id_sali = context.id;
        query+= `\nand id_sali= :id_sali`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;