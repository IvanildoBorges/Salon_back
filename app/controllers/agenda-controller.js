const mysql = require('../database/mysql');

 exports.getAgenda = async (req, res, next) => {
   try {
     const query=`SELECT * FROM agenda;`;
     const result = await mysql.execute(query);


   } catch (error) {
     return res.status(500).send({ response: false, error: error });
   }
 };

 exports.setAgenda = async (req, res, next) => {

 };

 exports.updateAgenda = async (req, res, next) => {

 };

 exports.deleteAgenda = async (req, res, next) => {

 };
