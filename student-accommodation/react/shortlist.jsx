import { useEffect, useState } from "react";
import "../App.css";

const API_BASE =
  "http://localhost/student-accommodation/api";

const IMAGE_BASE =
  "http://localhost/student-accommodation/assets/images/";

function Shortlist({ onBack, onViewDetails }) {

  /* =========================================================
     STATES
  ========================================================= */

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  /* =========================================================
     LOAD SHORTLIST
  ========================================================= */

  const loadShortlist = async () => {

    setLoading(true);
    setError("");

    try {

      const response = await fetch(
        `${API_BASE}/shortlist.php`,
        {
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to connect to API");
      }

      const data = await response.json();

      console.log("SHORTLIST DATA:", data);

      if (data.success) {

        setProperties(
          data.properties || []
        );

      } else {

        setError(
          data.message ||
          "Could not load your shortlist."
        );

      }

    } catch (error) {

      console.error(
        "Shortlist error:",
        error
      );

      setError(
        "Could not connect to the PHP API."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    loadShortlist();

  }, []);


  /* =========================================================
     REMOVE FROM SHORTLIST
  ========================================================= */

  const removeFromShortlist = async (
    propertyId
  ) => {

    try {

      const formData =
        new FormData();

      formData.append(
        "property_id",
        propertyId
      );


      const response =
        await fetch(
          `${API_BASE}/interest.php`,
          {
            method: "POST",
            body: formData,
            credentials: "include"
          }
        );


      if (!response.ok) {

        throw new Error(
          "Remove request failed"
        );

      }


      const data =
        await response.json();


      console.log(
        "REMOVE RESPONSE:",
        data
      );


      /* =====================================================
         PROPERTY SUCCESSFULLY REMOVED
      ===================================================== */

      if (
        data.success &&
        data.status === "removed"
      ) {

        setProperties(
          previous =>
            previous.filter(
              property =>
                Number(property.id) !==
                Number(propertyId)
            )
        );


        setMessage(
          "Property removed from shortlist."
        );


        setTimeout(() => {

          setMessage("");

        }, 2000);


      } else {

        setMessage(
          data.message ||
          "Could not remove property."
        );


        setTimeout(() => {

          setMessage("");

        }, 2000);

      }

    } catch (error) {

      console.error(
        "Remove shortlist error:",
        error
      );


      setMessage(
        "Could not connect to the server."
      );


      setTimeout(() => {

        setMessage("");

      }, 2000);

    }

  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="shortlist-page">

        <div className="shortlist-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading your shortlist...
          </h2>

          <p>
            Please wait while we load your saved properties.
          </p>

        </div>

      </div>

    );

  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {

    return (

      <div className="shortlist-page">


        {/* TOP BAR */}

        <div className="details-topbar">

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back to Properties
          </button>

        </div>


        {/* ERROR */}

        <div className="shortlist-error">

          <div className="error-icon">
            !
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>


          <button
            className="shortlist-retry-button"
            onClick={loadShortlist}
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  /* =========================================================
     MAIN SHORTLIST PAGE
  ========================================================= */

  return (

    <div className="shortlist-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="shortlist-header">

        <div>

          <h1>
            ♥ My Shortlist
          </h1>

          <p>
            Your saved student accommodations
          </p>

        </div>


        <div className="shortlist-count">

          {properties.length}

          <span>
            Saved
          </span>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <main className="shortlist-container">


        {/* BACK BUTTON */}

        <button
          className="shortlist-back-button"
          onClick={onBack}
        >
          ← Back to Properties
        </button>


        {/* ===================================================
            TITLE
        =================================================== */}

        <div className="shortlist-title">

          <h2>
            My Shortlisted PGs
          </h2>

          <p>

            {properties.length} saved{" "}

            {properties.length === 1
              ? "property"
              : "properties"}

          </p>

        </div>


        {/* ===================================================
            MESSAGE
        =================================================== */}

        {message && (

          <div className="shortlist-message">

            {message}

          </div>

        )}


        {/* ===================================================
            EMPTY SHORTLIST
        =================================================== */}

        {properties.length === 0 ? (

          <div className="shortlist-empty">


            <div className="empty-icon">
              ♥
            </div>


            <h2>
              No shortlisted properties
            </h2>


            <p>
              Start exploring PGs and save your
              favourite properties here.
            </p>


            <button
              className="shortlist-explore-button"
              onClick={onBack}
            >
              Explore Properties
            </button>


          </div>

        ) : (


          /* =================================================
             PROPERTY GRID
          ================================================= */

          <div className="property-grid">

            {properties.map(
              property => (

                <div
                  className="property-card"
                  key={property.id}
                >


                  {/* =========================================
                      PROPERTY IMAGE
                  ========================================= */}

                  <div className="property-image">

                    <img
                      src={
                        `${IMAGE_BASE}${property.image}`
                      }
                      alt={property.name}

                      onError={(e) => {

                        e.currentTarget.style.display =
                          "none";

                      }}

                    />


                    <span className="property-gender">

                      {property.gender}

                    </span>

                  </div>


                  {/* =========================================
                      PROPERTY CONTENT
                  ========================================= */}

                  <div className="property-content">


                    {/* NAME */}

                    <h3>
                      {property.name}
                    </h3>


                    {/* LOCATION */}

                    <p className="property-location">

                      📍 {property.city}

                    </p>


                    {/* RATING */}

                    <p className="property-rating">

                      ⭐ {property.rating}

                    </p>


                    {/* PRICE */}

                    <div className="price">

                      ₹{property.price}

                      <span>
                        / month
                      </span>

                    </div>


                    {/* DESCRIPTION */}

                    <p className="description">

                      {property.description ||
                        "A comfortable and convenient student accommodation option."}

                    </p>


                    {/* =======================================
                        ACTION BUTTONS
                    ======================================= */}

                    <div className="shortlist-card-buttons">


                      {/* VIEW DETAILS */}

                      <button
                        className="shortlist-details-button"
                        onClick={() =>
                          onViewDetails(
                            property.id
                          )
                        }
                      >

                        View Details →

                      </button>


                      {/* REMOVE */}

                      <button
                        className="shortlist-remove-button"
                        onClick={() =>
                          removeFromShortlist(
                            property.id
                          )
                        }
                      >

                        Remove

                      </button>


                    </div>


                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footer-brand">

          🏠 StayNest

        </div>


        <p>

          Making student accommodation search
          easier and smarter.

        </p>


        <p className="copyright">

          © 2026 StayNest. All Rights Reserved.

        </p>

      </footer>


    </div>

  );

}


export default Shortlist;