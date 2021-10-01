const express = require("express");
//const nodemon = require('nodemon');
const router = express.Router();

//Importando controller de autorização
const LoginController = require('../controllers/authorization-controller');

router.post('/login', LoginController.login);

router.post('/refresh', LoginController.refresh);

//Exportando a rota
module.exports = router;
