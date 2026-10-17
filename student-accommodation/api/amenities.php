<?php

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "../config/db.php";

/* Handle OPTIONS request */
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

/* Get property ID */
$property_id = $_GET["property_id"] ?? null;

if ($property_id === null || !is_numeric($property_id)) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid property ID."
    ]);

    exit;
}

$property_id = intval($property_id);


/*
|--------------------------------------------------------------------------
| Get amenities for selected property
|--------------------------------------------------------------------------
*/

$sql = "
    SELECT 
        a.id,
        a.name
    FROM amenities a
    INNER JOIN property_amenities pa
        ON a.id = pa.amenity_id
    WHERE pa.property_id = ?
    ORDER BY a.id ASC
";

$stmt = $conn->prepare($sql);

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => "Database query could not be prepared."
    ]);

    exit;
}

$stmt->bind_param("i", $property_id);

$stmt->execute();

$result = $stmt->get_result();

$amenities = [];

while ($row = $result->fetch_assoc()) {

    $amenities[] = [
        "id" => (int) $row["id"],
        "name" => $row["name"]
    ];

}


/*
|--------------------------------------------------------------------------
| Send response
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "property_id" => $property_id,
    "amenities" => $amenities
]);

$stmt->close();
$conn->close();

?>