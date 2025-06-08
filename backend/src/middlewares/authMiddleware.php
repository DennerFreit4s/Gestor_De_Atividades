<?php

require_once __DIR__ . '/../helpers/jwtHelper.php';

function authenticate() {
    try {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (empty($authHeader)) {
            throw new Exception("Token de autenticação não fornecido.", 401);
        }

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            throw new Exception("Formato de token inválido.", 401);
        }

        $token = $matches[1];
        $decoded = validateJwtToken($token);

        return $decoded['user'];

    } catch (Exception $e) {
        http_response_code($e->getCode() ?: 401);
        echo json_encode(["data" => null, "error" => $e->getMessage()]);
        exit;
    }
}