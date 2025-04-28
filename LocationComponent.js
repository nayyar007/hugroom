import React, { useState, useEffect } from "react";

const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInRegion, setIsInRegion] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Target coordinates
  const targetLat = 30.903825140141603;
  const targetLng = 75.90097405628944;
  const radius = 20; // meters

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const checkRegion = (currentLat, currentLng) => {
    const distance = calculateDistance(
      currentLat,
      currentLng,
      targetLat,
      targetLng
    );
    setIsInRegion(distance <= radius);
    return distance;
  };

  const getLocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLat = position.coords.latitude;
          const currentLng = position.coords.longitude;
          const distance = checkRegion(currentLat, currentLng);

          setLocation({
            latitude: currentLat,
            longitude: currentLng,
            accuracy: position.coords.accuracy,
            distance: distance,
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
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  const handleImageCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Location Check</h2>

      {!location && !error && !isLoading && (
        <button onClick={getLocation} style={styles.button}>
          Check My Location
        </button>
      )}

      {isLoading && (
        <p style={styles.message}>
          Getting your location with high accuracy...
        </p>
      )}

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
          <p>
            <strong>Distance from Target:</strong>{" "}
            {location.distance.toFixed(2)} meters
          </p>

          <div style={isInRegion ? styles.insideRegion : styles.outsideRegion}>
            <h3>{isInRegion ? "Inside Region ✅" : "Outside Region ❌"}</h3>
            <p>
              Target Region: 20 meters radius from ({targetLat}, {targetLng})
            </p>
          </div>

          {location.accuracy > 10 && (
            <p style={styles.warning}>
              Note: For better accuracy, try moving to an open area with clear
              sky view.
            </p>
          )}

          <div style={styles.buttonContainer}>
            <div style={styles.cameraInput}>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                style={styles.fileInput}
                id="cameraInput"
              />
              <label htmlFor="cameraInput" style={styles.cameraButton}>
                Take Photo
              </label>
            </div>
            <a
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mapLink}
            >
              View on Google Maps
            </a>
          </div>

          {capturedImage && (
            <div style={styles.imageContainer}>
              <img
                src={capturedImage}
                alt="Captured"
                style={styles.capturedImage}
              />
              <button
                onClick={() => setCapturedImage(null)}
                style={styles.closeButton}
              >
                Remove Photo
              </button>
            </div>
          )}
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
    marginRight: "10px",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
    flexWrap: "wrap",
    gap: "10px",
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
  insideRegion: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#e8f5e9",
    borderRadius: "4px",
    color: "#2e7d32",
  },
  outsideRegion: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
    color: "#c62828",
  },
  mapLink: {
    display: "inline-block",
    color: "#2196F3",
    textDecoration: "none",
  },
  warning: {
    color: "#f57c00",
    fontStyle: "italic",
    marginTop: "10px",
  },
  cameraInput: {
    position: "relative",
  },
  fileInput: {
    display: "none",
  },
  cameraButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    display: "inline-block",
  },
  imageContainer: {
    marginTop: "20px",
    position: "relative",
  },
  capturedImage: {
    width: "100%",
    maxWidth: "100%",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "8px 16px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default LocationComponent;
