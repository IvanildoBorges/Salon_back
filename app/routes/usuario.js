const express = require('express');
const nodemon = require('nodemon');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');

// CRIAR USUARIO
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'SELECT * FROM pessoa WHERE email=?;',
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
                            `INSERT INTO pessoa(isAdm, nome, endereco, email, senha, avatar)
                            VALUES (?,?,?,?,?,?)`,
                            [
                              req.body.isAdm,
                              req.body.nome,
                              req.body.endereco,
                              req.body.email,
                              hash,
                              req.body.avatar
                            ],
                            (error, results) => {
                              if (error) { res.status(500).send({ error: error, response: null });}
                              response = {
                                  mensagem: 'Usuário inserido com sucesso!',
                              }
                              conn.query(
                                  'SELECT * FROM pessoa WHERE email=?;',
                                  [req.body.email],
                                  (error, results) => {
                                      if (error) { return res.status(500).send({ error: error }); }
                                      if (results[0].isAdm) {
                                        conn.query(
                                            `INSERT INTO funcionario(id, especializacao) VALUES (?,?)`,
                                            [results[0].id, req.body.especializacao],
                                            (error, results) => {
                                              conn.release();
                                              if (error) { res.status(500).send({ error: error, response: null });}
                                              return res.status(201).send(response);
                                            }
                                        );
                                      } else {
                                        conn.query(
                                            `INSERT INTO cliente(id) VALUES (?)`,
                                            [results[0].id],
                                            (error, results) => {
                                              conn.release();
                                              if (error) { res.status(500).send({ error: error, response: null });}
                                              return res.status(201).send(response);
                                            }
                                        );
                                      }
                                  }
                              );
                            }
                        );
                    });
                }
            }
        );
    });
});

//LISTAR UM USUARIO ESPECIFICO
router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `SELECT * FROM pessoa WHERE id=?;`,
            [req.params.id],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({ error: error })
                }
                if (resultado.length == 0) {
                  res.status(404).send({ mensagem: 'Sem resultados!' });
                } else {
                  if (resultado[0].isAdm) {
                      conn.query(
                          `SELECT Pe.id, Pe.isAdm, Pe.nome, Fu.especializacao, Pe.endereco, Pe.email, Pe.avatar
                          FROM (SELECT * FROM funcionario WHERE id = ?) AS Fu
                          INNER JOIN
                          pessoa AS Pe
                          ON Fu.id=Pe.id;`,
                          [req.params.id],
                          (error, resultado, fields) => {
                              if (error) {
                                  return res.status(500).send({ error: error })
                              }
                              return res.status(200).send({ response: resultado });
                          }
                      );
                    } else {
                      conn.query(
                          `SELECT Pe.id, Pe.isAdm, Pe.nome, Pe.endereco, Pe.email, Pe.avatar
                          FROM (SELECT * FROM cliente WHERE id=?) AS Cl
                          INNER JOIN
                          pessoa AS Pe
                          ON Cl.id=Pe.id;`,
                          [req.params.id],
                          (error, resultado, fields) => {
                              if (error) {
                                  return res.status(500).send({ error: error })
                              }
                              return res.status(200).send({ response: resultado });
                          }
                      );
                    }
                }
            }
        );
    });
});

// LISTAR TODOS OS USUARIOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error});
        }
        conn.query(
            `SELECT Pe.id, Pe.isAdm, Pe.nome, Pe.endereco, Pe.email, Pe.avatar FROM pessoa AS Pe;`,
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({ error: error});
                }
                return res.status(200).send({response: resultado})
            }
        );
    });
});

// ALTERAR UM USUARIO
router.put('/:id', (req, res, next) => {
  mysql.getConnection((error, conn) => {
      if (error) {
          return res.status(500).send({
              error: error
          });
      }
      conn.query(
          'SELECT * FROM pessoa WHERE id=?;',
          [req.params.id],
          (error, results) => {
              if (error) { return res.status(500).send({ error: error }); }
              bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                  if (errBcrypt) {
                      return res.status(500).send({
                          error: errBcrypt
                      });
                  }
                  conn.query(
                      `UPDATE pessoa
                      SET isAdm = ?, nome = ?, endereco = ?, email = ?, senha = ?, avatar = ?
                      WHERE id = ?`,
                      [
                        req.body.isAdm,
                        req.body.nome,
                        req.body.endereco,
                        req.body.email,
                        hash,
                        req.body.avatar,
                        req.params.id
                      ],
                      (error, results) => {
                        if (error) { res.status(500).send({ error: error, response: null });}
                        response = {
                            mensagem: 'Usuário atualizado com sucesso!',
                        }
                        conn.query(
                            'SELECT * FROM pessoa WHERE email=?;',
                            [req.body.email],
                            (error, results) => {
                                if (error) { return res.status(500).send({ error: error }); }
                                if (results[0].isAdm) {
                                  conn.query(
                                      `UPDATE funcionario
                                      SET especializacao = ?
                                      WHERE id = ?`,
                                      [
                                        req.body.especializacao,
                                        req.params.id
                                      ],
                                      (error, results) => {
                                        conn.release();
                                        if (error) { res.status(500).send({ error: error, response: null });}
                                        return res.status(201).send(response);
                                      }
                                  );
                                } else {
                                  conn.release();
                                }
                            }
                        );
                      }
                  );
              });
          }
      );
  });
});

//DELETAR UM USUARIO
router.delete('/:id', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
        return res.status(500).send({ error: error})
    }
    conn.query(
        `SELECT * FROM pessoa WHERE id = ?`,
        [req.params.id],
        (error, results) => {
            if (error) { return res.status(500).send({ error: error }); }
            if (results.length == 0) {
                res.status(406).send({ mensagem: 'Acesso negado!' });
            } else {
                if (results[0].isAdm) {
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if (errBcrypt) {
                            return res.status(500).send({
                                error: errBcrypt
                            });
                        }
                        conn.query(
                            `DELETE FROM funcionario WHERE id = ?`,
                            [req.params.id],
                            (error, resultado, field) => {
                                if (error) { return res.status(500).send({ error: error }); }
                                response = {
                                  mensagem: 'Usuário excluído com sucesso!'
                                }
                                conn.query(
                                    `DELETE FROM pessoa WHERE id = ?`,
                                    [req.params.id],
                                    (error, results, fields) => {
                                        conn.release();
                                        if (error) { return res.status(500).send({ error: error }); }
                                        res.status(202).send(response);
                                    }
                                );
                            }
                        );
                    });
                } else {
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if (errBcrypt) {
                            return res.status(500).send({
                                error: errBcrypt
                            });
                        }
                        conn.query(
                            `DELETE FROM cliente WHERE id = ?`,
                            [req.params.id],
                            (error, resultado, field) => {
                                if (error) { return res.status(500).send({ error: error }); }
                                response = {
                                  mensagem: 'Usuário excluído com sucesso!'
                                }
                                conn.query(
                                    `DELETE FROM pessoa WHERE id = ?`,
                                    [req.params.id],
                                    (error, results, fields) => {
                                        conn.release();
                                        if (error) { return res.status(500).send({ error: error }); }
                                        res.status(202).send(response);
                                    }
                                );
                            }
                        );
                    });
                }
            }
        }
    );
  });
});

module.exports = router;
