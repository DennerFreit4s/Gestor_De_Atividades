<?php

require_once __DIR__ . '/../repositories/userRepository.php';
require_once __DIR__ . '/../helpers/jwtHelper.php';

function createUserService($data)
{

    $existing_user = findUserByUsername($data['username']);

    if ($existing_user) {
        throw new Exception("Username já está em uso.", 409);
    }

    $hashed_password = password_hash($data['password'], PASSWORD_BCRYPT);

    $user_to_save = [
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'birth_date' => $data['birth_date'],
        'username' => $data['username'],
        'password' => $hashed_password
    ];

    $created = createUserRepository($user_to_save);

    if (!$created) {
        throw new Exception("Erro ao cadastrar o usuário.", 500);
    }
}

function loginUserService($username, $password) {
    $user = findUserByUsername($username);
    
    if (!$user) {
        throw new Exception("Usuário ou senha incorretos.", 401);
    }
    
    if (!password_verify($password, $user['password'])) {
        throw new Exception("Usuário ou senha incorretos.", 401);
    }

    unset($user['password']);
    $token = generateJwtToken($user);
    
    return $token;
}
