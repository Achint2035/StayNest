<?php

session_start();

include "config/db.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    if (empty($email) || empty($password)) {

        $message = "Please enter your email and password.";

    } else {

        // Find user by email
        $stmt = $conn->prepare(
            "SELECT id, name, email, password
             FROM users
             WHERE email = ?"
        );

        $stmt->bind_param("s", $email);

        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 1) {

            $user = $result->fetch_assoc();

            // Verify password
            if (
                password_verify(
                    $password,
                    $user["password"]
                )
            ) {

                // Create session
                $_SESSION["user_id"] = $user["id"];
                $_SESSION["user_name"] = $user["name"];
                $_SESSION["user_email"] = $user["email"];

                // Redirect to homepage
               header("Location: http://localhost:5173/");

                exit;

            } else {

                $message = "Incorrect password.";

            }

        } else {

            $message = "No account found with this email.";

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

    <title>Login | StayNest</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">

    <link
        rel="stylesheet"
        href="assets/css/style.css">

</head>


<body>


<!-- NAVBAR -->

<nav class="navbar navbar-dark bg-dark">

    <div class="container">

        <a
            href="index.php"
            class="navbar-brand fw-bold">

            🏠 StayNest

        </a>

    </div>

</nav>



<!-- LOGIN -->

<div class="container py-5">

    <div class="row justify-content-center">

        <div class="col-md-6 col-lg-5">

            <div class="card shadow border-0">

                <div class="card-body p-4">

                    <h2 class="text-center fw-bold mb-4">

                        Welcome Back 👋

                    </h2>


                    <?php

                    if (
                        isset($_GET["signup"]) &&
                        $_GET["signup"] === "success"
                    ) {

                    ?>

                        <div class="alert alert-success">

                            Account created successfully!
                            Please login.

                        </div>

                    <?php

                    }

                    ?>


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


                        <!-- EMAIL -->

                        <div class="mb-3">

                            <label class="form-label">

                                Email

                            </label>

                            <input
                                type="email"
                                name="email"
                                class="form-control"
                                placeholder="Enter your email"
                                required>

                        </div>


                        <!-- PASSWORD -->

                        <div class="mb-4">

                            <label class="form-label">

                                Password

                            </label>

                            <input
                                type="password"
                                name="password"
                                class="form-control"
                                placeholder="Enter your password"
                                required>

                        </div>


                        <!-- BUTTON -->

                        <button
                            type="submit"
                            class="btn btn-primary w-100">

                            Login

                        </button>


                    </form>


                    <p class="text-center mt-4 mb-0">

                        Don't have an account?

                        <a href="signup.php">

                            Create Account

                        </a>

                    </p>

                </div>

            </div>

        </div>

    </div>

</div>


</body>

</html>