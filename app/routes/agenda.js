const express = require('express');
//const nodemon = require('nodemon');
const router = express.Router();
const authentic = require('../controllers/authorization-controller');

//Importando controladores da rota agenda
const AgendaController = require('../controllers/agenda-controller');

//rotas agenda
router.post('/cadastro', authentic.verificao, AgendaController.setAgenda);
router.get('/', authentic.verificao, AgendaController.getAgenda);
router.put('/atualizar/:id', authentic.verificao, AgendaController.updateAgenda);
router.delete('/delete/:id', authentic.verificao, AgendaController.deleteAgenda);

module.exports = router;
