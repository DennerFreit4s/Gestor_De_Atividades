<?php

require_once __DIR__ . '/../database/db.php';

function getTasksRepository($userId) {
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

function createTaskRepository($task) {
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
