CREATE DATABASE IF NOT EXISTS db_convidados;
USE db_convidados;

CREATE TABLE IF NOT EXISTS convidados (

    id_convidado INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(50) NOT NULL,
    cpf VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR (100),
    numero_mesa INT
)

CREATE TABLE IF NOT EXISTS acompanhantes (

    id_acompanhantes INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    sobrenome VARCHAR(50) NOT NULL,
    fk_convidado INT NOT NULL,
    FOREIGN KEY (fk_convidado) REFERENCES convidados(id_convidado) ON DELETE CASCADE
)

INSERT INTO convidados (nome, sobrenome, cpf, telefone, email, numero_mesa)
VALUES
(
    'a','b','243424','51999237495','a@g.com',1;
    'b','a','325433131','51999237492','a@g.com',1;
    'c','d','443233','51999237493','a@g.com',1;
    'd','c','2141','51999237494','a@g.com',1;
)