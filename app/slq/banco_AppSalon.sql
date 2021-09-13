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
  `avatar` LONGBLOB NOT NULL, 
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
  `diaDaSemana` VARCHAR(45) NOT NULL,
  `hora` INT NOT NULL,
  `minuto` INT NOT NULL,
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
  `valor` FLOAT NOT NULL,
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
  `Cliente_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Cliente_id`),
  INDEX `fk_favoritos_Cliente1_idx` (`Cliente_id` ASC) VISIBLE,
  CONSTRAINT `fk_favoritos_Cliente1`
    FOREIGN KEY (`Cliente_id`)
    REFERENCES `app_salon`.`Cliente` (`id`)
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
INSERT INTO app_salon.pessoa(nome, endereco, email, senha, avatar)
values(
	"Ivan",
    true,
    "Rua Borginho, 2021",
    "ivan@appsalon.com.br",
    "$2b$10$VIKWljgW7r133m2vHdHyuOqBK8myHSi1KN9LED3HC7Lq8Bhc5s1Oq",
    null
);

INSERT INTO app_salon.pessoa(nome, endereco, email, senha, avatar)
values(
	"Ingrid",
    false,
    "Sitio Onde Judas Perdeu as Botas",
    "ingridmariza@gmail.com",
    "$2b$10$eMHdZ9v66Qf4WnjKdkaUQO8nSpdSW5528qTO886wh9b9FAZlbXzvG",
    null
);

INSERT INTO app_salon.pessoa(nome, endereco, email, senha, avatar)
values(
	"Welenilson",
    false,
    "Riachinho, Ceara, Brasil",
    "we.marketing@live.com",
    "$2b$10$gP05YWNVDnWBPzqPnKXXq.p0j3sU9Lw1K4oZsU0skx06j0on6DLwe",
    null
);

INSERT INTO app_salon.pessoa(nome, endereco, email, senha, avatar)
values(
	"Ingride",
    false,
    "Sitio Onde Judas Perdeu as Botas",
    "ingride@gmail.com",
    "$2b$10$YwVKzCkl6DPFb6fOp7/3buIq/Ukd3ak1N7e2daFh8hX7k.cdd0o6i",
    null
);

INSERT INTO app_salon.funcionario(id, especializacao)
values(1, "Barbeiro");

INSERT INTO app_salon.cliente(id)
values(2);

INSERT INTO app_salon.cliente(id)
values(3);

INSERT INTO app_salon.cliente(id)
values(4);

INSERT INTO app_salon.empresa(nome)
values("AS INGRID'S SALÃO")