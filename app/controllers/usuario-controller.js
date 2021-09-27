const mysql = require('../database/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsuarios = async (req, res, next) => {
    try {
        const query = `
          SELECT Pe.id, Pe.isAdm, Pe.nome, Pe.endereco, Pe.email, Pe.avatar
          FROM pessoa AS Pe;`

        const result = await mysql.execute(query);

        return res.status(200).send({response: result});
    } catch (error) {
        return res.status(500).send({ Erro: error});
    }
};

exports.getUsuario = async (req, res, next) => {
    try {
        const query = `SELECT * FROM pessoa WHERE id=?;`;
        const resultado = await mysql.execute(query, [req.params.id]);
        if (resultado.length == 0) {
            res.status(404).send({ response: false, mensagem: 'Sem resultados!' });
        } else {
            if (resultado[0].isAdm) {
                try {
                    const query2 = `
                      SELECT Pe.id, Pe.isAdm, Pe.nome, Fu.especializacao, Pe.endereco, Pe.email, Pe.avatar
                      FROM (SELECT * FROM funcionario WHERE id = ?) AS Fu
                      INNER JOIN
                      pessoa AS Pe
                      ON Fu.id=Pe.id;`;
                    const result = await mysql.execute(query2, [req.params.id]);

                    return res.status(200).send({ response: true, dados: result });
              } catch (error) {
                  return res.status(500).send({ response: false, error: error })
              }
            } else {
                try {
                    const query3 = `
                      SELECT Pe.id, Pe.isAdm, Pe.nome, Pe.endereco, Pe.email, Pe.avatar
                      FROM (SELECT * FROM cliente WHERE id=?) AS Cl
                      INNER JOIN
                      pessoa AS Pe
                      ON Cl.id=Pe.id;`;
                    const result = await mysql.execute(query3, [req.params.id]);

                    return res.status(200).send({ response: true, dados: result });
                } catch (error) {
                    return res.status(500).send({ response: false, error: error })
                }
            }
        }
    } catch (error) {
        return res.status(500).send({ response: false, error: error });
    }
};

exports.setUsuario = async (req, res, next) => {
    try {
      const query = `SELECT * FROM pessoa WHERE email=?;`;
      const results = await mysql.execute(query, [req.body.email]);

      if (results.length > 0) {
          res.status(409).send({ response: false, mensagem: 'Usuário já cadastrado!' });
      } else {
          try {
              const hash = await bcrypt.hash(req.body.senha, 10);
              try {
                  const query2 = `
                    INSERT INTO pessoa(isAdm, nome, endereco, email, senha, avatar)
                    VALUES (?,?,?,?,?,?);`;
                  const results = await mysql.execute(
                      query2,
                      [
                        req.body.isAdm,
                        req.body.nome,
                        req.body.endereco,
                        req.body.email,
                        hash,
                        req.body.avatar
                      ]
                  );
                  try {
                      const resposta = await mysql.execute(
                          query,
                          [req.body.email]
                      );
                      if (resposta[0].isAdm) {
                          try {
                              const query3 = `
                                INSERT INTO funcionario(id, especializacao)
                                VALUES (?,?);`
                              const resp1 = await mysql.execute(
                                  query3,
                                  [
                                    resposta[0].id,
                                    req.body.especializacao
                                  ]
                              );
                              let token = await jwt.sign(
                                  data = {
                                    id: resposta[0].id,
                                    privilegio: resposta[0].isAdm,
                                    nome: resposta[0].nome,
                                    email: resposta[0].email,
                                    especializacao: resposta[0].especializacao,
                                    endereco: resposta[0].endereco,
                                    avatar: resposta[0].avatar,
                                  },
                                  process.env.JWT_KEY,
                                  {
                                    expiresIn: "5 days"
                                  }
                              );
                              response = {
                                  response: true,
                                  data: {
                                    id: resposta[0].id,
                                    privilegio: resposta[0].isAdm,
                                    nome: resposta[0].nome,
                                    email: resposta[0].email,
                                    especializacao: resposta[0].especializacao,
                                    endereco: resposta[0].endereco,
                                    avatar: resposta[0].avatar,
                                  },
                                  token: token
                              }
                              return res.status(201).send(response);
                          } catch (error) {
                              res.status(500).send({
                                  error: error, response: false
                              });
                          }
                      } else {
                          try {
                              const query4 = `
                                INSERT INTO cliente(id) VALUES (?);`
                              const resp2 = await mysql.execute(
                                  query4,
                                  [resposta[0].id]
                              );
                              let token = await jwt.sign(
                                  data = {
                                    id: resposta[0].id,
                                    privilegio: resposta[0].isAdm,
                                    nome: resposta[0].nome,
                                    email: resposta[0].email,
                                    endereco: resposta[0].endereco,
                                    avatar: resposta[0].avatar,
                                  },
                                  process.env.JWT_KEY,
                                  {
                                    expiresIn: "5 days"
                                  }
                              );
                              response = {
                                response: true,
                                data: {
                                  id: resposta[0].id,
                                  privilegio: resposta[0].isAdm,
                                  nome: resposta[0].nome,
                                  email: resposta[0].email,
                                  endereco: resposta[0].endereco,
                                  avatar: resposta[0].avatar,
                                },
                                token: token
                              }
                              return res.status(201).send(response);
                          } catch (error) {
                              res.status(500).send({ error: error, response: false });
                          }
                      }
                  } catch (error) {
                      return res.status(500).send({ response: false, error: error });
                  }
              } catch (error) {
                  res.status(500).send({ error: error, response: false });
              }
          } catch (errBcrypt) {
              return res.status(500).send({ response: false, error: errBcrypt });
          }
      }
    } catch (error) {
        return res.status(500).send({ response: false, error: error });
    }
};

