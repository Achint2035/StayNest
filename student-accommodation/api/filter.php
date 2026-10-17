<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

require_once "../config/db.php";

try {

    $city = isset($_POST['city']) ? trim($_POST['city']) : "";
    $budget = isset($_POST['budget']) ? trim($_POST['budget']) : "";
    $gender = isset($_POST['gender']) ? trim($_POST['gender']) : "";

    $sql = "SELECT id, name, city, price, gender, rating, image, description
            FROM properties
            WHERE 1=1";

    $params = [];
    $types = "";

    /* CITY FILTER */

    if ($city !== "") {
        $sql .= " AND city = ?";
        $params[] = $city;
        $types .= "s";
    }

    /* BUDGET FILTER */

    if ($budget !== "") {
        $sql .= " AND price <= ?";
        $params[] = (float) $budget;
        $types .= "d";
    }

    /* GENDER FILTER */

    if ($gender !== "") {
        $sql .= " AND gender = ?";
        $params[] = $gender;
        $types .= "s";
    }

    $sql .= " ORDER BY id DESC";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    if (count($params) > 0) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();

    $result = $stmt->get_result();

    $properties = [];

    while ($row = $result->fetch_assoc()) {
        $properties[] = $row;
    }

    echo json_encode([
        "success" => true,
        "properties" => $properties
    ]);

    $stmt->close();

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>