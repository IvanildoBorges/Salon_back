const mysql = require('../database/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    try {
        const query = `SELECT * FROM pessoa WHERE email=?;`;
        const results = await mysql.execute(query, [req.body.email]);
        if (results.length < 1) {
            return res.status(401).send({ mensagem: 'Falha na autenticação' });
        }
        if (results[0].isAdm) {
            try {
                const query2 = `
                SELECT * FROM (SELECT * FROM funcionario WHERE id = ?) AS Fu
                INNER JOIN
                (SELECT P.* FROM pessoa as P, funcionario as F where P.id=F.id) AS Pe
                ON Fu.id=Pe.id;`
                const results2 = await mysql.execute(query2, [results[0].id]);
                if (results2.length > 0) {
                    try {
                        const resultado = await bcrypt.compare(req.body.senha, results2[0].senha);
                        try {
                            if  (resultado) {
                                let token = await jwt.sign(
                                    data = {
                                      id: results2[0].id,
                                      privilegio: results2[0].isAdm,
                                      nome: results2[0].nome,
                                      email: results2[0].email,
                                      especializacao: results2[0].especializacao,
                                      endereco: results2[0].endereco,
                                      avatar: results2[0].avatar,
                                    },
                                    process.env.JWT_KEY,
                                    {
                                      expiresIn: "5 days"
                                    }
                                );
                                console.log({privilegio: results2[0].isAdm});
                                return res.status(200).send({
                                    data: {
                                      id: results2[0].id,
                                      privilegio: results2[0].isAdm,
                                      nome: results2[0].nome,
                                      email: results2[0].email,
                                      especializacao: results2[0].especializacao,
                                      endereco: results2[0].endereco,
                                      avatar: results2[0].avatar,
                                    },
                                    token: token
                                });
                            } else {
                                return res.status(401).send({ mensagem: 'Falha na autenticação' });
                            }
                        } catch (error) {
                            //console.error(error);
                            return res.status(401).send({ mensagem: 'Falha na autenticação' });
                        }
                    } catch (errBcrypt) {
                        return res.status(401).send({ error: errBcrypt });
                    }
                }
            } catch (error) {
                return res.status(500).send({ error: error });
            }
        } else {
            try {
                const query2 = `
                SELECT Pe.* FROM (SELECT * FROM cliente WHERE id = ?) AS Cl
                INNER JOIN
                (SELECT P.* FROM pessoa as P, cliente as C where P.id=C.id) AS Pe
                ON Cl.id=Pe.id;`
                const results3 = await mysql.execute(query2, [results[0].id]);
                if (results3.length > 0) {
                    try {
                        const resultado = await bcrypt.compare(req.body.senha, results3[0].senha);
                        try {
                            if  (resultado) {
                                let token = await jwt.sign(
                                    data = {
                                      id: results3[0].id,
                                      privilegio: results3[0].isAdm,
                                      nome: results3[0].nome,
                                      email: results3[0].email,
                                      endereco: results3[0].endereco,
                                      avatar: results3[0].avatar,
                                    },
                                    process.env.JWT_KEY,
                                    {
                                      expiresIn: "5 days"
                                    }
                                );
                                console.log({privilegio: results3[0].isAdm});
                                return res.status(200).send({
                                    data: {
                                      id: results3[0].id,
                                      privilegio: results3[0].isAdm,
                                      nome: results3[0].nome,
                                      email: results3[0].email,
                                      endereco: results3[0].endereco,
                                      avatar: results3[0].avatar,
                                    },
                                    token: token
                                });
                            } else {
                                return res.status(401).send({ mensagem: 'Falha na autenticação' });
                            }
                        } catch (error) {
                            //console.error(error);
                            return res.status(401).send({ mensagem: 'Falha na autenticação' });
                        }
                    } catch (errBcrypt) {
                        //console.error(errBcrypt);
                        return res.status(401).send({ error: errBcrypt });
                    }
                }
            } catch (error) {
                return res.status(500).send({ error: error });
            }
        }
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const token = req.body.token;
        const decode = jwt.verify(token, process.env.JWT_KEY);
        try {
            if (decode) {
                if (decode.privilegio) {
                    const json = {
                        data: {
                            id: decode.id,
                            privilegio: decode.privilegio,
                            nome: decode.nome,
                            email: decode.email,
                            especializacao: decode.especializacao,
                            endereco: decode.endereco,
                            avatar: decode.avatar
                        },
                        token
                    };
                    return res.status(200).send(json);
                } else {
                    const json = {
                        data: {
                            id: decode.id,
                            privilegio: decode.privilegio,
                            nome: decode.nome,
                            email: decode.email,
                            endereco: decode.endereco,
                            avatar: decode.avatar
                        },
                        token
                    };
                    return res.status(200).send(json);
                }
            } else {
                return res.status(500).send({ token: false, mensagem: "Token expirado!" });
            }
        } catch (error) {
            return res.status(500).send({ token: false, error: error });
        }
    } catch(error) {
        return res.status(401).send({ token: false, mensagem: 'Token inválido!' });
    }
}


exports.verificao = async (req, res, next) => {
  try {
      const decode = jwt.verify(req.body.token, process.env.JWT_KEY);
      req.usuario = decode;
      next();
  } catch(error) {
      return res.status(401).send({ mensagem: 'Falha na autenticação!' });
  }
}
