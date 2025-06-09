<?php 

require_once __DIR__ . '/../repositories/taskRepository.php';

function getTasksService($authUser) {
    $userId = intval($authUser['id']);

    $tasks = getTasksRepository($userId);

    return $tasks;
}

function createTaskService($data, $authUser) {
    $task = [
        'title' => trim($data['title']),
        'description' => trim($data['description']),
        'due_date' => trim($data['due_date']),
        'user_id' => intval($authUser['id'])
    ];

    $createdTask = createTaskRepository($task);

    return $createdTask;
}