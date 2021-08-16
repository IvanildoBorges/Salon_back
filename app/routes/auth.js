const express = require("express");
const nodemon = require('nodemon');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        const query = `SELECT * FROM pessoa WHERE email=?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }); }
            if (results.length < 1) {
                return res.status(401).send({
                  mensagem: 'Falha na autenticação'
                });
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if (err){
                    return res.status(401).send({
                      mensagem: 'Falha na autenticação'
                    });
                }
                if (result) {
                    let token = jwt.sign(
                      {
                        idUsuario: results[0].id,
                        email: results[0].email,
                      },
                      process.env.JWT_KEY,
                      {
                        expiresIn: "5 days"
                      }
                    );
                    return res.status(200).send(
                      {
                        mensagem: 'Autenticado com sucesso!',
                        token: token
                      }
                    );
                }
                return res.status(401).send({
                  mensagem: 'Falha na autenticação'
                });
            });
        });
    });
});

//Exportando a rota
module.exports = router;
