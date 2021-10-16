const mysql = require("mysql");
const envs = require('../config/variaveis');

const pool = mysql.createPool({
    "connectionLimit": 100,
    "user": envs.mysql.usuario || process.env.USER,
    "password": envs.mysql.senha || process.PASSWORD,
    "database": envs.mysql.db || process.env.DATABASE,
    "host": process.env.HOST || envs.mysql.host,
    "port": envs.mysql.porta || process.env.PORT
});

exports.execute = (query, params=[]) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    })
}

exports.pool = pool;
