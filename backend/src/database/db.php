<?php

function getDatabaseConnection() {
    $host = 'localhost';
    $usuario = 'root';
    $senha = '';
    $banco = 'gestor_atividades';

    try {
        $pdo = new PDO(
            "mysql:host=$host;dbname=$banco;charset=utf8",
            $usuario,
            $senha,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Erro ao conectar ao banco de dados: " . $e->getMessage()]);
        exit;
    }
}