<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/router/routerConfig.php';
require_once __DIR__ . '/router/routes.php';

// Debug: mostra a URI original
error_log("URI original: " . $_SERVER['REQUEST_URI']);

dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI'], getallheaders());