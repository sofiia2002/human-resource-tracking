const express = require('express');
const router = new express.Router();
const basic_info = require('../controllers/basic_info.js');
const domy_kultury = require('../controllers/domy_kultury.js');
const stanowiska = require('../controllers/stanowiska.js');
const wydarzenia = require('../controllers/wydarzenia.js');
const pracownicy = require('../controllers/pracownicy.js');
const zasoby = require('../controllers/zasoby.js');
const sale = require('../controllers/sale.js');
const kategorie_zasobu = require('../controllers/kategorie_zasobu.js');
const organizacja_wydarzen = require('../controllers/organizacja_wydarzen.js');
const sala_zasoby = require('../controllers/sala_zasoby.js');
const uczestnicy = require('../controllers/uczestnicy.js');
const warsztaty = require('../controllers/warsztaty.js');
const wystawy = require('../controllers/wystawy.js');
const login_uczestnicy = require('../controllers/login_uczestnicy.js');
const wydarzenia_uczestnika = require('../controllers/wydarzenia_uczestnika.js');


router.route('/')
      .get(basic_info.get);

router.route('/login_pracownicy')
      .post(pracownicy.login);

router.route('/login_uczestnicy')
      .post(login_uczestnicy.post);

router.route('/domy_kultury/:id?')
      .get(domy_kultury.get);

// Sonya: Tu wykorzystuje query dla get:
// GET:
// /api/uczestnicy?id=1
// Parametr 'id' oznacza id uczestnika
// Parametr 'wydarzenie' oznacza id wydarzenia
// 
// DELETE:
// /api/uczestnicy?id=1
// tylko id w query
//
// POST: 
// /api/uczestnicy 
// dodac JSON i nie dodawac id
//
// MODIFY:
// /api/uczestnicy?id=1
// dodac JSON i dodac id w query
//
// JSON : 
// { imie: string, nazwisko: string, telefon: string, email: string, haslo: string };
router.route('/uczestnicy') 
      .get(uczestnicy.get)
      .post(uczestnicy.post)
      .put(uczestnicy.put)
      .delete(uczestnicy.delete);

router.route('/stanowiska/:id?')
      .get(stanowiska.get);      

router.route('/sale/:id?')
      .get(sale.get);

router.route('/sala_zasoby/:id?') // id sali
      .get(sala_zasoby.get);  
      
router.route('/kategorie_zasobu/:id?')
      .get(kategorie_zasobu.get);   

// Sonya: Tu wykorzystuje query:
// GET:
// /api/zasoby?id=1&kategoria=2
// Parametr 'id' oznacza id zasobu
// Parametr 'kategoria' oznacza id kategorii zasobow

router.route('/zasoby') 
      .get(zasoby.get);

// Sonya: Tu wykorzystuje query do get'a:
// GET:
// api/wydarzenia?id=1&dom_kultury=1&typ=wystawa
// Parametr 'dom_kultury' oznacza id domu kultury
// Parametr 'id' oznacza id sali
// Parametr 'id uczestnika' oznacza id uczestnika
// Parametr 'typ' oznacza typ wydarzenia
router.route('/wydarzenia') 
      .get(wydarzenia.get)

// Sonya: Tu wykorzystuje query do get'a:
// GET:
// api/wydarzenia?id=1&dom_kultury=1
// Parametr 'dom_kultury' oznacza id domu kultury
// Parametr 'id' oznacza id warsztatu (wydarzenia)
// Parametr 'id uczestnika' oznacza id uczestnika
//
// POST: 
// /api/warsztaty
//
// PUT: 
// /api/warsztaty?id=3
// Parametr 'id' oznacza id warsztatu
//
// DANE DO POST I PUT:
// {
//   imie_wykladowcy: string;
//   nazwisko_wykladowcy: string;
//   temat: string;
//   email: string;
//   phone: string;
//   data: string type of 'YYYY'-'MM'-'DD'T'HH'-MI-SS.123H, przyklad "2021-01-30T15:00:00.123Z"
//   czas_trwania: number;
//   id_domu_kultury: number;
//   id_sali: number;
// };
router.route('/warsztaty') 
      .get(warsztaty.get)
      .post(warsztaty.post)
      .put(warsztaty.put); 

// Sonya: Tu wykorzystuje query do get'a:
// GET:
// /api/wystawy?id=1&dom_kultury=1
// Parametr 'dom_kultury' oznacza id domu kultury
// Parametr 'id' oznacza id wystawy (wydarzenia)
// Parametr 'id uczestnika' oznacza id uczestnika
//
// POST: 
// /api/wydarzenia
//
// PUT: 
// /api/wydarzenia?id=3
// Parametr 'id' oznacza id wystawy (wydarzenia)
//
// DANE DO POST I PUT:
// {
//   typ_wystawy: string; in ('malarska','fotograficzna','interaktywna','muzyczna','filmowa');
//   imie_wystawiajacego: string;
//   nazwisko_wystawiajacego: string;
//   temat: string;
//   opis: string | null;
//   data: string type of 'YYYY'-'MM'-'DD'T'HH'-MI-SS.123H, przyklad "2021-01-30T15:00:00.123Z"
//   czas_trwania: number;
//   id_domu_kultury: number;
//   id_sali: number;
// };
router.route('/wystawy') 
      .get(wystawy.get)
      .post(wystawy.post)
      .put(wystawy.put); 
      
// Sonya: Tu wykorzystuje query:
// GET:
// api/pracownicy?id=1&dom_kultury=1
// Parametr 'dom_kultury' oznacza id domu kultury
// Parametr 'id' oznacza id pracownika
router.route('/pracownicy') 
      .get(pracownicy.get); 

// Sonya: Tu wykorzystuje query:
// GET:
// api/organizacja_wydarzen?pracownik=1&wydarzenie=1
// Parametr 'pracownik' oznacza id pracownika
// Parametr 'wydarzenie' oznacza id wydarzenia
router.route('/organizacja_wydarzen')
      .get(organizacja_wydarzen.get);  


// Sonya: POST i DELETE potrzebuja:
// { id_uczestnika: number, id_wydarzenia: number }
router.route('/wydarzenia_uczestnika/:id?') // id uczestnika
      .get(wydarzenia_uczestnika.get)
      .post(wydarzenia_uczestnika.post) 
      .delete(wydarzenia_uczestnika.delete);

module.exports = router;