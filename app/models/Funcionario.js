const Pessoa = require('./Pessoa');

module.exports = Class Funcionario extends Pessoa{
  constructor() {
    this.especializacao = "";
  }

  function getEspecializacao() {
    return this.especializacao;
  }

  function setEspecializacao(es) {
    this.especializacao = es;
  }
}
