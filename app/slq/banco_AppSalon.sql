-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema app_salon
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema app_salon
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `app_salon` DEFAULT CHARACTER SET utf8 ;
USE `app_salon` ;

-- -----------------------------------------------------
-- Table `app_salon`.`Pessoa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`Pessoa` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `isAdm` BOOLEAN NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `endereco` VARCHAR(100) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `senha` VARCHAR(100) NOT NULL,
  `avatar` LONGBLOB, 
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`Cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`Cliente` (
  `id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_Cliente_Pessoa1`
    FOREIGN KEY (`id`)
    REFERENCES `app_salon`.`Pessoa` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`Funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`Funcionario` (
  `id` INT NOT NULL,
  `especializacao` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_Funcionario_Pessoa1`
    FOREIGN KEY (`id`)
    REFERENCES `app_salon`.`Pessoa` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`Empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`Empresa` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`Servicos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`Servicos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `descricao` VARCHAR(50) NOT NULL,
  `tipoDeServico` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`Agenda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`Agenda` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `temVaga` TINYINT NOT NULL DEFAULT 0,
  `empresa` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Agenda_Empresa1_idx` (`empresa` ASC) VISIBLE,
  CONSTRAINT `fk_Agenda_Empresa1`
    FOREIGN KEY (`empresa`)
    REFERENCES `app_salon`.`Empresa` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`Servicos_Funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`Servicos_Funcionario` (
  `servico` INT NOT NULL,
  `funcionario` INT NOT NULL,
  PRIMARY KEY (`servico`, `funcionario`),
  INDEX `fk_Servicos_has_Funcionario_Funcionario1_idx` (`funcionario` ASC) VISIBLE,
  INDEX `fk_Servicos_has_Funcionario_Servicos1_idx` (`servico` ASC) VISIBLE,
  CONSTRAINT `fk_Servicos_has_Funcionario_Servicos1`
    FOREIGN KEY (`servico`)
    REFERENCES `app_salon`.`Servicos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Servicos_has_Funcionario_Funcionario1`
    FOREIGN KEY (`funcionario`)
    REFERENCES `app_salon`.`Funcionario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`Agendamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`Agendamento` (
  `codigo` INT NOT NULL,
  `cliente` INT NOT NULL,
  `agenda` INT NOT NULL,
  `servico` INT NOT NULL,
  `funcionario` INT NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`codigo`),
  INDEX `fk_Agendamento_Cliente1_idx` (`cliente` ASC) VISIBLE,
  INDEX `fk_Agendamento_Agenda1_idx` (`agenda` ASC) VISIBLE,
  INDEX `fk_Agendamento_Servicos_Funcionario1_idx` (`servico` ASC, `funcionario` ASC) VISIBLE,
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC) VISIBLE,
  CONSTRAINT `fk_Agendamento_Cliente1`
    FOREIGN KEY (`cliente`)
    REFERENCES `app_salon`.`Cliente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Agendamento_Agenda1`
    FOREIGN KEY (`agenda`)
    REFERENCES `app_salon`.`Agenda` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Agendamento_Servicos_Funcionario1`
    FOREIGN KEY (`servico` , `funcionario`)
    REFERENCES `app_salon`.`Servicos_Funcionario` (`servico` , `funcionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`Empresa_Servicos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`Empresa_Servicos` (
  `empresa` INT NOT NULL,
  `servico` INT NOT NULL,
  `valor` FLOAT(7,2) NOT NULL,
  PRIMARY KEY (`empresa`, `servico`),
  INDEX `fk_Empresa_has_Servicos_Servicos1_idx` (`servico` ASC) VISIBLE,
  INDEX `fk_Empresa_has_Servicos_Empresa1_idx` (`empresa` ASC) VISIBLE,
  CONSTRAINT `fk_Empresa_has_Servicos_Empresa1`
    FOREIGN KEY (`empresa`)
    REFERENCES `app_salon`.`Empresa` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Empresa_has_Servicos_Servicos1`
    FOREIGN KEY (`servico`)
    REFERENCES `app_salon`.`Servicos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`favoritos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`favoritos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cliente` INT NOT NULL,
  `servico` INT NOT NULL,
  PRIMARY KEY (`id`, `cliente`),
  INDEX `fk_favoritos_cliente_idx` (`cliente` ASC) VISIBLE,
  INDEX `fk_favoritos_servico_idx` (`servico` ASC) VISIBLE,
  CONSTRAINT `fk_favoritos_cliente`
    FOREIGN KEY (`cliente`)
    REFERENCES `app_salon`.`Cliente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_favoritos_servico`
    FOREIGN KEY (`servico`)
    REFERENCES `app_salon`.`Servicos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`agendados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`agendados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Agenda_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_agendados_Agenda1_idx` (`Agenda_id` ASC) VISIBLE,
  CONSTRAINT `fk_agendados_Agenda1`
    FOREIGN KEY (`Agenda_id`)
    REFERENCES `app_salon`.`Agenda` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `app_salon`.`feedback`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_salon`.`feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Pessoa_id` INT NOT NULL,
  `funcionario` VARCHAR(50) NOT NULL,
  `servico` VARCHAR(45) NOT NULL,
  `preco` FLOAT(7,2) NOT NULL,
  `data` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `comentario` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`, `Pessoa_id`),
  INDEX `fk_feedback_Pessoa1_idx` (`Pessoa_id` ASC) VISIBLE,
  CONSTRAINT `fk_feedback_Pessoa1`
    FOREIGN KEY (`Pessoa_id`)
    REFERENCES `app_salon`.`Pessoa` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- INSERÇÕES NO BANCO
