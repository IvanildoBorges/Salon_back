const express = require('express');
const nodemon = require('nodemon');
const router = express.Router();
const mysql = require('../database/mysql').pool;

// LISTAR TODOS SERVIÇOS:
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ error: error});
        }
        conn.query(
            'SELECT * FROM servicos;',
            (error, resultado, fields) => {
                if (error) { 
                    return res.status(500).send({ error: error});
                }
                return res.status(200).send({response: resultado})
            }
        );
    });
});

//LISTAR UM SERVIÇO ESPECIFICO
router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => { 
        if (error) { 
            return res.status(500).send({ error: error });
        }

        conn.query(
            'SELECT * FROM servicos WHERE id = ?',
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

// CRIAR SERVIÇOS:
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            });
        }
        conn.query(
            'INSERT INTO servicos (nome, categoria, descricao) VALUES (?,?,?)',
            [req.body.nome, req.body.categoria, req.body.descricao],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    res.status(500).send({
                        error: error, 
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: 'Servico inserido com sucesso!',
                    id_servico: resultado.insertId
                });
            }
        );
    });
});


// ALTERAR UM PRODUTO:
router.put('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) {
            return res.status(500).send({ error: error})
        }
        conn.query(
            `UPDATE servicos 
            SET nome = ?, categoria = ?, descricao = ?
            WHERE id = ?`,
            [
                req.body.nome,
                req.body.categoria, 
                req.body.descricao,
                req.params.id
            ],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }

                res.status(202).send({
                    mensagem: 'Servico alterado com sucesso!'
                });
            }
        );
    });
});

//DELETAR UM SERVIÇO
router.delete('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
            'DELETE FROM servicos WHERE id = ?',
            [req.params.id],
            (error, resultado, fields) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                    res.status(202).send({
                        mensagem: 'Serviço excluído com sucesso!'
                    });
                }
            }
        );
    });
});

//Exportando a rota
module.exports = router;