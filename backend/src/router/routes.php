<?php

function handle_request() {
    $method = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = substr($uri, strlen("gestor_de_atividades/backend"));
    $uri = trim($uri, '/');

    if ($uri === 'api/tasks') {
        if ($method === 'GET') {
            // get_all_tasks();
        } elseif ($method === 'POST') {
            // create_task();
        } else {
            http_response_code(405);
            echo json_encode(["data" => null, "error" => "Método não permitido."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["data" => null, "error" => "Rota não encontrada!"]);
    }
}