INSERT INTO app_salon.pessoa(isAdm, nome, endereco, email, senha, avatar)
values(
    true,
	"Ivan",
    "Rua Borginho, 2021",
    "ivan@appsalon.com.br",
    "$2b$10$VIKWljgW7r133m2vHdHyuOqBK8myHSi1KN9LED3HC7Lq8Bhc5s1Oq",
    null
);

INSERT INTO app_salon.pessoa(isAdm, nome, endereco, email, senha, avatar)
values(
    false,
	"Ingrid",
    "Sitio Onde Judas Perdeu as Botas",
    "ingridmariza@gmail.com",
    "$2b$10$eMHdZ9v66Qf4WnjKdkaUQO8nSpdSW5528qTO886wh9b9FAZlbXzvG",
    null
);

INSERT INTO app_salon.pessoa(isAdm, nome, endereco, email, senha, avatar)
values(
    false,
	"Welenilson",
    "Riachinho, Ceara, Brasil",
    "we.marketing@live.com",
    "$2b$10$gP05YWNVDnWBPzqPnKXXq.p0j3sU9Lw1K4oZsU0skx06j0on6DLwe",
    null
);

INSERT INTO app_salon.pessoa(isAdm, nome, endereco, email, senha, avatar)
values(
    false,
	"Ingride",
    "Sitio Onde Judas Perdeu as Botas",
    "ingride@gmail.com",
    "$2b$10$YwVKzCkl6DPFb6fOp7/3buIq/Ukd3ak1N7e2daFh8hX7k.cdd0o6i",
    null
);

INSERT INTO app_salon.pessoa(isAdm, nome, endereco, email, senha, avatar)
values(
    true,
	"Blind",
    "Varzea Alegre, Ceara, Brasil",
    "blind@appsalon.com.br",
    "$2b$10$JMOIfVm96D6R7iZO2c0znuh4IKNs4I0SUvFR4IB5CplfewjNjtjLu",
    null
);

INSERT INTO app_salon.pessoa(isAdm, nome, endereco, email, senha, avatar)
values(
    false,
	"Ellen",
    "Eusébio, Ceara, Brasil",
    "ellen.maria@gmail.com",
    "$2b$10$j/aJAgqTEUx5jCf3lt4q3eU0kGCfTUOSq.qSiUOiIQCS7QBG9FBku",
    null
);

