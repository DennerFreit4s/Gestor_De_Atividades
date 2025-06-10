<?php

function validate_first_name($firstName) {
    return validate_simple_text(trim($firstName), 3, 100);
}

function validate_last_name($lastName) {
    return validate_simple_text(trim($lastName), 3, 100);
}

function validate_username($username) {
    return validate_simple_text(trim($username), 3, 100);
}

function validate_simple_text($text, $min, $max) {
    if (strlen($text) < $min || strlen($text) > $max) {
        return false;
    }

    return preg_match('/^[a-zA-Z ]+$/', $text);
}

function validate_birth_date($date) {
    $parsedDate = date_create_from_format('Y-m-d', trim($date));

    if (!$parsedDate) {
        return false;
    }

    $today = new DateTime();
    return $parsedDate <= $today;
}

function validate_password($password) {
    $password = trim($password);

    if (strlen($password) < 8 ) {
        return false;
    }

    if (!preg_match('/[A-Z]/', $password)) {
        return false;
    }

    if (!preg_match('/[a-z]/', $password)) {
        return false;
    }

    if (!preg_match('/[0-9]/', $password)) {
        return false;
    }

    if (!preg_match('/[\W_]/', $password)) {
        return false;
    }

    return true;
}