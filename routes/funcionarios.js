const express = require("express");
const router = express.Router();

//RETORNA TODOS OS FUNCIONARIOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Lista de todos os funcionarios"
    });
});

//INSERE UM FUNCIONARIO
router.post('/', (req, res, next) => {

    const funcionario = {
        nome: req.body.nome,
        empresa: req.body.empresa,
        cargo: req.body.cargo,
        especializacao: req.body.especializacao
    }

    res.status(201).send({
        mensagem: "Funcionario inserido com sucesso!",
        funcionarioCriado: funcionario
    }); 
});

//RETORNA UM FUNCIONARIO ESPECIFICO
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    if (id == "1") {
        res.status(200).send({
            mensagem: "Funcionario 1"
        });
    } else {
        res.status(200).send({
            mensagem: "Funcionario não encontrado"
        });
    }
});

//ATUALIZA UM FUNCIONARIO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Funcionario alterado com sucesso!"
    });
});

//DELETA CONTA FUNCIONARIO
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    if (id == "1") {
        res.status(201).send({
            mensagem: "Funcionario 1 apagado!"
        });
    } else {
        res.status(200).send({
            mensagem: "Funcionario não encontrado"
        });
    }
});

//Exportando a rota
module.exports = router; 