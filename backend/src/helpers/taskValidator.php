<?php

function validate_title($title) {
    return strlen($title) > 0 && strlen($title) <= 255;
}

function validate_due_date($date) {
    $parsedDate = date_create_from_format('Y-m-d', $date);

    if (!$parsedDate) {
        return false;
    }

    $today = new DateTime();
    return $parsedDate >= $today;
}

function validate_status($status) {
    return in_array($status, ['open', 'completed']);
}

function validate_task_data($data) {
    $errors = [];

    if (!isset($data['title']) || !validate_title(trim($data['title']))) {
        $errors[] = "O título é obrigatório e deve conter no máximo 255 caracteres.";
    }

    if (!isset($data['due_date']) || !validate_due_date(trim($data['due_date']))) {
        $errors[] = "A data de conclusão deve estar em um formato válido (YYYY-MM-DD) e não pode ser anterior à data atual.";
    }

    return $errors;
}