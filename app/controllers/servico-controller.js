const mysql = require('../database/mysql');

// LISTAR TODOS SERVIÇOS:
 exports.getServicos = async (req, res, next) => {
    try {
        const query = `
        SELECT Se.*, Fu.nome AS profissional, Fu.Especializacao
        FROM (
        	  SELECT Sf.servico, F.nome, F.especializacao
        	  FROM servicos_funcionario AS Sf
        	  INNER JOIN (SELECT pessoa.nome, funcionario.id, funcionario.especializacao FROM pessoa, funcionario WHERE pessoa.id=funcionario.id) AS F
        	  ON Sf.funcionario = F.id
        ) AS Fu
        INNER JOIN (
        	SELECT S.id, S.nome, S.descricao,  Es.valor
            FROM (SELECT * FROM empresa_servicos WHERE empresa = 1) AS Es, servicos AS S
            WHERE Es.servico=S.id
        )  AS Se
        ON Se.id = Fu.servico
        ORDER BY Se.id;`;
        const resultado = await mysql.execute(query);

        return res.status(200).send({response: true, data: resultado});
    } catch (error) {
        return res.status(500).send({ response: false, error: error});
    }
};

//LISTAR UM SERVIÇO ESPECIFICO
exports.getById = async (req, res, next) => {
    try {
        const query = `
        SELECT *
        FROM (
        	SELECT Se.*, Fu.nome AS profissional, Fu.especializacao
        	FROM (
        		  SELECT Sf.servico, F.nome, F.especializacao
        		  FROM servicos_funcionario AS Sf
        		  INNER JOIN (SELECT pessoa.nome, funcionario.id, funcionario.especializacao FROM pessoa, funcionario WHERE pessoa.id=funcionario.id) AS F
        		  ON Sf.funcionario = F.id
        	) AS Fu
        	INNER JOIN (
        		SELECT S.id, S.nome, S.descricao,  Es.valor
        		FROM (SELECT * FROM empresa_servicos WHERE empresa = 1) AS Es, servicos AS S
        		WHERE Es.servico=S.id
        	)  AS Se
        	ON Se.id = Fu.servico
            ORDER BY id
        ) AS Services
        WHERE Services.id = ?;`;
        const resultado = await mysql.execute(query, [req.params.id]);
        if (resultado.length > 0) {
            return res.status(200).send({ response: true, data: resultado });
        } else {
            return res.status(404).send({ response: false, mensagem: "Não encontrado!" });
        }

    } catch (error) {
        return res.status(500).send({ response: false, error: error });
    }
};

exports.getServico = async (req, res, next) => {
    try {
        const query = `
           SELECT *
           FROM (
           	SELECT Se.*, Fu.nome AS profissional, Fu.especializacao
           	FROM (
           		  SELECT Sf.servico, F.nome, F.especializacao
           		  FROM servicos_funcionario AS Sf
           		  INNER JOIN (SELECT pessoa.nome, funcionario.id, funcionario.especializacao FROM pessoa, funcionario WHERE pessoa.id=funcionario.id) AS F
           		  ON Sf.funcionario = F.id
           	) AS Fu
           	INNER JOIN (
           		SELECT S.id, S.nome, S.descricao,  Es.valor
           		FROM (SELECT * FROM empresa_servicos WHERE empresa = 1) AS Es, servicos AS S
           		WHERE Es.servico=S.id
           	)  AS Se
           	ON Se.id = Fu.servico
               ORDER BY id
           ) AS Services
           WHERE Services.nome LIKE "%"?"%"
           ORDER BY Services.nome ASC;`;

        const resultado = await mysql.execute(query, [req.params.nome]);

        if (resultado.length > 0) {
            return res.status(200).send({ response: false, data: resultado });
        } else {
            return res.status(404).send({ response: false, error: "Not Found!" });
        }
    } catch (error) {
        return res.status(500).send({ response: false, error: error });
    }
};

// CRIAR SERVIÇOS:
exports.setServico = async (req, res, next) => {
    try {
        const query = `SELECT * FROM servicos WHERE nome=?;`;
        const resultado = await mysql.execute(query, [req.body.nome]);
        if (resultado.length > 0) {
            return res.status(409).send({ response: false, mensagem: "Serviço já cadastrado!" });
        } else {
            try {
                const query1 = `SELECT * FROM funcionario WHERE id = ?;`;
                const result = await mysql.execute(query1, [req.usuario.id]);
                if (result.length > 0) {
                    try {
                        const query2 = `
                            INSERT INTO servicos(nome, descricao, tipoDeServico)
                            VALUES(?,?,?);`;
                        const resposta = await mysql.execute(
                            query2,
                            [
                              req.body.nome,
                              req.body.descricao,
                              req.body.tipoDeServico
                            ]
                        );
                        try {
                          const resultado2 = await mysql.execute(query, [req.body.nome]);
                          if (resultado2.length > 0) {
                              try {
                                  const query3=`
                                      INSERT INTO empresa_servicos(empresa, servico, valor)
                                      VALUES(?,?,?);`;
                                  const resposta2 = await mysql.execute(
                                      query3,
                                      [
                                        req.body.empresa,
                                        resultado2[0].id,
                                        req.body.valor
                                      ]
                                  );
                                  try {
                                      const query4=`
                                          INSERT INTO servicos_funcionario(servico, funcionario)
                                          VALUES(?,?);`;
                                      const resposta3 = await mysql.execute(
                                          query4,
                                          [
                                            resultado2[0].id,
                                            req.body.funcionario
                                          ]
                                      );
                                      return res.status(200).send({ response: true, mensagem: "Serviço cadastrado!" });
                                  } catch (err) {
                                      return res.status(500).send({ response: false, mensagem: "Erro servico_funcionario: "+err });
                                  }
                              } catch (error) {
                                  return res.status(500).send({ response: false, mensagem: "Erro empresa_serviço: "+error });
                              }
                          }
                        } catch (err) {
                            return res.status(500).send({ response: false, err: err });
                        }
                    } catch (e) {
                        return res.status(500).send({ response: false, mensagem: "Erro ao inserir serviço!" });
                    }
                } else {
                    return res.status(406).send({ response: false, mensagem: 'Acesso negado!' });
                }
            } catch (e) {
                return res.status(500).send({ response: false, error: e });
            }
        }
    } catch (error) {
        return res.status(500).send({ response: false, error: error });
    }
};