INSERT INTO app_salon.pessoa(isAdm, nome, endereco, email, senha, avatar)
values(
    false,
	"Aline",
    "Sitio Chico",
    "aline.htinha.fiuza@gmail.com",
    "$2b$10$j/aJAgqTEUx5jCf3lt4q3eU0kGCfTUOSq.qSiUOiIQCS7QBG9FBku",
    null
);

INSERT INTO app_salon.pessoa(isAdm, nome, endereco, email, senha, avatar)
values(
    false,
	"Marisergio",
    "Cedro, Ceará, Brasil",
    "marisergio@ifce.edu.br",
    "$2b$10$PQLTdQlFccpL6yA/awrqPODlCxAnGw4CnkC9LrQaI2kng2fMkwl1u",
    null
);

INSERT INTO app_salon.funcionario(id, especializacao)
values(1, "Barbeiro");

INSERT INTO app_salon.funcionario(id, especializacao)
values(5, "Cabelereiro");

INSERT INTO app_salon.cliente(id)
values(2);

INSERT INTO app_salon.cliente(id)
values(3);

INSERT INTO app_salon.cliente(id)
values(4);

INSERT INTO app_salon.cliente(id)
values(6);

INSERT INTO app_salon.cliente(id)
values(7);

INSERT INTO app_salon.cliente(id)
values(8);

INSERT INTO app_salon.empresa(nome)
values("AS INGRID'S SALÃO");

INSERT INTO app_salon.servicos(nome, descricao, tipoDeServico)
values(
	"Moicano",
    "Corte masculino",
    "Cabelereiro"
);

INSERT INTO app_salon.servicos(nome, descricao, tipoDeServico)
values(
	"Undercut",
    "Corte masculino",
    "Cabelereiro"
);

INSERT INTO app_salon.servicos(nome, descricao, tipoDeServico)
values(
	"Chanel",
    "Corte masculino",
    "Cabelereiro"
);

INSERT INTO app_salon.servicos(nome, descricao, tipoDeServico)
values(
	"Especial da casa",
    "Corte masculino",
    "Cabelereiro"
);

INSERT INTO app_salon.servicos(nome, descricao, tipoDeServico)
values(
	"Feita",
    "Barba premium",
    "Barbeiro"
);

INSERT INTO app_salon.servicos(nome, descricao, tipoDeServico)
values(
	"Por fazer",
    "Barba comum",
    "Barbeiro"
);

INSERT INTO app_salon.servicos(nome, descricao, tipoDeServico)
values(
	"Bigode",
    "Barba somente bigode",
    "Barbeiro"
);

INSERT INTO app_salon.servicos(nome, descricao, tipoDeServico)
values(
	"Especial da casa",
    "Barba estilizada",
    "Barbeiro"
);

INSERT INTO app_salon.servicos_funcionario(servico, funcionario)
values(
	1,
    5
);

INSERT INTO app_salon.servicos_funcionario(servico, funcionario)
values(
	2,
    5
);

INSERT INTO app_salon.servicos_funcionario(servico, funcionario)
values(
	3,
    5
);

INSERT INTO app_salon.servicos_funcionario(servico, funcionario)
values(
	4,
    5
);

INSERT INTO app_salon.servicos_funcionario(servico, funcionario)
values(
	5,
    1
);

INSERT INTO app_salon.servicos_funcionario(servico, funcionario)
values(
	6,
    1
);

INSERT INTO app_salon.servicos_funcionario(servico, funcionario)
values(
	7,
    1
);

INSERT INTO app_salon.servicos_funcionario(servico, funcionario)
values(
	8,
    1
);

INSERT INTO app_salon.empresa_servicos(empresa, servico, valor)
values(1, 1, 10.00);

INSERT INTO app_salon.empresa_servicos(empresa, servico, valor)
values(1, 2, 15.00);

