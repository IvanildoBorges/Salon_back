const http = require('http');               //Importe para usar o http no projeto
const app = require('../app');           //Recebe as config para ser executadas pelo server
const port = process.env.port || 3000;      //Porta que será usada
const server = http.createServer(app);      //Criando server
server.listen(port);                        //A variavel server irá ser executada na porta mencionada no metodo listen
