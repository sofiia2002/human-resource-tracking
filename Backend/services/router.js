const express = require('express');
const router = new express.Router();
const domy_kultury = require('../controllers/domy_kultury.js');
const basic_info = require('../controllers/basic_info.js');

router.route('/')
      .get(basic_info.get);

router.route('/domy_kultury/:id?')
      .get(domy_kultury.get);

module.exports = router;