<?php

include "config/db.php";

/*
|--------------------------------------------------------------------------
| Get property ID from URL
|--------------------------------------------------------------------------
*/

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {

    die("Invalid property ID.");

}

$id = intval($_GET['id']);


/*
|--------------------------------------------------------------------------
| Fetch property from database
|--------------------------------------------------------------------------
*/

$stmt = $conn->prepare(
    "SELECT * FROM properties WHERE id = ?"
);

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();


/*
|--------------------------------------------------------------------------
| Check whether property exists
|--------------------------------------------------------------------------
*/

if ($result->num_rows === 0) {

    die("Property not found.");

}

$property = $result->fetch_assoc();

?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>
        <?php echo htmlspecialchars($property['name']); ?>
        | StayNest
    </title>

    <!-- Bootstrap -->

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">

    <!-- Custom CSS -->

    <link
        rel="stylesheet"
        href="assets/css/style.css">

</head>


<body>


<!-- ================= NAVBAR ================= -->

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">

    <div class="container">

        <a
            class="navbar-brand fw-bold"
            href="index.php">

            🏠 StayNest

        </a>


        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav">

            <span class="navbar-toggler-icon"></span>

        </button>


        <div
            class="collapse navbar-collapse"
            id="navbarNav">

            <ul class="navbar-nav ms-auto">

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="index.php">

                        Home

                    </a>

                </li>

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="login.php">

                        Login

                    </a>

                </li>

            </ul>

        </div>

    </div>

</nav>



<!-- ================= PROPERTY DETAILS ================= -->

<section class="container py-5">

    <div class="row g-5">


        <!-- ================= IMAGE ================= -->

        <div class="col-lg-7">

            <div class="card border-0 shadow-sm">

                <img
                    src="assets/images/<?php
                        echo htmlspecialchars(
                            $property['image']
                        );
                    ?>"
                    class="img-fluid property-detail-image"
                    alt="<?php
                        echo htmlspecialchars(
                            $property['name']
                        );
                    ?>">

            </div>

        </div>



        <!-- ================= INFORMATION ================= -->

        <div class="col-lg-5">

            <div class="card border-0 shadow-sm h-100">

                <div class="card-body p-4">


                    <!-- PROPERTY NAME -->

                    <h1 class="fw-bold mb-3">

                        <?php
                            echo htmlspecialchars(
                                $property['name']
                            );
                        ?>

                    </h1>


                    <!-- LOCATION -->

                    <p class="text-muted fs-5">

                        📍
                        <?php
                            echo htmlspecialchars(
                                $property['city']
                            );
                        ?>

                    </p>


                    <!-- RATING -->

                    <div class="mb-3">

                        <span class="fs-5">

                            ⭐
                            <?php
                                echo $property['rating'];
                            ?>

                        </span>

                    </div>


                    <!-- PRICE -->

                    <h2 class="text-primary fw-bold">

                        ₹<?php
                            echo number_format(
                                $property['price']
                            );
                        ?>

                        <small class="text-muted fs-6">

                            / month

                        </small>

                    </h2>


                    <!-- GENDER -->

                    <div class="my-4">

                        <span class="badge bg-dark fs-6">

                            <?php
                                echo htmlspecialchars(
                                    $property['gender']
                                );
                            ?>

                        </span>

                    </div>


                    <hr>


                    <!-- DESCRIPTION -->

                    <h4 class="fw-bold mt-4">

                        About this property

                    </h4>

                    <p class="text-muted">

                        <?php
                            echo htmlspecialchars(
                                $property['description']
                            );
                        ?>

                    </p>


                    <!-- AMENITIES -->

                    <h4 class="fw-bold mt-4">

                        Amenities

                    </h4>

                    <div class="d-flex flex-wrap gap-2">

                        <span class="badge text-bg-light p-2">
                            📶 WiFi
                        </span>

                        <span class="badge text-bg-light p-2">
                            ❄️ AC
                        </span>

                        <span class="badge text-bg-light p-2">
                            🍛 Food
                        </span>

                        <span class="badge text-bg-light p-2">
                            🧺 Laundry
                        </span>

                        <span class="badge text-bg-light p-2">
                            📹 CCTV
                        </span>

                    </div>


                    <!-- SHORTLIST -->

                    <div class="mt-4">

                        <button
                            id="shortlistBtn"
                            class="btn btn-danger btn-lg w-100">

                            ❤️ Add to Shortlist

                        </button>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>



<!-- ================= FOOTER ================= -->

<footer class="bg-dark text-white text-center py-4">

    <div class="container">

        <p class="mb-1">

            🏠 StayNest

        </p>

        <small>

            Student Accommodation Made Simple.

        </small>

    </div>

</footer>



<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
</script>


</body>

</html>