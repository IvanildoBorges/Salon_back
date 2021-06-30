const express = require("express");
const nodemon = require('nodemon');
const router = express.Router();
const mysql = require('../database/mysql').pool;

//RETORNA TODOS OS FUNCIONARIOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ error: error });
        }
        conn.query(
            'SELECT * FROM funcionarios;',
            (error, resultado, fields) => {
                if (error) { 
                    return res.status(500).send({ error: error });
                }
                return res.status(200).send({ response: resultado });
            }
        );
    });
});

//INSERE UM FUNCIONARIO
router.post('/', (req, res, next) => {
     
});

//RETORNA UM FUNCIONARIO ESPECIFICO
router.get('/:id', (req, res, next) => {
    
});

//ATUALIZA UM FUNCIONARIO
router.put('/', (req, res, next) => {
    
});

//DELETA CONTA FUNCIONARIO
router.delete('/:id', (req, res, next) => {
    
});

//Exportando a rota
module.exports = router; 