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
// Parametr 'id' oznacza id uczestnika
// Parametr 'wydarzenie' oznacza id wydarzenia
// Przyklad: /api/uczestnicy?id=1
// DLA DELETE -> tylko id w query, czyli /api/uczestnicy?id=1
// DLA POST -> dodac JSON i nie dodawac id, czyli /api/uczestnicy 
// DLA MODIFY -> dodac JSON i dodac id w qury, czyli /api/uczestnicy?id=1
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
// Parametr 'id' oznacza id zasobu
// Parametr 'kategoria' oznacza id kategorii zasobow
// Przyklad: /api/zasoby?id=1&kategoria=2
router.route('/zasoby') 
      .get(zasoby.get);

// Sonya: Tu wykorzystuje query do get'a:
// Parametr 'dom_kultury' oznacza id domu kultury
// Parametr 'id' oznacza id sali
// Parametr 'id uczestnika' oznacza id uczestnika
// Parametr 'typ' oznacza typ wydarzenia
// Przyklad: /api/wydarzenia?id=1&dom_kultury=1&typ=wystawa
router.route('/wydarzenia') 
      .get(wydarzenia.get)

// Sonya: Tu wykorzystuje query do get'a:
// Parametr 'dom_kultury' oznacza id domu kultury
// Parametr 'id' oznacza id warsztatu (wydarzenia)
// Parametr 'id uczestnika' oznacza id uczestnika
// Przyklad: /api/wydarzenia?id=1&dom_kultury=1
router.route('/warsztaty') 
      .get(warsztaty.get);
      // .post(warsztaty.post); 

// Sonya: Tu wykorzystuje query:
// Parametr 'dom_kultury' oznacza id domu kultury
// Parametr 'id' oznacza id warsztatu (wystawy)
// Parametr 'id uczestnika' oznacza id uczestnika
// Przyklad: /api/wydarzenia?id=1&dom_kultury=1
router.route('/wystawy') 
      .get(wystawy.get)
      .post(wystawy.post); 
      
// Sonya: Tu wykorzystuje query:
// Parametr 'dom_kultury' oznacza id domu kultury
// Parametr 'id' oznacza id pracownika
// Przyklad: /api/pracownicy?id=1&dom_kultury=1
router.route('/pracownicy') 
      .get(pracownicy.get); 

// Sonya: Tu wykorzystuje query:
// Parametr 'pracownik' oznacza id pracownika
// Parametr 'wydarzenie' oznacza id wydarzenia
// Przyklad: /api/organizacja_wydarzen?pracownik=1&wydarzenie=1
router.route('/organizacja_wydarzen')
      .get(organizacja_wydarzen.get);  


// Sonya: POST i DELETE potrzebuja:
// { id_uczestnika: number, id_wydarzenia: number }
router.route('/wydarzenia_uczestnika/:id?') // id uczestnika
      .get(wydarzenia_uczestnika.get)
      .post(wydarzenia_uczestnika.post) 
      .delete(wydarzenia_uczestnika.delete);

module.exports = router;