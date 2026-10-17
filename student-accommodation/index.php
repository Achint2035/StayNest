<?php

session_start();

include "config/db.php";


/*
|--------------------------------------------------------------------------
| Fetch all properties
|--------------------------------------------------------------------------
*/

$sql = "SELECT * FROM properties ORDER BY id DESC";

$result = $conn->query($sql);

?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>
        StayNest | Student Accommodation
    </title>


    <!-- Bootstrap CSS -->

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">


    <!-- Custom CSS -->

    <link
        rel="stylesheet"
        href="assets/css/style.css">

</head>


<body>


<!-- ========================================================= -->
<!-- NAVBAR -->
<!-- ========================================================= -->

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">

    <div class="container">


        <!-- LOGO -->

        <a
            class="navbar-brand fw-bold"
            href="index.php">

            🏠 StayNest

        </a>


        <!-- MOBILE MENU -->

        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav">

            <span class="navbar-toggler-icon"></span>

        </button>


        <!-- NAVIGATION -->

        <div
            class="collapse navbar-collapse"
            id="navbarNav">

            <ul class="navbar-nav ms-auto">


                <!-- HOME -->

                <li class="nav-item">

                    <a
                        class="nav-link active"
                        href="index.php">

                        Home

                    </a>

                </li>


                <!-- PROPERTIES -->

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="#properties">

                        Properties

                    </a>

                </li>


                <?php if (isset($_SESSION["user_id"])) { ?>


                    <!-- LOGGED IN USER -->

                    <li class="nav-item">

                        <span class="nav-link">

                            👋 Hi,

                            <?php

                            echo htmlspecialchars(
                                $_SESSION["user_name"]
                            );

                            ?>

                        </span>

                    </li>


                    <!-- LOGOUT -->

                    <li class="nav-item">

                        <a
                            class="nav-link"
                            href="logout.php">

                            Logout

                        </a>

                    </li>


                <?php } else { ?>


                    <!-- LOGIN -->

                    <li class="nav-item">

                        <a
                            class="nav-link"
                            href="login.php">

                            Login

                        </a>

                    </li>


                    <!-- SIGN UP -->

                    <li class="nav-item">

                        <a
                            class="nav-link"
                            href="signup.php">

                            Sign Up

                        </a>

                    </li>


                <?php } ?>


            </ul>

        </div>

    </div>

</nav>



<!-- ========================================================= -->
<!-- HERO SECTION -->
<!-- ========================================================= -->

<section class="hero">

    <div class="container text-center">


        <h1 class="display-4 fw-bold">

            Find Your Perfect

            <span>
                Student Home
            </span>

        </h1>


        <p class="lead mt-3">

            Safe, affordable and comfortable
            accommodation for students.

        </p>


        <a
            href="#properties"
            class="btn btn-primary btn-lg mt-3">

            Explore Properties

        </a>

    </div>

</section>



<!-- ========================================================= -->
<!-- FILTER SECTION -->
<!-- ========================================================= -->

<section class="container filter-section">

    <div class="card shadow-sm">

        <div class="card-body p-4">


            <h4 class="mb-4">

                🔍 Find a PG

            </h4>


            <div class="row g-3">


                <!-- ================================================= -->
                <!-- CITY -->
                <!-- ================================================= -->

                <div class="col-md-4">

                    <label
                        for="city"
                        class="form-label fw-semibold">

                        City

                    </label>


                    <select
                        id="city"
                        class="form-select">


                        <option value="">

                            All Cities

                        </option>


                        <option value="Lucknow">

                            Lucknow

                        </option>


                        <option value="Kanpur">

                            Kanpur

                        </option>


                    </select>

                </div>



                <!-- ================================================= -->
                <!-- MAXIMUM BUDGET -->
                <!-- ================================================= -->

                <div class="col-md-4">

                    <label
                        for="budget"
                        class="form-label fw-semibold">

                        Maximum Budget

                    </label>


                    <input
                        type="number"
                        id="budget"
                        class="form-control"
                        placeholder="Example: 7000"
                        min="0">


                </div>



                <!-- ================================================= -->
                <!-- GENDER -->
                <!-- ================================================= -->

                <div class="col-md-4">

                    <label
                        for="gender"
                        class="form-label fw-semibold">

                        Gender

                    </label>


                    <select
                        id="gender"
                        class="form-select">


                        <option value="">

                            Any

                        </option>


                        <option value="Male">

                            Male

                        </option>


                        <option value="Female">

                            Female

                        </option>


                    </select>

                </div>


            </div>


        </div>

    </div>