INSERT INTO app_salon.empresa_servicos(empresa, servico, valor)
values(1, 3, 10.00);

INSERT INTO app_salon.empresa_servicos(empresa, servico, valor)
values(1, 4, 20.00);

INSERT INTO app_salon.empresa_servicos(empresa, servico, valor)
values(1, 5, 10.00);

INSERT INTO app_salon.empresa_servicos(empresa, servico, valor)
values(1, 6, 5.00);

INSERT INTO app_salon.empresa_servicos(empresa, servico, valor)
values(1, 7, 5.00);

INSERT INTO app_salon.empresa_servicos(empresa, servico, valor)
values(1, 8, 15.00);

INSERT INTO app_salon.feedback(Pessoa_id, funcionario, servico, preco, data, hora, comentario)
VALUES(4, 5, "Moicano", 10.00, "2021-09-23", "09:30", "Profissional atencioso e habilidoso. Eu confio!");

INSERT INTO app_salon.feedback(Pessoa_id, funcionario, servico, preco, data, hora, comentario)
VALUES(7, 5, "Franja", 10.00, "2021-09-27", "08:30", "SIMPLESMENTE O MELHOR! Super atencioso, rápido e profissional, SUPER RECOMENDO!");

INSERT INTO app_salon.feedback(Pessoa_id, funcionario, servico, preco, data, hora, comentario)
VALUES(2, 5, "Franja", 15.00, "2021-09-23", "08:30", "RECOMENDO BLIND CABELEREIRO O MELHOR!");

INSERT INTO app_salon.feedback(Pessoa_id, funcionario, servico, preco, data, hora, comentario)
VALUES(3, 1, "Bigode", 5.00, "2021-09-23", "10:30", "Recomendo!");

INSERT INTO app_salon.feedback(Pessoa_id, funcionario, servico, preco, data, hora, comentario)
VALUES(4, 1, "Especial da casa", 15.00, "2021-09-23", "07:00", "Super recomendo este profissional!");

INSERT INTO app_salon.feedback(Pessoa_id, funcionario, servico, preco, data, hora, comentario)
VALUES(6, 5, "Franja", 10.00, "2021-09-23", "07:30", "Super profissional, trata bem e rápido. AMEI!!!");

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "7:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "7:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "8:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "8:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "9:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "9:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "10:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "10:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "11:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "13:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "13:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "14:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "14:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "15:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "15:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "16:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-01", "16:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "7:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "7:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "8:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "8:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "9:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "9:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "10:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "10:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "11:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "13:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "13:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "14:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "14:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "15:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "15:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "16:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-02", "16:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "7:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "7:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "8:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "8:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "9:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "9:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "10:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "10:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "11:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "13:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "13:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "14:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "14:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "15:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "15:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "16:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-03", "16:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "7:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "7:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "8:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "8:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "9:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "9:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "10:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "10:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "11:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "13:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "13:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "14:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "14:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "15:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "15:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "16:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-04", "16:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "7:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "7:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "8:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "8:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "9:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "9:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "10:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "10:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "11:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "13:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "13:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "14:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "14:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "15:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "15:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "16:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-05", "16:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "7:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "7:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "8:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "8:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "9:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "9:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "10:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "10:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "11:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "13:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "13:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "14:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "14:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "15:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "15:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "16:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-06", "16:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "7:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "7:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "8:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "8:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "9:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "9:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "10:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "10:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "11:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "13:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "13:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "14:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "14:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "15:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "15:30", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "16:00", true, 1);

INSERT INTO app_salon.agenda(data, hora, temVaga, empresa)
VALUES("2021-10-07", "16:30", true, 1);

INSERT INTO app_salon.agendamento
VALUES(2021000001, 2, 1, 2, 5, false);

UPDATE app_salon.agenda
SET temVaga = false
WHERE id=1;

INSERT INTO app_salon.favoritos(cliente, servico)
VALUES(2, 2);