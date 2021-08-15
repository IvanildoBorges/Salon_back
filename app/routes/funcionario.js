const express = require("express");
const nodemon = require('nodemon');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//RETORNA TODOS OS FUNCIONARIOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ error: error });
        }
        conn.query(
            'SELECT * FROM funcionario;',
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
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            });
        }
        conn.query(
            'SELECT * FROM funcionario WHERE email=?', 
            [req.body.email],
            (error, results) => {
                if (error) { return res.status(500).send({ error: error }); }
                if (results.length > 0) {
                    res.status(409).send({ mensagem: 'Usuário já cadastrado!' });
                } else {
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if (errBcrypt) {
                            return res.status(500).send({ 
                                error: errBcrypt
                            });
                        }
                        conn.query(
                            'INSERT INTO funcionario(nome, endereco, email, senha, especializacao) VALUES (?,?,?,?,?)',
                            [req.body.nome, req.body.endereco, req.body.email, hash, req.body.especializacao],
                            (error, results) => {
                                conn.release();
                                if (error) {
                                    res.status(500).send({
                                        error: error, 
                                        response: null
                                    });
                                }
                                response = {
                                    mensagem: 'Funcionario inserido com sucesso!',
                                    usuarioCriado: {
                                        id_usuario: results.id,
                                        nome: req.body.nome,
                                        endereco: req.body.endereco,
                                        email: req.body.email,
                                        especializacao: req.body.especializacao
                                    }
                                }
                                return res.status(201).send(response);
                            }
                        );
                    });
                }
            }
        );
    });
})

//RETORNA UM FUNCIONARIO ESPECIFICO
router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => { 
        if (error) { 
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM funcionario WHERE id = ?',
            [req.params.id],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({ error: error })
                }
                return res.status(200).send({ response: resultado });
            }
        );
    });
});

//ATUALIZA UM FUNCIONARIO
router.put('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(500).send({ error: error})
        }
        conn.query(
            `UPDATE funcionario 
            SET nome = ?, endereco = ?, email = ?, senha = ?, especializacao = ?
            WHERE id = ?`,
            [
                req.body.nome,
                req.body.endereco, 
                req.body.email,
                req.body.senha,
                req.body.especializacao,
                req.params.id
            ],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }

                res.status(202).send({
                    mensagem: 'Funcionario alterado com sucesso!'
                });
            }
        );
    });
});
//DELETA CONTA FUNCIONARIO
router.delete('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
            'DELETE FROM funcionario WHERE id = ?',
            [req.params.id],
            (error, resultado, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: 'Funcionario excluído com sucesso!'
                });
            }
        );
    });
});

//Exportando a rota
module.exports = router; 