const mysql = require('../database/mysql');

 exports.getAvalicao = async (req, res, next) => {
     try {
        const query = `
            SELECT
                feedback.id, pessoa.nome AS cliente, feedback.funcionario, feedback.servico,
                feedback.preco, feedback.data, feedback.hora, feedback.minuto, feedback.comentario
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

 };

 exports.updateAvalicao = async (req, res, next) => {

 };

 exports.deleteAvalicao = async (req, res, next) => {

 };