// ALTERAR UM SERVIÇO:
exports.updateServico = async (req, res, next) => {
    try {
        const query = `SELECT * FROM servicos WHERE id=?;`;
        const resultado = await mysql.execute(query, [req.params.id]);
        if (resultado.length == 0) {
            return res.status(404).send({ response: false, mensagem: "NOT FOUND!" });
        } else {
            try {
                const parametro = req.usuario.id;
                const query1 = `SELECT * FROM funcionario WHERE id = ?;`;
                const result = await mysql.execute(query1, [parametro]);
                if (result.length > 0) {
                    try {
                        const query2 = `
                          UPDATE servicos
                          SET nome=?, descricao=?, tipoDeServico=?
                          WHERE id = ?;`;
                        const resposta = await mysql.execute(
                            query2,
                            [
                              req.body.nome,
                              req.body.descricao,
                              req.body.tipoDeServico,
                              req.params.id
                            ]
                        );
                        try {
                          const resultado2 = await mysql.execute(query, [req.params.id]);
                          if (resultado2.length > 0) {
                              try {
                                  const query3=`
                                      UPDATE empresa_servicos
                                      SET empresa=?, servico=?, valor=?
                                      WHERE servico=?;`;
                                  const resposta2 = await mysql.execute(
                                      query3,
                                      [
                                        req.body.empresa,
                                        resultado2[0].id,
                                        req.body.valor,
                                        req.params.id
                                      ]
                                  );
                                  try {
                                      const query4=`
                                          UPDATE servicos_funcionario
                                          SET servico=?, funcionario=?
                                          WHERE servico=?;`;
                                      const resposta3 = await mysql.execute(
                                          query4,
                                          [
                                            req.params.id,
                                            req.body.funcionario,
                                            req.params.id
                                          ]
                                      );
                                      return res.status(200).send({ response: true, mensagem: "Serviço Atualizado!" });
                                  } catch (err) {
                                      return res.status(500).send({ response: false, mensagem: "Erro servico_funcionario: "+err });
                                  }
                              } catch (error) {
                                  return res.status(500).send({ response: false, mensagem: "Erro empresa_serviço: "+error });
                              }
                          }
                        } catch (err) {
                            return res.status(500).send({ response: false, err: err });
                        }
                    } catch (e) {
                        return res.status(500).send({ response: false, mensagem: "Erro ao atualizar serviço!" });
                    }
                } else {
                    return res.status(406).send({ response: false, mensagem: 'Acesso negado!' });
                }
            } catch (e) {
                return res.status(500).send({ response: false, error: e });
            }
        }
    } catch (error) {
        return res.status(500).send({ response: false, error: error });
    }
};

//DELETAR UM SERVIÇO
exports.deleteServico = async (req, res, next) => {
    try {
        const query = `SELECT * FROM servicos WHERE id=?`;
        const resultado = await mysql.execute(query, [req.params.id]);
        if (resultado.length == 0) {
            return res.status(404).send({ response: false, mensagem: "Not Found!" });
        } else {
            const query1 = `SELECT * FROM funcionario WHERE id = ?;`;
            const result = await mysql.execute(query1, [req.usuario.id]);
            if (result.length > 0) {
                try {
                    const query3=`DELETE FROM empresa_servicos WHERE servico=?;`;
                    const resposta2 = await mysql.execute(query3, [resultado[0].id]);
                    try {
                      const query4=`DELETE FROM servicos_funcionario WHERE servico=?;`;
                      const resposta3 = await mysql.execute(query4, [resultado[0].id]);
                        try {
                            const query2 = `DELETE FROM servicos WHERE id = ?;`;
                            const resposta = await mysql.execute(query2, [resultado[0].id]);

                            return res.status(200).send({ response: true, mensagem: "Serviço excluído!" });
                        } catch (err) {
                            return res.status(500).send({ response: false, mensagem: "Erro ao excluír serviço: "+err });
                        }
                    } catch (error) {
                        return res.status(500).send({ response: false, mensagem: "Erro servico_funcionario: "+error });
                    }
                } catch (e) {
                    return res.status(500).send({ response: false, mensagem: "Erro empresa_serviço: "+e });
                }
            } else {
                return res.status(406).send({ response: false, mensagem: 'Acesso negado!' });
            }
        }
    } catch (error) {
        return res.status(500).send({ response: false, error: error });
    }
};
