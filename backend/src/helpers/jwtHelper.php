<?php

function generateJwtToken($userData) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'iat' => time(),
        'exp' => time() + (60 * 60 * 24),
        'user' => $userData
    ]);
    
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, "chaveMegaSecreta", true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function validateJwtToken($token) {
    if (!$token) {
        throw new Exception("Token não fornecido.", 401);
    }

    $tokenParts = explode('.', $token);
    if (count($tokenParts) !== 3) {
        throw new Exception("Token inválido.", 401);
    }

    $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
    $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
    $signatureProvided = $tokenParts[2];

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, "chaveMegaSecreta", true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    if ($base64UrlSignature !== $signatureProvided) {
        throw new Exception("Assinatura inválida.", 401);
    }

    $payloadData = json_decode($payload, true);

    if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
        throw new Exception("Token expirado.", 401);
    }

    return $payloadData;
}