
import { useEffect, useState } from "react";
import "../App.css";

function Shortlist({ onBack, onViewDetails }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [removingIds, setRemovingIds] = useState([]);

    const API_BASE =
        "http://localhost/student-accommodation/api";

    const IMAGE_BASE =
        "http://localhost/student-accommodation/assets/images/";

    // Load shortlisted properties
    const loadShortlist = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_BASE}/shortlist.php`,
                { credentials: "include" }
            );

            if (!response.ok) {
                throw new Error("Failed to connect to PHP API");
            }

            const data = await response.json();

            if (data.success) {
                setProperties(data.properties || []);
            } else {
                setError(
                    data.message ||
                    "Could not load shortlisted properties."
                );
            }
        } catch (err) {
            console.error("SHORTLIST ERROR:", err);
            setError("Could not connect to the PHP API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadShortlist();
    }, []);

    // Remove property from shortlist
    const removeFromShortlist = async (propertyId) => {
        if (removingIds.includes(Number(propertyId))) return;

        setRemovingIds((previous) => [
            ...previous,
            Number(propertyId)
        ]);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("property_id", propertyId);

            const response = await fetch(
                `${API_BASE}/interest.php`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (data.success && data.status === "removed") {
                setProperties((previous) =>
                    previous.filter(
                        (property) =>
                            Number(property.id) !==
                            Number(propertyId)
                    )
                );

                setMessage("Removed from shortlist.");
            } else {
                setMessage(
                    data.message ||
                    "Could not remove property."
                );
            }
        } catch (err) {
            console.error("REMOVE ERROR:", err);
            setMessage("Could not connect to the server.");
        } finally {
            setRemovingIds((previous) =>
                previous.filter(
                    (id) => id !== Number(propertyId)
                )
            );
        }
    };

    if (loading) {
        return (
            <div className="app">
                <div className="container">
                    <h2 className="message">
                        Loading your shortlist...
                    </h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app">
                <div className="container">
                    <button
                        type="button"
                        className="back-button"
                        onClick={onBack}
                    >
                        ← Back to Properties
                    </button>

                    <h2>{error}</h2>

                    <button
                        type="button"
                        className="view-button"
                        onClick={loadShortlist}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="header">
                <h1>❤️ My Shortlist</h1>
                <p>Your saved student accommodations</p>
            </header>

            <main className="container shortlist-page">
                <button
                    type="button"
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back to Properties
                </button>

                {message && (
                    <p
                        className="shortlist-message"
                        role="status"
                    >
                        {message}
                    </p>
                )}

                <h2 className="shortlist-heading">
                    My Shortlisted PGs
                </h2>

                <p className="subtitle">
                    Properties you've saved for later.
                </p>

                {properties.length === 0 ? (
                    <div className="empty">
                        <h2>❤️ No shortlisted properties</h2>

                        <p>
                            Start exploring PGs and add
                            your favourites.
                        </p>

                        <button
                            type="button"
                            className="view-button"
                            onClick={onBack}
                        >
                            Explore Properties
                        </button>
                    </div>
                ) : (
                    <div className="property-grid">
                        {properties.map((property) => {
                            const id = Number(property.id);
                            const isRemoving =
                                removingIds.includes(id);

                            return (
                                <div
                                    className="property-card"
                                    key={id}
                                >
                                    <div className="property-image">
                                        <img
                                            src={`${IMAGE_BASE}${property.image}`}
                                            alt={property.name}
                                        />
                                    </div>

                                    <div className="property-content">
                                        <h2>{property.name}</h2>

                                        <p>📍 {property.city}</p>

                                        <p>⭐ {property.rating}</p>

                                        <h3>
                                            ₹{property.price} / month
                                        </h3>

                                        <span className="gender">
                                            {property.gender}
                                        </span>

                                        <p className="description">
                                            {property.description}
                                        </p>

                                        <div className="card-buttons shortlist-card-buttons">
                                            <button
                                                type="button"
                                                className="view-button"
                                                onClick={() =>
                                                    onViewDetails(id)
                                                }
                                            >
                                                View Details
                                            </button>

                                            <button
                                                type="button"
                                                className="shortlist-remove-button"
                                                onClick={() =>
                                                    removeFromShortlist(id)
                                                }
                                                disabled={isRemoving}
                                            >
                                                {isRemoving
                                                    ? "Removing..."
                                                    : "♥ Remove"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Shortlist;
