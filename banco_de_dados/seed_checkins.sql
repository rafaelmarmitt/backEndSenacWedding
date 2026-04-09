CREATE DATABASE IF NOT EXISTS db_checkins;
USE db_checkins;

CREATE TABLE IF NOT EXISTS checkins (

    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_convidado INT NOT NULL,
    data_hora_chegada DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_convidado UNIQUE (id_convidado)
)