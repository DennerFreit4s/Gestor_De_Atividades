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
    return strlen(trim($password)) <= 255;
}