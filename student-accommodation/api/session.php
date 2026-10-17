<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

/*
|--------------------------------------------------------------------------
| Logged in
|--------------------------------------------------------------------------
*/

if (isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => true,
        "loggedIn" => true,
        "user" => [
            "id" => intval($_SESSION["user_id"]),
            "name" => $_SESSION["user_name"] ?? "",
            "email" => $_SESSION["user_email"] ?? ""
        ]
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Not logged in
|--------------------------------------------------------------------------
*/

echo json_encode([
    "success" => true,
    "loggedIn" => false,
    "user" => null
]);

exit;

?>