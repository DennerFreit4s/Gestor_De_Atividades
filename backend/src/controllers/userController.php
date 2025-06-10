<?php

require_once __DIR__ . '/../helpers/userValidator.php';
require_once __DIR__ . '/../services/userService.php';

function createUser()
{
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (
            empty($data['first_name']) ||
            empty($data['last_name']) ||
            empty($data['birth_date']) ||
            empty($data['username']) ||
            empty($data['password'])
        ) {
            throw new Exception("Todos os campos são obrigatórios.", 400);
        }

        if (!validate_first_name($data['first_name'])) {
            throw new Exception("Nome inválido. Deve conter apenas letras e ter entre 3 e 100 caracteres.", 422);
        }

        if (!validate_last_name($data['last_name'])) {
            throw new Exception("Sobrenome inválido. Deve conter apenas letras e ter entre 3 e 100 caracteres.", 422);
        }

        if (!validate_username($data['username'])) {
            throw new Exception("Username inválido. Deve conter apenas letras e ter entre 3 e 100 caracteres.", 422);
        }

        if (!validate_birth_date($data['birth_date'])) {
            throw new Exception("Data de nascimento inválida. Use o formato 'YYYY-MM-DD' e não pode ser uma data futura.", 422);
        }

        if (!validate_password($data['password'])) {
            throw new Exception("Senha muito longa. Máximo de 255 caracteres.", 422);
        }

        createUserService($data);

        http_response_code(201);
        echo json_encode(["data" => "Usuário cadastrado com sucesso.", "error" => null]);
    } catch (Exception $e) {
        $code = $e->getCode() ?: 500;
        http_response_code($code);
        echo json_encode(["data" => null, "error" => $e->getMessage()]);
    }
}

function loginUser() {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['username']) || empty($data['password'])) {
            throw new Exception("Nome de usuário e senha são obrigatórios.", 400);
        }

        $result = loginUserService(trim($data['username']), trim($data['password']));

        http_response_code(200);
        echo json_encode(["data" => $result, "error" => null]);

    } catch (Exception $e) {
        $code = $e->getCode() ?: 500;
        http_response_code($code);
        echo json_encode(["data" => null, "error" => $e->getMessage()]);
    }
}