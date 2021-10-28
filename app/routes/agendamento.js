const express = require('express');
const nodemon = require('nodemon');
const router = express.Router();
const authentic = require('../controllers/authorization-controller');

//Importando controladores da rota agendamento
const AgendadosController = require('../controllers/agendados-controller');

//rotas agendamento
router.post('/cadastrar', authentic.verificao, AgendadosController.setAgendado);
router.get('/', authentic.verificao, AgendadosController.getAgendado);
router.put('/atualizar/:id', authentic.verificao, AgendadosController.updateAgendado);
router.delete('/delete/:id', authentic.verificao, AgendadosController.deleteAgendado);

module.exports = router;
