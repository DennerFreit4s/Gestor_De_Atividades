<?php

function get_database_connection()
{
    $host = 'localhost';
    $usuario = 'root';
    $senha = '';
    $banco = 'gestor_atividades';

    $conexao = mysqli_connect($host, $usuario, $senha, $banco);

    if (!$conexao) {
        http_response_code(500);
        echo json_encode(["error" => "Erro ao conectar ao banco de dados: " . mysqli_connect_error()]);
        exit;
    }

    return $conexao;
}
