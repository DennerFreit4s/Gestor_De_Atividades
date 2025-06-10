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
            throw new Exception("Todos os campos obrigatórios devem ser informados.", 400);
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

function updateTask() {
    try {
        $taskId = intval($_GET['taskId']) ?? null;
        if (!$taskId || !is_numeric($taskId)) {
            throw new Exception("Parâmetro 'taskId' é obrigatório e deve ser numérico.", 400);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (
            !isset($data['title']) ||
            !isset($data['description']) ||
            !isset($data['due_date']) ||
            !isset($data['status'])
        ) {
            throw new Exception("Todos os campos obrigatórios devem ser informados.", 400);
        }

        if(!validate_title(trim($data['title']))) throw new Exception("O título não pode ser vazio e deve conter no máximo 255 caracteres.", 400);

        if(!validate_status(trim($data['status']))) throw new Exception("O status deve ser 'open' ou 'completed'.", 400);

        $authUser = $_REQUEST['authUser'];

        $updatedTask = updateTaskService($taskId, $data, $authUser['id']);

        http_response_code(200);
        echo json_encode(["data" => $updatedTask, "error" => null]);

    } catch (Exception $e) {
        $code = $e->getCode() ?: 500;
        if (!is_int($code)) $code = 500;
        http_response_code($code);
        echo json_encode(["data" => null, "error" => $e->getMessage()]);
    }
}

function deleteTask() {
    try {
        $taskId = intval($_GET['taskId']) ?? null;

        if (!$taskId || !is_numeric($taskId)) {
            throw new Exception("Parâmetro 'taskId' é obrigatório e deve ser numérico.", 400);
        }

        $authUser = $_REQUEST['authUser'];

        deleteTaskService($taskId, $authUser['id']);

        http_response_code(200);
        echo json_encode(["data" => "Atividade excluída com sucesso.", "error" => null]);

    } catch (Exception $e) {
        $code = $e->getCode() ?: 500;
        if (!is_int($code)) $code = 500;
        http_response_code($code);
        echo json_encode(["data" => null, "error" => $e->getMessage()]);
    }
}