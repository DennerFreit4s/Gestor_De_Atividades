<?php

function handle_request()
{

    $routes = [
        'users' => [
            'POST' => [
                'controller' => 'userController.php',
                'function' => 'createUser',
                'public' => true
            ]
        ],
        'users/login' => [
            'POST' => [
                'controller' => 'userController.php',
                'function' => 'loginUser',
                'public' => true
            ]
        ],
        'tasks' => [
            'GET' => [
                'controller' => 'taskController.php',
                'function' => 'getTasks',
                'public' => false
            ],
            'POST' => [
                'controller' => 'taskController.php',
                'function' => 'createTask',
                'public' => false
            ],
            'PUT' => [
                'controller' => 'taskController.php',
                'function' => 'updateTask',
                'public' => false
            ],
            'DELETE' => [
                'controller' => 'taskController.php',
                'function' => 'deleteTask',
                'public' => false
            ]
        ]
    ];

    $method = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = substr($uri, strlen("/gestor_de_atividades/backend"));
    $uri = trim($uri, '/');

    if (isset($routes[$uri])) {
        if (isset($routes[$uri][$method])) {
            $route = $routes[$uri][$method];

            if (!$route['public']) {
                require_once __DIR__ . '/../middlewares/authMiddleware.php';
                $_REQUEST['authUser'] = authenticate();
            }

            require_once __DIR__ . '/../controllers/' . $route['controller'];
            $route['function']();
        } else {
            http_response_code(405);
            echo json_encode(["data" => null, "error" => "Método não permitido"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["data" => null, "error" => "Rota não encontrada"]);
    }
}
