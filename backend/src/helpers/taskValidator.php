<?php

function validate_title($title) {
    return strlen($title) > 0 && strlen($title) <= 255;
}

function validate_status($status) {
    return in_array($status, ['open', 'completed']);
}

function validate_task_data($data) {
    $errors = [];

    if (!isset($data['title']) || !validate_title(trim($data['title']))) {
        $errors[] = "O título é obrigatório e deve conter no máximo 255 caracteres.";
    }

    return $errors;
}