<?php

function helloRoute() {
    echo json_encode(['msg' => 'Olá, mundooooo!']);
}

function helloWithParam($name) {
    echo json_encode(['msg' => "Olá, $name!"]);
}
