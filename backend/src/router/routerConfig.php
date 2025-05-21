<?php
$routes = [];

function route($method, $path, $handler, $auth_required = false) {
    global $routes;
    $pattern = preg_replace('/:(\w+)/', '(?P<$1>[^/]+)', $path);
    $pattern = '@^' . rtrim($pattern, '/') . '$@';
    $routes[] = [
        'method' => $method,
        'pattern' => $pattern,
        'handler' => $handler,
        'auth_required' => $auth_required
    ];
}

function prefix($prefix, $callback) {
    global $routes;
    $original = $routes;
    $routes = [];
    $callback();
    
    foreach ($routes as &$r) {
        $r['pattern'] = '@^' . rtrim($prefix, '/') . substr($r['pattern'], 2);
    }
    
    $routes = array_merge($original, $routes);
}

function dispatch($method, $uri, $headers) {
    global $routes;
    
    // Extrai o path e remove o base_path
    $uri_path = parse_url($uri, PHP_URL_PATH);
    $base_path = dirname($_SERVER['SCRIPT_NAME']);
    $clean_uri = preg_replace('#^'.preg_quote($base_path, '#').'#', '', $uri_path);
    $clean_uri = rtrim($clean_uri, '/') ?: '/';
    
    foreach ($routes as $r) {
        if ($r['method'] === $method && preg_match($r['pattern'], $clean_uri, $matches)) {
            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            call_user_func_array($r['handler'], $params);
            return;
        }
    }
    
    http_response_code(404);
    echo json_encode(['error' => 'Rota não encontrada']);
}