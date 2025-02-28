<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

class ChatAPI {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }

    public function getMessages($chatId) {
        $query = "SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $chatId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $messages = [];
        while ($row = $result->fetch_assoc()) {
            $messages[] = [
                'id' => $row['id'],
                'text' => $row['message'],
                'sender' => $row['sender'],
                'time' => $row['created_at']
            ];
        }
        
        return $messages;
    }

    public function sendMessage($data) {
        $query = "INSERT INTO messages (chat_id, message, sender, created_at) VALUES (?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sss", $data['chat_id'], $data['message'], $data['sender']);
        
        if ($stmt->execute()) {
            return [
                'id' => $this->conn->insert_id,
                'text' => $data['message'],
                'sender' => $data['sender'],
                'time' => date('Y-m-d H:i:s')
            ];
        }
        
        return false;
    }
}

// Handle requests
$database = new Database();
$db = $database->connect();
$api = new ChatAPI($db);

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));

try {
    switch ($method) {
        case 'GET':
            if (isset($request[0]) && $request[0] === 'messages') {
                $chatId = $request[1] ?? null;
                if ($chatId) {
                    $result = $api->getMessages($chatId);
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception('Chat ID is required');
                }
            }
            break;
            
        case 'POST':
            if (isset($request[0]) && $request[0] === 'messages') {
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $api->sendMessage($data);
                if ($result) {
                    echo json_encode(['success' => true, 'data' => $result]);
                } else {
                    throw new Exception('Failed to send message');
                }
            }
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}