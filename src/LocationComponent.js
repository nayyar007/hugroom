import React, { useState } from "react";

const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setIsLoading(false);
        },
        (error) => {
          let errorMessage = "Error getting location: ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please allow location access to use this feature.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "The request to get user location timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
          }
          setError(errorMessage);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Location Access</h2>

      {!location && !error && !isLoading && (
        <button onClick={getLocation} style={styles.button}>
          Allow Location Access
        </button>
      )}

      {isLoading && <p style={styles.message}>Getting your location...</p>}

      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={getLocation} style={styles.button}>
            Try Again
          </button>
        </div>
      )}

      {location && (
        <div style={styles.locationInfo}>
          <h3>Your Location:</h3>
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>
          <p>
            <strong>Accuracy:</strong> {location.accuracy} meters
          </p>
          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mapLink}
          >
            View on Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#333",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  message: {
    color: "#666",
    fontStyle: "italic",
  },
  error: {
    color: "#d32f2f",
    padding: "10px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
    margin: "10px 0",
  },
  locationInfo: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  mapLink: {
    display: "inline-block",
    marginTop: "10px",
    color: "#2196F3",
    textDecoration: "none",
  },
};

export default LocationComponent;
