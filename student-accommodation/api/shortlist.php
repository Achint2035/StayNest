<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

/*
|--------------------------------------------------------------------------
| Handle OPTIONS request
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

include "../config/db.php";

/*
|--------------------------------------------------------------------------
| Check login
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => false,
        "loggedIn" => false,
        "message" => "Please login first."
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Get logged-in user's ID
|--------------------------------------------------------------------------
*/

$user_id = intval($_SESSION["user_id"]);

/*
|--------------------------------------------------------------------------
| Get shortlisted properties
|--------------------------------------------------------------------------
*/

$sql = "
    SELECT 
        p.id,
        p.name,
        p.city,
        p.price,
        p.gender,
        p.rating,
        p.image,
        p.description
    FROM properties p
    INNER JOIN interested_users i
        ON p.id = i.property_id
    WHERE i.user_id = ?
    ORDER BY p.id DESC
";

$stmt = $conn->prepare($sql);

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => "Database query preparation failed."
    ]);

    exit;
}

$stmt->bind_param("i", $user_id);

if (!$stmt->execute()) {

    echo json_encode([
        "success" => false,
        "message" => "Could not load shortlist."
    ]);

    exit;
}

$result = $stmt->get_result();

$properties = [];

/*
|--------------------------------------------------------------------------
| Build properties array
|--------------------------------------------------------------------------
*/

while ($row = $result->fetch_assoc()) {

    $properties[] = [
        "id" => intval($row["id"]),
        "name" => $row["name"],
        "city" => $row["city"],
        "price" => $row["price"],
        "gender" => $row["gender"],
        "rating" => $row["rating"],
        "image" => $row["image"],
        "description" => $row["description"]
    ];
}

/*
|--------------------------------------------------------------------------
| Return response
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "loggedIn" => true,
    "user_id" => $user_id,
    "count" => count($properties),
    "properties" => $properties
]);

$stmt->close();

$conn->close();

exit;

?>