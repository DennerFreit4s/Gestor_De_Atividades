<?php

require_once __DIR__ . '/../repositories/taskRepository.php';

function getTasksService($authUser)
{
    $userId = intval($authUser['id']);

    $tasks = getTasksRepository($userId);

    return $tasks;
}

function createTaskService($data, $authUser)
{
    $task = [
        'title' => trim($data['title']),
        'description' => trim($data['description']),
        'due_date' => trim($data['due_date']),
        'user_id' => intval($authUser['id'])
    ];

    $createdTask = createTaskRepository($task);

    return $createdTask;
}

function updateTaskService($taskId, $data, $userId)
{
    $existingTask = findTaskByIdRepository($taskId);

    if (!$existingTask) {
        throw new Exception("Tarefa não encontrada.", 404);
    }

    if ($existingTask['user_id'] != $userId) {
        throw new Exception("Essa tarefa não pertece ao usuário logado.", 403);
    }

    require_once __DIR__ . '/../helpers/taskValidator.php';


    $updated = updateTaskRepository($taskId, $data);

    if (!$updated) {
        throw new Exception("Falha ao atualizar a tarefa.", 500);
    }

    return findTaskByIdRepository($taskId);
}

function deleteTaskService($taskId, $userId)
{
    $existingTask = findTaskByIdRepository($taskId);

    if (!$existingTask) {
        throw new Exception("Tarefa não encontrada.", 404);
    }

    if ($existingTask['user_id'] != $userId) {
        throw new Exception("Essa tarefa não pertece ao usuário logado.", 403);
    }

    deleteTaskRepository($taskId);
}
