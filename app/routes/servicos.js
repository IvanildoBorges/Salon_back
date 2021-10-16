const express = require('express');
//const nodemon = require('nodemon');
const router = express.Router();
const authentic = require('../controllers/authorization-controller');

//Importando controladores da rota serviço
const ServicoController = require('../controllers/servico-controller');

//Rotas serviços
router.get('/', authentic.verificao, ServicoController.getServicos);
router.get('/:id', authentic.verificao, ServicoController.getById);
router.get('/filter/:nome', authentic.verificao, ServicoController.getServico);
router.get('/filter/nome/:nome', authentic.verificao, ServicoController.getByName);
router.post('/cadastro', authentic.verificao, ServicoController.setServico);
router.put('/atualizar/:id', authentic.verificao, ServicoController.updateServico);
router.delete('/delete/:id', authentic.verificao, ServicoController.deleteServico);

module.exports = router;
