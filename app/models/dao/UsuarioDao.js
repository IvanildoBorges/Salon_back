const mysql = require('../../database/mysql').pool;

module.exports = class SetUsuario {
  constructor(email, id) {
    this.email = email;
    this.id = id;
  }

  setUsuario() {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        conn.query(
            'SELECT * FROM pessoa WHERE email=?;',
            [this.email],
            (error, results) => {
                if (error) { return res.status(500).send({ error: error }); }
                if (results[0].isAdm) {
                  conn.query(
                      `INSERT INTO funcionario(id) VALUES (?)`,
                      [results[0].id],
                      (error, results) => {
                        conn.release();
                        if (error) { res.status(500).send({ error: error, response: null });}
                        response = {
                            mensagem: 'Funcionario inserido com sucesso!',
                        }
                        return console.log(response);
                      }
                  );
                } else {
                  conn.query(
                      `INSERT INTO cliente(id) VALUES (?)`,
                      [results[0].id],
                      (error, results) => {
                        conn.release();
                        if (error) { res.status(500).send({ error: error, response: null });}
                        response = {
                            mensagem: 'Cliente inserido com sucesso!',
                        }
                        return console.log(response);
                      }
                  );
                }
            }
        );
    });
  }


  
}
