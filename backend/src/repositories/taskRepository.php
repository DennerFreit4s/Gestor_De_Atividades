<?php

require_once __DIR__ . '/../database/db.php';

function getTasksRepository($userId)
{
    $pdo = getDatabaseConnection();
    try {
        $sql = "SELECT * FROM activities WHERE user_id = :user_id ORDER BY due_date ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } finally {
        $pdo = null;
    }
}

function createTaskRepository($task)
{
    $pdo = getDatabaseConnection();
    try {
        $sql = "INSERT INTO activities (title, description, due_date, user_id)
                VALUES (:title, :description, :due_date, :user_id)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':title' => $task['title'],
            ':description' => $task['description'],
            ':due_date' => $task['due_date'],
            ':user_id' => $task['user_id']
        ]);

        $taskId = $pdo->lastInsertId();

        $selectSql = "SELECT * FROM activities WHERE id = :id";

        $selectStmt = $pdo->prepare($selectSql);
        $selectStmt->execute([':id' => $taskId]);

        $createdTask = $selectStmt->fetch(PDO::FETCH_ASSOC);

        return $createdTask;
    } finally {
        $pdo = null;
    }
}

function findTaskByIdRepository($taskId)
{
    $pdo = getDatabaseConnection();

    try {
        $sql = "SELECT * FROM activities WHERE id = :id LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $taskId]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    } finally {
        $pdo = null;
    }
}

function updateTaskRepository($taskId, $data)
{
    $pdo = getDatabaseConnection();

    try {
        $sql = "UPDATE activities SET title = :title, description = :description, due_date = :due_date, status = :status WHERE id = :id";
        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            ':title' => $data['title'],
            ':description' => $data['description'],
            ':due_date' => $data['due_date'],
            ':status' => $data['status'],
            ':id' => $taskId
        ]);
    } finally {
        $pdo = null;
    }
}

function deleteTaskRepository($taskId)
{
    $pdo = getDatabaseConnection();

    try {
        $sql = "DELETE FROM activities WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $taskId
        ]);

        return $stmt->rowCount() > 0;
    } finally {
        $pdo = null;
    }
}
