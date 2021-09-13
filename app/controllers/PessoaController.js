const PessoaDao = require('../models/dao/PessoaDao');
const Funcionario = require(../models/Funcionario);
const Cliente = require(../models/Cliente);
const Pessoa = require(../models/Pessoa);

module.exports = Class PessoaController{
  constructor() {
    this.pessoadao = new PessoaDao();
  };

  create(nome, isAdmin, endereco, email, senha, avatar) {
    if (isAdm) {
      Pessoa = new Funcionario();
      Pessoa.setEspecializacao(es);
    } else {
      Pessoa = new Cliente();
    }

    Pessoa.setNome(nome);
    Pessoa.setIsAdm(isAdmin);
    Pessoa.setEndereco(endereco);
    Pessoa.setEmail(email);
    Pessoa.setSenha(senha);
    Pessoa.setAvatar(avatar);

    this.pessoadao.createPerson(Pessoa);
  }

  getById(id) {
    const pessoa = Pessoa;
    pessoa = this.pessoadao.getById(id);

    return pessoa;
  }

  listAll() {
    return this.pessoadao.listAll();
  }

  update(nome, isAdmin, endereco, email, senha, avatar) {
    const pessoa = Pessoa;
    if (isAdm) {
      pessoa = new Funcionario();
    } else {
      pessoa = new Cliente();
    }

    pessoa.setNome(nome);
    pessoa.setIsAdm(isAdmin);
    pessoa.setEndereco(endereco);
    pessoa.setEmail(email);
    pessoa.setSenha(senha);
    pessoa.setAvatar(avatar);

    this.pessoadao.updatePerson(pessoa);
  }

  delet(id) {
    this.pessoadao.deletePerson(id);
  }

  login(email, senha) {
    const pessoa = Pessoa;
    pessoa = this.pessoadao.login(email, senha);

    return pessoa.getId();
  }

  checkIsAdm(id) {
    return this.pessoadao.checkIsAdm(id);
  }
}
