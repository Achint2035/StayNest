<?php

include "config/db.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $phone = trim($_POST["phone"]);
    $password = $_POST["password"];


    if (
        empty($name) ||
        empty($email) ||
        empty($password)
    ) {

        $message = "Please fill all required fields.";

    } else {

        /*
        |--------------------------------------------------------------------------
        | Check whether email already exists
        |--------------------------------------------------------------------------
        */

        $check = $conn->prepare(
            "SELECT id FROM users WHERE email = ?"
        );

        $check->bind_param(
            "s",
            $email
        );

        $check->execute();

        $result = $check->get_result();


        if ($result->num_rows > 0) {

            $message = "Email already registered.";

        } else {

            /*
            |--------------------------------------------------------------------------
            | Secure password
            |--------------------------------------------------------------------------
            */

            $hashedPassword = password_hash(
                $password,
                PASSWORD_DEFAULT
            );


            /*
            |--------------------------------------------------------------------------
            | Insert user
            |--------------------------------------------------------------------------
            */

            $stmt = $conn->prepare(
                "INSERT INTO users
                (name, email, password, phone)
                VALUES (?, ?, ?, ?)"
            );

            $stmt->bind_param(
                "ssss",
                $name,
                $email,
                $hashedPassword,
                $phone
            );


            if ($stmt->execute()) {

                header(
                    "Location: login.php?signup=success"
                );

                exit;

            } else {

                $message =
                    "Something went wrong. Please try again.";

            }

        }

    }

}

?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Sign Up | StayNest</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">

    <link
        rel="stylesheet"
        href="assets/css/style.css">

</head>


<body>


<nav class="navbar navbar-dark bg-dark">

    <div class="container">

        <a
            href="index.php"
            class="navbar-brand fw-bold">

            🏠 StayNest

        </a>

    </div>

</nav>



<div class="container py-5">

    <div class="row justify-content-center">

        <div class="col-md-6 col-lg-5">

            <div class="card shadow border-0">

                <div class="card-body p-4">

                    <h2 class="fw-bold text-center mb-4">

                        Create Account

                    </h2>


                    <?php if ($message !== "") { ?>

                        <div class="alert alert-danger">

                            <?php
                                echo htmlspecialchars(
                                    $message
                                );
                            ?>

                        </div>

                    <?php } ?>


                    <form method="POST">


                        <div class="mb-3">

                            <label class="form-label">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                class="form-control"
                                required>

                        </div>


                        <div class="mb-3">

                            <label class="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                class="form-control"
                                required>

                        </div>


                        <div class="mb-3">

                            <label class="form-label">
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                class="form-control">

                        </div>


                        <div class="mb-4">

                            <label class="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                class="form-control"
                                required>

                        </div>


                        <button
                            type="submit"
                            class="btn btn-primary w-100">

                            Create Account

                        </button>


                    </form>


                    <p class="text-center mt-4 mb-0">

                        Already have an account?

                        <a href="login.php">
                            Login
                        </a>

                    </p>

                </div>

            </div>

        </div>

    </div>

</div>


</body>

</html>