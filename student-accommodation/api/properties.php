<?php

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config/db.php";

$sql = "SELECT * FROM properties ORDER BY id DESC";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database query failed"
    ]);
    $conn->close();
    exit;
}

$properties = [];

while ($row = $result->fetch_assoc()) {
    $properties[] = $row;
}

echo json_encode([
    "success" => true,
    "properties" => $properties
]);

$result->free();
$conn->close();

?>