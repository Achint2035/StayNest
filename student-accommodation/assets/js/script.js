// ============================================================
// AJAX SHORTLIST
// ============================================================

function attachInterestEvents() {

    const interestButtons =
        document.querySelectorAll(".interest-btn");


    interestButtons.forEach(function (button) {

        button.onclick = function () {

            const propertyId =
                this.getAttribute("data-id");


            button.disabled = true;

            button.innerHTML = "⏳";


            fetch("api/interest.php", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body:
                    "property_id=" +
                    encodeURIComponent(propertyId)

            })


            .then(response => response.json())


            .then(data => {

                if (!data.success) {

                    alert(data.message);

                    return;

                }


                if (data.status === "added") {

                    button.innerHTML = "❤️";

                    button.classList.remove(
                        "btn-outline-danger"
                    );

                    button.classList.add(
                        "btn-danger"
                    );

                }


                if (data.status === "removed") {

                    button.innerHTML = "🤍";

                    button.classList.remove(
                        "btn-danger"
                    );

                    button.classList.add(
                        "btn-outline-danger"
                    );

                }

            })


            .catch(error => {

                console.error(error);

                alert(
                    "Something went wrong."
                );

            })


            .finally(() => {

                button.disabled = false;

            });

        };

    });

}


// Initial buttons

document.addEventListener(
    "DOMContentLoaded",
    function () {

        attachInterestEvents();

    }
);

// ============================================================
// AJAX PROPERTY FILTERING
// ============================================================

const cityFilter = document.getElementById("city");

const budgetFilter = document.getElementById("budget");

const genderFilter = document.getElementById("gender");

const propertyContainer =
    document.getElementById("propertyContainer");


function filterProperties() {

    const city = cityFilter.value;

    const budget = budgetFilter.value;

    const gender = genderFilter.value;


    // Show loading indicator

    propertyContainer.innerHTML = `
        <div class="col-12 text-center py-5">

            <div
                class="spinner-border text-primary"
                role="status">
            </div>

            <p class="mt-3 text-muted">
                Finding properties...
            </p>

        </div>
    `;


    // Send AJAX request

    const formData = new URLSearchParams();

    formData.append("city", city);

    formData.append("budget", budget);

    formData.append("gender", gender);


    fetch("api/filter.php", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/x-www-form-urlencoded"

        },

        body: formData.toString()

    })


    .then(response => response.json())


    .then(data => {

        if (!data.success) {

            propertyContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p>
                        Unable to load properties.
                    </p>
                </div>
            `;

            return;

        }


        // No results

        if (data.properties.length === 0) {

            propertyContainer.innerHTML = `
                <div class="col-12 text-center py-5">

                    <h4>
                        😕 No properties found
                    </h4>

                    <p class="text-muted">
                        Try changing your filters.
                    </p>

                </div>
            `;

            return;

        }


        // Create property cards

        propertyContainer.innerHTML =
            data.properties.map(property => {

                return `

                    <div
                        class="col-lg-4 col-md-6 mb-4">

                        <div
                            class="card property-card
                                   h-100 shadow-sm">

                            <img
                                src="assets/images/${property.image}"
                                class="card-img-top property-image"
                                alt="${property.name}">

                            <div
                                class="card-body
                                       d-flex flex-column">

                                <h5
                                    class="card-title fw-bold">

                                    ${property.name}

                                </h5>


                                <p
                                    class="text-muted mb-2">

                                    📍 ${property.city}

                                </p>


                                <p class="mb-2">

                                    ⭐ ${property.rating}

                                </p>


                                <h5
                                    class="text-primary">

                                    ₹${Number(
                                        property.price
                                    ).toLocaleString("en-IN")}

                                    <small
                                        class="text-muted">

                                        /month

                                    </small>

                                </h5>


                                <div class="mb-3">

                                    <span
                                        class="badge bg-dark">

                                        ${property.gender}

                                    </span>

                                </div>


                                <div
                                    class="mt-auto
                                           d-flex gap-2">

                                    <a
                                        href="property.php?id=${property.id}"
                                        class="btn btn-primary
                                               flex-grow-1">

                                        View Details

                                    </a>


                                    <button
                                        class="btn
                                               btn-outline-danger
                                               interest-btn"
                                        data-id="${property.id}">

                                        🤍

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                `;

            }).join("");


        // Re-enable shortlist buttons

        attachInterestEvents();

    })

    .catch(error => {

        console.error(error);

        propertyContainer.innerHTML = `
            <div class="col-12 text-center">

                <p class="text-danger">

                    Something went wrong.

                </p>

            </div>
        `;

    });

}


// Run filter whenever user changes something

cityFilter.addEventListener(
    "change",
    filterProperties
);

genderFilter.addEventListener(
    "change",
    filterProperties
);

budgetFilter.addEventListener(
    "input",
    filterProperties
);