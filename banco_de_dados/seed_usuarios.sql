CREATE DATABASE IF NOT EXISTS db_usuarios;
USE usuarios;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('Admin', 'Cerimonialista') NOT NULL
);

INSERT INTO usuarios(nome, cpf, email, senha, perfil) VALUES
('Admin', '111.111.111-11','admin@senac.com','$2a$10$5YPyyrME7chhT3AXJRhsGe2zCUenQeeeeBUl2itkArY.HuN3QDNjC', 'Admin'),
('Cerimonialista', '222.222.222-22','crm@senac.com','$2a$10$5YPyyrME7chhT3AXJRhsGe2zCUenQeeeeBUl2itkArY.HuN3QDNjC', 'Cerimonialista');