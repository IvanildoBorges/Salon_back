const express = require('express');
//const nodemon = require('nodemon');
const router = express.Router();
const authentic = require('../controllers/authorization-controller');

//Importando controladores da rota feedback
const AvalicaoController = require('../controllers/feedback-controller');

//rotas feedback
router.post('/cadastro', authentic.verificao, AvalicaoController.setAvalicao);
router.get('/', authentic.verificao, AvalicaoController.getAvalicao);
router.put('/atualizar/:id', authentic.verificao, AvalicaoController.updateAvalicao);
router.delete('/delete/:id', authentic.verificao, AvalicaoController.deleteAvalicao);

module.exports = router;