</section>



<!-- ========================================================= -->
<!-- PROPERTY SECTION -->
<!-- ========================================================= -->

<section
    id="properties"
    class="container properties-section">


    <!-- HEADING -->

    <div class="text-center mb-5">


        <h2 class="fw-bold">

            Available PGs

        </h2>


        <p class="text-muted">

            Find accommodation that fits
            your lifestyle and budget.

        </p>


    </div>



    <!-- ===================================================== -->
    <!-- PROPERTY CONTAINER -->
    <!-- ===================================================== -->

    <div
        class="row"
        id="propertyContainer">


        <?php


        if ($result && $result->num_rows > 0) {


            while (
                $property =
                $result->fetch_assoc()
            ) {


        ?>


            <!-- ================================================= -->
            <!-- PROPERTY CARD -->
            <!-- ================================================= -->

            <div class="col-lg-4 col-md-6 mb-4">


                <div
                    class="card property-card h-100 shadow-sm">


                    <!-- IMAGE -->

                    <img
                        src="assets/images/<?php
                            echo htmlspecialchars(
                                $property["image"]
                            );
                        ?>"
                        class="card-img-top property-image"
                        alt="<?php
                            echo htmlspecialchars(
                                $property["name"]
                            );
                        ?>">



                    <!-- CARD BODY -->

                    <div
                        class="card-body d-flex flex-column">


                        <!-- NAME -->

                        <h5 class="card-title fw-bold">

                            <?php

                            echo htmlspecialchars(
                                $property["name"]
                            );

                            ?>

                        </h5>



                        <!-- CITY -->

                        <p
                            class="text-muted mb-2">

                            📍

                            <?php

                            echo htmlspecialchars(
                                $property["city"]
                            );

                            ?>

                        </p>



                        <!-- RATING -->

                        <p class="mb-2">

                            ⭐

                            <?php

                            echo htmlspecialchars(
                                $property["rating"]
                            );

                            ?>

                        </p>



                        <!-- PRICE -->

                        <h5
                            class="text-primary">

                            ₹<?php

                            echo number_format(
                                $property["price"]
                            );

                            ?>


                            <small
                                class="text-muted">

                                /month

                            </small>

                        </h5>



                        <!-- GENDER -->

                        <div class="mb-3">


                            <span
                                class="badge bg-dark">

                                <?php

                                echo htmlspecialchars(
                                    $property["gender"]
                                );

                                ?>

                            </span>


                        </div>



                        <!-- BUTTONS -->

                        <div
                            class="mt-auto d-flex gap-2">


                            <!-- DETAILS -->

                            <a
                                href="property.php?id=<?php
                                    echo $property["id"];
                                ?>"
                                class="btn btn-primary flex-grow-1">

                                View Details

                            </a>



                            <!-- SHORTLIST -->

                            <button
                                class="btn btn-outline-danger interest-btn"
                                data-id="<?php
                                    echo $property["id"];
                                ?>"
                                title="Add to shortlist">

                                🤍

                            </button>


                        </div>


                    </div>


                </div>


            </div>


        <?php


            }


        } else {


        ?>


            <!-- NO PROPERTIES -->

            <div class="col-12 text-center py-5">

                <h4>

                    😕 No properties available

                </h4>

                <p class="text-muted">

                    Please check again later.

                </p>

            </div>


        <?php


        }


        ?>


    </div>


</section>



<!-- ========================================================= -->
<!-- FOOTER -->
<!-- ========================================================= -->

<footer
    class="bg-dark text-white text-center py-4">


    <div class="container">


        <p class="mb-1">

            🏠 StayNest

        </p>


        <small>

            Student Accommodation Made Simple.

        </small>


    </div>


</footer>



<!-- ========================================================= -->
<!-- BOOTSTRAP JAVASCRIPT -->
<!-- ========================================================= -->

<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
</script>



<!-- ========================================================= -->
<!-- OUR JAVASCRIPT -->
<!-- ========================================================= -->

<script
    src="assets/js/script.js">
</script>


</body>

</html>