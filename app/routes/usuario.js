const express = require('express');
//const nodemon = require('nodemon');
const router = express.Router();
const authentic = require('../controllers/authorization-controller');

//Importando controladores da rota usuario
const UsuarioController = require('../controllers/usuario-controller');

//rotas usuario
router.post('/cadastro', UsuarioController.setUsuario);
router.get('/:id', UsuarioController.getUsuario);
router.get('/', UsuarioController.getUsuarios);
router.put('/atualizar/:id', authentic.verificao, UsuarioController.updateUsuario);
router.delete('/delete/:id', authentic.verificao, UsuarioController.deleteUsuario);

module.exports = router;
