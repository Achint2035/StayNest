<?php

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "../config/db.php";


/*
|--------------------------------------------------------------------------
| Handle preflight request
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}


/*
|--------------------------------------------------------------------------
| Check login
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);

    exit;
}


$user_id = intval($_SESSION["user_id"]);


/*
|--------------------------------------------------------------------------
| Get property ID
|--------------------------------------------------------------------------
*/

$property_id = $_POST["property_id"] ?? null;


/*
|--------------------------------------------------------------------------
| Validate property ID
|--------------------------------------------------------------------------
*/

if ($property_id === null || !is_numeric($property_id)) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid property."
    ]);

    exit;
}


$property_id = intval($property_id);


/*
|--------------------------------------------------------------------------
| Check whether property exists
|--------------------------------------------------------------------------
*/

$propertyCheck = $conn->prepare(
    "SELECT id FROM properties WHERE id = ?"
);

$propertyCheck->bind_param(
    "i",
    $property_id
);

$propertyCheck->execute();

$propertyResult = $propertyCheck->get_result();


if ($propertyResult->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Property does not exist."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Check if property is already shortlisted
|--------------------------------------------------------------------------
*/

$check = $conn->prepare(
    "SELECT user_id
     FROM interested_users
     WHERE user_id = ?
     AND property_id = ?"
);

$check->bind_param(
    "ii",
    $user_id,
    $property_id
);

$check->execute();

$result = $check->get_result();


/*
|--------------------------------------------------------------------------
| REMOVE FROM SHORTLIST
|--------------------------------------------------------------------------
*/

if ($result->num_rows > 0) {

    $delete = $conn->prepare(
        "DELETE FROM interested_users
         WHERE user_id = ?
         AND property_id = ?"
    );

    $delete->bind_param(
        "ii",
        $user_id,
        $property_id
    );

    if ($delete->execute()) {

        echo json_encode([
            "success" => true,
            "status" => "removed",
            "message" => "Removed from shortlist."
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Could not remove property."
        ]);
    }

    exit;
}


/*
|--------------------------------------------------------------------------
| ADD TO SHORTLIST
|--------------------------------------------------------------------------
*/

$insert = $conn->prepare(
    "INSERT INTO interested_users
     (user_id, property_id)
     VALUES (?, ?)"
);

$insert->bind_param(
    "ii",
    $user_id,
    $property_id
);


if ($insert->execute()) {

    echo json_encode([
        "success" => true,
        "status" => "added",
        "message" => "Added to shortlist."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Could not add property to shortlist."
    ]);
}

?>