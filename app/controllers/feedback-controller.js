const mysql = require('../database/mysql');

 exports.getAvalicao = async (req, res, next) => {
     try {
        const query = `
            SELECT
                feedback.id, pessoa.nome AS cliente, feedback.funcionario, feedback.servico,
                feedback.preco, feedback.data, feedback.hora, feedback.comentario
            FROM feedback, pessoa
            WHERE feedback.Pessoa_id=pessoa.id
            ORDER BY feedback.id DESC
            LIMIT 5;`;
        const result = await mysql.execute(query);
        if (result.length > 0) {
                return res.status(200).send({ response: true, data: result });
        } else {
            return res.status(404).send({ response: false, error: "Sem resultados!" });
        }
     } catch (error) {
        return res.status(500).send({ response: false, error: error });
     }
 };

 exports.setAvalicao = async (req, res, next) => {
      try {
          if (req.usuario.id == req.body.Pessoa_id) {
              const query= `
                INSERT INTO feedback(Pessoa_id, funcionario, servico, preco, data, hora, comentario)
                values(?, ?, ?, ?, ?, ?, ?);
              `;
              const result = await mysql.execute(
                  query,
                  [
                    req.body.Pessoa_id,
                    req.body.funcionario,
                    req.body.servico,
                    req.body.preco,
                    req.body.data,
                    req.body.hora,
                    req.body.comentario
                  ]
              );
              return res.status(200).send({ response: true, data: "Avaliação enviada!" });
          } else {
              return res.status(406).send({ response: false, error: "Acesso negado!" });
          }
      } catch (error) {
          return res.status(500).send({ response: false, error: error });
      }
 };

 exports.updateAvalicao = async (req, res, next) => {
   try {
       const query= `SELECT * FROM feedback WHERE id=?;`;
       const result = await mysql.execute(query, [req.params.id]);
       try {
          if (result.length > 0) {
              if (req.usuario.id == result[0].Pessoa_id) {
                  const query2 = `UPDATE feedback SET comentario=? WHERE id=?;`;
                  const result2 = await mysql.execute(query2, [req.body.comentario, req.params.id]);
                  return res.status(201).send({ response: true, data: "Avaliação Atualizada!" });
              } else {
                  return res.status(406).send({ response: false, error: "Acesso negado!" });
              }
          } else {
              return res.status(404).send({ response: false, error: "Not Found!" });
          }
       } catch (error) {
          return res.status(500).send({ response: false, error: error });
       }
   } catch (error) {
       return res.status(500).send({ response: false, error: error });
   }
 };

 exports.deleteAvalicao = async (req, res, next) => {
   try {
       const query= `SELECT * FROM feedback WHERE id = ?;`;
       const result = await mysql.execute(query, [req.params.id]);
       if (result.length > 0) {
           try {
              if (req.usuario.id == result[0].Pessoa_id) {
                  const query2 = `DELETE FROM feedback WHERE id=?;`;
                  const result2 = await mysql.execute(query2, [req.params.id]);

                  return res.status(202).send({ response: true, data: "Avaliação Excluída!" });
              } else {
                  return res.status(406).send({ response: false, error: "Acesso negado!" });
              }
           } catch (error) {
              return res.status(500).send({ response: false, error: error });
           }
       } else {
           return res.status(406).send({ response: false, error: "Acess denied!" });
       }
   } catch (error) {
       return res.status(500).send({ response: false, error: error });
   }
 };
