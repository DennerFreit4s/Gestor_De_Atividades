<?php
require_once __DIR__ . '/../router/routerConfig.php';
require_once __DIR__ . '/../controllers/test.php';


prefix('/gestor-atividades', function() {
    prefix('/api', function() {
        route("GET", "/home", 'helloRoute');
    });
});