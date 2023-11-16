<?php
$host = "localhost";
$user = "phpmyadmin";
$senha = "aluno";
$banco = "mydb";

$conn = new mysqli($host, $user, $senha, $banco);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

$email = $_POST['email'];
$cpf = $_POST['cpf'];
$senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (name, cpf, email) VALUES ('$email', '$cpf', '$senha')";

if ($conn->query($sql) === TRUE) {
    echo "Cadastro realizado com sucesso!";
} else {
    echo "Erro ao cadastrar: " . $conn->error;
}

echo "SQL: $sql";

$conn->close();
?>


