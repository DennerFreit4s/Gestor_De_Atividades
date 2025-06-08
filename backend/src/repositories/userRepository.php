<?php

require_once __DIR__ . '/../database/db.php';

function findUserByUsername($username)
{
    $pdo = getDatabaseConnection();

    try {
        $sql = "SELECT * FROM users WHERE username = :username LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':username' => $username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } finally {
        $pdo = null;
    }
}

function createUserRepository($data)
{
    $pdo = getDatabaseConnection();

    try {
        $sql = "INSERT INTO users (first_name, last_name, birth_date, username, password)
                VALUES (:first_name, :last_name, :birth_date, :username, :password)";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([
            ':first_name' => $data['first_name'],
            ':last_name' => $data['last_name'],
            ':birth_date' => $data['birth_date'],
            ':username' => $data['username'],
            ':password' => $data['password']
        ]);
    } finally {
        $pdo = null;
    }
}
