import { useEffect, useState } from "react";

const API_BASE =
    "http://localhost/student-accommodation/api";

const IMAGE_BASE =
    "http://localhost/student-accommodation/assets/images/";

function PropertyDetails({
    propertyId,
    onBack,
    onShortlist,
    isShortlisted
}) {

    const [property, setProperty] = useState(null);

    const [amenities, setAmenities] = useState([]);

    const [loading, setLoading] = useState(true);

    const [amenitiesLoading, setAmenitiesLoading] =
        useState(true);

    const [error, setError] = useState("");


    /*
    |--------------------------------------------------------------------------
    | LOAD PROPERTY
    |--------------------------------------------------------------------------
    */

    const loadProperty = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                `${API_BASE}/properties.php`,
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("API connection failed");
            }

            const data = await response.json();

            console.log(
                "PROPERTY DATA:",
                data
            );


            if (!data.success) {

                setError(
                    data.message ||
                    "Unable to load property."
                );

                return;
            }


            const properties =
                data.properties || [];


            const foundProperty =
                properties.find(
                    (item) =>
                        Number(item.id) ===
                        Number(propertyId)
                );


            if (!foundProperty) {

                setError(
                    "Property not found."
                );

                return;
            }


            setProperty(foundProperty);

        }

        catch (error) {

            console.error(
                "Property Details Error:",
                error
            );

            setError(
                "Could not connect to the PHP API."
            );

        }

        finally {

            setLoading(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | LOAD AMENITIES
    |--------------------------------------------------------------------------
    */

    const loadAmenities = async () => {

        setAmenitiesLoading(true);

        try {

            const response = await fetch(
                `${API_BASE}/amenities.php?property_id=${propertyId}`,
                {
                    credentials: "include"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Amenities API failed"
                );

            }


            const data =
                await response.json();


            console.log(
                "AMENITIES DATA:",
                data
            );


            if (
                data.success &&
                Array.isArray(data.amenities)
            ) {

                setAmenities(
                    data.amenities
                );

            }

            else {

                setAmenities([]);

            }

        }

        catch (error) {

            console.error(
                "Amenities Error:",
                error
            );

            setAmenities([]);

        }

        finally {

            setAmenitiesLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD DATA WHEN PROPERTY CHANGES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadProperty();

        loadAmenities();

    }, [propertyId]);


    /*
    |--------------------------------------------------------------------------
    | SHORTLIST
    |--------------------------------------------------------------------------
    */

    const handleShortlist = async () => {

        await onShortlist(propertyId);

    };


    /*
    |--------------------------------------------------------------------------
    | AMENITY ICON
    |--------------------------------------------------------------------------
    */

    const getAmenityIcon = (name) => {

        const lowerName =
            name.toLowerCase();


        if (lowerName.includes("wifi")) {
            return "📶";
        }

        if (lowerName.includes("internet")) {
            return "🌐";
        }

        if (lowerName.includes("ac")) {
            return "❄️";
        }

        if (lowerName.includes("food")) {
            return "🍛";
        }

        if (lowerName.includes("laundry")) {
            return "🧺";
        }

        if (lowerName.includes("cctv")) {
            return "📹";
        }

        if (lowerName.includes("security")) {
            return "🔐";
        }

        if (lowerName.includes("furnished")) {
            return "🛏️";
        }

        if (lowerName.includes("parking")) {
            return "🚗";
        }

        if (lowerName.includes("power")) {
            return "⚡";
        }

        if (lowerName.includes("water")) {
            return "💧";
        }

        if (lowerName.includes("gym")) {
            return "🏋️";
        }

        return "✓";

    };


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="details-page">

                <div className="details-topbar">

                    <button
                        className="back-button"
                        onClick={onBack}
                    >
                        ← Back to Properties
                    </button>

                </div>


                <div className="details-message">

                    <div className="spinner"></div>

                    <h2>
                        Loading property...
                    </h2>

                    <p>
                        Please wait while we load
                        the property details.
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div className="details-page">

                <div className="details-topbar">

                    <button
                        className="back-button"
                        onClick={onBack}
                    >
                        ← Back to Properties
                    </button>

                </div>


                <div className="details-message error-message">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>


                    <div className="error-actions">

                        <button
                            className="retry-button"
                            onClick={() => {
                                loadProperty();
                                loadAmenities();
                            }}
                        >
                            Try Again
                        </button>


                        <button
                            className="secondary-button"
                            onClick={onBack}
                        >
                            Back to Properties
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | PROPERTY NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!property) {

        return (

            <div className="details-page">

                <div className="details-topbar">

                    <button
                        className="back-button"
                        onClick={onBack}
                    >
                        ← Back to Properties
                    </button>

                </div>


                <div className="details-message">

                    <h2>
                        Property not found
                    </h2>

                    <p>
                        The accommodation you're looking
                        for could not be found.
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | MAIN PROPERTY DETAILS
    |--------------------------------------------------------------------------
    */

    return (

        <div className="details-page">


            {/* TOP BAR */}

            <div className="details-topbar">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back to Properties
                </button>

            </div>


            {/* MAIN CONTAINER */}

            <main className="details-container">

                <div className="details-card">


                    {/* PROPERTY IMAGE */}

                    <div className="details-image-wrapper">

                        <img
                            className="details-main-image"
                            src={
                                `${IMAGE_BASE}${property.image}`
                            }
                            alt={property.name}
                            onError={(e) => {

                                e.currentTarget.style.display =
                                    "none";

                            }}
                        />


                        <span className="details-gender">

                            {property.gender}

                        </span>

                    </div>


                    {/* CONTENT */}

                    <div className="details-content">


                        {/* HEADING */}

                        <div className="details-heading">

                            <div>

                                <h1>
                                    {property.name}
                                </h1>


                                <p className="details-location">

                                    📍 {property.city}

                                </p>

                            </div>


                            <div className="details-rating">

                                ⭐ {property.rating}

                            </div>

                        </div>


                        {/* PRICE */}

                        <div className="details-price">

                            <span className="price-amount">

                                ₹{property.price}

                            </span>


                            <span className="price-period">

                                / month

                            </span>

                        </div>


                        <div className="details-divider"></div>


                        {/* DESCRIPTION */}

                        <section className="details-section">

                            <h2>
                                About this property
                            </h2>


                            <p>

                                {property.description ||
                                    "A comfortable and convenient student accommodation option."}

                            </p>

                        </section>


                        {/* AMENITIES */}

                        <section className="details-section">

                            <h2>
                                Amenities
                            </h2>


                            {amenitiesLoading ? (

                                <div className="amenities-loading">

                                    Loading amenities...

                                </div>

                            ) : amenities.length === 0 ? (

                                <div className="amenities-empty">

                                    No amenities information
                                    available for this property.

                                </div>

                            ) : (

                                <div className="amenities-grid">

                                    {amenities.map(
                                        (amenity) => (

                                            <div
                                                className="amenity"
                                                key={
                                                    amenity.id
                                                }
                                            >

                                                <span className="amenity-icon">

                                                    {getAmenityIcon(
                                                        amenity.name
                                                    )}

                                                </span>


                                                <div>

                                                    <strong>

                                                        {
                                                            amenity.name
                                                        }

                                                    </strong>


                                                    <small>

                                                        Available
                                                        at this
                                                        property

                                                    </small>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </section>


                        {/* ACTION */}

                        <div className="details-actions">

                            <button
                                className={
                                    isShortlisted
                                        ? "details-shortlist-button active"
                                        : "details-shortlist-button"
                                }
                                onClick={
                                    handleShortlist
                                }
                            >

                                {isShortlisted
                                    ? "♥ Shortlisted"
                                    : "♡ Add to Shortlist"}

                            </button>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default PropertyDetails;