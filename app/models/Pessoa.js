/**
* classe abstrata
* @abstract
* @constructor
*/

module.exports = class Pessoa {
  constructor(){
    // if (this.constructor == Pessoa) {
    //    throw new Error("Erro: Classe abstrata!");
    // }
    if (this.constructor.name === 'Pessoa') {
      throw new error("Erro! Não é possível instanciar!");
    }
    this.id = "";
    this.nome = "";
    this.isAdm = "";
    this.endereco = "";
    this.email = "";
    this.senha = "";
    this.avatar = "";
  }

// Metodos que serão instanciados de forma de instancia para classe/objeto Pessoa
  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getNome() {
    return this.nome;
  }

  setNome(name) {
    this.nome = name;
  }

  getIsAdm() {
    return this.isAdm;
  }

  setIsAdm(isAdm) {
    this.isAdm = isAdm;
  }

  getEndereco() {
    return this.endereco;
  }

  setEndereco(endereco) {
    this.endereco = endereco;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    this.email = email;
  }

  getSenha() {
    return this.senha;
  }

  setSenha(senha) {
    this.senha = senha;
  }

  getAvatar() {
    return this.avatar;
  }

  setAvatar(avatar) {
    this.avatar = avatar;
  }
}
