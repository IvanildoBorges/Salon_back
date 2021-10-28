const mysql = require('../database/mysql');

 exports.getAgendas = async (req, res, next) => {
  try {
     const query=`SELECT * FROM agenda;`;
     const result = await mysql.execute(query);
     if (result.length > 0) {
        const resposta = [];
        for (i=0; i<result.length; i++) {
            const data = result[i].data;
            var diaAux = data.getDate();
            var mesAux = (data.getMonth()+1);
            var dia = 0;
            var mes = 0;
            if (diaAux < 10) {
                dia = "0"+diaAux;
            } else {
                dia = diaAux;
            }
            if (mesAux < 10) {
                mes = "0"+mesAux;
            } else {
                mes = mesAux;
            }
            var ano = data.getFullYear();
            const dataFormatada = ano+"-"+mes+"-"+dia;
            const hora = result[i].hora.substring(0, 5);
            resposta[i] = {
              data: dataFormatada,
              hora: hora,
              temVaga: result[i].temVaga,
              empresa: result[i].empresa
            };
        }
        return res.status(200).send({ response: true, data: resposta });
     } else {
        return res.status(404).send({ response: false, error: "Not Found!" });
     }
  } catch (error) {
     return res.status(500).send({ response: false, error: error });
  }
 };

 exports.getAgenda = async (req, res, next) => {
  try {
     const query=`SELECT * FROM agenda WHERE id = ?;`;
     const result = await mysql.execute(query, [req.params.id]);
     if (result.length > 0) {
        const resposta = [];
        for (i=0; i < result.length; i++) {
            const data = result[i].data;
            var diaAux = data.getDate();
            var mesAux = (data.getMonth()+1);
            var dia = 0;
            var mes = 0;
            if (diaAux < 10) {
                dia = "0"+diaAux;
            } else {
                dia = diaAux;
            }
            if (mesAux < 10) {
                mes = "0"+mesAux;
            } else {
                mes = mesAux;
            }
            var ano = data.getFullYear();
            const dataFormatada = ano+"-"+mes+"-"+dia;
            const hora = result[i].hora.substring(0, 5);
            resposta[i] = {
              data: dataFormatada,
              hora: hora,
              temVaga: result[i].temVaga,
              empresa: result[i].empresa
            };
        }
        return res.status(200).send({ response: true, data: resposta });
     } else {
        return res.status(404).send({ response: false, error: "Not Found!" });
     }
  } catch (error) {
     return res.status(500).send({ response: false, error: error });
  }
 };

 exports.setAgenda = async (req, res, next) => {
   try {
      if (req.usuario.privilegio) {
         const query = `SELECT * FROM agenda`;
         const result = await mysql.execute(query);
         const resposta = [];
         var encontrouData = "";
         var encontrouHora = "";
         for (i=0; i < result.length; i++) {
             const data = result[i].data;
             var diaAux = data.getDate();
             var mesAux = (data.getMonth()+1);
             var dia = 0;
             var mes = 0;
             if (diaAux < 10) {
                 dia = "0"+diaAux;
             } else {
                 dia = diaAux;
             }
             if (mesAux < 10) {
                 mes = "0"+mesAux;
             } else {
                 mes = mesAux;
             }
             var ano = data.getFullYear();
             const dataFormatada = ano+"-"+mes+"-"+dia;
             const hora = result[i].hora.substring(0, 5);
             resposta[i] = {
                 data: dataFormatada,
                 hora: hora,
                 temVaga: result[i].temVaga,
                 empresa: result[i].empresa
             };
             if (req.body.data == resposta[i].data && req.body.hora == resposta[i].hora) {
                 encontrouData = resposta[i].data;
                 encontrouHora = resposta[i].hora;
                 break;
             }
         }
         if (encontrouData != "") {
            return res.status(409).send({ response: false, error: "Data já cadastrada!" });
         } else {
           if (encontrouHora != "") {
              return res.status(409).send({ response: false, error: "Hora já cadastrada!" });
           } else {
              const query2 = `
                  INSERT INTO agenda(data, hora, temVaga, empresa)
                  VALUES(?, ?, ?, ?)
              `;
              const resposta = await mysql.execute(
                  query2,
                  [
                    req.body.data,
                    req.body.hora,
                    req.body.temVaga,
                    req.body.empresa
                  ]
              );
              return res.status(200).send(
                {
                  response: true,
                  data: "Serviço cadastrado com sucesso!"
                }
              );
           }
         }
      } else {
         return res.status(406).send({ response: false, error: "Acesso negado!"});
      }
   } catch (error) {
      return res.status(500).send({ response: false, error: error });
   }
 };

 exports.updateAgenda = async (req, res, next) => {
   try {
      if (req.usuario.privilegio) {
         const query = `SELECT * FROM agenda WHERE id=?`;
         const result = await mysql.execute(query, [req.params.id]);
         if (result.length > 0) {
           const data = result[0].data;
           var diaAux = data.getDate();
           var mesAux = (data.getMonth()+1);
           var dia = 0;
           var mes = 0;
           if (diaAux < 10) {
               dia = "0"+diaAux;
           } else {
               dia = diaAux;
           }
           if (mesAux < 10) {
               mes = "0"+mesAux;
           } else {
               mes = mesAux;
           }
           var ano = data.getFullYear();
           const dataFormatada = ano+"-"+mes+"-"+dia;
           const hora = result[0].hora.substring(0, 5);
           const resposta = {
               data: dataFormatada,
               hora: hora,
               temVaga: result[0].temVaga,
               empresa: result[0].empresa
           };
          const query2 = `
              UPDATE agenda
              SET data=?, hora=?, temVaga=?, empresa=?
              WHERE id=?;
          `;
          const results = await mysql.execute(
              query2,
              [
                req.body.data,
                req.body.hora,
                req.body.temVaga,
                req.body.empresa,
                req.params.id
              ]
          );
          return res.status(201).send({ response: true, data: "Serviço atualizado com sucesso!" });
        } else {
            return res.status(404).send({ response: false, error: "Not Found!" });
        }
      } else {
         return res.status(406).send({ response: false, error: "Acesso negado!" });
      }
   } catch (error) {
      return res.status(500).send({ response: false, error: error });
   }
 };

 exports.deleteAgenda = async (req, res, next) => {
   try {
      if (req.usuario.privilegio) {
         const query = `SELECT * FROM agenda WHERE id=?`;
         const result = await mysql.execute(query, [req.params.id]);
         if (result.length > 0) {
            const query2 = `DELETE FROM agenda WHERE id=?;`;
            const results = await mysql.execute(query2, [req.params.id]);
            return res.status(202).send({ response: true, data: "Serviço excluído com sucesso!" });
        } else {
            return res.status(404).send({ response: false, error: "Not Found!" });
        }
      } else {
         return res.status(406).send({ response: false, error: "Acesso negado!" });
      }
   } catch (error) {
      return res.status(500).send({ response: false, error: error });
   }
 };
