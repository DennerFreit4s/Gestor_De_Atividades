<?php

require_once __DIR__ . '/../helpers/taskValidator.php';
require_once __DIR__ . '/../services/taskService.php';

function getTasks() {
    try {
        $authUser = $_REQUEST['authUser'];

        $tasks = getTasksService($authUser);

        http_response_code(200);
        echo json_encode(["data" => $tasks, "error" => null]);

    } catch (Exception $e) {
        $code = $e->getCode() ?: 500;
        if (!is_int($code)) $code = 500;
        http_response_code($code);
        echo json_encode(["data" => null, "error" => $e->getMessage()]);
    }
}

function createTask() {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (
            !isset($data['title']) ||
            !isset($data['description']) ||
            !isset($data['due_date'])
        ) {
            throw new Exception("Todos os campos obrigatórios devem ser informados.");
        }

        $errors = validate_task_data($data);

        if (!empty($errors)) throw new Exception(implode(" | ", $errors), 400);

        $authUser = $_REQUEST['authUser'];

        $result = createTaskService($data, $authUser);

        http_response_code(201);
        echo json_encode(["data" => $result, "error" => null]);

    } catch (Exception $e) {
        $code = $e->getCode() ?: 500;
        if (!is_int($code)) $code = 500;
        http_response_code($code);
        echo json_encode(["data" => null, "error" => $e->getMessage()]);
    }
}