exports.updateUsuario = async (req, res, next) => {
  try {
      const query = `SELECT * FROM pessoa WHERE id=?;`;
      const results = await mysql.execute(query, [req.params.id]);
      if (results.length == 0) {
          res.status(406).send({ response: false, mensagem: 'Acesso negado!' });
      } else {
          if (results[0].isAdm && (req.usuario.id == results[0].id)) {
              try {
                  const hash = await bcrypt.hash(req.body.senha, 10);
                  try {
                      const query2 = `
                        UPDATE pessoa
                        SET isAdm = ?, nome = ?, endereco = ?, email = ?, senha = ?, avatar = ?
                        WHERE id = ?`;
                      const results = await mysql.execute(
                          query2,
                          [
                            req.body.isAdm,
                            req.body.nome,
                            req.body.endereco,
                            req.body.email,
                            hash,
                            req.body.avatar,
                            req.params.id
                          ]
                      );
                      response = {
                          response: true,
                          mensagem: 'Usuário atualizado com sucesso!',
                      }
                      try {
                          const resposta = await mysql.execute(query, [req.params.id]);
                          try {
                              const query3 = `
                                UPDATE funcionario
                                SET id=?, especializacao = ?
                                WHERE id = ?;`;
                              const results = await mysql.execute(
                                  query3,
                                  [
                                    resposta[0].id,
                                    req.body.especializacao,
                                    resposta[0].id
                                  ]
                              );

                              return res.status(201).send(response);
                          } catch (error) {
                              res.status(500).send({ error: error, response: false });
                          }
                      } catch (error) {
                          return res.status(500).send({ response: false, error: error });
                      }
                  } catch (error) {
                      res.status(500).send({ error: error, response: false });
                  }
              } catch (errBcrypt) {
                  return res.status(500).send({ response: false, error: errBcrypt });
              }
          } else if (!results[0].isAdm && (req.usuario.id == results[0].id)) {
              try {
                  const hash = await bcrypt.hash(req.body.senha, 10);
                  try {
                      const query2 = `
                        UPDATE pessoa
                        SET isAdm = ?, nome = ?, endereco = ?, email = ?, senha = ?, avatar = ?
                        WHERE id = ?`;
                      const results = await mysql.execute(
                          query2,
                          [
                            req.body.isAdm,
                            req.body.nome,
                            req.body.endereco,
                            req.body.email,
                            hash,
                            req.body.avatar,
                            req.params.id
                          ]
                      );
                      response = {
                          response: true,
                          mensagem: 'Usuário atualizado com sucesso!',
                      }
                      try {
                          const resposta = await mysql.execute(query, [req.params.id]);
                          try {
                              const query3 = `
                                UPDATE funcionario
                                SET id=?, especializacao = ?
                                WHERE id = ?;`
                              const resp2 = await mysql.execute(
                                  query3,
                                  [
                                    resposta[0].id,
                                    req.body.especializacao,
                                    resposta[0].id
                                  ]
                              );

                              return res.status(201).send(response);
                          } catch (error) {

                          }
                      } catch (error) {
                          return res.status(500).send({ response: false, error: error });
                      }
                  } catch (error) {
                      res.status(500).send({ error: error, response: false });
                  }
              } catch (errBcrypt) {
                  return res.status(500).send({ response: false, error: errBcrypt });
              }
          } else {
              return res.status(406).send({ response: false, mensagem: 'Acesso negado!!!' });
          }
      }
  } catch (error) {
      return res.status(500).send({ response: false, error: error });
  }
};

exports.deleteUsuario = async (req, res, next) => {
  try {
      const query = `SELECT * FROM pessoa WHERE id=?;`;
      const results = await mysql.execute(query, [req.params.id]);
      if (results.length == 0) {
          return res.status(406).send({ response: false, mensagem: 'Acesso negado!' });
      } else {
          if (results[0].isAdm && (req.usuario.id === results[0].id)) {
              try {
                  const hash = await bcrypt.hash(req.body.senha, 10);
                  try {
                    const query2 = `DELETE FROM funcionario WHERE id = ?;`;
                    const resultado = await mysql.execute(query2, [req.params.id]);
                    response = {
                        response: true,
                        mensagem: 'Usuário excluído com sucesso!'
                    }
                    try {
                        const query3 = `DELETE FROM pessoa WHERE id = ?;`;
                        const results = await mysql.execute(query3, [req.params.id]);

                        return res.status(202).send(response);
                    } catch (error) {
                        return res.status(500).send({ response: false, error: error });
                    }
                  } catch (error) {
                      return res.status(500).send({ response: false, error: error });
                  }
              } catch (errBcrypt) {
                  return res.status(500).send({ response: false, error: errBcrypt });
              }
          } else if (!results[0].isAdm && req.usuario.id==results[0].id) {
              try {
                  const hash = await bcrypt.hash(req.body.senha, 10);
                  try {
                    const query2 = `DELETE FROM cliente WHERE id = ?;`;
                    const resultado = await mysql.execute(query2, [req.params.id]);
                    response = {
                        response: true,
                        mensagem: 'Usuário excluído com sucesso!'
                    }
                    try {
                        const query3 = `DELETE FROM pessoa WHERE id = ?;`;
                        const results = await mysql.execute(query3, [req.params.id]);

                        return res.status(202).send(response);
                    } catch (error) {
                        return res.status(500).send({ response: false, error: error });
                    }
                  } catch (error) {
                      return res.status(500).send({ response: false, error: error });
                  }
              } catch (errBcrypt) {
                  return res.status(500).send({ response: false, error: errBcrypt });
              }
          } else {
              return res.status(406).send({ response: false, mensagem: 'Acesso negado!!!' });
          }
      }
  } catch (error) {
      return res.status(500).send({ response: false, error: error });
  }
};
