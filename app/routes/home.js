const express = require('express');
const nodemon = require('nodemon');
const router = express.Router();
const authentic = require('../controllers/authorization-controller');

//Importando controladores da rota agenda
const HomeController = require('../controllers/home-controller');

//rotas agenda
router.get('/', HomeController.bemVindo);

module.exports = router;
