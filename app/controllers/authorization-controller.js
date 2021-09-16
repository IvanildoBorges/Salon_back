const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        const query = `SELECT * FROM pessoa WHERE email=?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            if (error) { return res.status(500).send({ error: error }); }
            if (results.length < 1) {
                return res.status(401).send({
                  mensagem: 'Falha na autenticação'
                });
            }
            if (results[0].isAdm) {
                conn.query(
                  `SELECT * FROM (SELECT * FROM funcionario WHERE id = ?) AS Fu
                  INNER JOIN
                  (SELECT P.* FROM pessoa as P, funcionario as F where P.id=F.id) AS Pe
                  ON Fu.id=Pe.id;`,
                  [results[0].id],
                  (error, results, fields) => {
                      conn.release();
                      if (error) { return res.status(500).send({ error: error }); }
                      if (results.length > 0) {
                          bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                              if (err){
                                  return res.status(401).send({
                                    mensagem: 'Falha na autenticação'
                                  });
                              }
                              if (result) {
                                  let token = jwt.sign(
                                    data = {
                                      id: results[0].id,
                                      privilegio: results[0].isAdm,
                                      nome: results[0].nome,
                                      email: results[0].email,
                                      especializacao: results[0].especializacao,
                                      endereco: results[0].endereco,
                                      avatar: results[0].avatar,
                                    },
                                    process.env.JWT_KEY,
                                    {
                                      expiresIn: "5 days"
                                    }
                                  );
                                  return res.status(200).send(
                                    {
                                      token: token
                                    }
                                  );
                              }
                              return res.status(401).send({
                                mensagem: 'Falha na autenticação'
                              });
                          });
                      }
                  }
                );
            } else {
                conn.query(
                  `SELECT Pe.* FROM (SELECT * FROM cliente WHERE id = ?) AS Cl
                  INNER JOIN
                  (SELECT P.* FROM pessoa as P, cliente as C where P.id=C.id) AS Pe
                  ON Cl.id=Pe.id;`,
                  [results[0].id],
                  (error, results, fields) => {
                      conn.release();
                      if (error) { return res.status(500).send({ error: error }); }
                      if (results.length > 0) {
                          bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                              if (err){
                                  return res.status(401).send({
                                    mensagem: 'Falha na autenticação'
                                  });
                              }
                              if (result) {
                                  let token = jwt.sign(
                                    data = {
                                      id: results[0].id,
                                      privilegio: results[0].isAdm,
                                      nome: results[0].nome,
                                      email: results[0].email,
                                      endereco: results[0].endereco,
                                      avatar: results[0].avatar,
                                    },
                                    process.env.JWT_KEY,
                                    {
                                      expiresIn: "5 days"
                                    }
                                  );
                                  return res.status(200).send(
                                    {
                                      token: token
                                    }
                                  );
                              }
                              return res.status(401).send({
                                mensagem: 'Falha na autenticação'
                              });
                          });
                      }
                  }
                );
            }
        });
    });
};

exports.refresh = (req, res, next) => {

}
