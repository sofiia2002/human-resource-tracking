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
const uczestnicy_wydarzenia = require('../controllers/uczestnicy_wydarzenia.js');
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

router.route('/uczestnicy/:id?') 
      .get(uczestnicy_wydarzenia.get);  

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
      .get(wystawy.get);
      // .post(wystawy.post); 
      
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

router.route('/wydarzenia_uczestnika/:id') // id uczestnika
      .get(wydarzenia_uczestnika.get);  

module.exports = router;