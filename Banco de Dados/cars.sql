-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS car_app_victor_theodoro;
USE car_app_victor_theodoro;

-- Criação da tabela de carros
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    engine VARCHAR(50) NOT NULL,
    power VARCHAR(50) NOT NULL,
    torque VARCHAR(50) NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    acceleration VARCHAR(50) NOT NULL,
    top_speed VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserção de alguns dados iniciais
INSERT INTO cars (name, brand, year, price, image_url, description, engine, power, torque, transmission, acceleration, top_speed) VALUES
('Ferrari F8 Tributo', 'Ferrari', 2023, 3500000.00, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738', 'O Ferrari F8 Tributo é um superesportivo que combina potência e elegância.', 'V8 3.9L Biturbo', '720 cv', '770 Nm', '7 marchas', '2.9s (0-100 km/h)', '340 km/h'),
('Porsche 911 GT3', 'Porsche', 2023, 1200000.00, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', 'O Porsche 911 GT3 é a versão mais focada em pista do 911.', 'Boxer 6 4.0L', '510 cv', '470 Nm', '6 marchas', '3.4s (0-100 km/h)', '318 km/h'),
('Lamborghini Huracán', 'Lamborghini', 2023, 2800000.00, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8', 'O Lamborghini Huracán é um superesportivo que combina design agressivo com performance.', 'V10 5.2L', '640 cv', '600 Nm', '7 marchas', '2.9s (0-100 km/h)', '325 km/h'); 