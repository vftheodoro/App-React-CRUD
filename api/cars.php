<?php
require_once 'config.php';

// Tratamento de requisições OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Buscar carro específico
                $stmt = $pdo->prepare('SELECT * FROM cars WHERE id = ?');
                $stmt->execute([$_GET['id']]);
                $car = $stmt->fetch();
                
                if (!$car) {
                    sendJsonResponse(['error' => true, 'message' => 'Carro não encontrado'], 404);
                }
                
                sendJsonResponse($car);
            } else {
                // Listar todos os carros
                $stmt = $pdo->query('SELECT * FROM cars ORDER BY created_at DESC');
                $cars = $stmt->fetchAll();
                sendJsonResponse($cars);
            }
            break;

        case 'POST':
            // Criar novo carro
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                sendJsonResponse(['error' => true, 'message' => 'Dados inválidos'], 400);
            }
            
            $stmt = $pdo->prepare('INSERT INTO cars (name, brand, year, price, image_url, description, engine, power, torque, transmission, acceleration, top_speed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            
            $stmt->execute([
                $data['name'],
                $data['brand'],
                $data['year'],
                $data['price'],
                $data['image_url'],
                $data['description'],
                $data['engine'],
                $data['power'],
                $data['torque'],
                $data['transmission'],
                $data['acceleration'],
                $data['top_speed']
            ]);
            
            $data['id'] = $pdo->lastInsertId();
            sendJsonResponse(['success' => true, 'data' => $data], 201);
            break;

        case 'PUT':
            // Atualizar carro existente
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data || !isset($data['id'])) {
                sendJsonResponse(['error' => true, 'message' => 'Dados inválidos'], 400);
            }
            
            // Verificar se o carro existe
            $check = $pdo->prepare('SELECT id FROM cars WHERE id = ?');
            $check->execute([$data['id']]);
            if (!$check->fetch()) {
                sendJsonResponse(['error' => true, 'message' => 'Carro não encontrado'], 404);
            }
            
            $stmt = $pdo->prepare('UPDATE cars SET name = ?, brand = ?, year = ?, price = ?, image_url = ?, description = ?, engine = ?, power = ?, torque = ?, transmission = ?, acceleration = ?, top_speed = ? WHERE id = ?');
            
            $stmt->execute([
                $data['name'],
                $data['brand'],
                $data['year'],
                $data['price'],
                $data['image_url'],
                $data['description'],
                $data['engine'],
                $data['power'],
                $data['torque'],
                $data['transmission'],
                $data['acceleration'],
                $data['top_speed'],
                $data['id']
            ]);
            
            sendJsonResponse(['success' => true, 'data' => $data]);
            break;

        case 'DELETE':
            // Excluir carro
            if (!isset($_GET['id'])) {
                sendJsonResponse(['error' => true, 'message' => 'ID não fornecido'], 400);
            }
            
            $id = $_GET['id'];
            
            // Verificar se o carro existe
            $check = $pdo->prepare('SELECT id FROM cars WHERE id = ?');
            $check->execute([$id]);
            if (!$check->fetch()) {
                sendJsonResponse(['error' => true, 'message' => 'Carro não encontrado'], 404);
            }
            
            $stmt = $pdo->prepare('DELETE FROM cars WHERE id = ?');
            $stmt->execute([$id]);
            
            sendJsonResponse(['success' => true, 'message' => 'Carro excluído com sucesso']);
            break;

        default:
            sendJsonResponse(['error' => true, 'message' => 'Método não permitido'], 405);
            break;
    }
} catch (Exception $e) {
    sendJsonResponse([
        'error' => true,
        'message' => 'Erro interno do servidor',
        'details' => $e->getMessage()
    ], 500);
}
?> 