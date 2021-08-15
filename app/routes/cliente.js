const express = require('express');
const nodemon = require('nodemon');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');

// LISTAR TODOS OS CLIENTES:
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ error: error});
        }
        conn.query(
            'SELECT * FROM cliente;',
            (error, resultado, fields) => {
                if (error) { 
                    return res.status(500).send({ error: error});
                }
                return res.status(200).send({response: resultado})
            }
        );
    });
});

//LISTAR UM CLIENTE ESPECIFICO
router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => { 
        if (error) { 
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM cliente WHERE id = ?',
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

// CRIAR CLIENTES:
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            });
        }
        conn.query(
            'SELECT * FROM cliente WHERE email=?', 
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
                            'INSERT INTO cliente(nome, endereco, email, senha) VALUES (?,?,?,?)',
                            [req.body.nome, req.body.endereco, req.body.email, hash],
                            (error, results) => {
                                conn.release();
                                if (error) {
                                    res.status(500).send({
                                        error: error, 
                                        response: null
                                    });
                                }
                                response = {
                                    mensagem: 'Cliente inserido com sucesso!',
                                    usuarioCriado: {
                                        id_usuario: results.id,
                                        nome: req.body.nome,
                                        endereco: req.body.endereco,
                                        email: req.body.email
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
});


// ALTERAR UM CLIENTE:
router.put('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(500).send({ error: error})
        }
        conn.query(
            `UPDATE cliente 
            SET nome = ?, endereco = ?, email = ?, senha = ?
            WHERE id = ?`,
            [
                req.body.nome,
                req.body.endereco, 
                req.body.email,
                req.body.senha,
                req.params.id
            ],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }

                res.status(202).send({
                    mensagem: 'Cliente alterado com sucesso!'
                });
            }
        );
    });
});

//DELETAR UM CLIENTE
router.delete('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
            'DELETE FROM cliente WHERE id = ?',
            [req.params.id],
            (error, resultado, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                    res.status(202).send({
                        mensagem: 'Cliente excluído com sucesso!'
                    });
                }
            }
        );
    });
});

router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        const query = `SELECT * FROM cliente WHERE email=?`;
        conn.query(query, [req.body.email], (error, results, fileds) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }); }
            if (results.length < 1) {
                return res.status(401).send({
                    mensagem: 'Falha na autenticação'
                });
            }
        });
    });
});

//Exportando a rota
module.exports = router; 