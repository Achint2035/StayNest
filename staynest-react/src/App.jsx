
import { useEffect, useState } from "react";
import "./App.css";
import PropertyDetails from "./PropertyDetails";
import Shortlist from "./react/shortlist";

const API_BASE = "http://localhost/student-accommodation/api";
const IMAGE_BASE =
  "http://localhost/student-accommodation/assets/images/";
const LOGIN_URL = "http://localhost/student-accommodation/login.php";
const LOGOUT_URL = "http://localhost/student-accommodation/logout.php";
const SIGNUP_URL = "http://localhost/student-accommodation/signup.php";

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showShortlist, setShowShortlist] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [shortlistedIds, setShortlistedIds] = useState([]);
  const [updatingShortlist, setUpdatingShortlist] = useState([]);

  // Check the current login session.
  const checkSession = async () => {
    try {
      const response = await fetch(`${API_BASE}/session.php`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to check login session");
      }

      const data = await response.json();

      if (data.success && data.loggedIn) {
        setLoggedIn(true);
        setUser(data.user);
        return true;
      }

      setLoggedIn(false);
      setUser(null);
      setShortlistedIds([]);
      return false;
    } catch (err) {
      console.error("Session error:", err);
      setLoggedIn(false);
      setUser(null);
      setShortlistedIds([]);
      return false;
    }
  };

  // Load all properties.
  const loadProperties = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/properties.php`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to connect to the properties API");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Unable to load properties");
      }

      setProperties(data.properties || []);
    } catch (err) {
      console.error("Properties error:", err);
      setError(err.message || "Could not connect to the PHP API.");
    } finally {
      setLoading(false);
    }
  };

  // Load shortlisted property IDs from the backend.
  const loadShortlistIds = async () => {
    try {
      const response = await fetch(`${API_BASE}/shortlist.php`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load your shortlist");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Unable to load shortlist");
      }

      const ids = (data.properties || []).map((property) =>
        Number(property.id)
      );

      setShortlistedIds(ids);
    } catch (err) {
      console.error("Shortlist loading error:", err);
    }
  };

  // Search and filter properties.
  const searchProperties = async (
    selectedCity = city,
    selectedBudget = budget,
    selectedGender = gender
  ) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("city", selectedCity);
      formData.append("budget", selectedBudget);
      formData.append("gender", selectedGender);

      const response = await fetch(`${API_BASE}/filter.php`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Filter API request failed");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Could not filter properties");
      }

      setProperties(data.properties || []);
    } catch (err) {
      console.error("Filter error:", err);
      setError(err.message || "Could not connect to the PHP API.");
    } finally {
      setLoading(false);
    }
  };

  // Reset all search filters.
  const resetFilters = () => {
    setCity("");
    setBudget("");
    setGender("");
    loadProperties();
  };

  // Toggle a property in the shortlist.
  const handleShortlist = async (propertyId) => {
    if (!loggedIn) {
      alert("Please login first to manage your shortlist.");
      window.location.href = LOGIN_URL;
      return;
    }

    const id = Number(propertyId);

    if (!Number.isFinite(id) || id <= 0) {
      alert("Invalid property selected.");
      return;
    }

    if (updatingShortlist.includes(id)) {
      return;
    }

    // Remember the previous state in case the API request fails.
    const wasShortlisted = shortlistedIds.includes(id);

    setUpdatingShortlist((previous) => [...previous, id]);

    // Update the button immediately.
    setShortlistedIds((previous) =>
      wasShortlisted
        ? previous.filter((item) => Number(item) !== id)
        : previous.includes(id)
          ? previous
          : [...previous, id]
    );

    try {
      const formData = new FormData();
      formData.append("property_id", String(id));

      const response = await fetch(`${API_BASE}/interest.php`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update shortlist.");
      }

      // Verify that the backend performed the expected operation.
      const expectedStatus = wasShortlisted ? "removed" : "added";

      if (data.status !== expectedStatus) {
        throw new Error(
          data.message || "The server returned an unexpected shortlist status."
        );
      }

      console.log(
        `Property ${id} successfully ${expectedStatus} from shortlist.`
      );
    } catch (err) {
      console.error("Shortlist update error:", err);

      // Restore the previous button state if the request failed.
      setShortlistedIds((previous) =>
        wasShortlisted
          ? previous.includes(id)
            ? previous
            : [...previous, id]
          : previous.filter((item) => Number(item) !== id)
      );

      alert(err.message || "Could not update your shortlist. Please try again.");
    } finally {
      setUpdatingShortlist((previous) =>
        previous.filter((item) => item !== id)
      );
    }
  };

  // Open property details.
  const handleViewDetails = (propertyId) => {
    setSelectedProperty(Number(propertyId));
    setShowShortlist(false);
  };

  // Open the shortlist page.
  const openShortlist = () => {
    if (!loggedIn) {
      alert("Please login first to view your shortlist.");
      window.location.href = LOGIN_URL;
      return;
    }

    setShowShortlist(true);
    setSelectedProperty(null);
  };

  // Initialize the application.
  useEffect(() => {
    const initializeApp = async () => {
      await loadProperties();

      const isLoggedIn = await checkSession();

      if (isLoggedIn) {
        await loadShortlistIds();
      }
    };

    initializeApp();
  }, []);

  // Property details page.
  if (selectedProperty !== null) {
    return (
      <PropertyDetails
        propertyId={selectedProperty}
        onBack={() => setSelectedProperty(null)}
        onShortlist={handleShortlist}
        isShortlisted={shortlistedIds.includes(Number(selectedProperty))}
      />
    );
  }

  // Shortlist page.
  if (showShortlist) {
    return (
      <Shortlist
        onBack={() => setShowShortlist(false)}
        onViewDetails={handleViewDetails}
      />
    );
  }

  // Main website.
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-title">
              🏠 <span>StayNest</span>
            </div>
            <p>Find your perfect student accommodation</p>
          </div>

          <div className="header-actions">
            {loggedIn && user ? (
              <>
                <div className="welcome">Welcome, {user.name}</div>

                <button className="header-button" onClick={openShortlist}>
                  ❤️ Shortlist
                </button>

                <button
                  className="header-button logout-button"
                  onClick={() => {
                    window.location.href = LOGOUT_URL;
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="header-button"
                  onClick={() => {
                    window.location.href = LOGIN_URL;
                  }}
                >
                  Login
                </button>

                <button
                  className="header-button signup-button"
                  onClick={() => {
                    window.location.href = SIGNUP_URL;
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect PG</h1>
          <p>
            Search student accommodation by city, budget and gender.
          </p>

          <div className="search-box">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">All Cities</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>

            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value="">Any Budget</option>
              <option value="6000">Under ₹6,000</option>
              <option value="7000">Under ₹7,000</option>
              <option value="8000">Under ₹8,000</option>
              <option value="10000">Under ₹10,000</option>
            </select>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button
              className="search-button"
              onClick={() => searchProperties()}
            >
              Search
            </button>

            <button className="reset-button" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="cities-section">
        <div className="section-heading">
          <h2>Explore Major Cities</h2>
          <p>Find student accommodation in popular cities</p>
        </div>

        <div className="cities-grid">
          {[
            { name: "Lucknow", icon: "🏛️" },
            { name: "Delhi", icon: "🏙️" },
            { name: "Mumbai", icon: "🌆" },
            { name: "Bangalore", icon: "🏢" },
            { name: "Hyderabad", icon: "🏙️" },
          ].map((item) => (
            <button
              className="city-card"
              key={item.name}
              onClick={() => {
                setCity(item.name);
                setBudget("");
                setGender("");
                searchProperties(item.name, "", "");
              }}
            >
              <div className="city-icon">{item.icon}</div>
              <h3>{item.name}</h3>
              <span>Explore PGs →</span>
            </button>
          ))}
        </div>
      </section>

      <section className="properties-section">
        <div className="section-heading">
          <h2>Available PGs</h2>
          <p>{properties.length} properties found</p>
        </div>

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button onClick={loadProperties}>Try Again</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="empty-properties">
            <h3>No properties found</h3>
            <p>Try changing your filters.</p>
            <button
              onClick={resetFilters}
              className="search-button"
            >
              Show All Properties
            </button>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property) => {
              const id = Number(property.id);
              const isShortlisted = shortlistedIds.includes(id);
              const isUpdating = updatingShortlist.includes(id);

              return (
                <div className="property-card" key={property.id}>
                  <div className="property-image">
                    <img
                      src={`${IMAGE_BASE}${property.image}`}
                      alt={property.name}
                    />
                    <span className="property-gender">
                      {property.gender}
                    </span>
                  </div>

                  <div className="property-content">
                    <h3>{property.name}</h3>
                    <p className="property-location">
                      📍 {property.city}
                    </p>
                    <p className="property-rating">
                      ⭐ {property.rating}
                    </p>

                    <div className="price">
                      ₹{Number(property.price).toLocaleString("en-IN")}
                      <span> / month</span>
                    </div>

                    <p className="description">
                      {property.description}
                    </p>

                    <div className="card-buttons">
                      <button
                        type="button"
                        className="details-button"
                        onClick={() => handleViewDetails(id)}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        className={`heart-button${isShortlisted ? " active" : ""}`}
                        onClick={() => handleShortlist(id)}
                        disabled={isUpdating}
                        aria-label={
                          isShortlisted
                            ? "Remove from shortlist"
                            : "Add to shortlist"
                        }
                        aria-pressed={isShortlisted}
                        title={
                          isShortlisted
                            ? "Remove from shortlist"
                            : "Add to shortlist"
                        }
                      >
                        {isUpdating ? "…" : isShortlisted ? "♥" : "♡"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="footer">
        <div className="footer-brand">🏠 StayNest</div>
        <p>
          Making student accommodation search easier and smarter.
        </p>
        <p className="copyright">
          © 2026 StayNest. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
